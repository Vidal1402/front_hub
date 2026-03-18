import { useState, createContext, useContext } from "react";

/* ═══════════════════════════════════════════════════
   THEME SYSTEM
═══════════════════════════════════════════════════ */
const DARK = {
  bg0:"#070707", bg1:"#0D0D0D", bg2:"#131313", bg3:"#1A1A1A",
  bg4:"#222222", bg5:"#2C2C2C",
  t1:"#F0F0F0", t2:"#9A9A9A", t3:"#5A5A5A", t4:"#303030",
  b1:"rgba(255,255,255,0.07)", b2:"rgba(255,255,255,0.03)",
  bHi:"rgba(255,255,255,0.13)",
  accent:"#FFFFFF", accentTxt:"#070707",
  sh:"rgba(0,0,0,0.6)", isDark:true,
};
const LIGHT = {
  bg0:"#EFEFEF", bg1:"#F8F8F8", bg2:"#FFFFFF", bg3:"#F3F3F3",
  bg4:"#EAEAEA", bg5:"#DEDEDE",
  t1:"#0F0F0F", t2:"#555555", t3:"#9A9A9A", t4:"#CCCCCC",
  b1:"rgba(0,0,0,0.07)", b2:"rgba(0,0,0,0.03)",
  bHi:"rgba(0,0,0,0.14)",
  accent:"#0F0F0F", accentTxt:"#FFFFFF",
  sh:"rgba(0,0,0,0.12)", isDark:false,
};
const C = {
  green:"#22C55E", greenBg:"rgba(34,197,94,.12)",
  blue:"#3B82F6",  blueBg:"rgba(59,130,246,.12)",
  red:"#EF4444",   redBg:"rgba(239,68,68,.12)",
  amber:"#F59E0B", amberBg:"rgba(245,158,11,.12)",
  purple:"#A855F7",purpleBg:"rgba(168,85,247,.12)",
  cyan:"#06B6D4",  cyanBg:"rgba(6,182,212,.12)",
  pink:"#EC4899",  pinkBg:"rgba(236,72,153,.12)",
  orange:"#F97316",orangeBg:"rgba(249,115,22,.12)",
};
const Ctx = createContext(DARK);
const useT = () => useContext(Ctx);

/* ═══════════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════════ */
const CLIENTS = [
  { id:1,  name:"TechVision LTDA",       seg:"Tecnologia",   plan:"Growth",    mrr:4800,  status:"Ativo",    score:87, start:"Jan 2025", owner:"Rafael L.", nextPay:"15 Mar", tags:["Meta Ads","Google Ads"], contact:"joao@techvision.com.br",   phone:"(11) 99999-1111", city:"São Paulo"    },
  { id:2,  name:"BrandForge Agency",     seg:"Marketing",    plan:"Pro",       mrr:7200,  status:"Ativo",    score:94, start:"Mar 2024", owner:"Lucas P.",  nextPay:"22 Mar", tags:["SEO","Conteúdo"],        contact:"ana@brandforge.com.br",     phone:"(11) 99999-2222", city:"Rio de Janeiro"},
  { id:3,  name:"Nexus Retail",          seg:"E-commerce",   plan:"Scale",     mrr:9600,  status:"Ativo",    score:72, start:"Jun 2024", owner:"Ana S.",    nextPay:"05 Mar", tags:["Meta Ads","CRM"],        contact:"pedro@nexusretail.com.br",  phone:"(21) 99999-3333", city:"Curitiba"     },
  { id:4,  name:"MedPlus Clínicas",      seg:"Saúde",        plan:"Growth",    mrr:4800,  status:"Ativo",    score:81, start:"Ago 2024", owner:"Carla M.",  nextPay:"10 Mar", tags:["Google Ads","Local SEO"],contact:"admin@medplus.com.br",      phone:"(31) 99999-4444", city:"Belo Horizonte"},
  { id:5,  name:"FinEdge Consultoria",   seg:"Financeiro",   plan:"Pro",       mrr:7200,  status:"Ativo",    score:91, start:"Nov 2023", owner:"Bruno T.",  nextPay:"18 Mar", tags:["LinkedIn Ads","Funil"],  contact:"ceo@finedge.com.br",        phone:"(11) 99999-5555", city:"São Paulo"    },
  { id:6,  name:"EduPath Cursos",        seg:"Educação",     plan:"Starter",   mrr:2400,  status:"Ativo",    score:68, start:"Fev 2025", owner:"Lucas P.",  nextPay:"28 Mar", tags:["Meta Ads"],              contact:"contato@edupathcursos.com.br",phone:"(85) 99999-6666",city:"Fortaleza"    },
  { id:7,  name:"ConstruMax",            seg:"Construção",   plan:"Growth",    mrr:4800,  status:"Pausado",  score:55, start:"Mai 2024", owner:"Rafael L.", nextPay:"—",     tags:["Google Ads"],            contact:"adm@construmax.com.br",      phone:"(41) 99999-7777", city:"Curitiba"     },
  { id:8,  name:"FoodHub Delivery",      seg:"Alimentação",  plan:"Starter",   mrr:2400,  status:"Inadimpl.",score:43, start:"Out 2024", owner:"Carla M.",  nextPay:"01 Mar", tags:["Meta Ads"],              contact:"suporte@foodhub.com.br",     phone:"(11) 99999-8888", city:"São Paulo"    },
];

const COLABS = [
  { id:1, name:"Rafael Lima",    role:"Head de Estratégia",    clients:3, tasks:8,  status:"Online",  perf:96, avatar:"RL", email:"rafael@united.com.br",  joined:"Jan 2023" },
  { id:2, name:"Lucas Pereira", role:"Gestor de Tráfego",      clients:2, tasks:12, status:"Online",  perf:88, avatar:"LP", email:"lucas@united.com.br",   joined:"Mar 2023" },
  { id:3, name:"Ana Santos",    role:"Designer Criativa",       clients:2, tasks:6,  status:"Online",  perf:92, avatar:"AS", email:"ana@united.com.br",     joined:"Jun 2023" },
  { id:4, name:"Carla Mendes",  role:"Account Manager",         clients:2, tasks:9,  status:"Ausente", perf:85, avatar:"CM", email:"carla@united.com.br",   joined:"Ago 2023" },
  { id:5, name:"Bruno Torres",  role:"Copywriter Sênior",       clients:1, tasks:5,  status:"Online",  perf:90, avatar:"BT", email:"bruno@united.com.br",   joined:"Nov 2023" },
  { id:6, name:"Julia Rocha",   role:"Analista de Dados",       clients:0, tasks:4,  status:"Offline", perf:78, avatar:"JR", email:"julia@united.com.br",   joined:"Jan 2024" },
];

const PLANS = [
  { id:1, name:"Starter",  price:2400,  color:C.cyan,   features:["Meta Ads (1 conta)","2 criativos/mês","Relatório mensal","Suporte por email"],           clients:2  },
  { id:2, name:"Growth",   price:4800,  color:C.blue,   features:["Meta Ads + Google","8 criativos/mês","Relatórios quinzenais","Reuniões quinzenais","Suporte prioritário"], clients:4 },
  { id:3, name:"Pro",      price:7200,  color:C.purple, features:["Multi-canal completo","16 criativos/mês","Relatórios semanais","Gestor dedicado","WhatsApp direto","CRM integrado"], clients:2 },
  { id:4, name:"Scale",    price:9600,  color:C.amber,  features:["Tudo do Pro","Produção de vídeo","Funil completo","Automações","Squad dedicado","SLA garantido"], clients:1 },
];

const RECEIPTS = [
  { id:"REC-2025-042", client:"TechVision LTDA",     value:4800, due:"15 Mar", status:"Pendente", plan:"Growth"  },
  { id:"REC-2025-041", client:"BrandForge Agency",   value:7200, due:"22 Mar", status:"Pendente", plan:"Pro"     },
  { id:"REC-2025-040", client:"MedPlus Clínicas",    value:4800, due:"10 Mar", status:"Pendente", plan:"Growth"  },
  { id:"REC-2025-039", client:"Nexus Retail",        value:9600, due:"05 Mar", status:"Pago",     plan:"Scale"   },
  { id:"REC-2025-038", client:"FinEdge Consultoria", value:7200, due:"18 Mar", status:"Pago",     plan:"Pro"     },
  { id:"REC-2025-037", client:"EduPath Cursos",      value:2400, due:"28 Mar", status:"Pendente", plan:"Starter" },
  { id:"REC-2025-036", client:"FoodHub Delivery",    value:2400, due:"01 Mar", status:"Vencido",  plan:"Starter" },
];

const PAYMENTS = [
  { id:"PAG-2025-018", desc:"Ferramenta — ActiveCampaign",  value:890,  due:"10 Mar", status:"Pendente", cat:"Software"  },
  { id:"PAG-2025-017", desc:"Ferramenta — SEMrush",          value:450,  due:"12 Mar", status:"Pendente", cat:"Software"  },
  { id:"PAG-2025-016", desc:"Folha — Março 2025",            value:34200,due:"05 Mar", status:"Pago",     cat:"Pessoal"   },
  { id:"PAG-2025-015", desc:"Escritório — Aluguel Março",    value:3800, due:"01 Mar", status:"Pago",     cat:"Infra"     },
  { id:"PAG-2025-014", desc:"Ferramenta — Adobe Creative",   value:600,  due:"15 Mar", status:"Pendente", cat:"Software"  },
];

const ALERTS_DATA = [
  { id:1, title:"FoodHub com fatura vencida há 5 dias",     type:"Financeiro",  priority:"Alta",  target:"Interno", created:"05 Mar", status:"Ativo"   },
  { id:2, title:"ConstruMax sem atividade — possível churn",type:"Risco",       priority:"Alta",  target:"Interno", created:"02 Mar", status:"Ativo"   },
  { id:3, title:"EduPath Growth Score abaixo de 70",        type:"Performance", priority:"Média", target:"Interno", created:"01 Mar", status:"Ativo"   },
  { id:4, title:"Renovação contrato FinEdge — Nov 2025",    type:"Contrato",    priority:"Baixa", target:"Interno", created:"20 Fev", status:"Resolvido"},
  { id:5, title:"Nexus Retail — Proposta Upsell Scale",     type:"Comercial",   priority:"Média", target:"Interno", created:"15 Fev", status:"Ativo"   },
];

const NOTIFS_SENT = [
  { id:1, title:"Relatório de Fevereiro disponível",    target:"Todos os clientes",     channel:"Email",    date:"01 Mar", reads:6  },
  { id:2, title:"Manutenção programada — 08 Mar",       target:"Todos os clientes",     channel:"Plataforma",date:"28 Fev",reads:7  },
  { id:3, title:"Nova feature disponível: Academy",     target:"Planos Growth+",        channel:"Email",    date:"20 Fev", reads:5  },
  { id:4, title:"Alerta: Fatura em aberto",             target:"FoodHub Delivery",      channel:"WhatsApp", date:"06 Mar", reads:1  },
  { id:5, title:"Parabéns! Meta de ROI atingida",       target:"FinEdge Consultoria",   channel:"Plataforma",date:"03 Mar",reads:1  },
];

const MONTHLY = [
  { m:"Set", mrr:28400, clients:6, churn:0 },
  { m:"Out", mrr:30800, clients:6, churn:0 },
  { m:"Nov", mrr:33200, clients:7, churn:0 },
  { m:"Dez", mrr:35600, clients:7, churn:1 },
  { m:"Jan", mrr:38400, clients:7, churn:0 },
  { m:"Fev", mrr:40800, clients:8, churn:0 },
  { m:"Mar", mrr:43200, clients:8, churn:0 },
];

const ADM_NAV = [
  { id:"overview",      icon:"⬡",  label:"Visão Geral"       },
  { id:"clientes",      icon:"◎",  label:"Clientes",    b:8  },
  { id:"colaboradores", icon:"◈",  label:"Colaboradores"     },
  { id:"financeiro",    icon:"◇",  label:"Financeiro"        },
  { id:"produtos",       icon:"◆",  label:"Produtos"           },
  { id:"alertas",       icon:"◉",  label:"Alertas",     b:3  },
  { id:"notificacoes",  icon:"◷",  label:"Notificações"      },
  { id:"relatorios",    icon:"◻",  label:"Relatórios"        },
  { id:"comercial",     icon:"◑",  label:"Comercial"         },
];

/* ═══════════════════════════════════════════════════
   PRIMITIVES
═══════════════════════════════════════════════════ */
function Card({ children, style={}, lift=false }) {
  const t = useT();
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background:t.bg2, border:`1px solid ${h&&lift?t.bHi:t.b1}`, borderRadius:12,
        transition:"border-color .18s, box-shadow .18s, transform .18s",
        boxShadow: h&&lift?`0 8px 32px ${t.sh}`:`0 1px 4px ${t.sh}`,
        transform: h&&lift?"translateY(-2px)":"none", ...style }}>
      {children}
    </div>
  );
}

function Btn({ children, onClick, v="primary", sz="md", style={} }) {
  const t = useT();
  const [h, setH] = useState(false);
  const vs = {
    primary:{ bg:h?(t.isDark?"#E0E0E0":"#2A2A2A"):t.accent, c:t.accentTxt, border:`1px solid ${t.accent}` },
    ghost:  { bg:h?t.bg3:"transparent", c:t.t2, border:`1px solid ${t.b1}` },
    danger: { bg:h?"rgba(239,68,68,.2)":C.redBg, c:C.red, border:`1px solid ${C.red}22` },
    success:{ bg:h?"rgba(34,197,94,.2)":C.greenBg, c:C.green, border:`1px solid ${C.green}22` },
  }[v]||{};
  const pad = sz==="sm"?"4px 12px":sz==="lg"?"11px 28px":"8px 18px";
  return (
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ padding:pad, borderRadius:8, cursor:"pointer", fontSize:sz==="sm"?11:12, fontWeight:700,
        background:vs.bg, color:vs.c, border:vs.border, transition:"all .15s", ...style }}>
      {children}
    </button>
  );
}

const Tag = ({ label, color, bg }) => (
  <span style={{ display:"inline-flex", alignItems:"center", fontSize:10, fontWeight:700, padding:"3px 9px",
    borderRadius:5, letterSpacing:.5, textTransform:"uppercase", color, background:bg||`${color}15`, border:`1px solid ${color}22` }}>
    {label}
  </span>
);

const StatusDot = ({ status }) => {
  const map = { "Online":C.green,"Ausente":C.amber,"Offline":"#555" };
  return <div style={{ width:7, height:7, borderRadius:"50%", background:map[status]||"#555", flexShrink:0 }}/>;
};

