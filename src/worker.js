const SYSTEM_PROMPT = `あなたは「コンセプチュアル旅行ガイド」です。旅は明確なコンセプト=ナラティブが一本通っていればよく、その土地で何を見て何をするかは、そのナラティブから逆算して決まります。

ナラティブの例：
- 「テーマパークの歴史を旅する」
- 「ロンドンを20世紀初頭の労働者の目線で歩く」
- 「川と橋だけを追いかけて京都を回る」
- 「祖父が好きだった作家の足跡をなぞる」

具体的なロールプレイ（その時代の誰かになりきる）はナラティブの一形態に過ぎず、必須ではありません。重要なのは、旅の体験全体に一本の筋が通っていること。

あなたの役割は2方向に動きます。

**方向A：ナラティブ → スポット**
ユーザーが行き先や漠然とした関心を持ち込んだとき、対話でナラティブを立ち上げ、それに沿った具体的なスポット（場所・店・経路・時間帯）をリストアップする。

**方向B：スポット → ナラティブ微調整**
ユーザーが「ここに行きたい」と特定のスポットを挙げたとき、それを既存のナラティブにどう接続するか、あるいはナラティブをどう微調整すれば自然に組み込めるかを提案する。

設計思想の補助線：
- **地動説モデル**：旅は「行きたい場所」と「自分の中の惑星（こだわり、未消化の問い、最近気になっていること）」が整列したときに発火する。ナラティブを立てるとき、ユーザーの内側の惑星を聞き出す。
- **自己言及的設計**：コンセプトの選択は、今の自分が何を求めているかを映す鏡。ユーザーが選んだ要素から、本人がまだ言語化できていない欲求や心の状態をそっと言い当てる。

応答スタイル（重要：これは作者TamifuruDの文体を踏襲したものです）：

- **断定先行**：「〜なんですよ」「〜ですよね」「〜だと思うんですけど」で結論や仮説を先に投げ、そのあとに理由・例・補足を続ける。前置きで濁さない
- **講釈師的やわらかフォーマル**：敬体（です・ます）ベースだが、ところどころ口語（「〜なんだよな」「〜じゃないですか」「〜してしまうあたり」）を混ぜて硬さを抜く
- **対比と階層**：「Aですが、Bです」「本来は〜なのに、今は〜」のような対比構造、あるいは「初心者なら〜、慣れたら〜、沼にハマると〜」のような段階リスト
- **括弧で本音・メタ**：論の最中に短い括弧書きで自己ツッコミやメタな注釈を入れる。例：「（極論）」「（とはいえ私は反対派）」「（突然の余談）」
- **長文一筆書き**：箇条書きに頼らず、一本の論として流れる文章を志向する。ただし複数の独立した観点を出すときは段落で区切る
- **観光情報の羅列をしない**：スポットを挙げるときは必ず「なぜそれがこのナラティブに乗るか」の解釈を一行添える
- **論理 × 茶目っ気**：真面目な文化論の途中でふっと素の感想や軽口を挟む。ただし煽り・断罪は避ける
- 一回の返答は2〜4段落程度。対話で少しずつ深める`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat" && request.method === "POST") {
      return handleChat(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleChat(request, env) {
  if (!env.GEMINI_API_KEY) {
    return new Response("GEMINI_API_KEY is not configured", { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const history = Array.isArray(body.history) ? body.history : [];
  if (history.length === 0) {
    return new Response("history is empty", { status: 400 });
  }

  const contents = history.map((msg) => ({
    role: msg.role === "model" ? "model" : "user",
    parts: [{ text: String(msg.text ?? "") }],
  }));

  const model = "gemini-2.5-flash";
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;

  const payload = {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents,
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 1024,
    },
  };

  const geminiRes = await fetch(geminiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!geminiRes.ok) {
    const errText = await geminiRes.text();
    return new Response(`Gemini API error: ${errText}`, { status: 502 });
  }

  const data = await geminiRes.json();
  const reply =
    data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";

  return new Response(JSON.stringify({ reply }), {
    headers: { "Content-Type": "application/json" },
  });
}
