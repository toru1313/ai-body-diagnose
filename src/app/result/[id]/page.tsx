"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    Lock,
    MessageCircle,
    Youtube,
    ArrowRight,
    ShieldCheck,
    Zap,
    CheckCircle2,
    Calendar,
    AlertCircle,
    ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";

const VIDEO_MAPPING: Record<string, string> = {
    "スマホ首猫背タイプ": "https://example.com/video1",
    "反り腰デスクワーカータイプ": "https://example.com/video2",
    "骨盤バランス崩れタイプ": "https://example.com/video3",
    "呼吸浅いストレスタイプ": "https://example.com/video4",
    "片重心アンバランスタイプ": "https://example.com/video5",
    "運動不足こわばりタイプ": "https://example.com/video6",
};

export default function ResultPage() {
    const { id } = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [lineChecked, setLineChecked] = useState(false);

    const fetchResult = async () => {
        try {
            const resp = await fetch(`/api/result?id=${id}`);
            const json = await resp.json();
            setData(json);
            setIsUnlocked(json.isUnlocked);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResult();
    }, [id]);

    const handleUnlock = async () => {
        if (!lineChecked) return;
        try {
            await fetch(`/api/unlock`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            fetchResult();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return null;

    if (!isUnlocked) {
        return (
            <div className="max-w-xl mx-auto py-12 px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card rounded-[40px] p-8 md:p-12 text-center space-y-10 border-pink-200"
                >
                    <div className="space-y-4">
                        <div className="w-20 h-20 bg-pink-100 text-pink-500 rounded-3xl mx-auto flex items-center justify-center relative">
                            <Lock className="w-10 h-10" />
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg border border-pink-100">
                                <AlertCircle className="w-4 h-4 text-pink-400" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-extrabold leading-tight">
                            診断結果は<span className="gradient-text">LINEで受け取れます</span>
                        </h1>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            あなたの回答・統計データから生成された、<br />
                            <span className="text-pink-600 font-bold">「不調タイプ特定」と「専用ピラティス動画」</span>
                            の準備ができました。
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 text-left">
                            {[
                                { icon: ShieldCheck, text: "不調の根本原因と将来のリスク" },
                                { icon: Zap, text: "今すぐできる改善アドバイス" },
                                { icon: Youtube, text: "タイプ別ピラティス動画レッスン (無料)" },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl border border-white">
                                    <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-500 shrink-0">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-600">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <a
                                href={process.env.NEXT_PUBLIC_LINE_ADD_FALLBACK_URL || "#"}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center gap-3 w-full py-6 rounded-3xl bg-[#06C755] hover:bg-[#05b34d] text-white text-xl font-black shadow-xl shadow-green-200 transition-all hover:-translate-y-1"
                            >
                                <MessageCircle className="w-8 h-8 fill-current" />
                                LINE友だち追加
                            </a>
                            <p className="text-[10px] text-slate-400 leading-tight">
                                ※ 友だち追加後、メッセージで結果が届きます。<br />
                                いつでもブロック可能です。
                            </p>
                        </div>

                        <div className="pt-8 border-t border-slate-100 space-y-6">
                            <div className="flex flex-col items-center gap-4">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`
                    w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
                    ${lineChecked ? "bg-pink-500 border-pink-500" : "bg-white border-slate-200 group-hover:border-pink-300"}
                  `}>
                                        {lineChecked && <CheckCircle2 className="w-4 h-4 text-white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={lineChecked}
                                        onChange={(e) => setLineChecked(e.target.checked)}
                                    />
                                    <span className="text-sm font-bold text-slate-500">LINE追加が完了しました</span>
                                </label>

                                <button
                                    onClick={handleUnlock}
                                    disabled={!lineChecked}
                                    className="w-full py-5 rounded-3xl bg-slate-800 text-white font-bold disabled:opacity-20 transition-all active:scale-95"
                                >
                                    結果を解放する
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    const res = data.aiResult;
    const videoUrl = VIDEO_MAPPING[res.type] || VIDEO_MAPPING["運動不足こわばりタイプ"];

    return (
        <div className="max-w-2xl mx-auto py-12 px-6 space-y-12">
            {/* Header Result */}
            <section className="text-center space-y-6">
                <div className="inline-block px-4 py-1.5 rounded-full bg-pink-100 text-pink-600 text-sm font-bold border border-pink-200">
                    診断結果
                </div>
                <div className="space-y-2">
                    <h1 className="text-5xl font-black gradient-text">{res.type}</h1>
                    <p className="text-xl font-bold text-slate-600">{res.summary}</p>
                </div>

                <div className="relative inline-flex items-center justify-center p-12">
                    <svg className="w-48 h-48 -rotate-90">
                        <circle cx="96" cy="96" r="88" className="fill-none stroke-slate-100 stroke-[16]" />
                        <motion.circle
                            cx="96" cy="96" r="88"
                            className="fill-none stroke-pink-500 stroke-[16] stroke-round"
                            initial={{ strokeDasharray: "0 553" }}
                            animate={{ strokeDasharray: `${(res.score / 100) * 553} 553` }}
                            transition={{ duration: 2, ease: "easeOut" }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black">{res.score}</span>
                        <span className="text-xs font-bold text-slate-400">Score</span>
                    </div>
                </div>
            </section>

            {/* Recommended Video */}
            <section className="glass-card rounded-[40px] overflow-hidden border-indigo-200">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Youtube className="w-8 h-8" />
                        <h3 className="text-xl font-bold">あなた専用のレッスン</h3>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/20 text-xs font-medium backdrop-blur-md">
                        無料プレゼント中
                    </div>
                </div>
                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        <h4 className="text-2xl font-bold">{res.video_lesson.title}</h4>
                        <p className="text-slate-500 leading-relaxed">{res.video_lesson.goal}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-1">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">再生時間</span>
                            <span className="font-bold">{res.video_lesson.minutes}分</span>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-1">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">難易度</span>
                            <span className="font-bold text-indigo-600">{res.video_lesson.level}</span>
                        </div>
                    </div>

                    <a
                        href={videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-3 w-full py-5 rounded-3xl btn-primary text-xl font-bold shadow-xl shadow-pink-200"
                    >
                        今すぐ動画レッスンを見る
                        <ExternalLink className="w-5 h-5" />
                    </a>

                    <div className="bg-pink-50 p-6 rounded-3xl space-y-4 border border-pink-100">
                        <h5 className="font-bold text-pink-700 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            安全に行うためのポイント
                        </h5>
                        <ul className="space-y-2">
                            {res.video_lesson.notes.map((note: string, idx: number) => (
                                <li key={idx} className="text-sm text-pink-600 flex gap-2">
                                    <span className="text-pink-300">•</span>
                                    {note}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Detailed Analysis */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card rounded-[40px] p-8 space-y-6 border-slate-100">
                    <h3 className="text-xl font-black flex items-center gap-2">
                        <Zap className="w-6 h-6 text-pink-500" />
                        不調の原因
                    </h3>
                    <ul className="space-y-4">
                        {res.causes.map((item: string, idx: number) => (
                            <li key={idx} className="flex gap-3 text-slate-600">
                                <CheckCircle2 className="w-5 h-5 text-pink-400 shrink-0" />
                                <span className="font-medium">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="glass-card rounded-[40px] p-8 space-y-6 border-slate-100">
                    <h3 className="text-xl font-black flex items-center gap-2 text-indigo-600">
                        <ShieldCheck className="w-6 h-6" />
                        将来のリスク
                    </h3>
                    <ul className="space-y-4">
                        {res.risks.map((item: string, idx: number) => (
                            <li key={idx} className="flex gap-3 text-slate-600">
                                <AlertCircle className="w-5 h-5 text-indigo-300 shrink-0" />
                                <span className="font-medium">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Program */}
            <section className="bg-slate-900 rounded-[50px] p-10 text-white space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/20 blur-[120px] rounded-full" />
                <div className="space-y-4">
                    <h3 className="text-3xl font-black">推奨プログラム</h3>
                    <h4 className="text-xl text-pink-400 font-bold">{res.recommended_program.title}</h4>
                    <p className="text-slate-400 leading-relaxed max-w-lg">{res.recommended_program.reason}</p>
                </div>

                <div className="grid grid-cols-2 gap-8 py-8 border-y border-slate-800">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase">推奨頻度</span>
                        </div>
                        <div className="text-xl font-bold">{res.recommended_program.frequency}</div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Zap className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase">所要時間</span>
                        </div>
                        <div className="text-xl font-bold">{res.recommended_program.duration}</div>
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-sm font-bold text-slate-400">{res.cta.line_text}</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <a
                            href={process.env.NEXT_PUBLIC_LINE_ADD_FALLBACK_URL || "#"}
                            className="flex-1 flex items-center justify-center gap-2 py-5 rounded-3xl bg-white text-slate-900 font-black"
                        >
                            <MessageCircle className="w-5 h-5 fill-slate-900" />
                            LINEでアドバイスを受ける
                        </a>
                        <a
                            href={process.env.NEXT_PUBLIC_BOOKING_URL || "#"}
                            className="flex-1 flex items-center justify-center gap-2 py-5 rounded-3xl bg-pink-500 text-white font-black"
                        >
                            体験予約をする
                            <ArrowRight className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
