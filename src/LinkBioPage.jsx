import React, { useEffect, useState } from "react";
import { Usb, Zap, Music2, Instagram, MessageCircle, ArrowRight } from "lucide-react";
import { supabase } from "./lib/supabaseClient";
import { blueprintBg } from "./lib/theme";

export const ICONS = { Usb, Zap, Music2, Instagram, MessageCircle };

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-2.5 px-1 mb-3">
      <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-slate-500">
        {children}
      </span>
      <span className="flex-1 h-px bg-white/10" />
    </div>
  );
}

function LinkButton({ icon, title, sub, href, product }) {
  const Icon = ICONS[icon] ?? Zap;
  return (
    <a
      href={href}
      className="group relative flex items-center gap-3 px-[18px] py-4 rounded-[14px] border border-white/10 bg-[#101b2e] hover:bg-[#152238] hover:border-emerald-400/60 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 focus-visible:outline-offset-2"
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

  return (
    <div className="min-h-screen w-full flex justify-center px-5 py-12 text-slate-100" style={blueprintBg}>
      <div className="w-full max-w-[420px]">
        {/* HEADER */}
        <div className="relative text-center rounded-[14px] border border-white/10 bg-[#101b2e] px-5 pt-7 pb-6 mb-9">
          <div className="pointer-events-none absolute inset-[10px] rounded-lg border border-dashed border-emerald-300/20" />

          <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-emerald-300 mb-3.5">
            achados de tecnologia
          </div>

          <img
            src="/avatar.png"
            alt="@radar.de.ofertas052"
            className="mx-auto mb-4 block h-[84px] w-[84px] rounded-full border-2 border-emerald-500 object-cover"
          />

          <div className="font-mono font-bold text-xl tracking-tight">@radar.de.ofertas052</div>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Produtos que eu testo de verdade,
            <br />
            antes de indicar pra vocês.
          </p>

          <div className="flex justify-center gap-2.5 mt-4 flex-wrap">
            <span className="font-mono text-[10.5px] text-slate-400 border border-white/10 rounded-full px-2.5 py-1">
              REVIEWS REAIS
            </span>
            <span className="font-mono text-[10.5px] text-slate-400 border border-white/10 rounded-full px-2.5 py-1">
              LINKS ABAIXO ↓
            </span>
          </div>
        </div>

        {!loading && (
          <>
            {/* PRODUTOS */}
            {products.length > 0 && (
              <div className="mb-8">
                <SectionLabel>produtos</SectionLabel>
                <div className="flex flex-col gap-2.5">
                  {products.map((p) => (
                    <LinkButton key={p.id} {...p} product />
                  ))}
                </div>
              </div>
            )}

            {/* SOCIAL */}
            {social.length > 0 && (
              <div className="mb-8">
                <SectionLabel>social</SectionLabel>
                <div className="flex flex-col gap-2.5">
                  {social.map((s) => (
                    <LinkButton key={s.id} {...s} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div className="text-center">
          <p className="font-mono text-[10.5px] text-slate-500 leading-relaxed">
            alguns links acima são links de afiliado — comissão sobre a venda, sem custo extra
            pra você
          </p>
        </div>
      </div>
    </div>
  );
}
