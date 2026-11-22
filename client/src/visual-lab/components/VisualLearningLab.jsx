import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Globe2, Pause, Play, RotateCcw, Server, Workflow } from "lucide-react";
import { visualScenarios } from "../data/scenarios.js";
import { JourneyMap } from "./JourneyMap.jsx";
import { StageExplanation } from "./StageExplanation.jsx";
import "../styles/visual-learning-lab.css";

const STORAGE_KEY = "deploylab-visual-lab-completed";
const readCompleted = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; } };

export function VisualLearningLab() {
  const [scenarioId, setScenarioId] = useState(visualScenarios[0].id);
  const [stageIndex, setStageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [completed, setCompleted] = useState(readCompleted);
  const scenario = useMemo(() => visualScenarios.find((item) => item.id === scenarioId) || visualScenarios[0], [scenarioId]);
  const stage = scenario.stages[stageIndex];
  const progress = Math.round(((stageIndex + 1) / scenario.stages.length) * 100);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(completed)); }, [completed]);
  useEffect(() => {
    if (!isPlaying) return undefined;
    const timer = window.setInterval(() => {
      setStageIndex((current) => {
        if (current >= scenario.stages.length - 1) { setIsPlaying(false); return current; }
        return current + 1;
      });
    }, 5000);
    return () => window.clearInterval(timer);
  }, [isPlaying, scenario.id, scenario.stages.length]);

  function chooseScenario(id) { setScenarioId(id); setStageIndex(0); setIsPlaying(true); }
  function moveTo(index) { setStageIndex(Math.max(0, Math.min(index, scenario.stages.length - 1))); setIsPlaying(false); }
  function finish() { setCompleted((items) => items.includes(scenario.id) ? items : [...items, scenario.id]); setIsPlaying(false); }

  return <div className="visual-lab page-content">
    <section className="visual-lab-hero">
      <div className="visual-lab-hero-copy">
        <div className="eyebrow"><span className="eyebrow-line" /> SEE THE SYSTEM WORK</div>
        <h1>Visual Learning <span>Lab.</span></h1>
        <p>See how the internet works, one step at a time. Follow the request, watch each system do its job, and learn how the response gets back to your screen.</p>
        <div className="visual-lab-hero-meta"><span><Workflow size={14} /> {visualScenarios.length} interactive simulations</span><span><CheckCircle2 size={14} /> {completed.length} completed</span></div>
      </div>
      <div className="visual-lab-hero-art" aria-hidden="true">
        <div className="visual-orbit visual-orbit-a" /><div className="visual-orbit visual-orbit-b" /><div className="visual-core"><Workflow size={38} /></div>
        <span className="visual-float visual-float-one"><Globe2 size={15} /> DNS</span><span className="visual-float visual-float-two"><Workflow size={15} /> App</span><span className="visual-float visual-float-three"><Server size={15} /> Server</span>
      </div>
    </section>
    <section className="visual-scenario-picker">
      <div className="visual-section-heading"><div><span className="eyebrow">CHOOSE A SYSTEM</span><h2>Explore a simulation</h2></div><span className="visual-count">{visualScenarios.length} topics</span></div>
      <div className="visual-scenario-grid">{visualScenarios.map((item, index) => {
        const selected = item.id === scenario.id, done = completed.includes(item.id);
        return <button type="button" key={item.id} className={`visual-scenario-card ${selected ? "selected" : ""}`} onClick={() => chooseScenario(item.id)} aria-pressed={selected}>
          <span className="visual-card-number">0{index + 1}</span><span className="visual-card-category">{item.category}</span><strong>{item.title}</strong><small>{item.stages.length} stages · {done ? "Completed" : "Interactive"}</small>{done && <CheckCircle2 className="visual-card-check" size={16} />}
        </button>;
      })}</div>
    </section>
    <section className="visual-simulation">
      <div className="visual-simulation-head"><div><span className="eyebrow">INTERACTIVE WALKTHROUGH · {scenario.category}</span><h2>{scenario.title}</h2><p>{scenario.description}</p></div><span className="visual-stage-counter">{String(stageIndex + 1).padStart(2, "0")} <i>/ {String(scenario.stages.length).padStart(2, "0")}</i></span></div>
      <div className="visual-progress"><i style={{ width: progress + "%" }} /></div>
      <JourneyMap stages={scenario.stages} activeIndex={stageIndex} onSelect={moveTo} playing={isPlaying} />
      <StageExplanation stage={stage} index={stageIndex} />
      <div className="visual-controls">
        <div className="visual-control-group">
          <button type="button" className="visual-control secondary" onClick={() => moveTo(stageIndex - 1)} disabled={stageIndex === 0}><ArrowLeft size={15} /> Previous</button>
          <button type="button" className="visual-control primary" onClick={() => stageIndex === scenario.stages.length - 1 ? finish() : moveTo(stageIndex + 1)}>{stageIndex === scenario.stages.length - 1 ? <><Check size={15} /> Complete simulation</> : <>Next stage <ArrowRight size={15} /></>}</button>
        </div>
        <div className="visual-control-group">
          <button type="button" className="visual-control subtle" onClick={() => setIsPlaying((value) => !value)}>{isPlaying ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Play animation</>}</button>
          <button type="button" className="visual-control subtle" onClick={() => { setStageIndex(0); setIsPlaying(true); }}><RotateCcw size={14} /> Restart</button>
        </div>
      </div>
    </section>
    <section className="visual-outcome"><div className="visual-outcome-icon"><CheckCircle2 size={19} /></div><div><span className="eyebrow">LEARNING OUTCOME</span><p>{scenario.outcome}</p></div></section>
    <section className="visual-next-path"><div><span className="eyebrow">CONNECT THE CONCEPT TO PRACTICE</span><h2>Ready to use what you saw?</h2><p>Return to guided lessons and practice the commands that configure each part of the system.</p></div><div className="visual-next-links"><span><CheckCircle2 size={14} /> Linux & SSH · prepare the server</span><span><CheckCircle2 size={14} /> Node.js · build the application</span><span><CheckCircle2 size={14} /> Deployment · publish and verify</span></div></section>
  </div>;
}
