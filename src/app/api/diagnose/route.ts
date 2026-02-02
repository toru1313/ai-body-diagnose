import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { nanoid } from "nanoid";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sex, ageRange, answers } = body;

    if (!sex || !ageRange || !answers) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // AI Prompt Construction
    const prompt = `
あなたは熟練のピラティスインストラクター兼セラピストです。
以下のユーザー情報と回答に基づき、不調タイプを診断し、JSON形式で回答してください。

ユーザー情報:
- 性別: ${sex}
- 年齢層: ${ageRange}
- 悩み/回答: ${JSON.stringify(answers)}

診断タイプは必ず以下の6つの中から最も近いものを1つ選んでください：
1. スマホ首猫背タイプ
2. 反り腰デスクワーカータイプ
3. 骨盤バランス崩れタイプ
4. 呼吸浅いストレスタイプ
5. 片重心アンバランスタイプ
6. 運動不足こわばりタイプ

レスポンスは以下のスキーマに従った純粋なJSONのみを返してください。不要な説明は一切含めないでください。

{
  "type": "上記リストから完全一致",
  "score": 0-100,
  "summary": "40字以内のキャッチコピー",
  "causes": ["原因1", "原因2", "原因3"],
  "risks": ["このまま放置した際のリスク1", "リスク2"],
  "keys": ["改善のポイント1", "ポイント2"],
  "recommended_program": {
    "title": "推奨するプログラム名",
    "reason": "なぜこのプログラムが必要か（120字以内）",
    "duration": "1回あたりの目安時間",
    "frequency": "推奨頻度"
  },
  "video_lesson": {
    "title": "あなた専用のピラティス動画タイトル（40字以内）",
    "goal": "この動画で達成する目的（60字以内）",
    "minutes": 3-20,
    "level": "初級/中級",
    "notes": ["注意点1","注意点2","注意点3"]
  },
  "home_tips": ["自宅でできるアドバイス1", "アドバイス2"],
  "cta": {
    "line_text": "LINE追加を促す一言（60字以内）",
    "after_add_text": "追加後に受け取れる内容の一言（60字以内）"
  }
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: "あなたは不調タイプ診断AIです。JSON形式で出力します。" }, { role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const aiResultString = completion.choices[0].message.content;
    const unlockToken = nanoid(32);

    const result = await prisma.diagnosisResult.create({
      data: {
        sex,
        ageRange,
        answers: JSON.stringify(answers),
        aiResult: aiResultString,
        unlockToken,
        isUnlocked: false,
      },
    });

    return NextResponse.json({ id: result.id });
  } catch (error: any) {
    console.error("Diagnosis Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
