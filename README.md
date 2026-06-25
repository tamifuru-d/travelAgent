# travelAgent

行き先を「現代日本の観光地」ではなく、その土地の時代・世界観の住人として体験するためのロールプレイ旅行ガイド。

設計の3本柱：
1. **ロールプレイ起点** — 行き先の時代・世界観を提示し、対話で役どころを決める
2. **地動説モデル** — ユーザーの興味（惑星）と行き先の整列を見つける
3. **自己言及的セラピー** — 旅の選択から本人の心の状態を映し出す

## スタック

- フロント: 素のHTML / CSS / JS（`public/`）
- バック: Cloudflare Pages Functions（`functions/api/chat.js`）
- LLM: Gemini API（`gemini-2.5-flash`）
- デプロイ: Cloudflare Pages（GitHub連携で自動デプロイ）

## ローカル開発

```bash
npm install -g wrangler
cp .dev.vars.example .dev.vars  # GEMINI_API_KEY を記入
wrangler pages dev public
```

ブラウザで `http://localhost:8788` を開く。

## Cloudflare Pages デプロイ

1. GitHubにpush
2. Cloudflare Dashboard → Pages → 「Create a project」→ GitHubリポジトリを接続
3. ビルド設定：
   - Framework preset: **None**
   - Build command: （空欄）
   - Build output directory: **`public`**
4. Environment variables に `GEMINI_API_KEY` を登録
5. Deploy

## ディレクトリ構成

```
travelAgent/
├── public/              # 静的アセット（Cloudflare Pagesが配信）
│   ├── index.html
│   ├── style.css
│   └── app.js
├── functions/api/       # Pages Functions
│   └── chat.js
├── .dev.vars.example
├── .gitignore
└── README.md
```
