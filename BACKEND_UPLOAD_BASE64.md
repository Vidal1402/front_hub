# Backend — Upload de arquivos via Base64 (sem ocupar BD)

## Objetivo

O frontend envia o arquivo em **base64** no body do `POST /api/admin/materiais/arquivos`. O backend deve:

1. **Receber** o campo `base64` (string) no JSON.
2. **Decodificar** e gravar o binário em **disco** (pasta `uploads/` ou similar), e **não** armazenar o conteúdo do arquivo no banco.
3. **Persistir no MongoDB** apenas os **metadados** do `MaterialArquivo`, com a **URL** ou **caminho** do arquivo em disco (ex.: `/uploads/{cliente_uuid}/{uuid}.pdf` ou URL absoluta se servir estático).

Assim o banco não fica pesado com arquivos; apenas a referência (path/URL) fica no documento.

---

## Body do POST (frontend)

O front envia um dos dois:

- **Com upload (base64):**  
  `{ "cliente_uuid": "...", "pasta_uuid": "...", "nome": "Contrato.pdf", "extensao": "pdf", "base64": "<string base64 do conteúdo>" }`
- **Sem upload (só URL):**  
  `{ "cliente_uuid": "...", "pasta_uuid": "...", "nome": "...", "url": "https://..." }`

Quando existir `base64`, o backend deve **ignorar** `url` para esse request e gerar o arquivo a partir do base64.

---

## Fluxo no backend

1. **Parse do body**  
   - Ler `cliente_uuid`, `pasta_uuid`, `nome`, `extensao`, `url`, `base64` (todos opcionais exceto `cliente_uuid` e `nome`).

2. **Se `base64` estiver presente:**
   - Decodificar: `data, err := base64.StdEncoding.DecodeString(base64)`.
   - Definir extensão para o arquivo: usar `extensao` do body ou extrair de `nome` (ex.: `Contrato.pdf` → `.pdf`). Sanitizar (apenas alfanuméricos, ex.: `pdf`, `docx`).
   - Gerar um **UUID** para o arquivo (ex.: `uuid.New().String()`).
   - Definir o **caminho em disco**, por exemplo:  
     `uploads/{cliente_uuid}/{uuid}.{ext}`  
     ou `uploads/materiais/{cliente_uuid}/{uuid}.{ext}`.  
     Criar a pasta por `cliente_uuid` se não existir (`os.MkdirAll`).
   - Escrever o binário no arquivo: `os.WriteFile(caminhoCompleto, data, 0644)`.
   - Definir a **URL** que o cliente usará para acessar o arquivo:
     - Se houver rota estática servindo `uploads/`: ex. `url = "/uploads/materiais/" + cliente_uuid + "/" + uuid + "." + ext`.
     - Ou URL absoluta se o servidor expuser esse path (ex.: `https://api.seudominio.com/uploads/...`).
   - **Não** colocar o conteúdo base64 nem o binário em nenhum campo do MongoDB.

3. **Se `base64` não estiver presente:**
   - Usar o campo `url` do body como está (link externo) e não gravar nada em disco.

4. **Montar o `MaterialArquivo`:**
   - UUID, ClienteUUID, PastaUUID, Nome, Extensao, Tamanho (len do binário, ou 0 se for só URL), Data (time.Now()), **URL** (path ou URL definido acima), CreatedAt, UpdatedAt.

5. **Persistir** apenas esse documento no MongoDB (collection de materiais/arquivos).

---

## Tamanho máximo

- O frontend limita a **10 MB** por arquivo. No backend, é recomendável validar o tamanho após decodificar o base64 (ex.: `len(data) <= 10*1024*1024`) e retornar **400** se ultrapassar.

---

## Servir arquivos estáticos (para o cliente baixar)

Para o link salvo em `MaterialArquivo.URL` funcionar (ex.: `/uploads/...`), o servidor precisa servir a pasta `uploads/` como estático, por exemplo:

- **Chi:** `r.Handle("/uploads/*", http.FileServer(http.Dir("./uploads")))`
- Ou prefixo: `r.Handle("/uploads/*", http.StripPrefix("/uploads/", http.FileServer(http.Dir("uploads"))))`

Assim, uma entrada com `url: "/uploads/abc-cliente-uuid/xyz-uuid.pdf"` será acessível em `GET https://api.../uploads/abc-cliente-uuid/xyz-uuid.pdf`.

---

## Resumo

- **Entrada:** body JSON com `base64` (e opcionalmente `nome`, `extensao`, `cliente_uuid`, `pasta_uuid`).
- **Processamento:** decodificar base64 → gravar em disco em `uploads/{cliente_uuid}/{uuid}.{ext}`.
- **Banco:** salvar só metadados + `url` (path ou URL do arquivo). **Não** guardar o conteúdo do arquivo no BD.
- **Limite:** 10 MB por arquivo (validar após decode).
- **Download:** servir a pasta `uploads/` como estático para o cliente acessar o arquivo pela URL salva.
