import { useRef, useState } from "react";
import "../styles/linux-practice.css";
import { CheckCircle2, ChevronRight, Folder, Lightbulb, RotateCcw, Terminal } from "lucide-react";
import {
  executeNavigationCommand,
  getNextNavigationCommand,
  initialNavigationChecks,
  isNavigationMissionComplete,
  navigationTasks,
  NAVIGATION_START_DIRECTORY
} from "../linux/level1Navigation.js";

const INITIAL_HISTORY = [
  { type: "system", text: "DeployLab Linux shell · simulated Ubuntu environment" },
  { type: "system", text: "Mission: find the application folder and inspect its files. Type help for supported commands." }
];

function displayDirectory(path) {
  return path.replace("/home/deploy", "~");
}

export function LinuxPracticeLab({ onComplete }) {
  const [currentDirectory, setCurrentDirectory] = useState(NAVIGATION_START_DIRECTORY);
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [checks, setChecks] = useState(initialNavigationChecks);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);
  const completedRef = useRef(false);
  const nextCommand = getNextNavigationCommand(checks, currentDirectory);

  function handleSubmit(event) {
    event.preventDefault();
    const raw = command.trim();
    if (!raw) return;
    const result = executeNavigationCommand({ command: raw, currentDirectory, checks });
    setCommand("");
    if (result.clearHistory) {
      setHistory([]);
      return;
    }
    setCurrentDirectory(result.currentDirectory);
    setChecks(result.checks);
    setHistory((previous) => [
      ...previous,
      { type: "command", text: raw, prompt: displayDirectory(currentDirectory) },
      { type: "output", text: result.output }
    ]);
    if (isNavigationMissionComplete(result.checks) && !completedRef.current) {
      completedRef.current = true;
      setCompleted(true);
      onComplete?.();
      setHistory((previous) => [...previous, {
        type: "success",
        text: "✓ Mission complete! You found the project directory and inspected its files."
      }]);
    }
  }

  function resetPractice() {
    setCurrentDirectory(NAVIGATION_START_DIRECTORY);
    setCommand("");
    setChecks(initialNavigationChecks);
    setShowAnswer(false);
    setCompleted(false);
    completedRef.current = false;
    setHistory([INITIAL_HISTORY[0], {
      type: "system",
      text: "Mission reset. Find the application folder and inspect its files."
    }]);
  }

  return (
    <section className="linux-practice">
<div className="linux-practice-head">
        <div><span className="linux-practice-kicker">HANDS-ON LINUX WORKSHOP · LEVEL 1</span><h2>Find your application folder</h2>
          <p>You have logged in as <strong>deploy</strong>. Your job is to locate the <code>my-app</code> project folder and inspect the files inside it. Use the terminal; the checklist updates as you work.</p>
        </div>
        <span className="linux-practice-tag">BEGINNER MISSION</span>
      </div>
      <div className="linux-practice-grid">
        <div className="linux-terminal">
          <div className="linux-terminal-bar"><span className="linux-dots"><i/><i/><i/></span><Terminal size={14}/> deploy@server: {displayDirectory(currentDirectory)}</div>
          <div className="linux-terminal-screen" aria-live="polite">
            {history.map((item,index)=><div className={"linux-line "+item.type} key={index}>
              {item.type==="command"?<><span className="linux-prompt">deploy@server:{item.prompt || "~"}$ </span>{item.text}</>:item.text}
            </div>)}
            <form className="linux-form" onSubmit={handleSubmit}>
              <span className="linux-prompt">$</span><input value={command} onChange={(event)=>setCommand(event.target.value)} placeholder="Enter a Linux command..." aria-label="Linux command" autoComplete="off"/>
              <button type="submit">Run <ChevronRight size={14}/></button>
            </form>
          </div>
        </div>
        <aside className="linux-task-panel">
          <h3>YOUR MISSION CHECKLIST</h3>
          <div className="linux-task-list">{navigationTasks.map((task,index)=>{
            const done=checks[task.key];
            const unlocked=index===0||navigationTasks.slice(0,index).every((previous)=>checks[previous.key]);
            return <div className={"linux-task "+(done?"done ":"")+(unlocked?"":"locked")} key={task.key}>
              <span className="linux-task-icon">{done?<CheckCircle2 size={13}/>:null}</span>
              <span>{task.label}{!unlocked&&!done?<small className="linux-task-lock">Complete the previous task first</small>:null}</span>
            </div>;
          })}</div>
          <div className="linux-folder-preview"><strong>SERVER FILE SYSTEM</strong>
            <div className="linux-folder"><Folder size={15}/> my-app/</div><div className="linux-folder"><Folder size={15}/> backups/</div>
            <div className="linux-folder nested"><Folder size={15}/> src/ <span style={{color:"#8295a9"}}>inside my-app</span></div>
          </div>
        </aside>
      </div>
      {showAnswer&&<div className="linux-answer"><strong>Show Answer · next command</strong><p>{nextCommand===null?"You have completed every command in this mission.":"Run this command next, then return here for the following one."}</p><code>{nextCommand||"Mission complete"}</code></div>}
      <div className="linux-practice-footer">
        <span>{completed?"✓ Mission completed · You can reset and practise again.":"Practice tip: commands are case-sensitive on a real Linux system."}</span>
        <div className="linux-footer-actions">
          <button className="linux-answer-btn" type="button" onClick={()=>setShowAnswer((visible)=>!visible)}><Lightbulb size={14}/> {showAnswer?"Hide answer":"Show answer"}</button>
          {showAnswer&&nextCommand&&<button className="linux-answer-btn" type="button" onClick={()=>setCommand(nextCommand)}>Use command</button>}
          <button className="linux-reset" type="button" onClick={resetPractice}><RotateCcw size={13}/> Reset</button>
        </div>
      </div>
    </section>
  );
}
