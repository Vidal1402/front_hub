# United — Growth Hub (Front-end)

Front-end em React (Vite) para o **Growth Hub** (cliente) e **Painel ADM**. Este documento descreve as rotas, entidades, chaves e dependências que o **back-end** deve atender.

---

## Rotas do front-end

| Rota | Aplicação | Descrição |
|------|------------|-----------|
| `/` | Growth Hub | Dashboard, Produção, Relatórios, Materiais, Reuniões, Financeiro, Academy, Suporte, Configurações |
| `/admin` | Painel ADM | Visão Geral, Clientes, Colaboradores, Financeiro, Produtos, Alertas, Notificações, Relatórios, Comercial |

---

## 1. Growth Hub (cliente) — APIs esperadas

Todas as chamadas devem considerar o **cliente autenticado** (token/sessão).

### 1.1 Produção (Kanban) — Modelo 2: cliente pede, admin executa e move

- **GET** `/api/cliente/producao`  
  Retorno: `{ columns: [{ id, label, dot, cards: [{ id, title, type, priority, owner, due, comments, files, column_id }] }] }`. O cliente vê apenas o quadro do próprio cliente.
- **POST** `/api/cliente/producao/solicitacoes`  
  Body: `{ titulo, tipo?, prioridade?, descricao? }`. Cria uma solicitação que vira card no Kanban (ex.: na coluna "Backlog"). Tipo: Campanha | Criativo | Vídeo | Landing Page | Automação. Prioridade: Baixa | Média | Alta.
- Chaves: `kanban_column.id` (PK); `kanban_card.id` (PK), `kanban_card.column_id` (FK), `kanban_card.cliente_uuid` (FK).
- **Testar sem backend:** se GET não existir ou retornar vazio, o front exibe dados de exemplo. Cliente pode usar "Nova Solicitação" (POST acima) quando o backend estiver pronto.

### 1.2 Dashboard / Performance

- **GET** `/api/cliente/dashboard/kpis` → array de KPIs (em `items`, `kpis`, `data` ou array direto). Cada item: `label`/`Label`, `value`/`Value`, `delta`/`Delta`, `sub`/`Sub`. Ex.: `[{ "label": "Leads", "value": "1.234", "delta": "+12%", "sub": "este mês" }]`.
- **GET** `/api/cliente/dashboard/chart?period=7d|30d|90d|12m` → array (em `points`, `items`, `data` ou array direto). Cada ponto: `m`/`M`/`label`/`period`, `leads`/`Leads`/`value`, `inv`/`Inv`, `conv`/`Conv`.
- **GET** `/api/cliente/dashboard/funnel` → array (em `stages`, `items`, `data` ou array direto). Cada estágio: `s`/`stage`/`label`, `v`/`value`, `p`/`percent`.
- **GET** `/api/cliente/dashboard/score` → `{ score }` ou `{ Score }` (0–100). Número exibido no Growth Score.

### 1.3 Relatórios

- **GET** `/api/cliente/relatorios` → `{ id, title, type, period, owner, date, pages, fileUrl? }[]`
- PK: `relatorio.id`; FK: `relatorio.cliente_id`

### 1.4 Materiais (Drive)

- **GET** `/api/cliente/materiais/pastas` → `{ id, label, icon, count, size }[]`
- **GET** `/api/cliente/materiais/arquivos?pasta={folderId}` → `{ name, ext, size, date }[]`
- **POST** `/api/cliente/materiais/upload` — upload (multipart)
- PKs/FKs: `material_pasta.id`, `material_pasta.cliente_id`; `material_arquivo.id`, `material_arquivo.pasta_id`

### 1.5 Reuniões

- **GET** `/api/cliente/reunioes/proximas` → `{ id, title, date, time, via, owner, agenda[] }[]`
- **GET** `/api/cliente/reunioes/historico` → `{ id, title, date, via, dur, rec, ata }[]`
- PK: `reuniao.id`; FKs: `reuniao.cliente_id`, `reuniao.owner_id`

### 1.6 Financeiro (cliente)

