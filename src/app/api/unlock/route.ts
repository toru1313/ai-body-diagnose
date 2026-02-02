import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id, unlockToken } = body;

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const result = await prisma.diagnosisResult.findUnique({
            where: { id },
        });

        if (!result) {
            return NextResponse.json({ error: "Result not found" }, { status: 404 });
        }

        // MVP: Allow manual unlock if requested, but comment about token requirement
        // If unlockToken is provided, it must match.
        if (unlockToken && result.unlockToken !== unlockToken) {
            return NextResponse.json({ error: "Invalid unlock token" }, { status: 403 });
        }

        // UNLOCK
        await prisma.diagnosisResult.update({
            where: { id },
            data: {
                isUnlocked: true,
                unlockedAt: new Date(),
            },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Unlock Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
