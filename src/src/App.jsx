import { useState, useRef, useEffect, useCallback } from "react";

const CHANCELLOR_IMAGE_URL = "https://i.imgur.com/J1YBkMK.png";

const CHANCELLOR_SYSTEM = `You are Mr. Chancellor — a distinguished, wise, and wonderfully witty professor horse who has spent a lifetime in and around the world of harness racing and thoroughbred racing. You speak with the warmth, authority, and gentle humor of a beloved professor who has seen everything the horse world has to offer.

YOUR PERSONALITY:
- Wise, warm, distinguished, and gently humorous with a BIG personality and great attitude
- You speak in beautifully crafted sentences — never rushed, always thoughtful
- You love telling stories from "your racing days" and referencing the great horsemen
- You quote and reference legends: Billy Haughton, Stanley Dancer, Del Miller, Herve Filion, John Campbell, Bill O'Donnell, Ron Waples, George Brennan
- You have STRONG passionate opinions about TRUE horsemanship vs. modern shortcuts
- You believe horses should be trained with patience, feel, and care — NOT drugs and needles
- You are witty and warmly sarcastic about modern trainers who've forgotten the old ways
- You say things like "Ah, now THAT is an excellent question, my young friend!" or "Ha-HA! Now we're talking!"
- You make occasional horse puns with a dignified chuckle — "Neigh, neigh, that's not quite right!"
- You address everyone as "my young friend" or "my dear student"
- You reference your fictional racing career at Roosevelt Raceway, Yonkers, The Meadowlands, Saratoga
- You end key points with "...and that, my young friend, is something no syringe can teach you."
- You get genuinely EXCITED about great horses, great drives, great races — infectious enthusiasm
- When asked about George Brennan, speak with great admiration — one of the truly gifted drivers of his generation, a horseman with genuine feel
- You have a wonderful laugh — "Ha-HA!" or "Oh ho ho!"
- Keep responses rich and conversational — not too long. Like a great professor who knows when to stop.
- You are NEVER boring. Every answer has personality, color, and life.

YOUR KNOWLEDGE (encyclopedic):
- Complete harness racing: standardbreds, trotters vs pacers, sulky/bike, all major tracks and circuits
- Thoroughbred racing: all major races, bloodlines, training, jockeys, trainers
- Old school training philosophy: jogging miles, reading your horse, feel over formula
- Driving strategy: rating horses, sitting cover, two-hole strategy, pace scenarios, trip intelligence
- The great drivers and what made each one special
- Medications: Lasix, Bute, joint injections, HISA regulations — always preferring natural horsemanship
- Veterinary: lameness, soundness, reading legs, natural therapies
- Nutrition, breeding, pedigree, betting, handicapping, troubled trips, class drops, driver changes, post positions
- Famous horses, famous races, history of the sport

SPEAKING STYLE EXAMPLES:
- "Ah, Furosemide — or as we called it in my day at Roosevelt, the great crutch. Now settle in my young friend..."
- "Billy Haughton used to say a horse tells you everything — if you're willing to listen. Most modern trainers have stopped listening. Tragic, really."
- "Ha-HA! NOW we're asking the right questions! Pull up a chair!"
- "George Brennan — now THERE is a driver with genuine feel. The horse relaxes the moment he picks up the lines. A rare gift."

For children: simpler, warmer, more playful language. Make it magical and fun.
NEVER break character. You are Mr. Chancellor. Always have been. Always will be.`;

const SUGGESTED = [
  { q: "Mr. Chancellor, how do great drivers like George Brennan rate a horse in a race?", icon: "🏇" },
  { q: "What did Billy Haughton teach us about training young horses the right way?", icon: "📚" },
  { q: "How do I spot a horse with a troubled trip who deserves another chance?", icon: "🔍" },
  { q: "What's your opinion on modern trainers who rely on drugs instead of horsemanship?", icon: "💊" },
  { q: "Explain the two-hole strategy in harness racing please", icon: "🎯" },
  { q: "What should I look for in the post parade before a big race?", icon: "👁️" },
  { q: "Tell me about the greatest harness horses you ever witnessed race", icon: "🏆" },
  { q: "How do I read a past performance line for a harness race?", icon: "📊" },
];

function useChancellorVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voices, setVoices] = useState([]);
  useEffect(() => {
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => window.speechSynthesis.cancel();
  }, []);
  const getBestVoice = useCallback(() => {
    const priority = ["Google UK English Male","Microsoft George Online (Natural) - English (United Kingdom)","Microsoft George - English (United Kingdom)","Daniel","Arthur","Gordon","Malcolm"];
    for (const name of priority) {
      const v = voices.find(v => v.name.includes(name));
      if (v) return v;
    }
    return voices.find(v => v.lang === "en-GB") || voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("male")) || voices.find(v => v.lang.startsWith("en")) || voices[0];
  }, [voices]);
  const speak = useCallback((text) => {
    if (!voiceEnabled || !text) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1").replace(/#{1,6}\s/g, "").replace(/Ha-HA!/g, "Ha, HA!").replace(/Oh ho ho!/g, "Oh, ho ho!").trim();
    const u = new SpeechSynthesisUtterance(clean);
    const voice = getBestVoice();
    if (voice) u.voice = voice;
    u.rate = 0.82;
    u.pitch = 0.76;
    u.volume = 1.0;
    u.lang = "en-GB";
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    setTimeout(() => window.speechSynthesis.speak(u), 120);
  }, [voiceEnabled, getBestVoice]);
  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);
  return { isSpeaking, voiceEnabled, setVoiceEnabled, speak, stop };
}

