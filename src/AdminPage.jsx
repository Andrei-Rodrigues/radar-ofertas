import React, { useEffect, useMemo, useState } from "react";
import { ICONS } from "./LinkBioPage.jsx";
import { supabase } from "./lib/supabaseClient";
import { blueprintBg } from "./lib/theme";
import { CATEGORIES } from "./lib/categories";
import Logo from "./components/Logo.jsx";

const ICON_NAMES = Object.keys(ICONS);
const EMPTY_FORM = {
  section: "produto",
  icon: "Zap",
  title: "",
  sub: "",
  href: "",
  position: 0,
  active: true,
  image_url: null,
  category: CATEGORIES[0],
  original_price: "",
  sale_price: "",
  coupon_code: "",
  store_name: "",
};
const SECTION_LABELS = { produto: "Produtos", social: "Redes sociais" };

function toNullableNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function toNullableText(value) {
  return value === "" || value === undefined ? null : value;
}

function formatPrice(value) {
  if (value === null || value === undefined || value === "") return "";
  return `R$ ${Number(value).toFixed(2).replace(".", ",")}`;
}

async function uploadProductImage(file) {
  const ext = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}

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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const url = await uploadProductImage(file);
      setForm({ ...form, image_url: url });
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <FieldLabel>Foto do produto (opcional)</FieldLabel>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-lg border border-white/10 bg-[#0a1220] flex items-center justify-center overflow-hidden flex-shrink-0">
            {form.image_url ? (
              <img src={form.image_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="font-mono text-[9px] text-slate-600">sem foto</span>
            )}
          </div>
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={uploading}
              className="w-full text-xs text-slate-300 font-mono file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-emerald-500 file:text-[#0a1220] file:text-xs file:font-semibold file:cursor-pointer"
            />
            {uploading && <p className="font-mono text-[10px] text-slate-500 mt-1">enviando...</p>}
            {uploadError && <p className="font-mono text-[10px] text-red-400 mt-1">{uploadError}</p>}
            {form.image_url && (
              <button
                type="button"
                onClick={() => setForm({ ...form, image_url: null })}
                className="font-mono text-[10px] text-slate-500 hover:text-red-300 mt-1"
              >
                remover foto
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Seção</FieldLabel>
          <select
            className={selectClass}
            value={form.section}
            onChange={(e) =>
              setForm({
                ...form,
                section: e.target.value,
                category: e.target.value === "produto" ? form.category ?? CATEGORIES[0] : null,
              })
            }
          >
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
      {form.section === "produto" && (
        <div>
          <FieldLabel>Categoria</FieldLabel>
          <select
            className={selectClass}
            value={form.category ?? CATEGORIES[0]}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      )}
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
      {form.section === "produto" && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Preço original (opcional)</FieldLabel>
              <input
                type="number"
                step="0.01"
                className={inputClass}
                placeholder="59.90"
                value={form.original_price ?? ""}
                onChange={(e) => setForm({ ...form, original_price: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>Preço promocional (opcional)</FieldLabel>
              <input
                type="number"
                step="0.01"
                className={inputClass}
                placeholder="33.00"
                value={form.sale_price ?? ""}
                onChange={(e) => setForm({ ...form, sale_price: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Cupom (opcional)</FieldLabel>
              <input
                className={inputClass}
                placeholder="COMPRINHASPRACASA"
                value={form.coupon_code ?? ""}
                onChange={(e) => setForm({ ...form, coupon_code: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>Loja (opcional)</FieldLabel>
              <input
                className={inputClass}
                placeholder="Growth Supplements"
                value={form.store_name ?? ""}
                onChange={(e) => setForm({ ...form, store_name: e.target.value })}
              />
            </div>
          </div>
        </>
      )}
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

const TOKEN_HELP = [
  ["{titulo}", "Título do produto"],
  ["{subtitulo}", "Subtítulo/descrição"],
  ["{preco_de}", "Preço original (formatado)"],
  ["{preco_por}", "Preço promocional (formatado)"],
  ["{cupom}", "Código do cupom"],
  ["{loja}", "Nome da loja"],
  ["{link}", "Link do produto"],
];

function fillTemplate(body, link) {
  const values = {
    titulo: link.title ?? "",
    subtitulo: link.sub ?? "",
    preco_de: formatPrice(link.original_price),
    preco_por: formatPrice(link.sale_price),
    cupom: link.coupon_code ?? "",
    loja: link.store_name ?? "",
    link: link.href ?? "",
  };
  return body.replace(/\{(\w+)\}/g, (match, key) => (key in values ? values[key] : match));
}

function stripEmoji(text) {
  return text
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}\u{FE0F}]/gu, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/ {2,}/g, " ")
    .trim();
}

function ShareModal({ link, onClose }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [templateId, setTemplateId] = useState(null);
  const [useEmoji, setUseEmoji] = useState(true);
  const [editedMessage, setEditedMessage] = useState("");

  useEffect(() => {
    supabase
      .from("message_templates")
      .select("*")
      .order("position", { ascending: true })
      .then(({ data, error }) => {
        if (error) alert(error.message);
        else {
          setTemplates(data);
          if (data.length > 0) setTemplateId(data[0].id);
        }
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const t = templates.find((tpl) => tpl.id === templateId);
    if (!t) return;
    const filled = fillTemplate(t.body, link);
    setEditedMessage(useEmoji ? filled : stripEmoji(filled));
  }, [templateId, useEmoji, templates, link]);

  function openWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(editedMessage)}`, "_blank", "noopener,noreferrer");
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

        {loading ? (
          <p className="text-slate-400 text-sm font-mono">carregando templates...</p>
        ) : templates.length === 0 ? (
          <p className="text-slate-400 text-sm font-mono">
            Nenhum template cadastrado ainda. Feche essa tela e clique em "Templates" pra criar um.
          </p>
        ) : (
          <>
            <FieldLabel>Modelo de mensagem</FieldLabel>
            <div className="flex gap-2 flex-wrap mb-4">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplateId(t.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-colors ${
                    t.id === templateId
                      ? "bg-emerald-500 text-[#0a1220] border-emerald-500 font-semibold"
                      : "border-white/10 text-slate-300 hover:bg-white/5"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 font-mono text-xs text-slate-300 mb-4">
              <input type="checkbox" checked={useEmoji} onChange={(e) => setUseEmoji(e.target.checked)} />
              incluir emojis (desmarque se o WhatsApp Web no PC bagunçar o texto)
            </label>

            <FieldLabel>Mensagem (edite à vontade — só vale pra esse envio)</FieldLabel>
            <textarea
              className="w-full min-h-[150px] resize-y whitespace-pre-wrap font-mono text-sm text-slate-200 bg-[#0a1220] border border-white/10 rounded-lg px-3 py-2.5 mb-4 outline-none focus:border-emerald-400/60"
              value={editedMessage}
              onChange={(e) => setEditedMessage(e.target.value)}
            />

            <button
              onClick={openWhatsApp}
              className="w-full px-4 py-2.5 rounded-lg bg-emerald-500 text-[#0a1220] font-semibold hover:bg-emerald-400 transition-colors"
            >
              Abrir no WhatsApp
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function TemplateEditor({ template, onSave, onCancel }) {
  const [name, setName] = useState(template?.name ?? "");
  const [body, setBody] = useState(template?.body ?? "");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!name || !body) return;
    setSaving(true);
    const { error } = template
      ? await supabase.from("message_templates").update({ name, body }).eq("id", template.id)
      : await supabase.from("message_templates").insert({ name, body, position: 99 });
    setSaving(false);
    if (error) alert(error.message);
    else onSave();
  }

  return (
    <div className="rounded-[12px] border border-emerald-400/40 bg-[#101b2e] p-4">
      <FieldLabel>Nome do template</FieldLabel>
      <input
        className={inputClass}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ex: Oferta com cupom"
      />
      <div className="mt-3">
        <FieldLabel>Texto (use os tokens abaixo)</FieldLabel>
        <textarea
          className={inputClass + " min-h-[120px] resize-y"}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={"🔥 *{titulo}*\n\nDe {preco_de}\nPor {preco_por}\n\n👉 {link}"}
        />
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {TOKEN_HELP.map(([token]) => (
          <button
            key={token}
            type="button"
            onClick={() => setBody((b) => b + token)}
            className="font-mono text-[10px] text-emerald-300 border border-emerald-400/30 rounded-full px-2 py-0.5 hover:bg-emerald-400/10"
          >
            {token}
          </button>
        ))}
      </div>
      <div className="flex gap-2 justify-end mt-4">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg border border-white/10 text-slate-300 text-xs hover:bg-white/5"
        >
          cancelar
        </button>
        <button
          onClick={save}
          disabled={saving || !name || !body}
          className="px-3 py-1.5 rounded-lg bg-emerald-500 text-[#0a1220] text-xs font-semibold hover:bg-emerald-400 disabled:opacity-60"
        >
          {saving ? "salvando..." : "salvar"}
        </button>
      </div>
    </div>
  );
}

function TemplatesModal({ onClose }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  async function reload() {
    setLoading(true);
    const { data, error } = await supabase
      .from("message_templates")
      .select("*")
      .order("position", { ascending: true });
    if (error) alert(error.message);
    else setTemplates(data);
    setLoading(false);
  }

  useEffect(() => {
    reload();
  }, []);

  async function remove(t) {
    if (!confirm(`Excluir template "${t.name}"?`)) return;
    const { error } = await supabase.from("message_templates").delete().eq("id", t.id);
    if (error) alert(error.message);
    else reload();
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
          <h2 className="font-bold text-slate-100">Templates de mensagem</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-lg leading-none">
            ✕
          </button>
        </div>

        <div className="mb-4 rounded-lg border border-white/10 bg-[#0a1220] px-3 py-2.5">
          <FieldLabel>Tokens disponíveis</FieldLabel>
          <div className="flex flex-col gap-1 mt-1">
            {TOKEN_HELP.map(([token, desc]) => (
              <div key={token} className="font-mono text-[11px] text-slate-400">
                <span className="text-emerald-300">{token}</span> — {desc}
              </div>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-slate-400 text-sm font-mono">carregando...</p>
        ) : (
          <div className="flex flex-col gap-2.5 mb-4">
            {templates.map((t) =>
              editing?.id === t.id ? (
                <TemplateEditor
                  key={t.id}
                  template={t}
                  onSave={() => {
                    setEditing(null);
                    reload();
                  }}
                  onCancel={() => setEditing(null)}
                />
              ) : (
                <div key={t.id} className="rounded-[12px] border border-white/10 bg-[#0a1220] p-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-semibold text-sm text-slate-100">{t.name}</span>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => setEditing(t)}
                        className="px-2 py-0.5 rounded border border-white/10 text-slate-300 text-[10px] hover:bg-white/5"
                      >
                        editar
                      </button>
                      <button
                        onClick={() => remove(t)}
                        className="px-2 py-0.5 rounded border border-red-400/40 text-red-300 text-[10px] hover:bg-red-400/10"
                      >
                        excluir
                      </button>
                    </div>
                  </div>
                  <pre className="whitespace-pre-wrap font-mono text-[11px] text-slate-500 mt-1.5">{t.body}</pre>
                </div>
              )
            )}
          </div>
        )}

        {editing === "new" ? (
          <TemplateEditor
            onSave={() => {
              setEditing(null);
              reload();
            }}
            onCancel={() => setEditing(null)}
          />
        ) : (
          <button
            onClick={() => setEditing("new")}
            className="w-full px-4 py-2.5 rounded-lg border border-dashed border-emerald-400/40 text-emerald-300 font-semibold text-sm hover:bg-emerald-400/5 transition-colors"
          >
            + Novo template
          </button>
        )}
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
        image_url: form.image_url,
        category: form.section === "produto" ? form.category ?? CATEGORIES[0] : null,
        original_price: toNullableNumber(form.original_price),
        sale_price: toNullableNumber(form.sale_price),
        coupon_code: toNullableText(form.coupon_code),
        store_name: toNullableText(form.store_name),
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
      <span
        className={`flex items-center justify-center rounded-[10px] bg-emerald-400/15 text-emerald-300 flex-shrink-0 overflow-hidden ${
          link.image_url ? "w-20 h-20" : "w-10 h-10"
        }`}
      >
        {link.image_url ? (
          <img src={link.image_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <Icon size={18} strokeWidth={2} />
        )}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-slate-100 truncate">{link.title}</span>
          {link.category && (
            <span className="font-mono text-[10px] text-slate-400 border border-white/10 rounded-full px-2 py-0.5 flex-shrink-0">
              {link.category}
            </span>
          )}
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
        {(link.original_price || link.sale_price) && (
          <div className="font-mono text-xs mt-0.5">
            {link.original_price && (
              <span className="text-slate-500 line-through mr-1.5">{formatPrice(link.original_price)}</span>
            )}
            {link.sale_price && <span className="text-emerald-300 font-semibold">{formatPrice(link.sale_price)}</span>}
            {link.coupon_code && <span className="text-slate-500 ml-1.5">· cupom {link.coupon_code}</span>}
          </div>
        )}
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
    const { error } = await supabase.from("links").insert({
      ...form,
      position: Number(form.position),
      original_price: toNullableNumber(form.original_price),
      sale_price: toNullableNumber(form.sale_price),
      coupon_code: toNullableText(form.coupon_code),
      store_name: toNullableText(form.store_name),
    });
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
  const [showTemplates, setShowTemplates] = useState(false);

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

      <div className="flex gap-2.5 mb-7">
        <button
          onClick={() => setShowAdd(true)}
          className="flex-1 px-4 py-3 rounded-[12px] border border-dashed border-emerald-400/40 text-emerald-300 font-semibold text-sm hover:bg-emerald-400/5 transition-colors"
        >
          + Novo link
        </button>
        <button
          onClick={() => setShowTemplates(true)}
          className="px-4 py-3 rounded-[12px] border border-white/10 text-slate-300 font-semibold text-sm hover:bg-white/5 transition-colors"
        >
          Templates
        </button>
      </div>

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

      {showTemplates && <TemplatesModal onClose={() => setShowTemplates(false)} />}
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
