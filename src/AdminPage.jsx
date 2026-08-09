import React, { useEffect, useMemo, useState } from "react";
import { ICONS } from "./LinkBioPage.jsx";
import { supabase } from "./lib/supabaseClient";
import { blueprintBg } from "./lib/theme";
import Logo from "./components/Logo.jsx";

const ICON_NAMES = Object.keys(ICONS);
const EMPTY_FORM = { section: "produto", icon: "Zap", title: "", sub: "", href: "", position: 0, active: true };
const SECTION_LABELS = { produto: "Produtos", social: "Redes sociais" };

const inputClass =
  "w-full bg-[#0a1220] border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-400/60";
const selectClass = inputClass;

function Brand({ subtitle }) {
  return (
    <div className="flex items-center gap-3">
      <Logo size={40} />
      <div>
        <div className="font-mono font-bold text-base tracking-tight text-slate-100">
          Andrei <span className="text-emerald-400">&amp;</span> Gabi
        </div>
        <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-slate-500">{subtitle}</div>
      </div>
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-sm rounded-[14px] border border-white/10 bg-[#101b2e] px-6 pt-8 pb-7 relative">
        <div className="pointer-events-none absolute inset-[10px] rounded-lg border border-dashed border-emerald-300/20" />
        <div className="flex justify-center mb-5">
          <Brand subtitle="gestão de links" />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass + " py-2.5"}
          />
          <input
            type="password"
            required
            placeholder="senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass + " py-2.5"}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2.5 rounded-lg bg-emerald-500 text-[#0a1220] font-semibold hover:bg-emerald-400 transition-colors disabled:opacity-60"
          >
            {loading ? "entrando..." : "Entrar"}
          </button>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </form>
        <p className="mt-5 text-center font-mono text-[10px] text-slate-600">acesso restrito</p>
      </div>
    </div>
  );
}

function StatTile({ label, value }) {
  return (
    <div className="flex-1 min-w-[100px] rounded-[10px] border border-white/10 bg-[#101b2e] px-4 py-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">{label}</div>
      <div className="font-mono text-xl font-bold text-emerald-300 mt-1">{value}</div>
    </div>
  );
}

function FieldLabel({ children }) {
  return <label className="block font-mono text-[10px] uppercase tracking-[0.1em] text-slate-500 mb-1">{children}</label>;
}

