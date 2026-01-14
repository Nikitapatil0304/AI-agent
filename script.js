// 🔑 Add your Gemini API key here
const GEMINI_API_KEY ="AIzaSyDXv8yjEEmpB35ws9VUHahgOJ0Xd1wsX8I";

let memory = JSON.parse(localStorage.getItem("ai_memory") || "[]");

/* Voice Input */
function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Voice not supported in this browser");
    return;
  }

  const rec = new SpeechRecognition();
  rec.lang = "en-US";

  rec.onresult = e => {
    document.getElementById("input").value = e.results[0][0].transcript;
  };

  rec.start();
}

/* Run AI Agent */
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
        body: JSON.stringify({ contents: [{ parts: [{ text: input }] }] })
      }
    );

    const data = await res.json();

    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "AI did not return a response 😢";

    memory.push("You: " + input);
    memory.push("AI: " + answer);
    if (memory.length > 20) memory.shift(); // keep last 10 exchanges
    localStorage.setItem("ai_memory", JSON.stringify(memory));

    output.innerHTML = memory.join("<br>");
    document.getElementById("input").value = "";
  } catch (err) {
    console.error(err);
    output.innerText = "Error connecting to AI ❌";
  }
}

/* Clear memory */
function clearMemory() {
  memory = [];
  localStorage.clear();
  document.getElementById("output").innerText = "Memory cleared 🧠";
}

