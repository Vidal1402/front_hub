# Prompt: Backend — Disponibilizar conteúdo por cliente (admin)

## Objetivo

Implementar no backend **admin** a capacidade de **criar e listar** relatórios, materiais (pastas e arquivos), reuniões e chamados **vinculados a um cliente** (`cliente_uuid`). Assim, a partir do painel admin, é possível “disponibilizar” esse conteúdo para cada cliente; o cliente verá apenas o que tiver seu `cliente_uuid` nas rotas já existentes em `/api/cliente/*`.

---

## 1. Relatórios

### Domain (já existe)

- `domain.Relatorio`: UUID, ClienteUUID, Titulo, Tipo, Periodo, OwnerUUID, Data, Paginas, FileURL, CreatedAt, UpdatedAt.

### Repositório

- **Adicionar** em `RelatorioRepository`:  
  `Create(ctx context.Context, r *domain.Relatorio) error`
- **Implementar** em `MongoRelatorioRepository`: InsertOne na collection `relatorios`, setar `CreatedAt`/`UpdatedAt` se zero.
- **Adicionar** tags `json` em todos os campos de `domain.Relatorio` para respostas da API (ex.: `json:"uuid"`, `json:"cliente_uuid"`, etc.).

### Admin Service

- **Adicionar** `CreateRelatorio(ctx context.Context, input map[string]any) (any, error)`:
  - Extrair do `input`: `cliente_uuid`, `titulo`, `tipo`, `periodo`, `file_url` (opcional), `paginas` (opcional).
  - Gerar UUID, montar `domain.Relatorio`, chamar `relatorios.Create(ctx, r)`.
  - Retornar o relatório criado (para 201 com body).
- `ListRelatoriosAdmin` já existe; garantir que retorna itens com campos em minúsculas (json tags no domain).

### Admin HTTP

- **Adicionar** rota:  
  `POST /api/admin/relatorios`  
  - Body JSON: `{ "cliente_uuid": "uuid", "titulo": "...", "tipo": "Mensal"|"Campanha"|..., "periodo": "...", "file_url": "https://...", "paginas": 0 }`.
  - Handler: decode body (map ou struct), chamar `svc.CreateRelatorio`, responder 201 com o relatório criado.

---

## 2. Materiais (pastas e arquivos)

### Domain (já existe)

- `MaterialPasta`: UUID, ClienteUUID, **ParentUUID** (opcional, para subpastas), Nome, Icone, CreatedAt, UpdatedAt.
- `MaterialArquivo`: UUID, ClienteUUID, PastaUUID, Nome, Extensao, Tamanho, Data, URL, CreatedAt, UpdatedAt.

### Repositório

- **Adicionar** em `MaterialRepository`:  
  `CreatePasta(ctx context.Context, p *domain.MaterialPasta) error`
- **Implementar** em `MongoMaterialRepository`: InsertOne na collection `materiais_pastas`, setar CreatedAt/UpdatedAt.
- `CreateArquivo` já existe.
- **Adicionar** tags `json` em todos os campos de `domain.MaterialPasta` e `domain.MaterialArquivo`.

### Admin Service

- **Adicionar** `CreateMaterialPasta(ctx context.Context, input map[string]any) (any, error)`:
  - Extrair: `cliente_uuid`, `parent_uuid` (opcional; se presente, a pasta é subpasta dessa pasta), `nome`, `icone` (opcional).
  - Gerar UUID, montar `domain.MaterialPasta`, chamar `materiais.CreatePasta(ctx, p)`.
  - Retornar a pasta criada.
- **Adicionar** `CreateMaterialArquivo(ctx context.Context, input map[string]any) (any, error)`:
  - Extrair: `cliente_uuid`, `pasta_uuid`, `nome`, `url`, `extensao` (opcional), `tamanho` (opcional).
  - Gerar UUID, montar `domain.MaterialArquivo`, chamar `materiais.CreateArquivo(ctx, a)`.
  - Retornar o arquivo criado.
- **Adicionar** (opcional) `ListPastasAdmin(ctx, page)` e `ListArquivosAdmin(ctx, page)` para o admin listar tudo, ou continuar listando por cliente via parâmetro.

### Admin HTTP

- **Adicionar** rotas:
  - `POST /api/admin/materiais/pastas` — Body: `{ "cliente_uuid": "uuid", "parent_uuid": "uuid" (opcional), "nome": "...", "icone": "" }` → 201 com pasta criada.
  - `POST /api/admin/materiais/arquivos` — Body: `{ "cliente_uuid": "uuid", "pasta_uuid": "uuid", "nome": "...", "url": "https://...", "extensao": "pdf", "tamanho": 0 }` → 201 com arquivo criado.
  - `GET /api/admin/materiais/pastas?cliente_uuid=xxx` e `GET /api/admin/materiais/arquivos?cliente_uuid=xxx` para listar por cliente. Na listagem de pastas, incluir campo `parent_uuid` (ou `pasta_pai`) em cada item para o front montar a árvore e permitir entrar em pastas/subpastas.
- **Arquivar (implementado):** **PATCH** `/api/admin/materiais/pastas/{id}` e **PATCH** `/api/admin/materiais/arquivos/{id}` com body `{ "archived": true }`. Domain: `MaterialPasta` e `MaterialArquivo` com campo `Archived bool`. Repository: `GetPastaByUUID`/`UpdatePasta`, `GetArquivoByUUID`/`UpdateArquivo`. Ver `BACKEND_IMPLEMENTADO_ROTAS.md`.