- **GET** `/api/cliente/financeiro/faturas` → **obrigatório para o cliente ver suas faturas.** Deve retornar os mesmos lançamentos "a receber" que o admin cadastra para esse cliente (mesma fonte de dados do admin, filtrada pelo `cliente_uuid` do JWT). Resposta: array em `items`, `data`, `faturas`, `recebiveis`, `lancamentos` ou array direto. Cada item: `uuid`/`id`, `descricao`/`periodo`, `valor_centavos`/`valor`, `vencimento`/`due`, `status` (Pago | Pendente | Vencido), `data_pagamento`/`paid`, `file_url`. O front aceita snake_case e PascalCase. Se este endpoint não existir ou não filtrar pelo cliente do token, a tela Financeiro do cliente ficará vazia.
- **GET** `/api/cliente/financeiro/plano` → `{ plano, valorMensal }` ou `{ nome, valor, periodo }`
- PK: `fatura.id`; FK: `fatura.cliente_id`

### 1.7 Academy

- **GET** `/api/cliente/academy/cursos` → `{ id, title, cat, fmt, dur, lvl, done, prog }[]`
- PK/FK: curso e progresso por `cliente_id` (ou tabela de progresso com `cliente_id`, `curso_id`)

### 1.8 Suporte

- **GET** `/api/cliente/suporte/chamados` → `{ id, cat, title, status, created, updated }[]`
- **POST** `/api/cliente/suporte/chamados` — abrir chamado
- **GET** `/api/cliente/suporte/faq` → `{ q, a }[]`
- PK: `chamado.id`; FK: `chamado.cliente_id`

### 1.9 Configurações

- **GET/PUT** `/api/cliente/config/perfil`
- **GET** `/api/cliente/config/usuarios`
- **GET/PUT** `/api/cliente/config/notificacoes`
- **GET** `/api/cliente/config/integracoes`; **POST** `/api/cliente/config/integracoes/:id/conectar`

---

## 2. Painel ADM — APIs esperadas

Requer autenticação **admin**.

### 2.1 Visão geral

- **GET** `/api/admin/overview` — KPIs agregados. Resposta pode ter: `total_mrr`/`TotalMRR`/`mrr`/`MRR`, `clientes_ativos`/`ClientesAtivos`, `churn_rate`/`ChurnRate`, `mrr_delta`/`MrrDelta`. O front usa esses valores para MRR, Clientes Ativos, Churn e delta; se ausentes, calcula a partir de clientes e recebiveis.
- **GET** `/api/admin/overview/mrr-mensal` → array (em `meses`, `data` ou array direto). Cada item: `mes`/`m`/`label`, `mrr`/`valor`/`Valor`. Gráfico MRR por mês.

### 2.2 Clientes

- **GET** `/api/admin/clientes?status=&search=` → `{ id, name, seg, plan, mrr, status, score, start, owner, nextPay, tags[], contact, phone, city }[]`
- **POST** `/api/admin/clientes` — criar; **GET** `/api/admin/clientes/:id`; **PUT** `/api/admin/clientes/:id`; **PUT** `/api/admin/clientes/:id/desativar`
- PK: `cliente.id`; FK: `cliente.owner_id` (colaborador)

### 2.3 Colaboradores

- **GET** `/api/admin/colaboradores` → `{ id, name, role, clients, tasks, status, perf, avatar, email, joined }[]`
- **POST** `/api/admin/colaboradores`; **GET/PUT** `/api/admin/colaboradores/:id`; desativar
- PK: `colaborador.id`

### 2.4 Financeiro ADM

- **GET** `/api/admin/financeiro/receber` → recebíveis por cliente (`id`, `client`, `value`, `due`, `status`, `plan`). Resposta deve incluir `cliente_uuid`, `cliente_nome` ou o front resolve o nome pela lista de clientes.
- **GET** `/api/admin/financeiro/pagar` → contas a pagar (`id`/`uuid`, `descricao`, `valor_centavos` ou `valor`, `vencimento`, `status`, `categoria`).
- **POST** `/api/admin/financeiro/lancamento` — body: `{ cliente_uuid, descricao, valor_centavos, vencimento, plano }` (a receber).
- **POST** `/api/admin/financeiro/pagar` — body: `{ descricao, valor_centavos, vencimento, categoria }` (adicionar conta a pagar).
- **PUT** `/api/admin/financeiro/receber/:id/marcar-pago` — marcar recebível como pago.
- **PUT** `/api/admin/financeiro/pagar/:id/marcar-pago` — marcar conta a pagar como paga (domain: `DataPagamento`, `Status`; repo: `MarkPagamentoPago`). Ver `BACKEND_IMPLEMENTADO_ROTAS.md`.
- **PATCH** `/api/admin/materiais/pastas/:id` e **PATCH** `/api/admin/materiais/arquivos/:id` — atualizar (ex.: `{ "archived": true }`).
- PKs: `recebivel.id` (FK `cliente_id`), `pagamento.id`

