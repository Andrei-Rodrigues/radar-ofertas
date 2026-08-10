import React, { useEffect, useMemo, useState } from "react";
import {
  Usb,
  Zap,
  Music2,
  Instagram,
  MessageCircle,
  ArrowRight,
  Laptop,
  Smartphone,
  Home,
  Sofa,
  Dumbbell,
  Trophy,
} from "lucide-react";
import { supabase } from "./lib/supabaseClient";
import { blueprintBg } from "./lib/theme";
import { CATEGORIES } from "./lib/categories";

export const ICONS = {
  Usb,
  Zap,
  Music2,
  Instagram,
  MessageCircle,
  Laptop,
  Smartphone,
  Home,
  Sofa,
  Dumbbell,
  Trophy,
};

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-2.5 px-1 mb-2">
      <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-slate-500">
        {children}
      </span>
      <span className="flex-1 h-px bg-white/10" />
    </div>
  );
}

function trackClick(id) {
  supabase.rpc("increment_link_click", { link_id: id }).then(({ error }) => {
    if (error) console.error(error);
  });
}

function LinkButton({ id, icon, title, sub, href, product }) {
  const Icon = ICONS[icon] ?? Zap;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackClick(id)}
      className="group relative flex items-center gap-3 px-[16px] py-3 rounded-[12px] border border-white/10 bg-[#101b2e] hover:bg-[#152238] hover:border-emerald-400/60 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 focus-visible:outline-offset-2"
    >
      <span
        className={`flex items-center justify-center w-[34px] h-[34px] rounded-[9px] flex-shrink-0 ${
          product ? "bg-emerald-500 text-[#0a1220]" : "bg-emerald-400/15 text-emerald-300"
        }`}
      >
        <Icon size={17} strokeWidth={2} />
      </span>
      <span className="flex-1 text-left">
        <span className="block font-semibold text-[15px] text-slate-100">{title}</span>
        {sub && (
          <span className="block font-mono text-[11px] text-slate-500 mt-0.5">{sub}</span>
        )}
      </span>
      <ArrowRight size={16} className="text-slate-600 group-hover:text-emerald-300 transition-colors" />
    </a>
  );
}

function ProductCard({ id, title, sub, href, image_url }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackClick(id)}
      className="group block rounded-[12px] border border-white/10 bg-[#101b2e] overflow-hidden hover:border-emerald-400/60 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 focus-visible:outline-offset-2"
    >
      <div className="w-full aspect-square bg-[#0a1220]">
        <img src={image_url} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="px-2.5 py-2">
        <span className="block font-semibold text-[12.5px] leading-snug text-slate-100 line-clamp-2">
          {title}
        </span>
        {sub && (
          <span className="block font-mono text-[10px] text-slate-500 mt-0.5 truncate">{sub}</span>
        )}
      </div>
    </a>
  );
}

export default function LinkBioPage() {
  const [products, setProducts] = useState([]);
  const [social, setSocial] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("links")
      .select("*")
      .eq("active", true)
      .order("position", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
        } else {
          setProducts(data.filter((l) => l.section === "produto"));
          setSocial(data.filter((l) => l.section === "social"));
        }
        setLoading(false);
      });
  }, []);

  const productsByCategory = useMemo(() => {
    const groups = {};
    for (const p of products) {
      const cat = p.category || "Outros";
      (groups[cat] ??= []).push(p);
    }
    const order = [...CATEGORIES, "Outros"];
    return Object.entries(groups).sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));
  }, [products]);

  return (
    <div className="min-h-screen w-full flex justify-center px-5 py-6 text-slate-100" style={blueprintBg}>
      <div className="w-full max-w-[420px]">
        {/* HEADER */}
        <div className="relative flex items-center gap-3 rounded-[14px] border border-white/10 bg-[#101b2e] px-4 py-3.5 mb-5">
          <img
            src="/avatar.png"
            alt="@radar.de.ofertas052"
            className="flex-shrink-0 block h-12 w-12 rounded-full border-2 border-emerald-500 object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="font-mono font-bold text-[15px] tracking-tight truncate">
              @radar.de.ofertas052
            </div>
            <p className="text-[12px] text-slate-400 leading-snug line-clamp-2">
              Os links dos achados que valem a pena testar.
            </p>
          </div>
        </div>

        {!loading && (
          <>
            {/* PRODUTOS */}
            {products.length > 0 && (
              <div className="mb-6">
                <SectionLabel>produtos</SectionLabel>
                <div className="flex flex-col gap-4">
                  {productsByCategory.map(([category, items]) => (
                    <div key={category}>
                      {productsByCategory.length > 1 && (
                        <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-emerald-300/60 mb-2 px-1">
                          {category}
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2.5">
                        {items.map((p) => (
                          <div key={p.id} className={p.image_url ? "" : "col-span-2"}>
                            {p.image_url ? <ProductCard {...p} /> : <LinkButton {...p} product />}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SOCIAL */}
            {social.length > 0 && (
              <div className="mb-6">
                <SectionLabel>redes sociais</SectionLabel>
                <div className="flex flex-col gap-2">
                  {social.map((s) => (
                    <LinkButton key={s.id} {...s} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
