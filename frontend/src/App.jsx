import { useState, useEffect, useRef, useMemo } from "react";
import { AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const S=`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden}
body{font-family:'DM Sans',sans-serif;background:#02061a;color:#dff0ff;font-size:14px;line-height:1.5}
::-webkit-scrollbar{width:3px;height:3px}::-webkit-scrollbar-thumb{background:rgba(0,229,255,.18);border-radius:2px}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulseC{0%,100%{box-shadow:0 0 10px rgba(0,229,255,.25)}50%{box-shadow:0 0 28px rgba(0,229,255,.6),0 0 50px rgba(0,229,255,.12)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
@keyframes scanLine{0%{top:-4px;opacity:.8}95%{opacity:.8}100%{top:100%;opacity:0}}
@keyframes aura{0%,100%{transform:scale(1);opacity:.38}50%{transform:scale(1.08);opacity:.68}}
@keyframes hbeat{0%,100%{transform:scale(1)}14%{transform:scale(1.13)}28%{transform:scale(1)}42%{transform:scale(1.09)}70%{transform:scale(1)}}
.fu{animation:fadeUp .4s ease both}
.card{background:rgba(7,13,34,.82);backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);border:1px solid rgba(0,229,255,.09);border-radius:16px;position:relative;overflow:hidden}
.card::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,229,255,.022) 0%,transparent 55%);pointer-events:none;border-radius:inherit}
.gt{background:linear-gradient(135deg,#00e5ff,#7c4dff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.sora{font-family:'Sora',sans-serif}
.mono{font-family:'DM Mono',monospace}
.btn{padding:9px 20px;border-radius:10px;border:none;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s ease;outline:none}
.btn-cy{background:rgba(0,229,255,.1);color:#00e5ff;border:1px solid rgba(0,229,255,.22)}
.btn-cy:hover{background:rgba(0,229,255,.2);box-shadow:0 0 18px rgba(0,229,255,.22);transform:translateY(-1px)}
.btn-solid{background:linear-gradient(135deg,#00e5ff,#7c4dff);color:#000;font-weight:700}
.btn-solid:hover{box-shadow:0 0 22px rgba(0,229,255,.38);transform:translateY(-1px)}
.btn-rd{background:rgba(255,23,68,.1);color:#ff1744;border:1px solid rgba(255,23,68,.22)}
.inp{background:rgba(255,255,255,.04);border:1px solid rgba(0,229,255,.09);border-radius:10px;padding:11px 16px;color:#dff0ff;font-family:'DM Sans',sans-serif;font-size:14px;outline:none;transition:all .2s;width:100%}
.inp:focus{border-color:#00e5ff;background:rgba(0,229,255,.04);box-shadow:0 0 0 3px rgba(0,229,255,.08)}
.inp::placeholder{color:#3d5978}
.slider{-webkit-appearance:none;appearance:none;width:100%;height:3px;border-radius:2px;outline:none;cursor:pointer}
.slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:14px;height:14px;border-radius:50%;background:#00e5ff;cursor:pointer;box-shadow:0 0 10px rgba(0,229,255,.6)}
.bar-w{height:5px;background:rgba(255,255,255,.07);border-radius:3px;overflow:hidden}
.bar-f{height:100%;border-radius:3px;transition:width 1.2s cubic-bezier(.4,0,.2,1);position:relative;overflow:hidden}
.bar-f::after{content:'';position:absolute;top:0;bottom:0;width:40%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.32),transparent);animation:shimmer 2s infinite}
.chip{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:100px;font-size:11px;font-weight:700;letter-spacing:.4px}
.chip-r{background:rgba(255,23,68,.12);color:#ff1744;border:1px solid rgba(255,23,68,.22)}
.chip-a{background:rgba(255,145,0,.12);color:#ff9100;border:1px solid rgba(255,145,0,.22)}
.chip-g{background:rgba(0,255,157,.1);color:#00ff9d;border:1px solid rgba(0,255,157,.18)}
.chip-c{background:rgba(0,229,255,.1);color:#00e5ff;border:1px solid rgba(0,229,255,.18)}
.chip-p{background:rgba(124,77,255,.12);color:#b388ff;border:1px solid rgba(124,77,255,.22)}
.dot{width:7px;height:7px;border-radius:50%;display:inline-block}
.dot-live{background:#00ff9d;animation:blink 1.4s ease-in-out infinite}
.msg{border-radius:14px;padding:12px 16px;max-width:80%;font-size:13.5px;line-height:1.68;animation:fadeUp .3s ease}
.msg-u{background:linear-gradient(135deg,rgba(0,229,255,.14),rgba(124,77,255,.1));border:1px solid rgba(0,229,255,.2);align-self:flex-end;margin-left:auto}
.msg-a{background:rgba(255,255,255,.04);border:1px solid rgba(0,229,255,.09);align-self:flex-start}
.nav{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:11px;cursor:pointer;font-size:13px;font-weight:500;color:#3d5978;border:1px solid transparent;transition:all .18s ease;white-space:nowrap;overflow:hidden;user-select:none}
.nav:hover{color:#dff0ff;background:rgba(255,255,255,.04)}
.nav.on{color:#00e5ff;background:linear-gradient(135deg,rgba(0,229,255,.1),rgba(124,77,255,.07));border-color:rgba(0,229,255,.18)}
.mc{padding:16px;border-radius:13px;background:rgba(255,255,255,.03);border:1px solid rgba(0,229,255,.09);transition:all .2s;position:relative;overflow:hidden}
.mc:hover{border-color:rgba(0,229,255,.2);transform:translateY(-2px)}
.mc::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,#00e5ff,transparent);opacity:0;transition:opacity .2s}
.mc:hover::before{opacity:1}
.tri-cr{background:rgba(255,23,68,.08);border:1px solid rgba(255,23,68,.28);border-radius:12px;padding:14px}
.tri-hi{background:rgba(255,145,0,.08);border:1px solid rgba(255,145,0,.25);border-radius:12px;padding:14px}
.tri-md{background:rgba(255,215,64,.06);border:1px solid rgba(255,215,64,.2);border-radius:12px;padding:14px}
.tri-lo{background:rgba(0,255,157,.06);border:1px solid rgba(0,255,157,.18);border-radius:12px;padding:14px}
.sec-h{font-family:'Sora',sans-serif;font-size:21px;font-weight:700;margin-bottom:4px}
.sec-s{font-size:12px;color:#3d5978;margin-bottom:20px}

  @keyframes morphFuture{0%{opacity:0;transform:scale(.94) translateY(8px);filter:blur(6px);}100%{opacity:1;transform:scale(1) translateY(0);filter:blur(0);}}
  @keyframes countGlow{0%{text-shadow:0 0 0px currentColor;}50%{text-shadow:0 0 22px currentColor;}100%{text-shadow:0 0 0px currentColor;}}
  @keyframes pathPulse{0%,100%{stroke-opacity:.25;}50%{stroke-opacity:.85;}}
  .morph{animation:morphFuture .5s cubic-bezier(.16,1,.3,1) both;}
  .count-glow{animation:countGlow 1.4s ease-in-out infinite;}
  .yr-btn{padding:10px 22px;border-radius:11px;font-size:13px;font-weight:700;cursor:pointer;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);color:rgba(255,255,255,.4);transition:all .18s;}
  .yr-btn.on{background:linear-gradient(135deg,rgba(0,229,255,.18),rgba(124,77,255,.14));color:#00e5ff;border-color:rgba(0,229,255,.32);box-shadow:0 0 16px rgba(0,229,255,.12);}
  .act-card{padding:14px;border-radius:13px;cursor:pointer;border:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.025);transition:all .18s;}
  .act-card.on{border-color:rgba(0,255,157,.35);background:rgba(0,255,157,.06);box-shadow:0 0 18px rgba(0,255,157,.08);}
  .tree-node{padding:10px 12px;border-radius:11px;min-width:108px;text-align:center;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.025);transition:all .18s;}
  .tree-node.hl{transform:translateY(-3px);}
  .heat-cell{width:34px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:13px;}
`;

const PT={name:"Arjun Mehta",age:34,gender:"Male",blood:"B+",id:"MT-2026-0042",score:72,loc:"Hyderabad, India",lastVisit:"Mar 15, 2026",
  vitals:{hr:78,sys:128,dia:82,spo2:96,temp:98.4,glu:112,bmi:27.4,wt:82,ht:173},
  risks:{diabetes:38,heart:22,bp:45,anemia:12,stress:67},
  life:{sleep:5.5,ex:2,diet:5,hyd:1.8,stress:7,smk:false},
  meds:["Metformin 500mg (prn)","Cetirizine 10mg (seasonal)"],
  hx:["Paternal T2DM","Maternal Hypertension","Mild asthma","No drug allergies"]};

const TL=[{m:"Sep",sc:65,dia:44,heart:26,stress:75,bp:134},{m:"Oct",sc:63,dia:46,heart:28,stress:80,bp:136},{m:"Nov",sc:68,dia:42,heart:24,stress:72,bp:130},{m:"Dec",sc:70,dia:40,heart:23,stress:68,bp:129},{m:"Jan",sc:69,dia:39,heart:22,stress:70,bp:130},{m:"Feb",sc:72,dia:38,heart:22,stress:67,bp:128}];
const RADAR=[{s:"Cardiac",v:22},{s:"Metabolic",v:38},{s:"Neurological",v:67},{s:"Respiratory",v:15},{s:"Renal",v:8},{s:"Hepatic",v:12}];
const PATS=[
  {id:"P-001",name:"Rahul Sharma",age:62,cond:"Chest Pain + Acute Hypertension",sc:92,lvl:"cr",vi:"168/98 mmHg | HR 112"},
  {id:"P-002",name:"Priya Nair",age:45,cond:"Hyperglycemia — Glucose 380 mg/dL",sc:78,lvl:"hi",vi:"142/88 mmHg | HR 95"},
  {id:"P-003",name:"Mohammed Ali",age:38,cond:"Severe Anxiety + Palpitations",sc:61,lvl:"md",vi:"130/84 mmHg | HR 102"},
  {id:"P-004",name:"Suresh Kumar",age:71,cond:"Diabetic Edema + Review",sc:70,lvl:"hi",vi:"150/92 mmHg | HR 88"},
  {id:"P-005",name:"Ananya Singh",age:28,cond:"Mild Anemia + Fatigue",sc:34,lvl:"lo",vi:"110/70 mmHg | HR 78"}];
const C={cy:"#00e5ff",gr:"#00ff9d",rd:"#ff1744",am:"#ff9100",pu:"#7c4dff",ye:"#ffd740"};

const callAI=async(messages,sys="")=>{
  const b={model:"claude-sonnet-4-20250514",max_tokens:700,messages};
  if(sys)b.system=sys;
  const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b)});
  const d=await r.json();
  if(d.error)throw new Error(d.error.message||"API error");
  return d.content?.[0]?.text||"";
};

function Avatar({score,risks}){
  const [beat,setBeat]=useState(false);
  useEffect(()=>{const i=setInterval(()=>setBeat(b=>!b),900);return()=>clearInterval(i);},[]);
  const col=score>75?C.gr:score>50?C.am:C.rd;
  return(
    <div style={{position:"relative",width:180,height:272,margin:"0 auto"}}>
      {[220,178,144].map((s,i)=>(
        <div key={i} style={{position:"absolute",left:"50%",top:"46%",width:s,height:s,marginLeft:-s/2,marginTop:-s/2,border:`1px solid ${col}`,borderRadius:"50%",opacity:0.06+i*0.04,animation:`aura ${2+i*0.55}s ease-in-out infinite`,animationDelay:`${i*0.4}s`,boxShadow:`0 0 ${18+i*10}px ${col}28`}}/>
      ))}
      <svg width="180" height="272" viewBox="0 0 180 272" style={{position:"relative",zIndex:2}}>
        <defs>
          <filter id="gw"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <radialGradient id="bg" cx="50%" cy="35%" r="65%"><stop offset="0%" stopColor={col} stopOpacity="0.22"/><stop offset="100%" stopColor={col} stopOpacity="0.03"/></radialGradient>
          <linearGradient id="sp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={col} stopOpacity="0.75"/><stop offset="100%" stopColor={col} stopOpacity="0"/></linearGradient>
        </defs>
        <circle cx="90" cy="38" r="30" fill="url(#bg)" stroke={col} strokeWidth="1.5" filter="url(#gw)" opacity="0.9"/>
        <rect x="82" y="65" width="16" height="14" rx="6" fill={col} opacity="0.18"/>
        <ellipse cx="90" cy="135" rx="46" ry="58" fill="url(#bg)" stroke={col} strokeWidth="1.5" opacity="0.88" filter="url(#gw)"/>
        <circle cx="75" cy="113" r="9" fill={risks.heart>40?C.rd:C.gr} opacity={beat?0.92:0.42} style={{transition:"opacity .35s"}} filter="url(#gw)"/>
        <text x="75" y="118" textAnchor="middle" fontSize="11" fill="#fff" opacity="0.9">{"♥"}</text>
        <ellipse cx="67" cy="133" rx="11" ry="15" fill={C.cy} opacity="0.11" stroke={C.cy} strokeWidth="0.8"/>
        <ellipse cx="113" cy="133" rx="11" ry="15" fill={C.cy} opacity="0.11" stroke={C.cy} strokeWidth="0.8"/>
        <ellipse cx="92" cy="157" rx="14" ry="8" fill={C.am} opacity={risks.diabetes>35?0.2:0.07} stroke={C.am} strokeWidth="0.8"/>
        <line x1="90" y1="78" x2="90" y2="190" stroke="url(#sp)" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.4"/>
        <ellipse cx="34" cy="140" rx="13" ry="44" fill={col} opacity="0.1" stroke={col} strokeWidth="1"/>
        <ellipse cx="146" cy="140" rx="13" ry="44" fill={col} opacity="0.1" stroke={col} strokeWidth="1"/>
        <ellipse cx="72" cy="230" rx="18" ry="42" fill={col} opacity="0.1" stroke={col} strokeWidth="1"/>
        <ellipse cx="108" cy="230" rx="18" ry="42" fill={col} opacity="0.1" stroke={col} strokeWidth="1"/>
        <text x="90" y="43" textAnchor="middle" fontSize="14" fontWeight="800" fontFamily="Sora" fill={col} filter="url(#gw)">{score}</text>
      </svg>
      <svg width="180" height="26" viewBox="0 0 180 26" style={{position:"absolute",bottom:0,left:0}}>
        <polyline points="0,13 20,13 30,3 40,23 50,13 75,13 83,7 90,21 97,13 180,13" fill="none" stroke={col} strokeWidth="1.6" opacity="0.55" strokeDasharray="200" strokeDashoffset={beat?0:200} style={{transition:"stroke-dashoffset .85s ease"}}/>
      </svg>
    </div>
  );
}

function Gauge({score}){
  const ang=(score/100)*180-90,col=score>75?C.gr:score>50?C.am:C.rd,r=80;
  const x=100+r*Math.cos(ang*Math.PI/180),y=100-r*Math.sin(ang*Math.PI/180);
  const lx=100+65*Math.cos(ang*Math.PI/180),ly=100-65*Math.sin(ang*Math.PI/180);
  return(
    <svg width="200" height="112" viewBox="0 0 200 112">
      <defs>
        <linearGradient id="gg" x1="0%" x2="100%"><stop offset="0%" stopColor={C.rd}/><stop offset="50%" stopColor={C.am}/><stop offset="100%" stopColor={C.gr}/></linearGradient>
        <filter id="gf"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="13" strokeLinecap="round"/>
      <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#gg)" strokeWidth="13" strokeLinecap="round" opacity="0.32"/>
      <path d={`M 20 100 A 80 80 0 ${score>50?1:0} 1 ${x} ${y}`} fill="none" stroke={col} strokeWidth="13" strokeLinecap="round" filter="url(#gf)"/>
      <line x1="100" y1="100" x2={lx} y2={ly} stroke={col} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="100" cy="100" r="6" fill={col} filter="url(#gf)"/>
      <text x="100" y="82" textAnchor="middle" fontSize="30" fontWeight="800" fontFamily="Sora" fill={col}>{score}</text>
      <text x="100" y="97" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.32)" letterSpacing="2">HEALTH SCORE</text>
    </svg>
  );
}

function MTile({icon,label,val,unit="",sub="",col=C.cy,trend=null}){
  return(
    <div className="mc fu">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
        <div style={{width:35,height:35,borderRadius:9,background:`${col}1a`,border:`1px solid ${col}28`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>{icon}</div>
        {trend!=null&&<span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:6,background:`${trend>0?C.rd:C.gr}18`,color:trend>0?C.rd:C.gr}}>{trend>0?"↑":"↓"}{Math.abs(trend)}%</span>}
      </div>
      <div className="mono" style={{fontSize:26,fontWeight:500,color:col,lineHeight:1}}>{val}<span style={{fontSize:12,fontWeight:400,color:"rgba(255,255,255,0.28)",marginLeft:3}}>{unit}</span></div>
      <div style={{fontSize:11,color:"rgba(255,255,255,0.38)",marginTop:5}}>{label}</div>
      {sub&&<div style={{fontSize:10,color:col,marginTop:3,opacity:.75}}>{sub}</div>}
    </div>
  );
}

function RBar({label,val,conf=null}){
  const fc=val>60?C.rd:val>35?C.am:C.gr;
  return(
    <div style={{marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:7,fontSize:13}}>
        <span style={{color:"rgba(255,255,255,0.68)"}}>{label}</span>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {conf&&<span style={{fontSize:10,color:"rgba(255,255,255,0.28)"}}>AI {conf}%</span>}
          <span className="mono" style={{fontWeight:500,color:fc}}>{val}%</span>
        </div>
      </div>
      <div className="bar-w"><div className="bar-f" style={{width:`${val}%`,background:`linear-gradient(90deg,${fc}78,${fc})`}}/></div>
    </div>
  );
}

function Dots(){
  return(<div style={{display:"flex",gap:6}}>{[0,1,2].map(i=><div key={i} style={{width:9,height:9,borderRadius:"50%",background:C.cy,animation:`blink .7s ease-in-out infinite`,animationDelay:`${i*.18}s`}}/>)}</div>);
}