### 2.5 Produtos / Planos

- **GET** `/api/admin/produtos/marketing`, `/api/admin/produtos/food`, `/api/admin/produtos/ia`, `/api/admin/produtos/crm`
- CRUD por família: **POST** criar, **PUT** `/:familia/:id`, **DELETE** `/:familia/:id`
- PK: `produto.id`; família: marketing | food | ia | crm

### 2.6 Alertas

- **GET** `/api/admin/alertas` → `{ id, title, type, priority, target, created, status }[]`
- **PUT** `/api/admin/alertas/:id/resolver`
- PK: `alerta.id`; opcional FK `cliente_id`

### 2.7 Notificações

- **GET** `/api/admin/notificacoes/enviadas` → `{ id, title, target, channel, date, reads }[]`
- **POST** `/api/admin/notificacoes/enviar`
- PK: `notificacao.id`; destino: cliente ou global

### 2.8 Relatórios ADM

- **GET** `/api/admin/relatorios` — listagem para gestão/exportação

### 2.9 Produção (Kanban) — admin cria e move cards

- **GET** `/api/admin/producao?cliente_uuid=xxx`  
  Retorno: `{ columns: [{ id, label, dot, cards: [{ id, title, type, priority, owner, due, comments, files, column_id }] }] }` — quadro do cliente para o admin gerenciar.
- **POST** `/api/admin/producao/cards`  
  Body: `{ cliente_uuid, column_id, title, type?, priority? }` — criar card (admin ou sistema ao receber solicitação do cliente).
- **PATCH** `/api/admin/producao/cards/:id`  
  Body: `{ column_id }` — mover card; `{ archived: true }` — arquivar card (some do quadro).
- PK: `kanban_card.id`; FKs: `kanban_card.cliente_uuid`, `kanban_card.column_id` (→ `kanban_column.id`).

### 2.10 Comercial

- **GET** `/api/admin/comercial` — pipelines/propostas (ajustar conforme tela)

---

## 3. Autenticação

- **POST** `/api/auth/login` — `{ email, password }` → `{ token, user, role }`
- **POST** `/api/auth/refresh`; **GET** `/api/auth/me`
- Rotas `/api/cliente/*` → token de cliente; `/api/admin/*` → token + role admin

---

## 4. Resumo de entidades e chaves

| Entidade | PK | FKs / observações |
|----------|-----|-------------------|
| Cliente | id | owner_id → colaborador |
| Colaborador | id | user_id (opcional) |
| Kanban coluna/card | id | column_id, owner_id |
| Relatório | id | cliente_id |
| Material pasta/arquivo | id | cliente_id, pasta_id |
| Reunião | id | cliente_id, owner_id |
| Fatura | id | cliente_id |
| Academy (curso/progresso) | id | cliente_id |
| Chamado | id | cliente_id |
| Recebível / Pagamento | id | cliente_id (recebível) |
| Alerta | id | opcional cliente_id |
| Notificação | id | destino (cliente/global) |
| Produto/Plano | id | família (marketing/food/ia/crm) |

---

## 5. Dependências do front-end

- React 18, react-router-dom 6, Vite 5
- Variável **VITE_API_URL** para a base da API
- Build: `npm run build` → saída em `dist/`; servir como SPA (fallback para `index.html` em `/` e `/admin`)

---

## 6. Desenvolvimento e build

```bash
npm install
npm run dev      # desenvolvimento — http://localhost:5173
npm run build    # build de produção → dist/
npm run preview  # preview do build
```
