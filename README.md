# AI不調タイプ診断 アプリ

Next.js(App Router) + TypeScript + Tailwind CSS + Prisma(SQLite) + OpenAI API を使用した、AIによる不調タイプ診断およびコンテンツロック型LINE誘導システムです。

## 概要

1. **AI診断**: ユーザーの身体の悩みに基づき、6つのタイプからAIが判定します。
2. **LINE誘導 (CTA)**: 診断結果の詳細はロックされており、LINE友だち追加を促します。
3. **コンテンツ解禁**: MVPでは自己申告による解除ボタンで結果とタイプ別ピラティス動画を表示します。
4. **管理画面**: 診断されたユーザーのログを一覧で確認できます。

## セットアップ手順

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 環境変数の設定
`.env` ファイルを作成し、以下を設定してください。
```env
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY="your_actual_key"
ADMIN_PASSWORD="admin_password_here"
NEXT_PUBLIC_LINE_ADD_FALLBACK_URL="https://example.com/line"
NEXT_PUBLIC_BOOKING_URL="https://example.com/booking"
```

### 3. データベースの初期化
```bash
npx prisma migrate dev --name init
```

### 4. 開発サーバーの起動
```bash
npm run dev
```

## Vercel デプロイへの注意点

1. **SQLite**: Vercel上ではディスク書き込みが制限されるため、本番運用では **PlanetScale**, **Neon**, **Supabase (PostgreSQL)** などの外部DBへの移行を推奨します。
2. **Environment Variables**: Vercelのプロジェクト設定から環境変数を必ず登録してください。

## 将来のLINE Messaging API連携案

1. **Webhookの実装**: LINE公式アカウントでメッセージが送信された際に `/api/line/webhook` を叩くように設定。
2. **unlockTokenの活用**: Webhook内でユーザーIDと `unlockToken` を紐付け、自動的に `/api/unlock` を実行することで、ユーザーがLINE追加後に「結果を受け取る」ボタンを押すだけでサイト側が同期的に解除される実装が可能です。

## 診断タイプ一覧
- スマホ首猫背タイプ
- 反り腰デスクワーカータイプ
- 骨盤バランス崩れタイプ
- 呼吸浅いストレスタイプ
- 片重心アンバランスタイプ
- 運動不足こわばりタイプ
