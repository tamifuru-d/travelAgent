# travelAgent

行き先を「現代日本の観光地」ではなく、その土地の時代・世界観の住人として体験するためのロールプレイ旅行ガイド。

設計の3本柱：
1. **ロールプレイ起点** — 行き先の時代・世界観を提示し、対話で役どころを決める
2. **地動説モデル** — ユーザーの興味（惑星）と行き先の整列を見つける
3. **自己言及的セラピー** — 旅の選択から本人の心の状態を映し出す

## スタック

- フロント: 素のHTML / CSS / JS（`public/`）
- バック: Cloudflare Workers（`src/worker.js`、Static Assets バインディング経由で `public/` を配信）
- LLM: Gemini API（`gemini-2.5-flash`）
- デプロイ: Cloudflare Workers（GitHub連携で自動デプロイ）

## ローカル開発

```bash
npm install -g wrangler
cp .dev.vars.example .dev.vars  # GEMINI_API_KEY を記入
wrangler dev
```

## Cloudflare デプロイ

GitHub連携済み。`main` への push で自動デプロイ。

環境変数 `GEMINI_API_KEY` の登録は、Cloudflare Dashboard で：
1. 該当 Worker → **Settings** → **Variables and Secrets** → **Add**
2. Type: **Secret** / Name: `GEMINI_API_KEY` / Value: 取得済みキー
3. **Deploy**

## ディレクトリ構成

```
travelAgent/
├── public/              # 静的アセット
│   ├── index.html
│   ├── style.css
│   └── app.js
├── src/
│   └── worker.js        # /api/chat ハンドラ + ASSETS フォールスルー
├── wrangler.jsonc
├── .dev.vars.example
├── .gitignore
└── README.md
```
