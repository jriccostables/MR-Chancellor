import { useState, useRef, useEffect, useCallback } from "react";

const IMG = "https://i.imgur.com/J1YBkMK.png";

function useVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [enabled, setEnabled] = useState(true);

  const speak = useCallback((text) => {
    if (!enabled || !text) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(true);
    
const cleanText = text
  .replace(/\*\*/g, '')
  .replace(/##/g, '')
  .replace(/\*/g, '')
  .replace(/(\d+)\/(\d+)/g, '$1 to $2')
  .replace(/(\d+)-(\d+)/g, '$1 to $2')
  .replace(/mares/gi, 'mairs')
  .replace(/F&M/g, 'fillies and mairs');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.05;
    utterance.volume = 1.0;
    utterance.lang = "en-US";
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 100);
  }, [enabled]);

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
          system: "You are Mr. Chancellor, a distinguished professor horse expert in harness and Thoroughbred racing with encyclopedic knowledge of both history and modern racing.\n\nCURRENT TOP DRIVERS you discuss: Yannick Gingras, Dave Miller, Dexter Dunn, Tim Tetrick, Brian Sears, Scott Zeron, Jason Bartlett, George Brennan, David Miller, James MacDonald, Travis Henry, Matt Kakaley, Andrew McCarthy, Joe Bongiorno, Jordan Stratton, Marcus Miller.\n\nLEGENDS you reference for context: Billy Haughton, Stanley Dancer, Del Miller, Herve Filion, John Campbell, Bill O'Donnell, Ron Waples, Dave Palone.\n\nMODERN RACING TACTICS:\n- Bottom out the field: Pushing early pace to wear down speed horses\n- Cutting the mile: Controlling fractions to save energy for stretch\n- Rating a horse: Finding optimal cruising speed, balancing speed with stamina\n- Passing lanes: Modern wider tracks allow multiple passing routes\n- First-over vs sitting cover: When to make your move\n- Pocket strategies: Getting out at the right time\n- Post position advantages on different tracks\n\nFARRIERY & SOUNDNESS (CRITICAL):\n- Ian McKinley: Elite farrier for both Thoroughbred and harness, his shoeing can make or break a horse's career\n- Proper shoeing affects balance, breakover, traction, and can prevent/treat injuries\n- Bar shoes, toe grabs, rim shoes, wedges - each serves specific purposes\n- Spotting lameness early: Watch for head bob, shortened stride, resistance to turn, heat in legs\n- Dialing in soundness: Daily leg reading, ice, wraps, controlled work, knowing when to back off\n\nMODERN EQUIPMENT: New race bikes are lighter, more aerodynamic, give drivers better control and horses can pull them more efficiently.\n\nDRUGS REALITY: Sadly, performance-enhancing drugs do make horses go faster in the short term, but true horsemen know this shortcuts proper training and often leads to breakdowns. You advocate for clean racing and natural horsemanship.\n\nMODERN TRACKS: Meadowlands (gold standard), Yonkers (tight turns), Woodbine Mohawk, Pocono, Harrah's Philadelphia, The Downs at Mohegan Sun.\n\nWEB SEARCH FOR ENTRIES & RESULTS:\nWhen asked about current races, entries, or results:\n- Start by searching 'site:racing.ustrotting.com waag' to see which tracks are racing today\n- The WAAG page (racing.ustrotting.com/waag.aspx) shows all tracks racing with direct links to FREE entries and results\n- For specific track entries: Search 'site:racing.ustrotting.com entries [track name]'\n- For specific track results: Search 'site:racing.ustrotting.com results [track name]'\n- Always mention the specific track name (Yonkers, Meadowlands, Mohawk, Pocono, etc.)\n- These are FREE public resources - no subscription needed\n\nYou understand the sport has EVOLVED - faster times, better equipment, advanced training, but you still value old-school horsemanship: reading your horse daily, feel over drugs, patience, and partnership. Keep responses conversational, practical, and not too long.",
          messages: updated
        })
      });
      
      const data = await res.json();
      
      let reply = "";
      if (data.content && Array.isArray(data.content)) {
        reply = data.content
          .filter(block => block.type === "text")
          .map(block => block.text)
          .join("\n");
      }
      
      if (!reply) reply = "I apologize, but I'm having trouble responding right now.";
      
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
          <button onClick={() => { setEnabled(!enabled); stop(); }} style={{ background: enabled ? "#c9a84c" : "#555", border: "none", borderRadius: "8px", padding: "8px 16px", cursor: "pointer", color: "#1a1410", fontWeight: "bold" }}>
            {enabled ? "🔊 Voice On" : "🔇 Voice Off"}
          </button>
        </div>

        {messages.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <img src={IMG} style={{ width: "180px", borderRadius: "12px", marginBottom: "20px", boxShadow: isSpeaking ? "0 0 30px rgba(201,168,76,0.8)" : "0 8px 30px rgba(201,168,76,0.3)", transition: "box-shadow 0.3s" }} alt="Mr. Chancellor" />
            <p style={{ color: "#8a7a5a", marginBottom: "30px", fontStyle: "italic" }}>Distinguished Professor of Equine Arts & Racing Sciences</p>
            {isSpeaking && <p style={{ color: "#c9a84c", marginBottom: "20px" }}>🔊 Speaking...</p>}
            <div style={{ display: "grid", gap: "10px", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
              {["Analyze this race card for me", "How do I rate a horse's mile?", "My horse is off - help me spot what's wrong", "What's the two-hole strategy at Yonkers?"].map(q => (


                <button key={q} onClick={() => send(q)} style={{ background: "#2a2015", border: "1px solid #c9a84c", borderRadius: "8px", padding: "12px", color: "#c9a84c", cursor: "pointer", textAlign: "left", fontSize: "14px" }}>
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
                  <div style={{ maxWidth: "75%", background: m.role === "user" ? "#2c4a1e" : "#2a2015", border: "1px solid " + (m.role === "user" ? "#4a8a32" : "#c9a84c"), borderRadius: "12px", padding: "14px", color: "#e8dcc8", lineHeight: "1.6" }}>
                    {m.content}
                  </div>
                </div>
                {m.role === "assistant" && (
                  <div style={{ textAlign: "left", marginTop: "5px" }}>
                    <button onClick={() => speak(m.content)} style={{ background: "none", border: "none", color: "#c9a84c", cursor: "pointer", fontSize: "13px", fontStyle: "italic" }}>
                      🔈 Hear this again
                    </button>
                  </div>
                )}
              </div>
            ))}
            {loading && <div style={{ color: "#c9a84c", fontStyle: "italic" }}>{isSpeaking ? "🔊 Speaking..." : "Searching racing data..."}</div>}
            <div ref={endRef} />
          </div>
        )}

        <div style={{ position: "sticky", bottom: 0, background: "#1a1410", paddingTop: "20px" }}>
          <div style={{ display: "flex", gap: "10px", background: "#2a2015", border: "1px solid #c9a84c", borderRadius: "12px", padding: "10px" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") send(); }}
              placeholder="Ask about races, entries, results, or horse care..."
              style={{ flex: 1, background: "transparent", border: "none", color: "#e8dcc8", fontSize: "15px", outline: "none", fontStyle: "italic" }}
            />
            <button onClick={() => send()} disabled={loading} style={{ background: "#c9a84c", border: "none", borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontWeight: "bold" }}>
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
