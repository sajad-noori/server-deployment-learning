import { useRef, useState } from "react";
import { CheckCircle2, ChevronRight, Folder, Terminal, Lightbulb, RotateCcw } from "lucide-react";

export function LinuxPracticeLab({ onComplete }) {
  const [cwd, setCwd] = useState("/home/deploy");
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState([
    { type: "system", text: "DeployLab Linux shell · simulated Ubuntu environment" },
    { type: "system", text: "Mission: find the application folder and inspect its files. Type help for supported commands." }
  ]);
  const [checks, setChecks] = useState({ pwd: false, rootLs: false, entered: false, projectLs: false });
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);
  const completedRef = useRef(false);

  const add = (items) => setHistory((old) => [...old, ...items]);
  const run = (event) => {
    event.preventDefault();
    const raw = command.trim();
    const cmd = raw.replace(/\s+/g, " ").toLowerCase();
    if (!cmd) return;
    const next = { ...checks };
    let output = "";
    if (cmd === "help") {
      output = "Supported commands: pwd, ls, cd my-app, cd .., clear";
    } else if (cmd === "clear") {
      setHistory([]);
      setCommand("");
      return;
    } else if (cmd === "pwd") {
      output = cwd;
      next.pwd = true;
    } else if (cmd === "ls" || cmd === "ls -la") {
      if (cwd === "/home/deploy") {
        output = "my-app/   backups/";
        next.rootLs = true;
      } else if (cwd === "/home/deploy/my-app") {
        output = "README.md   package.json   server.js   src/";
        next.projectLs = true;
      } else {
        output = "No files to display.";
      }
    } else if (cmd === "cd my-app") {
      if (cwd === "/home/deploy") {
        setCwd("/home/deploy/my-app");
        output = "You are now inside /home/deploy/my-app";
        next.entered = true;
      } else {
        output = "You are already inside my-app.";
      }
    } else if (cmd === "cd ..") {
      setCwd("/home/deploy");
      output = "You moved to /home/deploy";
    } else {
      output = "bash: " + raw + ": command not found. Try pwd, ls, or cd my-app.";
    }
    setChecks(next);
    add([{ type: "command", text: raw, prompt: cwd === "/home/deploy" ? "~" : "~/my-app" }, { type: "output", text: output }]);
    if (next.pwd && next.rootLs && next.entered && next.projectLs && !completedRef.current) {
      completedRef.current = true;
      setCompleted(true);
      onComplete?.();
      add([{ type: "success", text: "✓ Mission complete! You found the project directory and inspected its files." }]);
    }
    setCommand("");
  };

  const answerCommand = !checks.pwd ? "pwd" : !checks.rootLs ? (cwd === "/home/deploy" ? "ls" : "cd ..") : !checks.entered ? (cwd === "/home/deploy/my-app" ? "cd .." : "cd my-app") : !checks.projectLs ? (cwd === "/home/deploy/my-app" ? "ls" : "cd my-app") : null;
  const reset = () => {
    setCwd("/home/deploy");
    setCommand("");
    setChecks({ pwd: false, rootLs: false, entered: false, projectLs: false });
    setCompleted(false);
    completedRef.current = false;
    setHistory([
      { type: "system", text: "DeployLab Linux shell · simulated Ubuntu environment" },
      { type: "system", text: "Mission reset. Find the application folder and inspect its files." }
    ]);
  };

  const tasks = [
    ["Check where you are", checks.pwd],
    ["List the available folders", checks.rootLs],
    ["Enter the my-app folder", checks.entered],
    ["List the application files", checks.projectLs]
  ];

  return <section className="linux-practice">
    <style>{`
      .linux-practice{margin:22px 0;border:1px solid #273449;border-radius:18px;overflow:hidden;background:#0d1420;color:#e7edf7;box-shadow:0 16px 40px #07101d18}
      .linux-practice *{box-sizing:border-box}.linux-practice-head{padding:22px 24px;background:linear-gradient(120deg,#142b2b,#142033);display:flex;justify-content:space-between;gap:16px;align-items:flex-start}
      .linux-practice-kicker{font-size:11px;letter-spacing:.12em;font-weight:800;color:#7ce0ad}.linux-practice-head h2{font-size:22px;margin:8px 0}.linux-practice-head p{margin:0;color:#b7c5d5;line-height:1.6;max-width:650px;font-size:14px}
      .linux-practice-tag{font-size:10px;letter-spacing:.08em;border:1px solid #477d69;color:#91e4b9;border-radius:30px;padding:7px 10px;white-space:nowrap}
      .linux-practice-grid{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(220px,.8fr);gap:18px;padding:20px}
      .linux-terminal{border:1px solid #2b3b4d;border-radius:12px;overflow:hidden;background:#080e17;min-width:0}
      .linux-terminal-bar{padding:11px 14px;background:#172333;display:flex;align-items:center;gap:9px;color:#c8d4e2;font-size:12px}
      .linux-dots{display:flex;gap:5px;margin-right:4px}.linux-dots i{width:8px;height:8px;border-radius:50%;background:#536477}
      .linux-terminal-screen{padding:16px;min-height:260px;max-height:360px;overflow:auto;font:13px/1.7 ui-monospace,SFMono-Regular,Consolas,monospace}
      .linux-line{white-space:pre-wrap;overflow-wrap:anywhere;margin:2px 0}.linux-line.system{color:#8da3b9}.linux-line.command{color:#f1f5f9}.linux-line.output{color:#b6d7c4}.linux-line.success{color:#7ce0ad;font-weight:700}
      .linux-prompt{color:#7ce0ad}.linux-form{display:flex;gap:9px;align-items:center;margin-top:12px}.linux-form input{flex:1;min-width:0;background:#111d2a;border:1px solid #34465a;border-radius:7px;padding:11px;color:#fff;font:inherit;outline:none}.linux-form input:focus{border-color:#72d7a2}
      .linux-form button,.linux-answer-btn,.linux-reset{border:0;border-radius:7px;padding:10px 13px;font-weight:700;cursor:pointer}.linux-form button{background:#72d7a2;color:#092016}
      .linux-task-panel{border:1px solid #2b3b4d;border-radius:12px;padding:16px;background:#111b29}.linux-task-panel h3{font-size:14px;margin:0 0 14px}.linux-task-list{display:grid;gap:12px}.linux-task{display:flex;gap:9px;align-items:flex-start;color:#c3cfdd;font-size:12px;line-height:1.45}.linux-task-icon{width:19px;height:19px;flex:none;border:1px solid #536579;border-radius:50%;display:grid;place-items:center;color:#7ce0ad}.linux-task.done .linux-task-icon{background:#214b39;border-color:#4c9c73}
      .linux-folder-preview{margin-top:18px;border-top:1px solid #2b3b4d;padding-top:14px}.linux-folder-preview strong{display:block;font-size:11px;color:#93a8bd;margin-bottom:9px}.linux-folder{display:flex;align-items:center;gap:8px;font-size:12px;color:#c8d6e4;padding:6px 0}.linux-folder svg{color:#7ed9a8}
      .linux-answer{margin:0 20px 18px;border:1px solid #435b4d;background:#12241e;border-radius:10px;padding:14px;color:#c9e4d4}.linux-answer strong{font-size:13px}.linux-answer p{font-size:12px;line-height:1.55;margin:7px 0 12px}.linux-answer code{display:block;background:#09140f;padding:10px;border-radius:7px;color:#a7efc5;font-size:12px;white-space:pre-wrap}
      .linux-practice-footer{padding:14px 20px;border-top:1px solid #253448;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;color:#93a8bd;font-size:11px}
      .linux-footer-actions{display:flex;gap:8px}.linux-answer-btn{background:#244b3a;color:#a6efc4}.linux-reset{background:#263548;color:#d5e0ed}
      @media(max-width:700px){.linux-practice-grid{grid-template-columns:1fr;padding:14px}.linux-practice-head{padding:18px;flex-direction:column}.linux-practice-head h2{font-size:19px}.linux-practice-footer{padding:14px}}
    `}</style>
    <div className="linux-practice-head"><div><span className="linux-practice-kicker">HANDS-ON LINUX WORKSHOP · LEVEL 1</span><h2>Find your application folder</h2><p>You have logged in as <strong>deploy</strong>. Your job is to locate the <code>my-app</code> project folder and inspect the files inside it. Use the terminal; the checklist updates as you work.</p></div><span className="linux-practice-tag">BEGINNER MISSION</span></div>
    <div className="linux-practice-grid">
      <div className="linux-terminal"><div className="linux-terminal-bar"><span className="linux-dots"><i/><i/><i/></span><Terminal size={14}/> deploy@server: {cwd.replace("/home/deploy","~")}</div>
        <div className="linux-terminal-screen" aria-live="polite">{history.map((item,i)=><div className={"linux-line "+item.type} key={i}>{item.type==="command"?<><span className="linux-prompt">deploy@server:{item.prompt || "~"}$ </span>{item.text}</>:item.text}</div>)}
          <form className="linux-form" onSubmit={run}><span className="linux-prompt">$</span><input value={command} onChange={e=>setCommand(e.target.value)} placeholder="Enter a Linux command..." aria-label="Linux command" autoComplete="off"/><button type="submit">Run <ChevronRight size={14}/></button></form>
        </div>
      </div>
      <aside className="linux-task-panel"><h3>YOUR MISSION CHECKLIST</h3><div className="linux-task-list">{tasks.map(([label,done])=><div className={"linux-task "+(done?"done":"")} key={label}><span className="linux-task-icon">{done?<CheckCircle2 size={13}/>:null}</span><span>{label}</span></div>)}</div><div className="linux-folder-preview"><strong>SERVER FILE SYSTEM</strong><div className="linux-folder"><Folder size={15}/> my-app/</div><div className="linux-folder"><Folder size={15}/> backups/</div><div className="linux-folder"><Folder size={15}/> src/ <span style={{color:"#8295a9"}}>inside my-app</span></div></div></aside>
    </div>
    {showAnswer&&<div className="linux-answer"><strong>Show Answer · next command</strong><p>{answerCommand===null?"You have completed every command in this mission.":`Run this command next, then return here for the following one.`}</p><code>{answerCommand===null?"Mission complete":answerCommand}</code></div>}
    <div className="linux-practice-footer"><span>{completed?"✓ Mission completed · You can reset and practice again.":"Practice tip: commands are case-sensitive on a real Linux system."}</span><div className="linux-footer-actions"><button className="linux-answer-btn" type="button" onClick={()=>setShowAnswer(v=>!v)}><Lightbulb size={14}/> {showAnswer?"Hide answer":"Show answer"}</button>{showAnswer&&answerCommand!==null&&<button className="linux-answer-btn" type="button" onClick={()=>setCommand(answerCommand)}>Use command</button>}<button className="linux-reset" type="button" onClick={reset}><RotateCcw size={13}/> Reset</button></div></div>
  </section>;
}
