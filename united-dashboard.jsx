import { useState, useEffect, createContext, useContext } from "react";

/* ═══════════════════════════════════════════════
   THEME TOKENS — DARK & LIGHT
═══════════════════════════════════════════════ */
const DARK = {
  bg0:"#080808", bg1:"#0F0F0F", bg2:"#141414", bg3:"#1C1C1C",
  bg4:"#242424", bg5:"#2E2E2E",
  t1:"#F2F2F2", t2:"#A3A3A3", t3:"#666666", t4:"#383838",
  b1:"rgba(255,255,255,0.08)", b2:"rgba(255,255,255,0.04)",
  bStrong:"rgba(255,255,255,0.14)",
  accent:"#FFFFFF", accentText:"#080808",
  shadow:"rgba(0,0,0,0.55)",
  isDark: true,
};
const LIGHT = {
  bg0:"#F0F0F0", bg1:"#FAFAFA", bg2:"#FFFFFF", bg3:"#F5F5F5",
  bg4:"#EBEBEB", bg5:"#DEDEDE",
  t1:"#111111", t2:"#555555", t3:"#999999", t4:"#C8C8C8",
  b1:"rgba(0,0,0,0.08)", b2:"rgba(0,0,0,0.04)",
  bStrong:"rgba(0,0,0,0.16)",
  accent:"#111111", accentText:"#FFFFFF",
  shadow:"rgba(0,0,0,0.10)",
  isDark: false,
};
/* shared color tokens — badges/tags/alerts keep color in both modes */
const C = {
  green:"#22C55E",  greenBg:"rgba(34,197,94,0.12)",
  blue:"#3B82F6",   blueBg:"rgba(59,130,246,0.12)",
  purple:"#A855F7", purpleBg:"rgba(168,85,247,0.12)",
  red:"#EF4444",    redBg:"rgba(239,68,68,0.12)",
  amber:"#F59E0B",  amberBg:"rgba(245,158,11,0.12)",
  cyan:"#06B6D4",   cyanBg:"rgba(6,182,212,0.12)",
  orange:"#F97316", orangeBg:"rgba(249,115,22,0.12)",
  pink:"#EC4899",   pinkBg:"rgba(236,72,153,0.12)",
};

const ThemeCtx = createContext(DARK);
const useT = () => useContext(ThemeCtx);

const API_URL = import.meta.env.VITE_API_URL || "";

/* ═══════════════════════════════════════════════
   MOCK DATA (exceto Kanban, que vem da API)
═══════════════════════════════════════════════ */
const TYPE_TAG = {
  "Landing Page":{ c:C.blue,   bg:C.blueBg   },
  "Criativo":    { c:C.amber,  bg:C.amberBg  },
  "Campanha":    { c:C.purple, bg:C.purpleBg },
  "Vídeo":       { c:C.pink,   bg:C.pinkBg   },
  "Automação":   { c:C.cyan,   bg:C.cyanBg   },
  "Funil":       { c:C.orange, bg:C.orangeBg },
  "Estratégia":  { c:C.green,  bg:C.greenBg  },
  "Relatório":   { c:"#888",   bg:"rgba(128,128,128,0.12)" },
};
const PRIO_TAG = {
  "Alta":  { c:C.red,   bg:C.redBg   },
  "Média": { c:C.amber, bg:C.amberBg },
  "Baixa": { c:"#888",  bg:"rgba(128,128,128,0.1)" },
};
const CHART_DATA = [
  { m:"Out", leads:620,  inv:12000, conv:54 },
  { m:"Nov", leads:780,  inv:13500, conv:68 },
  { m:"Dez", leads:710,  inv:14200, conv:61 },
  { m:"Jan", leads:890,  inv:15800, conv:79 },
  { m:"Fev", leads:1050, inv:17200, conv:95 },
  { m:"Mar", leads:1284, inv:18400, conv:112},
];
const FUNNEL = [
  { s:"Tráfego",  v:42800, p:100 },
  { s:"Leads",    v:1284,  p:30  },
  { s:"Reuniões", v:312,   p:7.3 },
  { s:"Clientes", v:128,   p:3.0 },
];
const PERF_KPIS = [
  { label:"Leads Gerados",  value:"1.284",   delta:"+42%",  sub:"vs. mês anterior"  },
  { label:"Investimento",   value:"R$18,4k", delta:"+12%",  sub:"Meta: R$20k"       },
  { label:"CAC",            value:"R$143",   delta:"−18%",  sub:"Meta: R$160"       },
  { label:"ROI",            value:"4,2×",    delta:"+0,8×", sub:"Meta: 3,5× ✓"     },
];
const REPORTS = [
  { id:1, title:"Relatório Mensal — Fevereiro 2025",    type:"Mensal",      period:"Fev 2025",     owner:"Rafael L.", date:"01 Mar", pages:12 },
  { id:2, title:"Relatório de Campanha — Google Q1",    type:"Campanha",    period:"Jan–Mar 2025", owner:"Lucas P.",  date:"20 Fev", pages:8  },
  { id:3, title:"Relatório Estratégico Semestral",      type:"Estratégico", period:"Jul–Dez 2024", owner:"Rafael L.", date:"05 Jan", pages:24 },
  { id:4, title:"Relatório de Tráfego — Dezembro 2024", type:"Tráfego",     period:"Dez 2024",     owner:"Ana S.",    date:"02 Jan", pages:6  },
  { id:5, title:"Relatório de Crescimento Q4 2024",     type:"Crescimento", period:"Out–Dez 2024", owner:"Rafael L.", date:"10 Jan", pages:18 },
  { id:6, title:"Relatório Mensal — Janeiro 2025",      type:"Mensal",      period:"Jan 2025",     owner:"Ana S.",    date:"01 Fev", pages:11 },
];
const RPT_COLOR = { "Mensal":C.blue,"Campanha":C.purple,"Estratégico":C.amber,"Tráfego":C.cyan,"Crescimento":C.green };
const MAT_FOLDERS = [
  { id:"criativos",  label:"Criativos",  icon:"◈", count:24, size:"156 MB" },
  { id:"campanhas",  label:"Campanhas",  icon:"◎", count:12, size:"89 MB"  },
  { id:"branding",   label:"Branding",   icon:"◆", count:8,  size:"210 MB" },
  { id:"videos",     label:"Vídeos",     icon:"▶", count:6,  size:"1.2 GB" },
  { id:"docs",       label:"Documentos", icon:"◻", count:18, size:"45 MB"  },
  { id:"relatorios", label:"Relatórios", icon:"◉", count:9,  size:"32 MB"  },
];
const FILES = {
  criativos: [
    { name:"Banner_BlackFriday_1080x1080.png", ext:"PNG",  size:"2.1 MB", date:"02 Mar" },
    { name:"Stories_Lançamento_v3.psd",        ext:"PSD",  size:"45 MB",  date:"28 Fev" },
    { name:"Post_Carrossel_Produto.ai",        ext:"AI",   size:"8.3 MB", date:"25 Fev" },
    { name:"Creative_Set_Q1_2025.zip",         ext:"ZIP",  size:"120 MB", date:"15 Fev" },
  ],
  campanhas: [
    { name:"Campanha_GoogleAds_Abril.pdf",     ext:"PDF",  size:"1.2 MB", date:"01 Mar" },
    { name:"Briefing_MetaAds_Promo.docx",      ext:"DOCX", size:"0.4 MB", date:"25 Fev" },
  ],
  branding: [
    { name:"Manual_Marca_TechVision_v2.pdf",   ext:"PDF",  size:"18 MB",  date:"10 Jan" },
    { name:"Logo_Pack_2025.zip",               ext:"ZIP",  size:"45 MB",  date:"08 Jan" },
  ],
  videos: [
    { name:"Apresentação_Institucional_v2.mp4",ext:"MP4",  size:"420 MB", date:"28 Fev" },
    { name:"Reels_Produto_30seg.mp4",          ext:"MP4",  size:"85 MB",  date:"22 Fev" },
  ],
  docs: [
    { name:"Estratégia_Q2_2025.pdf",           ext:"PDF",  size:"2.8 MB", date:"05 Mar" },
    { name:"Contrato_Serviços_2025.pdf",       ext:"PDF",  size:"1.1 MB", date:"01 Jan" },
  ],
  relatorios: [
    { name:"Relatório_Fev_2025.pdf",           ext:"PDF",  size:"2.4 MB", date:"01 Mar" },
    { name:"Relatório_Jan_2025.pdf",           ext:"PDF",  size:"2.2 MB", date:"01 Fev" },
  ],
};
const MEET_UP = [
  { id:1, title:"Alinhamento Mensal — Março",  date:"10 Mar", time:"14h00", via:"Google Meet", owner:"Rafael L.", agenda:["Review de performance","Entregas em andamento","Planejamento Abril"] },
  { id:2, title:"Review de Performance Q1",    date:"18 Mar", time:"10h00", via:"Zoom",        owner:"Lucas P.",  agenda:["Resultados Q1","Comparativo vs meta","Próximos passos"] },
  { id:3, title:"Sprint Planning — Abril",     date:"28 Mar", time:"15h00", via:"Google Meet", owner:"Rafael L.", agenda:["Briefing campanhas","Prioridades","Timeline de entregas"] },
];
const MEET_PAST = [
  { id:4, title:"Alinhamento Mensal — Fev",  date:"10 Fev", via:"Google Meet", dur:"52min", rec:true,  ata:true  },
  { id:5, title:"Review de Campanha Google", date:"22 Jan", via:"Zoom",        dur:"38min", rec:true,  ata:false },
  { id:6, title:"Onboarding — Kickoff 2025", date:"06 Jan", via:"Zoom",        dur:"75min", rec:true,  ata:true  },
  { id:7, title:"Planejamento Estratégico",  date:"15 Dez", via:"Google Meet", dur:"90min", rec:false, ata:true  },
];
const INVOICES = [
  { id:"FAT-2025-03", period:"Março 2025",    value:"R$ 4.800,00", due:"15 Mar", status:"Pendente", paid:null      },
  { id:"FAT-2025-02", period:"Fevereiro 2025",value:"R$ 4.800,00", due:"15 Fev", status:"Pago",     paid:"14 Fev"  },
  { id:"FAT-2025-01", period:"Janeiro 2025",  value:"R$ 4.800,00", due:"15 Jan", status:"Pago",     paid:"12 Jan"  },
  { id:"FAT-2024-12", period:"Dezembro 2024", value:"R$ 4.500,00", due:"15 Dez", status:"Pago",     paid:"15 Dez"  },
  { id:"FAT-2024-11", period:"Novembro 2024", value:"R$ 4.500,00", due:"15 Nov", status:"Pago",     paid:"13 Nov"  },
];
const ACADEMY = [
  { id:1, title:"Como estruturar um Funil de Vendas do zero",    cat:"Funil",    fmt:"Vídeo",     dur:"32min", lvl:"Iniciante",     done:true,  prog:100 },
  { id:2, title:"Meta Ads 2025: Estratégias avançadas",          cat:"Tráfego",  fmt:"Vídeo",     dur:"48min", lvl:"Avançado",      done:false, prog:65  },
  { id:3, title:"O guia definitivo de Email Marketing",          cat:"Marketing",fmt:"Ebook",     dur:"45 p.", lvl:"Intermediário",  done:false, prog:0   },
  { id:4, title:"Google Ads: Lances automáticos vs manuais",     cat:"Tráfego",  fmt:"Vídeo",     dur:"28min", lvl:"Intermediário",  done:false, prog:30  },
  { id:5, title:"Copywriting que converte: frameworks práticos", cat:"Vendas",   fmt:"Guia",      dur:"20 p.", lvl:"Iniciante",     done:false, prog:0   },
  { id:6, title:"Métricas que importam: CAC, LTV e ROI",        cat:"Estratégia",fmt:"Treinamento",dur:"55min",lvl:"Intermediário",  done:false, prog:0   },
  { id:7, title:"Automação de marketing com IA",                 cat:"Marketing",fmt:"Vídeo",     dur:"41min", lvl:"Avançado",      done:false, prog:0   },
  { id:8, title:"Como criar ofertas irresistíveis",              cat:"Vendas",   fmt:"Vídeo",     dur:"36min", lvl:"Iniciante",     done:false, prog:0   },
];
const FMT_COLOR = { "Vídeo":C.blue,"Ebook":C.purple,"Guia":C.green,"Treinamento":C.amber };
const LVL_COLOR = { "Iniciante":C.green,"Intermediário":C.amber,"Avançado":C.red };
const TICKETS = [
  { id:"#042", cat:"Performance", title:"Dashboard não carrega métricas do Meta Ads", status:"Em análise", created:"03 Mar", updated:"Há 2h"  },
  { id:"#038", cat:"Produção",    title:"Ajustar prazo da landing page",              status:"Concluído",  created:"22 Fev", updated:"01 Mar"  },
  { id:"#031", cat:"Financeiro",  title:"Fatura de Fevereiro não chegou por email",   status:"Concluído",  created:"10 Fev", updated:"11 Fev"  },
];
const FAQ = [
  { q:"Como solicito uma nova entrega?",               a:"Acesse Produção e clique em '+ Nova Solicitação'. Preencha tipo, descrição e prazo desejado. Sua equipe United responde em até 1 dia útil." },
  { q:"Onde encontro os meus criativos finais?",       a:"Todos os arquivos entregues ficam na aba Materiais, organizados por pasta. Baixe, visualize ou compartilhe diretamente." },
  { q:"Em quanto tempo recebo retorno de um chamado?", a:"Chamados são respondidos em até 4 horas úteis. Para urgências, use o WhatsApp para contato direto com sua equipe." },
  { q:"Posso adicionar outros usuários?",              a:"Sim. Acesse Configurações > Usuários e convide membros da equipe com permissões de visualização ou edição." },
  { q:"Como funciona o ciclo de relatórios?",          a:"Relatórios mensais são entregues até o 3º dia útil de cada mês. Relatórios de campanha podem ser solicitados a qualquer momento." },
];
const NAV = [
  { id:"dashboard",  icon:"⬡",  label:"Dashboard"     },
  { id:"producao",   icon:"◫",  label:"Produção",  b:3 },
  { id:"relatorios", icon:"◎",  label:"Relatórios"    },
  { id:"materiais",  icon:"◻",  label:"Materiais"     },
  { id:"reunioes",   icon:"◷",  label:"Reuniões",  b:2 },
  { id:"financeiro", icon:"◇",  label:"Financeiro"    },
  { id:"academy",    icon:"◆",  label:"Academy"       },
  { id:"suporte",    icon:"◉",  label:"Suporte",   b:1 },
  { id:"config",     icon:"⚙",  label:"Configurações" },
];

