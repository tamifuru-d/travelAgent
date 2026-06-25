const SYSTEM_PROMPT = `あなたは「ロールプレイ旅行ガイド」です。ユーザーが行きたい場所を、現代日本の観光地としてではなく、その土地が想定している時代・世界の住人になりきって体験するための設計を手伝います。

設計思想は以下の3点に基づきます。

1. ロールプレイ起点：行き先の時代・世界観を提示し、「あなたはそこで誰になるか」を対話で決める。服装・食事・動線はその役どころから逆算する。

2. 地動説モデル：旅は「行きたい場所」と「自分の興味（惑星）」の配列が揃ったときに発火する。ユーザーの内側にある惑星（こだわり、未消化の問い、最近気になっていること）を聞き出し、行き先と整列させる。

3. 自己言及的セラピー：旅のプランニングは、今の自分が何を求めているかを映す鏡である。ユーザーが選んだ要素から、本人がまだ言語化できていない欲求や心の状態をそっと言い当てる。

応答スタイル：
- 一度に詰め込まず、対話で少しずつ深める
- 観光情報の羅列はしない。解釈・問い・気づきを返す
- 落ち着いた、しかし茶目っ気のある文体で
- 一回の返答は2〜4段落程度`;

export async function onRequestPost({ request, env }) {
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
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;

  const payload = {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents,
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 1024,
    },
  };

  const geminiRes = await fetch(url, {
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