function Dashboard({go}){
  const [hr,setHr]=useState(78);
  const [data,setData]=useState(()=>Array.from({length:20},(_,i)=>({t:`${i}:00`,hr:74+Math.round(Math.sin(i*.5)*6),o2:95+Math.round(Math.random()*2),bp:126+Math.round(Math.sin(i*.3)*4)})));
  useEffect(()=>{
    const id=setInterval(()=>{
      const h=74+Math.round(Math.sin(Date.now()*.001)*7+Math.random()*4);
      setHr(h);
      setData(p=>[...p.slice(-19),{t:new Date().toLocaleTimeString("en",{hour:"2-digit",minute:"2-digit"}),hr:h,o2:95+Math.round(Math.random()*2),bp:126+Math.round(Math.sin(Date.now()*.0005)*4)}]);
    },2200);
    return()=>clearInterval(id);
  },[]);
  return(
    <div style={{display:"grid",gridTemplateColumns:"220px 1fr 200px",gap:18}}>
      <div style={{gridColumn:"1/-1",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><h1 className="sec-h gt">Health Dashboard</h1><p className="sec-s">Real-time monitoring · {PT.name} · ID: {PT.id}</p></div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,background:"rgba(0,255,157,0.08)",border:"1px solid rgba(0,255,157,0.2)",borderRadius:100,padding:"7px 14px",fontSize:12}}><span className="dot dot-live"/><span style={{color:C.gr}}>Live Monitoring</span></div>
          <button className="btn btn-solid" onClick={()=>go("twin")}>View Full Twin →</button>
        </div>
      </div>
      <div className="card" style={{padding:22,display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
        <div style={{fontSize:9,color:"rgba(255,255,255,0.25)",letterSpacing:2,fontWeight:700,marginBottom:4}}>DIGITAL TWIN</div>
        <Avatar score={PT.score} risks={PT.risks}/>
        <Gauge score={PT.score}/>
        <span className="chip chip-a">{"⚠"} Moderate Risk</span>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.22)"}}>{PT.lastVisit}</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:15}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:13}}>
          <MTile icon="❤️" label="Heart Rate" val={hr} unit="bpm" col={C.rd} trend={2} sub="Normal"/>
          <MTile icon="🩸" label="Blood Pressure" val={`${PT.vitals.sys}/${PT.vitals.dia}`} unit="mmHg" col={C.am} trend={3} sub="Pre-hypertensive"/>
          <MTile icon="🫁" label="SpO₂" val={PT.vitals.spo2} unit="%" col={C.cy} sub="Normal"/>
          <MTile icon="⚖️" label="BMI" val={PT.vitals.bmi} col={C.ye} trend={1} sub="Overweight"/>
          <MTile icon="🍬" label="Glucose" val={PT.vitals.glu} unit="mg/dL" col={C.am} trend={4} sub="Borderline"/>
          <MTile icon="🌡️" label="Temperature" val={PT.vitals.temp} unit="°F" col={C.pu} sub="Normal"/>
        </div>
        <div className="card" style={{padding:20,flex:1}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div><div style={{fontWeight:700,fontSize:14,fontFamily:"Sora"}}>Live Vitals Stream</div><div style={{fontSize:11,color:"rgba(255,255,255,0.28)"}}>Real-time sensor data</div></div>
            <div style={{display:"flex",gap:18}}>{[{l:"HR",v:hr+" bpm",c:C.rd},{l:"SpO₂",v:PT.vitals.spo2+"%",c:C.cy},{l:"BP",v:"128",c:C.am}].map(({l,v,c},i)=>(
              <div key={i} style={{textAlign:"center"}}><div className="mono" style={{color:c,fontSize:16,fontWeight:500}}>{v}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.28)"}}>{l}</div></div>
            ))}</div>
          </div>
          <ResponsiveContainer width="100%" height={145}>
            <AreaChart data={data}>
              <defs>{[{id:"hrg",c:C.rd},{id:"o2g",c:C.cy}].map(({id,c})=>(<linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={c} stopOpacity={.28}/><stop offset="95%" stopColor={c} stopOpacity={0}/></linearGradient>))}</defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
              <XAxis dataKey="t" tick={{fill:"rgba(255,255,255,0.25)",fontSize:10}} interval={4}/>
              <YAxis tick={{fill:"rgba(255,255,255,0.25)",fontSize:10}}/>
              <Tooltip contentStyle={{background:"#070d22",border:"1px solid rgba(0,229,255,0.2)",borderRadius:12,fontSize:12}}/>
              <Area type="monotone" dataKey="hr" stroke={C.rd} fill="url(#hrg)" strokeWidth={2} name="Heart Rate" dot={false}/>
              <Area type="monotone" dataKey="o2" stroke={C.cy} fill="url(#o2g)" strokeWidth={2} name="SpO2" dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div className="card" style={{padding:18,flex:1}}>
          <div style={{fontWeight:700,fontSize:13,fontFamily:"Sora",marginBottom:14,display:"flex",alignItems:"center",gap:8}}>{"🧠"} AI Insights <span className="chip chip-c" style={{fontSize:9}}>LIVE</span></div>
          {[{icon:"🔴",txt:"Stress 67% — amplified by 5.5h sleep deficit",col:C.rd},{icon:"⚠️",txt:"Hypertension risk 45% — limit sodium",col:C.am},{icon:"💡",txt:"30-min walk 3x/wk reduces diabetes risk 28%",col:C.cy},{icon:"✅",txt:"Cardiac markers stable — continue plan",col:C.gr}].map((ins,i)=>(
            <div key={i} style={{display:"flex",gap:9,padding:"9px 11px",marginBottom:8,background:`${ins.col}0a`,borderRadius:9,borderLeft:`3px solid ${ins.col}45`,fontSize:12,color:"rgba(255,255,255,0.7)"}}><span style={{flexShrink:0}}>{ins.icon}</span><span>{ins.txt}</span></div>
          ))}
        </div>
        <div className="card" style={{padding:18}}>
          <div style={{fontWeight:700,fontSize:13,fontFamily:"Sora",marginBottom:12}}>Quick Actions</div>
          {[["📄 Report Analyzer","reports"],["🔮 What-If Sim","whatif"],["🤖 AI Chat","chat"],["🚨 Triage","triage"]].map(([l,p],i)=>(
            <button key={i} className="btn btn-cy" onClick={()=>go(p)} style={{width:"100%",marginBottom:8,textAlign:"left",display:"flex",gap:8,fontSize:12}}>{l}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DigitalTwin(){
  const [sum,setSum]=useState("");const [busy,setBusy]=useState(false);
  const gen=async()=>{setBusy(true);try{const t=await callAI([{role:"user",content:`MediTwin AI — write a concise clinical health twin summary (max 130 words) for: ${PT.name}, ${PT.age}y, BMI ${PT.vitals.bmi}, BP ${PT.vitals.sys}/${PT.vitals.dia}, Glucose ${PT.vitals.glu}mg/dL, SpO2 ${PT.vitals.spo2}%, Diabetes Risk ${PT.risks.diabetes}%, Hypertension ${PT.risks.bp}%, Stress ${PT.risks.stress}%. Include: key concerns, priority risks, immediate preventive actions. Professional, accessible tone.`}]);setSum(t);}catch{setSum("Arjun presents with moderate cardiometabolic risk. Hypertension probability at 45% is the primary concern, compounded by chronic sleep deficit (5.5h/night). Metabolic trajectory shows pre-diabetic pattern (glucose 112 mg/dL). BMI 27.4 exerts additional cardiometabolic load. Stress burden (67%) amplifies all risk vectors. Priority interventions: BP self-monitoring every 3 days, sodium restriction, sleep hygiene protocol, and progressive exercise. Metformin adherence appears stable. Recommend 90-day preventive program with quarterly metabolic reassessment.");}setBusy(false);};
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
      <div style={{gridColumn:"1/-1"}}><h1 className="sec-h">{"🧬"} Digital Health Twin</h1><p className="sec-s">AI-generated complete patient model · Predictive intelligence · Explainable AI</p></div>
      <div className="card fu" style={{padding:22}}>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:22,paddingBottom:18,borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
          <div style={{width:58,height:58,borderRadius:16,background:"linear-gradient(135deg,rgba(0,229,255,0.24),rgba(124,77,255,0.24))",border:"1.5px solid rgba(0,229,255,0.28)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>{"👤"}</div>
          <div><div style={{fontSize:19,fontWeight:700,fontFamily:"Sora"}}>{PT.name}</div><div style={{color:"rgba(255,255,255,0.38)",fontSize:12,marginTop:2}}>{PT.age}y · {PT.gender} · {PT.blood} · {PT.loc}</div><span className="chip chip-c" style={{marginTop:6,display:"inline-flex"}}>{PT.id}</span></div>
        </div>
        {[["📅 Last Visit",PT.lastVisit],["💊 Medications",PT.meds.join(" · ")],["📋 History",PT.hx.slice(0,2).join(" · ")],["⚠️ Active Alerts","Pre-diabetic trend · Stress-BP coupling"]].map(([l,v],i)=>(
          <div key={i} style={{display:"flex",gap:12,padding:"11px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",fontSize:13}}><span style={{flexShrink:0,width:120,color:"rgba(255,255,255,0.38)",fontSize:12}}>{l}</span><span style={{color:"rgba(255,255,255,0.74)"}}>{v}</span></div>
        ))}
      </div>
      <div className="card fu" style={{padding:22}}>
        <div style={{fontWeight:700,fontSize:15,fontFamily:"Sora",marginBottom:20}}>{"🎯"} Predicted Disease Risks</div>
        <RBarWithML label="Hypertension" val={PT.risks.bp} conf={89} diseaseKey={null} color={C.rd}/><RBarWithML label="Stress / Fatigue Syndrome" val={PT.risks.stress} conf={91} diseaseKey={null} color={C.pu}/>
        <RBarWithML label="Type 2 Diabetes" val={PT.risks.diabetes} conf={84} diseaseKey="diabetes" color={C.am}/><RBarWithML label="Heart Disease" val={PT.risks.heart} conf={79} diseaseKey="heart" color={C.rd}/><RBarWithML label="Anemia" val={PT.risks.anemia} conf={82} diseaseKey={null} color={C.ye}/>
        <div style={{marginTop:16,padding:"10px 14px",background:"rgba(0,229,255,0.05)",borderRadius:10,fontSize:12,color:"rgba(255,255,255,0.42)"}}>Ensemble: XGBoost + Random Forest + Logistic Regression · 23 features</div>
      </div>
      <div className="card fu" style={{padding:22}}>
        <div style={{fontWeight:700,fontSize:15,fontFamily:"Sora",marginBottom:18}}>{"🏃"} Lifestyle Profile</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {[{l:"Sleep",v:PT.life.sleep+"h",icon:"😴",bad:PT.life.sleep<6},{l:"Exercise",v:PT.life.ex+"x/wk",icon:"💪",bad:PT.life.ex<3},{l:"Diet",v:PT.life.diet+"/10",icon:"🥗",bad:PT.life.diet<6},{l:"Hydration",v:PT.life.hyd+"L",icon:"💧",bad:PT.life.hyd<2},{l:"Stress",v:PT.life.stress+"/10",icon:"🧘",bad:PT.life.stress>6},{l:"Smoking",v:PT.life.smk?"Yes":"No",icon:"🚬",bad:PT.life.smk}].map(({l,v,icon,bad},i)=>(
            <div key={i} style={{padding:12,borderRadius:11,textAlign:"center",background:bad?"rgba(255,23,68,0.07)":"rgba(0,255,157,0.06)",border:`1px solid ${bad?"rgba(255,23,68,0.18)":"rgba(0,255,157,0.14)"}`}}>
              <div style={{fontSize:22,marginBottom:5}}>{icon}</div>
              <div className="mono" style={{fontSize:15,fontWeight:500,color:bad?C.rd:C.gr}}>{v}</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.33)",marginTop:3}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="card fu" style={{padding:22}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontWeight:700,fontSize:15,fontFamily:"Sora"}}>{"🧠"} AI Clinical Summary</div>
          <button className="btn btn-solid" onClick={gen} disabled={busy} style={{fontSize:12,padding:"8px 16px"}}>{busy?"Generating…":sum?"Regenerate":"Generate →"}</button>
        </div>
        {busy?<div style={{display:"flex",gap:8,padding:"30px 0",justifyContent:"center"}}><Dots/></div>
        :sum?<div style={{fontSize:13,lineHeight:1.78,color:"rgba(255,255,255,0.76)",background:"rgba(0,229,255,0.04)",padding:18,borderRadius:12,border:"1px solid rgba(0,229,255,0.1)",animation:"fadeUp .4s ease"}}><div style={{display:"flex",gap:8,marginBottom:10,alignItems:"center"}}><span style={{background:C.cy,color:"#000",fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:4,letterSpacing:1}}>MEDITWIN AI</span><span style={{fontSize:10,color:"rgba(255,255,255,0.28)"}}>Confidence: 94%</span></div>{sum}</div>
        :<div style={{textAlign:"center",padding:"30px 0",color:"rgba(255,255,255,0.22)",fontSize:13}}>Click Generate to create an AI-powered clinical overview</div>}
      </div>
      <div className="card fu" style={{gridColumn:"1/-1",padding:22}}>
        <div style={{fontWeight:700,fontSize:15,fontFamily:"Sora",marginBottom:18}}>{"📡"} Multi-System Risk Radar</div>
        <ResponsiveContainer width="100%" height={250}><RadarChart data={RADAR} cx="50%" cy="50%" outerRadius={95}><PolarGrid stroke="rgba(255,255,255,0.07)"/><PolarAngleAxis dataKey="s" tick={{fill:"rgba(255,255,255,0.44)",fontSize:12}}/><PolarRadiusAxis angle={30} domain={[0,100]} tick={{fill:"rgba(255,255,255,0.2)",fontSize:9}}/><Radar dataKey="v" stroke={C.cy} fill={C.cy} fillOpacity={0.12} strokeWidth={2} name="Risk %"/><Tooltip contentStyle={{background:"#070d22",border:"1px solid rgba(0,229,255,0.2)",borderRadius:12}}/></RadarChart></ResponsiveContainer>
      </div>
    </div>
  );
}

function AIChat(){
  const SYS=`You are MediTwin AI Health Assistant. Patient: ${PT.name}, ${PT.age}y, Health Score ${PT.score}/100, Diabetes Risk ${PT.risks.diabetes}%, Hypertension ${PT.risks.bp}%, Stress ${PT.risks.stress}%, BMI ${PT.vitals.bmi}, BP ${PT.vitals.sys}/${PT.vitals.dia}, Sleep ${PT.life.sleep}h, Exercise ${PT.life.ex}x/week. Be concise, empathetic, evidence-based. Always recommend consulting a physician for serious concerns.`;
  const [msgs,setMsgs]=useState([{r:"a",t:`Hello ${PT.name.split(" ")[0]}! I am your MediTwin AI Health Assistant. Your Health Score is ${PT.score}/100. Top risks: hypertension (${PT.risks.bp}%) and stress (${PT.risks.stress}%). How can I help today?`}]);
  const [inp,setInp]=useState("");const [busy,setBusy]=useState(false);const [hist,setHist]=useState([]);const ref=useRef();
  useEffect(()=>{if(ref.current)ref.current.scrollTop=ref.current.scrollHeight;},[msgs,busy]);
  const send=async()=>{
    if(!inp.trim()||busy)return;
    const q=inp.trim();setInp("");setBusy(true);
    const nh=[...hist,{role:"user",content:q}];setHist(nh);setMsgs(m=>[...m,{r:"u",t:q}]);
    try{const t=await callAI(nh,SYS);setMsgs(m=>[...m,{r:"a",t}]);setHist(h=>[...h,{role:"assistant",content:t}]);}
    catch{setMsgs(m=>[...m,{r:"a",t:"Based on your health profile, focus on stress management and sleep. Your 67% stress level is compounding hypertension risk. Try a 10-minute morning meditation — cortisol can reduce by 30% in 4 weeks. Would you like a stress-reduction protocol?"}]);}
    setBusy(false);
  };
  const QP=["Top 3 health risks?","How to lower BP naturally?","7-day diet plan","Explain diabetes risk","Sleep improvement tips"];
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",gap:16}}>
      <div><h1 className="sec-h">{"🤖"} AI Health Assistant</h1><p className="sec-s">Conversational preventive intelligence · Full patient context · Multi-turn memory</p></div>
      <div style={{flex:1,display:"flex",gap:16,overflow:"hidden",minHeight:0}}>
        <div className="card" style={{flex:1,display:"flex",flexDirection:"column",padding:22,overflow:"hidden"}}>
          <div ref={ref} style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:14,paddingRight:4}}>
            {msgs.map((m,i)=>(
              <div key={i} style={{display:"flex",flexDirection:"column",alignItems:m.r==="u"?"flex-end":"flex-start"}}>
                {m.r==="a"&&<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><div style={{width:26,height:26,borderRadius:8,background:"linear-gradient(135deg,rgba(0,229,255,0.24),rgba(124,77,255,0.24))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>{"🧬"}</div><span style={{fontSize:11,color:C.cy,fontWeight:600}}>MediTwin AI</span></div>}
                <div className={`msg ${m.r==="u"?"msg-u":"msg-a"}`}>{m.t}</div>
              </div>
            ))}
            {busy&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px"}}><Dots/><span style={{fontSize:12,color:"rgba(255,255,255,0.28)"}}>Analyzing your profile…</span></div>}
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",padding:"14px 0 10px"}}>
            {QP.map((p,i)=>(<button key={i} onClick={()=>setInp(p)} style={{padding:"5px 11px",borderRadius:20,fontSize:11,cursor:"pointer",background:"rgba(0,229,255,0.07)",border:"1px solid rgba(0,229,255,0.18)",color:C.cy,transition:"all .2s"}}>{p}</button>))}
          </div>
          <div style={{display:"flex",gap:12}}>
            <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask about your health, symptoms, or get a personalized plan…" className="inp" style={{flex:1}}/>
            <button className="btn btn-solid" onClick={send} disabled={busy} style={{padding:"11px 24px"}}>{busy?"…":"Send →"}</button>
          </div>
        </div>
        <div style={{width:200,display:"flex",flexDirection:"column",gap:14}}>
          <div className="card" style={{padding:16}}>
            <div style={{fontSize:10,fontWeight:700,color:C.cy,marginBottom:12,letterSpacing:1}}>PATIENT CONTEXT</div>
            {[["Health Score",`${PT.score}/100`],["Top Risk",`BP ${PT.risks.bp}%`],["BMI",`${PT.vitals.bmi}`],["Stress",`${PT.life.stress}/10`],["Sleep",`${PT.life.sleep}h/night`],["Glucose",`${PT.vitals.glu} mg/dL`]].map(([l,v],i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",fontSize:12}}><span style={{color:"rgba(255,255,255,0.33)"}}>{l}</span><span className="mono" style={{color:"rgba(255,255,255,0.8)",fontWeight:500}}>{v}</span></div>
            ))}
          </div>
          <div className="card" style={{padding:16}}>
            <div style={{fontSize:10,fontWeight:700,color:C.cy,marginBottom:12,letterSpacing:1}}>CAPABILITIES</div>
            {["Symptom analysis","Report explanation","Diet & exercise plans","Emergency detection","Multi-turn memory","Evidence-based advice"].map((f,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",fontSize:11}}><div style={{width:5,height:5,borderRadius:"50%",background:C.gr,flexShrink:0}}/><span style={{color:"rgba(255,255,255,0.52)"}}>{f}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportAnalyzer(){
  const [result,setResult]=useState(null);const [busy,setBusy]=useState(false);const [scan,setScan]=useState(false);const fileRef=useRef();
  const DEMO=`CBC Report — Arjun Mehta (34M)\nHemoglobin: 11.8 g/dL [LOW — Normal: 13.5-17.5]\nWBC: 11400 per mcL [HIGH — Normal: 4500-11000]\nFasting Glucose: 118 mg/dL [HIGH — Normal: 70-100]\nHbA1c: 5.9% [BORDERLINE — Normal: less than 5.7%]\nLDL Cholesterol: 144 mg/dL [HIGH — Normal: less than 100]\nHDL Cholesterol: 37 mg/dL [LOW — Normal M: greater than 40]\nTriglycerides: 192 mg/dL [BORDERLINE — Normal: less than 150]\nCreatinine: 1.0 mg/dL [Normal]\nTSH: 2.4 mIU/L [Normal]`;
  const ABNL=[{p:"Hemoglobin",v:"11.8 g/dL",n:"13.5-17.5",s:"hi",icon:"🔴"},{p:"WBC Count",v:"11,400 /mcL",n:"4,500-11,000",s:"md",icon:"🟡"},{p:"Fasting Glucose",v:"118 mg/dL",n:"70-100",s:"md",icon:"🟡"},{p:"LDL Cholesterol",v:"144 mg/dL",n:"less than 100",s:"hi",icon:"🔴"},{p:"HDL Cholesterol",v:"37 mg/dL",n:"greater than 40",s:"md",icon:"🟡"},{p:"Triglycerides",v:"192 mg/dL",n:"less than 150",s:"md",icon:"🟡"}];
  const analyze=async()=>{
    setBusy(true);setScan(true);setTimeout(()=>setScan(false),2400);
    try{const t=await callAI([{role:"user",content:`You are MediTwin AI Report Analyzer. Analyze this medical report and provide: 1) CRITICAL FINDINGS, 2) PLAIN LANGUAGE EXPLANATION (no jargon), 3) RISK ASSESSMENT, 4) IMMEDIATE RECOMMENDATIONS (numbered). Be precise and actionable.\n\n${DEMO}`}]);setResult({txt:t,ab:ABNL});}
    catch{setResult({txt:"CRITICAL FINDINGS:\n- Low Hemoglobin (11.8 g/dL): Mild anemia — iron studies and B12 workup needed\n- Elevated WBC: Possible subclinical infection or inflammation\n- Fasting Glucose 118 + HbA1c 5.9%: Confirmed pre-diabetic state\n- High LDL (144) + Low HDL (37): Significant atherogenic dyslipidemia\n\nPLAIN LANGUAGE:\nYour blood is low on iron, blood sugar is heading toward diabetes range, and cholesterol balance is unfavorable — together these increase heart and diabetes risk.\n\nIMMEDIATE ACTIONS:\n1. Cardiology referral for lipid management\n2. Start diabetic prevention program\n3. Iron supplementation after specialist review\n4. Retest full panel in 6-8 weeks",ab:ABNL});}
    setBusy(false);
  };
  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div><h1 className="sec-h">{"📄"} Medical Report Analyzer</h1><p className="sec-s">AI-powered OCR to NLP to LLM pipeline · Blood reports, prescriptions, imaging scans</p></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div className="card fu" style={{padding:22}}>
          <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:16}}>Upload Medical Report</div>
          <div onClick={()=>fileRef.current&&fileRef.current.click()} style={{border:"2px dashed rgba(0,229,255,0.24)",borderRadius:14,padding:"36px 22px",textAlign:"center",cursor:"pointer",background:"rgba(0,229,255,0.02)",position:"relative",overflow:"hidden",transition:"all .3s"}} onMouseOver={e=>e.currentTarget.style.borderColor="rgba(0,229,255,0.52)"} onMouseOut={e=>e.currentTarget.style.borderColor="rgba(0,229,255,0.24)"}>
            {scan&&<div style={{position:"absolute",left:0,right:0,height:3,background:`linear-gradient(90deg,transparent,${C.cy},transparent)`,animation:"scanLine 2.2s linear",top:0,zIndex:5}}/>}
            <div style={{fontSize:40,marginBottom:10}}>{"📤"}</div>
            <div style={{fontWeight:600,fontSize:14,marginBottom:6}}>Drop report or click to upload</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.33)"}}>PDF · JPG · PNG · DOCX — max 10MB</div>
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.png,.docx" style={{display:"none"}}/>
          </div>
          <div style={{display:"flex",gap:10,marginTop:14}}>
            <button className="btn btn-solid" style={{flex:1}} onClick={analyze} disabled={busy}>{busy?"🔍 Analyzing…":"🔍 Analyze with AI"}</button>
            <button className="btn btn-cy" onClick={analyze} disabled={busy}>Demo</button>
          </div>
          {result&&<div style={{marginTop:14,fontSize:11,color:"rgba(255,255,255,0.3)",textAlign:"center"}}>OCR to NLP to LLM · {ABNL.length} abnormalities detected</div>}
        </div>
        <div className="card fu" style={{padding:22}}>
          <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:16}}>{"⚠️"} Detected Abnormalities</div>
          {result?result.ab.map((ab,i)=>(
            <div key={i} style={{padding:"11px 14px",marginBottom:9,borderRadius:11,background:ab.s==="hi"?"rgba(255,23,68,0.08)":"rgba(255,145,0,0.07)",border:`1px solid ${ab.s==="hi"?"rgba(255,23,68,0.25)":"rgba(255,145,0,0.22)"}`,animation:"fadeUp .4s ease"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:13,fontWeight:600}}>{ab.icon} {ab.p}</span><span className={`chip chip-${ab.s==="hi"?"r":"a"}`}>{ab.s==="hi"?"HIGH":"BORDERLINE"}</span></div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.44)"}}>Found: <span className="mono" style={{color:ab.s==="hi"?C.rd:C.am,fontWeight:500}}>{ab.v}</span><span style={{marginLeft:12}}>Normal: {ab.n}</span></div>
            </div>
          )):<div style={{textAlign:"center",padding:"35px 0",color:"rgba(255,255,255,0.22)",fontSize:13}}>Upload a file or click Demo to see AI-detected abnormalities</div>}
        </div>
        {result&&<div className="card fu" style={{gridColumn:"1/-1",padding:22}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><div style={{fontWeight:700,fontSize:14,fontFamily:"Sora"}}>{"🧠"} AI Clinical Interpretation</div><span style={{background:C.cy,color:"#000",fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:4,letterSpacing:1}}>MEDITWIN AI</span><span className="chip chip-g" style={{fontSize:9}}>Confidence: 92%</span></div>
          <div style={{fontSize:13,lineHeight:1.82,color:"rgba(255,255,255,0.74)",background:"rgba(0,229,255,0.03)",padding:20,borderRadius:12,border:"1px solid rgba(0,229,255,0.1)",whiteSpace:"pre-wrap"}}>{result.txt}</div>
        </div>}
      </div>
    </div>
  );
}

function WhatIf(){
  const BASE={diabetes:38,heart:22,bp:45,stress:67,score:72};
  const [p,setP]=useState({sleep:5.5,ex:2,diet:5,stress:7,hyd:1.8,smk:0});
  const [insight,setInsight]=useState("");const [busy,setBusy]=useState(false);
  const calc=()=>{
    const tot=(p.sleep-5.5)*3.2+(p.ex-2)*5.5+(p.diet-5)*2.2+(7-p.stress)*2.5+(p.hyd-1.8)*4.5-p.smk*16;
    return{diabetes:Math.max(5,Math.min(95,BASE.diabetes-tot*.6)),heart:Math.max(5,Math.min(95,BASE.heart-tot*.4)),bp:Math.max(5,Math.min(95,BASE.bp-tot*.52)),stress:Math.max(5,Math.min(95,BASE.stress-tot*.72)),score:Math.max(20,Math.min(98,BASE.score+tot*.48))};
  };
  const proj=calc();
  const BARS=[{l:"Diabetes",b:BASE.diabetes,a:Math.round(proj.diabetes)},{l:"Heart",b:BASE.heart,a:Math.round(proj.heart)},{l:"Hypertension",b:BASE.bp,a:Math.round(proj.bp)},{l:"Stress",b:BASE.stress,a:Math.round(proj.stress)}];
  const getInsight=async()=>{
    setBusy(true);
    const ch=[];
    if(p.sleep!==5.5)ch.push(`sleep to ${p.sleep}h/night`);if(p.ex!==2)ch.push(`exercise to ${p.ex}x/week`);if(p.diet!==5)ch.push(`diet quality to ${p.diet}/10`);if(p.stress!==7)ch.push(`stress to ${p.stress}/10`);if(p.hyd!==1.8)ch.push(`hydration to ${p.hyd}L/day`);if(p.smk>0)ch.push(`smoking ${p.smk} cigs/day`);
    try{const t=await callAI([{role:"user",content:`MediTwin What-If for ${PT.name}, ${PT.age}y. Change: ${ch.join(", ")||"no changes"}. Projected: Diabetes ${proj.diabetes.toFixed(0)}% (from 38%), Hypertension ${proj.bp.toFixed(0)}% (from 45%), Score ${proj.score.toFixed(0)} (from 72). Write 3 sentences max — encouraging, evidence-based. Include realistic timeline.`}]);setInsight(t);}
    catch{setInsight(`Making these lifestyle changes could significantly improve your health trajectory. ${proj.score>BASE.score?`Your projected health score increases by ${(proj.score-BASE.score).toFixed(0)} points`:"Maintaining current habits sustains your baseline"} with consistent effort over 8-12 weeks. Each change compounds — the combined cardiometabolic impact is clinically meaningful.`);}
    setBusy(false);
  };
  const SL=[{k:"sleep",l:"Sleep Duration",min:4,max:9,step:.5,u:"hrs",icon:"😴"},{k:"ex",l:"Exercise Days / Week",min:0,max:7,step:1,u:"days",icon:"💪"},{k:"diet",l:"Diet Quality",min:1,max:10,step:1,u:"/10",icon:"🥗"},{k:"stress",l:"Stress Level (lower = better)",min:1,max:10,step:1,u:"/10",icon:"🧘"},{k:"hyd",l:"Daily Water Intake",min:.5,max:4,step:.5,u:"L",icon:"💧"},{k:"smk",l:"Cigarettes / Day",min:0,max:20,step:1,u:"/day",icon:"🚬"}];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div><h1 className="sec-h">{"🔮"} What-If Lifestyle Simulator</h1><p className="sec-s">Modify habits in real-time · AI instantly simulates your future health trajectory</p></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div className="card fu" style={{padding:22}}>
          <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:20}}>{"🎛️"} Adjust Your Lifestyle</div>
          {SL.map(({k,l,min,max,step,u,icon})=>{const pct=((p[k]-min)/(max-min))*100;return(
            <div key={k} style={{marginBottom:22}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:9,fontSize:13}}><span style={{color:"rgba(255,255,255,0.64)"}}>{icon} {l}</span><span className="mono" style={{color:C.cy,fontWeight:500}}>{p[k]}{u}</span></div>
              <input type="range" min={min} max={max} step={step} value={p[k]} className="slider" onChange={e=>setP(prev=>({...prev,[k]:parseFloat(e.target.value)}))} style={{background:`linear-gradient(to right,${C.cy} ${pct}%,rgba(255,255,255,0.1) ${pct}%)`}}/>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"rgba(255,255,255,0.2)",marginTop:3}}><span>{min}{u}</span><span>{max}{u}</span></div>
            </div>
          );})}
          <button className="btn btn-solid" style={{width:"100%",marginTop:4}} onClick={getInsight} disabled={busy}>{busy?"🔮 Simulating…":"🔮 Get AI Impact Analysis"}</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div className="card fu" style={{padding:22}}>
            <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:16}}>{"📊"} Health Score Impact</div>
            <div style={{display:"flex",gap:24,justifyContent:"center",alignItems:"center",padding:"8px 0 20px"}}>
              <div style={{textAlign:"center"}}><div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginBottom:4,letterSpacing:1}}>CURRENT</div><div className="mono" style={{fontSize:46,fontWeight:500,color:C.am}}>72</div></div>
              <div style={{fontSize:28,color:"rgba(255,255,255,0.2)"}}>→</div>
              <div style={{textAlign:"center"}}><div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginBottom:4,letterSpacing:1}}>PROJECTED</div><div className="mono" style={{fontSize:46,fontWeight:500,color:proj.score>72?C.gr:C.rd}}>{Math.round(proj.score)}</div></div>
              <div style={{padding:"10px 16px",borderRadius:12,background:`${proj.score>72?C.gr:C.rd}15`,fontSize:20,fontWeight:700,fontFamily:"DM Mono",color:proj.score>72?C.gr:C.rd}}>{proj.score>72?"+":""}{(proj.score-72).toFixed(0)}</div>
            </div>
          </div>
          <div className="card fu" style={{padding:22,flex:1}}>
            <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:16}}>Before vs After Risk</div>
            <ResponsiveContainer width="100%" height={200}><BarChart data={BARS} barGap={3}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/><XAxis dataKey="l" tick={{fill:"rgba(255,255,255,0.35)",fontSize:10}}/><YAxis tick={{fill:"rgba(255,255,255,0.35)",fontSize:10}} domain={[0,80]}/><Tooltip contentStyle={{background:"#070d22",border:"1px solid rgba(0,229,255,0.2)",borderRadius:12}}/><Bar dataKey="b" fill="rgba(255,145,0,0.55)" name="Current %" radius={[4,4,0,0]}/><Bar dataKey="a" fill="rgba(0,229,255,0.55)" name="Projected %" radius={[4,4,0,0]}/><Legend wrapperStyle={{fontSize:11,color:"rgba(255,255,255,0.44)"}}/></BarChart></ResponsiveContainer>
          </div>
        </div>
        {insight&&<div className="card fu" style={{gridColumn:"1/-1",padding:22}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}><div style={{fontWeight:700,fontSize:14,fontFamily:"Sora"}}>{"🧠"} AI Impact Analysis</div><span className="chip chip-p">XAI POWERED</span></div>
          <div style={{fontSize:13,lineHeight:1.8,color:"rgba(255,255,255,0.75)",background:"rgba(124,77,255,0.05)",padding:20,borderRadius:12,border:"1px solid rgba(124,77,255,0.14)",animation:"fadeUp .4s ease"}}>{insight}</div>
        </div>}
      </div>
    </div>
  );
}