/* ═══════════════════════════════════════════════
   PRIMITIVES
═══════════════════════════════════════════════ */
function Card({ children, style = {}, lift = false }) {
  const t = useT();
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: t.bg2,
        border: `1px solid ${h && lift ? t.bStrong : t.b1}`,
        borderRadius: 12,
        transition: "border-color .18s, box-shadow .18s, transform .18s",
        boxShadow: h && lift ? `0 8px 28px ${t.shadow}` : `0 1px 4px ${t.shadow}`,
        transform: h && lift ? "translateY(-2px)" : "none",
        ...style,
      }}
    >{children}</div>
  );
}

function Btn({ children, onClick, variant = "primary", size = "md" }) {
  const t = useT();
  const [h, setH] = useState(false);
  const v = {
    primary: { bg: h ? (t.isDark ? "#E0E0E0" : "#333") : t.accent, color: t.accentText, border: `1px solid ${t.accent}` },
    ghost:   { bg: h ? t.bg3 : "transparent", color: t.t2, border: `1px solid ${t.b1}` },
    subtle:  { bg: h ? t.bg4 : t.bg3,         color: t.t2, border: `1px solid ${t.b1}` },
  }[variant] || {};
  const pad = size === "sm" ? "5px 13px" : size === "lg" ? "11px 26px" : "8px 18px";
  return (
    <button onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ padding: pad, borderRadius: 8, cursor: "pointer", fontSize: size === "sm" ? 11 : 12,
        fontWeight: 700, background: v.bg, color: v.color, border: v.border, transition: "all .15s" }}>
      {children}
    </button>
  );
}

/* Badge — always colored */
const Tag = ({ label, color, bg }) => (
  <span style={{ display:"inline-flex", alignItems:"center", fontSize:10, fontWeight:700,
    padding:"3px 9px", borderRadius:5, letterSpacing:.5, textTransform:"uppercase",
    color, background: bg || `${color}15`, border:`1px solid ${color}22` }}>
    {label}
  </span>
);

const StatusBadge = ({ status }) => {
  const map = {
    "Pago":        { c:C.green,  bg:C.greenBg  },
    "Pendente":    { c:C.amber,  bg:C.amberBg  },
    "Vencido":     { c:C.red,    bg:C.redBg    },
    "Em análise":  { c:C.blue,   bg:C.blueBg   },
    "Concluído":   { c:C.green,  bg:C.greenBg  },
    "Confirmada":  { c:C.green,  bg:C.greenBg  },
    "Conectado":   { c:C.green,  bg:C.greenBg  },
    "Desconectado":{ c:C.red,    bg:C.redBg    },
  };
  const s = map[status] || { c:"#888", bg:"rgba(128,128,128,0.1)" };
  return <span style={{ fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:20, color:s.c, background:s.bg }}>{status}</span>;
};

const DeltaBadge = ({ delta, pos = true }) => (
  <span style={{ fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:5,
    color: pos ? C.green : C.red, background: pos ? C.greenBg : C.redBg }}>{delta}</span>
);

function FilterPill({ label, active, onClick }) {
  const t = useT();
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ padding:"5px 13px", borderRadius:6, cursor:"pointer", fontSize:11, fontWeight:600,
        border: active ? `1px solid ${t.bStrong}` : `1px solid ${t.b1}`,
        background: active ? t.bg3 : (h ? t.bg3 : "transparent"),
        color: active ? t.t1 : t.t3, transition:"all .14s" }}>
      {label}
    </button>
  );
}
function FilterBar({ opts, active, onChange, label }) {
  const t = useT();
  return (
    <div style={{ display:"flex", alignItems:"center", gap:4, flexWrap:"wrap" }}>
      {label && <span style={{ color:t.t4, fontSize:9, fontWeight:700, letterSpacing:1.8, textTransform:"uppercase", marginRight:4 }}>{label}</span>}
      {opts.map(o => <FilterPill key={o} label={o} active={active===o} onClick={() => onChange(o)}/>)}
    </div>
  );
}
function PageHeader({ title, subtitle, action }) {
  const t = useT();
  return (
    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:28, paddingBottom:20, borderBottom:`1px solid ${t.b1}` }}>
      <div>
        <h1 style={{ color:t.t1, fontSize:22, fontWeight:800, letterSpacing:-0.5 }}>{title}</h1>
        {subtitle && <p style={{ color:t.t3, fontSize:12, marginTop:5, lineHeight:1.6 }}>{subtitle}</p>}
      </div>
      {action && <div style={{ marginTop:2 }}>{action}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   VISUALIZATIONS
═══════════════════════════════════════════════ */
function BarChart({ data, period = "12m", dataKey = "leads" }) {
  const t = useT();
  const slice = { "7d":1,"30d":2,"90d":3,"12m":6 }[period] || 6;
  const items = data.slice(-slice);
  const max = Math.max(...items.map(d => d[dataKey]));
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:7, height:72 }}>
      {items.map((d, i) => {
        const isLast = i === items.length - 1;
        const h = Math.max(5, (d[dataKey] / max) * 60);
        return (
          <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
            <div style={{ position:"relative", width:"100%", display:"flex", justifyContent:"center" }}>
              {isLast && (
                <div style={{ position:"absolute", bottom:"100%", marginBottom:5,
                  background:t.bg3, border:`1px solid ${t.b1}`, borderRadius:4,
                  padding:"2px 7px", color:t.t1, fontSize:9, fontWeight:700, whiteSpace:"nowrap" }}>
                  {d[dataKey].toLocaleString("pt-BR")}
                </div>
              )}
              <div style={{ width:"100%", borderRadius:"3px 3px 0 0", height:`${h}px`,
                background: isLast ? t.accent : t.bg4,
                opacity: isLast ? 1 : (t.isDark ? 1 : 0.5),
                transition:"height .7s cubic-bezier(.4,0,.2,1)" }}/>
            </div>
            <span style={{ fontSize:9, color:t.t4, fontWeight:500 }}>{d.m}</span>
          </div>
        );
      })}
    </div>
  );
}