function LinkForm({ form, setForm }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Seção</FieldLabel>
          <select className={selectClass} value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })}>
            <option value="produto">produto</option>
            <option value="social">social</option>
          </select>
        </div>
        <div>
          <FieldLabel>Ícone</FieldLabel>
          <select className={selectClass} value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
            {ICON_NAMES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <FieldLabel>Título</FieldLabel>
        <input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </div>
      <div>
        <FieldLabel>Subtítulo (opcional)</FieldLabel>
        <input className={inputClass} value={form.sub ?? ""} onChange={(e) => setForm({ ...form, sub: e.target.value })} />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <FieldLabel>Link</FieldLabel>
          <a
            href="https://www.mercadolivre.com.br/l/afiliados-gerar-link"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] text-emerald-300/80 hover:text-emerald-300 -mt-1"
          >
            gerar link de afiliado ↗
          </a>
        </div>
        <input
          className={inputClass}
          placeholder="https://..."
          value={form.href}
          onChange={(e) => setForm({ ...form, href: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3 items-center">
        <div>
          <FieldLabel>Posição</FieldLabel>
          <input
            type="number"
            className={inputClass}
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
          />
        </div>
        <label className="flex items-center gap-2 font-mono text-xs text-slate-300 pt-5">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          ativo
        </label>
      </div>
    </div>
  );
}

const MESSAGE_TEMPLATES = [
  {
    label: "🔥 Oferta",
    build: (link) => {
      const lines = [`🔥 *${link.title}*`];
      if (link.sub) lines.push(link.sub);
      lines.push("", `👉 ${link.href}`);
      return lines.join("\n");
    },
  },
  {
    label: "⚡ Achado do dia",
    build: (link) => {
      const lines = [`⚡ Achado do dia: *${link.title}*`];
      if (link.sub) lines.push(link.sub);
      lines.push("", `👉 confere: ${link.href}`);
      return lines.join("\n");
    },
  },
  {
    label: "💰 Preço baixou",
    build: (link) => {
      const lines = [`💰 Baixou de preço! *${link.title}*`];
      if (link.sub) lines.push(link.sub);
      lines.push("", `👉 ${link.href}`);
      return lines.join("\n");
    },
  },
];

function ShareModal({ link, onClose }) {
  const [templateIndex, setTemplateIndex] = useState(0);
  const message = MESSAGE_TEMPLATES[templateIndex].build(link);

  function openWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 z-50 overflow-y-auto py-10"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-[14px] border border-emerald-400/40 bg-[#101b2e] p-6 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-slate-100">Compartilhar promoção</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-lg leading-none">
            ✕
          </button>
        </div>

        <FieldLabel>Modelo de mensagem</FieldLabel>
        <div className="flex gap-2 flex-wrap mb-4">
          {MESSAGE_TEMPLATES.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setTemplateIndex(i)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-colors ${
                i === templateIndex
                  ? "bg-emerald-500 text-[#0a1220] border-emerald-500 font-semibold"
                  : "border-white/10 text-slate-300 hover:bg-white/5"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <FieldLabel>Prévia</FieldLabel>
        <pre className="whitespace-pre-wrap font-mono text-sm text-slate-200 bg-[#0a1220] border border-white/10 rounded-lg px-3 py-2.5 mb-4">
          {message}
        </pre>

        <button
          onClick={openWhatsApp}
          className="w-full px-4 py-2.5 rounded-lg bg-emerald-500 text-[#0a1220] font-semibold hover:bg-emerald-400 transition-colors"
        >
          Abrir no WhatsApp
        </button>
      </div>
    </div>
  );
}

function LinkCard({ link, onChange, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [form, setForm] = useState(link);
  const [saving, setSaving] = useState(false);
  const Icon = ICONS[link.icon] ?? ICONS.Zap;

  function startEdit() {
    setForm(link);
    setEditing(true);
  }

  async function save() {
    setSaving(true);
    const { error } = await supabase
      .from("links")
      .update({
        section: form.section,
        icon: form.icon,
        title: form.title,
        sub: form.sub,
        href: form.href,
        position: Number(form.position),
        active: form.active,
      })
      .eq("id", link.id);
    setSaving(false);
    if (error) alert(error.message);
    else {
      setEditing(false);
      onChange();
    }
  }

  async function remove() {
    if (!confirm(`Excluir "${link.title}"?`)) return;
    const { error } = await supabase.from("links").delete().eq("id", link.id);
    if (error) alert(error.message);
    else onDelete();
  }

  if (editing) {
    return (
      <div className="rounded-[12px] border border-emerald-400/40 bg-[#101b2e] p-4">
        <LinkForm form={form} setForm={setForm} />
        <div className="flex gap-2 justify-end mt-4">
          <button
            onClick={() => setEditing(false)}
            className="px-3 py-1.5 rounded-lg border border-white/10 text-slate-300 text-xs hover:bg-white/5"
          >
            cancelar
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="px-3 py-1.5 rounded-lg bg-emerald-500 text-[#0a1220] text-xs font-semibold hover:bg-emerald-400 disabled:opacity-60"
          >
            {saving ? "salvando..." : "salvar"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[12px] border border-white/10 bg-[#101b2e] p-4 flex items-center gap-3">
      <span className="flex items-center justify-center w-10 h-10 rounded-[9px] bg-emerald-400/15 text-emerald-300 flex-shrink-0">
        <Icon size={18} strokeWidth={2} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-slate-100 truncate">{link.title}</span>
          <span className="font-mono text-[10px] text-emerald-300/70 border border-emerald-400/20 rounded-full px-2 py-0.5 flex-shrink-0">
            {link.clicks ?? 0} {link.clicks === 1 ? "clique" : "cliques"}
          </span>
          {!link.active && (
            <span className="font-mono text-[10px] text-slate-500 border border-white/10 rounded-full px-2 py-0.5 flex-shrink-0">
              inativo
            </span>
          )}
        </div>
        {link.sub && <div className="font-mono text-xs text-slate-500 truncate mt-0.5">{link.sub}</div>}
        <div className="font-mono text-xs text-emerald-300/70 truncate mt-0.5">{link.href}</div>
      </div>
      <div className="flex flex-col gap-1.5 flex-shrink-0">
        {link.section === "produto" && (
          <button
            onClick={() => setSharing(true)}
            className="px-2.5 py-1 rounded-lg border border-emerald-400/40 text-emerald-300 text-xs hover:bg-emerald-400/10"
          >
            compartilhar
          </button>
        )}
        <button
          onClick={startEdit}
          className="px-2.5 py-1 rounded-lg border border-white/10 text-slate-300 text-xs hover:bg-white/5"
        >
          editar
        </button>
        <button
          onClick={remove}
          className="px-2.5 py-1 rounded-lg border border-red-400/40 text-red-300 text-xs hover:bg-red-400/10"
        >
          excluir
        </button>
      </div>
      {sharing && <ShareModal link={link} onClose={() => setSharing(false)} />}
    </div>
  );
}

function AddLinkModal({ onClose, onCreated }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  async function create() {
    if (!form.title || !form.href) return;
    setSaving(true);
    const { error } = await supabase.from("links").insert({ ...form, position: Number(form.position) });
    setSaving(false);
    if (error) alert(error.message);
    else onCreated();
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 z-50 overflow-y-auto py-10"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-[14px] border border-emerald-400/40 bg-[#101b2e] p-6 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-slate-100">Novo link</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-lg leading-none">
            ✕
          </button>
        </div>
        <LinkForm form={form} setForm={setForm} />
        <button
          onClick={create}
          disabled={saving || !form.title || !form.href}
          className="w-full mt-4 px-4 py-2.5 rounded-lg bg-emerald-500 text-[#0a1220] font-semibold hover:bg-emerald-400 disabled:opacity-50 transition-colors"
        >
          {saving ? "criando..." : "+ Adicionar link"}
        </button>
      </div>
    </div>
  );
}

function Dashboard({ session }) {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  async function reload() {
    setLoading(true);
    const { data, error } = await supabase
      .from("links")
      .select("*")
      .order("section", { ascending: true })
      .order("position", { ascending: true });
    if (error) alert(error.message);
    else setLinks(data);
    setLoading(false);
  }

  useEffect(() => {
    reload();
  }, []);

  const stats = useMemo(
    () => ({
      total: links.length,
      ativos: links.filter((l) => l.active).length,
      cliques: links.reduce((sum, l) => sum + (l.clicks ?? 0), 0),
    }),
    [links]
  );

  const sections = useMemo(() => {
    const groups = {};
    for (const link of links) {
      (groups[link.section] ??= []).push(link);
    }
    return groups;
  }, [links]);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
        <Brand subtitle="gestão de links de afiliados" />
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-slate-500 hidden sm:inline">{session.user.email}</span>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-xs text-slate-400 hover:text-slate-200 border border-white/10 rounded-full px-3 py-1 transition-colors"
          >
            sair
          </button>
        </div>
      </div>

      <div className="flex gap-2.5 flex-wrap mb-6">
        <StatTile label="total" value={stats.total} />
        <StatTile label="ativos" value={stats.ativos} />
        <StatTile label="cliques" value={stats.cliques} />
      </div>

      <button
        onClick={() => setShowAdd(true)}
        className="w-full mb-7 px-4 py-3 rounded-[12px] border border-dashed border-emerald-400/40 text-emerald-300 font-semibold text-sm hover:bg-emerald-400/5 transition-colors"
      >
        + Novo link
      </button>

      {loading ? (
        <p className="text-slate-400 text-sm font-mono">carregando...</p>
      ) : (
        Object.entries(sections).map(([section, sectionLinks]) => (
          <div key={section} className="mb-7">
            <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-slate-500 mb-3 px-1">
              {SECTION_LABELS[section] ?? section}
            </div>
            <div className="flex flex-col gap-2.5">
              {sectionLinks.map((link) => (
                <LinkCard key={link.id} link={link} onChange={reload} onDelete={reload} />
              ))}
            </div>
          </div>
        ))
      )}

      {showAdd && (
        <AddLinkModal
          onClose={() => setShowAdd(false)}
          onCreated={() => {
            setShowAdd(false);
            reload();
          }}
        />
      )}
    </div>
  );
}

export default function AdminPage() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen w-full text-slate-100" style={blueprintBg}>
      {session === undefined ? null : session ? <Dashboard session={session} /> : <LoginForm />}
    </div>
  );
}
