# Backend — Produção (Kanban) — Modelo 2

**Status:** implementado no backend. O front consome as rotas abaixo.

## Objetivo

Implementar o fluxo **Modelo 2**: o **cliente** abre solicitações que viram cards no Kanban; o **admin** vê o quadro por cliente, cria cards e **move** cards entre colunas. O cliente só visualiza o próprio quadro.

---

## Implementado no backend (resumo)

- **Domain** (`internal/domain/kanban.go`): `KanbanCard` com `ColumnID`, `Descricao`, `OwnerNome`, **Comments** (`[]KanbanCardComment`); `KanbanCardComment` com `Content` e `CreatedAt`; `KanbanColumn`; tags json em todos os campos.
- **Repositório**: `CreateCard`, `GetCardByUUID`, `UpdateCard` (MongoKanbanRepository).
- **Cliente:** GET `/api/cliente/producao` — 4 colunas fixas com cards; POST `/api/cliente/producao/solicitacoes` — cria card em backlog.
- **Admin:** GET `/api/admin/producao?cliente_uuid=xxx` (cards com `comments_list`: array de `{ content, created_at }` e `comments`: contador); POST `/api/admin/producao/cards`; **PATCH** `/api/admin/producao/cards/:id` — aceita `column_id`, `title`/`titulo`, `type`/`tipo`, `priority`/`prioridade`, `due`, `description`/`descricao`, e **`archived: true`** (todos opcionais, pelo menos um obrigatório). Cards com `Archived == true` são omitidos do quadro em GET cliente e GET admin. Resposta do card inclui `"archived": c.Archived`. Ver `BACKEND_IMPLEMENTADO_ROTAS.md`.
- **POST** `/api/admin/producao/cards/:id/comments` — body `{ "content" }`, responde 201 com `{ content, created_at }`.
- Cards antigos sem `comments` no MongoDB: `Comments` fica nil até o primeiro comentário.

---

## 1. Cliente — Ver quadro e abrir solicitação

### 1.1 GET `/api/cliente/producao`

- Autenticação: JWT de **cliente** (ou usuário com `role: client` e `cliente_uuid` no token/contexto).
- Retorno: quadro do cliente autenticado.
- Formato esperado pelo front:

```json
{
  "columns": [
    {
      "id": "backlog",
      "label": "Backlog",
      "dot": "#94A3B8",
      "cards": [
        {
          "id": "uuid-do-card",
          "title": "Título do card",
          "type": "Campanha",
          "priority": "Alta",
          "owner": "Nome do responsável",
          "due": "15/03",
          "comments": 0,
          "files": 0,
          "column_id": "backlog"
        }
      ]
    }
  ]
}
```

- Colunas sugeridas (podem ser fixas ou configuráveis): `backlog`, `doing`, `review`, `done` com labels "Backlog", "Em andamento", "Revisão", "Concluído".
- Cada card deve ter: `id`, `title` (ou `titulo` com tag json), `type` (ou `tipo`), `priority` (ou `prioridade`), `owner`, `due` (ou `prazo`), `comments`, `files`, `column_id`.

### 1.2 POST `/api/cliente/producao/solicitacoes`

- Autenticação: JWT de **cliente**.
- Body (JSON):

```json
{
  "titulo": "Criativos para campanha de verão",
  "tipo": "Criativo",
  "prioridade": "Média",
  "descricao": "Opcional"
}
```

- Tipos aceitos: `Campanha`, `Criativo`, `Vídeo`, `Landing Page`, `Automação`.
- Prioridades: `Baixa`, `Média`, `Alta`.
- Ação do backend: criar um **card** vinculado ao `cliente_uuid` do token, na coluna inicial (ex.: `backlog`). Retornar 201 e o card criado (ou pelo menos `{ id, title, column_id }`).
- O front chama em seguida GET `/api/cliente/producao` para atualizar a lista (ou o backend pode retornar o card no body e o front pode fazer merge local).

---

## 2. Admin — Ver quadro por cliente, criar e mover cards

### 2.1 GET `/api/admin/producao?cliente_uuid=xxx`

- Autenticação: JWT **admin**.
- Query: `cliente_uuid` (obrigatório) — UUID do cliente cujo quadro se quer ver.
- Retorno: mesmo formato de `GET /api/cliente/producao`, mas para o cliente indicado. Ou seja: `{ columns: [ { id, label, dot, cards: [...] } ] }`.

### 2.2 POST `/api/admin/producao/cards`

- Autenticação: JWT **admin**.
- Body (JSON):

```json
{
  "cliente_uuid": "uuid-do-cliente",
  "column_id": "backlog",
  "title": "Título do card",
  "type": "Campanha",
  "priority": "Média"
}
```

- Ação: criar um card para o cliente na coluna `column_id`. Retornar 201 e o card criado.

### 2.3 PATCH `/api/admin/producao/cards/:id`

- Autenticação: JWT **admin**.
- Body (JSON): `{ "column_id": "doing" }` para mover; ou para editar o card: `{ "title", "type", "priority", "due", "description" }` (todos opcionais). Pode aceitar os dois: mover e/ou editar campos.
- Ação: atualizar o card. Retornar 200 e o card atualizado.

### 2.4 POST `/api/admin/producao/cards/:id/comments` (opcional)

- Autenticação: JWT **admin**.
- Body (JSON): `{ "content": "Texto do comentário" }`.
- Ação: criar comentário no card. Retornar 201. Na listagem do quadro, o card pode incluir `comments: []` (array de `{ content, created_at }`) ou manter só o contador; o front usa o array para exibir no modal de detalhe.

---

## 3. Modelo de dados sugerido

- **kanban_column**: `id` (PK), `label`, `dot` (cor), `ordem` (opcional). Podem ser fixas (backlog, doing, review, done) por ambiente ou por cliente.
- **kanban_card**: `id` (PK, UUID), `cliente_uuid` (FK), `column_id` (FK), `title`, `type`, `priority`, `owner` (opcional, nome ou id do responsável), `due` (opcional), `comments` (opcional, contador), `files` (opcional, contador), `created_at`, `updated_at`. Origem: criado pelo admin ou pela solicitação do cliente (POST `/api/cliente/producao/solicitacoes`).

---

## 4. Resumo

| Quem    | Ação                | Rota                                      |
|---------|---------------------|-------------------------------------------|
| Cliente | Ver seu quadro      | GET `/api/cliente/producao`               |
| Cliente | Abrir solicitação   | POST `/api/cliente/producao/solicitacoes` |
| Admin   | Ver quadro cliente  | GET `/api/admin/producao?cliente_uuid=xxx`|
| Admin   | Criar card          | POST `/api/admin/producao/cards`          |
| Admin   | Mover card          | PATCH `/api/admin/producao/cards/:id` (body: `column_id`) |
| Admin   | Editar card         | PATCH `/api/admin/producao/cards/:id` (body: `title`, `type`, `priority`, `due`, `description`) |
| Admin   | Comentar no card    | POST `/api/admin/producao/cards/:id/comments` (body: `{ content }`) |

O front já está preparado: cliente usa "Nova Solicitação" (modal) e admin usa a página **Produção** (seleção de cliente, Kanban, "Novo card", dropdown "Mover para…" em cada card).
