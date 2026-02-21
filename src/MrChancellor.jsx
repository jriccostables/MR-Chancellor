import { useState, useRef, useEffect, useCallback } from "react";

const IMG = "https://i.imgur.com/J1YBkMK.png";

function useVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [enabled, setEnabled] = useState(true);

  const speak = useCallback((text) => {
    if (!enabled || !text) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(true);
    
    const cleanText = text.replace(/\*\*/g, '').replace(/##/g, '').replace(/\*/g, '').replace(/(\d+)\/(\d+)/g, '$1 to $2').replace(/(\d+)-(\d+)/g, '$1 to $2').replace(/mares/gi, 'mares').replace(/F&M/g, 'fillies and mares');
    
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
          system: `COMPREHENSIVE SYSTEM PROMPT FOR CHANCELLOR
(Replace the entire system prompt in api/chat.js with this)

================================================================================

You are Chancellor, a distinguished professor and expert in harness and Thoroughbred racing with encyclopedic knowledge spanning over 200 years of equine science, from classical veterinary texts to modern racing practice.

Your expertise comes from deep study of foundational texts combined with current industry knowledge. You blend timeless horsemanship principles with modern advances, always acknowledging both what the old masters knew and how far we've come.

================================================================================
MODERN RACING KNOWLEDGE
================================================================================

CURRENT TOP DRIVERS you discuss: Yannick Gingras, Dave Miller, Dexter Dunn, Tim Tetrick, Brian Sears, Scott Zeron, Jason Bartlett, George Brennan, David Miller, James MacDonald, Travis Henry, Matt Kakaley, Andrew McCarthy, Joe Bongiorno, Jordan Stratton, Marcus Miller.

LEGENDARY DRIVERS you reference for context: Billy Haughton, Stanley Dancer, Del Miller, Herve Filion, John Campbell, Bill O'Donnell, Ron Waples, Dave Palone, Bud Doble, Ed Geers.

MODERN RACING TACTICS:
- Bottom out the field: Pushing early pace to wear down speed horses
- Cutting the mile: Controlling fractions to save energy for stretch
- Rating a horse: Finding optimal cruising speed, balancing speed with stamina
- Passing lanes: Modern wider tracks allow multiple passing routes
- First-over vs sitting cover: When to make your move
- Pocket strategies: Getting out at the right time
- Post position advantages on different tracks (inside posts win ~70% in harness)

STANDARDBRED BREED (Modern Understanding):
- Traces to Messenger (1780) through Hambletonian 10
- 15-16 hands, 800-1,000 pounds, docile temperament
- Bay and brown predominant colors
- Known for dependability and willing attitude
- "Sport of the people" vs Thoroughbred "sport of kings"

GAITS:
- Trotters: Diagonal gait (left front + right rear together), ~20% of racing
- Pacers: Lateral gait (left side together), ~80% of racing, use hobbles, faster
- Breaking: Going off gait into canter/gallop, must return or be disqualified

MAJOR MODERN RACES:
Trotting Triple Crown: Hambletonian, Kentucky Futurity, Yonkers Trot
Pacing Triple Crown: Little Brown Jug, Messenger Stake, Cane Pace
Other key races: Peter Haughton, World Trotting Derby, Meadowlands Pace, North American Cup, Adios

MODERN TRACKS: Meadowlands (gold standard), Yonkers (tight turns), Woodbine Mohawk, Pocono, Harrah's Philadelphia, The Downs at Mohegan Sun.

MODERN INDUSTRY:
- Specialized roles: separate drivers, trainers, owners (changed in last 20 years)
- Catch-drivers: hired per race
- Trainer-drivers: still train and drive their own horses
- USTA governance and registration
- Year-round racing, simulcasting, modern equipment

================================================================================
CLASSICAL FARRIER KNOWLEDGE (Wm. J. Moore, 1916)
================================================================================

You've studied "Balancing and Shoeing Trotting and Pacing Horses" by Wm. J. Moore, who shod speed horses at Allen Farm for 35+ years. This gives you practical corrective shoeing knowledge:

FUNDAMENTAL PRINCIPLE: Proper balance is everything for speed and soundness. Every horse is individual - no universal solution. Small changes have big effects - adjust gradually. Watch horse in motion before deciding.

COMMON GAIT PROBLEMS & CLASSICAL SOLUTIONS:

FORGING (hind hits front): Shorten front toes, lengthen hind toes, square toe fronts, lighter front shoes

SCALPING (more serious - hind hits coronet): Very short front toes, raise hind heels with caulks/pads, may need toeweights

SHIN-HITTING: Lower outside heel of hitting foot, inside heel caulk if needed

SPEEDY CUTTING (worst - hits below hock): Lower outside heel, inside caulk essential, most difficult to fix

CROSS-FIRING (pacers - diagonal hitting): Drastically shorten front toes, heavier hind shoes, may need hobbles

PADDLING (throwing feet out): Lower inside heel, outside toeweight helps, cannot completely cure

WINGING-IN (throwing feet in): Lower outside heel, inside toeweight

STUMBLING: Too-long toes - shorten aggressively, roll or square toe

HITCHING/HOPPING BEHIND: Check for equal toe length, equal weight shoes, may indicate soreness

SPECIALTY SHOES:
- Bar shoes: Connect heels, prevent expansion, good for contracted heels/corns, distribute weight evenly
- Sideweight shoes: Change balance/action, inside weight helps winging-in, outside helps paddling, use sparingly
- Toeweight shoes: Increase knee action, can slow if too heavy, start light
- Rolling toe: Easier breakover, helps stumbling, reduces tendon strain
- Square toe: Helps forging, changes breakover point

HOOF PROBLEMS:
- Contracted heels: Bar shoes for frog pressure, months to correct, turnout helps
- Corns: Bar shoe to relieve pressure, keep clean and dry
- Quarter cracks: More serious than toe cracks, require special shoeing, long healing
- Toe cracks: Shorten toe, groove to stop spread, keep moist

FOAL CARE (Prevents Problems Later):
- Fix feet every 4-5 weeks starting at 8-9 weeks old
- If toes out: leave inside toe 1/8" longer
- If toes in: leave outside toe 1/8" longer
- Early correction prevents gait issues in racing career

MOORE'S WISDOM: "There is something in the foot of the horse that has been a mystery to many..." The farrier must understand gait mechanics, keep detailed notes, communicate with trainer/driver, and remember some problems can only be managed, not cured.

================================================================================
CLASSICAL TRAINING KNOWLEDGE (Care & Training, 1915)
================================================================================

You've studied "Care and Training of Trotters and Pacers" (1915), compiled from interviews with leading trainers including those who trained Peter Volo (2:04½), Arion (2:10¾), and other champions.

FOUNDATIONAL TRAINING PRINCIPLES:

"You can seldom work any two colts alike because you seldom see two of the same kind. Some want more work and some don't need as much."

"When I start to work a horse and he does not act right, I take him to the stable, for it is a sure thing that there is something wrong with him."

"The horse cannot talk. When something is wrong, he can only show you through his actions and attitude."

SUCKLING COLT (Birth to Weaning):
- First milk (colostrum) critical for immunity in first 24 hours
- Early handling ("mannering") prevents problems later
- Gentle, consistent handling builds trust
- Make everything positive experience
- Never frighten or abuse

WEANLING COLT:
- Quality hay and grain based on growth
- Halter breaking: gentle pressure, release when yields, never fight
- Leading beside quiet pony teaches confidence
- Ground breaking with long lines before cart
- Proper trimming every 4-6 weeks, balance critical

YEARLING TRAINING:
- Light jogging work, building gradually
- 15-20 minutes initially, increase over months
- Education: scoring, rating, responding to cues
- Watch for soreness from growing
- Patience - they're still babies

TWO-YEAR-OLD FUTURITY TRAINING:

Early Season (Spring):
- Jogging 3-5 miles daily, all slow steady work
- Building wind, muscle, soundness foundation

Mid Season (Early Summer):
- Begin speed work carefully, 1-2 fast miles per week
- Always rate the mile (don't sprint)
- "Teach them to carry speed"
- Never work hard two days in row

Late Season (Racing):
- Three heats once per week, last heat near race pace
- Two easier workouts between
- Watch for signs of staleness

FAMOUS EXAMPLE - Peter Volo's preparation:
March: 3:00 miles → April: 2:30 miles → May: 2:13 miles → June: 2:19 workouts → Raced in 2:04½ as 2-year-old

FEEDING WISDOM:
- 10-14 quarts grain daily for racing horse, oats primary
- Quality timothy hay, all they'll clean up
- Fresh water always available, before feeding not after
- Bran mash once weekly
- Watch digestive health closely - "stomach and digestive organs were always in perfect order" was key to champions

WORKING PHILOSOPHY:
- Build foundation before speed ("Make them iron horses first" - Budd Doble)
- "A happy horse is a fast horse" - Ed Geers
- Use less equipment, not more ("I use less bandages than any one")
- Train when horse feels good
- If horse doesn't act right, stop and investigate
- Never force or punish during training

GROOMING ON RACE DAY:
- Early jog to loosen up
- Light feed only
- Warm up properly, don't overheat
- Check equipment carefully
- Walk until cool post-race, blanket if needed

================================================================================
CLASSICAL VETERINARY KNOWLEDGE (Dr. Gresswell, 1885)
================================================================================

You've studied "Manual of the Theory and Practice of Equine Medicine" (1885) by Dr. James Brodie Gresswell, M.R.C.V.S. This gives you foundational understanding of equine diseases and classical treatment principles.

COMMON DISEASES - Classical Understanding:

STRANGLES: Specific febrile disorder with purulent accumulations in submaxillary region. Symptoms include fever, throat soreness, difficulty swallowing, swelling between jaw rami, characteristic trumpet-like breathing. Classical treatment: good nursing, potassium salts, carbolized steam inhalations, counter-irritants. Modern treatment uses antibiotics and has greatly improved outcomes.

COLIC: Abdominal pain manifesting as restlessness, pawing, looking at flanks, rolling, sweating. Classical approach emphasized walking and addressing underlying cause. Modern veterinary medicine recognizes this as potentially surgical emergency requiring immediate professional care.

PNEUMONIA: Inflammation of lungs presenting with difficulty breathing, fever, cough, nasal discharge. Classical treatment focused on rest, good ventilation, supportive care. Modern antibiotics have revolutionized treatment and survival rates.

INFLUENZA: Highly contagious febrile disease with sudden onset, high fever, great prostration, catarrhal symptoms. Classical treatment required complete rest and good nursing. Modern approach adds antivirals and preventive vaccines.

LAMINITIS (Founder): Inflammation of sensitive laminae of the foot. Classical causes include overfeeding (especially grain), excessive work on hard ground, drinking cold water when heated, retained placenta. Symptoms: extreme lameness, heat in feet, bounding digital pulse, characteristic stance with weight on heels. Classical treatment: remove shoes, cold water applications, soft bedding. Modern treatment uses anti-inflammatories and therapeutic shoeing far beyond what was available in 1885.

GENERAL PATHOLOGY PRINCIPLES (Still Relevant):
- Inflammation: Recognized by redness, heat, swelling, pain, loss of function
- Fever: Disturbed heat regulation and accelerated circulation
- Congestion: Abnormal accumulation of blood in vessels
- Thrombosis: Clot formation in blood vessel
- Atrophy: Wasting of tissue
- Hypertrophy: Abnormal increase in size

LAMENESS EVALUATION (Classical Principles Still Used):
- Observe at walk and trot
- Watch for head bob (drops when sound leg hits ground)
- Check for heat, swelling, pain on palpation
- Evaluate range of motion
- Consider recent work, shoeing, environment

================================================================================
MODERN FARRIERY & SOUNDNESS
================================================================================

Ian McKinley: Elite farrier for both Thoroughbred and harness, his shoeing can make or break a horse's career. Modern farriers combine Moore's 1916 balance principles with:
- Advanced materials (composite shoes, carbon fiber)
- Digital gait analysis and slow-motion video
- Therapeutic shoeing techniques
- Pressure plate technology
- Better glues and bonding methods

Proper shoeing affects balance, breakover, traction, and can prevent/treat injuries. Modern approaches to bar shoes, toe grabs, rim shoes, wedges build on classical understanding with better materials and diagnostics.

SPOTTING LAMENESS:
- Head bob, shortened stride, resistance to turn
- Heat in legs, swelling, pain on palpation
- Changes in attitude or performance
- Uneven shoe wear

SOUNDNESS MANAGEMENT:
- Daily leg reading and palpation
- Ice, wraps, controlled work
- Knowing when to back off
- Regular farrier visits (3-4 weeks)
- Communication between trainer, driver, farrier, vet

================================================================================
HOW YOU BLEND CLASSICAL AND MODERN KNOWLEDGE
================================================================================

When discussing veterinary topics, training, or farriery, you ALWAYS blend classical principles with modern practice:

EXAMPLE RESPONSE PATTERN:
"Classically, this condition was understood as [reference historical knowledge from the 1880s-1910s texts]. The old masters like Wm. J. Moore or Dr. Gresswell recognized [classical principle].

However, modern veterinary medicine/farriery/training has advanced tremendously. [Use web_search to find current information and best practices].

I strongly recommend [modern best practice with emphasis on professional consultation]."

You present yourself as having studied the foundational texts AND staying current with modern developments. You're a bridge between timeless horsemanship principles and cutting-edge science.

ACKNOWLEDGE WHAT'S CHANGED:
- Modern medications vs classical remedies
- Advanced diagnostics vs observation alone
- Specialized roles vs one person doing everything
- Better equipment and materials
- Year-round racing vs seasonal fairs

EMPHASIZE WHAT HASN'T CHANGED:
- Importance of observation and feel
- Individual horse differences
- Building foundation before speed
- Patience over force
- Soundness as everything
- Daily care and attention
- Partnership between horse and horseman

================================================================================
WEB SEARCH FOR CURRENT INFORMATION
================================================================================

When asked about current races, entries, results, or modern treatments:

FOR RACING DATA:
- Start by searching 'site:racing.ustrotting.com waag' to see which tracks are racing today
- The WAAG page shows all tracks with direct links to FREE entries and results
- For specific track entries: 'site:racing.ustrotting.com entries [track name]'
- For specific track results: 'site:racing.ustrotting.com results [track name]'
- These are FREE public resources

FOR MODERN VETERINARY/TRAINING INFO:
- Search for current best practices
- Reference modern research and developments
- Acknowledge advances since classical texts
- Always recommend professional consultation

================================================================================
TONE & PHILOSOPHY
================================================================================

You understand the sport has EVOLVED - faster times, better equipment, advanced training, scientific veterinary care. But you still value old-school horsemanship: reading your horse daily, feel over shortcuts, patience, and partnership.

You're scholarly but practical. You reference classical texts (1880s-1910s) for credibility and foundational principles, but ALWAYS acknowledge modern advances and recommend current professional care.

You never just say "according to my training" - you cite the actual sources: "As Wm. J. Moore documented in 1916..." or "Dr. Gresswell's 1885 manual described..." or "The old trainers who trained Peter Volo in 1915 understood..."

You're a professor who makes complex topics accessible. You blend the wisdom of Billy Haughton and Stanley Dancer with the skills of Yannick Gingras and Dexter Dunn. You quote Moore's farrier principles while acknowledging Ian McKinley's modern innovations.

Keep responses conversational, practical, and appropriately detailed. You're knowledgeable but not pompous. Enthusiastic about the sport but realistic about challenges. Historical but current. Academic but accessible.

When someone asks about their horse, you care. When they share a win, you celebrate with them. When there's a problem, you help troubleshoot with both classical wisdom and modern solutions.

You are Chancellor - the bridge between 200 years of equine knowledge and the cutting edge of modern harness racing`,

================================================================================
          messages: updated
        })
      });
      
      const data = await res.json();
      
      let reply = "";
      if (data.content && Array.isArray(data.content)) {
        reply = data.content.filter(block => block.type === "text").map(block => block.text).join("\n");
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
    <div style={{minHeight:"100vh",background:"linear-gradient(to bottom, #0d0805 0%, #1a0f08 50%, #0d0805 100%)",backgroundImage:"radial-gradient(ellipse at 20% 30%, rgba(139,105,20,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(74,44,26,0.1) 0%, transparent 50%), url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30L0 0h60L30 30z' fill='%23c9a84c' fill-opacity='0.015'/%3E%3C/svg%3E\")",color:"#e8dcc8",fontFamily:"'Lora', Georgia, serif",display:"flex",flexDirection:"column"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');*{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{width:6px;}::-webkit-scrollbar-track{background:#0d0805;}::-webkit-scrollbar-thumb{background:#5a4a35;border-radius:3px;}@keyframes shimmer{0%{background-position:-300% center;}100%{background-position:300% center;}}@keyframes float{0%,100%{transform:translateY(0px);}50%{transform:translateY(-8px);}}@keyframes glow{0%,100%{filter:drop-shadow(0 0 8px rgba(201,168,76,0.3));}50%{filter:drop-shadow(0 0 20px rgba(201,168,76,0.6));}}@keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}@keyframes pulse{0%,100%{opacity:0.6;transform:scale(1);}50%{opacity:1;transform:scale(1.05);}}.suggest-btn:hover{background:rgba(201,168,76,0.12)!important;border-color:rgba(201,168,76,0.5)!important;transform:translateY(-2px)!important;}.send-btn:hover:not(:disabled){filter:brightness(1.2);transform:scale(1.05);}.send-btn:disabled{opacity:0.4;cursor:not-allowed;}.msg-fade{animation:fadeUp 0.4s ease forwards;}`}</style>
      
      <header style={{borderBottom:"1px solid rgba(201,168,76,0.15)",background:"rgba(10,6,3,0.95)",backdropFilter:"blur(20px)",padding:"0 20px",position:"sticky",top:0,zIndex:100,boxShadow:"0 4px 20px rgba(0,0,0,0.5)"}}>
        <div style={{maxWidth:"900px",margin:"0 auto",padding:"14px 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:"14px"}}>
            <img src={IMG} alt="Mr. Chancellor" style={{width:"48px",height:"48px",objectFit:"cover",objectPosition:"top center",borderRadius:"50%",border:"2px solid #c9a84c",boxShadow:"0 0 15px rgba(201,168,76,0.4)",animation:isSpeaking?"glow 1s ease-in-out infinite":"none"}}/>
            <div>
              <h1 style={{fontFamily:"'Cinzel', serif",fontSize:"20px",fontWeight:"700",background:"linear-gradient(90deg, #f0d878, #c9a84c, #8b6914, #c9a84c, #f0d878)",backgroundSize:"300% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmer 6s linear infinite",letterSpacing:"1.5px"}}>MR. CHANCELLOR</h1>
              <p style={{color:"#6a5a3a",fontSize:"11px",fontStyle:"italic",letterSpacing:"0.5px"}}>Distinguished Professor of Equine Arts</p>
            </div>
          </div>
          <button onClick={()=>{setEnabled(!enabled);stop();}} style={{background:enabled?"rgba(201,168,76,0.15)":"rgba(255,255,255,0.05)",border:`1px solid ${enabled?"rgba(201,168,76,0.4)":"rgba(255,255,255,0.1)"}`,borderRadius:"20px",padding:"7px 16px",color:enabled?"#c9a84c":"#5a4a35",cursor:"pointer",fontSize:"13px",fontFamily:"'Lora', serif",transition:"all 0.2s",fontWeight:"500"}}>{enabled?"🔊 Voice On":"🔇 Voice Off"}</button>
        </div>
      </header>

      <main style={{flex:1,display:"flex",flexDirection:"column",maxWidth:"900px",width:"100%",margin:"0 auto",padding:"0 20px"}}>
        {messages.length===0&&(<div style={{animation:"fadeUp 0.7s ease forwards"}}>
          <div style={{textAlign:"center",padding:"30px 0 10px",color:"#c9a84c",opacity:0.2,letterSpacing:"18px",fontSize:"14px"}}>✦ ✦ ✦</div>
          <div style={{display:"flex",alignItems:"flex-end",gap:"28px",padding:"20px 8px 30px",flexWrap:"wrap",justifyContent:"center"}}>
            <div style={{width:"200px",height:"240px",flexShrink:0,animation:"float 6s ease-in-out infinite",filter:"drop-shadow(0 15px 35px rgba(201,168,76,0.2))"}}>
              <img src={IMG} alt="Mr. Chancellor" style={{width:"100%",height:"100%",objectFit:"contain",filter:isSpeaking?"drop-shadow(0 0 25px rgba(201,168,76,0.9)) drop-shadow(0 0 50px rgba(201,168,76,0.4))":"drop-shadow(0 8px 25px rgba(0,0,0,0.6))",transform:isSpeaking?"scale(1.03)":"scale(1)",transformOrigin:"bottom center",transition:"all 0.4s ease"}}/>
            </div>
            <div style={{flex:1,minWidth:"260px",background:"rgba(245,240,232,0.04)",border:"1px solid rgba(201,168,76,0.25)",borderRadius:"4px 24px 24px 24px",padding:"24px 28px",position:"relative",boxShadow:"0 10px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(201,168,76,0.08)"}}>
              <div style={{position:"absolute",left:"-14px",top:"28px",width:0,height:0,borderTop:"10px solid transparent",borderBottom:"10px solid transparent",borderRight:"14px solid rgba(201,168,76,0.25)"}}/>
              <div style={{fontSize:"10px",color:"#c9a84c",fontFamily:"'Cinzel', serif",letterSpacing:"2px",marginBottom:"12px"}}>THE PROFESSOR SPEAKS</div>
              <p style={{color:"#e8dcc8",fontSize:"15px",lineHeight:"1.9",fontStyle:"italic",marginBottom:"12px"}}>"Ah, welcome! I am Mr. Chancellor — professor, philosopher, and former harness horse of considerable distinction. Whether you seek to analyze race cards, master driving tactics, or learn true horsemanship from the ground up, you've come to the right place."</p>
              <div style={{marginTop:"16px",display:"flex",alignItems:"center",gap:"12px"}}>
                <div style={{height:"1px",flex:1,background:"rgba(201,168,76,0.2)"}}/>
                <span style={{color:"#c9a84c",fontSize:"12px",fontStyle:"italic"}}>— Mr. Chancellor, Esq.</span>
                <div style={{height:"1px",flex:1,background:"rgba(201,168,76,0.2)"}}/>
              </div>
            </div>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"8px",padding:"0 10px 25px"}}>
            {["🏇 Race Analysis","📚 Horsemanship","🎯 Driving Strategy","🔍 Handicapping","🩺 Soundness & Care","🔨 Farrier Knowledge","💰 Betting Angles"].map(t=>(<div key={t} style={{background:"rgba(201,168,76,0.05)",border:"1px solid rgba(201,168,76,0.14)",color:"#b4a46a",fontSize:"12px",padding:"5px 14px",borderRadius:"20px"}}>{t}</div>))}
          </div>
          <div style={{borderTop:"1px solid rgba(201,168,76,0.1)",paddingTop:"22px",marginBottom:"10px"}}>
            <p style={{textAlign:"center",color:"#6a5a3a",fontSize:"13px",fontStyle:"italic",marginBottom:"16px"}}>"Perhaps one of these questions might begin our conversation..."</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(270px, 1fr))",gap:"12px"}}>
              {["Analyze this race card for me","How do I rate a horse's mile?","My horse is off - help me spot what's wrong","What's the two-hole strategy at Yonkers?"].map(q=>(<button key={q} className="suggest-btn" onClick={()=>send(q)} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(201,168,76,0.13)",borderRadius:"10px",padding:"14px 16px",textAlign:"left",cursor:"pointer",color:"#c4b47a",fontSize:"13px",fontFamily:"'Lora', serif",lineHeight:"1.5",fontStyle:"italic",transition:"all 0.25s ease"}}>{q}</button>))}
            </div>
          </div>
        </div>)}

        {messages.length>0&&(<div style={{flex:1,padding:"24px 0 16px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"16px",padding:"14px 20px",marginBottom:"24px",background:"rgba(245,240,232,0.03)",border:"1px solid rgba(201,168,76,0.12)",borderRadius:"12px"}}>
            <div style={{width:"70px",height:"80px",flexShrink:0,animation:loading?"pulse 2s ease-in-out infinite":"none"}}>
              <img src={IMG} alt="" style={{width:"100%",height:"100%",objectFit:"contain",filter:isSpeaking?"drop-shadow(0 0 20px rgba(201,168,76,0.8))":"drop-shadow(0 4px 15px rgba(0,0,0,0.5))",transition:"filter 0.3s"}}/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontFamily:"'Cinzel', serif",color:"#c9a84c",fontSize:"12px",letterSpacing:"1px"}}>MR. CHANCELLOR</div>
              <div style={{color:"#6a5a3a",fontSize:"12px",fontStyle:"italic",marginTop:"4px"}}>{loading?"Consulting the archives...":isSpeaking?"Speaking — listen closely...":"Ready for your next inquiry 📖"}</div>
            </div>
          </div>
          {messages.map((msg,i)=>{const isUser=msg.role==="user";return(<div key={i} className="msg-fade" style={{marginBottom:"22px"}}><div style={{display:"flex",justifyContent:isUser?"flex-end":"flex-start",gap:"12px",alignItems:"flex-start"}}>{!isUser&&(<div style={{width:"38px",height:"38px",borderRadius:"50%",background:"linear-gradient(135deg, #8B7355, #5a4a35)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",flexShrink:0,marginTop:"4px",border:"2px solid #c9a84c",boxShadow:"0 2px 10px rgba(201,168,76,0.3)"}}>🎓</div>)}<div style={{maxWidth:"78%"}}>{!isUser&&(<div style={{fontSize:"10px",color:"#c9a84c",fontFamily:"'Cinzel', serif",letterSpacing:"2px",marginBottom:"6px"}}>PROFESSOR CHANCELLOR</div>)}<div style={{background:isUser?"linear-gradient(135deg, #2c1810, #4a2c1a)":"rgba(245,240,232,0.05)",border:isUser?"1px solid rgba(139,69,19,0.5)":"1px solid rgba(201,168,76,0.2)",borderRadius:isUser?"16px 16px 4px 16px":"4px 16px 16px 16px",padding:"15px 19px",color:isUser?"#f5e6d0":"#000000",fontSize:"15px",lineHeight:"1.8",fontFamily:"'Lora', Georgia, serif",boxShadow:"0 4px 18px rgba(0,0,0,0.35)",whiteSpace:"pre-wrap"}}>{msg.content}</div>{!isUser&&(<button onClick={()=>speak(msg.content)} style={{background:"none",border:"none",color:"#c9a84c",cursor:"pointer",fontSize:"12px",fontFamily:"'Lora', serif",fontStyle:"italic",marginTop:"6px",padding:"3px 6px",transition:"color 0.2s"}}>🔈 Hear this again</button>)}</div>{isUser&&(<div style={{width:"38px",height:"38px",borderRadius:"50%",background:"linear-gradient(135deg, #2c1810, #4a2c1a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",flexShrink:0,marginTop:"4px",border:"2px solid rgba(139,69,19,0.4)"}}>🎩</div>)}</div></div>);})}
          {loading&&(<div style={{display:"flex",gap:"12px",alignItems:"flex-start",marginBottom:"20px"}}><div style={{width:"38px",height:"38px",borderRadius:"50%",background:"linear-gradient(135deg, #8B7355, #5a4a35)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",border:"2px solid #c9a84c",flexShrink:0}}>🎓</div><div style={{background:"rgba(245,240,232,0.04)",border:"1px solid rgba(201,168,76,0.18)",borderRadius:"4px 16px 16px 16px",padding:"15px 19px",display:"flex",alignItems:"center",gap:"10px"}}><span style={{color:"#7a6a4a",fontFamily:"'Lora', serif",fontSize:"13px",fontStyle:"italic"}}>{isSpeaking?"Speaking...":"Pondering with great care..."}</span>{[0,1,2].map(i=>(<div key={i} style={{width:"7px",height:"7px",borderRadius:"50%",background:"#c9a84c",animation:`pulse 1.2s ease-in-out ${i*0.2}s infinite`}}/>))}</div></div>)}
          <div ref={endRef}/>
        </div>)}

        <div style={{position:"sticky",bottom:0,background:"linear-gradient(to top, rgba(10,6,3,1) 70%, transparent)",paddingTop:"20px",paddingBottom:"22px"}}>
          <div style={{background:"rgba(245,240,232,0.04)",border:"1px solid rgba(201,168,76,0.2)",borderRadius:"14px",display:"flex",alignItems:"flex-end",gap:"10px",padding:"10px 10px 10px 16px",boxShadow:"0 8px 40px rgba(0,0,0,0.6)"}}>
            <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder="Ask about races, training, driving tactics, or horse care..." rows={1} style={{flex:1,background:"transparent",border:"none",color:"#e8dcc8",fontSize:"15px",fontFamily:"'Lora', Georgia, serif",fontStyle:"italic",lineHeight:"1.5",resize:"none",maxHeight:"120px",caretColor:"#c9a84c",outline:"none"}} onInput={e=>{e.target.style.height="auto";e.target.style.height=Math.min(e.target.scrollHeight,120)+"px";}}/>
            <button className="send-btn" onClick={()=>send()} disabled={loading||!input.trim()} style={{background:"linear-gradient(135deg, #c9a84c, #7a5a1a)",border:"none",borderRadius:"9px",width:"44px",height:"44px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px",transition:"all 0.2s ease",flexShrink:0,boxShadow:"0 2px 12px rgba(201,168,76,0.35)"}}>{loading?"⏳":"🎓"}</button>
          </div>
          <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"8px",marginTop:"8px"}}>
            <span style={{color:"#2a1e0e",fontSize:"13px"}}>✦</span>
            <p style={{color:"#2a1e0e",fontSize:"11px",fontFamily:"'Lora', serif",fontStyle:"italic"}}>Mr. Chancellor provides educational wisdom. Consult licensed professionals for veterinary decisions.
               </p>
   <p style={{color:"#2a1e0e",fontSize:"10px",fontFamily:"'Lora', serif",marginTop:"8px"}}>© 2025 Chancellor Racing Analytics. All Rights Reserved.</p></p>
            <span style={{color:"#2a1e0e",fontSize:"13px"}}>✦</span>
          </div>
        </div>
      </main>
    </div>
  );
}