function FunnelViz({ data }) {
  const t = useT();
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {data.map((item, i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:14 }}>
          <span style={{ width:72, textAlign:"right", fontSize:11, color:t.t3, flexShrink:0 }}>{item.s}</span>
          <div style={{ flex:1, height:32, background:t.bg3, borderRadius:6, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${item.p}%`,
              background: t.isDark ? `rgba(255,255,255,${0.14 - i*0.025})` : `rgba(0,0,0,${0.12 - i*0.02})`,
              borderRadius:6, display:"flex", alignItems:"center", paddingLeft:10,
              transition:"width 1s cubic-bezier(.4,0,.2,1)" }}>
              <span style={{ fontSize:11, fontWeight:700, color: i < 2 ? t.t1 : t.t2, whiteSpace:"nowrap" }}>
                {item.v.toLocaleString("pt-BR")}
              </span>
            </div>
          </div>
          <span style={{ width:34, textAlign:"right", fontSize:11, color:t.t2, fontWeight:700 }}>{item.p}%</span>
        </div>
      ))}
    </div>
  );
}

function ScoreRing({ score }) {
  const t = useT();
  const r = 52, circ = 2 * Math.PI * r, fill = (score / 100) * circ;
  return (
    <svg width="128" height="128" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r={r} fill="none" stroke={t.bg4} strokeWidth="9"/>
      <circle cx="70" cy="70" r={r} fill="none" stroke={t.accent} strokeWidth="9"
        strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" transform="rotate(-90 70 70)"
        style={{ transition:"stroke-dasharray 1.2s ease" }}/>
      <text x="70" y="64" textAnchor="middle" fill={t.t1} fontSize="26" fontWeight="800">{score}</text>
      <text x="70" y="82" textAnchor="middle" fill={t.t3} fontSize="10">Score</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   THEME TOGGLE BUTTON
═══════════════════════════════════════════════ */
function ThemeToggle({ isDark, onToggle }) {
  const t = useT();
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      title={isDark ? "Modo Claro" : "Modo Escuro"}
      style={{
        width: 60, height: 30, borderRadius: 15,
        background: h ? t.bg4 : t.bg3,
        border: `1px solid ${t.bStrong}`,
        cursor: "pointer", position: "relative",
        transition: "all .2s", flexShrink: 0,
        display: "flex", alignItems: "center",
        padding: "0 4px",
      }}
    >
      {/* track icons */}
      <span style={{ position:"absolute", left:7,  fontSize:11, opacity: isDark ? 0.3 : 1, transition:"opacity .2s" }}>☀</span>
      <span style={{ position:"absolute", right:7, fontSize:11, opacity: isDark ? 1 : 0.3, transition:"opacity .2s" }}>☽</span>
      {/* pill */}
      <div style={{
        width: 22, height: 22, borderRadius: "50%",
        background: t.accent,
        position: "absolute",
        left: isDark ? 33 : 4,
        transition: "left .22s cubic-bezier(.4,0,.2,1)",
        boxShadow: `0 1px 5px ${t.shadow}`,
      }}/>
    </button>
  );
}

/* ═══════════════════════════════════════════════
   MODE SWITCH
═══════════════════════════════════════════════ */
function ModeSwitch({ mode, onChange }) {
  const t = useT();
  return (
    <div style={{ position:"relative", display:"inline-flex", background:t.bg3, border:`1px solid ${t.b1}`, borderRadius:11, padding:3, gap:1 }}>
      <div style={{ position:"absolute", top:3, bottom:3, left: mode==="producao" ? 3 : "calc(50% + 1px)", width:"calc(50% - 4px)",
        background:t.accent, borderRadius:9, transition:"left .26s cubic-bezier(.4,0,.2,1)", boxShadow:`0 1px 6px ${t.shadow}` }}/>
      {[{ id:"producao",label:"Produção",icon:"⬡" },{ id:"performance",label:"Performance",icon:"◈" }].map(opt => (
        <button key={opt.id} onClick={() => onChange(opt.id)} style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", gap:6,
          padding:"8px 20px", background:"transparent", border:"none", borderRadius:9, cursor:"pointer", minWidth:128, justifyContent:"center", transition:"all .2s" }}>
          <span style={{ fontSize:12, color: mode===opt.id ? t.accentText : t.t3, transition:"color .22s" }}>{opt.icon}</span>
          <span style={{ fontSize:12, fontWeight:700, color: mode===opt.id ? t.accentText : t.t3, transition:"color .22s" }}>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PAGE: DASHBOARD
═══════════════════════════════════════════════ */
function DashboardPage({ onNav }) {
  const t = useT();
  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Visão geral da sua conta — Março 2025"
        action={<div style={{ display:"flex", gap:8 }}><Btn variant="ghost" size="sm">↓ Exportar</Btn><Btn size="sm">+ Solicitação</Btn></div>}/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:16 }}>
        {PERF_KPIS.map((k,i) => (
          <Card key={i} lift style={{ padding:"20px 22px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
              <span style={{ color:t.t3, fontSize:11 }}>{k.label}</span>
              <DeltaBadge delta={k.delta}/>
            </div>
            <div style={{ color:t.t1, fontSize:24, fontWeight:800, letterSpacing:-0.5 }}>{k.value}</div>
            <div style={{ color:t.t4, fontSize:10, marginTop:4 }}>{k.sub}</div>
          </Card>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 260px", gap:12, marginBottom:12 }}>
        <Card style={{ padding:"22px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
            <div><div style={{ color:t.t1, fontWeight:700, fontSize:13 }}>Leads por Período</div><div style={{ color:t.t3, fontSize:11, marginTop:2 }}>Últimos 6 meses</div></div>
            <DeltaBadge delta="↑ 42%"/>
          </div>
          <BarChart data={CHART_DATA}/>
        </Card>
        <Card style={{ padding:"22px" }}>
          <div style={{ color:t.t1, fontWeight:700, fontSize:13, marginBottom:20 }}>Funil de Aquisição</div>
          <FunnelViz data={FUNNEL}/>
        </Card>
        <Card style={{ padding:"22px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <div style={{ color:t.t3, fontSize:9, letterSpacing:2.5, textTransform:"uppercase", marginBottom:14 }}>Growth Score</div>
          <ScoreRing score={87}/>
          <div style={{ marginTop:14, textAlign:"center" }}>
            <div style={{ color:t.t1, fontSize:12, fontWeight:700 }}>Alta Performance</div>
            <div style={{ color:t.t3, fontSize:10, marginTop:3 }}>Top 15% dos clientes</div>
          </div>
        </Card>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Card style={{ padding:"22px" }}>
          <div style={{ color:t.t1, fontWeight:700, fontSize:13, marginBottom:18 }}>Central de Insights</div>
          {[
            { text:"Leads cresceram 42% em relação ao mês anterior", badge:{ l:"Alta",       c:C.green,  bg:C.greenBg  } },
            { text:"CPL caiu 18% — melhor resultado do trimestre",    badge:{ l:"Otimização", c:C.blue,   bg:C.blueBg   } },
            { text:"ROI 4,2× supera meta contratual de 3,5×",        badge:{ l:"Meta ✓",     c:C.amber,  bg:C.amberBg  } },
            { text:"3 entregas agendadas para esta semana",           badge:{ l:"Atenção",    c:"#888",   bg:"rgba(128,128,128,.1)" } },
          ].map((ins,i) => (
            <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"11px 0", borderBottom:i<3?`1px solid ${t.b2}`:"none" }}>
              <div style={{ flex:1, color:t.t2, fontSize:12, lineHeight:1.6 }}>{ins.text}</div>
              <Tag label={ins.badge.l} color={ins.badge.c} bg={ins.badge.bg}/>
            </div>
          ))}
        </Card>
        <Card style={{ padding:"22px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
            <div style={{ color:t.t1, fontWeight:700, fontSize:13 }}>Próximas Entregas</div>
            <button onClick={() => onNav("producao")} style={{ background:"transparent", border:"none", color:t.t3, fontSize:11, cursor:"pointer", fontWeight:600 }}>Ver tudo →</button>
          </div>
          {[
            { title:"Estratégia de Conteúdo Q2",       owner:"Rafael L.", due:"07 Mar", prio:"Alta"  },
            { title:"Vídeo Apresentação Institucional", owner:"Ana S.",    due:"12 Mar", prio:"Alta"  },
            { title:"Campanha Google Ads — Abril",      owner:"Rafael L.", due:"15 Mar", prio:"Média" },
          ].map((item,i) => {
            const pt = PRIO_TAG[item.prio];
            return (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 0", borderBottom:i<2?`1px solid ${t.b2}`:"none" }}>
                <div style={{ flex:1 }}>
                  <div style={{ color:t.t1, fontSize:12, fontWeight:600 }}>{item.title}</div>
                  <div style={{ color:t.t3, fontSize:11, marginTop:2 }}>{item.owner}</div>
                </div>
                <Tag label={item.prio} color={pt.c} bg={pt.bg}/>
                <span style={{ fontSize:11, color:t.t3, fontWeight:600 }}>{item.due}</span>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PAGE: PRODUÇÃO
═══════════════════════════════════════════════ */
function KanbanCard({ card }) {
  const t = useT();
  const [h, setH] = useState(false);
  const tt = TYPE_TAG[card.type] || { c:"#888", bg:"rgba(128,128,128,.1)" };
  const pt = PRIO_TAG[card.priority] || { c:"#888", bg:"rgba(128,128,128,.1)" };
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: h ? t.bg3 : t.bg2, border:`1px solid ${h ? t.bStrong : t.b1}`,
        borderRadius:10, padding:"14px 16px", cursor:"pointer",
        transform: h ? "translateY(-2px)" : "none",
        boxShadow: h ? `0 8px 24px ${t.shadow}` : "none",
        transition:"all .18s ease" }}>
      <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:10 }}>
        <Tag label={card.type}     color={tt.c} bg={tt.bg}/>
        <Tag label={card.priority} color={pt.c} bg={pt.bg}/>
      </div>
      <div style={{ color:t.t1, fontSize:13, fontWeight:600, lineHeight:1.5, marginBottom:12 }}>{card.title}</div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
        <div style={{ width:22, height:22, borderRadius:"50%", background:t.bg4, border:`1px solid ${t.b1}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:8, fontWeight:800, color:t.t2 }}>{card.owner.split(" ").map(p=>p[0]).join("")}</span>
        </div>
        <span style={{ fontSize:11, color:t.t3 }}>{card.owner}</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:10, borderTop:`1px solid ${t.b2}` }}>
        <div style={{ display:"flex", gap:10 }}>
          {card.comments>0 && <span style={{ fontSize:11, color:t.t4 }}>💬 {card.comments}</span>}
          {card.files>0    && <span style={{ fontSize:11, color:t.t4 }}>📎 {card.files}</span>}
        </div>
        <span style={{ fontSize:10, color:t.t4, background:t.bg4, padding:"2px 8px", borderRadius:4, fontWeight:600 }}>{card.due}</span>
      </div>
    </div>
  );
}
function ProducaoPage() {
  const t = useT();
  const [filter, setFilter] = useState("Todos");
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!API_URL) {
        setLoading(false);
        setError("API_URL não configurada");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/api/cliente/producao`);
        if (!res.ok) throw new Error("Erro ao carregar produção");
        const data = await res.json();
        const cols = Array.isArray(data?.columns) ? data.columns : Array.isArray(data) ? data : [];
        if (!cancelled) setColumns(cols || []);
      } catch (e) {
        if (!cancelled) setError(e.message || "Erro ao carregar produção");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const cols = columns.map(c => ({
    ...c,
    cards: filter === "Todos"
      ? (c.cards || [])
      : (c.cards || []).filter(x => x.type === filter),
  }));

  return (
    <div>
      <PageHeader title="Produção" subtitle="Esteira de execução de todas as entregas da sua conta."
        action={<Btn>+ Nova Solicitação</Btn>}/>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:22 }}>
        <FilterBar opts={["Todos","Campanha","Criativo","Vídeo","Landing Page","Automação"]} active={filter} onChange={setFilter} label="TIPO"/>
        <div style={{ flex:1 }}/>
        <Btn variant="ghost" size="sm">⚙ Filtros</Btn>
      </div>
      {loading && (
        <div style={{ color:t.t3, fontSize:12, marginBottom:12 }}>Carregando produção...</div>
      )}
      {error && !loading && (
        <div style={{ color:C.red, fontSize:12, marginBottom:12 }}>Erro: {error}</div>
      )}
      <div style={{ display:"flex", gap:12, overflowX:"auto", paddingBottom:10 }}>
        {cols.map(col => (
          <div key={col.id} style={{ minWidth:234, flex:"0 0 234px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:col.dot }}/>
              <span style={{ color:t.t2, fontSize:10, fontWeight:800, letterSpacing:1.5, textTransform:"uppercase", flex:1 }}>{col.label}</span>
              <span style={{ color:t.t3, fontSize:9, fontWeight:700, background:t.bg3, width:18, height:18, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>{col.cards.length}</span>
            </div>
            <div style={{ height:1, background:`linear-gradient(90deg,${col.dot}44,transparent)`, marginBottom:12 }}/>
            <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
              {col.cards.map(c => <KanbanCard key={c.id} card={c}/>)}
              {col.cards.length===0 && (
                <div style={{ border:`1px dashed ${t.b1}`, borderRadius:10, padding:"22px", textAlign:"center", color:t.t4, fontSize:12 }}>Nenhum item</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PAGE: PERFORMANCE
═══════════════════════════════════════════════ */
function PerformancePage() {
  const t = useT();
  const [channel, setChannel] = useState("Todos");
  const [period,  setPeriod]  = useState("12m");
  return (
    <div>
      <PageHeader title="Performance" subtitle="Métricas de marketing e resultados da sua conta."/>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:22, flexWrap:"wrap" }}>
        <FilterBar opts={["Todos","Meta Ads","Google Ads","Orgânico","Email","Outros"]} active={channel} onChange={setChannel} label="CANAL"/>
        <div style={{ width:1, height:16, background:t.b1, margin:"0 4px" }}/>
        <FilterBar opts={["7d","30d","90d","12m"]} active={period} onChange={setPeriod}/>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:14 }}>
        {PERF_KPIS.map((k,i) => (
          <Card key={i} lift style={{ padding:"20px 22px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
              <span style={{ color:t.t3, fontSize:11 }}>{k.label}</span>
              <DeltaBadge delta={k.delta}/>
            </div>
            <div style={{ color:t.t1, fontSize:22, fontWeight:800, letterSpacing:-0.4 }}>{k.value}</div>
            <div style={{ color:t.t4, fontSize:10, marginTop:4 }}>{k.sub}</div>
          </Card>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
        <Card style={{ padding:"22px 22px 16px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:18 }}>
            <div><div style={{ color:t.t1, fontWeight:700, fontSize:13 }}>Leads por Período</div><div style={{ color:t.t3, fontSize:11, marginTop:2 }}>{channel==="Todos"?"Todos os canais":channel}</div></div>
            <DeltaBadge delta="↑ 42%"/>
          </div>
          <BarChart data={CHART_DATA} period={period}/>
        </Card>
        <Card style={{ padding:"22px 22px 16px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:18 }}>
            <div><div style={{ color:t.t1, fontWeight:700, fontSize:13 }}>Conversões</div><div style={{ color:t.t3, fontSize:11, marginTop:2 }}>Fechamentos realizados</div></div>
            <DeltaBadge delta="+18%"/>
          </div>
          <BarChart data={CHART_DATA} period={period} dataKey="conv"/>
        </Card>
      </div>
      <Card style={{ padding:"24px 26px" }}>
        <div style={{ color:t.t1, fontWeight:700, fontSize:13, marginBottom:18 }}>Funil de Aquisição Completo</div>
        <FunnelViz data={FUNNEL}/>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginTop:20, paddingTop:20, borderTop:`1px solid ${t.b1}` }}>
          {FUNNEL.map((f,i) => (
            <div key={i} style={{ textAlign:"center", padding:14, background:t.bg3, borderRadius:10, border:`1px solid ${t.b1}` }}>
              <div style={{ color:t.t1, fontSize:20, fontWeight:800 }}>{f.v.toLocaleString("pt-BR")}</div>
              <div style={{ color:t.t3, fontSize:11, marginTop:4 }}>{f.s}</div>
              {i>0 && <div style={{ color:t.t4, fontSize:9, marginTop:3 }}>{f.p}% do topo</div>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PAGE: RELATÓRIOS
═══════════════════════════════════════════════ */
function RelatoriosPage() {
  const t = useT();
  const [tf, setTf] = useState("Todos");
  const [vw, setVw] = useState("list");
  const items = tf==="Todos" ? REPORTS : REPORTS.filter(r=>r.type===tf);
  return (
    <div>
      <PageHeader title="Relatórios" subtitle="Biblioteca de relatórios produzidos pela equipe United."
        action={
          <div style={{ display:"flex", gap:6 }}>
            {["list","grid"].map(v => (
              <button key={v} onClick={() => setVw(v)} style={{ padding:"6px 12px", borderRadius:7, background:vw===v?t.bg3:"transparent", border:`1px solid ${vw===v?t.bStrong:t.b1}`, color:vw===v?t.t1:t.t3, fontSize:12, cursor:"pointer" }}>
                {v==="list"?"☰ Lista":"⊞ Grade"}
              </button>
            ))}
          </div>
        }/>
      <div style={{ marginBottom:22 }}><FilterBar opts={["Todos","Mensal","Campanha","Estratégico","Tráfego","Crescimento"]} active={tf} onChange={setTf} label="TIPO"/></div>
      {vw==="list" ? (
        <div style={{ display:"flex", flexDirection:"column", gap:0, border:`1px solid ${t.b1}`, borderRadius:10, overflow:"hidden" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 110px 110px 100px 80px", gap:12, padding:"9px 20px", background:t.bg3 }}>
            {["Relatório","Período","Data","Tipo",""].map((h,i) => (
              <span key={i} style={{ color:t.t4, fontSize:9, fontWeight:800, letterSpacing:1.4, textTransform:"uppercase" }}>{h}</span>
            ))}
          </div>
          {items.map((r,i) => {
            const rc = RPT_COLOR[r.type]||"#888";
            return (
              <div key={r.id} style={{ display:"grid", gridTemplateColumns:"1fr 110px 110px 100px 80px", gap:12, padding:"13px 20px", alignItems:"center",
                background: t.bg2, borderTop:`1px solid ${t.b1}`, transition:"background .14s", cursor:"default" }}
                onMouseEnter={e => e.currentTarget.style.background=t.bg3}
                onMouseLeave={e => e.currentTarget.style.background=t.bg2}>
                <div>
                  <div style={{ color:t.t1, fontSize:12, fontWeight:600 }}>{r.title}</div>
                  <div style={{ color:t.t4, fontSize:10, marginTop:2 }}>{r.owner} · {r.pages} páginas</div>
                </div>
                <span style={{ color:t.t2, fontSize:12 }}>{r.period}</span>
                <span style={{ color:t.t3, fontSize:12 }}>{r.date}</span>
                <Tag label={r.type} color={rc} bg={`${rc}14`}/>
                <Btn variant="ghost" size="sm">↓ PDF</Btn>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {items.map(r => {
            const rc = RPT_COLOR[r.type]||"#888";
            return (
              <Card key={r.id} lift style={{ padding:"22px", cursor:"default" }}>
                <div style={{ height:80, background:t.bg3, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16, border:`1px solid ${t.b1}` }}>
                  <span style={{ color:t.t3, fontSize:32 }}>◎</span>
                </div>
                <Tag label={r.type} color={rc} bg={`${rc}14`}/>
                <div style={{ color:t.t1, fontSize:13, fontWeight:700, margin:"10px 0 4px", lineHeight:1.4 }}>{r.title}</div>
                <div style={{ color:t.t3, fontSize:11, marginBottom:16 }}>{r.period} · {r.pages} pág.</div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:14, borderTop:`1px solid ${t.b1}` }}>
                  <span style={{ color:t.t4, fontSize:11 }}>{r.date}</span>
                  <Btn size="sm">↓ Baixar</Btn>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PAGE: MATERIAIS
═══════════════════════════════════════════════ */
function MateriaisPage() {
  const t = useT();
  const [folder, setFolder] = useState(null);
  const [search, setSearch] = useState("");
  const fdata = MAT_FOLDERS.find(f=>f.id===folder);
  const files = folder ? (FILES[folder]||[]).filter(f=>f.name.toLowerCase().includes(search.toLowerCase())) : [];

  const Row = ({ f, i, last }) => (
    <div style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 18px",
      background:t.bg2, borderTop:i>0?`1px solid ${t.b1}`:undefined, transition:"background .14s" }}
      onMouseEnter={e=>e.currentTarget.style.background=t.bg3}
      onMouseLeave={e=>e.currentTarget.style.background=t.bg2}>
      <div style={{ width:38, height:38, borderRadius:9, background:t.bg4, border:`1px solid ${t.b1}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ color:t.t3, fontSize:16 }}>◻</span>
      </div>
      <div style={{ flex:1 }}>
        <div style={{ color:t.t1, fontSize:12, fontWeight:600 }}>{f.name}</div>
        <div style={{ color:t.t4, fontSize:10, marginTop:2 }}>{f.ext} · {f.size} · {f.date}</div>
      </div>
      <Tag label={f.ext} color={t.t2} bg={t.bg4}/>
      <div style={{ display:"flex", gap:6 }}>
        <Btn variant="ghost" size="sm">👁</Btn>
        <Btn variant="ghost" size="sm">↗</Btn>
        <Btn variant="ghost" size="sm">↓</Btn>
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader title="Materiais" subtitle="Drive privado com todos os seus arquivos organizados." action={<Btn>↑ Enviar Arquivo</Btn>}/>
      {!folder ? (
        <>
          <div style={{ position:"relative", marginBottom:22 }}>
            <span style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:t.t3, fontSize:14 }}>🔍</span>
            <input placeholder="Buscar arquivos e pastas..." style={{ width:"100%", maxWidth:380, padding:"9px 14px 9px 40px", background:t.bg3, border:`1px solid ${t.b1}`, borderRadius:9, color:t.t1, fontSize:12, outline:"none" }}/>
          </div>
          <div style={{ color:t.t4, fontSize:9, fontWeight:800, letterSpacing:2, textTransform:"uppercase", marginBottom:14 }}>PASTAS</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:28 }}>
            {MAT_FOLDERS.map(f => (
              <Card key={f.id} lift style={{ padding:"20px 22px", cursor:"pointer" }}>
                <div onClick={() => setFolder(f.id)} style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:46, height:46, borderRadius:11, background:t.bg3, border:`1px solid ${t.b1}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ fontSize:20, color:t.t2 }}>{f.icon}</span>
                  </div>
                  <div>
                    <div style={{ color:t.t1, fontSize:13, fontWeight:700 }}>{f.label}</div>
                    <div style={{ color:t.t3, fontSize:11, marginTop:3 }}>{f.count} arquivos · {f.size}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div style={{ color:t.t4, fontSize:9, fontWeight:800, letterSpacing:2, textTransform:"uppercase", marginBottom:14 }}>RECENTES</div>
          <div style={{ border:`1px solid ${t.b1}`, borderRadius:10, overflow:"hidden" }}>
            {Object.values(FILES).flat().slice(0,5).map((f,i) => <Row key={i} f={f} i={i} last={i===4}/>)}
          </div>
        </>
      ) : (
        <>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:22 }}>
            <Btn variant="ghost" size="sm" onClick={() => { setFolder(null); setSearch(""); }}>← Voltar</Btn>
            <div style={{ width:36, height:36, borderRadius:9, background:t.bg3, border:`1px solid ${t.b1}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ color:t.t2 }}>{fdata?.icon}</span>
            </div>
            <div><div style={{ color:t.t1, fontSize:14, fontWeight:700 }}>{fdata?.label}</div><div style={{ color:t.t3, fontSize:11 }}>{fdata?.count} arquivos</div></div>
            <div style={{ flex:1 }}/>
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:t.t3, fontSize:12 }}>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." style={{ padding:"7px 10px 7px 28px", background:t.bg3, border:`1px solid ${t.b1}`, borderRadius:8, color:t.t1, fontSize:12, outline:"none", width:180 }}/>
            </div>
          </div>
          <div style={{ border:`1px solid ${t.b1}`, borderRadius:10, overflow:"hidden" }}>
            {files.map((f,i) => <Row key={i} f={f} i={i} last={i===files.length-1}/>)}
          </div>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PAGE: REUNIÕES
