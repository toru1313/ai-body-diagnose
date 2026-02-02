"use client";

import { useEffect, useState } from "react";
import { Lock, Unlock, Calendar, User, ChevronRight } from "lucide-react";

export default function AdminPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/logs?password=${password}`);
            const data = await res.json();
            if (res.ok) {
                setLogs(data);
                setIsLoggedIn(true);
            } else {
                alert("パスワードが違います");
            }
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
                <div className="w-full max-w-sm glass-card rounded-3xl p-8 space-y-6">
                    <h1 className="text-2xl font-bold text-center">管理者ログイン</h1>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && fetchLogs()}
                        placeholder="管理パスワード"
                        className="w-full p-4 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <button
                        onClick={fetchLogs}
                        disabled={loading}
                        className="w-full py-4 rounded-2xl btn-primary font-bold shadow-lg"
                    >
                        {loading ? "ログイン中..." : "ログイン"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-12 px-6 space-y-10">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black">診断ログ一覧</h1>
                <div className="px-4 py-2 rounded-xl bg-white border border-slate-100 text-sm font-bold text-slate-500">
                    合計: {logs.length}件
                </div>
            </div>

            <div className="glass-card rounded-[40px] overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="p-6 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">日時</th>
                            <th className="p-6 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">ユーザー</th>
                            <th className="p-6 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">診断結果</th>
                            <th className="p-6 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">ステータス</th>
                            <th className="p-6 text-left text-xs font-bold text-slate-400 uppercase tracking-widest"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-6">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Calendar className="w-4 h-4" />
                                        <span className="font-medium">{new Date(log.createdAt).toLocaleString("ja-JP")}</span>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 font-bold">
                                            <User className="w-4 h-4 text-slate-400" />
                                            {log.sex}
                                        </div>
                                        <div className="text-xs text-slate-400">{log.ageRange}</div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    {log.aiResult ? (
                                        <div className="space-y-1">
                                            <div className="font-black text-pink-600">{log.aiResult.type}</div>
                                            <div className="text-xs font-bold text-slate-400">Score: {log.aiResult.score}</div>
                                        </div>
                                    ) : (
                                        <span className="text-slate-300 italic">生成中...</span>
                                    )}
                                </td>
                                <td className="p-6">
                                    {log.isUnlocked ? (
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                                            <Unlock className="w-3 h-3" />
                                            解放済み
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-400 text-xs font-bold">
                                            <Lock className="w-3 h-3" />
                                            未解放
                                        </div>
                                    )}
                                </td>
                                <td className="p-6 text-right">
                                    <a
                                        href={`/result/${log.id}`}
                                        target="_blank"
                                        className="p-3 rounded-xl hover:bg-white inline-flex items-center justify-center text-slate-400 hover:text-pink-500 transition-all border border-transparent hover:border-pink-100"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
