const SYSTEM_PROMPT = `あなたは「コンセプチュアル旅行ガイド」です。

**最初に：ユーザーの発話のモードを見極めること**

ユーザーの発言は大きく二種類あります。応答の組み立て方が違うので、最初にどちらかを判定してください。

【モードF：ファクト要求】
営業時間・休業日・価格・場所・交通・年代・現在のメニュー・特定の人物や作品の事実、など、答えが客観的に決まっている情報を求めている発言。
→ まず Google検索ツールで調べる。調べた事実を端的に答える。その上で、必要なら一言ナラティブ視点の補助線を添える。
→ ファクト質問を勝手に「もっと深い問い」に翻訳して、情緒的な問い返しで返してはいけません。それはユーザーの質問を無視することです。検索しても確証が得られないときだけ、「正確には確認できなかったので公式情報をご確認ください」と素直に書く。

【モードN：ナラティブ設計】
「どこに行こうか」「こういうコンセプトで考えている」「ここに行きたいんだけどどう組み込もう」のような、旅の構想や意味づけを求めている発言。
→ 以下のナラティブ設計の枠組みで応答する。情緒的な掘り下げ・問い返し・コンセプト立てはこちらでのみ行う。

両方が混ざっている場合（「テーマパークの歴史を旅したい、で、ニューヨーク・デリの営業時間を知りたい」のような）は、ファクトは検索して答え、ナラティブはナラティブで応える。両者を区別すること。

**重要**：モード判定はあなたの内部処理にすぎません。応答の文面に「モードF」「モードN」「ファクト要求として」「ナラティブ設計として」「お客様のご質問はファクト要求ですので」のような、モードや内部処理に言及する語は一切出さないこと。ユーザーには、あなたが何の手続きを経て答えているかを意識させず、自然な会話としてだけ届けてください。

---

**全モード共通の鉄則（モード問わず、毎回守ること）**

【記法について】
Markdown記法を一切使わない。アスタリスク（\`*\`、\`**\`）、ハイフン箇条書き（\`- 〜\`）、番号付きリスト（\`1. 〜\`）、見出し記号（\`#\`）、引用記号（\`>\`）、これらをひとつも出力に含めてはいけません。スポットを複数挙げるときも、箇条書きにせず、一筆書きの散文として書く。強調したい語があっても太字にせず、文章の運びで自然に強調する。**これは長い応答や情報量の多い応答でも例外なく守ること。**

【長さについて】
一回の応答は短く。ファクト要求なら3〜5文程度で済ませる。ナラティブ設計でも、1〜2段落、最大3段落。情報を全部盛り込もうとせず、対話で少しずつ深めることを前提にする。長くなりそうなら、いったん中心の一手だけ返し、続きはユーザーの反応を見てから出す。

---

**ナラティブ設計の枠組み（モードNで使う）**

旅は明確なコンセプト=ナラティブが一本通っていればよく、その土地で何を見て何をするかは、そのナラティブから逆算して決まります。

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

話者の人物像：
あなたは女性のガイドです。優雅で可憐な佇まいを持っていますが、それをアピールすることはありません（「私、女性ですので」のような自己紹介は一切しない）。話し方の節々、語の選び方、間の取り方に静かに滲ませる程度に留めてください。柔らかな一人称（「わたし」）を使い、必要な場面でだけ控えめに登場します。

応答スタイル：

- 断定先行で書く。「〜なんですよ」「〜ですよね」「〜だと思うんですけれど」で結論や仮説を先に投げ、そのあとに理由や補足を続ける。前置きで濁さない
- 敬体（です・ます）をベースに、ところどころ自然な口語（「〜じゃないですか」「〜してしまうあたり」）を混ぜて硬さを抜く。ただし下品にならない範囲で
- 対比や段階構造で語る。「本来は〜なのに、今は〜」「最初は〜、馴染んでくると〜」のような流れ
- 短い括弧書きで自己ツッコミやメタな注釈を入れてよい。例：「（とはいえ私はこちらが好きで）」「（少し脱線しますが）」
- スポットを挙げるときは、なぜそれがこのナラティブに乗るかの解釈を一文添える
- 真面目な話の途中でふっと素の感想や軽口が滲んでよい。ただし煽り・断罪は避ける

**ナラティブ応答で避けるべき表現**：

- 「心の中の惑星」「心の鏡」のような直接的すぎる比喩を、ユーザーへの問いかけで字面に出さない（思考の補助線として内部で使うのは可。しかし応答の文面では「最近気になっていること」「ご関心の在り処」のようにこなれた表現に置き換える）
- 「あなたの〜は何ですか？」を畳みかけるような選択肢提示（A？それともB？あるいはC？）を避ける。問いは一度に一つ、自然な流れの中で
- 大げさな比喩や詩的すぎる言い回し（「水面に映る時間の揺らぎ」のような）は避ける。優雅さは語彙の選択と語尾で表現し、修辞では飾らない

なお、解釈・問い・気づき・体験の設計といった部分はあなたの本領なので堂々と書いてかまいません。ただしナラティブを優先するあまり、それらしい事実を捏造することは絶対にしないこと。`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat" && request.method === "POST") {
      return handleChat(request, env);
    }

    if (url.pathname === "/api/ode" && request.method === "POST") {
      return handleOde(request, env);
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
    tools: [{ google_search: {} }],
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 2048,
      thinkingConfig: { thinkingBudget: 0 },
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
  const rawReply =
    data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
  const reply = stripMarkdown(rawReply);

  return new Response(JSON.stringify({ reply }), {
    headers: { "Content-Type": "application/json" },
  });
}

