"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";

type FormData = {
    sex: string;
    ageRange: string;
    answers: Record<string, string>;
};

const STEPS = [
    {
        id: "basic",
        title: "基本情報の入力",
        sub: "まずは基本情報を教えてください",
        fields: [
            { name: "sex", label: "性別", options: ["女性", "男性", "回答しない"] },
            { name: "ageRange", label: "年齢層", options: ["10代-20代", "30代", "40代", "50代", "60代以上"] },
        ],
    },
    {
        id: "symptoms",
        title: "今の不調について",
        sub: "最も気になる症状はどれですか？",
        fields: [
            {
                name: "main_issue",
                label: "主な不調",
                options: ["首・肩のこり", "腰の痛み", "姿勢の悪さ（猫背・反り腰）", "呼吸が浅い・息苦しい", "疲れやすい・だるい", "身体の歪み"],
            },
        ],
    },
    {
        id: "lifestyle",
        title: "ライフスタイルについて",
        sub: "普段の環境について教えてください",
        fields: [
            {
                name: "worker_type",
                label: "主な作業スタイル",
                options: ["デスクワーク中心", "立ち仕事中心", "力仕事・移動が多い", "主婦・主夫", "学生"],
            },
            {
                name: "exercise_habit",
                label: "運動習慣",
                options: ["週2回以上", "週1回程度", "月2-3回", "ほぼ運動しない"],
            },
        ],
    },
];

export default function DiagnosisPage() {
    const [step, setStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { watch, setValue } = useForm<FormData>();

    const currentStepData = STEPS[step];
    const formValues = watch();

    const handleSelect = (name: string, value: string) => {
        if (name === "sex" || name === "ageRange") {
            setValue(name as keyof FormData, value);
        } else {
            const prevAnswers = formValues.answers || {};
            setValue("answers", { ...prevAnswers, [name]: value });
        }
    };

    const isLastStep = step === STEPS.length - 1;

    const nextStep = async () => {
        if (isLastStep) {
            await onSubmit();
        } else {
            setStep((s) => s + 1);
        }
    };

    const onSubmit = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/diagnose", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formValues),
            });
            const data = await response.json();
            if (data.id) {
                router.push(`/result/${data.id}`);
            }
        } catch (error: any) {
            console.error("Submit Error:", error);
            setIsSubmitting(false);
        }
    };

    if (isSubmitting) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 space-y-8">
                <div className="relative">
                    <Loader2 className="w-20 h-20 text-pink-500 animate-spin" />
                    <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-indigo-400 animate-pulse" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold animate-pulse">AIが分析しています...</h2>
                    <p className="text-slate-500">
                        あなたの回答に基づき、<br />
                        最適な不調タイプとレッスンを選定しています。
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto py-12 px-6 space-y-8">
            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                />
            </div>

            <div className="space-y-2">
                <h2 className="text-3xl font-extrabold">{currentStepData.title}</h2>
                <p className="text-slate-500">{currentStepData.sub}</p>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                >
                    {currentStepData.fields.map((field) => (
                        <div key={field.name} className="space-y-4">
                            <label className="text-sm font-bold text-slate-400 px-1 uppercase tracking-wider">{field.label}</label>
                            <div className="grid grid-cols-1 gap-3">
                                {field.options.map((option) => {
                                    const currentValue =
                                        field.name === "sex" || field.name === "ageRange"
                                            ? formValues[field.name as keyof FormData]
                                            : formValues.answers?.[field.name];
                                    const isSelected = currentValue === option;

                                    return (
                                        <button
                                            key={option}
                                            onClick={() => handleSelect(field.name, option)}
                                            className={`
                        flex items-center justify-between p-5 rounded-3xl border-2 transition-all text-left font-bold
                        ${isSelected
                                                    ? "border-pink-500 bg-pink-50 shadow-md ring-4 ring-pink-100"
                                                    : "border-white glass-card hover:bg-white"
                                                }
                      `}
                                        >
                                            <span>{option}</span>
                                            {isSelected && <CheckCircle2 className="w-6 h-6 text-pink-500" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-4 pt-4">
                {step > 0 && (
                    <button
                        onClick={() => setStep((s) => s - 1)}
                        className="flex items-center gap-2 px-6 py-4 rounded-3xl font-bold text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        戻る
                    </button>
                )}
                <button
                    onClick={nextStep}
                    disabled={
                        currentStepData.fields.some((f) => {
                            const val =
                                f.name === "sex" || f.name === "ageRange"
                                    ? formValues[f.name as keyof FormData]
                                    : formValues.answers?.[f.name];
                            return !val;
                        })
                    }
                    className="flex-1 flex items-center justify-center gap-2 py-5 rounded-3xl btn-primary text-lg font-bold disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
                >
                    {isLastStep ? "診断結果を見る" : "次へ進む"}
                    {!isLastStep && <ChevronRight className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
}
