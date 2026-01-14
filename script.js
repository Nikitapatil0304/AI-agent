const GEMINI_API_KEY = "AIzaSyDXv8yjEEmpB35ws9VUHahgOJ0Xd1wsX8I";

let memory = JSON.parse(localStorage.getItem("ai_memory") || "[]");

/* 🎤 Voice Input */
function startVoice() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice not supported in this browser");
    return;
  }

  const rec = new SpeechRecognition();
  rec.lang = "en-US";

  rec.onresult = e => {
    document.getElementById("input").value =
      e.results[0][0].transcript;
  };

  rec.start();
}

/* 🤖 AI Agent */
async function runAgent() {
  const input = document.getElementById("input").value.trim();
  const output = document.getElementById("output");

  if (!input) {
    output.innerText = "Please type something 🙂";
    return;
  }

  output.innerText = "Thinking... 🤔";

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: input }] }]
        })
      }
    );

    const data = await res.json();

    const answer =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI 😢";

    memory.push(input);
    if (memory.length > 5) memory.shift();
    localStorage.setItem("ai_memory", JSON.stringify(memory));

    output.innerHTML = `
      <b>🤖 AI Response:</b><br><br>
      ${answer}
      <hr>
      <b>🧠 Memory:</b><br>
      ${memory.join("<br>")}
    `;
  } catch (err) {
    console.error(err);
    output.innerText = "Error connecting to AI ❌";
  }
}

/* 🧠 Clear Memory */
function clearMemory() {
  memory = [];
  localStorage.clear();
  document.getElementById("output").innerText =
    "Memory cleared 🧠";
}