═══════════════════════════════════════════════ */
function ReunioesPage() {
  const t = useT();
  const [tab, setTab] = useState("upcoming");
  const [exp, setExp] = useState(null);
  return (
    <div>
      <PageHeader title="Reuniões" subtitle="Agenda, histórico e gravações de reuniões." action={<Btn>+ Agendar</Btn>}/>
      <div style={{ display:"flex", gap:0, marginBottom:24, borderBottom:`1px solid ${t.b1}` }}>
        {[{ id:"upcoming",label:"Próximas" },{ id:"past",label:"Histórico" }].map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)} style={{ padding:"8px 20px", background:"transparent", border:"none",
            borderBottom:tab===tb.id?`2px solid ${t.accent}`:"2px solid transparent",
            color:tab===tb.id?t.t1:t.t3, fontSize:13, fontWeight:700, cursor:"pointer", marginBottom:-1, transition:"all .18s" }}>
            {tb.label}
          </button>
        ))}
      </div>
      {tab==="upcoming" && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {MEET_UP.map(m => (
            <Card key={m.id} style={{ overflow:"hidden" }}>
              <div onClick={() => setExp(exp===m.id?null:m.id)} style={{ padding:"20px 24px", display:"flex", alignItems:"center", gap:18, cursor:"pointer" }}>
                <div style={{ width:50, height:50, borderRadius:13, flexShrink:0, background:t.bg3, border:`1px solid ${t.b1}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ color:t.t2, fontSize:20 }}>◷</span>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ color:t.t1, fontSize:14, fontWeight:700 }}>{m.title}</div>
                  <div style={{ color:t.t3, fontSize:11, marginTop:4, display:"flex", gap:14, flexWrap:"wrap" }}>
                    <span>📅 {m.date}</span><span>🕐 {m.time}</span><span>🎥 {m.via}</span><span>👤 {m.owner}</span>
                  </div>
                </div>
                <StatusBadge status="Confirmada"/>
                <Btn size="sm">Entrar</Btn>
                <span style={{ color:t.t3, fontSize:12 }}>{exp===m.id?"▲":"▼"}</span>
              </div>
              {exp===m.id && (
                <div style={{ borderTop:`1px solid ${t.b1}`, padding:"16px 24px", background:t.bg3 }}>
                  <div style={{ color:t.t4, fontSize:9, fontWeight:800, letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>PAUTA</div>
                  {m.agenda.map((a,i) => (
                    <div key={i} style={{ display:"flex", gap:10, padding:"7px 0", borderBottom:i<m.agenda.length-1?`1px solid ${t.b2}`:"none" }}>
                      <span style={{ color:t.t3, fontSize:10 }}>◆</span>
                      <span style={{ color:t.t2, fontSize:12 }}>{a}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
      {tab==="past" && (
        <div style={{ border:`1px solid ${t.b1}`, borderRadius:10, overflow:"hidden" }}>
          {MEET_PAST.map((m,i) => (
            <div key={m.id} style={{ display:"flex", alignItems:"center", gap:16, padding:"14px 20px",
              background:t.bg2, borderTop:i>0?`1px solid ${t.b1}`:undefined, transition:"background .14s" }}
              onMouseEnter={e=>e.currentTarget.style.background=t.bg3}
              onMouseLeave={e=>e.currentTarget.style.background=t.bg2}>
              <div style={{ width:40, height:40, borderRadius:10, background:t.bg4, border:`1px solid ${t.b1}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ color:t.t3, fontSize:16 }}>◷</span>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ color:t.t1, fontSize:13, fontWeight:600 }}>{m.title}</div>
                <div style={{ color:t.t3, fontSize:11, marginTop:2 }}>{m.date} · {m.via} · {m.dur}</div>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                {m.rec && <Tag label="▶ Gravação" color={C.blue}  bg={C.blueBg}/>}
                {m.ata && <Tag label="📄 Ata"     color={C.green} bg={C.greenBg}/>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PAGE: FINANCEIRO
═══════════════════════════════════════════════ */
function FinanceiroPage() {
  const t = useT();
  return (
    <div>
      <PageHeader title="Financeiro" subtitle="Gestão de faturas e histórico de pagamentos."/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:16 }}>
        {[
          { label:"Plano",            value:"Growth",   sub:"R$ 4.800/mês" },
          { label:"Próx. Vencimento", value:"15 Mar",   sub:"Em 11 dias"   },
          { label:"Em Aberto",        value:"R$ 4.800", sub:"1 fatura"     },
          { label:"Status",           value:"Em dia",   sub:"Sem pendências"},
        ].map((s,i) => (
          <Card key={i} lift style={{ padding:"20px 22px" }}>
            <div style={{ color:t.t3, fontSize:11, marginBottom:12 }}>{s.label}</div>
            <div style={{ color:t.t1, fontSize:20, fontWeight:800 }}>{s.value}</div>
            <div style={{ color:t.t4, fontSize:10, marginTop:4 }}>{s.sub}</div>
          </Card>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
        <Card style={{ padding:"24px" }}>
          <div style={{ color:t.t3, fontSize:9, fontWeight:800, letterSpacing:2, textTransform:"uppercase", marginBottom:16 }}>PLANO CONTRATADO</div>
          <div style={{ color:t.t1, fontSize:16, fontWeight:800, marginBottom:4 }}>Plano Growth</div>
          <div style={{ color:t.t3, fontSize:11, marginBottom:18 }}>Jan 2025 – Dez 2025</div>
          {["Gestão Meta Ads + Google Ads","Criativos mensais (8 peças)","Relatórios mensais","Reuniões quinzenais","Acesso ao Growth Hub"].map((item,i) => (
            <div key={i} style={{ display:"flex", gap:8, padding:"7px 0", borderBottom:i<4?`1px solid ${t.b2}`:"none" }}>
              <Tag label="✓" color={C.green} bg={C.greenBg}/>
              <span style={{ color:t.t2, fontSize:12 }}>{item}</span>
            </div>
          ))}
        </Card>
        <Card style={{ padding:"24px" }}>
          <div style={{ color:t.t3, fontSize:9, fontWeight:800, letterSpacing:2, textTransform:"uppercase", marginBottom:16 }}>RESUMO</div>
          {[
            { label:"Pago em 2025",       value:"R$ 9.600,00",  badge:{ l:"Pago",     c:C.green, bg:C.greenBg } },
            { label:"Em aberto",          value:"R$ 4.800,00",  badge:{ l:"Pendente", c:C.amber, bg:C.amberBg } },
            { label:"Total do contrato",  value:"R$ 57.600,00", badge:null },
          ].map((row,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 16px", background:t.bg3, borderRadius:9, marginBottom:8, border:`1px solid ${t.b1}` }}>
              <span style={{ color:t.t2, fontSize:12 }}>{row.label}</span>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ color:t.t1, fontSize:14, fontWeight:800 }}>{row.value}</span>
                {row.badge && <Tag label={row.badge.l} color={row.badge.c} bg={row.badge.bg}/>}
              </div>
            </div>
          ))}
        </Card>
      </div>
      <Card style={{ padding:0, overflow:"hidden" }}>
        <div style={{ padding:"16px 22px", borderBottom:`1px solid ${t.b1}` }}>
          <div style={{ color:t.t1, fontWeight:700, fontSize:13 }}>Histórico de Faturas</div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 130px 110px 100px 110px 80px", gap:12, padding:"9px 22px", background:t.bg3, borderBottom:`1px solid ${t.b1}` }}>
          {["Período","Valor","Vencimento","Status","Pago em",""].map((h,i) => (
            <span key={i} style={{ color:t.t4, fontSize:9, fontWeight:800, letterSpacing:1.4, textTransform:"uppercase" }}>{h}</span>
          ))}
        </div>
        {INVOICES.map((inv,i) => (
          <div key={inv.id} style={{ display:"grid", gridTemplateColumns:"1fr 130px 110px 100px 110px 80px", gap:12, padding:"13px 22px", alignItems:"center", borderBottom:i<INVOICES.length-1?`1px solid ${t.b2}`:"none", transition:"background .14s" }}
            onMouseEnter={e=>e.currentTarget.style.background=t.bg3}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div>
              <div style={{ color:t.t1, fontSize:12, fontWeight:600 }}>{inv.period}</div>
              <div style={{ color:t.t4, fontSize:10, marginTop:1 }}>{inv.id}</div>
            </div>
            <span style={{ color:t.t1, fontSize:12, fontWeight:700 }}>{inv.value}</span>
            <span style={{ color:t.t2, fontSize:12 }}>{inv.due}</span>
            <StatusBadge status={inv.status}/>
            <span style={{ color:t.t3, fontSize:12 }}>{inv.paid||"—"}</span>
            <Btn variant="ghost" size="sm">↓ PDF</Btn>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PAGE: ACADEMY
═══════════════════════════════════════════════ */
function AcademyPage() {
  const t = useT();
  const [cat, setCat] = useState("Todos");
  const [lvl, setLvl] = useState("Todos");
  const items = ACADEMY.filter(c => (cat==="Todos"||c.cat===cat) && (lvl==="Todos"||c.lvl===lvl));
  const done = ACADEMY.filter(c=>c.prog===100).length;
  return (
    <div>
      <PageHeader title="Academy" subtitle="Aprenda marketing, tráfego e estratégias de crescimento."/>
      <Card style={{ padding:"20px 24px", marginBottom:22, display:"flex", alignItems:"center", gap:20 }}>
        <div style={{ width:56, height:56, borderRadius:14, background:t.bg3, border:`1px solid ${t.b1}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <span style={{ fontSize:24 }}>🎓</span>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ color:t.t1, fontSize:13, fontWeight:700, marginBottom:8 }}>Seu progresso na Academy</div>
          <div style={{ background:t.bg4, borderRadius:6, height:5, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${(done/ACADEMY.length)*100}%`, background:t.accent, borderRadius:6, transition:"width 1s ease" }}/>
          </div>
          <div style={{ color:t.t3, fontSize:11, marginTop:6 }}>{done} de {ACADEMY.length} concluídos</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ color:t.t1, fontSize:26, fontWeight:800 }}>{Math.round((done/ACADEMY.length)*100)}%</div>
          <div style={{ color:t.t3, fontSize:10 }}>concluído</div>
        </div>
      </Card>
      <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:22, flexWrap:"wrap" }}>
        <FilterBar opts={["Todos","Funil","Tráfego","Marketing","Vendas","Estratégia"]} active={cat} onChange={setCat} label="ÁREA"/>
        <div style={{ width:1, height:16, background:t.b1 }}/>
        <FilterBar opts={["Todos","Iniciante","Intermediário","Avançado"]} active={lvl} onChange={setLvl} label="NÍVEL"/>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
        {items.map(item => {
          const fc = FMT_COLOR[item.fmt]||"#888";
          const lc = LVL_COLOR[item.lvl]||"#888";
          return (
            <Card key={item.id} lift style={{ overflow:"hidden", cursor:"pointer" }}>
              <div style={{ height:80, background:t.bg3, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", borderBottom:`1px solid ${t.b1}` }}>
                <span style={{ color:t.t3, fontSize:32 }}>◆</span>
                {item.done && (
                  <div style={{ position:"absolute", top:10, right:10, background:C.green, borderRadius:"50%", width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ color:"#fff", fontSize:10, fontWeight:700 }}>✓</span>
                  </div>
                )}
                {item.prog>0 && item.prog<100 && (
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:t.bg4 }}>
                    <div style={{ height:"100%", width:`${item.prog}%`, background:t.accent }}/>
                  </div>
                )}
              </div>
              <div style={{ padding:"16px" }}>
                <div style={{ display:"flex", gap:5, marginBottom:10 }}>
                  <Tag label={item.fmt} color={fc} bg={`${fc}14`}/>
                  <Tag label={item.lvl} color={lc} bg={`${lc}14`}/>
                </div>
                <div style={{ color:t.t1, fontSize:13, fontWeight:700, lineHeight:1.45, marginBottom:8 }}>{item.title}</div>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
                  <span style={{ color:t.t3, fontSize:11 }}>⏱ {item.dur}</span>
                  <span style={{ color:t.t3, fontSize:11 }}>{item.cat}</span>
                </div>
                {item.prog===100 ? (
                  <div style={{ padding:"7px", borderRadius:7, background:C.greenBg, border:`1px solid ${C.green}25`, color:C.green, fontSize:11, fontWeight:700, textAlign:"center" }}>✓ Concluído</div>
                ) : item.prog>0 ? (
                  <div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                      <span style={{ fontSize:10, color:t.t3 }}>Em andamento</span>
                      <span style={{ fontSize:10, color:t.t1, fontWeight:700 }}>{item.prog}%</span>
                    </div>
                    <div style={{ background:t.bg4, borderRadius:4, height:4 }}>
                      <div style={{ height:"100%", width:`${item.prog}%`, background:t.accent, borderRadius:4 }}/>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding:"7px", borderRadius:7, background:t.bg4, border:`1px solid ${t.b1}`, color:t.t2, fontSize:11, fontWeight:700, textAlign:"center" }}>▶ Iniciar</div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PAGE: SUPORTE
═══════════════════════════════════════════════ */
function SuportePage() {
  const t = useT();
  const [tab, setTab] = useState("tickets");
  const [faqOpen, setFaqOpen] = useState(null);
  const [form, setForm] = useState({ tipo:"", desc:"", prio:"Média" });
  return (
    <div>
      <PageHeader title="Suporte" subtitle="Central de atendimento e ajuda da United."/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:24 }}>
        {[
          { label:"Abrir Chamado",        icon:"📩", badge:{ l:"Novo",       c:C.blue,   bg:C.blueBg   }, action:()=>setTab("novo") },
          { label:"Falar no WhatsApp",     icon:"💬", badge:{ l:"Online",     c:C.green,  bg:C.greenBg  }, action:()=>{} },
          { label:"Base de Conhecimento", icon:"📚", badge:{ l:"42 artigos", c:C.purple, bg:C.purpleBg }, action:()=>setTab("faq") },
        ].map((a,i) => (
          <Card key={i} lift style={{ padding:"20px 22px", cursor:"pointer" }}>
            <div onClick={a.action}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                <div style={{ width:42, height:42, borderRadius:11, background:t.bg3, border:`1px solid ${t.b1}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:20 }}>{a.icon}</span>
                </div>
                <Tag label={a.badge.l} color={a.badge.c} bg={a.badge.bg}/>
              </div>
              <div style={{ color:t.t1, fontSize:13, fontWeight:700 }}>{a.label}</div>
            </div>
          </Card>
        ))}
      </div>
      <div style={{ display:"flex", gap:0, marginBottom:22, borderBottom:`1px solid ${t.b1}` }}>
        {[{ id:"tickets",label:"Chamados" },{ id:"faq",label:"FAQ" },{ id:"novo",label:"Novo Chamado" }].map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)} style={{ padding:"8px 18px", background:"transparent", border:"none",
            borderBottom:tab===tb.id?`2px solid ${t.accent}`:"2px solid transparent",
            color:tab===tb.id?t.t1:t.t3, fontSize:13, fontWeight:700, cursor:"pointer", marginBottom:-1, transition:"all .18s" }}>
            {tb.label}
          </button>
        ))}
      </div>
      {tab==="tickets" && (
        <div style={{ border:`1px solid ${t.b1}`, borderRadius:10, overflow:"hidden" }}>
          {TICKETS.map((tc,i) => (
            <div key={tc.id} style={{ display:"flex", alignItems:"center", gap:16, padding:"14px 20px",
              background:t.bg2, borderTop:i>0?`1px solid ${t.b1}`:undefined, transition:"background .14s" }}
              onMouseEnter={e=>e.currentTarget.style.background=t.bg3}
              onMouseLeave={e=>e.currentTarget.style.background=t.bg2}>
              <div style={{ width:40, height:40, borderRadius:10, background:t.bg4, border:`1px solid ${t.b1}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ color:t.t3, fontSize:16 }}>◉</span>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                  <span style={{ color:t.t4, fontSize:10, fontWeight:700 }}>{tc.id}</span>
                  <Tag label={tc.cat} color={C.blue} bg={C.blueBg}/>
                </div>
                <div style={{ color:t.t1, fontSize:12, fontWeight:600 }}>{tc.title}</div>
                <div style={{ color:t.t4, fontSize:10, marginTop:2 }}>Aberto {tc.created} · {tc.updated}</div>
              </div>
              <StatusBadge status={tc.status}/>
              <Btn variant="ghost" size="sm">Detalhes</Btn>
            </div>
          ))}
        </div>
      )}
      {tab==="faq" && (
        <div style={{ border:`1px solid ${t.b1}`, borderRadius:10, overflow:"hidden" }}>
          {FAQ.map((item,i) => (
            <div key={i} style={{ background:t.bg2, borderTop:i>0?`1px solid ${t.b1}`:undefined, overflow:"hidden" }}>
              <div onClick={() => setFaqOpen(faqOpen===i?null:i)} style={{ padding:"15px 20px", display:"flex", justifyContent:"space-between", cursor:"pointer", transition:"background .14s" }}
                onMouseEnter={e=>e.currentTarget.style.background=t.bg3}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <span style={{ color:t.t1, fontSize:13, fontWeight:600 }}>{item.q}</span>
                <span style={{ color:t.t3, fontSize:12, marginLeft:16 }}>{faqOpen===i?"▲":"▼"}</span>
              </div>
              {faqOpen===i && (
                <div style={{ padding:"0 20px 16px", borderTop:`1px solid ${t.b1}`, paddingTop:14, background:t.bg3 }}>
                  <p style={{ color:t.t2, fontSize:12, lineHeight:1.7 }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {tab==="novo" && (
        <div style={{ maxWidth:580 }}>
          <Card style={{ padding:"28px" }}>
            <div style={{ color:t.t1, fontSize:14, fontWeight:700, marginBottom:22 }}>Novo Chamado de Suporte</div>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div>
                <label style={{ color:t.t3, fontSize:9, fontWeight:800, letterSpacing:1.8, textTransform:"uppercase", display:"block", marginBottom:8 }}>Categoria</label>
                <select value={form.tipo} onChange={e=>setForm({...form,tipo:e.target.value})} style={{ width:"100%", padding:"10px 14px", background:t.bg3, border:`1px solid ${t.b1}`, borderRadius:9, color:t.t1, fontSize:12, outline:"none" }}>
                  <option value="">Selecione uma categoria</option>
                  {["Produção","Performance","Materiais","Financeiro","Técnico","Outros"].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color:t.t3, fontSize:9, fontWeight:800, letterSpacing:1.8, textTransform:"uppercase", display:"block", marginBottom:8 }}>Descrição</label>
                <textarea value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} rows={4} placeholder="Descreva o problema..." style={{ width:"100%", padding:"10px 14px", background:t.bg3, border:`1px solid ${t.b1}`, borderRadius:9, color:t.t1, fontSize:12, outline:"none", resize:"vertical", lineHeight:1.6 }}/>
              </div>
              <div>
                <label style={{ color:t.t3, fontSize:9, fontWeight:800, letterSpacing:1.8, textTransform:"uppercase", display:"block", marginBottom:8 }}>Prioridade</label>
                <div style={{ display:"flex", gap:8 }}>
                  {["Baixa","Média","Alta"].map(p => {
                    const pt = PRIO_TAG[p]; const a = form.prio===p;
                    return (
                      <button key={p} onClick={() => setForm({...form,prio:p})} style={{ flex:1, padding:"9px", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:700,
                        border: a?`1px solid ${pt.c}40`:`1px solid ${t.b1}`, background: a?pt.bg:"transparent", color: a?pt.c:t.t3, transition:"all .14s" }}>{p}</button>
                    );
                  })}
                </div>
              </div>
              <div style={{ border:`1px dashed ${t.b1}`, borderRadius:9, padding:20, textAlign:"center", cursor:"pointer" }}
                onMouseEnter={e=>e.currentTarget.style.borderColor=t.bStrong}
                onMouseLeave={e=>e.currentTarget.style.borderColor=t.b1}>
                <span style={{ color:t.t3, fontSize:12 }}>📎 Clique ou arraste arquivos aqui</span>
              </div>
              <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
                <Btn variant="ghost" onClick={() => setTab("tickets")}>Cancelar</Btn>
                <Btn>Enviar Chamado</Btn>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PAGE: CONFIGURAÇÕES
═══════════════════════════════════════════════ */
function ConfigPage() {
  const t = useT();
  const [sec, setSec] = useState("perfil");
  const secs = [{ id:"perfil",label:"Perfil & Empresa" },{ id:"usuarios",label:"Usuários" },{ id:"notif",label:"Notificações" },{ id:"integ",label:"Integrações" }];
  return (
    <div>
      <PageHeader title="Configurações" subtitle="Gerencie sua conta e preferências da plataforma."/>
      <div style={{ display:"grid", gridTemplateColumns:"190px 1fr", gap:14 }}>
        <Card style={{ padding:"8px" }}>
          {secs.map(s => (
            <div key={s.id} onClick={() => setSec(s.id)} style={{ padding:"9px 14px", borderRadius:8, cursor:"pointer",
              background: sec===s.id ? t.bg4 : "transparent",
              borderLeft: sec===s.id ? `2px solid ${t.accent}` : "2px solid transparent",
              color: sec===s.id ? t.t1 : t.t3,
              fontSize:12, fontWeight:sec===s.id?700:500, transition:"all .14s" }}
              onMouseEnter={e => { if(sec!==s.id) e.currentTarget.style.background=t.bg3; }}
              onMouseLeave={e => { if(sec!==s.id) e.currentTarget.style.background="transparent"; }}>
              {s.label}
            </div>
          ))}
        </Card>
        <div>
          {sec==="perfil" && (
            <Card style={{ padding:"28px" }}>
              <div style={{ color:t.t1, fontWeight:700, fontSize:13, marginBottom:22 }}>Perfil & Empresa</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:18 }}>
                {[
                  { label:"Nome",     val:"João Carlos Silva"      },
                  { label:"Empresa",  val:"TechVision LTDA"         },
                  { label:"Email",    val:"joao@techvision.com.br"  },
                  { label:"Telefone", val:"(11) 99999-9999"         },
                  { label:"CNPJ",     val:"12.345.678/0001-99"      },
                  { label:"Segmento", val:"Tecnologia / SaaS"       },
                ].map((f,i) => (
                  <div key={i}>
                    <label style={{ color:t.t3, fontSize:9, fontWeight:800, letterSpacing:1.8, textTransform:"uppercase", display:"block", marginBottom:7 }}>{f.label}</label>
                    <input defaultValue={f.val} style={{ width:"100%", padding:"9px 13px", background:t.bg3, border:`1px solid ${t.b1}`, borderRadius:8, color:t.t1, fontSize:12, outline:"none" }}/>
                  </div>
                ))}
              </div>
              <Btn>Salvar Alterações</Btn>
            </Card>
          )}
          {sec==="usuarios" && (
            <Card style={{ padding:"28px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
                <div style={{ color:t.t1, fontWeight:700, fontSize:13 }}>Usuários da Conta</div>
                <Btn size="sm">+ Convidar</Btn>
              </div>
              {[
                { name:"João Carlos Silva",  email:"joao@techvision.com.br",   role:"Admin",        av:"JC" },
                { name:"Marina Oliveira",    email:"marina@techvision.com.br", role:"Visualizador", av:"MO" },
                { name:"Pedro Alves",        email:"pedro@techvision.com.br",  role:"Visualizador", av:"PA" },
              ].map((u,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 0", borderBottom:i<2?`1px solid ${t.b1}`:"none" }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:t.bg4, border:`1px solid ${t.b1}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ color:t.t2, fontSize:11, fontWeight:800 }}>{u.av}</span>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ color:t.t1, fontSize:12, fontWeight:600 }}>{u.name}</div>
                    <div style={{ color:t.t3, fontSize:11 }}>{u.email}</div>
                  </div>
                  <Tag label={u.role} color={u.role==="Admin"?C.amber:C.blue} bg={u.role==="Admin"?C.amberBg:C.blueBg}/>
                  <button style={{ background:"transparent", border:"none", color:t.t4, fontSize:11, cursor:"pointer" }}>Remover</button>
                </div>
              ))}
            </Card>
          )}
          {sec==="notif" && (
            <Card style={{ padding:"28px" }}>
              <div style={{ color:t.t1, fontWeight:700, fontSize:13, marginBottom:22 }}>Notificações</div>
              {["Novas entregas","Relatórios disponíveis","Reuniões agendadas","Faturas","Chamados de suporte"].map((n,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 0", borderBottom:i<4?`1px solid ${t.b1}`:"none" }}>
                  <span style={{ flex:1, color:t.t1, fontSize:12, fontWeight:600 }}>{n}</span>
                  {["Email","Sistema","WhatsApp"].map(ch => (
                    <div key={ch} style={{ display:"flex", alignItems:"center", gap:5 }}>
                      <div style={{ width:32, height:18, borderRadius:9, background:t.bg4, border:`1px solid ${t.b1}`, position:"relative", cursor:"pointer" }}>
                        <div style={{ width:14, height:14, borderRadius:"50%", background:t.accent, position:"absolute", right:2, top:2 }}/>
                      </div>
                      <span style={{ color:t.t4, fontSize:10 }}>{ch}</span>
                    </div>
                  ))}
                </div>
              ))}
            </Card>
          )}
          {sec==="integ" && (
            <Card style={{ padding:"28px" }}>
              <div style={{ color:t.t1, fontWeight:700, fontSize:13, marginBottom:22 }}>Integrações</div>
              {[
                { name:"Google Analytics", icon:"📊", status:"Conectado"    },
                { name:"Meta Business",    icon:"📱", status:"Conectado"    },
                { name:"Google Ads",       icon:"🔍", status:"Conectado"    },
                { name:"RD Station",       icon:"📧", status:"Desconectado" },
                { name:"HubSpot",          icon:"🔗", status:"Desconectado" },
              ].map((ig,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 0", borderBottom:i<4?`1px solid ${t.b1}`:"none" }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:t.bg3, border:`1px solid ${t.b1}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ fontSize:18 }}>{ig.icon}</span>
                  </div>
                  <span style={{ flex:1, color:t.t1, fontSize:12, fontWeight:600 }}>{ig.name}</span>
                  <StatusBadge status={ig.status}/>
                  <Btn variant="ghost" size="sm">{ig.status==="Conectado"?"Gerenciar":"Conectar"}</Btn>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════ */
export default function App() {
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? DARK : LIGHT;
  const [page,      setPage]      = useState("dashboard");
  const [mode,      setMode]      = useState("producao");
  const [collapsed, setCollapsed] = useState(false);
  const [fading,    setFading]    = useState(false);

  const switchMode = (m) => {
    if (m === mode) return;
    setFading(true);
    setTimeout(() => { setMode(m); setFading(false); }, 130);
  };

  const isMain = page === "dashboard";
  const t = theme;

  const pageLabel = {
    dashboard:"Dashboard", relatorios:"Relatórios", materiais:"Materiais",
    reunioes:"Reuniões", financeiro:"Financeiro", academy:"Academy",
    suporte:"Suporte", config:"Configurações",
  }[page] || "Dashboard";

  return (
    <ThemeCtx.Provider value={theme}>
      <div style={{ display:"flex", height:"100vh", background:t.bg0, overflow:"hidden", transition:"background .3s" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          *{box-sizing:border-box;margin:0;padding:0;font-family:'Plus Jakarta Sans',sans-serif;}
          ::-webkit-scrollbar{width:3px;height:3px;}
          ::-webkit-scrollbar-thumb{background:${t.isDark?"rgba(255,255,255,.1)":"rgba(0,0,0,.15)"};border-radius:2px;}
          ::-webkit-scrollbar-track{background:transparent;}
          input,select,textarea{font-family:'Plus Jakarta Sans',sans-serif;}
          input::placeholder,textarea::placeholder{color:${t.t4};}
          @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
          @keyframes fadeOut{to{opacity:0}}
          .enter{animation:fadeIn .22s cubic-bezier(.4,0,.2,1);}
          .leave{animation:fadeOut .13s ease forwards;}
        `}</style>

        {/* ─── SIDEBAR ─── */}
        <aside style={{ width:collapsed?52:200, background:t.bg1, borderRight:`1px solid ${t.b1}`, display:"flex", flexDirection:"column", transition:"width .26s cubic-bezier(.4,0,.2,1)", flexShrink:0, overflow:"hidden" }}>
          <div style={{ padding:collapsed?"20px 10px":"20px 16px", borderBottom:`1px solid ${t.b1}`, flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:30, height:30, flexShrink:0, borderRadius:8, background:t.accent, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:t.accentText, fontWeight:900, fontSize:14 }}>U</span>
              </div>
              {!collapsed && (
                <div>
                  <div style={{ color:t.t1, fontSize:12, fontWeight:800, letterSpacing:2 }}>UNITED</div>
                  <div style={{ color:t.t4, fontSize:7, letterSpacing:3, textTransform:"uppercase" }}>Growth Hub</div>
                </div>
              )}
            </div>
          </div>

          {!collapsed && (
            <div style={{ padding:"10px 12px", borderBottom:`1px solid ${t.b1}` }}>
              <div style={{ background:t.bg3, border:`1px solid ${t.b1}`, borderRadius:9, padding:"9px 12px" }}>
                <div style={{ color:t.t4, fontSize:7, letterSpacing:2.5, textTransform:"uppercase", marginBottom:4 }}>Cliente</div>
                <div style={{ color:t.t1, fontSize:11, fontWeight:700 }}>TechVision LTDA</div>
                <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:5 }}>
                  <div style={{ width:5, height:5, borderRadius:"50%", background:C.green }}/>
                  <span style={{ color:t.t3, fontSize:9 }}>Conta Ativa</span>
                </div>
              </div>
            </div>
          )}

          <nav style={{ flex:1, padding:"10px 6px", overflowY:"auto" }}>
            {NAV.map(item => {
              const active = page === item.id;
              return (
                <div key={item.id} onClick={() => setPage(item.id)}
                  style={{ display:"flex", alignItems:"center", gap:9, padding:collapsed?"9px 11px":"8px 11px", borderRadius:8, marginBottom:1, cursor:"pointer",
                    background: active ? t.bg4 : "transparent",
                    borderLeft: active ? `2px solid ${t.accent}` : "2px solid transparent",
                    transition:"all .13s" }}
                  onMouseEnter={e => { if(!active) e.currentTarget.style.background=t.bg3; }}
                  onMouseLeave={e => { if(!active) e.currentTarget.style.background="transparent"; }}>
                  <span style={{ fontSize:13, color:active?t.t1:t.t3, flexShrink:0 }}>{item.icon}</span>
                  {!collapsed && <>
                    <span style={{ fontSize:11, fontWeight:active?700:500, color:active?t.t1:t.t3, flex:1 }}>{item.label}</span>
                    {item.b && <span style={{ fontSize:9, fontWeight:700, color:C.amber, background:C.amberBg, padding:"1px 6px", borderRadius:10 }}>{item.b}</span>}
                  </>}
                </div>
              );
            })}
          </nav>

          <div style={{ padding:"8px 6px", borderTop:`1px solid ${t.b1}` }}>
            <div onClick={() => setCollapsed(!collapsed)} style={{ display:"flex", alignItems:"center", gap:9, padding:"7px 11px", borderRadius:8, cursor:"pointer", transition:"background .13s" }}
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
          <header style={{ height:56, flexShrink:0, background:t.bg1, borderBottom:`1px solid ${t.b1}`, display:"flex", alignItems:"center", padding:"0 24px", gap:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:5, flexShrink:0 }}>
              <span style={{ color:t.t4, fontSize:11 }}>United</span>
              <span style={{ color:t.t4 }}>·</span>
              <span style={{ color:t.t1, fontSize:11, fontWeight:700 }}>{pageLabel}</span>
            </div>

            {isMain && (
              <div style={{ flex:1, display:"flex", justifyContent:"center" }}>
                <ModeSwitch mode={mode} onChange={switchMode}/>
              </div>
            )}

            <div style={{ display:"flex", alignItems:"center", gap:10, marginLeft:isMain?0:"auto" }}>
              {isMain && (
                <div style={{ padding:"3px 10px", borderRadius:5, background:t.bg3, border:`1px solid ${t.b1}`, color:t.t3, fontSize:9, fontWeight:700, letterSpacing:1.2, textTransform:"uppercase" }}>
                  {mode==="producao"?"● Execução":"● Resultado"}
                </div>
              )}

              {/* ── THEME TOGGLE ── */}
              <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)}/>

              {/* Notification */}
              <div style={{ position:"relative", cursor:"pointer", width:32, height:32, borderRadius:8, background:t.bg3, border:`1px solid ${t.b1}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:t.t2, fontSize:14 }}>◐</span>
                <div style={{ position:"absolute", top:7, right:7, width:6, height:6, borderRadius:"50%", background:C.amber }}/>
              </div>

              {/* Avatar */}
              <div style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", padding:"5px 10px", borderRadius:8, background:t.bg3, border:`1px solid ${t.b1}` }}>
                <div style={{ width:22, height:22, borderRadius:"50%", background:t.bg5, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ color:t.t2, fontSize:8, fontWeight:800 }}>TV</span>
                </div>
                <span style={{ color:t.t2, fontSize:11, fontWeight:600 }}>TechVision</span>
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <main style={{ flex:1, overflowY:"auto", padding:"28px 30px", background:t.bg0, transition:"background .3s" }}>
            <div className={fading?"leave":"enter"} key={page+mode+isDark}>
              {isMain && mode==="producao"    && <ProducaoPage/>}
              {isMain && mode==="performance" && <PerformancePage/>}
              {page==="relatorios" && <RelatoriosPage/>}
              {page==="materiais"  && <MateriaisPage/>}
              {page==="reunioes"   && <ReunioesPage/>}
              {page==="financeiro" && <FinanceiroPage/>}
              {page==="academy"    && <AcademyPage/>}
              {page==="suporte"    && <SuportePage/>}
              {page==="config"     && <ConfigPage/>}
            </div>
          </main>
        </div>
      </div>
    </ThemeCtx.Provider>
  );
}
