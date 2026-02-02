import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const unlockToken = searchParams.get("token");

    if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    try {
        const result = await prisma.diagnosisResult.findUnique({
            where: { id },
        });

        if (!result) {
            return NextResponse.json({ error: "Result not found" }, { status: 404 });
        }

        // Handle token-based unlocking from GET parameter (for future LINE integration)
        if (unlockToken && result.unlockToken === unlockToken && !result.isUnlocked) {
            await prisma.diagnosisResult.update({
                where: { id },
                data: {
                    isUnlocked: true,
                    unlockedAt: new Date(),
                },
            });
            // Refresh local copy
            result.isUnlocked = true;
        }

        const aiResult = (result as any).aiResult ? JSON.parse((result as any).aiResult) : null;

        if (!result.isUnlocked) {
            // If locked, only return basic and metadata
            return NextResponse.json({
                id: result.id,
                isUnlocked: false,
                type: aiResult?.type || null, // Allow showing type name if desired, but user requirements say lock everything except summary/cta
                // Based on instructions: description of what can be received
                lockedInfo: {
                    title: "診断結果はLINEで受け取れます",
                    description: "あなたの不調タイプ診断 + 専用ピラティス動画レッスン",
                    steps: [
                        "LINEを友だち追加",
                        "「診断結果を受け取る」をタップ",
                        "結果と専用動画が届きます"
                    ]
                }
            });
        }

        // If unlocked, return full result
        return NextResponse.json({
            ...result,
            aiResult,
            answers: JSON.parse(result.answers),
        });
    } catch (error) {
        console.error("Fetch Result Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
