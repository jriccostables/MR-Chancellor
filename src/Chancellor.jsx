import { useState, useRef, useEffect } from "react";

const IMG = "https://i.imgur.com/J1YBkMK.png";

export default function Chancellor() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (txt) => {
    const text = (txt || input).trim();
    if (!text || loading) return;
    const userMsg = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);
    try {
      const key = import.meta.env.VITE_ANTHROPIC_API_KEY;
      if (!key) throw new Error("No API key");
   const res = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    system: "You are Mr. Chancellor, a distinguished professor horse expert in harness and Thoroughbred racing. Speak warmly, cite legends like Billy Haughton and George Brennan, and prefer natural horsemanship over drugs.",
    messages: updated
  })
});
        })
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("") || "Error";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages(prev => prev.slice(0, -1));
      alert("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#1a1410", color: "#e8dcc8", fontFamily: "Georgia, serif", padding: "20px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <img src={IMG} style={{ width: "180px", borderRadius: "12px", marginBottom: "20px" }} alt="Mr. Chancellor" />
            <h1 style={{ color: "#c9a84c", fontSize: "36px", marginBottom: "10px" }}>Mr. Chancellor</h1>
            <p style={{ color: "#8a7a5a", marginBottom: "30px" }}>Distinguished Professor of Equine Arts</p>
            <div style={{ display: "grid", gap: "10px", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
              {["How do great drivers rate a horse?", "What did Billy Haughton teach us?", "Explain the two-hole strategy", "Your thoughts on modern trainers and drugs?"].map(q => (
                <button key={q} onClick={() => send(q)} style={{ background: "#2a2015", border: "1px solid #c9a84c", borderRadius: "8px", padding: "12px", color: "#c9a84c", cursor: "pointer", textAlign: "left" }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: "20px", display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "75%", background: m.role === "user" ? "#2c4a1e" : "#2a2015", border: "1px solid " + (m.role === "user" ? "#4a8a32" : "#c9a84c"), borderRadius: "12px", padding: "12px", color: "#e8dcc8" }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <div style={{ color: "#c9a84c" }}>Mr. Chancellor is thinking...</div>}
            <div ref={endRef} />
          </div>
        )}
        <div style={{ position: "sticky", bottom: 0, background: "#1a1410", paddingTop: "20px" }}>
          <div style={{ display: "flex", gap: "10px", background: "#2a2015", border: "1px solid #c9a84c", borderRadius: "12px", padding: "10px" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") send(); }}
              placeholder="Ask Mr. Chancellor..."
              style={{ flex: 1, background: "transparent", border: "none", color: "#e8dcc8", fontSize: "15px", outline: "none" }}
            />
            <button onClick={() => send()} disabled={loading} style={{ background: "#c9a84c", border: "none", borderRadius: "8px", padding: "8px 16px", cursor: "pointer" }}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
