# CORS no backend — Permitir localhost (front em dev)

## Entendendo o erro: `{"error":"missing token"}` + status 405

Quando o navegador mostra **405 (Method Not Allowed)** e o corpo da resposta é **`{"error":"missing token"}`**, em geral acontece o seguinte:

1. **Requisição preflight (OPTIONS)**  
   Antes de enviar um PATCH, POST ou PUT com headers customizados (`Authorization`, `Content-Type`), o navegador envia uma requisição **OPTIONS** para a mesma URL. Essa requisição **não inclui** o header `Authorization`.

2. **O que o backend faz hoje**  
   O backend trata o OPTIONS como uma requisição normal: passa pelo middleware de autenticação, não encontra token e responde com **401/403** (ou em alguns casos **405**) e corpo `{"error":"missing token"}`.

3. **Efeito**  
   O preflight “falha” e o navegador bloqueia o PATCH/POST. Na aba Network você vê o OPTIONS com status 405 (ou 401) e a mensagem `missing token`.

**O que o backend precisa fazer:**  
- Responder às requisições **OPTIONS** com status **204** (ou 200) e com os headers CORS (`Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers`), **sem** exigir token.  
- Ou seja: o middleware de auth deve **ignorar** o método OPTIONS (não validar token nesse método). Ver seção “Implementação no backend — OPTIONS sem token” mais abaixo.

---

## Problema

Quando o front roda em **http://localhost:5174** (ou 5173) e chama a API em **https://united-hub-3a6p.onrender.com**, o navegador envia uma requisição **preflight** (OPTIONS) antes do PATCH/POST. O backend precisa responder com os headers CORS corretos; caso contrário o browser bloqueia com:

```
Access to fetch at 'https://...' from origin 'http://localhost:5174' has been blocked by CORS policy:
Response to preflight request doesn't pass access control check:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

---

## O que o backend precisa fazer

### 1. Origens permitidas

Incluir **http://localhost:5174** e **http://localhost:5173** (e, se quiser, a URL do front em produção) na lista de origens permitidas.

Exemplos de origens que o backend deve aceitar:

- `http://localhost:5173`
- `http://localhost:5174`
- `http://127.0.0.1:5173`
- `http://127.0.0.1:5174`
- (opcional) a URL do front em produção, ex.: `https://seu-app.onrender.com`

### 2. Headers na resposta (incluindo preflight OPTIONS)

O servidor deve responder às requisições **OPTIONS** (preflight) e às requisições reais (GET, POST, PUT, PATCH, DELETE) com algo como:

```
Access-Control-Allow-Origin: http://localhost:5174
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

- **Access-Control-Allow-Origin:** deve ser exatamente a origem da requisição (ex.: `http://localhost:5174`) ou `*` (menos seguro; não usar se enviar `Authorization`).
- **Access-Control-Allow-Methods:** incluir pelo menos **PATCH** (e os outros que o front usa).
- **Access-Control-Allow-Headers:** incluir **Authorization** e **Content-Type**.

### 3. Requisição OPTIONS (preflight)

Para qualquer rota que receba PATCH/POST/PUT com headers customizados, o navegador envia primeiro um **OPTIONS** no mesmo path. O backend deve:

- Responder ao **OPTIONS** com status **204** (ou 200).
- Incluir os headers CORS na resposta do OPTIONS (como acima).

Não é obrigatório ter lógica de negócio no OPTIONS; basta responder com os headers e 204.

---

## Exemplo em Go (net/http ou Chi)

Se o backend for em **Go** (Chi, etc.), normalmente usa-se um middleware CORS. Exemplo com `github.com/rs/cors`:

```go
import "github.com/rs/cors"

// Origens permitidas (dev + produção)
origins := []string{
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "https://seu-front.onrender.com", // se tiver front em produção
}

c := cors.New(cors.Options{
    AllowedOrigins:   origins,
    AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
    AllowedHeaders:   []string{"Content-Type", "Authorization"},
    AllowCredentials: true, // se usar cookies; pode ser false se for só Bearer
})
handler := c.Handler(router)
// usar handler no servidor HTTP
```

Se não quiser usar o pacote `cors`, dá para implementar manualmente: no primeiro handler da pilha, se o método for OPTIONS, escrever os headers e retornar 204; em todos os responses, adicionar `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods` e `Access-Control-Allow-Headers` conforme acima.

---

## Rota que está falhando

A requisição que o navegador está bloqueando é:

- **Método:** PATCH  
- **URL:** `https://united-hub-3a6p.onrender.com/api/admin/producao/cards/6578ff4d-6e69-4eb0-98f9-203166ae4d26`  
- **Origem:** `http://localhost:5174`

Antes do PATCH, o browser envia **OPTIONS** para a mesma URL. O backend **precisa** responder a esse OPTIONS com os headers CORS e 204. Depois, a resposta do **PATCH** também deve incluir `Access-Control-Allow-Origin: http://localhost:5174` (e os outros headers necessários).

---

## 405 + "missing token" ao cadastrar conta a pagar

Se ao enviar **POST** para `/api/admin/financeiro/pagar` o servidor retorna **405** e corpo `{"error":"missing token"}`:

1. **OPTIONS (preflight)**  
   O navegador envia primeiro um **OPTIONS** para a mesma URL. O backend **não deve exigir token** no OPTIONS. Responder ao OPTIONS com **204** (ou 200) e headers CORS, **sem** validar Authorization. Se o middleware de auth rodar antes e retornar 405/401 com "missing token" para OPTIONS, o preflight falha e o POST nem chega a ser enviado.

