import Link from "next/link";
import { ArrowRight, Sparkles, Youtube, MessageCircle, Heart, Brain, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] p-6 max-w-4xl mx-auto text-center space-y-16 py-12">
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 bg-pink-500/5 blur-[120px] rounded-full -z-10" />

      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass border-white/60 text-pink-600 text-xs font-black tracking-widest uppercase shadow-sm">
          <Sparkles className="w-4 h-4" />
          <span>Next-Gen AI Diagnosis</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.9]">
            AIで導く<br />
            <span className="gradient-text">理想の身体。</span>
          </h1>
        </div>

        <p className="text-lg md:text-xl text-slate-500 leading-relaxed font-bold max-w-xl mx-auto">
          科学的なデータとAI分析により、<br />
          あなたの不調の根本原因を特定し、<br />
          最適な改善プログラムを無料で提案します。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
        {[
          { icon: Brain, title: "精密AI分析", desc: "6つの不調タイプ" },
          { icon: Youtube, title: "専用動画", desc: "完全無料プログラム" },
          { icon: Heart, title: "持続可能", desc: "自宅で1分から" },
        ].map((item, i) => (
          <div key={i} className="glass-card rounded-[32px] p-8 text-center space-y-3 border-white/80 group hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mx-auto shadow-sm group-hover:shadow-pink-100 transition-all">
              <item.icon className="w-6 h-6 text-pink-500" />
            </div>
            <h3 className="font-black text-slate-800 text-sm">{item.title}</h3>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="space-y-8 w-full">
        <Link
          href="/diagnosis"
          className="group relative inline-flex items-center gap-4 px-16 py-7 rounded-[32px] btn-primary text-2xl font-black overflow-hidden shadow-2xl"
        >
          <span>今すぐ無料で診断する</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
        </Link>

        <div className="flex flex-col items-center gap-4 opacity-50">
          <div className="flex items-center gap-1 text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">
            <Star className="w-3 h-3 fill-current" />
            <Star className="w-3 h-3 fill-current" />
            <Star className="w-3 h-3 fill-current" />
            <Star className="w-3 h-3 fill-current" />
            <Star className="w-3 h-3 fill-current" />
          </div>
          <p className="text-[11px] font-bold text-slate-400 italic">
            Trusted by over 10,000+ happy users nationwide
          </p>
        </div>
      </div>
    </div>
  );
}
