import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const password = searchParams.get("password");

    if (password !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const logs = await prisma.diagnosisResult.findMany({
            orderBy: { createdAt: "desc" },
        });

        const parsedLogs = logs.map((log: any) => ({
            ...log,
            aiResult: log.aiResult ? JSON.parse(log.aiResult) : null,
            answers: JSON.parse(log.answers),
        }));

        return NextResponse.json(parsedLogs);
    } catch (error: any) {
        console.error("Admin Logs Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
