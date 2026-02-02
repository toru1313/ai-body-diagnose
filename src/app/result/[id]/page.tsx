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
    Brain,
    Trophy,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
        } catch (err: any) {
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
        } catch (err: any) {
            console.error(err);
        }
    };

    if (loading) return null;

    if (!isUnlocked) {
        return (
            <div className="max-w-xl mx-auto py-12 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-[48px] p-8 md:p-12 text-center space-y-10 border-white/50 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-3xl rounded-full" />

                    <div className="space-y-4 relative">
                        <div className="w-24 h-24 bg-gradient-to-tr from-pink-500 to-indigo-600 rounded-[32px] mx-auto flex items-center justify-center shadow-2xl shadow-pink-200">
                            <Lock className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-black leading-tight mt-6">
                            診断レポートの<span className="gradient-text">準備が整いました</span>
                        </h1>
                        <p className="text-slate-500 font-medium">
                            AIによる詳細な分析結果と、<br />
                            <span className="text-pink-600 font-bold">あなた専用のピラティス動画</span>
                            をロックしています。
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-3 text-left">
                            {[
                                { icon: Brain, text: "不調の根本原因と将来的リスクの特定", color: "text-blue-500" },
                                { icon: Zap, text: "プロが教える即効性の高い改善案", color: "text-amber-500" },
                                { icon: Youtube, text: "全編無料：専用ピラティスレッスン", color: "text-red-500" },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-5 bg-white/40 rounded-[28px] border border-white/60">
                                    <div className={`w-10 h-10 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm ${item.color}`}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-black text-slate-700">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 space-y-4">
                            <a
                                href={process.env.NEXT_PUBLIC_LINE_ADD_FALLBACK_URL || "#"}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center gap-3 w-full py-6 rounded-[32px] bg-[#06C755] hover:bg-[#05b34d] text-white text-xl font-black shadow-xl shadow-green-100 transition-all hover:-translate-y-1"
                            >
                                <MessageCircle className="w-7 h-7 fill-current" />
                                LINE友だち追加で受け取る
                            </a>
                            <p className="text-[11px] text-slate-400 font-bold">
                                友だち追加後、すぐに結果を閲覧いただけます
                            </p>
                        </div>

                        <div className="pt-10 border-t border-slate-100 space-y-6">
                            <div className="flex flex-col items-center gap-5">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`
                                        w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all
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
                                    <span className="text-sm font-black text-slate-500">LINE追加しました</span>
                                </label>

                                <button
                                    onClick={handleUnlock}
                                    disabled={!lineChecked}
                                    className="w-full py-5 rounded-[28px] bg-slate-900 text-white font-black disabled:opacity-20 transition-all active:scale-95 shadow-xl"
                                >
                                    すべての結果を解放する
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

    // Precise Radar Chart implementation using SVG
    const RadarChart = ({ score }: { score: number }) => {
        const points = [
            { label: "姿勢", value: score * 0.9 + Math.random() * 10 },
            { label: "柔軟性", value: score * 0.8 + Math.random() * 15 },
            { label: "筋力", value: score * 0.7 + Math.random() * 20 },
            { label: "持久力", value: score * 0.85 + Math.random() * 10 },
            { label: "バランス", value: score * 0.75 + Math.random() * 15 },
        ];

        const size = 300;
        const center = size / 2;
        const radius = 100;
        const angleStep = (Math.PI * 2) / points.length;

        const getCoord = (val: number, i: number, rScale = radius) => {
            const r = (val / 100) * rScale;
            const angle = i * angleStep - Math.PI / 2;
            return {
                x: center + r * Math.cos(angle),
                y: center + r * Math.sin(angle),
            };
        };

        const gridCircles = [20, 40, 60, 80, 100].map((r, i) => {
            return points.map((_, idx) => {
                const p = getCoord(r, idx);
                return `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`;
            }).join(" ") + " Z";
        });

        const dataPath = points.map((p, i) => {
            const coord = getCoord(p.value, i);
            return `${i === 0 ? "M" : "L"} ${coord.x} ${coord.y}`;
        }).join(" ") + " Z";

        return (
            <div className="relative w-full aspect-square max-w-[320px] mx-auto fade-in">
                <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
                    {/* Grid */}
                    {gridCircles.map((d, i) => (
                        <path key={i} d={d} fill="none" stroke="#fce7f3" strokeWidth="1" />
                    ))}
                    {points.map((_, i) => {
                        const p = getCoord(100, i);
                        return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="#fce7f3" strokeWidth="1" />;
                    })}

                    {/* Data Area */}
                    <motion.path
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        d={dataPath}
                        fill="rgba(244, 114, 182, 0.2)"
                        stroke="#f43f5e"
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />

                    {/* Labels */}
                    {points.map((p, i) => {
                        const coord = getCoord(115, i);
                        return (
                            <text
                                key={i}
                                x={coord.x}
                                y={coord.y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-[10px] font-black fill-slate-400 uppercase tracking-widest"
                            >
                                {p.label}
                            </text>
                        );
                    })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-4xl font-black gradient-text mt-2"
                    >
                        {res.score}
                    </motion.span>
                    <span className="text-[8px] font-black text-slate-300 tracking-[0.3em] uppercase">Score</span>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-6 space-y-14 pb-safe">
            {/* Header Result */}
            <section className="text-center space-y-4 fade-in">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="inline-block px-5 py-1.5 rounded-full bg-white glass border-white/60 text-pink-500 text-[10px] font-black tracking-widest uppercase shadow-sm"
                >
                    Analysis Confirmed
                </motion.div>
                <div className="space-y-2">
                    <h1 className="text-5xl font-black gradient-text tracking-tighter leading-tight">{res.type}</h1>
                    <p className="text-md font-bold text-slate-400 max-w-sm mx-auto leading-tight">{res.summary}</p>
                </div>

                <div className="py-2">
                    <RadarChart score={res.score} />
                </div>
            </section>

            {/* Recommended Video */}
            <section className="glass-card rounded-[48px] overflow-hidden border-white/80">
                <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 blur-3xl rounded-full" />
                    <div className="flex items-center gap-4 relative">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-400/20">
                            <Trophy className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black">あなた専用の改善プログラム</h3>
                            <p className="text-xs font-bold text-indigo-300 tracking-wider">PREMIUM LESSON</p>
                        </div>
                    </div>
                </div>
                <div className="p-8 md:p-10 space-y-8">
                    <div className="space-y-3">
                        <h4 className="text-2xl font-black text-slate-800">{res.video_lesson.title}</h4>
                        <p className="text-slate-500 font-medium leading-relaxed">{res.video_lesson.goal}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50/50 p-5 rounded-3xl border border-white flex flex-col gap-1">
                            <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Duration</span>
                            <span className="font-black text-lg">{res.video_lesson.minutes} min</span>
                        </div>
                        <div className="bg-slate-50/50 p-5 rounded-3xl border border-white flex flex-col gap-1">
                            <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Level</span>
                            <span className="font-black text-lg text-indigo-600 font-outfit">{res.video_lesson.level}</span>
                        </div>
                    </div>

                    <a
                        href={videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-3 w-full py-6 rounded-[32px] btn-primary text-xl font-black shadow-2xl"
                    >
                        今すぐ動画レッスンを見る
                        <ExternalLink className="w-5 h-5" />
                    </a>

                    <div className="bg-pink-50/50 p-7 rounded-[32px] space-y-4 border border-white/60">
                        <h5 className="font-black text-pink-700 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            プロからの注意事項
                        </h5>
                        <ul className="space-y-3">
                            {res.video_lesson.notes.map((note: string, idx: number) => (
                                <li key={idx} className="text-sm text-pink-600/80 font-bold flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-pink-300 mt-1.5 shrink-0" />
                                    {note}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Detailed Analysis */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { title: "不調の根本原因", data: res.causes, icon: Zap, color: "text-pink-500", bg: "bg-pink-500/5", border: "border-pink-100" },
                    { title: "将来的なリスク", data: res.risks, icon: ShieldCheck, color: "text-indigo-600", bg: "bg-indigo-600/5", border: "border-indigo-100" }
                ].map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className={`glass-card rounded-[40px] p-8 space-y-6 ${card.border}`}
                    >
                        <h3 className="text-xl font-black flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-2xl ${card.bg} flex items-center justify-center`}>
                                <card.icon className={`w-5 h-5 ${card.color}`} />
                            </div>
                            {card.title}
                        </h3>
                        <ul className="space-y-4">
                            {card.data.map((item: string, idx: number) => (
                                <li key={idx} className="flex gap-4 text-slate-600 text-sm">
                                    <CheckCircle2 className={`w-5 h-5 ${card.color} opacity-30 shrink-0 mt-0.5`} />
                                    <span className="font-bold leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </section>

            {/* Footer Program CTA */}
            <section className="bg-slate-900 rounded-[56px] p-10 md:p-14 text-white space-y-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 blur-[120px] rounded-full" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/10 blur-[120px] rounded-full" />

                <div className="space-y-5 relative">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-[10px] font-black tracking-widest uppercase">Next Action</div>
                    <h3 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">あなたの理想の<br />プロポーションへ。</h3>
                    <p className="text-slate-400 font-medium max-w-md leading-relaxed">
                        診断結果に基づいて、最も効果的なプログラムを提案します。まずはLINEで毎日のアドバイスを受け取りましょう。
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-8 py-10 border-y border-white/10 relative">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">推奨頻度</span>
                        <div className="text-2xl font-black">{res.recommended_program.frequency}</div>
                    </div>
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">1回の時間</span>
                        <div className="text-2xl font-black">{res.recommended_program.duration}</div>
                    </div>
                </div>

                <div className="space-y-6 relative pt-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <a
                            href={process.env.NEXT_PUBLIC_LINE_ADD_FALLBACK_URL || "#"}
                            className="flex-1 flex items-center justify-center gap-3 py-6 rounded-[32px] bg-white text-slate-900 font-black hover:bg-slate-100 transition-colors shadow-xl"
                        >
                            <MessageCircle className="w-5 h-5 fill-slate-900" />
                            LINEで改善のコツを学ぶ
                        </a>
                        <a
                            href={process.env.NEXT_PUBLIC_BOOKING_URL || "#"}
                            className="flex-1 flex items-center justify-center gap-3 py-6 rounded-[32px] bg-pink-500 text-white font-black hover:bg-pink-600 transition-colors shadow-xl shadow-pink-500/20"
                        >
                            無料個別体験に申し込む
                            <ArrowRight className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
