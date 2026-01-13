const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"; // use GitHub Secrets while deploy

let memory = JSON.parse(localStorage.getItem("ai_mem") || "[]");

/* 🎤 Voice */
function startVoice() {
  const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  rec.lang = "en-US";
  rec.onresult = e => {
    document.getElementById("input").value = e.results[0][0].transcript;
  };
  rec.start();
}

/* 📄 File Upload */
document.getElementById("fileInput").addEventListener("change", e => {
  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById("input").value = reader.result.slice(0, 1000);
  };
  reader.readAsText(e.target.files[0]);
});

/* 🤖 GEMINI AI AGENT */
async function runAgent() {
  const input = document.getElementById("input").value;
  const mode = document.getElementById("mode").value;

  let prompt = input;

  if (mode === "shinchan")
    prompt = "Explain in Shinchan funny style: " + input;

  if (mode === "doraemon")
    prompt = "Explain like Doraemon using future gadgets: " + input;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );

  const data = await res.json();
  const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

  memory.push(input);
  if (memory.length > 10) memory.shift();
  localStorage.setItem("ai_mem", JSON.stringify(memory));

  document.getElementById("output").innerHTML =
    `<b>AI Response:</b><br>${answer}<hr>
     <b>Memory:</b><br>${memory.join("<br>")}`;
}

function clearMemory() {
  localStorage.clear();
  document.getElementById("output").innerText = "Memory cleared 🧠";
}
