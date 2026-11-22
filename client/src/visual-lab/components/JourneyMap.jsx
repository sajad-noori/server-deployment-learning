import { ArrowDown, ArrowLeftRight, ArrowUp, CheckCircle2, CircleHelp, Cloud, Code2, Database, Laptop, LockKeyhole, Package, Router, Server, ShieldCheck } from "lucide-react";
import "./journey-map.css";

const icons = { monitor:Laptop, globe:Router, shield:ShieldCheck, server:Server, code:Code2, database:Database, check:CheckCircle2, laptop:Laptop, git:ArrowLeftRight, github:Cloud, package:Package, cloud:Cloud, sliders:Router, cpu:Code2, reply:ArrowUp, route:Router, lock:LockKeyhole };

export function JourneyMap({ stages, activeIndex, onSelect, playing }) {
  const active = stages[activeIndex];
  return <section className="journey-map" aria-label="Website request journey">
    <div className="journey-map-heading"><div><span className="journey-live-dot" /> LIVE REQUEST JOURNEY</div><span>STEP {String(activeIndex+1).padStart(2,"0")} OF {String(stages.length).padStart(2,"0")}</span></div>
    <div className="journey-map-caption"><span>FOLLOW THE REQUEST <ArrowDown size={13}/></span><span className="journey-map-caption-note">Select any system to inspect it</span></div>
    <div className={`journey-nodes ${playing?"is-playing":"is-paused"}`} style={{"--journey-progress":`${stages.length>1?activeIndex/(stages.length-1)*100:0}%`,"--journey-count":stages.length}}>
      <div className="journey-track"><span className="journey-track-fill"/><i className="journey-packet journey-packet-one"/><i className="journey-packet journey-packet-two"/></div>
      {stages.map((stage,index)=>{const Icon=icons[stage.icon]||CircleHelp;const state=index<activeIndex?"is-done":index===activeIndex?"is-active":"is-upcoming";return <button type="button" key={stage.name} className={`journey-node ${state}`} onClick={()=>onSelect(index)} aria-current={index===activeIndex?"step":undefined}>
        <span className="journey-node-icon"><Icon size={20} strokeWidth={1.8}/>{index<activeIndex&&<CheckCircle2 className="journey-node-check" size={13}/>}</span>
        <strong>{stage.name}</strong><small>{stage.label}</small><span className="journey-node-state">{index<activeIndex?"COMPLETED":index===activeIndex?"NOW PROCESSING":"UP NEXT"}</span>
      </button>;})}
    </div>
    <div className="journey-direction"><span><ArrowDown size={13}/> REQUEST GOES TO THE SERVER</span><span><ArrowUp size={13}/> RESPONSE RETURNS TO THE BROWSER</span></div>
    <div className="journey-active-summary"><span className="journey-summary-pulse"/><div><strong>Currently happening: {active.name}</strong><p>{active.label}</p></div></div>
  </section>;
}