function MrChancellor({ isThinking, isSpeaking }) {
  const active = isThinking || isSpeaking;
  return (<div style={{ width: "100%", height: "100%", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}><img src={CHANCELLOR_IMAGE_URL} alt="Mr. Chancellor" style={{ width: "100%", height: "100%", objectFit: "contain", filter: active ? "drop-shadow(0 0 22px rgba(201,168,76,0.95)) drop-shadow(0 0 44px rgba(201,168,76,0.45))" : "drop-shadow(0 6px 22px rgba(0,0,0,0.65))", transform: isSpeaking ? "scale(1.04)" : "scale(1)", transformOrigin: "bottom center", transition: "all 0.35s ease" }} />{isSpeaking && <>{["-4px","−14px","-24px"].map((offset, i) => (<div key={i} style={{ position: "absolute", inset: offset, borderRadius: "14px", border: `${2 - i * 0.5}px solid rgba(201,168,76,${0.6 - i * 0.2})`, animation: `ring 1.4s ease-out infinite ${i * 0.35}s`, pointerEvents: "none" }} />))}</>}{isThinking && !isSpeaking && (<div style={{ position: "absolute", top: 0, right: "-5px", fontSize: "20px", animation: "floatThought 1s ease-in-out infinite alternate" }}>💭</div>)}</div>);
}

function SoundBars() {
  return (<div style={{ display: "flex", gap: "3px", alignItems: "center", height: "18px" }}>{[6, 12, 8, 14, 6, 10, 8].map((h, i) => (<div key={i} style={{ width: "3px", background: "#c9a84c", borderRadius: "2px", height: `${h}px`, animation: `soundBar 0.${5 + i}s ease-in-out infinite alternate`, animationDelay: `${i * 0.08}s` }} />))}</div>);
}

function Message({ msg, onSpeak, isCurrentlySpeaking }) {
  const isUser = msg.role === "user";
  return (<div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: "22px", gap: "11px", alignItems: "flex-start" }}>{!isUser && (<div style={{ width: "38px", height: "38px", borderRadius: "50%", flexShrink: 0, marginTop: "4px", background: "linear-gradient(135deg,#8B7355,#5a4a35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", border: "2px solid #c9a84c", boxShadow: "0 2px 10px rgba(201,168,76,0.3)" }}>🎓</div>)}<div style={{ maxWidth: "78%" }}>{!isUser && (<div style={{ fontSize: "10px", color: "#c9a84c", fontFamily: "'Cinzel', serif", letterSpacing: "2px", marginBottom: "5px" }}>PROFESSOR CHANCELLOR</div>)}<div style={{ background: isUser ? "linear-gradient(135deg,#2c1810,#4a2c1a)" : "rgba(245,240,232,0.05)", border: isUser ? "1px solid rgba(139,69,19,0.6)" : "1px solid rgba(201,168,76,0.2)", borderRadius: isUser ? "16px 16px 4px 16px" : "4px 16px 16px 16px", padding: "14px 18px", color: isUser ? "#f5e6d0" : "#e8dcc8", fontSize: "15px", lineHeight: "1.8", fontFamily: "'Lora', Georgia, serif", boxShadow: "0 4px 18px rgba(0,0,0,0.35)", whiteSpace: "pre-wrap" }}>{msg.content}</div>{!isUser && (<button onClick={() => onSpeak(msg.content)} style={{ background: "none", border: "none", cursor: "pointer", color: isCurrentlySpeaking ? "#c9a84c" : "#5a4535", fontSize: "12px", fontFamily: "'Lora',serif", fontStyle: "italic", marginTop: "5px", padding: "3px 6px", display: "flex", alignItems: "center", gap: "5px", transition: "color 0.2s" }}>{isCurrentlySpeaking ? <><SoundBars /> Speaking...</> : <>🔈 Hear Mr. Chancellor</>}</button>)}</div>{isUser && (<div style={{ width: "38px", height: "38px", borderRadius: "50%", flexShrink: 0, marginTop: "4px", background: "linear-gradient(135deg,#2c1810,#4a2c1a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", border: "2px solid rgba(139,69,19,0.5)" }}>🎩</div>)}</div>);
}

function TypingIndicator() {
  const phrases = ["Consulting the racing archives...","Adjusting spectacles thoughtfully...","Pondering with great deliberation...","Drawing from decades of wisdom...","Recalling my days at The Meadowlands..."];
  const [phrase] = useState(() => phrases[Math.floor(Math.random() * phrases.length)]);
  return (<div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 18px" }}><span style={{ color: "#7a6a4a", fontFamily: "'Lora',serif", fontSize: "13px", fontStyle: "italic" }}>{phrase}</span>{[0,1,2].map(i => (<div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#c9a84c", animation: `bounce 1.2s ease-in-out ${i*0.2}s infinite` }} />))}</div>);
}
