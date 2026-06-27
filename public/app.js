const chat = document.getElementById("chat");
const form = document.getElementById("input-form");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");

const odeEl = document.getElementById("ode-content");
const odeNewBtn = document.getElementById("ode-new");
const odeOpenBtn = document.getElementById("ode-open");
const odeSaveMdBtn = document.getElementById("ode-save-md");
const odeSaveTxtBtn = document.getElementById("ode-save-txt");
const odeFileInput = document.getElementById("ode-file-input");
const odeStatus = document.getElementById("ode-status");

const history = [];
const ODE_KEY = "sappho:ode:current";
const HISTORY_KEY = "sappho:history:current";

function addBubble(role, text, opts = {}) {
  const div = document.createElement("div");
  div.className = `bubble ${role}`;
  if (opts.thinking) div.classList.add("thinking");
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

function friendlyError(status, body) {
  const text = String(body || "");
  if (text.includes("RESOURCE_EXHAUSTED") || text.includes("429") || status === 429) {
    const m = text.match(/retry in ([\d.]+)s/i);
    const wait = m ? `（およそ${Math.ceil(parseFloat(m[1]))}秒）` : "";
    return `今、少し混み合っているようです。少しだけ待ってからもう一度お試しいただけますか${wait}。`;
  }
  if (status === 401 || status === 403) {
    return "認証エラーです。管理者にお知らせください。";
  }
  if (text.includes("GEMINI_API_KEY")) {
    return "サーバー側の設定に問題があるようです。少し時間を置いてもう一度お試しください。";
  }
  return "うまくいきませんでした。少し時間を置いてからもう一度お試しください。";
}

function setOdeStatus(text, transient = false) {
  odeStatus.textContent = text;
  if (transient) {
    setTimeout(() => {
      if (odeStatus.textContent === text) odeStatus.textContent = "";
    }, 2500);
  }
}

(function restoreState() {
  const savedOde = localStorage.getItem(ODE_KEY);
  if (savedOde) odeEl.value = savedOde;
  try {
    const savedHistory = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    if (Array.isArray(savedHistory)) {
      for (const m of savedHistory) {
        if (m && typeof m.text === "string") {
          history.push(m);
          addBubble(m.role === "model" ? "bot" : "user", m.text);
        }
      }
    }
  } catch {}
})();

if (history.length === 0) {
  addBubble(
    "bot",
    "どこに行く予定？まだ決まってないなら、今の気分や、心に引っかかっている場所を教えて。",
  );
}

odeEl.addEventListener("input", () => {
  localStorage.setItem(ODE_KEY, odeEl.value);
});

odeNewBtn.addEventListener("click", () => {
  if (odeEl.value.trim() && !confirm("現在のオードを破棄して新規作成しますか？")) return;
  odeEl.value = "";
  localStorage.setItem(ODE_KEY, "");
  history.length = 0;
  localStorage.setItem(HISTORY_KEY, "[]");
  chat.innerHTML = "";
  addBubble(
    "bot",
    "新しいオードを始めましょう。どんな旅を考えていますか？",
  );
  setOdeStatus("新規オードを開始しました", true);
});

odeOpenBtn.addEventListener("click", () => odeFileInput.click());

odeFileInput.addEventListener("change", async () => {
  const file = odeFileInput.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    odeEl.value = text;
    localStorage.setItem(ODE_KEY, text);
    setOdeStatus(`${file.name} を読み込みました`, true);
  } catch (err) {
    setOdeStatus(`読み込み失敗: ${err.message}`);
  } finally {
    odeFileInput.value = "";
  }
});

function downloadBlob(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function odeToTxt(md) {
  let s = md;
  s = s.replace(/\*\*(.+?)\*\*/g, "$1");
  s = s.replace(/__(.+?)__/g, "$1");
  s = s.replace(/(?<![*\w])\*(?!\s)([^*\n]+?)(?<!\s)\*(?![*\w])/g, "$1");
  s = s.replace(/(?<![_\w])_(?!\s)([^_\n]+?)(?<!\s)_(?![_\w])/g, "$1");
  s = s.replace(/^\s*#{1,6}\s+/gm, "");
  s = s.replace(/^\s*[\*\-•・]\s+/gm, "");
  s = s.replace(/^\s*\d+\.\s+/gm, "");
  s = s.replace(/^\s*>\s?/gm, "");
  s = s.replace(/`([^`]+)`/g, "$1");
  return s;
}

function odeFilename(ext) {
  const date = new Date().toISOString().slice(0, 10);
  return `ode_${date}.${ext}`;
}

odeSaveMdBtn.addEventListener("click", () => {
  if (!odeEl.value.trim()) {
    setOdeStatus("オードがまだ空です", true);
    return;
  }
  downloadBlob(odeFilename("md"), odeEl.value, "text/markdown");
});

odeSaveTxtBtn.addEventListener("click", () => {
  if (!odeEl.value.trim()) {
    setOdeStatus("オードがまだ空です", true);
    return;
  }
  downloadBlob(odeFilename("txt"), odeToTxt(odeEl.value), "text/plain");
});

async function updateOde() {
  setOdeStatus("オードを更新中…");
  try {
    const res = await fetch("/api/ode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ode: odeEl.value, history }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("ode update failed:", err);
      setOdeStatus(friendlyError(res.status, err), true);
      return;
    }
    const data = await res.json();
    if (typeof data?.ode === "string" && data.ode.trim() !== odeEl.value.trim()) {
      odeEl.value = data.ode;
      localStorage.setItem(ODE_KEY, data.ode);
      setOdeStatus("オードを更新しました", true);
    } else {
      setOdeStatus("変更なし", true);
    }
  } catch (err) {
    setOdeStatus(`更新失敗: ${err.message}`, true);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  addBubble("user", text);
  history.push({ role: "user", text });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  input.value = "";
  sendBtn.disabled = true;

  const thinking = addBubble("bot", "考え中…", { thinking: true });

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(friendlyError(res.status, err));
    }

    const data = await res.json();
    const reply = data.reply ?? "(空の応答)";

    thinking.remove();
    addBubble("bot", reply);
    history.push({ role: "model", text: reply });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    updateOde();
  } catch (err) {
    console.error(err);
    thinking.remove();
    addBubble("bot", err.message);
  } finally {
    sendBtn.disabled = false;
    input.focus();
  }
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
    form.requestSubmit();
  }
});