const StatusBadge = ({ s }) => {
  const map = {
    "Ativo":      { c:C.green,  bg:C.greenBg  },
    "Pausado":    { c:C.amber,  bg:C.amberBg  },
    "Inadimpl.":  { c:C.red,    bg:C.redBg    },
    "Pago":       { c:C.green,  bg:C.greenBg  },
    "Pendente":   { c:C.amber,  bg:C.amberBg  },
    "Vencido":    { c:C.red,    bg:C.redBg    },
    "Ativo":      { c:C.green,  bg:C.greenBg  },
    "Resolvido":  { c:"#888",   bg:"rgba(128,128,128,.1)" },
    "Online":     { c:C.green,  bg:C.greenBg  },
    "Ausente":    { c:C.amber,  bg:C.amberBg  },
    "Offline":    { c:"#888",   bg:"rgba(128,128,128,.1)" },
  };
  const st = map[s]||{ c:"#888", bg:"rgba(128,128,128,.1)" };
  return <span style={{ fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:20, color:st.c, background:st.bg }}>{s}</span>;
};

function FilterPill({ label, active, onClick }) {
  const t = useT();
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ padding:"5px 13px", borderRadius:6, cursor:"pointer", fontSize:11, fontWeight:600,
        border:active?`1px solid ${t.bHi}`:`1px solid ${t.b1}`,
        background:active?t.bg3:(h?t.bg3:"transparent"),
        color:active?t.t1:t.t3, transition:"all .14s" }}>
      {label}
    </button>
  );
}
const FilterBar = ({ opts, active, onChange, label }) => {
  const t = useT();
  return (
    <div style={{ display:"flex", alignItems:"center", gap:4, flexWrap:"wrap" }}>
      {label && <span style={{ color:t.t4, fontSize:9, fontWeight:700, letterSpacing:1.8, textTransform:"uppercase", marginRight:4 }}>{label}</span>}
      {opts.map(o => <FilterPill key={o} label={o} active={active===o} onClick={()=>onChange(o)}/>)}
    </div>
  );
};

function PageHeader({ title, sub, action }) {
  const t = useT();
  return (
    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:28, paddingBottom:20, borderBottom:`1px solid ${t.b1}` }}>
      <div>
        <h1 style={{ color:t.t1, fontSize:22, fontWeight:800, letterSpacing:-0.5 }}>{title}</h1>
        {sub && <p style={{ color:t.t3, fontSize:12, marginTop:5, lineHeight:1.6 }}>{sub}</p>}
      </div>
      {action && <div style={{ marginTop:2 }}>{action}</div>}
    </div>
  );
}

