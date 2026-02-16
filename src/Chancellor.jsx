import { useState, useRef, useEffect, useCallback } from "react";

const IMG = "https://i.imgur.com/J1YBkMK.png";

function useVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => window.speechSynthesis.cancel();
  }, []);

  const getBest = useCallback(() => {
    const priority = ["Google UK English Male", "Daniel", "Arthur", "Gordon"];
    for (const name of priority) {
      const v = voices.find(v => v.name.includes(name));
      if (v) return v;
    }
    return voices.find(v => v.lang === "en-GB") || voices.find(v => v.lang.startsWith("en")) || voices[0];
  }, [voices]);

  const speak = useCallback((text) => {
    if (!enabled || !text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voice = getBest();
    if (voice) u.voice = voice;
    u.rate = 0.82;
    u.pitch = 0.76;
    u.volume = 1.0;
    u.lang = "en-GB";
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    setTimeout(() => window.speechSynthesis.speak(u), 100);
  }, [enabled, getBest]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { isSpeaking, enabled, setEnabled, speak, stop };
}

export default function Chancellor() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const { isSpeaking, enabled, setEnabled, speak, stop } = useVoice();

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (txt) => {
    const text = (txt || input).trim();
    if (!text || loading) return;
    stop();
    const userMsg = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: "You are Mr. Chancellor, a distinguished professor horse. Speak warmly about Billy Haughton, George Brennan, and true horsemanship.",
          messages: updated
        })
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("") || "Error";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      if (enabled) speak(reply);
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h1 style={{ color: "#c9a84c", fontSize: "28px" }}>Mr. Chancellor</h1>
          <button onClick={() => { setEnabled(!enabled); stop(); }} style={{ background: enabled ? "#c9a84c" : "#555", border: "none", borderRadius: "8px", padding: "8px 16px", cursor: "pointer", color: "#1a1410" }}>
            {enabled ? "🔊 Voice On" : "🔇 Voice Off"}
          </button>
        </div>

        {messages.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <img src={IMG} style={{ width: "180px", borderRadius: "12px", marginBottom: "20px", boxShadow: isSpeaking ? "0 0 30px rgba(201,168,76,0.8)" : "0 8px 30px rgba(201,168,76,0.3)", transition: "box-shadow 0.3s" }} alt="Mr. Chancellor" />
            <p style={{ color: "#8a7a5a", marginBottom: "30px" }}>Distinguished Professor of Equine Arts</p>
            <div style={{ display: "grid", gap: "10px", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
              {["How do great drivers rate a horse?", "What did Billy Haughton teach us?", "Explain the two-hole strategy", "Your thoughts on modern trainers?"].map(q => (
                <button key={q} onClick={() => send(q)} style={{ background: "#2a2015", border: "1px solid #c9a84c", borderRadius: "8px", padding: "12px", color: "#c9a84c", cursor: "pointer", textAlign: "left" }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "75%", background: m.role === "user" ? "#2c4a1e" : "#2a2015", border: "1px solid " + (m.role === "user" ? "#4a8a32" : "#c9a84c"), borderRadius: "12px", padding: "12px", color: "#e8dcc8" }}>
                    {m.content}
                  </div>
                </div>
                {m.role === "assistant" && (
                  <div style={{ textAlign: "left", marginTop: "5px" }}>
                    <button onClick={() => speak(m.content)} style={{ background: "none", border: "none", color: "#c9a84c", cursor: "pointer", fontSize: "12px" }}>
                      🔈 Hear this
                    </button>
                  </div>
                )}
              </div>
            ))}
            {loading && <div style={{ color: "#c9a84c" }}>{isSpeaking ? "🔊 Speaking..." : "Mr. Chancellor is thinking..."}</div>}
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
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