2. **POST na rota**  
   A rota **POST** `/api/admin/financeiro/pagar` precisa existir e aceitar o body (ex.: `descricao`, `valor_centavos`, `vencimento`, `categoria`). Se o backend só tiver **GET** para `/financeiro/pagar`, o servidor retorna **405 Method Not Allowed**.

**Resumo:** Tratar OPTIONS sem auth; implementar **POST** `/api/admin/financeiro/pagar` com autenticação Bearer no request real.

---

## 404 + "missing token" ao arquivar pasta/arquivo

Se ao clicar em **Arquivar** (pasta ou arquivo) o front recebe **404** e corpo `{"error":"missing token"}`:

1. **Rotas PATCH**  
   O backend precisa ter as rotas **PATCH** `/api/admin/materiais/pastas/:id` e **PATCH** `/api/admin/materiais/arquivos/:id` registradas (body `{ "archived": true }`). Se essas rotas não existirem, o servidor pode devolver 404; em alguns setups o handler de 404 ou um middleware devolve `{"error":"missing token"}`.

2. **Preflight OPTIONS**  
   O navegador envia **OPTIONS** antes do PATCH. O backend deve responder ao OPTIONS nesses paths com **204** e headers CORS, **sem** exigir token (ex.: `SkipAuthForOPTIONS` antes do JWT).

**Resumo:** Registrar **PATCH** `/api/admin/materiais/pastas/{id}` e **PATCH** `/api/admin/materiais/arquivos/{id}`; garantir que OPTIONS nesses paths não exija token. Ver `BACKEND_IMPLEMENTADO_ROTAS.md`.

---

## Conferência: Arquivar pasta/arquivo (backend + front)

### Backend (já implementado)

1. **Rotas PATCH**  
   - `PATCH /api/admin/materiais/pastas/{id}` → UpdateMaterialPasta  
   - `PATCH /api/admin/materiais/arquivos/{id}` → UpdateMaterialArquivo  
   - O `{id}` é o **UUID** do recurso (ex.: `550e8400-e29b-41d4-a716-446655440000`). Sem barra no final.

2. **Preflight OPTIONS**  
   - `SkipAuthForOPTIONS` é o primeiro middleware em `/api/admin`: para método **OPTIONS** responde **204** e não chama auth.  
   - Handlers **OPTIONS** explícitos para os paths com PATCH:  
     `OPTIONS /api/admin/materiais/pastas/{id}` e  
     `OPTIONS /api/admin/materiais/arquivos/{id}`  
   - Assim o preflight não exige token e pode retornar 204 (headers CORS no middleware CORS do root).

3. **"missing token" = 401 no request real**  
   A mensagem "missing token" é a resposta **401** quando o **PATCH** (e não o OPTIONS) chega **sem** o header `Authorization`.

### Front (o que conferir)

- O **PATCH** está sendo enviado com **`Authorization: Bearer <token>`** (ex.: no `fetch`/axios).  
- A URL do PATCH é exatamente:  
  `https://<host>/api/admin/materiais/arquivos/<uuid-do-arquivo>`  
  (sem trailing slash, com o UUID real no lugar de `{id}`).  
- **Deploy:** se o backend no Render for versão antiga, as rotas PATCH e o tratamento de OPTIONS podem não estar lá. Fazer deploy da versão atual e testar de novo.

---

## Implementação no backend (Go) — OPTIONS sem token

Solução aplicada para que o preflight OPTIONS não exija token e o POST continue protegido.

### 1. Middleware `SkipAuthForOPTIONS` (ex.: `internal/http/middleware/auth.go`)

- Se o método for **OPTIONS**, responde **204 No Content** e **não chama** o próximo handler.
- Assim o preflight não passa por JWT nem por role.

### 2. `RequireJWT` e `RequireRole`

- Se o método for **OPTIONS**, apenas **repassam** para o próximo handler (sem validar token/role).
- Assim, mesmo que OPTIONS não seja tratado antes, não há 401 por "missing token".

### 3. Uso no router

- **SkipAuthForOPTIONS** é o **primeiro** middleware tanto em `/api/admin` quanto em `/api/cliente`.
- Fluxo para **OPTIONS**: CORS (adiciona os headers) → SkipAuthForOPTIONS → 204 e fim (não chega em JWT/role).
- Com isso, OPTIONS em qualquer rota (ex.: `/api/admin/financeiro/pagar`) recebe 204 e os headers CORS já configurados, sem validação de token.

### 4. POST e token

- **POST** `/api/admin/financeiro/pagar` (e demais rotas) continua registrado e exige **Bearer** no POST (não no OPTIONS).
- OPTIONS é tratado antes do auth; POST segue pelos middlewares normais e exige JWT + role admin.

### 5. Resumo

| Pedido | Comportamento |
|--------|----------------|
| **OPTIONS** em `/api/admin/*` ou `/api/cliente/*` | Resposta 204 com headers CORS, **sem** validar token. |
| **POST / GET / PUT / PATCH / DELETE** | Exigem `Authorization: Bearer <token>` como antes. |

Assim, o preflight deixa de retornar 401 "missing token" e o POST com token continua protegido.

---

## Resumo

1. Adicionar middleware (ou lógica) CORS no backend.
2. Permitir origens `http://localhost:5173` e `http://localhost:5174`.
3. Permitir métodos **GET, POST, PUT, PATCH, DELETE, OPTIONS** e headers **Content-Type, Authorization**.
4. Responder ao **OPTIONS** com 204 e os mesmos headers CORS.

Depois de publicar essa alteração no Render, o front em **http://localhost:5174** deve conseguir chamar a API (incluindo PATCH em `/api/admin/producao/cards/:id`) sem erro de CORS.