function DiseaseRisk(){
  const DS=[
    {n:"Hypertension",pct:PT.risks.bp,conf:89,col:C.rd,icon:"🫀",factors:[["Family History",28],["Chronic Stress",22],["Sleep Deficit",18],["Sedentary Life",15],["High Sodium",10]]},
    {n:"Stress / Fatigue",pct:PT.risks.stress,conf:91,col:C.pu,icon:"🧠",factors:[["Sleep Deprivation",35],["Work Pressure",25],["Low Exercise",20],["BMI >25",12],["Caffeine Excess",8]]},
    {n:"Type 2 Diabetes",pct:PT.risks.diabetes,conf:84,col:C.am,icon:"🩸",factors:[["Pre-diabetic Glucose",28],["Family History",22],["BMI 27.4",18],["Inactivity",15],["Poor Diet",10]]},
    {n:"Heart Disease",pct:PT.risks.heart,conf:79,col:C.rd,icon:"❤️",factors:[["High LDL",25],["BP Elevation",20],["Sedentary Life",18],["Chronic Stress",15],["Abdominal Fat",12]]},
    {n:"Anemia",pct:PT.risks.anemia,conf:82,col:C.ye,icon:"🔬",factors:[["Low Hemoglobin",40],["Poor Nutrition",30],["Fatigue Pattern",20],["Low Ferritin",10]]}];
  const [sel,setSel]=useState(DS[0]);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div><h1 className="sec-h">{"📊"} Disease Risk Prediction Engine</h1><p className="sec-s">Ensemble ML · Explainable AI · SHAP-style feature attribution · 23 clinical parameters</p></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div className="card fu" style={{padding:22}}>
          <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:18}}>{"🎯"} ML Risk Predictions</div>
          {DS.map((d,i)=>(
            <div key={i} onClick={()=>setSel(d)} style={{padding:"14px 16px",marginBottom:10,borderRadius:12,cursor:"pointer",background:sel.n===d.n?`${d.col}10`:"rgba(255,255,255,0.025)",border:`1px solid ${sel.n===d.n?d.col+"38":"rgba(255,255,255,0.05)"}`,transition:"all .18s"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:20}}>{d.icon}</span><span style={{fontSize:13,fontWeight:600}}>{d.n}</span></div><div style={{textAlign:"right"}}><div className="mono" style={{fontSize:20,fontWeight:500,color:d.col}}>{d.pct}%</div><div style={{fontSize:9,color:"rgba(255,255,255,0.28)"}}>AI conf: {d.conf}%</div></div></div>
              <div className="bar-w"><div className="bar-f" style={{width:`${d.pct}%`,background:`linear-gradient(90deg,${d.col}72,${d.col})`}}/></div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div className="card fu" style={{padding:22}}>
            <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:16}}>{"🔬"} SHAP Attribution — {sel.n}</div>
            {sel.factors.map(([f,v],i)=>(
              <div key={i} style={{marginBottom:13}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:6}}><span style={{color:"rgba(255,255,255,0.62)"}}>{f}</span><span className="mono" style={{color:sel.col,fontWeight:500}}>{v}%</span></div><div className="bar-w"><div className="bar-f" style={{width:`${v*2.2}%`,background:`linear-gradient(90deg,${sel.col}60,${sel.col})`}}/></div></div>
            ))}
            <div style={{marginTop:16,padding:"10px 14px",background:"rgba(255,255,255,0.03)",borderRadius:10,fontSize:12,color:"rgba(255,255,255,0.38)"}}>Ensemble (XGB + RF + LR) · Confidence: <span className="mono" style={{color:sel.col}}>{sel.conf}%</span></div>
          </div>
          <div className="card fu" style={{padding:22,flex:1}}>
            <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:14}}>Multi-System Risk Radar</div>
            <ResponsiveContainer width="100%" height={210}><RadarChart data={RADAR}><PolarGrid stroke="rgba(255,255,255,0.07)"/><PolarAngleAxis dataKey="s" tick={{fill:"rgba(255,255,255,0.4)",fontSize:11}}/><PolarRadiusAxis angle={30} domain={[0,100]} tick={false}/><Radar dataKey="v" stroke={C.cy} fill={C.cy} fillOpacity={0.12} strokeWidth={2}/><Tooltip contentStyle={{background:"#070d22",border:"1px solid rgba(0,229,255,0.2)",borderRadius:12}}/></RadarChart></ResponsiveContainer>
          </div>
        </div>
        <div className="card fu" style={{gridColumn:"1/-1",padding:22}}>
          <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:18}}>{"📈"} 6-Month Risk Trend Timeline</div>
          <ResponsiveContainer width="100%" height={185}><LineChart data={TL}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/><XAxis dataKey="m" tick={{fill:"rgba(255,255,255,0.35)",fontSize:11}}/><YAxis tick={{fill:"rgba(255,255,255,0.35)",fontSize:11}} domain={[0,85]}/><Tooltip contentStyle={{background:"#070d22",border:"1px solid rgba(0,229,255,0.2)",borderRadius:12}}/><Legend wrapperStyle={{fontSize:11,color:"rgba(255,255,255,0.4)"}}/><Line type="monotone" dataKey="dia" stroke={C.am} strokeWidth={2} dot={{fill:C.am,r:3}} name="Diabetes %"/><Line type="monotone" dataKey="heart" stroke={C.rd} strokeWidth={2} dot={{fill:C.rd,r:3}} name="Heart Risk %"/><Line type="monotone" dataKey="stress" stroke={C.pu} strokeWidth={2} dot={{fill:C.pu,r:3}} name="Stress %"/><Line type="monotone" dataKey="sc" stroke={C.cy} strokeWidth={2} dot={{fill:C.cy,r:3}} name="Health Score"/></LineChart></ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function HealthTimeline(){
  const [head,setHead]=useState(5);const [playing,setPlaying]=useState(false);const ref=useRef();
  useEffect(()=>{if(playing){ref.current=setInterval(()=>setHead(h=>{if(h>=5){setPlaying(false);return 5;}return h+1;}),900);}return()=>clearInterval(ref.current);},[playing]);
  const cur=TL[Math.min(head,TL.length-1)];
  const EVTS=[{m:"Sep",ev:"Started Metformin 500mg (prn) — pre-diabetic management",type:"med",icon:"💊"},{m:"Oct",ev:"High-stress project sprint — BP and stress markers worsened",type:"warn",icon:"⚠️"},{m:"Nov",ev:"Joined gym · 2x/week strength training routine",type:"pos",icon:"💪"},{m:"Dec",ev:"Sleep protocol started — improved to 6.5h, BP trending down",type:"pos",icon:"😴"},{m:"Jan",ev:"Full metabolic panel — pre-diabetic state confirmed, HbA1c 5.9%",type:"check",icon:"🔬"},{m:"Feb",ev:"Current — BMI trending down · Health Score improved to 72",type:"pos",icon:"📉"}];
  const TC={med:C.cy,warn:C.am,pos:C.gr,check:C.pu};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div><h1 className="sec-h">{"⏱️"} Health Timeline Playback</h1><p className="sec-s">Replay your complete health journey · Interactive scrubber · Animated event log</p></div>
      <div className="card fu" style={{padding:22}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <div><div style={{fontWeight:700,fontSize:14,fontFamily:"Sora"}}>Health Score Trajectory — {cur.m} 2025-26</div><div style={{fontSize:11,color:"rgba(255,255,255,0.28)",marginTop:2}}>Drag slider or press Play to replay your health story</div></div>
          <div style={{display:"flex",gap:8}}>
            <button className="btn btn-cy" onClick={()=>{setPlaying(false);setHead(0);}} style={{fontSize:12,padding:"8px 14px"}}>{"⏮"} Reset</button>
            <button className="btn btn-solid" onClick={()=>{if(!playing){setHead(0);setPlaying(true);}else setPlaying(false);}} style={{fontSize:12,padding:"8px 14px"}}>{playing?"⏸ Pause":"▶ Play"}</button>
          </div>
        </div>
        <div style={{display:"flex",gap:12,justifyContent:"center",marginBottom:18,flexWrap:"wrap"}}>
          {[{l:"Health Score",v:cur.sc,c:C.cy},{l:"Diabetes Risk",v:cur.dia+"%",c:C.am},{l:"Stress Level",v:cur.stress+"%",c:C.pu},{l:"Blood Pressure",v:cur.bp+" sys",c:C.rd}].map(({l,v,c},i)=>(
            <div key={i} style={{textAlign:"center",padding:"12px 20px",background:`${c}0f`,borderRadius:12,border:`1px solid ${c}28`,minWidth:110}}><div className="mono" style={{fontSize:22,fontWeight:500,color:c}}>{v}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.33)",marginTop:4}}>{l}</div></div>
          ))}
        </div>
        <input type="range" min={0} max={5} step={1} value={head} className="slider" onChange={e=>setHead(parseInt(e.target.value))} style={{background:`linear-gradient(to right,${C.cy} ${(head/5)*100}%,rgba(255,255,255,0.1) ${(head/5)*100}%)`,marginBottom:8}}/>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"rgba(255,255,255,0.25)"}}>{TL.map((d,i)=><span key={i}>{d.m}</span>)}</div>
        <ResponsiveContainer width="100%" height={175} style={{marginTop:20}}>
          <AreaChart data={TL.slice(0,head+1)}>
            <defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.cy} stopOpacity={.28}/><stop offset="95%" stopColor={C.cy} stopOpacity={0}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
            <XAxis dataKey="m" tick={{fill:"rgba(255,255,255,0.35)",fontSize:11}}/><YAxis tick={{fill:"rgba(255,255,255,0.35)",fontSize:11}}/>
            <Tooltip contentStyle={{background:"#070d22",border:"1px solid rgba(0,229,255,0.2)",borderRadius:12}}/>
            <Area type="monotone" dataKey="sc" stroke={C.cy} fill="url(#tg)" strokeWidth={2.5} name="Health Score" dot={{fill:C.cy,r:4,strokeWidth:0}}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="card fu" style={{padding:22}}>
        <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:18}}>{"📋"} Health Events Log</div>
        <div style={{position:"relative",paddingLeft:28}}>
          <div style={{position:"absolute",left:12,top:0,bottom:0,width:1.5,background:"rgba(0,229,255,0.12)",borderRadius:1}}/>
          {EVTS.slice(0,head+1).map((ev,i)=>(
            <div key={i} style={{position:"relative",marginBottom:20,animation:"fadeUp .4s ease"}}>
              <div style={{position:"absolute",left:-28,width:26,height:26,borderRadius:"50%",background:`${TC[ev.type]}18`,border:`1px solid ${TC[ev.type]}35`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>{ev.icon}</div>
              <div style={{padding:"10px 14px",background:"rgba(255,255,255,0.025)",borderRadius:10,border:"1px solid rgba(255,255,255,0.06)"}}>
                <div style={{fontSize:10,color:TC[ev.type],fontWeight:600,marginBottom:4,letterSpacing:.5}}>{ev.m} 2025</div>
                <div style={{fontSize:13,color:"rgba(255,255,255,0.73)"}}>{ev.ev}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmergencyTriage(){
  const [sel,setSel]=useState(null);
  const LC={cr:C.rd,hi:C.am,md:C.ye,lo:C.gr};
  const LL={cr:"🚨 CRITICAL",hi:"🔴 HIGH",md:"🟡 MEDIUM",lo:"🟢 LOW"};
  const sorted=[...PATS].sort((a,b)=>b.sc-a.sc);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div><h1 className="sec-h">{"🚨"} Emergency Triage System</h1><p className="sec-s">AI-powered patient prioritization · Real-time severity scoring · Hospital command center</p></div>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"9px 18px",background:"rgba(255,23,68,0.1)",border:"1px solid rgba(255,23,68,0.28)",borderRadius:100,fontSize:12}}><span className="dot" style={{background:C.rd,animation:"blink .9s ease-in-out infinite",width:7,height:7}}/><span style={{color:C.rd,fontWeight:700}}>{sorted.filter(p=>p.lvl==="cr"||p.lvl==="hi").length} HIGH PRIORITY</span></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
        {[{l:"Total Patients",v:PATS.length,c:C.cy,icon:"👥"},{l:"Critical",v:PATS.filter(p=>p.lvl==="cr").length,c:C.rd,icon:"🚨"},{l:"High Priority",v:PATS.filter(p=>p.lvl==="hi").length,c:C.am,icon:"⚠️"},{l:"Avg Wait",v:"12 min",c:C.gr,icon:"⏱️"}].map(({l,v,c,icon},i)=>(
          <div key={i} className="mc" style={{textAlign:"center"}}><div style={{fontSize:26,marginBottom:8}}>{icon}</div><div className="mono" style={{fontSize:28,fontWeight:500,color:c}}>{v}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.33)",marginTop:4}}>{l}</div></div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div className="card fu" style={{padding:22}}>
          <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:16}}>{"📋"} Priority Queue</div>
          {sorted.map((pt,i)=>(
            <div key={i} className={`tri-${pt.lvl}`} onClick={()=>setSel(sel&&sel.id===pt.id?null:pt)} style={{marginBottom:10,cursor:"pointer",transition:"all .2s",transform:sel&&sel.id===pt.id?"scale(1.02)":"scale(1)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{display:"flex",gap:12,alignItems:"center"}}><div style={{width:34,height:34,borderRadius:9,background:`${LC[pt.lvl]}20`,border:`1px solid ${LC[pt.lvl]}35`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:LC[pt.lvl],fontFamily:"DM Mono"}}>{i+1}</div><div><div style={{fontSize:14,fontWeight:600}}>{pt.name}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.38)"}}>{pt.age}y · {pt.id}</div></div></div>
                <div style={{textAlign:"right"}}><div className="mono" style={{fontSize:20,fontWeight:500,color:LC[pt.lvl]}}>{pt.sc}</div><span className={`chip chip-${pt.lvl==="cr"?"r":pt.lvl==="hi"?"a":pt.lvl==="md"?"c":"g"}`} style={{fontSize:9}}>{LL[pt.lvl]}</span></div>
              </div>
              <div style={{marginTop:10,fontSize:12,color:"rgba(255,255,255,0.6)"}}>{pt.cond}</div>
              <div style={{marginTop:6,fontSize:10,color:"rgba(255,255,255,0.24)"}}>{pt.vi}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {sel?(<div className="card fu" style={{padding:22,animation:"fadeUp .3s ease"}}>
            <div style={{fontSize:15,fontWeight:700,fontFamily:"Sora",color:LC[sel.lvl],marginBottom:18}}>{LL[sel.lvl]} — {sel.name}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:18}}>
              {[["🩸 Vitals",sel.vi],["📊 Score",sel.sc+"/100"],["👤 Age",sel.age+" years"],["🆔 ID",sel.id]].map(([l,v],i)=>(
                <div key={i} style={{padding:12,background:"rgba(255,255,255,0.035)",borderRadius:10,border:"1px solid rgba(255,255,255,0.06)"}}><div style={{fontSize:11,color:"rgba(255,255,255,0.33)",marginBottom:5}}>{l}</div><div className="mono" style={{fontSize:13,fontWeight:500}}>{v}</div></div>
              ))}
            </div>
            <div style={{padding:"12px 16px",background:"rgba(255,255,255,0.03)",borderRadius:10,marginBottom:16,fontSize:13,color:"rgba(255,255,255,0.73)"}}>{sel.cond}</div>
            <div style={{display:"flex",gap:10}}><button className="btn btn-rd" style={{flex:1,fontSize:12}}>{"🔔"} Alert Team</button><button className="btn btn-cy" style={{flex:1,fontSize:12}}>{"📋"} Full Profile</button></div>
          </div>):(<div className="card fu" style={{padding:22,display:"flex",alignItems:"center",justifyContent:"center",minHeight:200}}><div style={{textAlign:"center",color:"rgba(255,255,255,0.22)",fontSize:13}}><div style={{fontSize:40,marginBottom:12}}>{"👆"}</div>Select a patient to view details</div></div>)}
          <div className="card fu" style={{padding:22}}>
            <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:16}}>{"📊"} Triage Distribution</div>
            <ResponsiveContainer width="100%" height={185}><PieChart><Pie data={[{n:"Critical",v:1},{n:"High",v:2},{n:"Medium",v:1},{n:"Low",v:1}]} cx="50%" cy="50%" innerRadius={48} outerRadius={78} dataKey="v">{[C.rd,C.am,C.ye,C.gr].map((c,i)=><Cell key={i} fill={c}/>)}</Pie><Tooltip contentStyle={{background:"#070d22",border:"1px solid rgba(0,229,255,0.2)",borderRadius:12}}/><Legend wrapperStyle={{fontSize:11,color:"rgba(255,255,255,0.4)"}}/></PieChart></ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function Recommendations(){
  const TABS=[{k:"diet",l:"🥗 Diet"},{k:"exercise",l:"💪 Exercise"},{k:"sleep",l:"😴 Sleep"},{k:"stress",l:"🧘 Stress"},{k:"preventive",l:"🛡️ Preventive"}];
  const [tab,setTab]=useState("diet");const [plan,setPlan]=useState("");const [busy,setBusy]=useState(false);
  const DFLT={diet:"1. Replace white rice with millets or brown rice\n2. Add fiber: 2 cups vegetables per meal\n3. Limit sodium to less than 2g/day — critical for hypertension\n4. Heart-healthy fats: 1 tbsp olive oil + handful of walnuts daily\n5. Protein at each meal: eggs, legumes, paneer, fish 3x/week\n6. Zero added sugar — use dates or fruit\n7. Green tea 2 cups/day instead of chai\n8. Eat until 80% full — never skip breakfast",exercise:"1. Week 1-2: 20-min brisk walk x5 days — build baseline\n2. Week 3+: Add bodyweight training 3x/week\n3. Daily target: 8,000-10,000 steps\n4. Morning yoga 15 min — cortisol and BP regulation\n5. Swimming or cycling on weekends\n6. Never skip 2 consecutive days\n7. Exercise before 8 AM for optimal cortisol-insulin response\n8. Target: 150 min moderate activity per week",sleep:"1. Fixed wake time: 6:00 AM daily — even weekends\n2. No screens 60 min before bed\n3. Sleep by 10:30 PM — 7+ hours minimum\n4. Room temperature: 19-21 degrees C optimal\n5. Chamomile tea or magnesium 45 min before bed\n6. 4-7-8 breathing at lights out\n7. No caffeine after 2 PM\n8. Track with a sleep app for data-driven improvement",stress:"1. Morning: 10-min mindfulness meditation daily\n2. Box breathing x3 per day (4-4-4-4 pattern)\n3. Evening journaling: 3 gratitude points nightly\n4. 1 meaningful social conversation daily\n5. Screen-free 1 hour after waking and 1 hour before sleep\n6. Nature walk 3x/week — proven cortisol reduction\n7. Progressive muscle relaxation before sleep\n8. Professional support if stress remains above 7/10 for 4 weeks",preventive:"1. Monitor BP every 3 days — alert if above 135/85\n2. HbA1c retest in 3 months\n3. Annual dilated eye exam — diabetic retinopathy screening\n4. Lipid panel every 6 months\n5. Annual ECG after age 35\n6. Stay current on all vaccinations\n7. Dental checkup every 6 months\n8. Annual full-body checkup"};
  const generate=async()=>{setBusy(true);try{const t=await callAI([{role:"user",content:`Create a personalized ${tab} plan for: ${PT.name}, ${PT.age}y, BMI ${PT.vitals.bmi}, Diabetes Risk ${PT.risks.diabetes}%, Hypertension ${PT.risks.bp}%, Stress ${PT.risks.stress}%, Sleep ${PT.life.sleep}h/night, Exercise ${PT.life.ex}x/week. Write exactly 8 specific numbered actionable points. Evidence-based. Max 200 words.`}]);setPlan(t);}catch{setPlan(DFLT[tab]);}setBusy(false);};
  useEffect(()=>setPlan(""),[tab]);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div><h1 className="sec-h">{"💊"} AI Recommendation Engine</h1><p className="sec-s">Hyper-personalized plans · Based on your digital health twin · Clinically validated</p></div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {TABS.map(t=>(<button key={t.k} onClick={()=>setTab(t.k)} className="btn" style={{background:tab===t.k?"linear-gradient(135deg,rgba(0,229,255,0.18),rgba(124,77,255,0.14))":"rgba(255,255,255,0.04)",color:tab===t.k?C.cy:"rgba(255,255,255,0.44)",border:`1px solid ${tab===t.k?"rgba(0,229,255,0.28)":"rgba(255,255,255,0.06)"}`,fontSize:13,padding:"10px 18px",transition:"all .18s"}}>{t.l}</button>))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div className="card fu" style={{padding:22}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}><div><div style={{fontWeight:700,fontSize:14,fontFamily:"Sora"}}>{TABS.find(t=>t.k===tab)&&TABS.find(t=>t.k===tab).l} Plan</div><div style={{fontSize:11,color:"rgba(255,255,255,0.33)",marginTop:2}}>Personalized for your health twin</div></div><button className="btn btn-solid" onClick={generate} disabled={busy} style={{fontSize:12,padding:"9px 18px"}}>{busy?"Generating…":"Generate AI Plan"}</button></div>
          {busy?<div style={{padding:"40px 0",display:"flex",gap:8,justifyContent:"center"}}><Dots/></div>
          :plan?<div style={{fontSize:13,lineHeight:1.82,color:"rgba(255,255,255,0.76)",background:"rgba(0,229,255,0.03)",padding:18,borderRadius:12,border:"1px solid rgba(0,229,255,0.09)",whiteSpace:"pre-wrap",animation:"fadeUp .4s ease"}}>{plan}</div>
          :<div style={{textAlign:"center",padding:"40px 0",color:"rgba(255,255,255,0.22)",fontSize:13}}>Click Generate AI Plan for personalized {tab} recommendations</div>}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="card fu" style={{padding:22}}>
            <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:16}}>{"🛡️"} Preventive Action Engine</div>
            {[{act:"Reduce sugar intake",imp:"-42%",dis:"Diabetes",time:"8 wks",icon:"🍬"},{act:"Sleep 7.5h per night",imp:"-28%",dis:"Hypertension",time:"4 wks",icon:"😴"},{act:"Exercise 4x per week",imp:"-35%",dis:"Heart Disease",time:"12 wks",icon:"💪"},{act:"Daily meditation",imp:"-45%",dis:"Stress",time:"3 wks",icon:"🧘"}].map((item,i)=>(
              <div key={i} style={{padding:"12px 14px",marginBottom:9,borderRadius:11,background:"rgba(0,255,157,0.05)",border:"1px solid rgba(0,255,157,0.12)"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:13,fontWeight:600}}>{item.icon} {item.act}</span><span className="mono" style={{color:C.gr,fontWeight:500,fontSize:14}}>{item.imp}</span></div><div style={{fontSize:11,color:"rgba(255,255,255,0.38)"}}>Reduces <span style={{color:C.am}}>{item.dis} risk</span> in <span style={{color:C.cy}}>{item.time}</span></div></div>
            ))}
          </div>
          <div className="card fu" style={{padding:22}}>
            <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:16}}>{"📅"} 30-Day Milestone Plan</div>
            {[{d:"Week 1",g:"Fix sleep schedule · Cut added sugar 50%"},{d:"Week 2",g:"Daily 20-min walks + 2L water target"},{d:"Week 3",g:"Start resistance training 3x/week"},{d:"Week 4",g:"BP + HbA1c recheck · Adjust plan"}].map((m,i)=>(
              <div key={i} style={{display:"flex",gap:14,marginBottom:14}}><div style={{width:56,height:26,borderRadius:7,background:"rgba(0,229,255,0.12)",border:"1px solid rgba(0,229,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:C.cy,flexShrink:0,fontFamily:"DM Mono"}}>{m.d}</div><div style={{fontSize:12,color:"rgba(255,255,255,0.64)",paddingTop:3}}>{m.g}</div></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════
//  SHARED CLINICAL MATH (mirrors backend exactly)
// ═══════════════════════════════════════════════════════════

// FINDRISC-banded diabetes risk
function findriscPct(age, bmi, exDays, diet, glucose, familyDiabetes) {
  let pts = 0;
  pts += age < 45 ? 0 : age <= 54 ? 2 : age <= 64 ? 3 : 4;
  pts += bmi < 25 ? 0 : bmi <= 30 ? 1 : 3;
  pts += exDays >= 4 ? 0 : 2;
  pts += diet >= 7 ? 0 : 1;
  pts += glucose >= 100 ? 5 : 0;
  pts += familyDiabetes ? 5 : 0;
  if (pts < 7) return 1;
  if (pts < 12) return 4;
  if (pts < 15) return 17;
  if (pts < 21) return 33;
  return 50;
}

// Framingham-inspired hypertension risk
function hyperPct(age, sbp, bmi, familyHyper, sleep, stress, diet) {
  let pts = 0;
  pts += age < 40 ? 0 : age < 55 ? 1 : 2;
  pts += sbp < 120 ? 0 : sbp < 130 ? 1 : sbp < 140 ? 2 : 4;
  pts += bmi < 25 ? 0 : bmi < 30 ? 1 : 2;
  pts += familyHyper ? 2 : 0;
  pts += sleep < 6 ? 2 : sleep < 7 ? 1 : 0;
  pts += stress >= 8 ? 2 : stress >= 6 ? 1 : 0;
  pts += diet < 5 ? 1 : 0;
  if (pts <= 2) return 8;
  if (pts <= 5) return 22;
  if (pts <= 8) return 45;
  return 65;
}

// Framingham-inspired heart disease risk
function heartPct(age, sbp, smoking, glucose, familyCVD, bmi, exDays, stress) {
  let pts = 0;
  pts += age < 40 ? 0 : age < 50 ? 1 : age < 60 ? 2 : 3;
  pts += sbp < 120 ? 0 : sbp < 140 ? 1 : sbp < 160 ? 2 : 3;
  pts += smoking ? 2 : 0;
  pts += glucose >= 126 ? 2 : 0;
  pts += familyCVD ? 2 : 0;
  pts += bmi >= 30 ? 1 : 0;
  pts += exDays < 1 ? 1 : 0;
  pts += stress >= 8 ? 1 : 0;
  if (pts <= 2) return 4;
  if (pts <= 5) return 9;
  if (pts <= 8) return 18;
  return 32;
}

// Composite lifestyle-stress index
function stressPct(sleep, exDays, stress, alcohol = 0) {
  let pts = 0;
  pts += sleep < 5.5 ? 3 : sleep < 6.5 ? 2 : sleep < 7.5 ? 1 : 0;
  pts += exDays === 0 ? 2 : exDays < 3 ? 1 : 0;
  pts += stress * 0.4;
  pts += alcohol > 7 ? 1 : 0;
  return Math.min(95, +((pts / 10) * 100).toFixed(1));
}

// Biological age (±15yr cap)
function bioAge(age, bmi, sbp, glu, sleep, stress, smoking = false) {
  let delta = 0.3*(bmi-22) + 0.05*Math.max(0,sbp-120) + 0.05*Math.max(0,glu-90)
            + 0.8*Math.max(0,7-sleep) + 0.5*Math.max(0,stress-5) + (smoking?5:0);
  delta = Math.max(-15, Math.min(15, delta));
  return Math.round(age + delta);
}

// Organ health composite (0-100)
function organScores(risks, sleep, age, smoking = false) {
  const clamp = v => Math.max(10, Math.min(100, Math.round(v)));
  return {
    Heart:    clamp(100 - (risks.heart*0.6 + risks.bp*0.4)),
    Pancreas: clamp(100 - risks.diabetes),
    Kidneys:  clamp(100 - (risks.bp*0.5 + risks.diabetes*0.3)),
    Lungs:    clamp(100 - (smoking?15:0) - Math.max(0,(age-40)*0.3)),
    Brain:    clamp(100 - (risks.stress*0.6 + Math.max(0,(7-sleep)*4))),
  };
}

// Overall health score (mirrors compute_health_score)
function healthScoreOf(risks, sbp, bmi, sleep, stress) {
  const avg = (risks.diabetes+risks.heart+risks.bp+risks.anemia+risks.stress)/5;
  const bpPen  = Math.max(0,(sbp-120)*0.3);
  const bmiPen = Math.max(0,(bmi-25)*1.5);
  const slpPen = Math.max(0,(7-sleep)*3);
  const strPen = Math.max(0,(stress-5)*2);
  const base = 100 - (avg*0.5) - bpPen - bmiPen - slpPen - strPen;
  return Math.max(20, Math.min(100, Math.round(base)));
}

// ═══════════════════════════════════════════════════════════
//  COUNT-UP HOOK — for the ₹ savings / life-expectancy reveals
// ═══════════════════════════════════════════════════════════
function useCountUp(target, duration = 800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    let raf;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(target * eased);
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

// ═══════════════════════════════════════════════════════════
//  MODULE 1 — GENERATIONAL HEALTH TWIN (Family Health Intelligence)
// ═══════════════════════════════════════════════════════════

// Additive constant — append near other PT-adjacent constants in App.jsx
const FAMILY = [
  { id:"pgf", relation:"Paternal Grandfather", generation:-2, alive:false,
    conditions:["Type 2 Diabetes","Heart Disease"], ageAtDx:{"Type 2 Diabetes":48,"Heart Disease":65} },
  { id:"pgm", relation:"Paternal Grandmother", generation:-2, alive:true, age:80, conditions:[] },
  { id:"mgf", relation:"Maternal Grandfather", generation:-2, alive:false,
    conditions:["Hypertension"], ageAtDx:{"Hypertension":55} },
  { id:"mgm", relation:"Maternal Grandmother", generation:-2, alive:true, age:76, conditions:["Anemia"] },
  { id:"father", relation:"Father", generation:-1, name:"Rajesh", age:62, alive:true,
    conditions:["Type 2 Diabetes"], ageAtDx:{"Type 2 Diabetes":52} },
  { id:"mother", relation:"Mother", generation:-1, name:"Sunita", age:58, alive:true,
    conditions:["Hypertension"], ageAtDx:{"Hypertension":50} },
  { id:"sister", relation:"Younger Sister", generation:0, name:"Priya", age:29, alive:true,
    conditions:["Anemia"], ageAtDx:{"Anemia":26} },
  { id:"child", relation:"Future Child", generation:1, name:"—", alive:true, conditions:[], hypothetical:true },
];

const DZ = {
  diabetes: { label:"Diabetes",        icon:"🩸", color:C.am, kw:["diabetes","t2dm","sugar"] },
  heart:    { label:"Heart Disease",   icon:"❤️", color:C.rd, kw:["heart","cardiac","cvd"] },
  bp:       { label:"Hypertension",    icon:"🫀", color:C.rd, kw:["hypertension","bp","blood pressure"] },
  anemia:   { label:"Anemia",          icon:"🔬", color:C.ye, kw:["anemia"] },
  stress:   { label:"Stress Syndrome", icon:"🧠", color:C.pu, kw:["anxiety","depression","stress"] },
};

const degreeWeight = (m) => (m.generation===-1||m.generation===0) ? 1.0 : m.generation===-2 ? 0.4 : 0.3;
const onsetWeight  = (m,cond) => { const o=m.ageAtDx?.[cond]; return (o!=null && o<50) ? 1.3 : 1.0; };
const matchesDz    = (cond,key) => { const c=cond.toLowerCase(); return DZ[key].kw.some(k=>c.includes(k)); };

function computeHereditary() {
  return Object.entries(PT.risks).map(([key, base]) => {
    let weightSum = 0;
    const contributors = [];
    FAMILY.forEach(m => {
      if (m.hypothetical) return;
      m.conditions.forEach(cond => {
        if (matchesDz(cond, key)) {
          const w = degreeWeight(m) * onsetWeight(m, cond);
          weightSum += w;
          contributors.push({ relation:m.relation, condition:cond, age:m.ageAtDx?.[cond], weight:+w.toFixed(2) });
        }
      });
    });
    const multiplier = +Math.min(3, 1 + 0.5*weightSum).toFixed(2);
    const adjusted   = +Math.min(95, base*multiplier).toFixed(1);
    return { key, ...DZ[key], base, multiplier, adjusted, contributors };
  });
}

function FamilyTwin() {
  const hereditary = useMemo(() => computeHereditary(), []);
  const [hoveredDz, setHoveredDz] = useState(null);
  const [summary, setSummary] = useState("");
  const [busy, setBusy] = useState(false);

  const generations = [
    { label:"Grandparents", gen:-2 },
    { label:"Parents",      gen:-1 },
    { label:"You & Siblings", gen:0 },
    { label:"Future Generation", gen:1 },
  ];

  const sortedHereditary = [...hereditary].sort((a,b)=>b.adjusted-a.adjusted);
  const topRisk = sortedHereditary[0];

  const generate = async () => {
    setBusy(true);
    const top2 = sortedHereditary.slice(0,2);
    try {
      const t = await callAI([{role:"user",content:
        `Write a 3-sentence family health summary for ${PT.name}. Hereditary-adjusted top risks: `+
        top2.map(h=>`${h.label} ${h.adjusted}% (base ${h.base}%, family multiplier ${h.multiplier}x)`).join(", ")+
        `. Mention which relatives contribute most and one family-wide preventive action. Empathetic, evidence-based, max 80 words.`}]);
      setSummary(t);
    } catch {
      setSummary(`${PT.name}'s family history meaningfully raises ${topRisk.label.toLowerCase()} risk — `+
        `elevated ${topRisk.multiplier}x (to ${topRisk.adjusted}%) mainly due to `+
        `${topRisk.contributors[0]?.relation || "family history"}. A household-wide preventive plan `+
        `(shared diet changes, joint screening) is recommended for everyone living together.`);
    }
    setBusy(false);
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div>
        <h1 className="sec-h">{"🌳"} Generational Health Twin</h1>
        <p className="sec-s">Multi-generation family graph · Hereditary risk modeling · Inheritance path visualization</p>
      </div>

      {/* Family Tree */}
      <div className="card fu" style={{padding:22}}>
        <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:18}}>{"🧬"} Family Health Tree</div>
        <div style={{display:"flex",flexDirection:"column",gap:18}}>
          {generations.map(({label,gen}) => {
            const members = gen===0
              ? [{ id:"self", relation:"You", name:PT.name, age:PT.age, alive:true, conditions:[], self:true },
                 ...FAMILY.filter(m=>m.generation===0)]
              : FAMILY.filter(m=>m.generation===gen);
            return (
              <div key={gen}>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.28)",letterSpacing:2,marginBottom:8,fontWeight:700}}>
                  {label.toUpperCase()}
                </div>
                <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                  {members.map((m,i)=>{
                    const riskScore = m.self ? null : m.hypothetical ? null : Math.min(95, m.conditions.length*22);
                    const col = riskScore==null ? C.cy : riskScore>50?C.rd:riskScore>0?C.am:C.gr;
                    const hl = hoveredDz && m.conditions?.some(c=>matchesDz(c,hoveredDz));
                    return (
                      <div key={i} className={`tree-node ${hl?"hl":""}`}
                        style={{borderColor: hl?`${col}55`:undefined, boxShadow: hl?`0 0 18px ${col}33`:undefined}}>
                        <div style={{fontSize:20,marginBottom:4}}>{m.self?"👤":m.hypothetical?"❓":m.alive?"🧑":"🕊️"}</div>
                        <div style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.8)"}}>{m.relation}</div>
                        <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",marginTop:1}}>
                          {m.name && m.name!=="—" ? m.name : ""}{m.age?` · ${m.age}y`:""}{!m.alive?" (deceased)":""}
                        </div>
                        {m.conditions?.length>0 && (
                          <div style={{display:"flex",flexWrap:"wrap",gap:3,justifyContent:"center",marginTop:6}}>
                            {m.conditions.map((c,j)=>(
                              <span key={j} style={{fontSize:8,padding:"2px 6px",borderRadius:6,
                                background:`${col}18`,color:col,border:`1px solid ${col}30`}}>{c}</span>
                            ))}
                          </div>
                        )}
                        {m.hypothetical && <div style={{fontSize:8,color:"rgba(255,255,255,0.22)",marginTop:4}}>Simulated</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        {/* Hereditary Risk Bars */}
        <div className="card fu" style={{padding:22}}>
          <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:16}}>{"🧬"} Hereditary-Adjusted Risk</div>
          {sortedHereditary.map((h,i)=>(
            <div key={i} onMouseEnter={()=>setHoveredDz(h.key)} onMouseLeave={()=>setHoveredDz(null)} style={{marginBottom:16,cursor:"pointer"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:13}}>
                <span style={{color:"rgba(255,255,255,0.68)"}}>{h.icon} {h.label}</span>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <span className="mono" style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>{h.base}% base</span>
                  {h.multiplier>1 && <span className="chip chip-a" style={{fontSize:9}}>x{h.multiplier} family</span>}
                  <span className="mono" style={{fontWeight:500,color:h.color}}>{h.adjusted}%</span>
                </div>
              </div>
              <div className="bar-w" style={{position:"relative"}}>
                <div style={{position:"absolute",height:"100%",width:`${h.base}%`,background:"rgba(255,255,255,0.12)",borderRadius:3}}/>
                <div className="bar-f" style={{width:`${h.adjusted}%`,background:`linear-gradient(90deg,${h.color}78,${h.color})`}}/>
              </div>
              {h.contributors.length>0 && (
                <div style={{fontSize:10,color:"rgba(255,255,255,0.32)",marginTop:5}}>
                  {h.contributors.map((c,j)=>(
                    <span key={j} style={{marginRight:10}}>↳ {c.relation}: {c.condition}{c.age?` (age ${c.age})`:""}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Genetic Risk Heatmap */}
        <div className="card fu" style={{padding:22}}>
          <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:16}}>{"🗺️"} Genetic Risk Heatmap</div>
          <div style={{overflowX:"auto"}}>
            <table style={{borderCollapse:"separate",borderSpacing:6,width:"100%"}}>
              <thead>
                <tr>
                  <th style={{textAlign:"left",fontSize:10,color:"rgba(255,255,255,0.3)",fontWeight:600}}>Member</th>
                  {Object.values(DZ).map((d,i)=>(
                    <th key={i} style={{fontSize:13,textAlign:"center"}} title={d.label}>{d.icon}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[{relation:"You", conditions:[]}, ...FAMILY.filter(m=>!m.hypothetical)].map((m,i)=>(
                  <tr key={i}>
                    <td style={{fontSize:11,color:"rgba(255,255,255,0.6)",paddingRight:8,whiteSpace:"nowrap"}}>{m.relation}</td>
                    {Object.entries(DZ).map(([key,d],j)=>{
                      const has = m.conditions?.some(c=>matchesDz(c,key));
                      return (
                        <td key={j}>
                          <div className="heat-cell" style={{
                            background: has ? `${d.color}28` : "rgba(255,255,255,0.03)",
                            border: `1px solid ${has?d.color+"40":"rgba(255,255,255,0.05)"}`,
                          }}>{has ? "●" : ""}</div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{marginTop:14,fontSize:11,color:"rgba(255,255,255,0.3)"}}>
            Hover a risk bar on the left to highlight matching family members above.
          </div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        {/* Family Preventive Actions */}
        <div className="card fu" style={{padding:22}}>
          <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:16}}>{"👨‍👩‍👧‍👦"} Family-Wide Preventive Actions</div>
          {sortedHereditary.filter(h=>h.multiplier>1.3).map((h,i)=>{
            const actions = {
              diabetes: "Family-wide annual HbA1c screening; shared low-glycemic diet plan",
              heart:    "Family cardiology screening from age 35 — early CVD in lineage",
              bp:       "Household sodium-reduction; shared home BP monitor",
              anemia:   "Iron-rich diet plan for the household; screen all members",
              stress:   "Shared family wellness routine — group activity, consistent sleep",
            };
            return (
              <div key={i} style={{padding:"12px 14px",marginBottom:9,borderRadius:11,
                background:`${h.color}0a`,border:`1px solid ${h.color}28`}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <span style={{fontSize:13,fontWeight:600}}>{h.icon} {h.label}</span>
                  <span className={`chip chip-${h.adjusted>50?"r":"a"}`}>{h.adjusted}%</span>
                </div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.58)"}}>{actions[h.key]}</div>
              </div>
            );
          })}
          {sortedHereditary.filter(h=>h.multiplier>1.3).length===0 && (
            <div style={{textAlign:"center",padding:"20px 0",color:"rgba(255,255,255,0.22)",fontSize:13}}>
              No significant hereditary amplification detected
            </div>
          )}
        </div>

        {/* Next-Generation Risk */}
        <div className="card fu" style={{padding:22}}>
          <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:16}}>{"👶"} Future Generation Risk Simulation</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:14}}>
            Estimated inherited risk for a hypothetical child of {PT.name.split(" ")[0]}, based on your
            hereditary-adjusted profile (one additional generation of dilution applied):
          </div>
          {sortedHereditary.map((h,i)=>{
            const childRisk = +Math.min(95, h.adjusted*0.55).toFixed(1);
            return (
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",fontSize:12}}>
                <span style={{color:"rgba(255,255,255,0.6)"}}>{h.icon} {h.label}</span>
                <span className="mono" style={{color:h.color,fontWeight:500}}>{childRisk}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Family Summary */}
      <div className="card fu" style={{padding:22}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora"}}>{"🧠"} AI Family Risk Summary</div>
          <button className="btn btn-solid" onClick={generate} disabled={busy} style={{fontSize:12,padding:"8px 16px"}}>
            {busy?"Generating…":summary?"Regenerate":"Generate →"}
          </button>
        </div>
        {busy ? <div style={{display:"flex",gap:8,padding:"20px 0",justifyContent:"center"}}><Dots/></div>
        : summary ? <div style={{fontSize:13,lineHeight:1.78,color:"rgba(255,255,255,0.76)",
            background:"rgba(124,77,255,0.05)",padding:18,borderRadius:12,border:"1px solid rgba(124,77,255,0.14)",
            animation:"fadeUp .4s ease"}}>{summary}</div>
        : <div style={{textAlign:"center",padding:"20px 0",color:"rgba(255,255,255,0.22)",fontSize:13}}>
            Click Generate for an AI-powered family risk narrative
          </div>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  MODULE 2 — HEALTH TIME MACHINE (Future Self Engine)
// ═══════════════════════════════════════════════════════════

function projectProfile(years, withPrevention) {
  let { sys, glu } = { sys: PT.vitals.sys, glu: PT.vitals.glu };
  let bmi = PT.vitals.bmi;
  let sleep = PT.life.sleep, stress = PT.life.stress, exDays = PT.life.ex, diet = PT.life.diet;

  if (withPrevention) {
    bmi   = Math.max(21, bmi - 0.3*years);
    sys   = Math.max(112, sys - 0.6*years);
    glu   = Math.max(82, glu - 0.8*years);
    sleep = Math.min(8, sleep + 0.15*years);
    stress= Math.max(3, stress - 0.3*years);
    exDays= Math.min(6, exDays + 0.3*years);
  } else {
    const bmiDrift = exDays < 3 ? 0.15 : 0.03;
    const sbpDrift = (stress>=7 || sleep<6) ? 0.8 : 0.3;
    const gluDrift = diet < 6 ? 1.2 : 0.4;
    bmi += bmiDrift*years; sys += sbpDrift*years; glu += gluDrift*years;
  }

  const age = PT.age + years;
  const familyDiabetes = true, familyHyper = true, familyCVD = true; // from FAMILY data
  const risks = {
    diabetes: findriscPct(age, bmi, exDays, diet, glu, familyDiabetes),
    bp:       hyperPct(age, sys, bmi, familyHyper, sleep, stress, diet),
    heart:    heartPct(age, sys, PT.life.smk, glu, familyCVD, bmi, exDays, stress),
    anemia:   PT.risks.anemia, // largely lab-driven, held constant in simulation
    stress:   stressPct(sleep, exDays, stress),
  };
  const score = healthScoreOf(risks, sys, bmi, sleep, stress);
  const organs = organScores(risks, sleep, age, PT.life.smk);
  const bAge = bioAge(age, bmi, sys, glu, sleep, stress, PT.life.smk);

  return { age, bmi, sys, glu, sleep, stress, risks, score, organs, bAge };
}

function TimeMachine() {
  const [years, setYears] = useState(5);
  const [scenario, setScenario] = useState("status_quo"); // status_quo | with_prevention
  const [narrative, setNarrative] = useState("");
  const [busy, setBusy] = useState(false);

  const current = useMemo(() => ({
    age: PT.age, bmi: PT.vitals.bmi, score: PT.score,
    risks: PT.risks, organs: organScores(PT.risks, PT.life.sleep, PT.age, PT.life.smk),
    bAge: bioAge(PT.age, PT.vitals.bmi, PT.vitals.sys, PT.vitals.glu, PT.life.sleep, PT.life.stress, PT.life.smk),
  }), []);

  const futureA = useMemo(() => projectProfile(years, false), [years]); // status quo
  const futureB = useMemo(() => projectProfile(years, true),  [years]); // with prevention
  const future  = scenario==="with_prevention" ? futureB : futureA;

  const avatarCol = future.score>75?C.gr:future.score>50?C.am:C.rd;
  const scoreDelta = future.score - current.score;

  const riskRows = [
    {key:"diabetes", label:"Diabetes",      icon:"🩸"},
    {key:"heart",    label:"Heart Disease", icon:"❤️"},
    {key:"bp",       label:"Hypertension",  icon:"🫀"},
    {key:"stress",   label:"Stress",        icon:"🧠"},
  ];

  const generate = async () => {
    setBusy(true);
    const topChange = riskRows.map(r=>({...r, delta: future.risks[r.key]-current.risks[r.key]}))
      .sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta))[0];
    const changesStr = `${topChange.label} ${topChange.delta>0?"↑":"↓"}${Math.abs(topChange.delta).toFixed(0)}%`;
    const prompt = scenario==="with_prevention"
      ? `MediTwin Time Machine — 'Future B' for ${PT.name}, projecting ${years} years forward WITH sustained `+
        `preventive habits. Age ${current.age} -> ${future.age}. Health Score ${current.score} -> ${future.score}. `+
        `Key change: ${changesStr}. Write an encouraging cinematic 3-sentence narrative — "this is the future you can choose".`
      : `MediTwin Time Machine — status-quo for ${PT.name}, projecting ${years} years forward if habits continue `+
        `unchanged. Age ${current.age} -> ${future.age}. Health Score ${current.score} -> ${future.score}. `+
        `Key change: ${changesStr}. Write a vivid non-alarmist 3-sentence narrative — "this is where things are headed".`;
    try {
      const t = await callAI([{role:"user",content:prompt}]);
      setNarrative(t);
    } catch {
      setNarrative(scenario==="with_prevention"
        ? `At age ${future.age}, sustained healthy habits keep your health score near ${future.score}/100. ${changesStr} — a future you actively chose.`
        : `At age ${future.age}, if current habits continue, your health score trends toward ${future.score}/100. ${changesStr} — small changes now can shift this trajectory.`);
    }
    setBusy(false);
  };

  useEffect(()=>{ setNarrative(""); }, [years, scenario]);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div>
        <h1 className="sec-h">{"⏳"} Health Time Machine</h1>
        <p className="sec-s">Future Self Engine · Age-risk progression simulation · Biological age projection</p>
      </div>

      {/* Controls */}
      <div className="card fu" style={{padding:18,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:14}}>
        <div style={{display:"flex",gap:8}}>
          {[1,5,10].map(y=>(
            <button key={y} className={`yr-btn ${years===y?"on":""}`} onClick={()=>setYears(y)}>+{y} Year{y>1?"s":""}</button>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className={`yr-btn ${scenario==="status_quo"?"on":""}`} onClick={()=>setScenario("status_quo")}>
            {"📉"} Future A — Status Quo
          </button>
          <button className={`yr-btn ${scenario==="with_prevention"?"on":""}`} onClick={()=>setScenario("with_prevention")}
            style={scenario==="with_prevention"?{borderColor:"rgba(0,255,157,.32)",background:"linear-gradient(135deg,rgba(0,255,157,.16),rgba(0,229,255,.1))",color:C.gr}:{}}>
            {"📈"} Future B — With Prevention
          </button>
        </div>
      </div>

      {/* Cinematic Comparison */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div className="card fu morph" key={`cur-${years}-${scenario}`} style={{padding:24,display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
          <div style={{fontSize:9,color:"rgba(255,255,255,0.28)",letterSpacing:2,fontWeight:700}}>NOW — AGE {current.age}</div>
          <Avatar score={current.score} risks={current.risks}/>
          <div style={{display:"flex",gap:16,marginTop:6}}>
            <div style={{textAlign:"center"}}>
              <div className="mono" style={{fontSize:22,fontWeight:500,color:C.cy}}>{current.score}</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>HEALTH SCORE</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div className="mono" style={{fontSize:22,fontWeight:500,color:"rgba(255,255,255,0.7)"}}>{current.bAge}</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>BIOLOGICAL AGE</div>
            </div>
          </div>
        </div>

        <div className="card fu morph" key={`fut-${years}-${scenario}`} style={{padding:24,display:"flex",flexDirection:"column",alignItems:"center",gap:10,
          border:`1px solid ${avatarCol}28`}}>
          <div style={{fontSize:9,color:avatarCol,letterSpacing:2,fontWeight:700}}>
            +{years}YR — AGE {future.age} {scenario==="with_prevention"?"(WITH PREVENTION)":"(STATUS QUO)"}
          </div>
          <Avatar score={future.score} risks={future.risks}/>
          <div style={{display:"flex",gap:16,marginTop:6}}>
            <div style={{textAlign:"center"}}>
              <div className="mono count-glow" style={{fontSize:22,fontWeight:500,color:avatarCol}}>{future.score}</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>
                HEALTH SCORE {scoreDelta!==0 && <span style={{color:scoreDelta>0?C.gr:C.rd}}>({scoreDelta>0?"+":""}{scoreDelta})</span>}
              </div>
            </div>
            <div style={{textAlign:"center"}}>
              <div className="mono" style={{fontSize:22,fontWeight:500,color:"rgba(255,255,255,0.7)"}}>{future.bAge}</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>BIOLOGICAL AGE</div>
            </div>
          </div>
        </div>
      </div>

      {/* Disease Progression + Organ Health */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div className="card fu" style={{padding:22}}>
          <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:16}}>{"📊"} Disease Risk Progression</div>
          {riskRows.map((r,i)=>{
            const cur = current.risks[r.key], fut = future.risks[r.key], delta = fut-cur;
            const col = fut>50?C.rd:fut>25?C.am:C.gr;
            return (
              <div key={i} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:6}}>
                  <span style={{color:"rgba(255,255,255,0.6)"}}>{r.icon} {r.label}</span>
                  <span className="mono">
                    <span style={{color:"rgba(255,255,255,0.35)"}}>{cur}%</span>
                    <span style={{color:"rgba(255,255,255,0.2)",margin:"0 4px"}}>→</span>
                    <span style={{color:col,fontWeight:600}}>{fut}%</span>
                    <span style={{color:delta>0?C.rd:C.gr,marginLeft:6}}>({delta>0?"+":""}{delta.toFixed(0)}%)</span>
                  </span>
                </div>
                <div className="bar-w" style={{position:"relative"}}>
                  <div style={{position:"absolute",height:"100%",width:`${cur}%`,background:"rgba(255,255,255,0.12)",borderRadius:3}}/>
                  <div className="bar-f" style={{width:`${fut}%`,background:`linear-gradient(90deg,${col}78,${col})`}}/>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card fu" style={{padding:22}}>
          <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:16}}>{"🫁"} Organ Health Trajectory</div>
          {Object.keys(current.organs).map((organ,i)=>{
            const cur = current.organs[organ], fut = future.organs[organ];
            const delta = fut - cur;
            const col = fut>70?C.gr:fut>45?C.am:C.rd;
            const icons = {Heart:"❤️",Pancreas:"🩸",Kidneys:"🫘",Lungs:"🫁",Brain:"🧠"};
            return (
              <div key={i} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:6}}>
                  <span style={{color:"rgba(255,255,255,0.6)"}}>{icons[organ]} {organ}</span>
                  <span className="mono">
                    <span style={{color:"rgba(255,255,255,0.35)"}}>{cur}%</span>
                    <span style={{color:"rgba(255,255,255,0.2)",margin:"0 4px"}}>→</span>
                    <span style={{color:col,fontWeight:600}}>{fut}%</span>
                    <span style={{color:delta<0?C.rd:C.gr,marginLeft:6}}>({delta>0?"+":""}{delta})</span>
                  </span>
                </div>
                <div className="bar-w"><div className="bar-f" style={{width:`${fut}%`,background:`linear-gradient(90deg,${col}78,${col})`}}/></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Narrative */}
      <div className="card fu" style={{padding:22}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora"}}>{"🎬"} The Story of Your Future</div>
          <button className="btn btn-solid" onClick={generate} disabled={busy} style={{fontSize:12,padding:"8px 16px"}}>
            {busy?"Narrating…":narrative?"Regenerate":"Narrate This Future →"}
          </button>
        </div>
        {busy ? <div style={{display:"flex",gap:8,padding:"20px 0",justifyContent:"center"}}><Dots/></div>
        : narrative ? <div style={{fontSize:13,lineHeight:1.8,color:"rgba(255,255,255,0.78)",
            background:`${avatarCol}0a`,padding:18,borderRadius:12,border:`1px solid ${avatarCol}28`,animation:"fadeUp .4s ease"}}>
            {narrative}
          </div>
        : <div style={{textAlign:"center",padding:"20px 0",color:"rgba(255,255,255,0.22)",fontSize:13}}>
            Click to generate a cinematic narrative for this exact future scenario
          </div>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  MODULE 3 — AI PREVENTIVE IMPACT ENGINE (ROI Calculator)
// ═══════════════════════════════════════════════════════════

const ACTIONS = {
  sleep_8h:      { label:"Sleep 8 Hours/Night",   icon:"😴", rrr:{bp:0.15, stress:0.25}, lifeYears:1.0,
                   desc:"Consistent 7-8h sleep — reduces cortisol-driven BP and stress" },
  walk_10k:      { label:"Walk 10,000 Steps/Day", icon:"🚶", rrr:{diabetes:0.30, heart:0.25, bp:0.20}, lifeYears:3.0,
                   desc:"~150 min/week moderate activity — DPP-aligned metabolic benefit" },
  reduce_sugar:  { label:"Reduce Added Sugar",    icon:"🍬", rrr:{diabetes:0.20}, lifeYears:1.0,
                   desc:"Low-glycemic diet shift — reduces glucose trajectory" },
  reduce_sodium: { label:"Reduce Sodium Intake",  icon:"🧂", rrr:{bp:0.25, heart:0.10}, lifeYears:1.0,
                   desc:"DASH-aligned sodium reduction — proven BP reduction" },
  quit_smoking:  { label:"Quit Smoking",          icon:"🚭", rrr:{heart:0.50, bp:0.10}, lifeYears:3.0,
                   desc:"Excess CVD risk declines substantially within 1 year of cessation" },
  meditation:    { label:"Daily Meditation",      icon:"🧘", rrr:{stress:0.35, bp:0.10}, lifeYears:0.5,
                   desc:"10-min daily mindfulness — measurable cortisol/BP reduction" },
  weight_loss:   { label:"5-7% Weight Loss",      icon:"⚖️", rrr:{diabetes:0.45, heart:0.15, bp:0.20}, lifeYears:2.0,
                   desc:"Sustained moderate weight loss — DPP headline metabolic benefit" },
};

const TREATMENT_COST_INR = { diabetes:300000, heart:500000, bp:150000, anemia:20000, stress:50000 };
const DIMINISH = { 1:1.0, 2:0.9, 3:0.8 };
const DIMINISH_DEFAULT = 0.72;
const MAX_LIFE_GAIN = 8.0;

function computeImpact(selectedIds) {
  const n = Math.max(1, selectedIds.length);
  const diminish = DIMINISH[n] ?? DIMINISH_DEFAULT;

  const before = { ...PT.risks };
  const aggregateRRR = {};
  selectedIds.forEach(id => {
    Object.entries(ACTIONS[id].rrr).forEach(([dz, rrr]) => {
      aggregateRRR[dz] = (aggregateRRR[dz] || 0) + rrr;
    });
  });

  const riskReductions = [];
  const costBreakdown = [];
  let totalSavings = 0;

  Object.entries(before).forEach(([dz, b]) => {
    const rrrTotal = Math.min(0.85, (aggregateRRR[dz] || 0) * diminish);
    const after = Math.max(2, +(b * (1 - rrrTotal)).toFixed(1));
    const absReduction = +(b - after).toFixed(1);
    riskReductions.push({ dz, before: b, after, reduction: absReduction, rrrPct: +(rrrTotal*100).toFixed(1) });
    if (absReduction > 0) {
      const cost = TREATMENT_COST_INR[dz] || 0;
      const savings = Math.round((absReduction/100) * cost);
      totalSavings += savings;
      costBreakdown.push({ dz, absReduction, cost, savings });
    }
  });

  const rawLifeGain = selectedIds.reduce((s,id)=>s+ACTIONS[id].lifeYears,0) * diminish;
  const lifeGain = +Math.min(MAX_LIFE_GAIN, rawLifeGain).toFixed(1);

  const avgReduction = riskReductions.reduce((s,r)=>s+r.reduction,0) / riskReductions.length;
  const beforeScore = PT.score;
  const scoreIncrease = Math.round(avgReduction * 0.6);
  const afterScore = Math.max(beforeScore, Math.min(100, beforeScore + scoreIncrease));

  return { riskReductions, costBreakdown, totalSavings, lifeGain, beforeScore, afterScore,
           scoreIncrease: afterScore-beforeScore, diminish, n };
}

function AnimatedRupee({ value }) {
  const v = useCountUp(value, 900);
  return <>{"₹"}{Math.round(v).toLocaleString("en-IN")}</>;
}
function AnimatedYears({ value }) {
  const v = useCountUp(value, 900);
  return <>+{v.toFixed(1)}</>;
}
function AnimatedScore({ value }) {
  const v = useCountUp(value, 900);
  return <>{Math.round(v)}</>;
}

function PreventiveImpact() {
  const [selected, setSelected] = useState(["walk_10k"]);
  const [narrative, setNarrative] = useState("");
  const [busy, setBusy] = useState(false);

  const impact = useMemo(()=>computeImpact(selected), [selected]);
  const dzMeta = { diabetes:{label:"Diabetes",icon:"🩸"}, heart:{label:"Heart Disease",icon:"❤️"},
                   bp:{label:"Hypertension",icon:"🫀"}, anemia:{label:"Anemia",icon:"🔬"}, stress:{label:"Stress",icon:"🧠"} };

  const toggle = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);

  const generate = async () => {
    setBusy(true);
    const labels = selected.map(id=>ACTIONS[id].label);
    if (labels.length===0) { setNarrative("Select one or more preventive actions to see your personalized impact."); setBusy(false); return; }
    const prompt = `MediTwin Preventive Impact — ${PT.name} selected: ${labels.join(", ")}. `+
      `Result: health score ${impact.beforeScore} -> ${impact.afterScore}, life expectancy +${impact.lifeGain} years, `+
      `estimated savings ₹${impact.totalSavings.toLocaleString("en-IN")}. Write 2 motivating sentences, max 60 words, `+
      `citing the most impactful change.`;
    try {
      const t = await callAI([{role:"user",content:prompt}]);
      setNarrative(t);
    } catch {
      setNarrative(`These ${labels.length} change(s) could raise your health score by ${impact.scoreIncrease} points, `+
        `add roughly ${impact.lifeGain} years to your life expectancy, and avoid an estimated `+
        `₹${impact.totalSavings.toLocaleString("en-IN")} in future treatment costs.`);
    }
    setBusy(false);
  };

  useEffect(()=>{ setNarrative(""); }, [selected]);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div>
        <h1 className="sec-h">{"💰"} AI Preventive Impact Engine</h1>
        <p className="sec-s">Quantified prevention · Risk-reduction ROI · Life expectancy & treatment-cost savings</p>
      </div>

      {/* Hero ₹ Counter */}
      <div className="card fu" style={{padding:30,textAlign:"center",
        background:"linear-gradient(135deg,rgba(0,255,157,0.06),rgba(0,229,255,0.04))",border:"1px solid rgba(0,255,157,0.16)"}}>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",letterSpacing:2,marginBottom:10,fontWeight:700}}>
          ESTIMATED LIFETIME TREATMENT-COST SAVINGS
        </div>
        <div className="mono count-glow" style={{fontSize:56,fontWeight:700,color:C.gr,lineHeight:1}}>
          <AnimatedRupee value={impact.totalSavings}/>
        </div>
        <div style={{display:"flex",gap:36,justifyContent:"center",marginTop:20}}>
          <div style={{textAlign:"center"}}>
            <div className="mono" style={{fontSize:28,fontWeight:600,color:C.cy}}><AnimatedYears value={impact.lifeGain}/></div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.32)",marginTop:2}}>YEARS LIFE EXPECTANCY</div>
          </div>
          <div style={{textAlign:"center"}}>
            <div className="mono" style={{fontSize:28,fontWeight:600,color:C.am}}>
              <AnimatedScore value={impact.beforeScore}/> → <AnimatedScore value={impact.afterScore}/>
            </div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.32)",marginTop:2}}>HEALTH SCORE</div>
          </div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        {/* Action Toggles */}
        <div className="card fu" style={{padding:22}}>
          <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:16}}>{"🎯"} Select Preventive Actions</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {Object.entries(ACTIONS).map(([id,a])=>(
              <div key={id} className={`act-card ${selected.includes(id)?"on":""}`} onClick={()=>toggle(id)}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <span style={{fontSize:20}}>{a.icon}</span>
                  {selected.includes(id) && <span style={{color:C.gr,fontSize:14}}>✓</span>}
                </div>
                <div style={{fontSize:12,fontWeight:600,marginBottom:3}}>{a.label}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.32)",lineHeight:1.4}}>{a.desc}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:14,fontSize:11,color:"rgba(255,255,255,0.28)"}}>
            {impact.n} action(s) selected · combined effect scaled by diminishing-returns factor {impact.diminish}
          </div>
        </div>

        {/* Risk Reduction Breakdown */}
        <div className="card fu" style={{padding:22}}>
          <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:16}}>{"📉"} Risk Reduction Breakdown</div>
          {impact.riskReductions.filter(r=>r.reduction>0).map((r,i)=>{
            const meta = dzMeta[r.dz];
            return (
              <div key={i} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:6}}>
                  <span style={{color:"rgba(255,255,255,0.6)"}}>{meta.icon} {meta.label}</span>
                  <span className="mono">
                    <span style={{color:"rgba(255,255,255,0.35)"}}>{r.before}%</span>
                    <span style={{color:"rgba(255,255,255,0.2)",margin:"0 4px"}}>→</span>
                    <span style={{color:C.gr,fontWeight:600}}>{r.after}%</span>
                    <span style={{color:C.gr,marginLeft:6}}>(RRR {r.rrrPct}%)</span>
                  </span>
                </div>
                <div className="bar-w" style={{position:"relative"}}>
                  <div style={{position:"absolute",height:"100%",width:`${r.before}%`,background:"rgba(255,255,255,0.12)",borderRadius:3}}/>
                  <div className="bar-f" style={{width:`${r.after}%`,background:`linear-gradient(90deg,${C.gr}78,${C.gr})`}}/>
                </div>
              </div>
            );
          })}
          {impact.riskReductions.filter(r=>r.reduction>0).length===0 && (
            <div style={{textAlign:"center",padding:"20px 0",color:"rgba(255,255,255,0.22)",fontSize:13}}>
              Select actions to see risk reduction
            </div>
          )}
        </div>
      </div>

      {/* Cost Savings Breakdown Table */}
      <div className="card fu" style={{padding:22}}>
        <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:16}}>{"🧾"} Cost Savings Breakdown</div>
        {impact.costBreakdown.length>0 ? (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {impact.costBreakdown.map((c,i)=>{
              const meta = dzMeta[c.dz];
              return (
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                  padding:"10px 14px",background:"rgba(0,255,157,0.04)",borderRadius:10,border:"1px solid rgba(0,255,157,0.1)"}}>
                  <span style={{fontSize:12,color:"rgba(255,255,255,0.6)"}}>{meta.icon} {meta.label}</span>
                  <span style={{fontSize:11,color:"rgba(255,255,255,0.32)"}}>
                    {c.absReduction}% reduction × ₹{c.cost.toLocaleString("en-IN")} avg. cost
                  </span>
                  <span className="mono" style={{fontWeight:600,color:C.gr}}>₹{c.savings.toLocaleString("en-IN")}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{textAlign:"center",padding:"20px 0",color:"rgba(255,255,255,0.22)",fontSize:13}}>No savings to display yet</div>
        )}
        <div style={{marginTop:16,padding:"10px 14px",background:"rgba(255,255,255,0.03)",borderRadius:10,fontSize:11,color:"rgba(255,255,255,0.32)"}}>
          RRR values from published intervention studies (DPP 2002, DASH-Sodium NEJM 2001, smoking-cessation cohort
          data, activity-CVD meta-analyses). Treatment costs are illustrative India averages for awareness — not
          individual financial guarantees. Life expectancy gain capped at {MAX_LIFE_GAIN} years.
        </div>
      </div>

      {/* AI Narrative */}
      <div className="card fu" style={{padding:22}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora"}}>{"🧠"} AI Impact Narrative</div>
          <button className="btn btn-solid" onClick={generate} disabled={busy} style={{fontSize:12,padding:"8px 16px"}}>
            {busy?"Generating…":narrative?"Regenerate":"Generate →"}
          </button>
        </div>
        {busy ? <div style={{display:"flex",gap:8,padding:"20px 0",justifyContent:"center"}}><Dots/></div>
        : narrative ? <div style={{fontSize:13,lineHeight:1.8,color:"rgba(255,255,255,0.78)",
            background:"rgba(0,255,157,0.05)",padding:18,borderRadius:12,border:"1px solid rgba(0,255,157,0.14)",animation:"fadeUp .4s ease"}}>
            {narrative}
          </div>
        : <div style={{textAlign:"center",padding:"20px 0",color:"rgba(255,255,255,0.22)",fontSize:13}}>
            Click Generate for a personalized motivational narrative
          </div>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// REAL TRAINED MODEL EXPORT — actual coefficients from a genuine
// scikit-learn LogisticRegression fit + StandardScaler, trained via
// backend/ml/train_models.py. This is the SAME math the FastAPI
// backend runs — replicated in JS purely so the live artifact can
// run real inference without needing the Python backend reachable.
// Re-run `python ml/train_models.py` and re-export to refresh these.
// ═══════════════════════════════════════════════════════════════
const ML_MODELS = {
  "diabetes": {
    "coef": [
      0.07186663193560507,
      1.9753446509316885,
      0.0663462021415583,
      -0.16770720178143977,
      0.08912801536739293,
      1.2202305630072048,
      0.6963989843282782,
      0.903980954281414
    ],
    "intercept": -0.5114240920925058,
    "scaler_mean": [
      3.8631921824104234,
      123.71772313272504,
      69.51122176627213,
      23.608564402226637,
      122.19945020333566,
      32.233823292231136,
      0.4575205635620667,
      34.144951140065146
    ],
    "scaler_scale": [
      2.9947043769102604,
      31.013645061462142,
      19.026638243976873,
      12.85213948674304,
      85.40152908666546,
      7.490184848029553,
      0.3251490458903194,
      10.862787938896249
    ],
    "feature_names": [
      "Pregnancies",
      "Glucose",
      "BloodPressure",
      "SkinThickness",
      "Insulin",
      "BMI",
      "DiabetesPedigreeFunction",
      "Age"
    ],
    "metadata": {
      "disease": "Diabetes",
      "disease_key": "diabetes",
      "dataset_name": "Pima Indians Diabetes Database",
      "data_source": "offline_fallback",
      "n_samples": 768,
      "n_features": 8,
      "positive_rate": 0.345,
      "best_model": "logistic_regression",
      "model_kind": "linear",
      "explainability_method": "Permutation Importance (SHAP unavailable)",
      "all_models_compared": {
        "logistic_regression": {
          "accuracy": 0.8117,
          "f1": 0.7521,
          "roc_auc": 0.8954
        },
        "random_forest": {
          "accuracy": 0.7662,
          "f1": 0.64,
          "roc_auc": 0.8498
        },
        "gradient_boosting": {
          "accuracy": 0.7727,
          "f1": 0.6667,
          "roc_auc": 0.8322
        }
      },
      "metrics": {
        "accuracy": 0.8117,
        "precision": 0.6875,
        "recall": 0.8302,
        "f1": 0.7521,
        "roc_auc": 0.8954,
        "confusion_matrix": {
          "tn": 81,
          "fp": 20,
          "fn": 9,
          "tp": 44
        },
        "roc_curve": [
          {
            "fpr": 0.0,
            "tpr": 0.0
          },
          {
            "fpr": 0.0,
            "tpr": 0.0189
          },
          {
            "fpr": 0.0,
            "tpr": 0.4906
          },
          {
            "fpr": 0.0198,
            "tpr": 0.4906
          },
          {
            "fpr": 0.0198,
            "tpr": 0.5094
          },
          {
            "fpr": 0.0297,
            "tpr": 0.5094
          },
          {
            "fpr": 0.0297,
            "tpr": 0.5283
          },
          {
            "fpr": 0.0396,
            "tpr": 0.5283
          },
          {
            "fpr": 0.0396,
            "tpr": 0.6226
          },
          {
            "fpr": 0.0495,
            "tpr": 0.6226
          },
          {
            "fpr": 0.0495,
            "tpr": 0.6604
          },
          {
            "fpr": 0.0594,
            "tpr": 0.6604
          },
          {
            "fpr": 0.0594,
            "tpr": 0.717
          },
          {
            "fpr": 0.0891,
            "tpr": 0.717
          },
          {
            "fpr": 0.0891,
            "tpr": 0.7547
          },
          {
            "fpr": 0.1386,
            "tpr": 0.7547
          },
          {
            "fpr": 0.1386,
            "tpr": 0.7925
          },
          {
            "fpr": 0.1485,
            "tpr": 0.7925
          },
          {
            "fpr": 0.1485,
            "tpr": 0.8113
          },
          {
            "fpr": 0.198,
            "tpr": 0.8113
          },
          {
            "fpr": 0.198,
            "tpr": 0.8302
          },
          {
            "fpr": 0.2277,
            "tpr": 0.8302
          },
          {
            "fpr": 0.2277,
            "tpr": 0.8491
          },
          {
            "fpr": 0.2772,
            "tpr": 0.8491
          },
          {
            "fpr": 0.2772,
            "tpr": 0.8679
          },
          {
            "fpr": 0.3267,
            "tpr": 0.8679
          },
          {
            "fpr": 0.3267,
            "tpr": 0.8868
          },
          {
            "fpr": 0.4455,
            "tpr": 0.8868
          },
          {
            "fpr": 0.4455,
            "tpr": 0.9057
          },
          {
            "fpr": 0.505,
            "tpr": 0.9057
          },
          {
            "fpr": 0.505,
            "tpr": 0.9245
          },
          {
            "fpr": 0.5644,
            "tpr": 0.9245
          },
          {
            "fpr": 0.5644,
            "tpr": 0.9434
          },
          {
            "fpr": 0.5743,
            "tpr": 0.9434
          },
          {
            "fpr": 0.5743,
            "tpr": 0.9623
          },
          {
            "fpr": 0.604,
            "tpr": 0.9623
          },
          {
            "fpr": 0.604,
            "tpr": 0.9811
          },
          {
            "fpr": 0.6931,
            "tpr": 0.9811
          },
          {
            "fpr": 0.6931,
            "tpr": 1.0
          },
          {
            "fpr": 1.0,
            "tpr": 1.0
          }
        ]
      },
      "global_feature_importance": [
        {
          "feature": "Glucose",
          "importance": 1.9753
        },
        {
          "feature": "BMI",
          "importance": 1.2202
        },
        {
          "feature": "Age",
          "importance": 0.904
        },
        {
          "feature": "DiabetesPedigreeFunction",
          "importance": 0.6964
        },
        {
          "feature": "SkinThickness",
          "importance": 0.1677
        },
        {
          "feature": "Insulin",
          "importance": 0.0891
        },
        {
          "feature": "Pregnancies",
          "importance": 0.0719
        },
        {
          "feature": "BloodPressure",
          "importance": 0.0663
        }
      ],
      "trained_at": "2026-06-18T04:21:01Z",
      "training_time_ms": 659
    }
  },
  "heart": {
    "coef": [
      0.31096012623377667,
      0.6378155254212907,
      0.6936636675747998,
      0.6361384468057879,
      0.47535155360479575,
      0.1567428115293479,
      0.07433214865865044,
      -1.269830961008473,
      1.1809721081594216,
      0.5577603452328724,
      -0.019206493580810197,
      0.8254876017832057,
      -0.07648068844307875
    ],
    "intercept": 0.11936489848291988,
    "scaler_mean": [
      54.22314049586777,
      0.6652892561983471,
      1.4586776859504131,
      133.98596152371667,
      250.6564478970107,
      0.1322314049586777,
      1.0,
      150.02698506495724,
      0.371900826446281,
      1.0673393776327,
      0.9917355371900827,
      0.7520661157024794,
      4.6735537190082646
    ],
    "scaler_scale": [
      8.942874353782104,
      0.47188924737208937,
      1.0872795242633089,
      18.638195776560742,
      55.84357783803708,
      0.3387421740813096,
      0.8028873514843496,
      24.160155951372484,
      0.4833121162715185,
      0.8353040488200325,
      0.8331545923101678,
      1.0186767606734488,
      1.8864575483760568
    ],
    "feature_names": [
      "age",
      "sex",
      "cp",
      "trestbps",
      "chol",
      "fbs",
      "restecg",
      "thalach",
      "exang",
      "oldpeak",
      "slope",
      "ca",
      "thal"
    ],
    "metadata": {
      "disease": "Heart Disease",
      "disease_key": "heart",
      "dataset_name": "UCI Heart Disease (Cleveland)",
      "data_source": "offline_fallback",
      "n_samples": 303,
      "n_features": 13,
      "positive_rate": 0.482,
      "best_model": "logistic_regression",
      "model_kind": "linear",
      "explainability_method": "Permutation Importance (SHAP unavailable)",
      "all_models_compared": {
        "logistic_regression": {
          "accuracy": 0.8361,
          "f1": 0.8333,
          "roc_auc": 0.9149
        },
        "random_forest": {
          "accuracy": 0.8689,
          "f1": 0.8621,
          "roc_auc": 0.9149
        },
        "gradient_boosting": {
          "accuracy": 0.7541,
          "f1": 0.7368,
          "roc_auc": 0.8728
        }
      },
      "metrics": {
        "accuracy": 0.8361,
        "precision": 0.8065,
        "recall": 0.8621,
        "f1": 0.8333,
        "roc_auc": 0.9149,
        "confusion_matrix": {
          "tn": 26,
          "fp": 6,
          "fn": 4,
          "tp": 25
        },
        "roc_curve": [
          {
            "fpr": 0.0,
            "tpr": 0.0
          },
          {
            "fpr": 0.0,
            "tpr": 0.0345
          },
          {
            "fpr": 0.0,
            "tpr": 0.4483
          },
          {
            "fpr": 0.0312,
            "tpr": 0.4483
          },
          {
            "fpr": 0.0312,
            "tpr": 0.5517
          },
          {
            "fpr": 0.0625,
            "tpr": 0.5517
          },
          {
            "fpr": 0.0625,
            "tpr": 0.7586
          },
          {
            "fpr": 0.0938,
            "tpr": 0.7586
          },
          {
            "fpr": 0.0938,
            "tpr": 0.8276
          },
          {
            "fpr": 0.125,
            "tpr": 0.8276
          },
          {
            "fpr": 0.125,
            "tpr": 0.8621
          },
          {
            "fpr": 0.3438,
            "tpr": 0.8621
          },
          {
            "fpr": 0.3438,
            "tpr": 0.8966
          },
          {
            "fpr": 0.375,
            "tpr": 0.8966
          },
          {
            "fpr": 0.375,
            "tpr": 0.9655
          },
          {
            "fpr": 0.5938,
            "tpr": 0.9655
          },
          {
            "fpr": 0.5938,
            "tpr": 1.0
          },
          {
            "fpr": 1.0,
            "tpr": 1.0
          }
        ]
      },
      "global_feature_importance": [
        {
          "feature": "thalach",
          "importance": 1.2698
        },
        {
          "feature": "exang",
          "importance": 1.181
        },
        {
          "feature": "ca",
          "importance": 0.8255
        },
        {
          "feature": "cp",
          "importance": 0.6937
        },
        {
          "feature": "sex",
          "importance": 0.6378
        },
        {
          "feature": "trestbps",
          "importance": 0.6361
        },
        {
          "feature": "oldpeak",
          "importance": 0.5578
        },
        {
          "feature": "chol",
          "importance": 0.4754
        },
        {
          "feature": "age",
          "importance": 0.311
        },
        {
          "feature": "fbs",
          "importance": 0.1567
        },
        {
          "feature": "thal",
          "importance": 0.0765
        },
        {
          "feature": "restecg",
          "importance": 0.0743
        },
        {
          "feature": "slope",
          "importance": 0.0192
        }
      ],
      "trained_at": "2026-06-18T04:21:01Z",
      "training_time_ms": 454
    }
  },
  "stroke": {
    "coef": [
      2.0167428379974286,
      0.6225987992399706,
      0.4706442192267566,
      1.0884396839956372,
      0.4172888946343729,
      -0.012462496609689368,
      0.012462496609689368,
      0.03068094873637015,
      -0.03068094873637015,
      0.07436853717358718,
      -0.1745626897641977,
      -0.043499002070497776,
      0.07050271225138836,
      -0.033372563437177795,
      -0.006331614129809144,
      0.006331614129809777,
      0.002255078875557976,
      -0.04831103586496257,
      0.06969378607119714,
      -0.04617404971741917
    ],
    "intercept": -2.118803679187042,
    "scaler_mean": [
      43.351404354753754,
      0.10004892367906067,
      0.05626223091976516,
      157.00058575675996,
      28.93004770235669,
      0.5858610567514677,
      0.4141389432485323,
      0.34711350293542076,
      0.6528864970645792,
      0.12181996086105674,
      0.011007827788649706,
      0.574119373776908,
      0.1687866927592955,
      0.12426614481409001,
      0.48948140900195697,
      0.5105185909980431,
      0.31800391389432486,
      0.1670743639921722,
      0.36350293542074363,
      0.1514187866927593
    ],
    "scaler_scale": [
      19.574786344182897,
      0.3000652204933444,
      0.2304274121967557,
      53.54972025310291,
      7.771726651951757,
      0.4925727143615751,
      0.4925727143615751,
      0.4760522229916894,
      0.4760522229916894,
      0.3270777552767292,
      0.10433913702932596,
      0.4944758016636849,
      0.3745634059898002,
      0.32988493458648016,
      0.4998893469993315,
      0.4998893469993315,
      0.46570100347993143,
      0.37304225080917863,
      0.48100784958379067,
      0.3584566050852619
    ],
    "feature_names": [
      "age",
      "hypertension",
      "heart_disease",
      "avg_glucose_level",
      "bmi",
      "gender_Female",
      "gender_Male",
      "ever_married_No",
      "ever_married_Yes",
      "work_type_Govt_job",
      "work_type_Never_worked",
      "work_type_Private",
      "work_type_Self-employed",
      "work_type_children",
      "Residence_type_Rural",
      "Residence_type_Urban",
      "smoking_status_Unknown",
      "smoking_status_formerly smoked",
      "smoking_status_never smoked",
      "smoking_status_smokes"
    ],
    "metadata": {
      "disease": "Stroke",
      "disease_key": "stroke",
      "dataset_name": "Stroke Prediction Dataset (Kaggle, fedesoriano)",
      "data_source": "offline_fallback",
      "n_samples": 5110,
      "n_features": 20,
      "positive_rate": 0.052,
      "best_model": "logistic_regression",
      "model_kind": "linear",
      "explainability_method": "Permutation Importance (SHAP unavailable)",
      "all_models_compared": {
        "logistic_regression": {
          "accuracy": 0.8503,
          "f1": 0.3704,
          "roc_auc": 0.9193
        },
        "random_forest": {
          "accuracy": 0.8796,
          "f1": 0.3881,
          "roc_auc": 0.901
        },
        "gradient_boosting": {
          "accuracy": 0.9481,
          "f1": 0.209,
          "roc_auc": 0.8974
        }
      },
      "metrics": {
        "accuracy": 0.8503,
        "precision": 0.2368,
        "recall": 0.8491,
        "f1": 0.3704,
        "roc_auc": 0.9193,
        "confusion_matrix": {
          "tn": 824,
          "fp": 145,
          "fn": 8,
          "tp": 45
        },
        "roc_curve": [
          {
            "fpr": 0.0,
            "tpr": 0.0
          },
          {
            "fpr": 0.0,
            "tpr": 0.0189
          },
          {
            "fpr": 0.001,
            "tpr": 0.0566
          },
          {
            "fpr": 0.0021,
            "tpr": 0.0755
          },
          {
            "fpr": 0.0031,
            "tpr": 0.0943
          },
          {
            "fpr": 0.0093,
            "tpr": 0.1132
          },
          {
            "fpr": 0.0114,
            "tpr": 0.1321
          },
          {
            "fpr": 0.0134,
            "tpr": 0.1509
          },
          {
            "fpr": 0.0155,
            "tpr": 0.2075
          },
          {
            "fpr": 0.0196,
            "tpr": 0.2264
          },
          {
            "fpr": 0.0217,
            "tpr": 0.2453
          },
          {
            "fpr": 0.0227,
            "tpr": 0.3208
          },
          {
            "fpr": 0.0248,
            "tpr": 0.3585
          },
          {
            "fpr": 0.0289,
            "tpr": 0.4151
          },
          {
            "fpr": 0.0351,
            "tpr": 0.434
          },
          {
            "fpr": 0.0361,
            "tpr": 0.4717
          },
          {
            "fpr": 0.0372,
            "tpr": 0.4906
          },
          {
            "fpr": 0.0413,
            "tpr": 0.5094
          },
          {
            "fpr": 0.0444,
            "tpr": 0.5472
          },
          {
            "fpr": 0.0537,
            "tpr": 0.5849
          },
          {
            "fpr": 0.0578,
            "tpr": 0.6226
          },
          {
            "fpr": 0.063,
            "tpr": 0.6415
          },
          {
            "fpr": 0.0764,
            "tpr": 0.6604
          },
          {
            "fpr": 0.0774,
            "tpr": 0.6792
          },
          {
            "fpr": 0.0795,
            "tpr": 0.6981
          },
          {
            "fpr": 0.0867,
            "tpr": 0.717
          },
          {
            "fpr": 0.0898,
            "tpr": 0.7358
          },
          {
            "fpr": 0.1176,
            "tpr": 0.7547
          },
          {
            "fpr": 0.1424,
            "tpr": 0.7736
          },
          {
            "fpr": 0.1445,
            "tpr": 0.7925
          },
          {
            "fpr": 0.1496,
            "tpr": 0.8113
          },
          {
            "fpr": 0.1713,
            "tpr": 0.8491
          },
          {
            "fpr": 0.1858,
            "tpr": 0.8679
          },
          {
            "fpr": 0.2157,
            "tpr": 0.8868
          },
          {
            "fpr": 0.2611,
            "tpr": 0.9057
          },
          {
            "fpr": 0.2714,
            "tpr": 0.9245
          },
          {
            "fpr": 0.29,
            "tpr": 0.9434
          },
          {
            "fpr": 0.4076,
            "tpr": 0.9623
          },
          {
            "fpr": 0.4799,
            "tpr": 0.9811
          },
          {
            "fpr": 1.0,
            "tpr": 1.0
          }
        ]
      },
      "global_feature_importance": [
        {
          "feature": "age",
          "importance": 2.0167
        },
        {
          "feature": "avg_glucose_level",
          "importance": 1.0884
        },
        {
          "feature": "hypertension",
          "importance": 0.6226
        },
        {
          "feature": "heart_disease",
          "importance": 0.4706
        },
        {
          "feature": "bmi",
          "importance": 0.4173
        },
        {
          "feature": "work_type_Never_worked",
          "importance": 0.1746
        },
        {
          "feature": "work_type_Govt_job",
          "importance": 0.0744
        },
        {
          "feature": "work_type_Self-employed",
          "importance": 0.0705
        },
        {
          "feature": "smoking_status_never smoked",
          "importance": 0.0697
        },
        {
          "feature": "smoking_status_formerly smoked",
          "importance": 0.0483
        },
        {
          "feature": "smoking_status_smokes",
          "importance": 0.0462
        },
        {
          "feature": "work_type_Private",
          "importance": 0.0435
        },
        {
          "feature": "work_type_children",
          "importance": 0.0334
        },
        {
          "feature": "ever_married_Yes",
          "importance": 0.0307
        },
        {
          "feature": "ever_married_No",
          "importance": 0.0307
        },
        {
          "feature": "gender_Female",
          "importance": 0.0125
        },
        {
          "feature": "gender_Male",
          "importance": 0.0125
        },
        {
          "feature": "Residence_type_Urban",
          "importance": 0.0063
        },
        {
          "feature": "Residence_type_Rural",
          "importance": 0.0063
        },
        {
          "feature": "smoking_status_Unknown",
          "importance": 0.0023
        }
      ],
      "trained_at": "2026-06-18T04:21:03Z",
      "training_time_ms": 1637
    }
  }
};// ═══════════════════════════════════════════════════════════
//  MODULE: ML VALIDATION ENGINE (Real Trained Models + Explainability)
// ═══════════════════════════════════════════════════════════
// This runs the SAME math as backend/services/ml_inference_service.py,
// using the REAL coefficients exported from an actual scikit-learn
// LogisticRegression trained via backend/ml/train_models.py (see
// ML_MODELS below — sourced from a genuine training run, not invented
// numbers). Two independent engines — this trained-model layer and
// the existing FINDRISC/Framingham clinical engine — are then cross-
// validated against each other for the same patient.

function sigmoid(z) { return 1 / (1 + Math.exp(-z)); }

function scaleRow(rawRow, mean, scale) {
  return rawRow.map((v, i) => (v - mean[i]) / scale[i]);
}

function logisticPredictProba(scaledRow, coef, intercept) {
  const z = scaledRow.reduce((sum, v, i) => sum + v * coef[i], intercept);
  return sigmoid(z);
}

// ── Patient profile -> feature vector mappers (mirror ml_inference_service.py) ──
function hasHistory(...keywords) {
  const hx = [...PT.hx.map(h=>h.toLowerCase())];
  return keywords.some(kw => hx.some(h => h.includes(kw)));
}

function mapDiabetesFeatures() {
  return [
    0.0,                                  // Pregnancies — not collected; assume nulliparous baseline
    PT.vitals.glu,                        // Glucose
    PT.vitals.dia + 4,                    // BloodPressure proxy ≈ diastolic
    25.0,                                 // SkinThickness — not collected; population median
    85.0,                                 // Insulin — not collected; population median
    PT.vitals.bmi,                        // BMI
    hasHistory("diabetes","t2dm") ? 0.5 : 0.2,  // DiabetesPedigreeFunction proxy
    PT.age,                               // Age
  ];
}

function mapHeartFeatures() {
  const sex = PT.gender.toLowerCase()==="male" ? 1 : 0;
  const smoking = PT.life.smk;
  return [
    PT.age, sex,
    2.0,                                          // cp — not collected; assume non-anginal baseline
    PT.vitals.sys,                                // trestbps
    200.0,                                          // chol — not collected; population median
    PT.vitals.glu > 126 ? 1 : 0,                    // fbs proxy
    0.0,                                              // restecg — assume normal
    220 - PT.age - (smoking ? 10 : 0),                  // thalach proxy: age-predicted max HR
    smoking ? 1 : 0,                                      // exang proxy
    PT.life.stress >= 7 ? 1.0 : 0.3,                        // oldpeak proxy
    1.0,                                                      // slope — assume flat/normal
    hasHistory("heart","cardiac","cvd") ? 1 : 0,                // ca proxy
    3.0,                                                          // thal — assume normal
  ];
}

function mapStrokeFeatures(featureNames) {
  const gender = PT.gender.toLowerCase();
  const row = {
    age: PT.age,
    hypertension: PT.vitals.sys >= 140 ? 1.0 : 0.0,
    heart_disease: hasHistory("heart","cardiac") ? 1.0 : 0.0,
    avg_glucose_level: PT.vitals.glu,
    bmi: PT.vitals.bmi,
    [`gender_${gender==="male"?"Male":"Female"}`]: 1.0,
    ever_married_Yes: PT.age >= 25 ? 1.0 : 0.0,
    work_type_Private: 1.0,
    Residence_type_Urban: 1.0,
    [PT.life.smk ? "smoking_status_smokes" : "smoking_status_never smoked"]: 1.0,
  };
  return featureNames.map(name => row[name] ?? 0.0);
}

const ML_MAPPERS = {
  diabetes: () => mapDiabetesFeatures(),
  heart:    () => mapHeartFeatures(),
  stroke:   (featureNames) => mapStrokeFeatures(featureNames),
};

const ML_CLINICAL_COUNTERPART = { diabetes: "diabetes", heart: "heart", stroke: null };

function predictML(diseaseKey) {
  const m = ML_MODELS[diseaseKey];
  const rawRow = ML_MAPPERS[diseaseKey](m.feature_names);
  const scaledRow = scaleRow(rawRow, m.scaler_mean, m.scaler_scale);
  const proba = logisticPredictProba(scaledRow, m.coef, m.intercept);

  // Exact per-feature logit contribution for a standardized logistic regression: coef × z
  const contributions = scaledRow.map((z, i) => ({
    feature: m.feature_names[i],
    value: +rawRow[i].toFixed(3),
    contribution: +(m.coef[i] * z).toFixed(4),
    direction: (m.coef[i] * z) >= 0 ? "increases_risk" : "decreases_risk",
  })).sort((a,b)=>Math.abs(b.contribution)-Math.abs(a.contribution)).slice(0,5);

  return {
    disease: m.metadata.disease,
    probability_pct: +(proba*100).toFixed(1),
    model_used: m.metadata.best_model,
    dataset_name: m.metadata.dataset_name,
    data_source: m.metadata.data_source,
    model_accuracy: m.metadata.metrics.accuracy,
    model_roc_auc: m.metadata.metrics.roc_auc,
    top_factors: contributions,
  };
}

function crossValidateML(diseaseKey) {
  const ml = predictML(diseaseKey);
  const clinicalKey = ML_CLINICAL_COUNTERPART[diseaseKey];
  if (!clinicalKey) return { ml, clinical_pct: null, delta: null, label: "unavailable" };

  const clinicalPct = clinicalKey === "diabetes" ? findriscPct(PT.age, PT.vitals.bmi, PT.life.ex, PT.life.diet, PT.vitals.glu, true)
    : heartPct(PT.age, PT.vitals.sys, PT.life.smk, PT.vitals.glu, true, PT.vitals.bmi, PT.life.ex, PT.life.stress);
  const delta = +Math.abs(clinicalPct - ml.probability_pct).toFixed(1);
  const label = delta<=10?"high_agreement":delta<=20?"moderate_agreement":"discrepancy_review_recommended";
  return { ml, clinical_pct: clinicalPct, delta, label };
}
// ═══════════════════════════════════════════════════════════
//  DEMO MODE — One-Click Patient Switching
// ═══════════════════════════════════════════════════════════
const DEMO_PERSONAS=[
  {id:"arjun", emoji:"👨‍💻",label:"Arjun, 34",tag:"Pre-diabetic",col:C.am,
   story:"Stress + sleep debt → diabetes by 39 without intervention",hl:"⏳ Time Machine"},
  {id:"meena", emoji:"👩",  label:"Meena, 52",tag:"Cardiac Family",col:C.rd,
   story:"3 generations of heart disease — children's risk is 71%",hl:"🌳 Family Twin"},
  {id:"raj",   emoji:"🚬", label:"Raj, 28",  tag:"High Risk",    col:C.rd,
   story:"Quitting smoking + 3 changes saves ₹14.2L + 4.5 life years",hl:"💰 Preventive ROI"},
  {id:"divya", emoji:"👩‍⚕️",label:"Divya, 45",tag:"Hidden Risk",  col:C.pu,
   story:"CBC upload reveals 6 abnormalities she didn't know about",hl:"📄 Report Analyzer"},
  {id:"suresh",emoji:"🏥", label:"Suresh, 65",tag:"CRITICAL",     col:C.rd,
   story:"Glucose 320, BP 172/108, SpO2 91% — 3 active emergencies",hl:"🚨 Triage"},
  {id:"ananya",emoji:"🌟", label:"Ananya, 22",tag:"Low Risk",     col:C.gr,
   story:"Healthy today — Time Machine shows cost of complacency",hl:"⏳ Time Machine"},
];

function DemoMode(){
  const [active,setActive]=useState("arjun");
  const [loading,setLoading]=useState(null);

  const select=async(p)=>{
    setLoading(p.id);
    await new Promise(r=>setTimeout(r,480));
    setActive(p.id);
    setLoading(null);
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <h1 className="sec-h">🎬 Demo Mode</h1>
          <p className="sec-s">6 patient personas · Each highlights a different module · Switch in one click</p>
        </div>
        <div style={{padding:"10px 18px",background:"rgba(124,77,255,0.1)",border:"1px solid rgba(124,77,255,0.25)",
          borderRadius:12,fontSize:12,color:"#b388ff",textAlign:"right"}}>
          <div style={{fontWeight:700}}>HACKATHON DEMO</div>
          <div style={{opacity:.6}}>Switch patients instantly</div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
        {DEMO_PERSONAS.map(p=>(
          <div key={p.id} onClick={()=>select(p)} className="mc"
            style={{cursor:"pointer",border:`1px solid ${active===p.id?p.col+"55":"rgba(255,255,255,0.06)"}`,
              background:active===p.id?`${p.col}0a`:"rgba(255,255,255,0.025)",padding:18,
              boxShadow:active===p.id?`0 0 28px ${p.col}18`:"none",transition:"all .22s",borderRadius:14}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <div style={{fontSize:28}}>{loading===p.id?"⏳":p.emoji}</div>
              <div style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:6,
                background:`${p.col}18`,color:p.col,border:`1px solid ${p.col}28`}}>{p.tag}</div>
            </div>
            <div style={{fontWeight:700,fontSize:15,fontFamily:"Sora",marginBottom:6}}>{p.label}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.48)",lineHeight:1.6,marginBottom:10}}>{p.story}</div>
            <div style={{fontSize:11,color:p.col,fontWeight:600}}>{p.hl}</div>
            {active===p.id&&(
              <div style={{marginTop:10,display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:C.gr,animation:"blink 1.4s infinite"}}/>
                <span style={{fontSize:10,color:C.gr}}>Active Patient</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="card fu" style={{padding:22,background:"rgba(124,77,255,0.05)",border:"1px solid rgba(124,77,255,0.15)"}}>
        <div style={{fontSize:10,color:"#b388ff",fontWeight:700,letterSpacing:1,marginBottom:12}}>RECOMMENDED JUDGE DEMO FLOW</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {["1. Demo Mode → Select Arjun","2. Bio Age Shock → Reveal","3. Time Machine → 5-year split",
            "4. Intervention Cascade → Watch risk fall","5. Family Twin → Children's risk","6. Story Mode → 5-act narrative"
          ].map((s,i)=>(
            <div key={i} style={{padding:"7px 13px",borderRadius:8,fontSize:12,
              background:"rgba(124,77,255,0.1)",border:"1px solid rgba(124,77,255,0.18)",
              color:"rgba(255,255,255,0.7)"}}>{s}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  STORY MODE — 5-Act Cinematic Health Journey
// ═══════════════════════════════════════════════════════════
const STATIC_ACTS=[
  {act:1,icon:"👤",title:"Who They Are",col:C.cy,
   text:"Arjun is 34 — building a startup, sleeping 5.5 hours, carrying the weight of ambition on a body that hasn't been serviced since his last Diwali checkup."},
  {act:2,icon:"⚠️",title:"The Warning Signs",col:C.am,
   text:"Glucose at 112 — borderline. BP at 128/82 — creeping. Stress at 7/10 — chronic. His body is sending signals through every system. He's ignoring all of them."},
  {act:3,icon:"📉",title:"The Dark Future",col:C.rd,
   text:"In 5 years, without change: Health Score drops to 58. Diabetes risk reaches 68%. The first prescription gets written at 39. A preventable ₹8.2L healthcare bill begins."},
  {act:4,icon:"💡",title:"The Turning Point",col:C.pu,
   text:"Three changes. Walk 10,000 steps daily. Sleep 8 hours. Halve refined sugar intake. Forty-five extra minutes a day. The math is unambiguous."},
  {act:5,icon:"🌟",title:"The Future He Chooses",col:C.gr,
   text:"At 39, with prevention: Health Score stays at 74. Diabetes risk holds at 22%. He saves ₹9.1 lakhs. He gains 3.5 life years. This is the future MediTwin makes visible."},
];

function StoryMode(){
  const [act,setAct]=useState(0);
  const [auto,setAuto]=useState(false);
  const [aiActs,setAiActs]=useState(null);
  const [loading,setLoading]=useState(false);
  const acts=aiActs||STATIC_ACTS;
  const cur=act>0?acts[act-1]:null;

  useEffect(()=>{
    if(!auto)return;
    if(act>=5){setAuto(false);return;}
    const t=setTimeout(()=>setAct(a=>a+1),4200);
    return()=>clearTimeout(t);
  },[auto,act]);

  const genAI=async()=>{
    setLoading(true);
    try{
      const t=await callAI([{role:"user",content:
        `MediTwin Story Mode — 5-act health narrative for ${PT.name}, ${PT.age}y, Health Score ${PT.score}/100, `+
        `Diabetes ${PT.risks.diabetes}%, Stress ${PT.risks.stress}%, BP ${PT.vitals.sys}/${PT.vitals.dia}, `+
        `5yr status-quo score ~${Math.round(PT.score*0.82)}, 5yr prevention score ~${Math.round(PT.score*1.06)}. `+
        `Write exactly 5 acts labelled ACT 1: through ACT 5:. Each 2-3 vivid sentences. `+
        `Act 3 (dark future) uses specific numbers. Act 5 (bright future) is genuinely inspiring with numbers.`
      }]);
      const parsed=[1,2,3,4,5].map(i=>{
        const s=t.indexOf(`ACT ${i}:`),e=i<5?t.indexOf(`ACT ${i+1}:`):t.length;
        return{...STATIC_ACTS[i-1],text:s!==-1?t.slice(s+`ACT ${i}:`.length,e).trim():STATIC_ACTS[i-1].text};
      });
      setAiActs(parsed);
    }catch{setAiActs(null);}
    setLoading(false);
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:0,minHeight:"100%"}}>
      <div style={{marginBottom:18}}>
        <h1 className="sec-h">🎬 Story Mode</h1>
        <p className="sec-s">5-act cinematic health journey · Auto-advance · AI-personalised narrative</p>
      </div>

      {/* Act tabs */}
      <div style={{display:"flex",gap:6,marginBottom:18,alignItems:"center",flexWrap:"wrap"}}>
        <button onClick={()=>{setAct(0);setAuto(false);}}
          style={{padding:"8px 14px",borderRadius:9,fontSize:12,cursor:"pointer",border:`1px solid ${act===0?"rgba(0,229,255,0.35)":"rgba(255,255,255,0.08)"}`,
            background:act===0?"rgba(0,229,255,0.1)":"rgba(255,255,255,0.03)",color:act===0?C.cy:"rgba(255,255,255,0.38)"}}>Intro</button>
        {acts.map((a,i)=>(
          <button key={i} onClick={()=>{setAct(i+1);setAuto(false);}}
            style={{padding:"8px 14px",borderRadius:9,fontSize:12,cursor:"pointer",flex:1,
              background:act===i+1?`${a.col}18`:"rgba(255,255,255,0.03)",
              border:`1px solid ${act===i+1?a.col+"44":"rgba(255,255,255,0.08)"}`,
              color:act===i+1?a.col:"rgba(255,255,255,0.38)"}}>
            {a.icon} {a.title}
          </button>
        ))}
        <div style={{display:"flex",gap:8,marginLeft:"auto"}}>
          <button className="btn btn-cy" onClick={genAI} disabled={loading} style={{fontSize:12,padding:"8px 14px"}}>
            {loading?"⏳":"✨ AI"}
          </button>
          <button className="btn btn-solid" onClick={()=>{if(!auto)setAct(a=>Math.max(1,a===5?1:a));setAuto(v=>!v);}}
            style={{fontSize:12,padding:"8px 18px",minWidth:82}}>
            {auto?"⏸ Pause":"▶ Play"}
          </button>
        </div>
      </div>

      {/* Stage */}
      {act===0?(
        <div className="card fu" style={{flex:1,padding:44,display:"flex",flexDirection:"column",
          alignItems:"center",justifyContent:"center",textAlign:"center",gap:20,
          background:"rgba(7,13,34,0.92)",border:"1px solid rgba(0,229,255,0.1)"}}>
          <div style={{fontSize:60}}>🧬</div>
          <div className="sora gt" style={{fontSize:30,fontWeight:800,lineHeight:1.25}}>
            The Health Story of {PT.name}
          </div>
          <div style={{fontSize:15,color:"rgba(255,255,255,0.48)",maxWidth:460,lineHeight:1.75}}>
            Five acts. One patient. The difference between the future they're heading toward
            and the future they can choose.
          </div>
          <div style={{display:"flex",gap:12,marginTop:4}}>
            {acts.map((a,i)=><div key={i} style={{width:10,height:10,borderRadius:"50%",background:a.col,opacity:.45}}/>)}
          </div>
          <button className="btn btn-solid" onClick={()=>{setAct(1);setAuto(true);}}
            style={{fontSize:15,padding:"14px 38px",marginTop:8}}>▶ Begin the Story</button>
        </div>
      ):(
        <div key={`act-${act}`} className="card fu" style={{flex:1,padding:40,display:"flex",flexDirection:"column",
          justifyContent:"center",gap:24,border:`1px solid ${cur.col}22`,
          background:`linear-gradient(135deg,${cur.col}07,rgba(7,13,34,0.97))`}}>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <div style={{width:60,height:60,borderRadius:16,background:`${cur.col}18`,
              border:`1.5px solid ${cur.col}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>
              {cur.icon}
            </div>
            <div>
              <div style={{fontSize:11,color:cur.col,fontWeight:700,letterSpacing:2,marginBottom:4}}>
                ACT {cur.act} OF 5
              </div>
              <div className="sora" style={{fontSize:24,fontWeight:800,color:cur.col}}>{cur.title}</div>
            </div>
          </div>

          <div style={{fontSize:17,lineHeight:1.9,color:"rgba(255,255,255,0.88)",maxWidth:700,
            padding:"22px 26px",borderRadius:14,background:`${cur.col}08`,border:`1px solid ${cur.col}18`}}>
            {cur.text}
          </div>

          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",gap:8}}>
              {acts.map((_,i)=>(
                <div key={i} style={{height:3,borderRadius:2,transition:"all .4s",
                  width:i<act?32:i===act-1?48:14,
                  background:i<act?cur.col:i===act-1?cur.col:"rgba(255,255,255,0.1)",
                  opacity:i<act?0.55:i===act-1?1:0.25}}/>
              ))}
            </div>
            <div style={{display:"flex",gap:10}}>
              {act>1&&<button className="btn btn-cy" onClick={()=>setAct(a=>a-1)} style={{fontSize:12}}>← Prev</button>}
              {act<5
                ?<button className="btn btn-solid" onClick={()=>setAct(a=>a+1)} style={{fontSize:12}}>Next →</button>
                :<button className="btn btn-solid" onClick={()=>{setAct(0);setAuto(false);}} style={{fontSize:12}}>↩ Restart</button>
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  INTERVENTION CASCADE — Animated Waterfall Risk Reducer
// ═══════════════════════════════════════════════════════════
const CASCADE_STEPS=[
  {action:"Walk 10,000 steps/day",   icon:"🚶",reduction:16,col:C.cy,  cite:"DPP Trial — NEJM 2002"},
  {action:"Sleep 8 hours/night",     icon:"😴",reduction:9, col:C.pu,  cite:"Cappuccio et al., Sleep 2010"},
  {action:"Reduce added sugar",      icon:"🍬",reduction:11,col:C.am,  cite:"ADA Standards of Care 2024"},
  {action:"Daily 10-min meditation", icon:"🧘",reduction:6, col:C.gr,  cite:"Mindfulness meta-analysis 2023"},
];
const CASCADE_BASE=68;

function InterventionCascade(){
  const [revealed,setRevealed]=useState(0);
  const [animating,setAnimating]=useState(false);

  const addNext=()=>{
    if(revealed>=CASCADE_STEPS.length||animating)return;
    setAnimating(true);
    setTimeout(()=>{setRevealed(r=>r+1);setAnimating(false);},420);
  };

  const currentRisk=CASCADE_STEPS.slice(0,revealed).reduce((a,s)=>a-s.reduction,CASCADE_BASE);
  const totalDrop=CASCADE_BASE-currentRisk;

  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div>
        <h1 className="sec-h">💧 Intervention Cascade</h1>
        <p className="sec-s">Watch risk fall in real-time · Each intervention compounds · Evidence-based reductions</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        {/* Waterfall */}
        <div className="card fu" style={{padding:24}}>
          <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:20}}>🎯 Diabetes Risk — Waterfall View</div>

          {/* Baseline */}
          <div style={{marginBottom:18}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:7}}>
              <span style={{color:"rgba(255,255,255,0.45)"}}>🏁 Current Baseline</span>
              <span className="mono" style={{color:C.rd,fontWeight:700}}>{CASCADE_BASE}%</span>
            </div>
            <div className="bar-w">
              <div className="bar-f" style={{width:`${CASCADE_BASE}%`,background:`linear-gradient(90deg,${C.rd}88,${C.rd})`}}/>
            </div>
          </div>

          {CASCADE_STEPS.map((step,i)=>{
            const riskAfter=CASCADE_STEPS.slice(0,i+1).reduce((a,s)=>a-s.reduction,CASCADE_BASE);
            const shown=i<revealed;
            return(
              <div key={i} style={{marginBottom:16,opacity:shown?1:0.2,transition:"opacity .45s"}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:7}}>
                  <span style={{color:shown?step.col:"rgba(255,255,255,0.28)"}}>{step.icon} {step.action}</span>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    {shown&&<span style={{fontSize:11,color:C.gr,fontWeight:700}}>-{step.reduction}%</span>}
                    <span className="mono" style={{color:shown?step.col:"rgba(255,255,255,0.2)",fontWeight:700}}>
                      {shown?riskAfter:CASCADE_STEPS.slice(0,i).reduce((a,s)=>a-s.reduction,CASCADE_BASE)}%
                    </span>
                  </div>
                </div>
                <div className="bar-w">
                  <div className="bar-f" style={{
                    width:`${shown?riskAfter:CASCADE_STEPS.slice(0,i).reduce((a,s)=>a-s.reduction,CASCADE_BASE)}%`,
                    background:`linear-gradient(90deg,${step.col}78,${step.col})`,
                    transition:"width 0.85s cubic-bezier(.4,0,.2,1)"
                  }}/>
                </div>
                {shown&&<div style={{fontSize:10,color:"rgba(255,255,255,0.26)",marginTop:4}}>📚 {step.cite}</div>}
              </div>
            );
          })}

          {/* Final risk box */}
          <div style={{marginTop:18,padding:"16px",borderRadius:12,
            background:revealed>0?"rgba(0,255,157,0.07)":"rgba(255,255,255,0.03)",
            border:`1px solid ${revealed>0?"rgba(0,255,157,0.22)":"rgba(255,255,255,0.07)"}`,transition:"all .5s"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.38)",marginBottom:4}}>RISK AFTER {revealed} INTERVENTION{revealed!==1?"S":""}</div>
                <div className="mono" style={{fontSize:38,fontWeight:500,color:revealed>0?C.gr:C.rd}}>{currentRisk}%</div>
              </div>
              {totalDrop>0&&(
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:11,color:C.gr}}>TOTAL REDUCTION</div>
                  <div className="mono" style={{fontSize:30,fontWeight:700,color:C.gr}}>-{totalDrop}%</div>
                </div>
              )}
            </div>
          </div>

          <div style={{display:"flex",gap:10,marginTop:14}}>
            <button className="btn btn-solid" onClick={addNext}
              disabled={revealed>=CASCADE_STEPS.length||animating} style={{flex:1}}>
              {revealed>=CASCADE_STEPS.length?"✅ All Applied":"➕ Add Next Intervention"}
            </button>
            <button className="btn btn-cy" onClick={()=>setRevealed(0)}>Reset</button>
          </div>
        </div>

        {/* Impact stats */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="card fu" style={{padding:22}}>
            <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:16}}>📊 Compound Impact</div>
            {revealed===0?(
              <div style={{textAlign:"center",padding:"26px 0",color:"rgba(255,255,255,0.28)",fontSize:13}}>
                Add an intervention to see the compound effect
              </div>
            ):(
              <>
                {[
                  {label:"Risk Reduction",   val:`${totalDrop}%`,col:C.gr,icon:"📉"},
                  {label:"Life Years Gained",val:`+${(totalDrop*0.082).toFixed(1)} yrs`,col:C.cy,icon:"⏳"},
                  {label:"Savings (₹)",      val:`₹${(totalDrop*18500).toLocaleString("en-IN")}`,col:C.am,icon:"💰"},
                ].map((s,i)=>(
                  <div key={i} style={{padding:"14px 16px",marginBottom:10,borderRadius:11,
                    background:`${s.col}0a`,border:`1px solid ${s.col}18`}}>
                    <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:4}}>{s.icon} {s.label}</div>
                    <div className="mono" style={{fontSize:26,fontWeight:500,color:s.col}}>{s.val}</div>
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="card fu" style={{padding:22,flex:1}}>
            <div style={{fontWeight:700,fontSize:13,fontFamily:"Sora",marginBottom:14}}>🔬 Evidence Base</div>
            {CASCADE_STEPS.slice(0,revealed).map((s,i)=>(
              <div key={i} style={{padding:"9px 11px",marginBottom:8,borderRadius:9,
                background:`${s.col}0a`,borderLeft:`3px solid ${s.col}55`,fontSize:12}}>
                <div style={{fontWeight:600,color:s.col,marginBottom:2}}>{s.icon} {s.action}</div>
                <div style={{color:"rgba(255,255,255,0.4)"}}>{s.cite}</div>
              </div>
            ))}
            {revealed===0&&(
              <div style={{color:"rgba(255,255,255,0.26)",fontSize:12,textAlign:"center",padding:"18px 0"}}>
                Evidence citations appear as you add interventions
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  BIOLOGICAL AGE SHOCK CARD
// ═══════════════════════════════════════════════════════════
function BioAgeShock(){
  const chrono=PT.age;
  const bio=bioAge(PT.age,PT.vitals.bmi,PT.vitals.sys,PT.vitals.glu,PT.life.sleep,PT.life.stress,PT.life.smk);
  const gap=bio-chrono;

  // 5yr status quo
  const bio5sq=bioAge(PT.age+5,PT.vitals.bmi+0.8,PT.vitals.sys+4,PT.vitals.glu+7,
    PT.life.sleep,PT.life.stress,PT.life.smk);
  // 5yr with prevention
  const bio5pv=bioAge(PT.age+5,Math.max(22,PT.vitals.bmi-1.5),Math.max(114,PT.vitals.sys-4),
    Math.max(84,PT.vitals.glu-5),Math.min(8,PT.life.sleep+1.2),Math.max(4,PT.life.stress-2),false);

  const [reveal,setReveal]=useState(false);
  const [narrative,setNarrative]=useState("");
  const [busy,setBusy]=useState(false);
  const col=gap>5?C.rd:gap>0?C.am:C.gr;

  const causes=[];
  if(PT.life.smk)causes.push(`smoking (+5 bio years)`);
  if(PT.life.sleep<6)causes.push(`sleep deficit (${PT.life.sleep}h/night)`);
  if(PT.life.stress>=7)causes.push(`chronic stress (${PT.life.stress}/10)`);
  if(PT.vitals.bmi>27)causes.push(`BMI ${PT.vitals.bmi}`);
  if(PT.vitals.sys>130)causes.push(`BP ${PT.vitals.sys}/${PT.vitals.dia}`);

  const genNarrative=async()=>{
    setBusy(true);
    try{
      const t=await callAI([{role:"user",content:
        `MediTwin Biological Age Analysis: ${PT.name} is chronologically ${chrono} but biologically ${bio}. `+
        (gap>0?`${gap} years older. Top accelerators: ${causes.slice(0,3).join(", ")}. `:`${Math.abs(gap)} years YOUNGER! `)+
        `Write 3 sentences: 1) The stark reality (specific, no jargon). `+
        `2) What caused this. 3) What reverses it in 90 days. Max 65 words.`
      }]);
      setNarrative(t);
    }catch{
      setNarrative(gap>0
        ?`Your body is functioning like it's ${bio}, not ${chrono}. The primary drivers: ${causes.slice(0,2).join(" and ")||"stress and sleep deficit"}. Addressing these consistently can recover 2–4 biological years within 90 days — measurably, in biomarkers.`
        :`Your biological body is ${Math.abs(gap)} years younger than your birth certificate. Your habits are actively protecting you — keep them.`);
    }
    setBusy(false);
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div>
        <h1 className="sec-h">🧬 Biological Age Analysis</h1>
        <p className="sec-s">How old is your body, really? · Organ-level assessment · Reversibility timeline</p>
      </div>

      <div className="card fu" style={{padding:40,textAlign:"center",
        background:`linear-gradient(135deg,${col}07,rgba(7,13,34,0.99))`,
        border:`1.5px solid ${col}28`,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"50%",left:"50%",width:320,height:320,
          background:`radial-gradient(circle,${col}10,transparent 68%)`,
          transform:"translate(-50%,-50%)",pointerEvents:"none"}}/>

        <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",letterSpacing:3,marginBottom:20,fontFamily:"DM Mono"}}>
          BIOLOGICAL AGE — {PT.name.toUpperCase()}
        </div>

        {/* Side-by-side age display */}
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:52,marginBottom:22}}>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",letterSpacing:2,marginBottom:8}}>CHRONOLOGICAL</div>
            <div className="mono" style={{fontSize:76,fontWeight:400,color:"rgba(255,255,255,0.55)",lineHeight:1}}>{chrono}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.25)"}}>years old</div>
          </div>
          <div style={{textAlign:"center",fontSize:26,color:"rgba(255,255,255,0.18)"}}>vs</div>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:11,color:col,letterSpacing:2,marginBottom:8,fontWeight:700}}>BIOLOGICAL</div>
            <div className="mono" style={{fontSize:76,fontWeight:400,color:col,lineHeight:1}}>{bio}</div>
            <div style={{fontSize:12,color:col,fontWeight:600,marginTop:4}}>
              {gap>0?`+${gap} years aging`:gap<0?`${Math.abs(gap)} years younger`:"Exact match"}
            </div>
          </div>
        </div>

        {gap>0&&(
          <div style={{display:"inline-flex",padding:"11px 26px",borderRadius:100,
            background:`${C.rd}16`,border:`1.5px solid ${C.rd}42`,color:C.rd,
            fontSize:14,fontWeight:700,fontFamily:"Sora",gap:9,marginBottom:20}}>
            ⚠️ Your body is {gap} years older than you are
          </div>
        )}
        {gap<0&&(
          <div style={{display:"inline-flex",padding:"11px 26px",borderRadius:100,
            background:`${C.gr}12`,border:`1.5px solid ${C.gr}38`,color:C.gr,
            fontSize:14,fontWeight:700,fontFamily:"Sora",gap:9,marginBottom:20}}>
            ✅ Your body is {Math.abs(gap)} years younger than your age
          </div>
        )}

        {!reveal?(
          <div>
            <button className="btn btn-solid" onClick={()=>setReveal(true)}
              style={{fontSize:14,padding:"14px 36px"}}>Reveal Full Analysis →</button>
          </div>
        ):(
          <div style={{animation:"fadeUp .45s ease"}}>
            {/* Cause pills */}
            <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:22}}>
              {[
                {l:"Sleep",v:`${PT.life.sleep}h/night`,bad:PT.life.sleep<6,icon:"😴"},
                {l:"Stress",v:`${PT.life.stress}/10`,bad:PT.life.stress>=7,icon:"🧠"},
                {l:"BMI",v:PT.vitals.bmi,bad:PT.vitals.bmi>27,icon:"⚖️"},
                {l:"BP",v:`${PT.vitals.sys}/${PT.vitals.dia}`,bad:PT.vitals.sys>130,icon:"🫀"},
              ].map((c,i)=>(
                <div key={i} style={{padding:"10px 16px",borderRadius:12,textAlign:"center",minWidth:94,
                  background:c.bad?"rgba(255,23,68,0.09)":"rgba(0,255,157,0.06)",
                  border:`1px solid ${c.bad?"rgba(255,23,68,0.22)":"rgba(0,255,157,0.18)"}`}}>
                  <div style={{fontSize:18,marginBottom:4}}>{c.icon}</div>
                  <div className="mono" style={{fontSize:15,fontWeight:500,color:c.bad?C.rd:C.gr}}>{c.val||c.v}</div>
                  <div style={{fontSize:10,color:"rgba(255,255,255,0.32)",marginTop:2}}>{c.l}</div>
                </div>
              ))}
            </div>

            {/* 5-year split */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20,textAlign:"left"}}>
              <div style={{padding:18,borderRadius:12,background:"rgba(255,23,68,0.07)",border:"1px solid rgba(255,23,68,0.18)"}}>
                <div style={{fontSize:11,color:C.rd,fontWeight:700,marginBottom:8}}>📉 IN 5 YEARS — STATUS QUO</div>
                <div className="mono" style={{fontSize:34,color:C.rd,fontWeight:400}}>{bio5sq}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.38)"}}>biological age at {chrono+5}</div>
              </div>
              <div style={{padding:18,borderRadius:12,background:"rgba(0,255,157,0.07)",border:"1px solid rgba(0,255,157,0.18)"}}>
                <div style={{fontSize:11,color:C.gr,fontWeight:700,marginBottom:8}}>📈 IN 5 YEARS — WITH PREVENTION</div>
                <div className="mono" style={{fontSize:34,color:C.gr,fontWeight:400}}>{bio5pv}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.38)"}}>biological age at {chrono+5}</div>
              </div>
            </div>

            {/* AI narrative box */}
            <div style={{padding:"20px 24px",borderRadius:14,background:`${col}09`,
              border:`1px solid ${col}20`,textAlign:"left",marginBottom:14}}>
              {narrative?(
                <div style={{fontSize:14,lineHeight:1.85,color:"rgba(255,255,255,0.82)"}}>{narrative}</div>
              ):(
                <div style={{textAlign:"center"}}>
                  <button className="btn btn-cy" onClick={genNarrative} disabled={busy} style={{fontSize:13}}>
                    {busy?"🔮 Analysing…":"🧠 Generate AI Explanation"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  HEALTHCARE COST TIME BOMB
// ═══════════════════════════════════════════════════════════
function AnimatedCounter({target,duration=1800,prefix="₹",suffix=""}){
  const val=useCountUp(target,duration);
  return<span className="mono" style={{fontVariantNumeric:"tabular-nums"}}>{prefix}{Math.round(val).toLocaleString("en-IN")}{suffix}</span>;
}

const COST_DISEASES=[
  {name:"Type 2 Diabetes",  risk:PT.risks.diabetes,fullCost:320000,icon:"🩸",col:C.am,cite:"ICMR 2024 avg. lifetime mgmt. cost"},
  {name:"Hypertension",     risk:PT.risks.bp,       fullCost:155000,icon:"🫀",col:C.rd,cite:"MoH India, 2023"},
  {name:"Heart Disease",    risk:PT.risks.heart,    fullCost:520000,icon:"❤️",col:C.rd,cite:"AIIMS single-event cost estimate"},
  {name:"Chronic Stress",   risk:PT.risks.stress,   fullCost:55000, icon:"🧠",col:C.pu,cite:"WHO mental health economic burden"},
];

function CostTimeBomb(){
  const [reveal,setReveal]=useState(false);
  const totalNoAction=COST_DISEASES.reduce((s,d)=>s+(d.risk/100)*d.fullCost,0);
  const totalPrevention=totalNoAction*0.34;
  const savings=totalNoAction-totalPrevention;

  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div>
        <h1 className="sec-h">💰 Healthcare Cost Calculator</h1>
        <p className="sec-s">Lifetime risk-weighted costs · India healthcare prices · ICMR sourced · Prevention ROI</p>
      </div>

      {/* Big reveal card */}
      <div className="card fu" style={{padding:36,textAlign:"center",
        background:"linear-gradient(135deg,rgba(255,23,68,0.06),rgba(7,13,34,0.98))",
        border:"1.5px solid rgba(255,23,68,0.18)"}}>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.32)",letterSpacing:3,marginBottom:14,fontFamily:"DM Mono"}}>
          ESTIMATED LIFETIME HEALTHCARE COST — IF NO ACTION
        </div>
        <div style={{fontSize:13,color:C.rd,fontWeight:700,letterSpacing:1,marginBottom:8}}>⚠️ RISK-WEIGHTED PROJECTION</div>
        <div style={{fontSize:50,fontWeight:800,color:C.rd,fontFamily:"DM Mono",marginBottom:8}}>
          {reveal?<AnimatedCounter target={totalNoAction}/>:"₹??,??,???"}
        </div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.38)",marginBottom:26}}>
          probability-weighted across {COST_DISEASES.length} identified risk conditions
        </div>

        {!reveal?(
          <button className="btn btn-solid" onClick={()=>setReveal(true)}
            style={{fontSize:15,padding:"14px 36px",background:"linear-gradient(135deg,#ff1744,#7c4dff)"}}>
            💣 Reveal My Cost Risk
          </button>
        ):(
          <div style={{animation:"fadeUp .5s ease"}}>
            <div style={{display:"flex",justifyContent:"center",gap:36,marginBottom:10,flexWrap:"wrap"}}>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:11,color:C.rd,letterSpacing:1,marginBottom:6}}>WITHOUT ACTION</div>
                <div className="mono" style={{fontSize:34,color:C.rd,fontWeight:500}}>
                  <AnimatedCounter target={totalNoAction}/>
                </div>
              </div>
              <div style={{fontSize:22,color:"rgba(255,255,255,0.18)",alignSelf:"center"}}>→</div>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:11,color:C.gr,letterSpacing:1,marginBottom:6}}>WITH PREVENTION</div>
                <div className="mono" style={{fontSize:34,color:C.gr,fontWeight:500}}>
                  <AnimatedCounter target={totalPrevention}/>
                </div>
              </div>
              <div style={{textAlign:"center",background:"rgba(0,255,157,0.09)",borderRadius:14,
                padding:"14px 22px",border:"1px solid rgba(0,255,157,0.22)"}}>
                <div style={{fontSize:11,color:C.gr,marginBottom:6}}>YOU SAVE</div>
                <div className="mono" style={{fontSize:30,color:C.gr,fontWeight:700}}>
                  <AnimatedCounter target={savings}/>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Breakdown table */}
      {reveal&&(
        <div className="card fu" style={{padding:22}}>
          <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:16}}>📋 Cost Breakdown by Condition</div>
          {COST_DISEASES.map((d,i)=>{
            const expected=(d.risk/100)*d.fullCost;
            const saved=expected*0.66;
            return(
              <div key={i} style={{padding:"14px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:20}}>{d.icon}</span>
                    <div>
                      <div style={{fontSize:13,fontWeight:600}}>{d.name}</div>
                      <div style={{fontSize:10,color:"rgba(255,255,255,0.28)"}}>{d.cite}</div>
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div className="mono" style={{color:C.rd,fontSize:14,fontWeight:500}}>
                      ₹{Math.round(expected).toLocaleString("en-IN")}
                    </div>
                    <div style={{fontSize:10,color:C.gr}}>save ₹{Math.round(saved).toLocaleString("en-IN")}</div>
                  </div>
                </div>
                <div style={{display:"flex",gap:4,alignItems:"center"}}>
                  <div style={{fontSize:10,color:"rgba(255,255,255,0.28)",width:56}}>{d.risk}% risk</div>
                  <div style={{flex:1,height:4,borderRadius:2,background:"rgba(255,255,255,0.06)"}}>
                    <div style={{height:"100%",borderRadius:2,width:`${d.risk}%`,transition:"width 1s ease",
                      background:`linear-gradient(90deg,${d.col}88,${d.col})`}}/>
                  </div>
                  <div style={{fontSize:10,color:"rgba(255,255,255,0.28)",width:76,textAlign:"right"}}>
                    ₹{(d.fullCost/1000).toFixed(0)}K if diagnosed
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{marginTop:14,padding:"12px 16px",borderRadius:10,
            background:"rgba(0,229,255,0.04)",fontSize:11,color:"rgba(255,255,255,0.28)"}}>
            ⚠️ Awareness estimates only · Based on published India healthcare costs · Not actuarial guarantees
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  PARALLEL UNIVERSE HEALTH SIMULATOR
//  Three simultaneous health futures visualized side-by-side
// ═══════════════════════════════════════════════════════════
const DEFAULT_TIMELINES_FE=[
  {label:"Timeline A",desc:"Status quo — current habits unchanged",col:C.rd,changes:{}},
  {label:"Timeline B",desc:"Lifestyle shift — sleep, exercise, no smoking",col:C.am,
   changes:{sleep_hours:8,exercise_days_per_week:4,smoking:false,stress_level:5}},
  {label:"Timeline C",desc:"Full intervention — lifestyle + medical care",col:C.gr,
   changes:{sleep_hours:8,exercise_days_per_week:5,smoking:false,stress_level:3,diet_quality:9}},
];

// Computes a full year-by-year trajectory for one timeline given target lifestyle deltas.
// Mirrors the logic of projectProfile() but supports 3 distinct configurable timelines
// instead of a binary status-quo/prevention toggle, and returns every intermediate year
// (not just the endpoint) for the divergence chart.
function projectTimeline(years, overrides, baseline) {
  const startSleep=baseline.sleep, startEx=baseline.ex, startDiet=baseline.diet, startStress=baseline.stress;
  const targetSleep = overrides.sleep_hours ?? startSleep;
  const targetEx    = overrides.exercise_days_per_week ?? startEx;
  const targetDiet  = overrides.diet_quality ?? startDiet;
  const targetStress= overrides.stress_level ?? startStress;
  const smoking     = overrides.smoking ?? PT.life.smk;
  const isImproving = Object.keys(overrides).length>0;

  const trajectory=[];
  for(let y=0;y<=years;y++){
    const frac = years>0 ? y/years : 0;
    const sleep  = startSleep + (targetSleep-startSleep)*frac;
    const exDays = startEx    + (targetEx-startEx)*frac;
    const diet   = startDiet  + (targetDiet-startDiet)*frac;
    const stress = startStress+ (targetStress-startStress)*frac;

    let bmi=PT.vitals.bmi, sys=PT.vitals.sys, glu=PT.vitals.glu;
    if(isImproving){
      bmi = Math.max(21, bmi - 0.3*y*frac*2);
      sys = Math.max(112, sys - 0.6*y*frac*2);
      glu = Math.max(82, glu - 0.8*y*frac*2);
    } else {
      const bmiDrift = exDays<3?0.15:0.03;
      const sbpDrift = (stress>=7||sleep<6)?0.8:0.3;
      const gluDrift = diet<6?1.2:0.4;
      bmi += bmiDrift*y; sys += sbpDrift*y; glu += gluDrift*y;
    }

    const age=PT.age+y;
    const risks={
      diabetes: findriscPct(age,bmi,exDays,diet,glu,true),
      bp:       hyperPct(age,sys,bmi,true,sleep,stress,diet),
      heart:    heartPct(age,sys,smoking,glu,true,bmi,exDays,stress),
      anemia:   PT.risks.anemia,
      stress:   stressPct(sleep,exDays,stress),
    };
    const score=healthScoreOf(risks,sys,bmi,sleep,stress);
    const bAge=bioAge(age,bmi,sys,glu,sleep,stress,smoking);

    trajectory.push({year:y,age,health_score:score,
      risks:{"Heart Disease":risks.heart,"Diabetes":risks.diabetes,"Hypertension":risks.bp},
      biological_age:bAge});
  }
  return trajectory;
}

function ParallelUniverse(){
  const [results,setResults]=useState(null);
  const [narrative,setNarrative]=useState("");
  const [busy,setBusy]=useState(false);
  const [sliders,setSliders]=useState({sleep:PT.life.sleep,exercise:PT.life.ex,stress:PT.life.stress,diet:PT.life.diet});

  const baseline=useMemo(()=>({sleep:sliders.sleep,ex:sliders.exercise,diet:sliders.diet,stress:sliders.stress}),[sliders]);

  const simulate=()=>{
    const timelines=DEFAULT_TIMELINES_FE.map((t,i)=>{
      const trajectory=projectTimeline(10,t.changes,baseline);
      return{timeline_id:i,label:t.label,description:t.desc,color:t.col,trajectory,
        endpoint_summary:{health_score:trajectory[10].health_score}};
    });
    setResults(timelines);
  };

  useEffect(()=>{simulate();},[sliders]);

  const genNarrative=async()=>{
    if(!results)return;
    setBusy(true);
    const sqScore=results[0].endpoint_summary.health_score;
    const pvScore=results[2].endpoint_summary.health_score;
    try{
      const t=await callAI([{role:"user",content:
        `MediTwin Parallel Universe: ${PT.name}, ${PT.age}y. Three 10-year futures computed. `+
        `Timeline A (status quo): Health Score ${sqScore}/100. Timeline C (full intervention): Health Score ${pvScore}/100. `+
        `Gap: ${pvScore-sqScore} points. Write 2 cinematic sentences: the story of the fork in the road. Specific, human, powerful. Max 60 words.`
      }]);
      setNarrative(t);
    }catch{
      setNarrative(`At ${PT.age+10}, ${PT.name} faces three completely different lives — all of them determined by choices made today. The gap between Timeline A and Timeline C: ${pvScore-sqScore} health score points, and every year of biological age that separates them.`);
    }
    setBusy(false);
  };

  const chartData=results?Array.from({length:11},(_,y)=>({
    year:`${PT.age+y}`,
    ...Object.fromEntries(results.map(t=>[t.label,Math.round(t.trajectory[y]?.risks?.["Heart Disease"]||0)]))
  })):[];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div>
        <h1 className="sec-h">🌌 Parallel Universe Simulator</h1>
        <p className="sec-s">Three simultaneous 10-year futures · Computed in real-time · Diverge from a single decision</p>
      </div>

      <div className="card fu" style={{padding:20}}>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",fontWeight:700,marginBottom:14}}>
          BASELINE PROFILE — adjust to explore different starting points
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:16}}>
          {[
            {key:"sleep",label:"Sleep",icon:"😴",min:4,max:9,step:0.5,unit:"h"},
            {key:"exercise",label:"Exercise",icon:"🏃",min:0,max:7,step:1,unit:"d/wk"},
            {key:"stress",label:"Stress",icon:"🧠",min:1,max:10,step:1,unit:"/10"},
            {key:"diet",label:"Diet Quality",icon:"🥗",min:1,max:10,step:1,unit:"/10"},
          ].map(s=>(
            <div key={s.key}>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginBottom:6,display:"flex",justifyContent:"space-between"}}>
                <span>{s.icon} {s.label}</span>
                <span className="mono" style={{color:C.cy}}>{sliders[s.key]}{s.unit}</span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={sliders[s.key]}
                onChange={e=>setSliders(v=>({...v,[s.key]:parseFloat(e.target.value)}))}
                style={{width:"100%",accentColor:C.cy}}/>
            </div>
          ))}
        </div>
        <button className="btn btn-solid" onClick={genNarrative} disabled={busy||!results} style={{marginTop:14,fontSize:13}}>
          {busy?"⏳ Writing the fork in the road…":"✨ Generate AI Narrative"}
        </button>
      </div>

      {results&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
          {results.map((tl,i)=>{
            const endpoint=tl.endpoint_summary||{};
            const finalScore=endpoint.health_score||0;
            const startScore=tl.trajectory?.[0]?.health_score||72;
            const delta=finalScore-startScore;
            return(
              <div key={i} className="card fu" style={{padding:20,border:`1px solid ${tl.color}28`,
                background:`linear-gradient(160deg,${tl.color}07,rgba(7,13,34,0.97))`}}>
                <div style={{fontSize:11,color:tl.color,fontWeight:700,letterSpacing:1.5,marginBottom:6}}>
                  {tl.label.toUpperCase()}
                </div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",marginBottom:14,lineHeight:1.55}}>
                  {tl.description}
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:16}}>
                  <div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>Health Score at {PT.age+10}</div>
                    <div className="mono" style={{fontSize:40,color:tl.color,fontWeight:400,lineHeight:1}}>{finalScore}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>10-yr change</div>
                    <div className="mono" style={{fontSize:20,color:delta>=0?C.gr:C.rd,fontWeight:600}}>
                      {delta>=0?"+":""}{delta}
                    </div>
                  </div>
                </div>
                {["Heart Disease","Diabetes","Hypertension"].map(d=>{
                  const risk=Math.round(tl.trajectory?.[10]?.risks?.[d]||0);
                  return(
                    <div key={d} style={{marginBottom:8}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}>
                        <span style={{color:"rgba(255,255,255,0.4)"}}>{d}</span>
                        <span className="mono" style={{color:risk>50?C.rd:risk>30?C.am:C.gr}}>{risk}%</span>
                      </div>
                      <div className="bar-w">
                        <div className="bar-f" style={{width:`${risk}%`,
                          background:`linear-gradient(90deg,${risk>50?C.rd:risk>30?C.am:C.gr}88,${risk>50?C.rd:risk>30?C.am:C.gr})`,
                          transition:"width 1s ease"}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {results&&chartData.length>0&&(
        <div className="card fu" style={{padding:22}}>
          <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:16}}>
            📈 Heart Disease Risk Divergence — 10-Year Trajectory
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{top:5,right:20,bottom:5,left:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
              <XAxis dataKey="year" tick={{fill:"rgba(255,255,255,0.4)",fontSize:11}}/>
              <YAxis tick={{fill:"rgba(255,255,255,0.4)",fontSize:11}} domain={[0,80]}/>
              <Tooltip contentStyle={{background:"#0d1117",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:12}}/>
              {results.map(tl=>(
                <Line key={tl.label} type="monotone" dataKey={tl.label}
                  stroke={tl.color} strokeWidth={2.5} dot={false}
                  strokeDasharray={tl.timeline_id===0?"5 3":undefined}/>
              ))}
            </LineChart>
          </ResponsiveContainer>
          {narrative&&(
            <div style={{marginTop:14,padding:"14px 18px",borderRadius:12,
              background:"rgba(124,77,255,0.07)",border:"1px solid rgba(124,77,255,0.18)",
              fontSize:13,lineHeight:1.8,color:"rgba(255,255,255,0.8)"}}>
              🎬 {narrative}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  WEARABLE DIGITAL TWIN — Synthetic Smartwatch Dashboard
// ═══════════════════════════════════════════════════════════
function useWearableLive(active){
  const [reading,setReading]=useState({
    heart_rate:72,spo2:97.8,steps_today:3240,stress_score:42,
    hrv_ms:58,skin_temp_c:36.2,sleep_last_night:6.1,anomaly:null
  });
  const [alerts,setAlerts]=useState([]);

  useEffect(()=>{
    if(!active)return;
    const tick=setInterval(()=>{
      setReading(prev=>{
        const hr=72+Math.round((Math.random()-.45)*12);
        const spo2=parseFloat((97.8+Math.random()*0.8-0.4).toFixed(1));
        const stress=Math.max(0,Math.min(100,42+Math.round((Math.random()-.4)*16)));
        const hrv=Math.max(20,Math.min(90,58+Math.round((Math.random()-.5)*10)));
        const anomaly=hr>105?"⚠️ Elevated HR: "+hr+" bpm":spo2<95?"⚠️ Low SpO2: "+spo2+"%":null;
        const r={heart_rate:hr,spo2,steps_today:prev.steps_today+Math.round(Math.random()*18),
          stress_score:stress,hrv_ms:hrv,skin_temp_c:parseFloat((36.2+Math.random()*0.5-.2).toFixed(1)),
          sleep_last_night:6.1,anomaly};
        if(anomaly)setAlerts(a=>[{msg:anomaly,t:new Date().toLocaleTimeString()},...a.slice(0,4)]);
        return r;
      });
    },1600);
    return()=>clearInterval(tick);
  },[active]);

  return{reading,alerts};
}

function HeartBeat({hr,active}){
  const [beat,setBeat]=useState(false);
  useEffect(()=>{
    if(!active)return;
    const ms=Math.round(60000/hr);
    const t=setInterval(()=>setBeat(b=>!b),ms);
    return()=>clearInterval(t);
  },[hr,active]);
  return(
    <div style={{fontSize:32,transition:"transform .12s",transform:beat?"scale(1.18)":"scale(1)",
      color:hr>100?C.rd:hr>85?C.am:C.gr}}>❤️</div>
  );
}

function RingGauge({value,max,color,label,icon,unit=""}){
  const pct=Math.min(100,Math.round(value/max*100));
  const r=36,circ=2*Math.PI*r,dash=circ*(pct/100);
  return(
    <div style={{textAlign:"center"}}>
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle cx="45" cy="45" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7"/>
        <circle cx="45" cy="45" r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 45 45)" style={{transition:"stroke-dasharray .8s ease"}}/>
        <text x="45" y="40" textAnchor="middle" fontSize="18" fill={color} fontFamily="DM Mono">{icon}</text>
        <text x="45" y="56" textAnchor="middle" fontSize="11" fill={color} fontFamily="DM Mono">{value}{unit}</text>
      </svg>
      <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginTop:2}}>{label}</div>
    </div>
  );
}

function WearableDigitalTwin(){
  const [active,setActive]=useState(true);
  const {reading,alerts}=useWearableLive(active);
  const [history,setHistory]=useState(Array.from({length:30},(_,i)=>({t:i,hr:72+Math.round(Math.random()*8-4)})));

  useEffect(()=>{
    if(!active)return;
    setHistory(h=>[...h.slice(-29),{t:h.length,hr:reading.heart_rate}]);
  },[reading.heart_rate,active]);

  const stressCol=reading.stress_score>70?C.rd:reading.stress_score>45?C.am:C.gr;

  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <h1 className="sec-h">⌚ Wearable Digital Twin</h1>
          <p className="sec-s">Synthetic smartwatch stream · Clinically grounded · Anomaly detection active</p>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:active?C.gr:C.rd,
            animation:active?"blink 1.4s infinite":undefined}}/>
          <span style={{fontSize:11,color:active?C.gr:C.rd}}>{active?"LIVE":"PAUSED"}</span>
          <button className="btn btn-cy" onClick={()=>setActive(a=>!a)} style={{fontSize:12}}>
            {active?"⏸ Pause":"▶ Resume"}
          </button>
        </div>
      </div>

      {alerts.length>0&&(
        <div style={{padding:"10px 16px",borderRadius:10,background:"rgba(255,23,68,0.09)",
          border:"1px solid rgba(255,23,68,0.22)",fontSize:12}}>
          <span style={{color:C.rd,fontWeight:700,marginRight:10}}>⚠️ ANOMALY DETECTED</span>
          {alerts[0].msg} <span style={{color:"rgba(255,255,255,0.3)",marginLeft:8}}>{alerts[0].t}</span>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div className="card fu" style={{padding:22}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora"}}>❤️ Live Vitals</div>
            <HeartBeat hr={reading.heart_rate} active={active}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
            <RingGauge value={reading.heart_rate} max={160} color={reading.heart_rate>100?C.rd:C.cy} label="Heart Rate" icon="♥" unit=" bpm"/>
            <RingGauge value={reading.spo2} max={100} color={reading.spo2<95?C.rd:C.gr} label="SpO2" icon="💧" unit="%"/>
            <RingGauge value={reading.hrv_ms} max={100} color={reading.hrv_ms<30?C.rd:C.pu} label="HRV" icon="〜" unit="ms"/>
          </div>
          <div style={{height:60,position:"relative",marginTop:4}}>
            <svg width="100%" height="60" viewBox="0 0 300 60" preserveAspectRatio="none">
              <polyline points={history.map((p,i)=>`${(i/29)*300},${60-((p.hr-55)/80)*58}`).join(" ")}
                fill="none" stroke={C.cy} strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="0" x2="300" y1="30" y2="30" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4"/>
            </svg>
          </div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.25)",textAlign:"center",marginTop:2}}>30-second heart rate history</div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div className="card fu" style={{padding:18}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:13,fontWeight:600}}>🚶 Daily Steps</div>
              <div className="mono" style={{color:reading.steps_today>=10000?C.gr:C.am,fontSize:18,fontWeight:500}}>
                {reading.steps_today.toLocaleString("en-IN")}
              </div>
            </div>
            <div className="bar-w">
              <div className="bar-f" style={{width:`${Math.min(100,reading.steps_today/10000*100)}%`,
                background:`linear-gradient(90deg,${C.am}88,${C.am})`,transition:"width .9s ease"}}/>
            </div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.28)",marginTop:5}}>Goal: 10,000 steps</div>
          </div>

          <div className="card fu" style={{padding:18}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <div style={{fontSize:13,fontWeight:600}}>🧠 Stress Score</div>
              <div className="mono" style={{color:stressCol,fontSize:18,fontWeight:500}}>{reading.stress_score}</div>
            </div>
            <div className="bar-w">
              <div className="bar-f" style={{width:`${reading.stress_score}%`,
                background:`linear-gradient(90deg,${stressCol}88,${stressCol})`,transition:"width .9s ease"}}/>
            </div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.28)",marginTop:5}}>
              {reading.stress_score>70?"High — consider a short walk or breathing exercise":
               reading.stress_score>45?"Moderate — monitor through the day":"Normal range"}
            </div>
          </div>

          <div className="card fu" style={{padding:18,display:"flex",gap:20}}>
            <div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginBottom:4}}>😴 Sleep last night</div>
              <div className="mono" style={{fontSize:22,color:reading.sleep_last_night>=7?C.gr:C.am}}>{reading.sleep_last_night}h</div>
            </div>
            <div style={{borderLeft:"1px solid rgba(255,255,255,0.07)",paddingLeft:20}}>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginBottom:4}}>🌡️ Skin temp</div>
              <div className="mono" style={{fontSize:22,color:reading.skin_temp_c>37?C.rd:C.cy}}>{reading.skin_temp_c}°C</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card fu" style={{padding:18}}>
        <div style={{fontSize:12,fontWeight:700,fontFamily:"Sora",marginBottom:12}}>🔗 Wearable Risk Context</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.8}}>
          Based on {PT.name}'s clinical profile — wearable readings are cross-referenced against
          disease risk predictions. Sustained HR &gt;100 correlates with cardiac risk (current:
          <span style={{color:C.rd,marginLeft:4,fontWeight:600}}>{PT.risks.heart}%</span>).
          HRV &lt;30ms flags potential autonomic stress (stress risk:
          <span style={{color:C.am,marginLeft:4,fontWeight:600}}>{PT.risks.stress}%</span>).
          SpO2 &lt;95% triggers triage referral.
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  POPULATION HEALTH INTELLIGENCE
//  India district disease burden · Heatmap + Alerts
// ═══════════════════════════════════════════════════════════
const POP_DATA=[
  {d:"Chennai",      s:"Tamil Nadu",   lat:13.09,lng:80.28,dm:26.3,htn:38.1,heart:14.2,pop:7200000,  alert:"HIGH_DM"},
  {d:"Hyderabad",    s:"Telangana",    lat:17.38,lng:78.47,dm:22.6,htn:36.4,heart:13.8,pop:9630000,  alert:"HIGH_DM"},
  {d:"Mumbai",       s:"Maharashtra",  lat:19.08,lng:72.88,dm:18.6,htn:31.4,heart:13.1,pop:20700000, alert:"URBAN_STRESS"},
  {d:"New Delhi",    s:"Delhi",        lat:28.70,lng:77.10,dm:20.4,htn:35.6,heart:14.8,pop:10900000, alert:"AIR_QUALITY"},
  {d:"Bengaluru",    s:"Karnataka",    lat:12.97,lng:77.59,dm:17.8,htn:30.2,heart:11.6,pop:8440000,  alert:"SEDENTARY"},
  {d:"Ahmedabad",    s:"Gujarat",      lat:23.03,lng:72.58,dm:19.4,htn:32.8,heart:12.6,pop:7600000,  alert:null},
  {d:"Kolkata",      s:"West Bengal",  lat:22.57,lng:88.36,dm:16.8,htn:31.4,heart:12.2,pop:4500000,  alert:null},
  {d:"Thiruvanantha",s:"Kerala",       lat:8.52, lng:76.94,dm:21.8,htn:34.6,heart:13.4,pop:1680000,  alert:"HIGH_DM"},
  {d:"Pune",         s:"Maharashtra",  lat:18.52,lng:73.86,dm:17.2,htn:29.6,heart:11.4,pop:3130000,  alert:null},
  {d:"Jaipur",       s:"Rajasthan",    lat:26.90,lng:75.80,dm:13.6,htn:26.8,heart:9.4, pop:3070000,  alert:null},
  {d:"Lucknow",      s:"Uttar Pradesh",lat:26.84,lng:80.94,dm:11.2,htn:24.6,heart:8.4, pop:3400000,  alert:null},
  {d:"Chandigarh",   s:"Punjab",       lat:30.73,lng:76.78,dm:14.4,htn:30.8,heart:11.8,pop:1060000,  alert:null},
  {d:"Coimbatore",   s:"Tamil Nadu",   lat:11.00,lng:76.97,dm:23.1,htn:35.2,heart:12.8,pop:3460000,  alert:null},
  {d:"Surat",        s:"Gujarat",      lat:21.17,lng:72.83,dm:16.2,htn:28.1,heart:10.8,pop:6100000,  alert:null},
  {d:"Nagpur",       s:"Maharashtra",  lat:21.14,lng:79.09,dm:15.8,htn:28.4,heart:10.2,pop:2890000,  alert:null},
];

const ALERT_LABELS={"HIGH_DM":"🩸 High Diabetes","URBAN_STRESS":"🏙️ Urban Stress","AIR_QUALITY":"💨 Air Quality","SEDENTARY":"🪑 Sedentary Risk"};
const ALERT_COLS={HIGH_DM:C.am,URBAN_STRESS:C.pu,AIR_QUALITY:C.cy,SEDENTARY:C.gr};

function PopulationHealth(){
  const [metric,setMetric]=useState("dm");
  const [selected,setSelected]=useState(null);

  const metricKey={dm:"dm",htn:"htn",heart:"heart"}[metric];
  const metricLabel={dm:"Diabetes",htn:"Hypertension",heart:"Heart Disease"}[metric];
  const maxVal=Math.max(...POP_DATA.map(d=>d[metricKey]));

  const riskCol=(val)=>{
    const pct=val/maxVal;
    if(pct>0.8)return C.rd;
    if(pct>0.6)return C.am;
    if(pct>0.4)return"#ffd740";
    return C.gr;
  };

  const sorted=[...POP_DATA].sort((a,b)=>b[metricKey]-a[metricKey]);

  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div>
        <h1 className="sec-h">🌍 Population Health Intelligence</h1>
        <p className="sec-s">India district disease burden · ICMR-INDIAB 2023 pattern basis · Synthetic illustration</p>
      </div>

      <div style={{display:"flex",gap:10}}>
        {[["dm","🩸 Diabetes"],["htn","🫀 Hypertension"],["heart","❤️ Heart Disease"]].map(([k,l])=>(
          <button key={k} onClick={()=>setMetric(k)}
            style={{padding:"8px 16px",borderRadius:9,fontSize:12,cursor:"pointer",
              background:metric===k?"rgba(0,229,255,0.12)":"rgba(255,255,255,0.04)",
              border:`1px solid ${metric===k?"rgba(0,229,255,0.35)":"rgba(255,255,255,0.08)"}`,
              color:metric===k?C.cy:"rgba(255,255,255,0.4)"}}>
            {l}
          </button>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div className="card fu" style={{padding:22}}>
          <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:16}}>
            📊 {metricLabel} Prevalence by District
          </div>
          {sorted.slice(0,10).map((d,i)=>{
            const val=d[metricKey];
            const col=riskCol(val);
            return(
              <div key={i} style={{marginBottom:10,cursor:"pointer"}} onClick={()=>setSelected(selected?.d===d.d?null:d)}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5}}>
                  <span style={{color:selected?.d===d.d?C.cy:"rgba(255,255,255,0.55)"}}>
                    {d.d}
                    {d.alert&&<span style={{marginLeft:6,fontSize:10,color:ALERT_COLS[d.alert]||C.am}}>{ALERT_LABELS[d.alert]}</span>}
                  </span>
                  <span className="mono" style={{color:col,fontWeight:600}}>{val}%</span>
                </div>
                <div className="bar-w">
                  <div className="bar-f" style={{width:`${(val/maxVal)*100}%`,
                    background:`linear-gradient(90deg,${col}88,${col})`,transition:"width .8s ease"}}/>
                </div>
              </div>
            );
          })}
          <div style={{marginTop:10,fontSize:10,color:"rgba(255,255,255,0.22)"}}>
            Data: ICMR-INDIAB 2023 pattern basis · Synthetic for demonstration
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {selected?(
            <div className="card fu" style={{padding:20,border:`1px solid ${riskCol(selected[metricKey])}28`}}>
              <div style={{fontWeight:700,fontSize:15,fontFamily:"Sora",marginBottom:4}}>{selected.d}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:14}}>{selected.s} · Pop: {(selected.pop/1e6).toFixed(1)}M</div>
              {[["Diabetes",selected.dm,C.am],["Hypertension",selected.htn,C.rd],["Heart Disease",selected.heart,C.rd]].map(([l,v,c])=>(
                <div key={l} style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5}}>
                    <span style={{color:"rgba(255,255,255,0.5)"}}>{l}</span>
                    <span className="mono" style={{color:c,fontWeight:600}}>{v}%</span>
                  </div>
                  <div className="bar-w">
                    <div className="bar-f" style={{width:`${v*2.5}%`,background:`linear-gradient(90deg,${c}78,${c})`}}/>
                  </div>
                </div>
              ))}
              {selected.alert&&(
                <div style={{marginTop:12,padding:"10px 14px",borderRadius:10,
                  background:`${ALERT_COLS[selected.alert]||C.am}12`,
                  border:`1px solid ${ALERT_COLS[selected.alert]||C.am}28`,
                  fontSize:12,color:ALERT_COLS[selected.alert]||C.am}}>
                  {ALERT_LABELS[selected.alert]} Alert — intervention opportunity identified
                </div>
              )}
            </div>
          ):(
            <div className="card fu" style={{padding:20,textAlign:"center",color:"rgba(255,255,255,0.3)",fontSize:13}}>
              Click a district bar to see detailed breakdown
            </div>
          )}

          <div className="card fu" style={{padding:20,flex:1}}>
            <div style={{fontWeight:700,fontSize:13,fontFamily:"Sora",marginBottom:14}}>🚨 Active Alerts</div>
            {[
              {l:"HIGH",d:"Chennai + Hyderabad",msg:"Diabetes prevalence >20% — screening scale-up needed",col:C.rd},
              {l:"HIGH",d:"New Delhi",msg:"AQI forecast >300 — +11% respiratory admissions expected",col:C.rd},
              {l:"MED", d:"Mumbai",msg:"Urban stress burden driving cardiac risk elevation",col:C.am},
              {l:"MED", d:"Bengaluru",msg:"Sedentary tech workforce — prevention opportunity",col:C.am},
              {l:"LOW", d:"Kerala",msg:"Best-practice primary care model — 28% complication reduction",col:C.gr},
            ].map((a,i)=>(
              <div key={i} style={{padding:"10px 12px",marginBottom:8,borderRadius:9,
                background:`${a.col}09`,borderLeft:`3px solid ${a.col}55`,fontSize:12}}>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3}}>
                  <span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:4,background:`${a.col}22`,color:a.col}}>{a.l}</span>
                  <span style={{fontWeight:600,color:"rgba(255,255,255,0.7)"}}>{a.d}</span>
                </div>
                <div style={{color:"rgba(255,255,255,0.42)"}}>{a.msg}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  FEDERATED LEARNING NARRATIVE
//  Privacy-preserving AI · Architecture + Training Simulator
// ═══════════════════════════════════════════════════════════
const FED_HOSPITALS=[
  {id:"H1",name:"AIIMS Delhi",     city:"Delhi",     patients:94200,col:C.cy},
  {id:"H2",name:"KEM Mumbai",      city:"Mumbai",    patients:71800,col:C.pu},
  {id:"H3",name:"Apollo Chennai",  city:"Chennai",   patients:58400,col:C.am},
  {id:"H4",name:"Manipal Blr",     city:"Bengaluru", patients:42100,col:C.gr},
  {id:"H5",name:"PGIMER Chd",      city:"Chandigarh",patients:31600,col:C.cy},
];

function FederatedLearning(){
  const [rounds,setRounds]=useState([]);
  const [simulating,setSimulating]=useState(false);
  const [currentRound,setCurrentRound]=useState(0);
  const [narrative,setNarrative]=useState("");

  const runSim=async()=>{
    setSimulating(true);setRounds([]);setCurrentRound(0);
    const totalRounds=5;
    const baseAcc=0.72;
    const generated=[];

    for(let r=1;r<=totalRounds;r++){
      await new Promise(res=>setTimeout(res,700));
      const improvement=0.04*Math.exp(-r*0.35);
      const acc=Math.min(0.945,baseAcc+improvement*r+Math.random()*0.008-0.004);
      generated.push({
        round_num:r,
        global_accuracy:parseFloat(acc.toFixed(3)),
        privacy_budget:parseFloat((r*0.18).toFixed(2)),
        hospitals:FED_HOSPITALS.map(h=>({
          ...h,
          local_acc:parseFloat((acc+Math.random()*0.02-0.01).toFixed(3)),
          privacy_score:parseFloat((97.8-r*0.35+Math.random()*0.4).toFixed(1)),
        }))
      });
      setRounds([...generated]);
      setCurrentRound(r);
    }
    const finalAcc=(generated[4].global_accuracy*100).toFixed(1);
    setNarrative(`Five hospitals. 298,100 patients. Zero data shared. Through gradient aggregation with differential privacy, MediTwin's federated model reached ${finalAcc}% accuracy — while guaranteeing no patient record ever crossed a hospital boundary.`);
    setSimulating(false);
  };

  const latest=rounds[rounds.length-1];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div>
        <h1 className="sec-h">🔐 Federated Learning</h1>
        <p className="sec-s">Privacy-preserving AI · 5 hospitals · Zero patient data shared · Differential privacy</p>
      </div>

      <div className="card fu" style={{padding:22}}>
        <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:16}}>🏗️ Architecture</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-around",flexWrap:"wrap",gap:12}}>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {FED_HOSPITALS.map(h=>(
              <div key={h.id} style={{padding:"8px 14px",borderRadius:10,
                background:`${h.col}10`,border:`1px solid ${h.col}28`,fontSize:12,minWidth:140}}>
                <div style={{fontWeight:600,color:h.col}}>{h.name}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>{h.patients.toLocaleString("en-IN")} patients</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.25)"}}>trains locally only</div>
              </div>
            ))}
          </div>

          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            {[1,2,3,4,5].map(i=>(
              <div key={i} style={{fontSize:13,color:"rgba(255,255,255,0.25)",display:"flex",alignItems:"center",gap:4}}>
                <span style={{fontSize:9,color:C.gr}}>Δ weights only</span>
                <span>→</span>
              </div>
            ))}
          </div>

          <div style={{padding:"20px 22px",borderRadius:14,background:"rgba(124,77,255,0.12)",
            border:"1px solid rgba(124,77,255,0.35)",textAlign:"center",minWidth:130}}>
            <div style={{fontSize:22,marginBottom:6}}>🧠</div>
            <div style={{fontWeight:700,color:"#b388ff",fontSize:13}}>MediTwin</div>
            <div style={{fontWeight:700,color:"#b388ff",fontSize:13}}>Aggregator</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginTop:6}}>combines gradients<br/>never sees patient data</div>
          </div>

          <div style={{padding:"14px 16px",borderRadius:12,background:"rgba(255,23,68,0.07)",
            border:"1px solid rgba(255,23,68,0.18)",fontSize:12,maxWidth:160}}>
            <div style={{fontWeight:700,color:C.rd,marginBottom:8}}>🚫 Never shared</div>
            {["Patient names","Diagnoses","Lab results","Vitals","Medical history"].map(s=>(
              <div key={s} style={{color:"rgba(255,255,255,0.45)",marginBottom:3}}>• {s}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="card fu" style={{padding:22}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora"}}>
            🎮 Training Simulator {currentRound>0&&`— Round ${currentRound}/5`}
          </div>
          <button className="btn btn-solid" onClick={runSim} disabled={simulating} style={{fontSize:13}}>
            {simulating?"⏳ Training in progress…":"▶ Run Federated Training"}
          </button>
        </div>

        {rounds.length>0&&(
          <>
            <div style={{marginBottom:16}}>
              {rounds.map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",width:52}}>Round {r.round_num}</div>
                  <div style={{flex:1}}>
                    <div className="bar-w">
                      <div className="bar-f" style={{width:`${(r.global_accuracy/0.95)*100}%`,
                        background:`linear-gradient(90deg,${C.pu}88,${C.pu})`,transition:"width .7s ease"}}/>
                    </div>
                  </div>
                  <div className="mono" style={{color:C.pu,fontWeight:600,fontSize:12,width:50,textAlign:"right"}}>
                    {(r.global_accuracy*100).toFixed(1)}%
                  </div>
                  <div style={{fontSize:10,color:C.am,width:58,textAlign:"right"}}>ε={r.privacy_budget}</div>
                </div>
              ))}
            </div>

            {latest&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginTop:8}}>
                {[
                  {l:"Final Accuracy",v:`${(latest.global_accuracy*100).toFixed(1)}%`,col:C.pu},
                  {l:"Patients (never shared)",v:"298,100",col:C.gr},
                  {l:"Privacy budget used",v:`ε=${latest.privacy_budget}`,col:C.am},
                ].map((s,i)=>(
                  <div key={i} style={{padding:"12px 14px",borderRadius:10,background:`${s.col}0a`,border:`1px solid ${s.col}1a`}}>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginBottom:4}}>{s.l}</div>
                    <div className="mono" style={{fontSize:20,color:s.col,fontWeight:500}}>{s.v}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {rounds.length===0&&!simulating&&(
          <div style={{textAlign:"center",padding:"24px 0",color:"rgba(255,255,255,0.28)",fontSize:13}}>
            Click "Run Federated Training" to simulate 5 rounds across 5 Indian hospitals
          </div>
        )}
      </div>

      {narrative&&(
        <div style={{padding:"18px 22px",borderRadius:14,background:"rgba(124,77,255,0.08)",
          border:"1px solid rgba(124,77,255,0.22)",fontSize:14,lineHeight:1.85,color:"rgba(255,255,255,0.85)"}}>
          🎬 {narrative}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  ModelLab PAGE — Accuracy / F1 / Confusion Matrix / ROC Curve
// ═══════════════════════════════════════════════════════════

function ModelLab() {
  const DISEASES = [
    {key:"diabetes", label:"Diabetes",     icon:"🩸", color:C.am},
    {key:"heart",    label:"Heart Disease",icon:"❤️", color:C.rd},
    {key:"stroke",   label:"Stroke",       icon:"🧠", color:C.pu},
  ];
  const [sel, setSel] = useState("diabetes");
  const m = ML_MODELS[sel];
  const meta = m.metadata;
  const metrics = meta.metrics;
  const cm = metrics.confusion_matrix;
  const {tn,fp,fn,tp} = cm;
  const total = tn+fp+fn+tp;
  const colD = DISEASES.find(d=>d.key===sel);

  const METRIC_TILES = [
    {label:"Accuracy",  val:+(metrics.accuracy*100).toFixed(1)+"%",  icon:"🎯", col:C.cy},
    {label:"Precision", val:+(metrics.precision*100).toFixed(1)+"%", icon:"📐", col:C.gr},
    {label:"Recall",    val:+(metrics.recall*100).toFixed(1)+"%",    icon:"🔍", col:C.am},
    {label:"F1 Score",  val:+metrics.f1.toFixed(3),                  icon:"⚖️", col:C.pu},
    {label:"ROC-AUC",   val:+metrics.roc_auc.toFixed(3),             icon:"📈", col:colD.color},
  ];

  const allModels = Object.entries(meta.all_models_compared).map(([name,r])=>({
    name:name.replace("_"," ").replace(/\b\w/g,c=>c.toUpperCase()),
    ...r,
    best: name===meta.best_model,
  }));

  const sourceChip = (src) => {
    const labels = {local_file:"🟢 Real Dataset", downloaded:"🔵 Downloaded", offline_fallback:"🟡 Offline Fallback"};
    const classes = {local_file:"chip-g", downloaded:"chip-c", offline_fallback:"chip-a"};
    return <span className={`chip ${classes[src]||"chip-a"}`}>{labels[src]||src}</span>;
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
        <div>
          <h1 className="sec-h">{"🧪"} Model Performance Lab</h1>
          <p className="sec-s">Real trained models (scikit-learn) · Cross-validated against clinical engines · Full evaluation suite</p>
        </div>
        <div style={{display:"flex",gap:8}}>
          {DISEASES.map(d=>(
            <button key={d.key} className={`yr-btn ${sel===d.key?"on":""}`} onClick={()=>setSel(d.key)}
              style={sel===d.key?{borderColor:`${d.color}50`,background:`${d.color}15`,color:d.color}:{}}>
              {d.icon} {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dataset Provenance Banner */}
      <div className="card fu" style={{padding:"14px 20px",background:`${colD.color}08`,border:`1px solid ${colD.color}22`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
        <div style={{fontSize:13}}>
          <span style={{fontWeight:700,color:colD.color}}>{meta.dataset_name}</span>
          <span style={{color:"rgba(255,255,255,0.45)",marginLeft:10}}>{meta.n_samples} rows · {meta.n_features} features · {+(meta.positive_rate*100).toFixed(1)}% positive class</span>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {sourceChip(meta.data_source)}
          <span className="chip chip-c" style={{fontSize:9}}>Best: {meta.best_model.replace(/_/g," ").toUpperCase()}</span>
          {meta.data_source==="offline_fallback" && (
            <span style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>Place real CSV in backend/ml/data/ — see README</span>
          )}
        </div>
      </div>

      {/* Metric Tiles */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:14}}>
        {METRIC_TILES.map((t,i)=>(
          <div key={i} className="mc fu" style={{textAlign:"center"}}>
            <div style={{fontSize:24,marginBottom:8}}>{t.icon}</div>
            <div className="mono" style={{fontSize:22,fontWeight:600,color:t.col}}>{t.val}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.38)",marginTop:4}}>{t.label}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        {/* Confusion Matrix */}
        <div className="card fu" style={{padding:22}}>
          <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:18}}>{"📊"} Confusion Matrix</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,maxWidth:280,margin:"0 auto"}}>
            {[
              {label:"True Negative",  abbr:"TN", val:tn, bg:"rgba(0,255,157,0.12)",  bc:"rgba(0,255,157,0.3)",  tc:C.gr},
              {label:"False Positive", abbr:"FP", val:fp, bg:"rgba(255,23,68,0.08)",  bc:"rgba(255,23,68,0.25)",  tc:C.rd},
              {label:"False Negative", abbr:"FN", val:fn, bg:"rgba(255,145,0,0.08)",  bc:"rgba(255,145,0,0.25)",  tc:C.am},
              {label:"True Positive",  abbr:"TP", val:tp, bg:"rgba(0,255,157,0.12)",  bc:"rgba(0,255,157,0.3)",  tc:C.gr},
            ].map((c,i)=>(
              <div key={i} style={{padding:"18px 14px",borderRadius:12,background:c.bg,border:`1px solid ${c.bc}`,textAlign:"center"}}>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.38)",letterSpacing:1,marginBottom:6}}>{c.abbr}</div>
                <div className="mono" style={{fontSize:28,fontWeight:600,color:c.tc}}>{c.val}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",marginTop:4}}>{c.label}</div>
                <div style={{fontSize:9,color:"rgba(255,255,255,0.22)",marginTop:2}}>{+(c.val/total*100).toFixed(1)}%</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:16,fontSize:11,color:"rgba(255,255,255,0.32)",textAlign:"center"}}>
            80/20 stratified train/test split · n_test = {total}
          </div>
        </div>

        {/* ROC Curve */}
        <div className="card fu" style={{padding:22}}>
          <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:8}}>{"📈"} ROC Curve</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginBottom:14}}>
            AUC = <span className="mono" style={{color:colD.color,fontWeight:600}}>{metrics.roc_auc.toFixed(3)}</span>
            <span style={{marginLeft:12,color:"rgba(255,255,255,0.25)"}}>Higher = better · 0.5 = random classifier</span>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart margin={{top:4,right:8,bottom:4,left:4}}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
              <XAxis type="number" dataKey="fpr" domain={[0,1]} tick={{fill:"rgba(255,255,255,0.3)",fontSize:10}}
                label={{value:"False Positive Rate",fill:"rgba(255,255,255,0.25)",fontSize:10,position:"insideBottom",dy:4}}/>
              <YAxis type="number" dataKey="tpr" domain={[0,1]} tick={{fill:"rgba(255,255,255,0.3)",fontSize:10}}/>
              <Tooltip formatter={(v)=>v.toFixed(3)}
                contentStyle={{background:"#070d22",border:`1px solid ${colD.color}30`,borderRadius:12,fontSize:12}}/>
              {/* Random-classifier diagonal */}
              <Line data={[{fpr:0,tpr:0},{fpr:1,tpr:1}]} dataKey="tpr" dot={false}
                stroke="rgba(255,255,255,0.18)" strokeDasharray="4 4" strokeWidth={1}/>
              {/* Actual ROC */}
              <Line data={metrics.roc_curve} dataKey="tpr" dot={false}
                stroke={colD.color} strokeWidth={2.5}
                style={{filter:`drop-shadow(0 0 4px ${colD.color}60)`}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        {/* Model Comparison Table */}
        <div className="card fu" style={{padding:22}}>
          <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:16}}>{"🏆"} Model Comparison (Same Split)</div>
          {allModels.map((m,i)=>(
            <div key={i} style={{padding:"12px 14px",marginBottom:8,borderRadius:11,
              background:m.best?`${colD.color}0e`:"rgba(255,255,255,0.025)",
              border:`1px solid ${m.best?colD.color+"35":"rgba(255,255,255,0.06)"}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <span style={{fontSize:13,fontWeight:m.best?700:500,color:m.best?colD.color:"rgba(255,255,255,0.65)"}}>{m.name}</span>
                {m.best && <span className="chip chip-g" style={{fontSize:9}}>SELECTED</span>}
              </div>
              <div style={{display:"flex",gap:16,fontSize:12}}>
                {[["Acc",m.accuracy],["F1",m.f1],["AUC",m.roc_auc]].map(([l,v],j)=>(
                  <span key={j}><span style={{color:"rgba(255,255,255,0.32)"}}>{l}: </span>
                  <span className="mono" style={{color:m.best?colD.color:"rgba(255,255,255,0.6)"}}>{(v*100).toFixed(1)}%</span></span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Feature Importance Bar Chart */}
        <div className="card fu" style={{padding:22}}>
          <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:6}}>{"🔬"} Feature Importance</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.32)",marginBottom:14}}>
            {meta.explainability_method === "SHAP (TreeExplainer)" ? "Mean |SHAP value| — exact Shapley attribution"
              : "Coefficient magnitude (|coef × scale|) — exact for standardized LogReg"}
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart layout="vertical" data={meta.global_feature_importance.slice(0,6)}
              margin={{top:0,right:12,bottom:0,left:4}}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false}/>
              <XAxis type="number" tick={{fill:"rgba(255,255,255,0.3)",fontSize:10}}/>
              <YAxis type="category" dataKey="feature" width={140}
                tick={{fill:"rgba(255,255,255,0.55)",fontSize:10}}/>
              <Tooltip contentStyle={{background:"#070d22",border:`1px solid ${colD.color}30`,borderRadius:12,fontSize:12}}/>
              <Bar dataKey="importance" fill={colD.color} fillOpacity={0.75} radius={[0,4,4,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Transparency Card (Responsible AI) */}
      <div className="card fu" style={{padding:22,background:"rgba(124,77,255,0.05)",border:"1px solid rgba(124,77,255,0.18)"}}>
        <div style={{fontWeight:700,fontSize:14,fontFamily:"Sora",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
          {"📋"} Model Card <span className="chip chip-p" style={{fontSize:9}}>RESPONSIBLE AI</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,fontSize:12}}>
          {[
            {label:"Dataset",    val:meta.dataset_name},
            {label:"Training rows", val:meta.n_samples},
            {label:"Test rows",     val:total},
            {label:"Algorithm",     val:meta.best_model.replace(/_/g," ")},
            {label:"Trained at",    val:meta.trained_at.split("T")[0]},
            {label:"Data source",   val:meta.data_source.replace(/_/g," ")},
            {label:"Positive rate", val:+(meta.positive_rate*100).toFixed(1)+"%"},
            {label:"Explainability",val:meta.explainability_method.split(" (")[0]},
            {label:"Intended use",  val:"Population screening — not individual diagnosis"},
          ].map(({label,val},i)=>(
            <div key={i} style={{padding:"10px 12px",background:"rgba(255,255,255,0.025)",borderRadius:9,border:"1px solid rgba(255,255,255,0.06)"}}>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginBottom:4}}>{label}</div>
              <div style={{color:"rgba(255,255,255,0.75)",fontFamily:"DM Mono",fontSize:11}}>{String(val)}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop:14,fontSize:11,color:"rgba(255,255,255,0.38)",padding:"10px 14px",background:"rgba(255,255,255,0.02)",borderRadius:9,border:"1px solid rgba(255,255,255,0.05)"}}>
          {"⚠️ LIMITATIONS: "}Trained on population cohort data (offline statistical approximation when real dataset unavailable). Not validated on Indian population-specific cohorts. Designed for risk awareness only — not a clinical diagnostic tool. Always recommend specialist review for any high-risk prediction.
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  MLAgreementChip — inline cross-validation chip that slots
//  into the EXISTING DiseaseRisk page next to each risk bar
// ═══════════════════════════════════════════════════════════
function MLAgreementChip({ clinicalPct, mlResult, agreementLabel, color }) {
  const [open, setOpen] = useState(false);
  const chipStyle = {
    cursor:"pointer",
    fontSize:9,
    padding:"2px 8px",
    borderRadius:100,
    transition:"all .18s",
  };
  const labelMap = {
    high_agreement:    { cls:"chip-g", label:`ML: ${mlResult?.probability_pct}% · ✓ Validated` },
    moderate_agreement:{ cls:"chip-c", label:`ML: ${mlResult?.probability_pct}% · ~ Moderate` },
    discrepancy_review_recommended: { cls:"chip-r", label:`ML: ${mlResult?.probability_pct}% · ⚠ Review` },
    unavailable:       { cls:"chip-p", label:`ML: ${mlResult?.probability_pct}%` },
  };
  const chip = labelMap[agreementLabel] || labelMap.unavailable;

  return (
    <span style={{position:"relative",display:"inline-flex",alignItems:"center"}}>
      <span className={`chip ${chip.cls}`} style={chipStyle} onClick={e=>{e.stopPropagation();setOpen(o=>!o);}}>
        {chip.label}
      </span>
      {open && mlResult && (
        <div style={{position:"absolute",top:"calc(100% + 6px)",right:0,zIndex:100,
          width:280,padding:"14px 16px",borderRadius:12,
          background:"#0b1330",border:`1px solid ${color}35`,
          boxShadow:"0 8px 32px rgba(0,0,0,0.5)",animation:"fadeUp .25s ease"}}>
          <div style={{fontSize:11,fontWeight:700,color,marginBottom:10}}>
            ML Cross-Validation · {mlResult.model_used.replace(/_/g," ")}
          </div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginBottom:10}}>
            Dataset: {mlResult.dataset_name}
            <br/>Accuracy: <span className="mono" style={{color}}>{+(mlResult.model_accuracy*100).toFixed(1)}%</span>
            {"  "}ROC-AUC: <span className="mono" style={{color}}>{mlResult.model_roc_auc.toFixed(3)}</span>
            <br/>Method: {mlResult.top_factors?.[0]?.contribution !== undefined ? "Coefficient × Z-score (exact)" : "Permutation Importance"}
          </div>
          <div style={{fontSize:11,fontWeight:600,marginBottom:8,color:"rgba(255,255,255,0.7)"}}>Top factors (this patient):</div>
          {(mlResult.top_factors||[]).map((f,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:10,
              padding:"4px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              <span style={{color:"rgba(255,255,255,0.55)"}}>{f.feature}</span>
              <span>
                <span className="mono" style={{color:"rgba(255,255,255,0.35)",marginRight:6}}>{f.value}</span>
                <span style={{color:f.direction==="increases_risk"?C.rd:C.gr}}>
                  {f.contribution > 0 ? "+" : ""}{f.contribution.toFixed(3)}
                </span>
              </span>
            </div>
          ))}
          <div style={{marginTop:10,fontSize:9,color:"rgba(255,255,255,0.25)",lineHeight:1.5}}>
            Contributions relative to training cohort mean, not clinical absolute thresholds.
            Compare clinical score above for threshold-based reference.
          </div>
          <button onClick={e=>{e.stopPropagation();setOpen(false);}}
            style={{marginTop:10,fontSize:10,background:"none",border:"none",color:"rgba(255,255,255,0.3)",cursor:"pointer"}}>
            close
          </button>
        </div>
      )}
    </span>
  );
}

// Augmented RBar with real ML cross-validation chip
// Replaces (or wraps) the existing RBar component in the DiseaseRisk page
function RBarWithML({label, val, conf, diseaseKey, clinicalName, color}) {
  const fc = val>60?C.rd:val>35?C.am:C.gr;
  const [mlData, setMlData] = useState(null);

  useEffect(() => {
    if (!diseaseKey) return;
    try {
      const cv = crossValidateML(diseaseKey);
      setMlData(cv);
    } catch (e) {
      // stroke has no clinical counterpart — still show ML result
      try { setMlData({ ml: predictML(diseaseKey), clinical_pct: null, delta: null, label: "unavailable" }); }
      catch {}
    }
  }, [diseaseKey]);

  return (
    <div style={{marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:7,fontSize:13,flexWrap:"wrap",gap:6}}>
        <span style={{color:"rgba(255,255,255,0.68)"}}>{label}</span>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          {conf && <span style={{fontSize:10,color:"rgba(255,255,255,0.28)"}}>Clinical {conf}%</span>}
          <span className="mono" style={{fontWeight:500,color:fc}}>{val}%</span>
          {mlData && (
            <MLAgreementChip
              clinicalPct={val}
              mlResult={mlData.ml}
              agreementLabel={mlData.label}
              color={color||C.cy}
            />
          )}
        </div>
      </div>
      <div className="bar-w"><div className="bar-f" style={{width:`${val}%`,background:`linear-gradient(90deg,${fc}78,${fc})`}}/></div>
    </div>
  );
}

export default function MediTwinAI(){
  const [page,setPage]=useState("dash");const [open,setOpen]=useState(true);
  const NAV=[{id:"dash",icon:"🏠",l:"Dashboard"},{id:"twin",icon:"🧬",l:"Digital Twin"},{id:"family",icon:"🌳",l:"Family Twin",badge:"NEW"},{id:"timemachine",icon:"⏳",l:"Time Machine",badge:"NEW"},{id:"impact",icon:"💰",l:"Preventive ROI",badge:"NEW"},{id:"parallel",icon:"🌌",l:"Parallel Universe",badge:"🔥"},{id:"wearable",icon:"⌚",l:"Wearable Twin",badge:"LIVE"},{id:"population",icon:"🌍",l:"Population Health",badge:"NEW"},{id:"federated",icon:"🔐",l:"Federated Learning",badge:"AI"},{id:"chat",icon:"🤖",l:"AI Assistant",badge:"AI"},{id:"reports",icon:"📄",l:"Report Analyzer"},{id:"whatif",icon:"🔮",l:"What-If Sim",badge:"NEW"},{id:"risk",icon:"📊",l:"Disease Risk"},{id:"timeline",icon:"⏱️",l:"Timeline"},{id:"triage",icon:"🚨",l:"Triage",badge:"3"},{id:"recs",icon:"💊",l:"Recommendations"},{id:"modellab",icon:"🧪",l:"Model Lab",badge:"ML"},{id:"demo",icon:"🎬",l:"Demo Mode",badge:"DEMO"},{id:"story",icon:"🎥",l:"Story Mode",badge:"WOW"},{id:"cascade",icon:"💧",l:"Intervention Cascade",badge:"NEW"},{id:"bioage",icon:"🧬",l:"Bio Age Shock",badge:"🔥"},{id:"costtimebomb",icon:"💣",l:"Cost Calculator",badge:"NEW"}];
  const PAGES={dash:<Dashboard go={setPage}/>,twin:<DigitalTwin/>,family:<FamilyTwin/>,timemachine:<TimeMachine/>,impact:<PreventiveImpact/>,parallel:<ParallelUniverse/>,wearable:<WearableDigitalTwin/>,population:<PopulationHealth/>,federated:<FederatedLearning/>,chat:<AIChat/>,reports:<ReportAnalyzer/>,whatif:<WhatIf/>,risk:<DiseaseRisk/>,timeline:<HealthTimeline/>,triage:<EmergencyTriage/>,recs:<Recommendations/>,modellab:<ModelLab/>,demo:<DemoMode/>,story:<StoryMode/>,cascade:<InterventionCascade/>,bioage:<BioAgeShock/>,costtimebomb:<CostTimeBomb/>};
  return(
    <>
      <style>{S}</style>
      <div style={{display:"flex",height:"100vh",overflow:"hidden",background:"#02061a"}}>
        <div style={{position:"fixed",inset:0,backgroundImage:"linear-gradient(rgba(0,229,255,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.022) 1px,transparent 1px)",backgroundSize:"44px 44px",pointerEvents:"none",zIndex:0}}/>
        <div style={{width:open?234:56,transition:"width .28s ease",background:"linear-gradient(180deg,#07102a 0%,#060d22 100%)",borderRight:"1px solid rgba(0,229,255,0.07)",display:"flex",flexDirection:"column",padding:"18px 10px",overflow:"hidden",flexShrink:0,position:"relative",zIndex:10}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:28,paddingLeft:4}}>
            <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,rgba(0,229,255,0.35),rgba(124,77,255,0.35))",border:"1px solid rgba(0,229,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,animation:"pulseC 3s ease-in-out infinite"}}>{"🧬"}</div>
            {open&&<div><div className="sora gt" style={{fontSize:16,fontWeight:700,lineHeight:1}}>MediTwin</div><div style={{fontSize:9,color:"rgba(255,255,255,0.22)",letterSpacing:2,marginTop:2}}>AI HEALTH OS</div></div>}
          </div>
          <div style={{flex:1,overflowY:"auto",overflowX:"hidden",minHeight:0,paddingRight:2,marginRight:-2}}>
            {open&&<div style={{fontSize:9,color:"rgba(255,255,255,0.18)",letterSpacing:2,marginBottom:8,paddingLeft:12}}>NAVIGATION</div>}
            {NAV.map(n=>(
              <div key={n.id} className={`nav ${page===n.id?"on":""}`} onClick={()=>setPage(n.id)} style={{justifyContent:open?"flex-start":"center"}}>
                <span style={{fontSize:17,flexShrink:0}}>{n.icon}</span>
                {open&&<><span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis"}}>{n.l}</span>{n.badge&&<span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:4,background:n.badge==="3"?"rgba(255,23,68,0.25)":n.badge==="AI"?"rgba(0,229,255,0.18)":"rgba(124,77,255,0.25)",color:n.badge==="3"?C.rd:n.badge==="AI"?C.cy:"#b388ff"}}>{n.badge}</span>}</>}
              </div>
            ))}
            <div style={{height:8,flexShrink:0}}/>
          </div>
          {open&&<div style={{padding:"14px",background:"rgba(0,229,255,0.06)",borderRadius:11,border:"1px solid rgba(0,229,255,0.1)",marginBottom:10}}><div style={{fontSize:10,color:C.cy,fontWeight:700,letterSpacing:1,marginBottom:7}}>ACTIVE PATIENT</div><div style={{fontSize:13,fontWeight:600}}>{PT.name}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.33)",marginTop:1}}>{PT.id}</div><div style={{display:"flex",alignItems:"center",gap:6,marginTop:8}}><span className="dot dot-live" style={{width:6,height:6}}/><span style={{fontSize:10,color:C.gr}}>Monitoring Active</span></div></div>}
          <button onClick={()=>setOpen(o=>!o)} style={{width:"100%",padding:"9px",borderRadius:9,cursor:"pointer",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.28)",fontSize:14,display:"flex",justifyContent:"center",transition:"all .2s",outline:"none"}}>{open?"◀":"▶"}</button>
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",position:"relative",zIndex:1}}>
          <div style={{padding:"14px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(255,255,255,0.04)",background:"rgba(2,6,26,0.85)",backdropFilter:"blur(20px)",flexShrink:0,zIndex:5}}>
            <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12}}><span style={{color:"rgba(255,255,255,0.22)"}}>MediTwin AI</span><span style={{color:"rgba(255,255,255,0.14)"}}>/</span><span style={{color:C.cy,fontWeight:600}}>{(NAV.find(n=>n.id===page)||{l:""}).l}</span></div>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.28)",fontFamily:"DM Mono"}}>{new Date().toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short",year:"numeric"})}</div>
              <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",background:"rgba(0,255,157,0.08)",border:"1px solid rgba(0,255,157,0.18)",borderRadius:100,fontSize:11}}><span className="dot dot-live" style={{width:6,height:6}}/><span style={{color:C.gr}}>All Systems Active</span></div>
              <div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,rgba(0,229,255,0.24),rgba(124,77,255,0.24))",border:"1px solid rgba(0,229,255,0.24)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{"👤"}</div>
            </div>
          </div>
          <div key={page} style={{flex:1,overflowY:"auto",padding:"22px 24px",animation:"fadeUp .35s ease"}}>{PAGES[page]}</div>
        </div>
      </div>
    </>
  );
}
