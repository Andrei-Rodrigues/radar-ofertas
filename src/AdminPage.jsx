import React, { useEffect, useMemo, useState } from "react";
import { ICONS } from "./LinkBioPage.jsx";
import { supabase } from "./lib/supabaseClient";
import { blueprintBg } from "./lib/theme";
import Logo from "./components/Logo.jsx";

const ICON_NAMES = Object.keys(ICONS);
const EMPTY_FORM = { section: "produto", icon: "Zap", title: "", sub: "", href: "", position: 0, active: true };

const inputClass =
  "w-full bg-[#0a1220] border border-white/10 rounded px-2 py-1.5 text-sm text-slate-100 outline-none focus:border-emerald-400/60";
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

function EditableRow({ link, onChange, onDelete }) {
  const [form, setForm] = useState(link);
  const [saving, setSaving] = useState(false);
  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(link), [form, link]);

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
    else onChange();
  }

  async function remove() {
    if (!confirm(`Excluir "${form.title}"?`)) return;
    const { error } = await supabase.from("links").delete().eq("id", link.id);
    if (error) alert(error.message);
    else onDelete();
  }

  return (
    <tr className="border-t border-white/5 align-top">
      <td className="py-2 px-2 first:pl-4 last:pr-4">
        <select className={selectClass} value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })}>
          <option value="produto">produto</option>
          <option value="social">social</option>
        </select>
      </td>
      <td className="py-2 px-2 first:pl-4 last:pr-4">
        <select className={selectClass} value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
          {ICON_NAMES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </td>
      <td className="py-2 px-2 first:pl-4 last:pr-4">
        <input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </td>
      <td className="py-2 px-2 first:pl-4 last:pr-4">
        <input className={inputClass} value={form.sub ?? ""} onChange={(e) => setForm({ ...form, sub: e.target.value })} />
      </td>
      <td className="py-2 px-2 first:pl-4 last:pr-4 min-w-[180px]">
        <input className={inputClass} value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} />
      </td>
      <td className="py-2 px-2 first:pl-4 last:pr-4 w-16">
        <input
          type="number"
          className={inputClass}
          value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
        />
      </td>
      <td className="py-2 px-2 first:pl-4 last:pr-4 text-center">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) => setForm({ ...form, active: e.target.checked })}
        />
      </td>
      <td className="py-2 px-2 first:pl-4 last:pr-4 whitespace-nowrap">
        <div className="flex gap-1.5 justify-end">
          <button
            onClick={save}
            disabled={saving || !dirty}
            className="px-2.5 py-1 rounded bg-emerald-500 text-[#0a1220] text-xs font-semibold hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? "..." : "salvar"}
          </button>
          <button
            onClick={remove}
            className="px-2.5 py-1 rounded border border-red-400/40 text-red-300 text-xs hover:bg-red-400/10"
          >
            excluir
          </button>
        </div>
      </td>
    </tr>
  );
}

function NewLinkRow({ onCreated }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  async function create() {
    if (!form.title || !form.href) return;
    setSaving(true);
    const { error } = await supabase.from("links").insert({ ...form, position: Number(form.position) });
    setSaving(false);
    if (error) alert(error.message);
    else {
      setForm(EMPTY_FORM);
      onCreated();
    }
  }

  return (
    <tr className="border-t border-dashed border-emerald-400/30">
      <td className="py-2 px-2 first:pl-4 last:pr-4">
        <select className={selectClass} value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })}>
          <option value="produto">produto</option>
          <option value="social">social</option>
        </select>
      </td>
      <td className="py-2 px-2 first:pl-4 last:pr-4">
        <select className={selectClass} value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
          {ICON_NAMES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </td>
      <td className="py-2 px-2 first:pl-4 last:pr-4">
        <input
          className={inputClass}
          placeholder="título"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </td>
      <td className="py-2 px-2 first:pl-4 last:pr-4">
        <input
          className={inputClass}
          placeholder="subtítulo"
          value={form.sub}
          onChange={(e) => setForm({ ...form, sub: e.target.value })}
        />
      </td>
      <td className="py-2 px-2 first:pl-4 last:pr-4 min-w-[180px]">
        <input
          className={inputClass}
          placeholder="https://..."
          value={form.href}
          onChange={(e) => setForm({ ...form, href: e.target.value })}
        />
      </td>
      <td className="py-2 px-2 first:pl-4 last:pr-4 w-16">
        <input
          type="number"
          className={inputClass}
          value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
        />
      </td>
      <td className="py-2 px-2 first:pl-4 last:pr-4 text-center text-slate-600">—</td>
      <td className="py-2 px-2 first:pl-4 last:pr-4 whitespace-nowrap text-right">
        <button
          onClick={create}
          disabled={saving}
          className="px-2.5 py-1 rounded bg-emerald-500 text-[#0a1220] text-xs font-semibold hover:bg-emerald-400 disabled:opacity-60"
        >
          {saving ? "..." : "+ adicionar"}
        </button>
      </td>
    </tr>
  );
}

const COLUMNS = ["Seção", "Ícone", "Título", "Subtítulo", "Link", "Posição", "Ativo", ""];

function Dashboard({ session }) {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

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
      produtos: links.filter((l) => l.section === "produto").length,
      social: links.filter((l) => l.section === "social").length,
    }),
    [links]
  );

  return (
    <div className="max-w-5xl mx-auto py-10 px-5">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
        <Brand subtitle="gestão de links de afiliados" />
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-slate-500">{session.user.email}</span>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-xs text-slate-400 hover:text-slate-200 border border-white/10 rounded-full px-3 py-1 transition-colors"
          >
            sair
          </button>
        </div>
      </div>

      <div className="flex gap-2.5 flex-wrap mb-7">
        <StatTile label="total de links" value={stats.total} />
        <StatTile label="ativos" value={stats.ativos} />
        <StatTile label="produtos" value={stats.produtos} />
        <StatTile label="social" value={stats.social} />
      </div>

      {loading ? (
        <p className="text-slate-400 text-sm font-mono">carregando...</p>
      ) : (
        <div className="rounded-[14px] border border-white/10 bg-[#101b2e] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  {COLUMNS.map((col) => (
                    <th
                      key={col}
                      className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-slate-500 px-2 pt-4 pb-2 first:pl-4 last:pr-4"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {links.map((link) => (
                  <EditableRow key={link.id} link={link} onChange={reload} onDelete={reload} />
                ))}
                <NewLinkRow onCreated={reload} />
              </tbody>
            </table>
          </div>
        </div>
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
