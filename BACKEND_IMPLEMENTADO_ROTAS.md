# Backend — Rotas implementadas (resumo)

Resumo das implementações no backend para as funcionalidades do front (marcar conta a pagar como paga, arquivar materiais e cards).

---

## 1. PUT `/api/admin/financeiro/pagar/{id}/marcar-pago`

**Descrição:** Marca conta a pagar como paga.

- **Domain:** `Pagamento` com `DataPagamento *time.Time` e `Status` (pendente/pago).
- **Repository:** `MarkPagamentoPago(ctx, uuid)` — atualiza `status: "pago"`, `data_pagamento: now`, `updated_at: now` na collection `pagamentos`.
- **AdminService:** `MarcarPagamentoPago(ctx, id)` chama o repositório.
- **Handler:** `MarcarPagamentoPago` — lê `id` da URL, retorna **200** e `{ "status": "ok" }`.
- **Rota:** `PUT /api/admin/financeiro/pagar/{id}/marcar-pago`.

---

## 2. PATCH `/api/admin/materiais/pastas/{id}`

**Descrição:** Atualiza pasta (ex.: arquivar).

- **Domain:** `MaterialPasta` com campo **Archived** `bool` (bson/json).
- **Repository:** `GetPastaByUUID(ctx, uuid)` e `UpdatePasta(ctx, p *MaterialPasta)` (ReplaceOne).
- **AdminService:** `UpdateMaterialPasta(ctx, id, input)` — busca a pasta, aplica `archived` do body e persiste.
- **Handler:** `UpdateMaterialPasta` — body como map, resposta **200** com a pasta atualizada.
- **Rota:** `PATCH /api/admin/materiais/pastas/{id}`.  
- **Body:** `{ "archived": true }` (ou outros campos).

---

## 3. PATCH `/api/admin/materiais/arquivos/{id}`

**Descrição:** Atualiza arquivo (ex.: arquivar).

- **Domain:** `MaterialArquivo` com campo **Archived** `bool`.
- **Repository:** `GetArquivoByUUID(ctx, uuid)` e `UpdateArquivo(ctx, a *MaterialArquivo)`.
- **AdminService:** `UpdateMaterialArquivo(ctx, id, input)` — aplica `archived` e persiste.
- **Handler:** `UpdateMaterialArquivo` — body como map, resposta **200** com o arquivo atualizado.
- **Rota:** `PATCH /api/admin/materiais/arquivos/{id}`.  
- **Body:** `{ "archived": true }` (ou outros campos).

---

## 4. PATCH `/api/admin/producao/cards/{id}` (com `archived: true`)

**Descrição:** Atualiza card (mover coluna e/ou arquivar). O body já é um map; não é necessária alteração de rota.

- **Domain:** `KanbanCard` com campo **Archived** `bool`.
- **AdminService:** Em `UpdateProducaoCard`, se `input["archived"]` for `bool`, define `card.Archived` e persiste com `UpdateCard`.
- **Listagem:** Em `GetProducao` (cliente) e `GetProducaoAdmin`, cards com `Archived == true` são **omitidos** do quadro.
- **Resposta:** `cardToProducaoItem` passa a incluir `"archived": c.Archived`.
- **Rota:** `PATCH /api/admin/producao/cards/{id}` (já existente).  
- **Body:** `{ "column_id": "done" }` ou `{ "archived": true }` (ou ambos).

---

## Resumo das rotas

| Método | Rota | Descrição |
|--------|------|-----------|
| PUT | `/api/admin/financeiro/pagar/{id}/marcar-pago` | Marca conta a pagar como paga |
| PATCH | `/api/admin/materiais/pastas/{id}` | Atualiza pasta (ex.: `{ "archived": true }`) |
| PATCH | `/api/admin/materiais/arquivos/{id}` | Atualiza arquivo (ex.: `{ "archived": true }`) |
| PATCH | `/api/admin/producao/cards/{id}` | Move card e/ou arquiva (`{ "column_id" }`, `{ "archived": true }`) |
