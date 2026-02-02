"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, User, Brain, ArrowRight } from "lucide-react";

type Message = {
    id: string;
    type: "ai" | "user";
    text?: string;
    isTyping?: boolean;
    options?: string[];
    field?: string;
};

const STEPS = [
    {
        field: "sex",
        question: "はじめに、あなたの性別を教えていただけますか？",
        options: ["女性", "男性", "回答しない"],
    },
    {
        field: "ageRange",
        question: "年齢層を教えてください。",
        options: ["10代-20代", "30代", "40代", "50代", "60代以上"],
    },
    {
        field: "main_issue",
        question: "今、最も気になっている不調はどれですか？",
        options: ["首・肩のこり", "腰の痛み", "姿勢の悪さ", "呼吸が浅い", "疲れやすい", "身体の歪み"],
    },
    {
        field: "worker_type",
        question: "普段の作業スタイルはどのような形が多いですか？",
        options: ["デスクワーク中心", "立ち仕事中心", "力仕事・移動が多い", "主婦・主夫", "学生"],
    },
    {
        field: "exercise_habit",
        question: "現在の運動習慣について教えてください。",
        options: ["週2回以上", "週1回程度", "月2-3回", "ほぼ運動しない"],
    },
];

export default function DiagnosisPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [stepIndex, setStepIndex] = useState(0);
    const [formValues, setFormValues] = useState<any>({ answers: {} });
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        addAiMessage(STEPS[0]);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const addAiMessage = (step: typeof STEPS[0]) => {
        const typingId = "typing-" + Math.random();
        setMessages((prev) => [
            ...prev,
            { id: typingId, type: "ai", isTyping: true }
        ]);

        setTimeout(() => {
            setMessages((prev) =>
                prev.map(m => m.id === typingId ? {
                    id: "msg-" + Math.random(),
                    type: "ai",
                    text: step.question,
                    options: step.options,
                    field: step.field
                } : m)
            );
        }, 500); // 500ms delay fixed
    };

    const handleSelect = async (field: string, value: string) => {
        setMessages((prev) => [
            ...prev,
            { id: "user-" + Math.random(), type: "user", text: value }
        ]);

        const newValues = { ...formValues };
        if (field === "sex" || field === "ageRange") {
            newValues[field] = value;
        } else {
            newValues.answers[field] = value;
        }
        setFormValues(newValues);

        const nextIndex = stepIndex + 1;
        if (nextIndex < STEPS.length) {
            setStepIndex(nextIndex);
            addAiMessage(STEPS[nextIndex]);
        } else {
            finishDiagnosis(newValues);
        }
    };

    const finishDiagnosis = async (finalValues: any) => {
        setIsAnalyzing(true);
        try {
            const response = await fetch("/api/diagnose", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalValues),
            });
            const data = await response.json();
            if (data.id) {
                router.push(`/result/${data.id}`);
            }
        } catch (error: any) {
            console.error(error);
            setIsAnalyzing(false);
        }
    };

    if (isAnalyzing) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[90vh] space-y-8 p-6">
                <div className="relative">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="w-32 h-32 rounded-full border-t-4 border-l-4 border-pink-500/30 border-t-pink-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Brain className="w-12 h-12 text-pink-500 animate-pulse" />
                    </div>
                </div>
                <div className="text-center space-y-3">
                    <h2 className="text-2xl font-black gradient-text">AIによる詳細分析中...</h2>
                    <p className="text-slate-400 font-medium">あなたの不調の根本原因を特定し、<br />最適な解決策を選定しています。</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto h-[90vh] flex flex-col p-4 md:p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center shadow-lg">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-black text-lg leading-none">AI診断アシスタント</h1>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                            Online Now
                        </span>
                    </div>
                </div>
                <div className="text-xs font-bold text-slate-300 italic">
                    Progress: {Math.round(((stepIndex + 1) / STEPS.length) * 100)}%
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto space-y-6 pb-20 px-2 scroll-smooth scrollbar-hide"
            >
                <AnimatePresence initial={false}>
                    {messages.map((m) => (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${m.type === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`max-w-[85%] flex gap-3 ${m.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm
                  ${m.type === "ai" ? "bg-white text-slate-400" : "bg-indigo-100 text-indigo-600"}`}
                                >
                                    {m.type === "ai" ? <Brain className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                </div>

                                <div className="space-y-4">
                                    <div className={`px-5 py-3.5 rounded-[22px] font-bold text-sm leading-relaxed shadow-sm
                    ${m.type === "ai" ? "chat-bubble-ai text-slate-700 glass-card" : "chat-bubble-user"}`}
                                    >
                                        {m.isTyping ? (
                                            <div className="flex gap-1.5 py-1">
                                                <div className="dot" />
                                                <div className="dot" style={{ animationDelay: "0.2s" }} />
                                                <div className="dot" style={{ animationDelay: "0.4s" }} />
                                            </div>
                                        ) : (
                                            m.text
                                        )}
                                    </div>

                                    {m.options && !m.isTyping && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-2">
                                            {m.options.map((option) => (
                                                <motion.button
                                                    key={option}
                                                    whileHover={{ scale: 1.02, x: 2 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleSelect(m.field!, option)}
                                                    className="flex items-center justify-between p-4 rounded-3xl glass-card border-slate-200 hover:border-pink-300 hover:bg-white text-left transition-all group"
                                                >
                                                    <span className="text-xs font-bold text-slate-600 group-hover:text-pink-600">{option}</span>
                                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-pink-400" />
                                                </motion.button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