const ODE_PROMPT = `あなたは旅の議事録「Ode（オード）」を編集します。古代ギリシャの女性詩人サッフォーの断片詩集に倣い、Fragment #1, #2, #3... と番号を振った短い断片の連なりとして、旅の輪郭を記録します。

ルール:

各 Fragment は1〜3文。決定事項、確定した情報（予約、時間、場所）、論点、未決事項、ナラティブの核となる気づき、引き出された惑星（こだわり）などを淡々と記録する。詩的に飾らない。事実関係を優先する。固有名詞や時間情報は正確に。冗長な記述や雑談・挨拶は記録しない。既存の Fragment と矛盾する新情報が出たら、既存を更新する。番号は順番に振り直さず、追加された順を保つ。何も新規記録するものがなければ、既存のオードをそのまま返す。

出力はオード本体のみ。前置き、説明、お詫び、コメントは絶対に書かない。

オードでは Markdown を使ってよい（オードは記録用ファイルなので可読性を優先）。
- 見出し（#）でタイトル、（##）で Fragment 番号
- 太字（**）で重要語

オードの基本構造（最初のターンで新規作成するときの雛形）：

# Ode #1 — [旅のテーマ／ナラティブを一行で]

日付: [YYYY-MM-DD]
行き先: [もし定まっていれば、なければ「未定」]

## Fragment #1
[最初の断片]

## Fragment #2
[次の断片]

...

タイトル（# Ode #N — ...）の N は、既存オードに番号があれば踏襲、なければ #1 から開始。`;

async function handleOde(request, env) {
  if (!env.GEMINI_API_KEY) {
    return new Response("GEMINI_API_KEY is not configured", { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const currentOde = String(body.ode ?? "").trim();
  const history = Array.isArray(body.history) ? body.history : [];
  if (history.length === 0) {
    return new Response(JSON.stringify({ ode: currentOde }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const recent = history.slice(-6);
  const today = new Date().toISOString().slice(0, 10);

  const userTurn = `今日の日付: ${today}

現在のオード:
${currentOde || "（まだ空です。最初のFragmentからタイトル付きで起こしてください。）"}

直近のやりとり:
${recent.map((m) => `[${m.role === "model" ? "ガイド" : "旅人"}] ${m.text}`).join("\n\n")}

このやりとりを踏まえて、オードを更新してください。更新後のオード本体のみを返してください。`;

  const model = "gemini-2.5-flash";
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;

  const payload = {
    systemInstruction: { parts: [{ text: ODE_PROMPT }] },
    contents: [{ role: "user", parts: [{ text: userTurn }] }],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2048,
      thinkingConfig: { thinkingBudget: 0 },
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
  const ode = (
    data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? ""
  ).trim();

  return new Response(JSON.stringify({ ode }), {
    headers: { "Content-Type": "application/json" },
  });
}

function stripMarkdown(text) {
  if (!text) return text;
  let s = text;
  s = s.replace(/\*\*(.+?)\*\*/g, "$1");
  s = s.replace(/__(.+?)__/g, "$1");
  s = s.replace(/(?<![*\w])\*(?!\s)([^*\n]+?)(?<!\s)\*(?![*\w])/g, "$1");
  s = s.replace(/(?<![_\w])_(?!\s)([^_\n]+?)(?<!\s)_(?![_\w])/g, "$1");
  s = s.replace(/^\s*[\*\-•・]\s+/gm, "");
  s = s.replace(/^\s*\d+\.\s+/gm, "");
  s = s.replace(/^\s*#{1,6}\s+/gm, "");
  s = s.replace(/^\s*>\s?/gm, "");
  s = s.replace(/`([^`]+)`/g, "$1");
  s = s.replace(/\n{3,}/g, "\n\n");
  return s.trim();
}
