const chat = document.getElementById("chat");
const form = document.getElementById("input-form");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");

const history = [];

function addBubble(role, text, opts = {}) {
  const div = document.createElement("div");
  div.className = `bubble ${role}`;
  if (opts.thinking) div.classList.add("thinking");
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

addBubble(
  "bot",
  "どこに行く予定？まだ決まってないなら、今の気分や、心に引っかかっている場所を教えて。",
);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  addBubble("user", text);
  history.push({ role: "user", text });
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
      throw new Error(err || `HTTP ${res.status}`);
    }

    const data = await res.json();
    const reply = data.reply ?? "(空の応答)";

    thinking.remove();
    addBubble("bot", reply);
    history.push({ role: "model", text: reply });
  } catch (err) {
    thinking.remove();
    addBubble("bot", `エラー: ${err.message}`);
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
