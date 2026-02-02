import Link from "next/link";
import { ArrowRight, Sparkles, Youtube, MessageCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-height-screen p-6 max-w-2xl mx-auto text-center space-y-12 py-20">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/50 text-pink-600 text-sm font-medium border border-pink-200">
          <Sparkles className="w-4 h-4" />
          <span>AIが導き出す、あなたの理想の身体</span>
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight">
          AI<span className="gradient-text">不調タイプ診断</span>
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed font-medium">
          たった1分の質問で、あなたの不調を徹底分析。<br />
          あなた専用のピラティスレッスンをお届けします。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="glass-card rounded-3xl p-6 text-left space-y-2 border-pink-100">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500 mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg">AIによる精密診断</h3>
          <p className="text-slate-500 text-sm">6つのタイプから分析し、不調の原因と解決策を特定します。</p>
        </div>
        <div className="glass-card rounded-3xl p-6 text-left space-y-2 border-indigo-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-2">
            <Youtube className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg">専用動画レッスン</h3>
          <p className="text-slate-500 text-sm">診断結果に合わせて、今すぐ自宅でできるピラティス動画を無料プレゼント。</p>
        </div>
      </div>

      <Link
        href="/diagnosis"
        className="group relative inline-flex items-center gap-3 px-12 py-6 rounded-full btn-primary text-xl font-bold overflow-hidden"
      >
        <span>今すぐ診断を始める</span>
        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
      </Link>

      <div className="text-slate-400 text-sm flex items-center justify-center gap-4">
        <div className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4" />
          <span>LINE公式アカウント提携</span>
        </div>
        <span>•</span>
        <span>診断料 0円 (無料)</span>
      </div>
    </div>
  );
}