function KPICard({ label, value, delta, deltaPos=true, sub, accent }) {
  const t = useT();
  return (
    <Card lift style={{ padding:"20px 22px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
        <span style={{ color:t.t3, fontSize:11 }}>{label}</span>
        {delta && (
          <span style={{ fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:5,
            color:deltaPos?C.green:C.red, background:deltaPos?C.greenBg:C.redBg }}>
            {delta}
          </span>
        )}
      </div>
      <div style={{ color:accent||t.t1, fontSize:24, fontWeight:800, letterSpacing:-0.5, marginBottom:4 }}>{value}</div>
      {sub && <div style={{ color:t.t4, fontSize:10 }}>{sub}</div>}
    </Card>
  );
}

function MiniBar({ data, dataKey, accent }) {
  const t = useT();
  const max = Math.max(...data.map(d=>d[dataKey]));
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:5, height:56 }}>
      {data.map((d,i) => {
        const isLast = i===data.length-1;
        const h = Math.max(4,(d[dataKey]/max)*48);
        return (
          <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
            <div style={{ width:"100%", borderRadius:"2px 2px 0 0", height:`${h}px`,
              background:isLast?(accent||t.accent):t.bg4, transition:"height .6s ease" }}/>
            <span style={{ fontSize:8, color:t.t4 }}>{d.m}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MODAL
═══════════════════════════════════════════════════ */
function Modal({ open, onClose, title, children, width=520 }) {
  const t = useT();
  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.65)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(4px)" }}
      onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ width, maxHeight:"90vh", overflowY:"auto",
        background:t.bg2, border:`1px solid ${t.bHi}`, borderRadius:16,
        boxShadow:`0 24px 64px rgba(0,0,0,.7)`, animation:"modalIn .22s cubic-bezier(.4,0,.2,1)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 24px", borderBottom:`1px solid ${t.b1}` }}>
          <span style={{ color:t.t1, fontSize:15, fontWeight:700 }}>{title}</span>
          <button onClick={onClose} style={{ background:"transparent", border:"none", color:t.t3, fontSize:18, cursor:"pointer", lineHeight:1 }}>×</button>
        </div>
        <div style={{ padding:"24px" }}>{children}</div>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  const t = useT();
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ color:t.t3, fontSize:9, fontWeight:800, letterSpacing:1.8, textTransform:"uppercase", display:"block", marginBottom:7 }}>{label}</label>
      {children}
    </div>
  );
}
function Input({ value, onChange, placeholder, type="text" }) {
  const t = useT();
  return (
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{ width:"100%", padding:"9px 13px", background:t.bg3, border:`1px solid ${t.b1}`, borderRadius:8, color:t.t1, fontSize:12, outline:"none" }}/>
  );
}
function Select({ value, onChange, opts }) {
  const t = useT();
  return (
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{ width:"100%", padding:"9px 13px", background:t.bg3, border:`1px solid ${t.b1}`, borderRadius:8, color:t.t1, fontSize:12, outline:"none" }}>
      {opts.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE: VISÃO GERAL
═══════════════════════════════════════════════════ */
function OverviewPage() {
  const t = useT();
  const totalMRR = CLIENTS.filter(c=>c.status==="Ativo").reduce((s,c)=>s+c.mrr,0);
  const activeClients = CLIENTS.filter(c=>c.status==="Ativo").length;
  const avgTicket = Math.round(totalMRR / activeClients);
  const pendingRec = RECEIPTS.filter(r=>r.status==="Pendente").reduce((s,r)=>s+r.value,0);
  const overdueRec = RECEIPTS.filter(r=>r.status==="Vencido").reduce((s,r)=>s+r.value,0);

  return (
    <div>
      <PageHeader title="Visão Geral" sub="Resumo executivo da United — Março 2025"
        action={
          <div style={{ display:"flex", gap:8 }}>
            <Btn v="ghost" sz="sm">↓ Exportar Relatório</Btn>
            <Btn sz="sm">+ Novo Cliente</Btn>
          </div>
        }/>

      {/* KPIs row 1 */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:12 }}>
        <KPICard label="MRR"            value={`R$${(totalMRR/1000).toFixed(1)}k`} delta="+12%" sub="Receita mensal recorrente"/>
        <KPICard label="Clientes Ativos" value={activeClients} delta="+1" sub={`${CLIENTS.length} total`}/>
        <KPICard label="Ticket Médio"    value={`R$${avgTicket.toLocaleString("pt-BR")}`} delta="+8%" sub="por cliente/mês"/>
        <KPICard label="Churn Rate"      value="0%" delta="-" deltaPos={true} sub="Últimos 30 dias"/>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:16 }}>
        <KPICard label="A Receber (Mês)"  value={`R$${(pendingRec/1000).toFixed(1)}k`} delta={null} sub={`${RECEIPTS.filter(r=>r.status==="Pendente").length} faturas pendentes`} accent={C.amber}/>
        <KPICard label="Vencido"           value={overdueRec>0?`R$${overdueRec/1000}k`:"R$0"} delta={null} sub={`${RECEIPTS.filter(r=>r.status==="Vencido").length} fatura(s) em atraso`} accent={overdueRec>0?C.red:C.green}/>
        <KPICard label="Colaboradores"     value={COLABS.length} delta={null} sub={`${COLABS.filter(c=>c.status==="Online").length} online agora`}/>
        <KPICard label="ARR Projetado"     value={`R$${((totalMRR*12)/1000).toFixed(0)}k`} delta="+14%" sub="Receita anual recorrente"/>
      </div>

      {/* Charts row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:12 }}>
        <Card style={{ padding:"22px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div>
              <div style={{ color:t.t1, fontWeight:700, fontSize:13 }}>MRR por Mês</div>
              <div style={{ color:t.t3, fontSize:11, marginTop:2 }}>Crescimento recorrente</div>
            </div>
            <span style={{ fontSize:10, fontWeight:700, color:C.green, background:C.greenBg, padding:"3px 9px", borderRadius:5 }}>↑ 12%</span>
          </div>
          <MiniBar data={MONTHLY} dataKey="mrr"/>
        </Card>
        <Card style={{ padding:"22px" }}>
          <div style={{ color:t.t1, fontWeight:700, fontSize:13, marginBottom:16 }}>Distribuição de Planos</div>
          {PLANS.map(p => {
            const count = CLIENTS.filter(c=>c.plan===p.name).length;
            const pct = Math.round((count/CLIENTS.length)*100);
            return (
              <div key={p.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:p.color, flexShrink:0 }}/>
                <span style={{ color:t.t2, fontSize:11, flex:1 }}>{p.name}</span>
                <div style={{ width:80, height:5, background:t.bg4, borderRadius:3, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${pct}%`, background:p.color, borderRadius:3 }}/>
                </div>
                <span style={{ color:t.t3, fontSize:11, width:28, textAlign:"right" }}>{count}×</span>
              </div>
            );
          })}
        </Card>
        <Card style={{ padding:"22px" }}>
          <div style={{ color:t.t1, fontWeight:700, fontSize:13, marginBottom:16 }}>Status dos Clientes</div>
          {[
            { label:"Ativos",       val:CLIENTS.filter(c=>c.status==="Ativo").length,     c:C.green,  bg:C.greenBg },
            { label:"Pausados",     val:CLIENTS.filter(c=>c.status==="Pausado").length,   c:C.amber,  bg:C.amberBg },
            { label:"Inadimplentes",val:CLIENTS.filter(c=>c.status==="Inadimpl.").length, c:C.red,    bg:C.redBg   },
          ].map((s,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 14px", background:t.bg3, borderRadius:9, marginBottom:8, border:`1px solid ${t.b1}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:s.c }}/>
                <span style={{ color:t.t2, fontSize:12 }}>{s.label}</span>
              </div>
              <span style={{ color:s.c, fontSize:18, fontWeight:800 }}>{s.val}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* Alertas rápidos + próximos vencimentos */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Card style={{ padding:"22px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div style={{ color:t.t1, fontWeight:700, fontSize:13 }}>Alertas Ativos</div>
            <Tag label={`${ALERTS_DATA.filter(a=>a.status==="Ativo").length} ativos`} color={C.red} bg={C.redBg}/>
          </div>
          {ALERTS_DATA.filter(a=>a.status==="Ativo").slice(0,4).map((a,i) => {
            const prio = { "Alta":{ c:C.red,bg:C.redBg },"Média":{ c:C.amber,bg:C.amberBg },"Baixa":{ c:"#888",bg:"rgba(128,128,128,.1)" } }[a.priority];
            return (
              <div key={a.id} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"10px 0", borderBottom:i<3?`1px solid ${t.b2}`:"none" }}>
                <Tag label={a.priority} color={prio.c} bg={prio.bg}/>
                <span style={{ color:t.t2, fontSize:12, lineHeight:1.5, flex:1 }}>{a.title}</span>
              </div>
            );
          })}
        </Card>
        <Card style={{ padding:"22px" }}>
          <div style={{ color:t.t1, fontWeight:700, fontSize:13, marginBottom:16 }}>Próximos Vencimentos</div>
          {RECEIPTS.filter(r=>r.status==="Pendente").slice(0,4).map((r,i) => (
            <div key={r.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:i<3?`1px solid ${t.b2}`:"none" }}>
              <div style={{ flex:1 }}>
                <div style={{ color:t.t1, fontSize:12, fontWeight:600 }}>{r.client}</div>
                <div style={{ color:t.t3, fontSize:11, marginTop:1 }}>{r.plan}</div>
              </div>
              <span style={{ color:t.t1, fontSize:13, fontWeight:800 }}>R${(r.value/1000).toFixed(1)}k</span>
              <Tag label={r.due} color={C.amber} bg={C.amberBg}/>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE: CLIENTES
═══════════════════════════════════════════════════ */
function ClientesPage() {
  const t = useT();
  const [filter, setFilter] = useState("Todos");
  const [selected, setSelected] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name:"",seg:"",plan:"Growth",email:"",phone:"",city:"",owner:"Rafael Lima" });
  const [search, setSearch] = useState("");

  const STATUS_OPTS = ["Todos","Ativo","Pausado","Inadimpl."];
  const filtered = CLIENTS.filter(c =>
    (filter==="Todos"||c.status===filter) &&
    (search===""||c.name.toLowerCase().includes(search.toLowerCase()))
  );

  const cl = selected ? CLIENTS.find(c=>c.id===selected) : null;

  return (
    <div>
      <PageHeader title="Clientes" sub={`${CLIENTS.length} clientes cadastrados · MRR total: R$${CLIENTS.filter(c=>c.status==="Ativo").reduce((s,c)=>s+c.mrr,0).toLocaleString("pt-BR")}`}
        action={<Btn onClick={()=>setAddOpen(true)}>+ Novo Cliente</Btn>}/>

      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18, flexWrap:"wrap" }}>
        <FilterBar opts={STATUS_OPTS} active={filter} onChange={setFilter} label="STATUS"/>
        <div style={{ flex:1 }}/>
        <div style={{ position:"relative" }}>
          <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:t.t3, fontSize:12 }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar cliente..." style={{ padding:"7px 10px 7px 30px", background:t.bg3, border:`1px solid ${t.b1}`, borderRadius:8, color:t.t1, fontSize:12, outline:"none", width:200 }}/>
        </div>
      </div>

      {/* Table */}
      <Card style={{ overflow:"hidden", marginBottom: selected?14:0 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 110px 90px 90px 100px 80px 50px", gap:12, padding:"9px 20px", background:t.bg3, borderBottom:`1px solid ${t.b1}` }}>
          {["Cliente","Segmento","Plano","MRR","Status","Score",""].map((h,i)=>(
            <span key={i} style={{ color:t.t4, fontSize:9, fontWeight:800, letterSpacing:1.4, textTransform:"uppercase" }}>{h}</span>
          ))}
        </div>
        {filtered.map((c,i) => {
          const pcolor = PLANS.find(p=>p.name===c.plan)?.color||"#888";
          const scoreC = c.score>=80?C.green:c.score>=60?C.amber:C.red;
          return (
            <div key={c.id} onClick={()=>setSelected(selected===c.id?null:c.id)}
              style={{ display:"grid", gridTemplateColumns:"1fr 110px 90px 90px 100px 80px 50px", gap:12, padding:"13px 20px", alignItems:"center",
                background:selected===c.id?t.bg3:t.bg2, borderTop:`1px solid ${t.b1}`, cursor:"pointer", transition:"background .14s" }}
              onMouseEnter={e=>{if(selected!==c.id)e.currentTarget.style.background=t.bg3}}
              onMouseLeave={e=>{if(selected!==c.id)e.currentTarget.style.background=t.bg2}}>
              <div>
                <div style={{ color:t.t1, fontSize:12, fontWeight:600 }}>{c.name}</div>
                <div style={{ color:t.t3, fontSize:10, marginTop:2 }}>{c.owner} · desde {c.start}</div>
              </div>
              <Tag label={c.seg} color={t.t2} bg={t.bg4}/>
              <Tag label={c.plan} color={pcolor} bg={`${pcolor}14`}/>
              <span style={{ color:t.t1, fontSize:12, fontWeight:700 }}>R${(c.mrr/1000).toFixed(1)}k</span>
              <StatusBadge s={c.status}/>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ flex:1, height:4, background:t.bg4, borderRadius:2, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${c.score}%`, background:scoreC, borderRadius:2 }}/>
                </div>
                <span style={{ color:scoreC, fontSize:10, fontWeight:700, width:24 }}>{c.score}</span>
              </div>
              <span style={{ color:t.t3, fontSize:12 }}>{selected===c.id?"▲":"▼"}</span>
            </div>
          );
        })}
      </Card>

      {/* Expanded client detail */}
      {cl && (
        <Card style={{ padding:"24px", animation:"fadeIn .2s ease" }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:20 }}>
            <div>
              <div style={{ color:t.t1, fontSize:18, fontWeight:800 }}>{cl.name}</div>
              <div style={{ color:t.t3, fontSize:12, marginTop:4 }}>{cl.seg} · {cl.city} · desde {cl.start}</div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <Btn v="ghost" sz="sm">✏ Editar</Btn>
              <Btn v="danger" sz="sm">⊘ Desativar</Btn>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
            {[
              { label:"Plano",          val:cl.plan,                  sub:null           },
              { label:"MRR",            val:`R$${cl.mrr.toLocaleString("pt-BR")}`, sub:"mensal" },
              { label:"Próx. Pagamento",val:cl.nextPay,               sub:null           },
              { label:"Growth Score",   val:cl.score,                 sub:"de 100"       },
            ].map((k,i) => (
              <div key={i} style={{ padding:"14px 16px", background:t.bg3, borderRadius:10, border:`1px solid ${t.b1}` }}>
                <div style={{ color:t.t3, fontSize:10, marginBottom:8 }}>{k.label}</div>
                <div style={{ color:t.t1, fontSize:18, fontWeight:800 }}>{k.val}</div>
                {k.sub && <div style={{ color:t.t4, fontSize:10 }}>{k.sub}</div>}
              </div>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <div>
              <div style={{ color:t.t3, fontSize:9, fontWeight:800, letterSpacing:1.8, textTransform:"uppercase", marginBottom:10 }}>CONTATO</div>
              {[
                { icon:"📧", val:cl.contact },
                { icon:"📞", val:cl.phone   },
                { icon:"📍", val:cl.city    },
                { icon:"👤", val:`Account: ${cl.owner}` },
              ].map((row,i) => (
                <div key={i} style={{ display:"flex", gap:10, padding:"7px 0", borderBottom:i<3?`1px solid ${t.b2}`:"none" }}>
                  <span style={{ fontSize:13 }}>{row.icon}</span>
                  <span style={{ color:t.t2, fontSize:12 }}>{row.val}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ color:t.t3, fontSize:9, fontWeight:800, letterSpacing:1.8, textTransform:"uppercase", marginBottom:10 }}>SERVIÇOS ATIVOS</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {cl.tags.map(tag => <Tag key={tag} label={tag} color={C.blue} bg={C.blueBg}/>)}
              </div>
              <div style={{ color:t.t3, fontSize:9, fontWeight:800, letterSpacing:1.8, textTransform:"uppercase", marginBottom:10, marginTop:16 }}>AÇÕES RÁPIDAS</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <Btn sz="sm">📊 Ver Relatório</Btn>
                <Btn v="ghost" sz="sm">💬 Notificar</Btn>
                <Btn v="ghost" sz="sm">📄 Gerar Fatura</Btn>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Add Client Modal */}
      <Modal open={addOpen} onClose={()=>setAddOpen(false)} title="Adicionar Novo Cliente">
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <FormField label="Nome da Empresa"><Input value={form.name} onChange={v=>setForm({...form,name:v})} placeholder="TechVision LTDA"/></FormField>
          <FormField label="Segmento"><Input value={form.seg} onChange={v=>setForm({...form,seg:v})} placeholder="Tecnologia"/></FormField>
          <FormField label="Email de Contato"><Input value={form.email} onChange={v=>setForm({...form,email:v})} placeholder="email@empresa.com"/></FormField>
          <FormField label="Telefone"><Input value={form.phone} onChange={v=>setForm({...form,phone:v})} placeholder="(11) 9 9999-9999"/></FormField>
          <FormField label="Cidade"><Input value={form.city} onChange={v=>setForm({...form,city:v})} placeholder="São Paulo"/></FormField>
          <FormField label="Plano"><Select value={form.plan} onChange={v=>setForm({...form,plan:v})} opts={["Starter","Growth","Pro","Scale"]}/></FormField>
          <FormField label="Account Manager" style={{ gridColumn:"1/-1" }}>
            <Select value={form.owner} onChange={v=>setForm({...form,owner:v})} opts={COLABS.map(c=>c.name)}/>
          </FormField>
        </div>
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:20 }}>
          <Btn v="ghost" onClick={()=>setAddOpen(false)}>Cancelar</Btn>
          <Btn onClick={()=>setAddOpen(false)}>Adicionar Cliente</Btn>
        </div>
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE: COLABORADORES
═══════════════════════════════════════════════════ */
function ColabsPage() {
  const t = useT();
  const [addOpen, setAddOpen] = useState(false);
  const [detailId, setDetailId] = useState(null);
  const cl = COLABS.find(c=>c.id===detailId);

  return (
    <div>
      <PageHeader title="Colaboradores" sub={`${COLABS.length} membros da equipe · ${COLABS.filter(c=>c.status==="Online").length} online agora`}
        action={<Btn onClick={()=>setAddOpen(true)}>+ Novo Colaborador</Btn>}/>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
        {COLABS.map(c => (
          <Card key={c.id} lift style={{ padding:"22px", cursor:"pointer" }} >
            <div onClick={()=>setDetailId(detailId===c.id?null:c.id)}>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
                <div style={{ position:"relative" }}>
                  <div style={{ width:48, height:48, borderRadius:"50%", background:t.bg4, border:`1px solid ${t.b1}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ color:t.t1, fontSize:14, fontWeight:800 }}>{c.avatar}</span>
                  </div>
                  <div style={{ position:"absolute", bottom:1, right:1, width:10, height:10, borderRadius:"50%",
                    background:c.status==="Online"?C.green:c.status==="Ausente"?C.amber:"#555",
                    border:`2px solid ${t.bg2}` }}/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ color:t.t1, fontSize:13, fontWeight:700 }}>{c.name}</div>
                  <div style={{ color:t.t3, fontSize:11, marginTop:2 }}>{c.role}</div>
                </div>
                <StatusBadge s={c.status}/>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:16 }}>
                {[
                  { label:"Clientes", val:c.clients },
                  { label:"Tarefas",  val:c.tasks   },
                  { label:"Perf.",    val:`${c.perf}%` },
                ].map((k,i) => (
                  <div key={i} style={{ textAlign:"center", padding:"10px 8px", background:t.bg3, borderRadius:8, border:`1px solid ${t.b1}` }}>
                    <div style={{ color:t.t1, fontSize:16, fontWeight:800 }}>{k.val}</div>
                    <div style={{ color:t.t3, fontSize:9, marginTop:2 }}>{k.label}</div>
                  </div>
                ))}
              </div>
              {/* Performance bar */}
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ color:t.t3, fontSize:10 }}>Performance</span>
                  <span style={{ color:c.perf>=90?C.green:c.perf>=75?C.amber:C.red, fontSize:10, fontWeight:700 }}>{c.perf}%</span>
                </div>
                <div style={{ height:4, background:t.bg4, borderRadius:2, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${c.perf}%`, background:c.perf>=90?C.green:c.perf>=75?C.amber:C.red, borderRadius:2 }}/>
                </div>
              </div>
            </div>

            {detailId===c.id && (
              <div style={{ marginTop:16, paddingTop:16, borderTop:`1px solid ${t.b1}` }}>
                <div style={{ color:t.t3, fontSize:10, marginBottom:6 }}>{c.email}</div>
                <div style={{ color:t.t3, fontSize:10, marginBottom:12 }}>Na equipe desde {c.joined}</div>
                <div style={{ display:"flex", gap:6 }}>
                  <Btn sz="sm" v="ghost">✏ Editar</Btn>
                  <Btn sz="sm" v="ghost">📋 Ver Tarefas</Btn>
                  <Btn sz="sm" v="danger">Desativar</Btn>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      <Modal open={addOpen} onClose={()=>setAddOpen(false)} title="Novo Colaborador">
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <FormField label="Nome Completo"><Input placeholder="Rafael Lima" value="" onChange={()=>{}}/></FormField>
          <FormField label="Cargo"><Input placeholder="Gestor de Tráfego" value="" onChange={()=>{}}/></FormField>
          <FormField label="Email"><Input placeholder="rafael@united.com.br" value="" onChange={()=>{}}/></FormField>
          <FormField label="Acesso"><Select value="Colaborador" onChange={()=>{}} opts={["Colaborador","Gestor","Admin"]}/></FormField>
        </div>
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:20 }}>
          <Btn v="ghost" onClick={()=>setAddOpen(false)}>Cancelar</Btn>
          <Btn onClick={()=>setAddOpen(false)}>Adicionar</Btn>
        </div>
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE: FINANCEIRO
═══════════════════════════════════════════════════ */
function FinanceiroPage() {
  const t = useT();
  const [tab, setTab] = useState("receber");
  const totalA = RECEIPTS.filter(r=>r.status==="Pendente").reduce((s,r)=>s+r.value,0);
  const totalR = RECEIPTS.filter(r=>r.status==="Pago").reduce((s,r)=>s+r.value,0);
  const totalV = RECEIPTS.filter(r=>r.status==="Vencido").reduce((s,r)=>s+r.value,0);
  const totalP = PAYMENTS.filter(p=>p.status==="Pendente").reduce((s,p)=>s+p.value,0);

  return (
    <div>
      <PageHeader title="Financeiro" sub="Recebimentos, pagamentos e fluxo de caixa da United."
        action={<div style={{ display:"flex", gap:8 }}><Btn v="ghost" sz="sm">↓ Exportar</Btn><Btn sz="sm">+ Lançamento</Btn></div>}/>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:16 }}>
        <KPICard label="MRR"              value={`R$${(CLIENTS.filter(c=>c.status==="Ativo").reduce((s,c)=>s+c.mrr,0)/1000).toFixed(1)}k`} delta="+12%" sub="Receita recorrente"/>
        <KPICard label="A Receber (Mar)"  value={`R$${(totalA/1000).toFixed(1)}k`} delta={null} sub={`${RECEIPTS.filter(r=>r.status==="Pendente").length} faturas`} accent={C.amber}/>
        <KPICard label="Recebido (Mar)"   value={`R$${(totalR/1000).toFixed(1)}k`} delta={null} sub="pago até hoje" accent={C.green}/>
        <KPICard label="Inadimplência"    value={`R$${totalV.toLocaleString("pt-BR")}`} delta={null} sub={`${RECEIPTS.filter(r=>r.status==="Vencido").length} vencida(s)`} accent={totalV>0?C.red:C.green}/>
      </div>

      {/* MRR Chart */}
      <Card style={{ padding:"22px", marginBottom:14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <div>
            <div style={{ color:t.t1, fontWeight:700, fontSize:13 }}>Evolução de MRR</div>
            <div style={{ color:t.t3, fontSize:11, marginTop:2 }}>Set 2024 → Mar 2025</div>
          </div>
          <span style={{ fontSize:10, fontWeight:700, color:C.green, background:C.greenBg, padding:"3px 9px", borderRadius:5 }}>+52% em 7 meses</span>
        </div>
        <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:80 }}>
          {MONTHLY.map((d,i) => {
            const max = Math.max(...MONTHLY.map(x=>x.mrr));
            const isLast = i===MONTHLY.length-1;
            const h = Math.max(6,(d.mrr/max)*68);
            return (
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                <div style={{ position:"relative", width:"100%", display:"flex", justifyContent:"center" }}>
                  {isLast && <div style={{ position:"absolute", bottom:"100%", marginBottom:4, background:t.bg4, border:`1px solid ${t.b1}`, borderRadius:4, padding:"2px 7px", color:t.t1, fontSize:9, fontWeight:700, whiteSpace:"nowrap" }}>R${(d.mrr/1000).toFixed(1)}k</div>}
                  <div style={{ width:"100%", borderRadius:"3px 3px 0 0", height:`${h}px`, background:isLast?t.accent:t.bg4, transition:"height .7s ease" }}/>
                </div>
                <span style={{ fontSize:9, color:t.t4 }}>{d.m}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Tabs */}
      <div style={{ display:"flex", gap:0, marginBottom:16, borderBottom:`1px solid ${t.b1}` }}>
        {[{ id:"receber",label:"A Receber" },{ id:"pagar",label:"A Pagar" }].map(tb => (
          <button key={tb.id} onClick={()=>setTab(tb.id)} style={{ padding:"8px 20px", background:"transparent", border:"none",
            borderBottom:tab===tb.id?`2px solid ${t.accent}`:"2px solid transparent",
            color:tab===tb.id?t.t1:t.t3, fontSize:13, fontWeight:700, cursor:"pointer", marginBottom:-1, transition:"all .18s" }}>
            {tb.label}
          </button>
        ))}
      </div>

      {tab==="receber" && (
        <Card style={{ overflow:"hidden" }}>
          <div style={{ display:"grid", gridTemplateColumns:"100px 1fr 90px 110px 100px 80px 80px", gap:12, padding:"9px 20px", background:t.bg3, borderBottom:`1px solid ${t.b1}` }}>
            {["ID","Cliente","Valor","Vencimento","Status","Plano",""].map((h,i)=>(
              <span key={i} style={{ color:t.t4, fontSize:9, fontWeight:800, letterSpacing:1.4, textTransform:"uppercase" }}>{h}</span>
            ))}
          </div>
          {RECEIPTS.map((r,i) => (
            <div key={r.id} style={{ display:"grid", gridTemplateColumns:"100px 1fr 90px 110px 100px 80px 80px", gap:12, padding:"13px 20px", alignItems:"center", borderTop:`1px solid ${t.b1}`, transition:"background .14s" }}
              onMouseEnter={e=>e.currentTarget.style.background=t.bg3}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <span style={{ color:t.t4, fontSize:10, fontWeight:700 }}>{r.id.split("-").slice(-1)[0]}</span>
              <div>
                <div style={{ color:t.t1, fontSize:12, fontWeight:600 }}>{r.client}</div>
                <div style={{ color:t.t4, fontSize:10 }}>{r.id}</div>
              </div>
              <span style={{ color:t.t1, fontSize:12, fontWeight:700 }}>R${(r.value/1000).toFixed(1)}k</span>
              <span style={{ color:t.t2, fontSize:12 }}>{r.due}</span>
              <StatusBadge s={r.status}/>
              <Tag label={r.plan} color={PLANS.find(p=>p.name===r.plan)?.color||"#888"} bg={`${PLANS.find(p=>p.name===r.plan)?.color||"#888"}14`}/>
              <div style={{ display:"flex", gap:5 }}>
                {r.status==="Pendente"&&<Btn v="success" sz="sm">✓</Btn>}
                <Btn v="ghost" sz="sm">↓</Btn>
              </div>
            </div>
          ))}
        </Card>
      )}

      {tab==="pagar" && (
        <Card style={{ overflow:"hidden" }}>
          <div style={{ display:"grid", gridTemplateColumns:"120px 1fr 100px 110px 100px 100px 80px", gap:12, padding:"9px 20px", background:t.bg3, borderBottom:`1px solid ${t.b1}` }}>
            {["ID","Descrição","Valor","Vencimento","Status","Categoria",""].map((h,i)=>(
              <span key={i} style={{ color:t.t4, fontSize:9, fontWeight:800, letterSpacing:1.4, textTransform:"uppercase" }}>{h}</span>
            ))}
          </div>
          {PAYMENTS.map((p,i) => (
            <div key={p.id} style={{ display:"grid", gridTemplateColumns:"120px 1fr 100px 110px 100px 100px 80px", gap:12, padding:"13px 20px", alignItems:"center", borderTop:`1px solid ${t.b1}`, transition:"background .14s" }}
              onMouseEnter={e=>e.currentTarget.style.background=t.bg3}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <span style={{ color:t.t4, fontSize:10 }}>{p.id.split("-").slice(-1)[0]}</span>
              <span style={{ color:t.t1, fontSize:12, fontWeight:600 }}>{p.desc}</span>
              <span style={{ color:t.t1, fontSize:12, fontWeight:700 }}>R${p.value.toLocaleString("pt-BR")}</span>
              <span style={{ color:t.t2, fontSize:12 }}>{p.due}</span>
              <StatusBadge s={p.status}/>
              <Tag label={p.cat} color={C.blue} bg={C.blueBg}/>
              <Btn v="ghost" sz="sm">↓</Btn>
            </div>
          ))}
          <div style={{ padding:"14px 20px", borderTop:`1px solid ${t.b1}`, background:t.bg3, display:"flex", justifyContent:"flex-end", gap:20 }}>
            <span style={{ color:t.t3, fontSize:11 }}>Total a pagar: <strong style={{ color:t.t1 }}>R${totalP.toLocaleString("pt-BR")}</strong></span>
          </div>
        </Card>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PRODUTOS — DATA
═══════════════════════════════════════════════════ */
const MKTG_PLANS = [
  {
    id:"starter", name:"Starter", price:1990, color:C.cyan,
    badge:"Ideal para começar",
    features:[
      "Gestão de 1 canal (Meta ou Google)",
      "4 criativos/mês",
      "Relatório mensal",
      "Suporte por email",
      "Dashboard do cliente",
    ],
  },
  {
    id:"growth", name:"Growth", price:3990, color:C.blue,
    badge:"Mais popular",
    features:[
      "Gestão de Meta Ads + Google Ads",
      "8 criativos/mês",
      "Relatórios quinzenais",
      "Reuniões quinzenais",
      "Suporte prioritário (WhatsApp)",
      "Dashboard com Analytics",
    ],
  },
  {
    id:"pro", name:"Pro", price:6990, color:C.purple,
    badge:"Para escalar",
    features:[
      "Multi-canal completo (Meta, Google, LinkedIn)",
      "16 criativos/mês",
      "Relatórios semanais",
      "Gestor de conta dedicado",
      "WhatsApp direto com o time",
      "CRM integrado",
      "Funil de vendas completo",
    ],
  },
  {
    id:"scale", name:"Scale", price:9990, color:C.amber,
    badge:"Alto crescimento",
    features:[
      "Tudo do plano Pro",
      "Produção de vídeo (2/mês)",
      "Automações de marketing",
      "Squad dedicado (3 pessoas)",
      "SLA garantido em contrato",
      "Estratégia trimestral",
      "Consultoria de marca inclusa",
    ],
  },
];

const FOOD_PLANS = [
  {
    id:"food-essencial", name:"Food Essencial", price:1490, color:C.orange,
    badge:"Para começar",
    features:[
      "Gestão de perfil no Instagram",
      "12 posts/mês (foto + legenda)",
      "Stories diários",
      "Gestão de Google Meu Negócio",
      "Relatório mensal",
    ],
  },
  {
    id:"food-delivery", name:"Food Delivery", price:2490, color:C.amber,
    badge:"Foco em delivery",
    features:[
      "Tudo do Essencial",
      "Campanhas Meta Ads (iFood/Rappi)",
      "Design de cardápio digital",
      "Reels e vídeos de produto (4/mês)",
      "Gestão de avaliações online",
      "Relatório quinzenal",
    ],
  },
  {
    id:"food-premium", name:"Food Premium", price:3990, color:C.pink,
    badge:"Restaurante completo",
    features:[
      "Tudo do Delivery",
      "Produção fotográfica mensal",
      "Google Ads + Maps",
      "Estratégia de fidelização",
      "Campanha de datas sazonais",
      "Gestor dedicado",
      "Suporte via WhatsApp",
    ],
  },
  {
    id:"food-franquia", name:"Food Franquia", price:7990, color:C.red,
    badge:"Multi-unidades",
    features:[
      "Gestão de até 5 unidades",
      "Squad criativo dedicado",
      "Campanhas geo-segmentadas",
      "Sistema de identidade visual",
      "Relatórios por unidade",
      "Reunião estratégica mensal",
      "Suporte 7 dias/semana",
    ],
  },
];

const IA_PRODUCTS = [
  {
    id:"sdr-ia", name:"SDR com IA", icon:"🤖", color:C.blue,
    type:"Software",
    desc:"Agente de prospecção ativa que qualifica leads 24/7 via WhatsApp, email e LinkedIn.",
    price:"A partir de R$1.990/mês",
    features:["Prospecção automatizada","Qualificação por IA","Integração com CRM","Relatórios de conversão","Setup em 7 dias"],
  },
  {
    id:"bdr-ia", name:"BDR com IA", icon:"📡", color:C.purple,
    type:"Software",
    desc:"Inteligência de negócios que identifica oportunidades e enriquece dados de prospects.",
    price:"A partir de R$2.490/mês",
    features:["Mapeamento de mercado","Enriquecimento de dados","Alertas de oportunidade","Integração com LinkedIn","API aberta"],
  },
  {
    id:"atendimento-ia", name:"Atendimento com IA", icon:"💬", color:C.cyan,
    type:"Software",
    desc:"Central de atendimento ao cliente com IA para WhatsApp, Instagram e site.",
    price:"A partir de R$1.490/mês",
    features:["Chatbot treinado","Atendimento 24/7","Escalada para humanos","Análise de sentimento","Multicanal"],
  },
  {
    id:"contabil-ia", name:"Sistema Contábil IA", icon:"📊", color:C.green,
    type:"Sistema",
    desc:"Plataforma contábil com automação inteligente para controle fiscal e financeiro.",
    price:"A partir de R$990/mês",
    features:["Emissão de NF automática","Conciliação bancária IA","DRE em tempo real","Integração com contadores","Alerta fiscal"],
  },
  {
    id:"personalizado", name:"Sistema Personalizado", icon:"⚙", color:C.amber,
    type:"Desenvolvimento",
    desc:"Desenvolvimento de software sob medida para as necessidades específicas do seu negócio.",
    price:"Sob consulta",
    features:["Levantamento de requisitos","UX/UI personalizado","Desenvolvimento ágil","Integrações customizadas","Suporte contínuo"],
  },
];

const CRM_PLANS = [
  {
    id:"crm-start", name:"CRM Start", price:490, color:C.cyan,
    users:3,
    features:["Até 3 usuários","500 contatos","Pipeline de vendas","Tarefas e follow-ups","App mobile"],
  },
  {
    id:"crm-business", name:"CRM Business", price:990, color:C.blue,
    users:10,
    features:["Até 10 usuários","Contatos ilimitados","Multi-pipelines","Automações básicas","Relatórios avançados","Integração WhatsApp"],
  },
  {
    id:"crm-enterprise", name:"CRM Enterprise", price:1990, color:C.purple,
    users:999,
    features:["Usuários ilimitados","Módulo de propostas","Automações avançadas","IA de previsão de vendas","API completa","Suporte dedicado","Onboarding personalizado"],
  },
];

/* ═══════════════════════════════════════════════════
   PAGE: PRODUTOS
═══════════════════════════════════════════════════ */
function ProdutosPage() {
  const t = useT();
  const [section, setSection] = useState("marketing");
  const [addOpen, setAddOpen]   = useState(false);
  const [editItem, setEditItem] = useState(null);

  const SECTIONS = [
    { id:"marketing", label:"Planos de Marketing", icon:"◈", color:C.blue    },
    { id:"food",      label:"United Food",          icon:"◉", color:C.orange  },
    { id:"ia",        label:"United IA",             icon:"◆", color:C.purple  },
    { id:"crm",       label:"CRM United",            icon:"◇", color:C.cyan    },
  ];

  /* --- reusable plan card for marketing & food --- */
  function PlanCard({ p }) {
    const [h, setH] = useState(false);
    return (
      <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
        style={{ background:t.bg2, border:`1px solid ${h?p.color+"55":t.b1}`,
          borderTop:`3px solid ${p.color}`, borderRadius:12, padding:"26px 24px",
          transition:"all .2s", boxShadow:h?`0 8px 28px ${t.sh}`:"none",
          transform:h?"translateY(-2px)":"none", display:"flex", flexDirection:"column" }}>
        {/* header */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:6 }}>
          <div style={{ color:t.t1, fontSize:17, fontWeight:800 }}>{p.name}</div>
          {p.badge && (
            <span style={{ fontSize:9, fontWeight:700, padding:"3px 9px", borderRadius:5,
              color:p.color, background:`${p.color}14`, border:`1px solid ${p.color}22`,
              letterSpacing:.5, textTransform:"uppercase" }}>
              {p.badge}
            </span>
          )}
        </div>
        <div style={{ color:p.color, fontSize:22, fontWeight:800, marginBottom:18 }}>
          R${p.price.toLocaleString("pt-BR")}
          <span style={{ color:t.t3, fontSize:12, fontWeight:400 }}>/mês</span>
        </div>
        {/* features */}
        <div style={{ flex:1, marginBottom:20 }}>
          {p.features.map((f,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:9, padding:"6px 0",
              borderBottom:i<p.features.length-1?`1px solid ${t.b2}`:"none" }}>
              <span style={{ color:p.color, fontSize:10, fontWeight:800, flexShrink:0 }}>✓</span>
              <span style={{ color:t.t2, fontSize:12 }}>{f}</span>
            </div>
          ))}
        </div>
        {/* actions */}
        <div style={{ display:"flex", gap:8, paddingTop:16, borderTop:`1px solid ${t.b1}` }}>
          <Btn sz="sm" onClick={()=>setEditItem(p)}>✏ Editar</Btn>
          <Btn v="ghost" sz="sm">👁 Clientes</Btn>
          <Btn v="danger" sz="sm">⊘</Btn>
        </div>
      </div>
    );
  }

  /* --- IA product card --- */
  function IaCard({ p }) {
    const [h, setH] = useState(false);
    return (
      <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
        style={{ background:t.bg2, border:`1px solid ${h?p.color+"55":t.b1}`,
          borderRadius:12, padding:"24px", transition:"all .2s",
          boxShadow:h?`0 8px 28px ${t.sh}`:"none", transform:h?"translateY(-2px)":"none" }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:14, marginBottom:16 }}>
          <div style={{ width:48, height:48, borderRadius:13, background:`${p.color}14`,
            border:`1px solid ${p.color}22`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <span style={{ fontSize:22 }}>{p.icon}</span>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
              <span style={{ color:t.t1, fontSize:14, fontWeight:800 }}>{p.name}</span>
              <Tag label={p.type} color={p.color} bg={`${p.color}14`}/>
            </div>
            <div style={{ color:t.t3, fontSize:11, lineHeight:1.6 }}>{p.desc}</div>
          </div>
        </div>
        <div style={{ padding:"10px 14px", background:t.bg3, borderRadius:8, border:`1px solid ${t.b1}`,
          marginBottom:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ color:t.t2, fontSize:11 }}>Investimento</span>
          <span style={{ color:p.color, fontSize:13, fontWeight:800 }}>{p.price}</span>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:16 }}>
          {p.features.map((f,i) => (
            <span key={i} style={{ fontSize:10, fontWeight:600, padding:"3px 10px", borderRadius:5,
              background:t.bg3, color:t.t2, border:`1px solid ${t.b1}` }}>{f}</span>
          ))}
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <Btn sz="sm">Ver Detalhes</Btn>
          <Btn v="ghost" sz="sm">✏ Editar</Btn>
        </div>
      </div>
    );
  }

  /* --- CRM card --- */
  function CrmCard({ p }) {
    const [h, setH] = useState(false);
    return (
      <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
        style={{ background:t.bg2, border:`1px solid ${h?p.color+"55":t.b1}`,
          borderTop:`3px solid ${p.color}`, borderRadius:12, padding:"26px 24px",
          transition:"all .2s", boxShadow:h?`0 8px 28px ${t.sh}`:"none",
          transform:h?"translateY(-2px)":"none", display:"flex", flexDirection:"column" }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:6 }}>
          <div style={{ color:t.t1, fontSize:17, fontWeight:800 }}>{p.name}</div>
          <Tag label={p.users===999?"Ilimitado":`${p.users} usuários`} color={p.color} bg={`${p.color}14`}/>
        </div>
        <div style={{ color:p.color, fontSize:22, fontWeight:800, marginBottom:18 }}>
          R${p.price.toLocaleString("pt-BR")}
          <span style={{ color:t.t3, fontSize:12, fontWeight:400 }}>/mês</span>
        </div>
        <div style={{ flex:1, marginBottom:20 }}>
          {p.features.map((f,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:9, padding:"6px 0",
              borderBottom:i<p.features.length-1?`1px solid ${t.b2}`:"none" }}>
              <span style={{ color:p.color, fontSize:10, fontWeight:800, flexShrink:0 }}>✓</span>
              <span style={{ color:t.t2, fontSize:12 }}>{f}</span>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", gap:8, paddingTop:16, borderTop:`1px solid ${t.b1}` }}>
          <Btn sz="sm">✏ Editar</Btn>
          <Btn v="ghost" sz="sm">👁 Clientes</Btn>
        </div>
      </div>
    );
  }

  const active = SECTIONS.find(s=>s.id===section);

  return (
    <div>
      <PageHeader title="Produtos" sub="Gerencie todos os produtos e planos oferecidos pela United."
        action={<Btn onClick={()=>setAddOpen(true)}>+ Novo Produto</Btn>}/>

      {/* Section switcher */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:28 }}>
        {SECTIONS.map(s => {
          const isActive = section===s.id;
          return (
            <div key={s.id} onClick={()=>setSection(s.id)} style={{
              padding:"18px 20px", borderRadius:12, cursor:"pointer",
              background:isActive?`${s.color}0e`:t.bg2,
              border:isActive?`1px solid ${s.color}40`:`1px solid ${t.b1}`,
              transition:"all .18s", display:"flex", alignItems:"center", gap:12 }}
              onMouseEnter={e=>{ if(!isActive){ e.currentTarget.style.background=t.bg3; e.currentTarget.style.borderColor=t.bHi; }}}
              onMouseLeave={e=>{ if(!isActive){ e.currentTarget.style.background=t.bg2; e.currentTarget.style.borderColor=t.b1; }}}>
              <div style={{ width:36, height:36, borderRadius:10, background:isActive?`${s.color}1a`:t.bg4,
                border:`1px solid ${isActive?s.color+"30":t.b1}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ color:isActive?s.color:t.t3, fontSize:15 }}>{s.icon}</span>
              </div>
              <div>
                <div style={{ color:isActive?t.t1:t.t2, fontSize:12, fontWeight:700 }}>{s.label}</div>
                <div style={{ color:isActive?s.color:t.t4, fontSize:10, marginTop:2, fontWeight:600 }}>
                  {s.id==="marketing"?`${MKTG_PLANS.length} planos`:
                   s.id==="food"?`${FOOD_PLANS.length} planos`:
                   s.id==="ia"?`${IA_PRODUCTS.length} produtos`:
                   `${CRM_PLANS.length} planos`}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section header strip */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:22,
        padding:"14px 20px", background:`${active.color}08`, border:`1px solid ${active.color}22`,
        borderRadius:10 }}>
        <span style={{ color:active.color, fontSize:20 }}>{active.icon}</span>
        <div>
          <div style={{ color:t.t1, fontSize:14, fontWeight:800 }}>{active.label}</div>
          <div style={{ color:t.t3, fontSize:11 }}>
            {section==="marketing" && "Planos de tráfego pago e marketing digital para empresas de todos os tamanhos."}
            {section==="food"      && "Marketing especializado para restaurantes, bares, deliveries e franquias alimentícias."}
            {section==="ia"        && "Soluções de software com inteligência artificial para automatizar e escalar o seu negócio."}
            {section==="crm"       && "CRM próprio da United para gestão de relacionamento, pipeline e automação de vendas."}
          </div>
        </div>
        <div style={{ flex:1 }}/>
        <Btn v="ghost" sz="sm">↓ Exportar Tabela</Btn>
        <Btn sz="sm" onClick={()=>setAddOpen(true)}>+ Adicionar</Btn>
      </div>

      {/* MARKETING PLANS */}
      {section==="marketing" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
          {MKTG_PLANS.map(p => <PlanCard key={p.id} p={p}/>)}
        </div>
      )}

      {/* UNITED FOOD */}
      {section==="food" && (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
            {FOOD_PLANS.map(p => <PlanCard key={p.id} p={p}/>)}
          </div>
          {/* Diferenciais */}
          <Card style={{ padding:"24px" }}>
            <div style={{ color:t.t3, fontSize:9, fontWeight:800, letterSpacing:2, textTransform:"uppercase", marginBottom:16 }}>
              DIFERENCIAIS UNITED FOOD
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
              {[
                { icon:"📸", title:"Fotografia de produto",    desc:"Sessão fotográfica mensal de pratos e ambiente incluída nos planos Premium e Franquia." },
                { icon:"📍", title:"Google Maps otimizado",    desc:"Gestão e otimização de ficha do Google Meu Negócio para atrair clientes próximos." },
                { icon:"🍕", title:"Calendário sazonal",       desc:"Campanhas temáticas prontas para datas como Dia dos Namorados, Natal e Copa." },
                { icon:"⭐", title:"Gestão de reputação",      desc:"Monitoramento e resposta a avaliações no Google, iFood e Reclame Aqui." },
              ].map((d,i) => (
                <div key={i} style={{ padding:"18px", background:t.bg3, borderRadius:10, border:`1px solid ${t.b1}` }}>
                  <span style={{ fontSize:24 }}>{d.icon}</span>
                  <div style={{ color:t.t1, fontSize:12, fontWeight:700, margin:"10px 0 5px" }}>{d.title}</div>
                  <div style={{ color:t.t3, fontSize:11, lineHeight:1.6 }}>{d.desc}</div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {/* UNITED IA */}
      {section==="ia" && (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12, marginBottom:24 }}>
            {IA_PRODUCTS.map(p => <IaCard key={p.id} p={p}/>)}
          </div>
          {/* Como funciona */}
          <Card style={{ padding:"24px" }}>
            <div style={{ color:t.t3, fontSize:9, fontWeight:800, letterSpacing:2, textTransform:"uppercase", marginBottom:18 }}>
              COMO FUNCIONA A IMPLEMENTAÇÃO
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:0 }}>
              {[
                { n:"01", label:"Briefing",     desc:"Levantamento de processos e objetivos do cliente" },
                { n:"02", label:"Configuração", desc:"Setup e treinamento do sistema com dados reais"    },
                { n:"03", label:"Integração",   desc:"Conexão com ferramentas já usadas pelo cliente"    },
                { n:"04", label:"Teste",        desc:"Período piloto de 15 dias com acompanhamento"      },
                { n:"05", label:"Go live",      desc:"Ativação completa e suporte contínuo"              },
              ].map((s,i) => (
                <div key={i} style={{ textAlign:"center", padding:"18px 12px", position:"relative" }}>
                  {i<4 && <div style={{ position:"absolute", right:0, top:"50%", transform:"translateY(-50%)", color:t.t4, fontSize:16 }}>→</div>}
                  <div style={{ width:36, height:36, borderRadius:"50%", background:C.purpleBg, border:`1px solid ${C.purple}30`,
                    display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 10px" }}>
                    <span style={{ color:C.purple, fontSize:11, fontWeight:800 }}>{s.n}</span>
                  </div>
                  <div style={{ color:t.t1, fontSize:12, fontWeight:700, marginBottom:5 }}>{s.label}</div>
                  <div style={{ color:t.t3, fontSize:10, lineHeight:1.5 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {/* CRM UNITED */}
      {section==="crm" && (
        <>
          {/* Highlight bar */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
            {[
              { label:"Clientes usando CRM",  val:"3",      c:C.cyan   },
              { label:"MRR do CRM",           val:"R$3,9k", c:C.green  },
              { label:"Usuários ativos",       val:"12",     c:C.blue   },
              { label:"NPS médio",             val:"9.2",    c:C.amber  },
            ].map((k,i) => (
              <div key={i} style={{ padding:"18px 20px", background:t.bg2, borderRadius:12, border:`1px solid ${t.b1}`, display:"flex", alignItems:"center", gap:14 }}>
                <span style={{ color:k.c, fontSize:22, fontWeight:800 }}>{k.val}</span>
                <span style={{ color:t.t2, fontSize:11 }}>{k.label}</span>
              </div>
            ))}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:24 }}>
            {CRM_PLANS.map(p => <CrmCard key={p.id} p={p}/>)}
          </div>

          {/* Features overview */}
          <Card style={{ padding:"26px" }}>
            <div style={{ color:t.t3, fontSize:9, fontWeight:800, letterSpacing:2, textTransform:"uppercase", marginBottom:20 }}>
              FUNCIONALIDADES DO CRM UNITED
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
              {[
                { icon:"📋", title:"Pipeline Visual",         desc:"Visualize e gerencie cada etapa do funil de vendas em tempo real." },
                { icon:"🤖", title:"Automações Inteligentes", desc:"Crie fluxos automáticos de follow-up, tarefas e notificações." },
                { icon:"📊", title:"Relatórios de Vendas",    desc:"Dashboards com métricas de conversão, ticket médio e ciclo de venda." },
                { icon:"💬", title:"WhatsApp Integrado",      desc:"Envie e receba mensagens de dentro do CRM sem trocar de tela." },
                { icon:"🎯", title:"Lead Scoring",            desc:"IA que pontua e prioriza automaticamente os leads mais quentes." },
                { icon:"🔗", title:"Integrações Nativas",     desc:"Conecta com Meta Ads, Google, email, planilhas e muito mais." },
              ].map((f,i) => (
                <div key={i} style={{ display:"flex", gap:14, padding:"16px", background:t.bg3, borderRadius:10, border:`1px solid ${t.b1}` }}>
                  <div style={{ width:38, height:38, borderRadius:10, background:C.cyanBg, border:`1px solid ${C.cyan}22`,
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <span style={{ fontSize:18 }}>{f.icon}</span>
                  </div>
                  <div>
                    <div style={{ color:t.t1, fontSize:12, fontWeight:700, marginBottom:4 }}>{f.title}</div>
                    <div style={{ color:t.t3, fontSize:11, lineHeight:1.6 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {/* Add/Edit Modal */}
      <Modal open={addOpen} onClose={()=>{ setAddOpen(false); setEditItem(null); }}
        title={editItem?`Editar — ${editItem.name}`:"Novo Produto / Plano"}>
        <FormField label="Categoria">
          <Select value={section==="marketing"?"Planos de Marketing":section==="food"?"United Food":section==="ia"?"United IA":"CRM United"}
            onChange={()=>{}} opts={["Planos de Marketing","United Food","United IA","CRM United"]}/>
        </FormField>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <FormField label="Nome"><Input value={editItem?.name||""} onChange={()=>{}} placeholder="Ex: Growth Plus"/></FormField>
          <FormField label="Preço (R$)"><Input type="number" value={editItem?.price||""} onChange={()=>{}} placeholder="4990"/></FormField>
        </div>
        <FormField label="Destaque / Badge"><Input value={editItem?.badge||""} onChange={()=>{}} placeholder="Ex: Mais popular"/></FormField>
        <FormField label="Recursos (um por linha)">
          <textarea rows={5} defaultValue={editItem?.features?.join("\n")||""} placeholder={"Feature 1\nFeature 2\nFeature 3"}
            style={{ width:"100%", padding:"10px 14px", background:t.bg3, border:`1px solid ${t.b1}`, borderRadius:9, color:t.t1, fontSize:12, outline:"none", resize:"vertical", lineHeight:1.6 }}/>
        </FormField>
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:4 }}>
          <Btn v="ghost" onClick={()=>{ setAddOpen(false); setEditItem(null); }}>Cancelar</Btn>
          <Btn onClick={()=>{ setAddOpen(false); setEditItem(null); }}>{editItem?"Salvar Alterações":"Criar Produto"}</Btn>
        </div>
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE: ALERTAS
═══════════════════════════════════════════════════ */
function AlertasPage() {
  const t = useT();
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ title:"", type:"Performance", priority:"Média", target:"Interno" });
  const [filter, setFilter] = useState("Todos");

  const items = filter==="Todos" ? ALERTS_DATA : ALERTS_DATA.filter(a=>a.status===filter);
  const PRIO_C = { "Alta":{ c:C.red,bg:C.redBg },"Média":{ c:C.amber,bg:C.amberBg },"Baixa":{ c:"#888",bg:"rgba(128,128,128,.1)" } };
  const TYPE_C = { "Financeiro":C.red,"Risco":C.orange,"Performance":C.blue,"Contrato":C.purple,"Comercial":C.green };

  return (
    <div>
      <PageHeader title="Alertas" sub="Monitore riscos, oportunidades e pendências críticas."
        action={<Btn onClick={()=>setAddOpen(true)}>+ Criar Alerta</Btn>}/>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:22 }}>
        {[
          { label:"Ativos",    val:ALERTS_DATA.filter(a=>a.status==="Ativo").length,    c:C.red,   bg:C.redBg   },
          { label:"Alta Prioridade", val:ALERTS_DATA.filter(a=>a.priority==="Alta"&&a.status==="Ativo").length, c:C.orange,bg:C.orangeBg },
          { label:"Resolvidos",val:ALERTS_DATA.filter(a=>a.status==="Resolvido").length,c:C.green, bg:C.greenBg },
        ].map((s,i) => (
          <Card key={i} style={{ padding:"18px 22px", display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ color:s.c, fontSize:20, fontWeight:800 }}>{s.val}</span>
            </div>
            <span style={{ color:t.t2, fontSize:13, fontWeight:600 }}>{s.label}</span>
          </Card>
        ))}
      </div>

      <div style={{ marginBottom:18 }}>
        <FilterBar opts={["Todos","Ativo","Resolvido"]} active={filter} onChange={setFilter} label="STATUS"/>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {items.map(a => {
          const prio = PRIO_C[a.priority];
          const tc = TYPE_C[a.type]||"#888";
          return (
            <Card key={a.id} style={{ padding:"18px 22px", display:"flex", alignItems:"center", gap:16 }}>
              <div style={{ width:4, alignSelf:"stretch", borderRadius:2, background:prio.c, flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                  <Tag label={a.type}     color={tc}     bg={`${tc}14`}/>
                  <Tag label={a.priority} color={prio.c} bg={prio.bg}/>
                  <Tag label={a.target}   color={t.t2}   bg={t.bg4}/>
                </div>
                <div style={{ color:t.t1, fontSize:13, fontWeight:600 }}>{a.title}</div>
                <div style={{ color:t.t4, fontSize:10, marginTop:3 }}>Criado em {a.created}</div>
              </div>
              <StatusBadge s={a.status}/>
              <div style={{ display:"flex", gap:6 }}>
                {a.status==="Ativo" && <Btn v="success" sz="sm">✓ Resolver</Btn>}
                <Btn v="ghost" sz="sm">✏</Btn>
                <Btn v="danger" sz="sm">✕</Btn>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal open={addOpen} onClose={()=>setAddOpen(false)} title="Criar Novo Alerta">
        <FormField label="Título do Alerta"><Input value={form.title} onChange={v=>setForm({...form,title:v})} placeholder="Descreva o alerta..."/></FormField>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <FormField label="Tipo"><Select value={form.type} onChange={v=>setForm({...form,type:v})} opts={["Performance","Financeiro","Risco","Contrato","Comercial"]}/></FormField>
          <FormField label="Prioridade"><Select value={form.priority} onChange={v=>setForm({...form,priority:v})} opts={["Alta","Média","Baixa"]}/></FormField>
          <FormField label="Target"><Select value={form.target} onChange={v=>setForm({...form,target:v})} opts={["Interno","Cliente","Todos"]}/></FormField>
          <FormField label="Cliente (se aplicável)"><Select value="" onChange={()=>{}} opts={["—",...CLIENTS.map(c=>c.name)]}/></FormField>
        </div>
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:8 }}>
          <Btn v="ghost" onClick={()=>setAddOpen(false)}>Cancelar</Btn>
          <Btn onClick={()=>setAddOpen(false)}>Criar Alerta</Btn>
        </div>
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE: NOTIFICAÇÕES
═══════════════════════════════════════════════════ */
function NotificacoesPage() {
  const t = useT();
  const [tab, setTab] = useState("nova");
  const [form, setForm] = useState({ title:"", body:"", target:"Todos os clientes", channel:"Email", schedule:"Agora" });
  const CH_COLOR = { "Email":C.blue,"Plataforma":C.purple,"WhatsApp":C.green };

  return (
    <div>
      <PageHeader title="Notificações" sub="Envie comunicados, alertas e atualizações para os clientes."/>

      <div style={{ display:"flex", gap:0, marginBottom:24, borderBottom:`1px solid ${t.b1}` }}>
        {[{ id:"nova",label:"Nova Notificação" },{ id:"historico",label:"Histórico" }].map(tb => (
          <button key={tb.id} onClick={()=>setTab(tb.id)} style={{ padding:"8px 20px", background:"transparent", border:"none",
            borderBottom:tab===tb.id?`2px solid ${t.accent}`:"2px solid transparent",
            color:tab===tb.id?t.t1:t.t3, fontSize:13, fontWeight:700, cursor:"pointer", marginBottom:-1, transition:"all .18s" }}>
            {tb.label}
          </button>
        ))}
      </div>

      {tab==="nova" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:14 }}>
          {/* Form */}
          <Card style={{ padding:"28px" }}>
            <div style={{ color:t.t1, fontSize:14, fontWeight:700, marginBottom:22 }}>Compor Notificação</div>
            <FormField label="Título">
              <Input value={form.title} onChange={v=>setForm({...form,title:v})} placeholder="Ex: Relatório de Março disponível"/>
            </FormField>
            <FormField label="Mensagem">
              <textarea value={form.body} onChange={e=>setForm({...form,body:e.target.value})} rows={5}
                placeholder="Escreva a mensagem que será enviada aos clientes..."
                style={{ width:"100%", padding:"10px 14px", background:t.bg3, border:`1px solid ${t.b1}`, borderRadius:9, color:t.t1, fontSize:12, outline:"none", resize:"vertical", lineHeight:1.6 }}/>
            </FormField>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <FormField label="Destinatário">
                <Select value={form.target} onChange={v=>setForm({...form,target:v})}
                  opts={["Todos os clientes","Planos Growth+","Planos Pro+","Cliente específico",...CLIENTS.map(c=>c.name)]}/>
              </FormField>
              <FormField label="Canal">
                <Select value={form.channel} onChange={v=>setForm({...form,channel:v})} opts={["Email","Plataforma","WhatsApp"]}/>
              </FormField>
              <FormField label="Envio">
                <Select value={form.schedule} onChange={v=>setForm({...form,schedule:v})} opts={["Agora","Agendar para amanhã","Agendar para segunda-feira"]}/>
              </FormField>
              <FormField label="Prioridade">
                <Select value="Normal" onChange={()=>{}} opts={["Normal","Alta","Urgente"]}/>
              </FormField>
            </div>
            <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:8 }}>
              <Btn v="ghost">Pré-visualizar</Btn>
              <Btn>📨 Enviar Notificação</Btn>
            </div>
          </Card>

          {/* Preview */}
          <div>
            <Card style={{ padding:"22px", marginBottom:12 }}>
              <div style={{ color:t.t3, fontSize:9, fontWeight:800, letterSpacing:2, textTransform:"uppercase", marginBottom:14 }}>PRÉ-VISUALIZAÇÃO</div>
              <div style={{ background:t.bg3, borderRadius:10, border:`1px solid ${t.b1}`, padding:"18px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                  <div style={{ width:28, height:28, borderRadius:7, background:t.accent, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ color:t.accentTxt, fontSize:11, fontWeight:800 }}>U</span>
                  </div>
                  <div>
                    <div style={{ color:t.t1, fontSize:11, fontWeight:700 }}>United Growth Hub</div>
                    <div style={{ color:t.t3, fontSize:10 }}>via {form.channel}</div>
                  </div>
                </div>
                <div style={{ color:t.t1, fontSize:13, fontWeight:700, marginBottom:8 }}>{form.title||"Título da notificação"}</div>
                <div style={{ color:t.t2, fontSize:12, lineHeight:1.6 }}>{form.body||"Mensagem aparecerá aqui..."}</div>
                <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${t.b1}` }}>
                  <div style={{ color:t.t3, fontSize:10 }}>Para: <strong style={{ color:t.t2 }}>{form.target}</strong></div>
                </div>
              </div>
            </Card>
            <Card style={{ padding:"20px" }}>
              <div style={{ color:t.t3, fontSize:9, fontWeight:800, letterSpacing:2, textTransform:"uppercase", marginBottom:14 }}>ALCANCE ESTIMADO</div>
              {[
                { label:"Clientes atingidos", val: form.target==="Todos os clientes" ? CLIENTS.length : form.target.includes("Growth") ? 6 : 3 },
                { label:"Taxa de abertura",   val:"~82%"  },
                { label:"Engajamento médio",  val:"~64%"  },
              ].map((k,i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:i<2?`1px solid ${t.b1}`:"none" }}>
                  <span style={{ color:t.t2, fontSize:12 }}>{k.label}</span>
                  <span style={{ color:t.t1, fontSize:12, fontWeight:700 }}>{k.val}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {tab==="historico" && (
        <div>
          <Card style={{ overflow:"hidden" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 160px 110px 100px 80px", gap:12, padding:"9px 20px", background:t.bg3, borderBottom:`1px solid ${t.b1}` }}>
              {["Notificação","Destinatário","Canal","Data","Leituras"].map((h,i)=>(
                <span key={i} style={{ color:t.t4, fontSize:9, fontWeight:800, letterSpacing:1.4, textTransform:"uppercase" }}>{h}</span>
              ))}
            </div>
            {NOTIFS_SENT.map((n,i) => (
              <div key={n.id} style={{ display:"grid", gridTemplateColumns:"1fr 160px 110px 100px 80px", gap:12, padding:"13px 20px", alignItems:"center", borderTop:`1px solid ${t.b1}`, transition:"background .14s" }}
                onMouseEnter={e=>e.currentTarget.style.background=t.bg3}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{ color:t.t1, fontSize:12, fontWeight:600 }}>{n.title}</div>
                <span style={{ color:t.t2, fontSize:12 }}>{n.target}</span>
                <Tag label={n.channel} color={CH_COLOR[n.channel]||"#888"} bg={`${CH_COLOR[n.channel]||"#888"}14`}/>
                <span style={{ color:t.t3, fontSize:12 }}>{n.date}</span>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ color:t.t1, fontSize:13, fontWeight:700 }}>{n.reads}</span>
                  <span style={{ color:t.t3, fontSize:10 }}>/{n.target==="Todos os clientes"?CLIENTS.length:1}</span>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE: RELATÓRIOS ADM
═══════════════════════════════════════════════════ */
function RelatoriosAdmPage() {
  const t = useT();
  const [genOpen, setGenOpen] = useState(false);

  const REL_TYPES = [
    { id:1, label:"Relatório de Receita",    desc:"MRR, ARR, churn e crescimento",          icon:"◇", color:C.green,  period:"Mar 2025" },
    { id:2, label:"Relatório de Clientes",   desc:"Status, growth score e saúde da base",   icon:"◎", color:C.blue,   period:"Mar 2025" },
    { id:3, label:"Relatório de Equipe",     desc:"Performance e carga de trabalho",         icon:"◈", color:C.purple, period:"Mar 2025" },
    { id:4, label:"Relatório de Churn",      desc:"Análise de riscos e cancelamentos",       icon:"◉", color:C.red,    period:"Mar 2025" },
    { id:5, label:"Relatório Comercial",     desc:"Pipeline, upsells e novas aquisições",    icon:"◆", color:C.amber,  period:"Mar 2025" },
    { id:6, label:"Relatório Operacional",   desc:"Entregas, prazos e produtividade",        icon:"◻", color:C.cyan,   period:"Mar 2025" },
  ];

  return (
    <div>
      <PageHeader title="Relatórios" sub="Relatórios consolidados da United — visão da agência."
        action={<div style={{ display:"flex", gap:8 }}><Btn v="ghost" sz="sm">⚙ Configurar</Btn><Btn onClick={()=>setGenOpen(true)}>+ Gerar Relatório</Btn></div>}/>

      {/* Summary KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:22 }}>
        {[
          { label:"Relatórios Gerados (Mar)", val:"24",     sub:"↑ 8 vs mês anterior"    },
          { label:"Relatórios Entregues",     val:"22",     sub:"91.6% de entrega no prazo"},
          { label:"Satisfação Média",         val:"4.8/5",  sub:"baseado em 18 avaliações"},
        ].map((k,i) => (
          <KPICard key={i} label={k.label} value={k.val} delta={null} sub={k.sub}/>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:22 }}>
        {REL_TYPES.map(r => (
          <Card key={r.id} lift style={{ padding:"22px", cursor:"pointer", borderTop:`2px solid ${r.color}` }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:14 }}>
              <div style={{ width:40, height:40, borderRadius:11, background:`${r.color}14`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:r.color, fontSize:18 }}>{r.icon}</span>
              </div>
              <Tag label={r.period} color={t.t2} bg={t.bg4}/>
            </div>
            <div style={{ color:t.t1, fontSize:13, fontWeight:700, marginBottom:4 }}>{r.label}</div>
            <div style={{ color:t.t3, fontSize:11, marginBottom:16 }}>{r.desc}</div>
            <div style={{ display:"flex", gap:6 }}>
              <Btn sz="sm">Gerar</Btn>
              <Btn v="ghost" sz="sm">↓ Último</Btn>
            </div>
          </Card>
        ))}
      </div>

      {/* Histórico de geração */}
      <Card style={{ padding:"22px" }}>
        <div style={{ color:t.t1, fontWeight:700, fontSize:13, marginBottom:18 }}>Histórico de Geração</div>
        {[
          { rel:"Relatório de Receita — Fevereiro", gen:"01 Mar", by:"Rafael L.", status:"Entregue",  type:"Receita"   },
          { rel:"Relatório de Clientes — Fevereiro",gen:"01 Mar", by:"Julia R.",  status:"Entregue",  type:"Clientes"  },
          { rel:"Relatório Comercial Q1",            gen:"28 Fev", by:"Rafael L.", status:"Entregue",  type:"Comercial" },
          { rel:"Relatório de Churn — Q4 2024",      gen:"15 Jan", by:"Julia R.",  status:"Entregue",  type:"Churn"     },
        ].map((r,i) => {
          const tc = { "Receita":C.green,"Clientes":C.blue,"Comercial":C.amber,"Churn":C.red }[r.type]||"#888";
          return (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"11px 0", borderBottom:i<3?`1px solid ${t.b2}`:"none" }}>
              <Tag label={r.type} color={tc} bg={`${tc}14`}/>
              <div style={{ flex:1 }}>
                <div style={{ color:t.t1, fontSize:12, fontWeight:600 }}>{r.rel}</div>
                <div style={{ color:t.t3, fontSize:10, marginTop:2 }}>Gerado {r.gen} por {r.by}</div>
              </div>
              <StatusBadge s={r.status}/>
              <Btn v="ghost" sz="sm">↓ PDF</Btn>
            </div>
          );
        })}
      </Card>

      <Modal open={genOpen} onClose={()=>setGenOpen(false)} title="Gerar Relatório">
        <FormField label="Tipo de Relatório"><Select value="Receita" onChange={()=>{}} opts={REL_TYPES.map(r=>r.label)}/></FormField>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <FormField label="Período"><Select value="Mar 2025" onChange={()=>{}} opts={["Mar 2025","Fev 2025","Jan 2025","Q1 2025","2024"]}/></FormField>
          <FormField label="Formato"><Select value="PDF" onChange={()=>{}} opts={["PDF","Excel","Google Slides"]}/></FormField>
        </div>
        <FormField label="Incluir Clientes"><Select value="Todos" onChange={()=>{}} opts={["Todos",...CLIENTS.map(c=>c.name)]}/></FormField>
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:8 }}>
          <Btn v="ghost" onClick={()=>setGenOpen(false)}>Cancelar</Btn>
          <Btn onClick={()=>setGenOpen(false)}>Gerar Relatório</Btn>
        </div>
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   THEME TOGGLE
═══════════════════════════════════════════════════ */
function ThemeToggle({ isDark, onToggle }) {
  const t = useT();
  const [h, setH] = useState(false);
  return (
    <button onClick={onToggle} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      title={isDark?"Modo Claro":"Modo Escuro"}
      style={{ width:58, height:28, borderRadius:14, background:h?t.bg4:t.bg3, border:`1px solid ${t.bHi}`,
        cursor:"pointer", position:"relative", transition:"all .2s", flexShrink:0, display:"flex", alignItems:"center", padding:"0 3px" }}>
      <span style={{ position:"absolute", left:6,  fontSize:11, opacity:isDark?0.3:1, transition:"opacity .2s" }}>☀</span>
      <span style={{ position:"absolute", right:6, fontSize:11, opacity:isDark?1:0.3, transition:"opacity .2s" }}>☽</span>
      <div style={{ width:20, height:20, borderRadius:"50%", background:t.accent, position:"absolute",
        left:isDark?33:4, transition:"left .22s cubic-bezier(.4,0,.2,1)", boxShadow:`0 1px 4px ${t.sh}` }}/>
    </button>
  );
}

/* ═══════════════════════════════════════════════════
   COMERCIAL — DATA
═══════════════════════════════════════════════════ */
const VENDEDORES = [
  {
    id:1, name:"Thiago Ramos",  avatar:"TR", status:"Ativo",
    email:"thiago@united.com.br", phone:"(11) 98888-1111",
    comissao:8, meta:25000, joined:"Jan 2025",
    vendas:{
      hoje:   [{ cliente:"MedTech LTDA",      valor:4800, hora:"09:40", plano:"Growth" },
               { cliente:"Gourmet Burguer",    valor:2490, hora:"14:15", plano:"Food Delivery" }],
      semana: [{ dia:"Seg", val:7290 },{ dia:"Ter", val:4800 },{ dia:"Qua", val:9600 },{ dia:"Qui", val:2490 },{ dia:"Sex", val:7290 }],
      mes:    [{ sem:"S1", val:31470 },{ sem:"S2", val:24000 },{ sem:"S3", val:18900 },{ sem:"S4", val:22800 }],
      total:  97170, totalMes:97170,
    },
  },
  {
    id:2, name:"Fernanda Costa", avatar:"FC", status:"Ativo",
    email:"fernanda@united.com.br", phone:"(11) 98888-2222",
    comissao:10, meta:30000, joined:"Mar 2025",
    vendas:{
      hoje:   [{ cliente:"FinEdge Solutions", valor:7200, hora:"10:30", plano:"Pro" }],
      semana: [{ dia:"Seg", val:7200 },{ dia:"Ter", val:9600 },{ dia:"Qua", val:4800 },{ dia:"Qui", val:7200 },{ dia:"Sex", val:2490 }],
      mes:    [{ sem:"S1", val:31290 },{ sem:"S2", val:28800 },{ sem:"S3", val:36000 },{ sem:"S4", val:19200 }],
      total:  115290, totalMes:115290,
    },
  },
  {
    id:3, name:"Diego Martins", avatar:"DM", status:"Ativo",
    email:"diego@united.com.br", phone:"(21) 98888-3333",
    comissao:7, meta:20000, joined:"Fev 2025",
    vendas:{
      hoje:   [],
      semana: [{ dia:"Seg", val:0 },{ dia:"Ter", val:4800 },{ dia:"Qua", val:2490 },{ dia:"Qui", val:4800 },{ dia:"Sex", val:0 }],
      mes:    [{ sem:"S1", val:12090 },{ sem:"S2", val:9600 },{ sem:"S3", val:14400 },{ sem:"S4", val:7290 }],
      total:  43380, totalMes:43380,
    },
  },
  {
    id:4, name:"Larissa Mendes", avatar:"LM", status:"Inativo",
    email:"larissa@united.com.br", phone:"(31) 98888-4444",
    comissao:8, meta:20000, joined:"Dez 2024",
    vendas:{
      hoje:   [],
      semana: [{ dia:"Seg", val:0 },{ dia:"Ter", val:0 },{ dia:"Qua", val:0 },{ dia:"Qui", val:0 },{ dia:"Sex", val:0 }],
      mes:    [{ sem:"S1", val:0 },{ sem:"S2", val:0 },{ sem:"S3", val:0 },{ sem:"S4", val:0 }],
      total:  0, totalMes:0,
    },
  },
];

/* ═══════════════════════════════════════════════════
   PAGE: COMERCIAL
═══════════════════════════════════════════════════ */
function ComercialPage() {
  const t = useT();
  const [period, setPeriod]   = useState("semana");
  const [selected, setSelected] = useState(null);
  const [addOpen, setAddOpen]   = useState(false);
  const [editV, setEditV]       = useState(null);
  const [form, setForm] = useState({ name:"", email:"", phone:"", comissao:"8", meta:"20000" });

  const ativos    = VENDEDORES.filter(v=>v.status==="Ativo");
  const totalMes  = ativos.reduce((s,v)=>s+v.vendas.totalMes, 0);
  const totalComissao = ativos.reduce((s,v)=>s+(v.vendas.totalMes*(v.comissao/100)), 0);
  const melhor    = [...ativos].sort((a,b)=>b.vendas.totalMes-a.vendas.totalMes)[0];

  /* mini bar */
  function SalesBar({ data, color }) {
    const max = Math.max(...data.map(d=>d.val), 1);
    return (
      <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:44 }}>
        {data.map((d,i) => {
          const isLast = i===data.length-1;
          const h = Math.max(3, (d.val/max)*36);
          return (
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
              <div style={{ width:"100%", borderRadius:"2px 2px 0 0", height:`${h}px`,
                background: isLast?(color||t.accent):t.bg4, transition:"height .5s ease" }}/>
              <span style={{ fontSize:8, color:t.t4 }}>{d.dia||d.sem}</span>
            </div>
          );
        })}
      </div>
    );
  }

  /* rank badge */
  const rankColor = (i) => [C.amber,"#9CA3AF","#CD7F32"][i]||t.t4;
  const rankLabel = (i) => ["🥇","🥈","🥉"][i]||`#${i+1}`;

  /* edit modal state */
  const openEdit = (v) => {
    setEditV({ ...v, comissaoEdit: String(v.comissao), metaEdit: String(v.meta) });
  };

  const PERIOD_DATA = (v) => period==="hoje" ? v.vendas.hoje.map((x,i)=>({ dia:`${i+1}`, val:x.valor }))
    : period==="semana" ? v.vendas.semana : v.vendas.mes;

  const PERIOD_TOTAL = (v) => {
    if(period==="hoje")   return v.vendas.hoje.reduce((s,x)=>s+x.valor,0);
    if(period==="semana") return v.vendas.semana.reduce((s,x)=>s+x.val,0);
    return v.vendas.totalMes;
  };

  const COLORS = [C.blue, C.purple, C.cyan, C.orange];

  return (
    <div>
      <PageHeader
        title="Comercial"
        sub="Acompanhe vendedores, comissões e desempenho de vendas."
        action={
          <div style={{ display:"flex", gap:8 }}>
            <Btn v="ghost" sz="sm">↓ Exportar</Btn>
            <Btn onClick={()=>setAddOpen(true)}>+ Novo Vendedor</Btn>
          </div>
        }
      />

      {/* ─ KPIs ─ */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        <KPICard label="Total Vendido (Mês)"  value={`R$${(totalMes/1000).toFixed(1)}k`} delta="+18%" sub="pelos vendedores ativos"/>
        <KPICard label="Comissões a Pagar"    value={`R$${totalComissao.toLocaleString("pt-BR",{minimumFractionDigits:0,maximumFractionDigits:0})}`} delta={null} sub="total este mês" accent={C.amber}/>
        <KPICard label="Vendedores Ativos"    value={ativos.length} delta={null} sub={`${VENDEDORES.length} cadastrados`}/>
        <KPICard label="Top Vendedor"         value={melhor?.name.split(" ")[0]||"—"} delta={null} sub={`R$${(melhor?.vendas.totalMes/1000).toFixed(1)}k vendido`} accent={C.green}/>
      </div>

      {/* ─ Ranking geral ─ */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:14, marginBottom:20 }}>
        {/* Ranking cards */}
        <Card style={{ padding:"24px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
            <div style={{ color:t.t1, fontWeight:700, fontSize:13 }}>Ranking de Vendas</div>
            <FilterBar opts={["hoje","semana","mes"]} active={period} onChange={setPeriod}/>
          </div>

          {[...VENDEDORES].sort((a,b)=>PERIOD_TOTAL(b)-PERIOD_TOTAL(a)).map((v,i) => {
            const total = PERIOD_TOTAL(v);
            const meta  = v.meta;
            const pct   = Math.min(100, Math.round((total/meta)*100));
            const vc    = COLORS[i%COLORS.length];
            const comissaoVal = Math.round(total*(v.comissao/100));
            return (
              <div key={v.id}
                onClick={()=>setSelected(selected===v.id?null:v.id)}
                style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 0",
                  borderBottom:i<VENDEDORES.length-1?`1px solid ${t.b2}`:"none",
                  cursor:"pointer" }}>
                {/* rank */}
                <div style={{ width:28, textAlign:"center", fontSize:16, flexShrink:0 }}>{rankLabel(i)}</div>
                {/* avatar */}
                <div style={{ position:"relative", flexShrink:0 }}>
                  <div style={{ width:40, height:40, borderRadius:"50%",
                    background: v.status==="Inativo" ? t.bg4 : `${vc}20`,
                    border:`2px solid ${v.status==="Inativo"?t.b1:vc+"50"}`,
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ color:v.status==="Inativo"?t.t4:vc, fontSize:12, fontWeight:800 }}>{v.avatar}</span>
                  </div>
                  <div style={{ position:"absolute", bottom:1, right:1, width:9, height:9, borderRadius:"50%",
                    background: v.status==="Ativo"?C.green:"#555", border:`2px solid ${t.bg2}` }}/>
                </div>
                {/* info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                    <span style={{ color:t.t1, fontSize:13, fontWeight:700 }}>{v.name}</span>
                    <Tag label={`${v.comissao}% comissão`} color={vc} bg={`${vc}14`}/>
                  </div>
                  {/* progress bar */}
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ flex:1, height:5, background:t.bg4, borderRadius:3, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${pct}%`, background:vc, borderRadius:3, transition:"width .8s ease" }}/>
                    </div>
                    <span style={{ color:t.t3, fontSize:10, whiteSpace:"nowrap" }}>{pct}% da meta</span>
                  </div>
                </div>
                {/* values */}
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ color:total>0?t.t1:t.t4, fontSize:14, fontWeight:800 }}>R${(total/1000).toFixed(1)}k</div>
                  <div style={{ color:C.green, fontSize:10, marginTop:2, fontWeight:700 }}>+R${comissaoVal.toLocaleString("pt-BR")}</div>
                </div>
                <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                  <button onClick={e=>{e.stopPropagation();openEdit(v);}} style={{ padding:"4px 10px", borderRadius:7, cursor:"pointer", fontSize:10, fontWeight:700, background:t.bg3, color:t.t2, border:`1px solid ${t.b1}` }}>✏ Comissão</button>
                </div>
              </div>
            );
          })}
        </Card>

        {/* Comparative bar */}
        <Card style={{ padding:"24px" }}>
          <div style={{ color:t.t1, fontWeight:700, fontSize:13, marginBottom:20 }}>Volume por Vendedor</div>
          {[...VENDEDORES].sort((a,b)=>PERIOD_TOTAL(b)-PERIOD_TOTAL(a)).map((v,i) => {
            const total = PERIOD_TOTAL(v);
            const maxV  = Math.max(...VENDEDORES.map(x=>PERIOD_TOTAL(x)), 1);
            const pct   = (total/maxV)*100;
            const vc    = COLORS[i%COLORS.length];
            return (
              <div key={v.id} style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ color:t.t2, fontSize:11 }}>{v.name.split(" ")[0]}</span>
                  <span style={{ color:t.t1, fontSize:11, fontWeight:700 }}>R${(total/1000).toFixed(1)}k</span>
                </div>
                <div style={{ height:8, background:t.bg4, borderRadius:4, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${pct}%`, background:vc, borderRadius:4, transition:"width .8s ease" }}/>
                </div>
              </div>
            );
          })}
          {/* comissão total */}
          <div style={{ marginTop:20, paddingTop:16, borderTop:`1px solid ${t.b1}` }}>
            <div style={{ color:t.t4, fontSize:9, fontWeight:800, letterSpacing:1.8, textTransform:"uppercase", marginBottom:10 }}>COMISSÕES ESTE MÊS</div>
            {ativos.map((v,i) => {
              const vc = COLORS[i%COLORS.length];
              const com = Math.round(v.vendas.totalMes*(v.comissao/100));
              return (
                <div key={v.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:i<ativos.length-1?`1px solid ${t.b2}`:"none" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:vc }}/>
                    <span style={{ color:t.t2, fontSize:11 }}>{v.name.split(" ")[0]}</span>
                    <span style={{ color:t.t4, fontSize:10 }}>({v.comissao}%)</span>
                  </div>
                  <span style={{ color:C.green, fontSize:12, fontWeight:700 }}>R${com.toLocaleString("pt-BR")}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* ─ Painel individual expandido ─ */}
      {selected && (() => {
        const v   = VENDEDORES.find(x=>x.id===selected);
        if(!v) return null;
        const vc  = COLORS[VENDEDORES.indexOf(v)%COLORS.length];
        const pdata = PERIOD_DATA(v);
        const total = PERIOD_TOTAL(v);
        const comV  = Math.round(total*(v.comissao/100));
        const meta  = v.meta;
        const pct   = Math.min(100,Math.round((total/meta)*100));
        return (
          <Card style={{ padding:"28px", marginBottom:20, borderLeft:`3px solid ${vc}`, animation:"fadeIn .2s ease" }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:22 }}>
              <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                <div style={{ width:56, height:56, borderRadius:"50%", background:`${vc}18`, border:`2px solid ${vc}40`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ color:vc, fontSize:18, fontWeight:800 }}>{v.avatar}</span>
                </div>
                <div>
                  <div style={{ color:t.t1, fontSize:17, fontWeight:800 }}>{v.name}</div>
                  <div style={{ color:t.t3, fontSize:12, marginTop:3 }}>
                    {v.email} · {v.phone} · Na equipe desde {v.joined}
                  </div>
                </div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <Btn v="ghost" sz="sm" onClick={()=>openEdit(v)}>✏ Editar Comissão</Btn>
                <Btn v="danger" sz="sm">⊘ Desativar</Btn>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:22 }}>
              {[
                { label:"Vendido (período)", val:`R$${(total/1000).toFixed(1)}k`, c:vc         },
                { label:"Comissão",          val:`R$${comV.toLocaleString("pt-BR")}`, c:C.green },
                { label:"Meta do Mês",       val:`R$${(meta/1000).toFixed(0)}k`, c:t.t1         },
                { label:"% da Meta",         val:`${pct}%`, c:pct>=100?C.green:pct>=70?C.amber:C.red },
                { label:"Taxa de Comissão",  val:`${v.comissao}%`, c:vc                         },
              ].map((k,i) => (
                <div key={i} style={{ padding:"14px 16px", background:t.bg3, borderRadius:10, border:`1px solid ${t.b1}` }}>
                  <div style={{ color:t.t3, fontSize:10, marginBottom:8 }}>{k.label}</div>
                  <div style={{ color:k.c, fontSize:20, fontWeight:800 }}>{k.val}</div>
                </div>
              ))}
            </div>

            {/* mini chart */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <div>
                <div style={{ color:t.t4, fontSize:9, fontWeight:800, letterSpacing:1.8, textTransform:"uppercase", marginBottom:12 }}>
                  EVOLUÇÃO — {period==="hoje"?"HOJE":period==="semana"?"ESTA SEMANA":"ESTE MÊS"}
                </div>
                {pdata.length > 0
                  ? <SalesBar data={pdata} color={vc}/>
                  : <div style={{ height:44, display:"flex", alignItems:"center", color:t.t4, fontSize:12 }}>Sem vendas neste período.</div>
                }
              </div>
              <div>
                <div style={{ color:t.t4, fontSize:9, fontWeight:800, letterSpacing:1.8, textTransform:"uppercase", marginBottom:12 }}>
                  VENDAS DE HOJE
                </div>
                {v.vendas.hoje.length>0 ? v.vendas.hoje.map((vd,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"9px 0", borderBottom:i<v.vendas.hoje.length-1?`1px solid ${t.b2}`:"none" }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:vc, flexShrink:0 }}/>
                    <div style={{ flex:1 }}>
                      <div style={{ color:t.t1, fontSize:12, fontWeight:600 }}>{vd.cliente}</div>
                      <div style={{ color:t.t3, fontSize:10 }}>{vd.plano} · {vd.hora}</div>
                    </div>
                    <span style={{ color:t.t1, fontSize:12, fontWeight:800 }}>R${(vd.valor/1000).toFixed(1)}k</span>
                  </div>
                )) : (
                  <div style={{ color:t.t4, fontSize:12 }}>Nenhuma venda hoje ainda.</div>
                )}
              </div>
            </div>
          </Card>
        );
      })()}

      {/* ─ Tabela de todos os vendedores ─ */}
      <Card style={{ overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 110px 110px 120px 120px 90px 90px", gap:12, padding:"9px 20px", background:t.bg3, borderBottom:`1px solid ${t.b1}` }}>
          {["Vendedor","Status","Meta (mês)","Vendido (mês)","Comissão","% Comis.",""].map((h,i)=>(
            <span key={i} style={{ color:t.t4, fontSize:9, fontWeight:800, letterSpacing:1.4, textTransform:"uppercase" }}>{h}</span>
          ))}
        </div>
        {VENDEDORES.map((v,i) => {
          const vc  = COLORS[i%COLORS.length];
          const pct = Math.min(100,Math.round((v.vendas.totalMes/v.meta)*100));
          const com = Math.round(v.vendas.totalMes*(v.comissao/100));
          return (
            <div key={v.id} style={{ display:"grid", gridTemplateColumns:"1fr 110px 110px 120px 120px 90px 90px", gap:12, padding:"13px 20px", alignItems:"center", borderTop:`1px solid ${t.b1}`, transition:"background .14s", background:selected===v.id?t.bg3:"transparent" }}
              onMouseEnter={e=>{ if(selected!==v.id)e.currentTarget.style.background=t.bg3; }}
              onMouseLeave={e=>{ if(selected!==v.id)e.currentTarget.style.background="transparent"; }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:`${vc}18`, border:`1px solid ${vc}30`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ color:vc, fontSize:10, fontWeight:800 }}>{v.avatar}</span>
                </div>
                <div>
                  <div style={{ color:t.t1, fontSize:12, fontWeight:600 }}>{v.name}</div>
                  <div style={{ color:t.t3, fontSize:10, marginTop:1 }}>{v.email}</div>
                </div>
              </div>
              <StatusBadge s={v.status}/>
              <span style={{ color:t.t2, fontSize:12 }}>R${(v.meta/1000).toFixed(0)}k</span>
              <div>
                <div style={{ color:t.t1, fontSize:12, fontWeight:700, marginBottom:4 }}>R${(v.vendas.totalMes/1000).toFixed(1)}k</div>
                <div style={{ height:3, background:t.bg4, borderRadius:2, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${pct}%`, background:pct>=100?C.green:pct>=70?C.amber:C.red, borderRadius:2 }}/>
                </div>
              </div>
              <span style={{ color:C.green, fontSize:12, fontWeight:700 }}>R${com.toLocaleString("pt-BR")}</span>
              <div>
                <span style={{ color:vc, fontSize:14, fontWeight:800 }}>{v.comissao}%</span>
              </div>
              <div style={{ display:"flex", gap:5 }}>
                <button onClick={()=>setSelected(selected===v.id?null:v.id)} style={{ padding:"4px 10px", borderRadius:7, cursor:"pointer", fontSize:10, fontWeight:700, background:t.bg3, color:t.t2, border:`1px solid ${t.b1}` }}>
                  {selected===v.id?"Fechar":"Detalhes"}
                </button>
              </div>
            </div>
          );
        })}
      </Card>

      {/* ─ ADD modal ─ */}
      <Modal open={addOpen} onClose={()=>setAddOpen(false)} title="Novo Vendedor">
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <FormField label="Nome Completo"><Input value={form.name} onChange={v=>setForm({...form,name:v})} placeholder="Ana Costa"/></FormField>
          <FormField label="Email"><Input value={form.email} onChange={v=>setForm({...form,email:v})} placeholder="ana@united.com.br"/></FormField>
          <FormField label="Telefone"><Input value={form.phone} onChange={v=>setForm({...form,phone:v})} placeholder="(11) 9 9999-9999"/></FormField>
          <FormField label="Meta Mensal (R$)"><Input type="number" value={form.meta} onChange={v=>setForm({...form,meta:v})} placeholder="20000"/></FormField>
        </div>
        <FormField label="% de Comissão">
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <input type="range" min="1" max="20" value={form.comissao} onChange={e=>setForm({...form,comissao:e.target.value})} style={{ flex:1, accentColor:C.blue }}/>
            <div style={{ minWidth:52, padding:"7px 12px", background:t.bg3, border:`1px solid ${t.bHi}`, borderRadius:8, textAlign:"center" }}>
              <span style={{ color:C.blue, fontSize:16, fontWeight:800 }}>{form.comissao}%</span>
            </div>
          </div>
        </FormField>
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:8 }}>
          <Btn v="ghost" onClick={()=>setAddOpen(false)}>Cancelar</Btn>
          <Btn onClick={()=>setAddOpen(false)}>Adicionar Vendedor</Btn>
        </div>
      </Modal>

      {/* ─ EDIT comissão modal ─ */}
      <Modal open={!!editV} onClose={()=>setEditV(null)} title={editV?`Editar — ${editV.name}`:""} width={420}>
        {editV && (
          <>
            <div style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", background:t.bg3, borderRadius:10, border:`1px solid ${t.b1}`, marginBottom:20 }}>
              <div style={{ width:40, height:40, borderRadius:"50%", background:C.blueBg, border:`1px solid ${C.blue}30`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:C.blue, fontSize:14, fontWeight:800 }}>{editV.avatar}</span>
              </div>
              <div>
                <div style={{ color:t.t1, fontSize:13, fontWeight:700 }}>{editV.name}</div>
                <div style={{ color:t.t3, fontSize:11 }}>{editV.email}</div>
              </div>
            </div>
            <FormField label="Meta Mensal (R$)">
              <Input type="number" value={editV.metaEdit} onChange={v=>setEditV({...editV,metaEdit:v})} placeholder="20000"/>
            </FormField>
            <FormField label="Taxa de Comissão">
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <input type="range" min="1" max="20" value={editV.comissaoEdit}
                  onChange={e=>setEditV({...editV,comissaoEdit:e.target.value})}
                  style={{ flex:1, accentColor:C.green }}/>
                <div style={{ minWidth:52, padding:"7px 12px", background:t.bg3, border:`1px solid ${t.bHi}`, borderRadius:8, textAlign:"center" }}>
                  <span style={{ color:C.green, fontSize:16, fontWeight:800 }}>{editV.comissaoEdit}%</span>
                </div>
              </div>
              <div style={{ color:t.t3, fontSize:11, marginTop:8 }}>
                Comissão estimada este mês: <strong style={{ color:C.green }}>R${Math.round(editV.vendas.totalMes*(editV.comissaoEdit/100)).toLocaleString("pt-BR")}</strong>
              </div>
            </FormField>
            <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:8 }}>
              <Btn v="ghost" onClick={()=>setEditV(null)}>Cancelar</Btn>
              <Btn onClick={()=>setEditV(null)}>Salvar Alterações</Btn>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}


export default function App() {
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? DARK : LIGHT;
  const [page, setPage] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [fading, setFading] = useState(false);
  const t = theme;

  const goPage = (p) => {
    setFading(true);
    setTimeout(() => { setPage(p); setFading(false); }, 120);
  };

  const PAGE_LABELS = {
    overview:"Visão Geral", clientes:"Clientes", colaboradores:"Colaboradores",
    financeiro:"Financeiro", produtos:"Produtos", alertas:"Alertas",
    notificacoes:"Notificações", relatorios:"Relatórios", comercial:"Comercial",
  };

  return (
    <Ctx.Provider value={theme}>
      <div style={{ display:"flex", height:"100vh", background:t.bg0, overflow:"hidden" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          *{box-sizing:border-box;margin:0;padding:0;font-family:'Plus Jakarta Sans',sans-serif;}
          ::-webkit-scrollbar{width:3px;height:3px;}
          ::-webkit-scrollbar-thumb{background:${t.isDark?"rgba(255,255,255,.1)":"rgba(0,0,0,.15)"};border-radius:2px;}
          ::-webkit-scrollbar-track{background:transparent;}
          input,select,textarea{font-family:'Plus Jakarta Sans',sans-serif;}
          input::placeholder,textarea::placeholder{color:${t.t4};}
          @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
          @keyframes modalIn{from{opacity:0;transform:scale(.97) translateY(8px)}to{opacity:1;transform:none}}
          .enter{animation:fadeIn .22s cubic-bezier(.4,0,.2,1);}
          .leave{animation:fadeIn .12s reverse forwards;}
        `}</style>

        {/* ─── SIDEBAR ─── */}
        <aside style={{ width:collapsed?52:214, background:t.bg1, borderRight:`1px solid ${t.b1}`, display:"flex", flexDirection:"column", transition:"width .26s cubic-bezier(.4,0,.2,1)", flexShrink:0, overflow:"hidden" }}>
          {/* Logo */}
          <div style={{ padding:collapsed?"18px 10px":"18px 16px", borderBottom:`1px solid ${t.b1}`, flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:32, height:32, flexShrink:0, borderRadius:9, background:t.accent, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:t.accentTxt, fontWeight:900, fontSize:15 }}>U</span>
              </div>
              {!collapsed && (
                <div>
                  <div style={{ color:t.t1, fontSize:12, fontWeight:800, letterSpacing:2 }}>UNITED</div>
                  <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:3 }}>
                    <div style={{ width:5, height:5, borderRadius:"50%", background:C.red }}/>
                    <span style={{ color:C.red, fontSize:8, fontWeight:800, letterSpacing:2, textTransform:"uppercase" }}>Painel ADM</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Admin badge */}
          {!collapsed && (
            <div style={{ padding:"10px 12px", borderBottom:`1px solid ${t.b1}` }}>
              <div style={{ background:`${C.red}0a`, border:`1px solid ${C.red}22`, borderRadius:9, padding:"9px 12px" }}>
                <div style={{ color:C.red, fontSize:7, letterSpacing:2.5, textTransform:"uppercase", marginBottom:4 }}>Usuário</div>
                <div style={{ color:t.t1, fontSize:11, fontWeight:700 }}>Rafael Lima</div>
                <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:4 }}>
                  <Tag label="Super Admin" color={C.red} bg={C.redBg}/>
                </div>
              </div>
            </div>
          )}

          {/* Nav */}
          <nav style={{ flex:1, padding:"10px 6px", overflowY:"auto" }}>
            {ADM_NAV.map(item => {
              const active = page===item.id;
              return (
                <div key={item.id} onClick={()=>goPage(item.id)}
                  style={{ display:"flex", alignItems:"center", gap:9, padding:collapsed?"9px 11px":"8px 11px",
                    borderRadius:8, marginBottom:1, cursor:"pointer",
                    background:active?t.bg4:"transparent",
                    borderLeft:active?`2px solid ${t.accent}`:"2px solid transparent",
                    transition:"all .13s" }}
                  onMouseEnter={e=>{ if(!active)e.currentTarget.style.background=t.bg3; }}
                  onMouseLeave={e=>{ if(!active)e.currentTarget.style.background="transparent"; }}>
                  <span style={{ fontSize:13, color:active?t.t1:t.t3, flexShrink:0 }}>{item.icon}</span>
                  {!collapsed && <>
                    <span style={{ fontSize:11, fontWeight:active?700:500, color:active?t.t1:t.t3, flex:1 }}>{item.label}</span>
                    {item.b && <span style={{ fontSize:9, fontWeight:700, color:C.amber, background:C.amberBg, padding:"1px 6px", borderRadius:10 }}>{item.b}</span>}
                  </>}
                </div>
              );
            })}
          </nav>

          {/* Collapse */}
          <div style={{ padding:"8px 6px", borderTop:`1px solid ${t.b1}` }}>
            <div onClick={()=>setCollapsed(!collapsed)} style={{ display:"flex", alignItems:"center", gap:9, padding:"7px 11px", borderRadius:8, cursor:"pointer", transition:"background .13s" }}
              onMouseEnter={e=>e.currentTarget.style.background=t.bg3}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <span style={{ fontSize:11, color:t.t4 }}>{collapsed?"▶":"◀"}</span>
              {!collapsed && <span style={{ fontSize:11, color:t.t4 }}>Recolher</span>}
            </div>
          </div>
        </aside>

        {/* ─── MAIN ─── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>
          {/* TOPBAR */}
          <header style={{ height:56, flexShrink:0, background:t.bg1, borderBottom:`1px solid ${t.b1}`, display:"flex", alignItems:"center", padding:"0 26px", gap:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
              <Tag label="ADM" color={C.red} bg={C.redBg}/>
              <span style={{ color:t.t4 }}>·</span>
              <span style={{ color:t.t1, fontSize:12, fontWeight:700 }}>{PAGE_LABELS[page]||page}</span>
            </div>
            <div style={{ flex:1 }}/>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              {/* Quick stats */}
              <div style={{ display:"flex", gap:10, padding:"5px 14px", background:t.bg3, borderRadius:8, border:`1px solid ${t.b1}` }}>
                <span style={{ color:C.green, fontSize:11, fontWeight:700 }}>MRR R$43,2k</span>
                <span style={{ color:t.b1 }}>|</span>
                <span style={{ color:t.t3, fontSize:11 }}>{CLIENTS.filter(c=>c.status==="Ativo").length} clientes</span>
                <span style={{ color:t.b1 }}>|</span>
                <span style={{ color:C.amber, fontSize:11 }}>R$16,8k a receber</span>
              </div>
              <ThemeToggle isDark={isDark} onToggle={()=>setIsDark(!isDark)}/>
              {/* Alert bell */}
              <div style={{ position:"relative", cursor:"pointer", width:32, height:32, borderRadius:8, background:t.bg3, border:`1px solid ${t.b1}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:t.t2, fontSize:14 }}>◐</span>
                <div style={{ position:"absolute", top:6, right:6, width:7, height:7, borderRadius:"50%", background:C.red, border:`2px solid ${t.bg1}` }}/>
              </div>
              {/* Avatar */}
              <div style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", padding:"5px 10px", borderRadius:8, background:t.bg3, border:`1px solid ${t.b1}` }}>
                <div style={{ width:22, height:22, borderRadius:"50%", background:t.bg5, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ color:t.t2, fontSize:8, fontWeight:800 }}>RL</span>
                </div>
                <span style={{ color:t.t2, fontSize:11, fontWeight:600 }}>Rafael Lima</span>
                <Tag label="Admin" color={C.red} bg={C.redBg}/>
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <main style={{ flex:1, overflowY:"auto", padding:"28px 30px", background:t.bg0, transition:"background .3s" }}>
            <div className={fading?"leave":"enter"} key={page+isDark}>
              {page==="overview"      && <OverviewPage/>}
              {page==="clientes"      && <ClientesPage/>}
              {page==="colaboradores" && <ColabsPage/>}
              {page==="financeiro"    && <FinanceiroPage/>}
              {page==="produtos"       && <ProdutosPage/>}
              {page==="alertas"       && <AlertasPage/>}
              {page==="notificacoes"  && <NotificacoesPage/>}
              {page==="relatorios"    && <RelatoriosAdmPage/>}
              {page==="comercial"     && <ComercialPage/>}
            </div>
          </main>
        </div>
      </div>
    </Ctx.Provider>
  );
}