---

## 3. Reuniões

### Domain (já existe)

- `domain.Reuniao`: UUID, ClienteUUID, Titulo, DataHora, Via, OwnerUUID, Pauta []string, Status, DuracaoMin, TemGravacao, TemAta, CreatedAt, UpdatedAt.

### Repositório

- **Adicionar** em `ReuniaoRepository`:  
  `Create(ctx context.Context, r *domain.Reuniao) error`
- **Implementar** em `MongoReuniaoRepository`: InsertOne na collection `reunioes`, setar CreatedAt/UpdatedAt e DataHora se zero.
- **Adicionar** tags `json` em todos os campos de `domain.Reuniao`.

### Admin Service

- **Adicionar** `CreateReuniao(ctx context.Context, input map[string]any) (any, error)`:
  - Extrair: `cliente_uuid`, `titulo`, `data_hora` (string ISO ou "YYYY-MM-DDTHH:mm:ss"), `via` (ex.: "Google Meet"), `duracao_min`, `pauta` (array de strings ou string com quebras de linha).
  - Gerar UUID, montar `domain.Reuniao`, definir status "futura" ou "historico" conforme data.
  - Chamar `reunioes.Create(ctx, r)`.
  - Retornar a reunião criada.
- **Adicionar** (opcional) `ListReunioesAdmin(ctx, page)` para listar todas no admin.

### Admin HTTP

- **Adicionar** rota:  
  `POST /api/admin/reunioes`  
  - Body: `{ "cliente_uuid": "uuid", "titulo": "...", "data_hora": "2025-04-01T14:00:00", "via": "Google Meet", "duracao_min": 60, "pauta": ["Item 1","Item 2"] }`  
  - Resposta: 201 com a reunião criada.
- (Opcional) `GET /api/admin/reunioes?limit=50&offset=0` para listar todas.

---

## 4. Chamados

### Domain e repositório

- `domain.Chamado`: UUID, ClienteUUID, Categoria, Titulo, Status, CriadoEm, AtualizadoEm, Descricao.
- `ChamadoRepository.Create` já existe.

### Admin Service

- **Adicionar** `CreateChamado(ctx context.Context, input map[string]any) (any, error)`:
  - Extrair: `cliente_uuid`, `titulo`, `descricao`, `categoria` (opcional).
  - Gerar UUID, montar `domain.Chamado`, status inicial "aberto", chamar `chamados.Create(ctx, c)`.
  - Retornar o chamado criado.
- **Adicionar** `ListChamadosAdmin(ctx, page)` que lista todos os chamados (sem filtro por cliente), para o admin ver todos.
- **Adicionar** tags `json` em todos os campos de `domain.Chamado`.

### Admin HTTP

- **Adicionar** rotas:
  - `POST /api/admin/chamados` — Body: `{ "cliente_uuid": "uuid", "titulo": "...", "descricao": "...", "categoria": "Suporte" }` → 201 com chamado criado.
  - `GET /api/admin/chamados?limit=50&offset=0` — Lista todos os chamados (admin).

---

## 5. Resumo das rotas admin a implementar

O frontend (página **Disponibilizar**) já chama as rotas abaixo. Implemente-as para que a lista e os modais funcionem.

| Método | Rota | Descrição |
|--------|------|-----------|
| POST   | `/api/admin/relatorios` | Criar relatório para um cliente |
| GET    | `/api/admin/relatorios` | Já existe (ListRelatoriosAdmin). Manter. |
| POST   | `/api/admin/materiais/pastas` | Criar pasta de material para um cliente |
| POST   | `/api/admin/materiais/arquivos` | Criar arquivo (metadata + URL) para um cliente |
| POST   | `/api/admin/reunioes` | Agendar/criar reunião para um cliente |
| GET    | `/api/admin/reunioes?limit=&offset=` | Listar todas as reuniões (admin). **Necessário para a página Disponibilizar.** |
| POST   | `/api/admin/chamados` | Criar chamado para um cliente |
| GET    | `/api/admin/chamados?limit=&offset=` | Listar todos os chamados (admin). **Necessário para a página Disponibilizar.** |
| GET    | `/api/admin/materiais/pastas?cliente_uuid=` | (Opcional) Listar pastas por cliente no admin |

---

## 6. Formato de resposta

- Todas as respostas de criação devem retornar o recurso criado com campos em **minúsculas/snake_case** no JSON (ex.: `uuid`, `cliente_uuid`, `titulo`, `created_at`). Isso exige **tags `json`** nos structs de domain.
- Listagens paginadas já seguem o formato `{ "items": [...], "total": N, "limit": L, "offset": O }`.

---

## 7. Autenticação

- Todas as rotas acima estão sob o router **admin** (`/api/admin/*`) e devem exigir **JWT com role admin** (já aplicado pelo middleware existente).

Com isso, o admin poderá disponibilizar relatórios, materiais, reuniões e chamados por cliente, e o frontend (rotas `/api/cliente/relatorios`, `/api/cliente/materiais/*`, `/api/cliente/reunioes/*`, `/api/cliente/suporte/chamados`) continuará retornando apenas os itens do cliente logado, filtrados por `cliente_uuid` do token.
