# performance_channels — Guia completo

Documentação de como o backend expõe e o front consome os dados de canais de performance (Meta Ads, Google Ads, etc.).

---

## Índice

1. [Visão geral](#visão-geral)
2. [Endpoint: GET /api/auth/me](#1-get-apiauthme)
3. [Endpoint: GET /api/cliente/config/perfil e /api/cliente/me](#2-get-apiclienteconfigperfil-e-get-apiclienteme)
4. [Resumo para o front](#resumo-para-o-front)
5. [Checklist: números não aparecem?](#checklist-números-não-aparecem)
6. [Conferência no backend (já implementado)](#conferência-no-backend-já-implementado)
7. [Frontend — aba Performance](#frontend--aba-performance)

---

## Visão geral

O backend expõe `performance_channels` em **duas** respostas. O front pode usar qualquer uma (ou as duas).

| Fonte | O que retorna |
|-------|----------------|
| `GET /api/auth/me` | Objeto do **usuário** (com `performance_channels` na raiz quando role = client) |
| `GET /api/cliente/config/perfil` ou `/api/cliente/me` | Objeto do **cliente** na raiz (inclui `performance_channels`) |

Em ambos os casos, **o campo está na raiz** da resposta — não dentro de `data`, `client` ou `cliente`.

---

## 1. GET /api/auth/me

### Autenticação

- **Header:** `Authorization: Bearer <JWT>`
- **Quem pode chamar:** cliente ou admin

### O que a API devolve

- Objeto do **usuário**.
- Para **role client**, o backend preenche `performance_channels` a partir do documento do cliente no MongoDB.

### Exemplo de resposta (usuário cliente)

```json
{
  "name": "cliente@email.com",
  "email": "cliente@email.com",
  "role": "client",
  "cliente_uuid": "uuid-do-cliente",
  "can_producao": true,
  "can_performance": true,
  "performance_channels": {
    "meta_ads": { "gasto": 1000, "leads": 50, "conversoes": 10 },
    "google_ads": { "gasto": 500, "leads": 20, "conversoes": 5 }
  }
}
```

### Onde ler no front

Na **raiz** da resposta:

- `response.performance_channels`
- ou `user.performance_channels` se você guardar o objeto como `user`

---

## 2. GET /api/cliente/config/perfil e GET /api/cliente/me

### Rotas

As duas rotas usam o **mesmo handler** e retornam o **cliente completo**:

- `GET /api/cliente/config/perfil`
- `GET /api/cliente/me`

### Autenticação

- **Header:** `Authorization: Bearer <JWT>`
- **Quem pode chamar:** apenas **cliente** (o `cliente_uuid` das claims do JWT identifica o cliente)

### O que a API devolve

O **corpo da resposta é o objeto do cliente na raiz**. Não vem dentro de `data`, `client` ou `cliente` — a resposta **é** o cliente.

### Exemplo de resposta

```json
{
  "uuid": "uuid-do-cliente",
  "nome": "Nome do Cliente",
  "email": "cliente@email.com",
  "segmento": "",
  "plano": "",
  "status": "ativo",
  "cidade": "",
  "owner_uuid": "",
  "performance_channels": {
    "meta_ads": { "gasto": 1000, "leads": 50, "conversoes": 10 },
    "google_ads": { "gasto": 500, "leads": 20, "conversoes": 5 }
  },
  "created_at": "...",
  "updated_at": "..."
}
```

### Onde ler no front

Na **raiz** da resposta:

- `response.performance_channels`

Não procurar em `data.client` ou `data.cliente` a menos que o front encapsule a resposta nessa estrutura.

---

## Resumo para o front

| Endpoint | Onde está `performance_channels` |
|----------|-----------------------------------|
| `GET /api/auth/me` | Na raiz do objeto usuário: `user.performance_channels` |
| `GET /api/cliente/config/perfil` | Na raiz do objeto cliente (o body é o cliente): `cliente.performance_channels` |
| `GET /api/cliente/me` | Idem: na raiz do objeto cliente: `cliente.performance_channels` |

---

## Checklist: números não aparecem?

Se os números não aparecem na aba Performance, conferir:

1. **Chamadas** — O front chama um desses endpoints após o login (ou ao abrir a aba)?
2. **Leitura na raiz** — O front lê o campo na raiz (`response.performance_channels`), e não em `data.client` ou similar?
3. **Dados salvos no admin** — Se o backend retornar `performance_channels: {}` ou omitir o campo, o admin ainda não salvou dados de canais para esse cliente. Salvar pelo painel admin: **PUT** `/api/admin/clientes/:id` com `performance_channels` no body.

---

## Conferência no backend (já implementado)

Resumo do que já está implementado no backend; nenhuma alteração adicional é necessária.

| Componente | Arquivo | Comportamento |
|------------|---------|----------------|
| **AuthService.Me()** | `internal/service/auth_service.go` | Para `role == client` e `cliente_uuid` preenchido, busca o documento do cliente e atribui `info.PerformanceChannels = cliente.PerformanceChannels` (inicializa `{}` se nil). |
| **ClienteService.GetPerfil()** | `internal/service/cliente_service.go` | Retorna o `*domain.Cliente` completo; o `domain.Cliente` tem o campo `PerformanceChannels` com tag `json:"performance_channels,omitempty"`. |
| **Handler GetPerfil** | `internal/http/handlers/cliente/handler.go` | Faz `response.JSON(w, http.StatusOK, result)` com o cliente; a resposta inclui `performance_channels` na raiz. |

---

## Frontend — aba Performance

### Arquivo e componente

- **Arquivo:** `src/pages/united-dashboard.jsx`
- **Componente:** `PerformancePage`

### Endpoints usados

1. **GET /api/cliente/config/perfil** — corpo = objeto do cliente; leitura na raiz: `response.performance_channels`
2. **GET /api/auth/me** — corpo = objeto do usuário; leitura na raiz: `response.performance_channels`

As duas respostas são obtidas em **paralelo** (`Promise.all`).

### Lógica de escolha do valor

O valor usado é o **primeiro não vazio** entre:

- `extractPc(perfilRes)` (resposta de config/perfil)
- `extractPc(authMeRes)` (resposta de auth/me)
- `extractPc(user)` (objeto `user` do AuthContext)

A função `extractPc(obj)` lê `obj.performance_channels` (e variantes em camelCase/PascalCase e caminhos aninhados como fallback).

### O que é exibido

Os números da aba (KPIs e bloco **"Dados por canal"**) vêm desse `performance_channels` normalizado:

- **Chaves de canal** (snake_case): `meta_ads`, `google_ads`, `organico`, `outros`
- **Campos por canal:** `gasto`, `leads`, `conversoes`
