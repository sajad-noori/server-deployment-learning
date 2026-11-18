import { useRef, useState } from "react";
import { CheckCircle2, ChevronRight, Lightbulb, RotateCcw, Server, Terminal } from "lucide-react";
import {
  executeNodeCommand,
  getNextNodeCommand,
  initialNodeChecks,
  initialNodeHistory,
  initialNodeState,
  nodeServerTemplate,
  nodeTasks,
  saveNodeServerCode
} from "../node/level1NodeSetup.js";

export function NodeDeploymentLab({ onComplete }) {
  const [server, setServer] = useState(initialNodeState);
  const [checks, setChecks] = useState(initialNodeChecks);
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState(initialNodeHistory);
  const [showAnswer, setShowAnswer] = useState(false);
  const [editorCode, setEditorCode] = useState(nodeServerTemplate);
  const [completed, setCompleted] = useState(false);
  const completedRef = useRef(false);
  const nextCommand = getNextNodeCommand(checks);
  const taskDone = nodeTasks.filter(({ key }) => checks[key]).length;
  const currentTask = nodeTasks.findIndex(({ key }) => !checks[key]);
  const appReady = server.serverRunning;

  function handleSubmit(event) {
    event.preventDefault();
    const rawCommand = command.trim();
    if (!rawCommand) return;
    const result = executeNodeCommand({ command: rawCommand, state: server, checks });
    setCommand("");
    if (result.clearHistory) {
      setHistory([]);
      return;
    }
    setServer(result.state);
    setChecks(result.checks);
    setHistory((previous) => [
      ...previous,
      { type: "command", text: rawCommand },
      { type: result.error ? "error" : "output", text: result.output }
    ]);

    const missionComplete = nodeTasks.every(({ key }) => result.checks[key]);
    if (missionComplete && !completedRef.current) {
      completedRef.current = true;
      setCompleted(true);
      onComplete?.();
      setHistory((previous) => [...previous, {
        type: "success",
        text: "✓ Node.js setup complete! Your Express application is running and its health endpoint returns HTTP 200."
      }]);
    }
  }

  function handleSaveFile() {
    const result = saveNodeServerCode({ code: editorCode, state: server, checks });
    setServer(result.state);
    setChecks(result.checks);
    setHistory((previous) => [
      ...previous,
      { type: result.error ? "error" : "output", text: result.output }
    ]);
  }

  function resetPractice() {
    setServer({ ...initialNodeState });
    setChecks({ ...initialNodeChecks });
    setCommand("");
    setHistory(initialNodeHistory);
    setShowAnswer(false);
    setEditorCode(nodeServerTemplate);
    setCompleted(false);
    completedRef.current = false;
  }

  return (
    <section className="linux-practice node-practice">
      <style>{`
        .node-practice .linux-practice-head{background:linear-gradient(120deg,#142b2b,#142033)}
        .node-practice .linux-task.locked{opacity:.45}
        .node-practice .node-editor{margin:0 20px 18px;border:1px solid #2b3b4d;border-radius:11px;padding:14px;background:#111b29}
        .node-practice .node-editor label{display:block;font-size:12px;margin-bottom:9px;color:#c8d6e4}
        .node-practice .node-editor textarea{box-sizing:border-box;width:100%;min-height:220px;resize:vertical;background:#080e17;color:#d9e8f7;border:1px solid #34465a;border-radius:7px;padding:11px;font:12px/1.6 ui-monospace,SFMono-Regular,Consolas,monospace}
        .node-practice .node-save{margin-top:9px;border:0;border-radius:7px;padding:10px 13px;background:#72d7a2;color:#092016;font-weight:700;cursor:pointer}
        .node-practice .node-answer{margin:0 20px 18px;border:1px solid #435b4d;background:#12241e;border-radius:10px;padding:14px;color:#c9e4d4}
        .node-practice .node-answer strong{font-size:13px}.node-practice .node-answer p{font-size:12px;line-height:1.55;margin:7px 0 12px}
        .node-practice .node-answer code{display:block;background:#09140f;padding:10px;border-radius:7px;color:#a7efc5;font-size:12px;white-space:pre-wrap;overflow-wrap:anywhere}
        .node-practice .node-app-state{display:flex;align-items:center;gap:8px;padding:10px;border:1px solid #314457;border-radius:9px;background:#0d1723;font-size:12px}
        .node-practice .node-app-state i{width:8px;height:8px;border-radius:50%;background:#71d7a0}
        .node-practice .node-server-meta{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}
        .node-practice .node-server-meta div{padding:9px;border-radius:8px;background:#172536;color:#91a5ba;font-size:10px}
        .node-practice .node-server-meta strong{display:block;color:#e4edf6;font-size:11px;margin-top:4px}
        .node-practice .node-server-progress{height:5px;background:#253548;border-radius:9px;overflow:hidden;margin-top:12px}
        .node-practice .node-server-progress i{display:block;height:100%;background:#72d7a2}
        @media(max-width:700px){.node-practice .node-editor,.node-practice .node-answer{margin-left:14px;margin-right:14px}}
      `}</style>

      <div className="linux-practice-head">
        <div>
          <span className="linux-practice-kicker">HANDS-ON NODE.JS WORKSHOP · LEVEL 1</span>
          <h2>Prepare and run a Node.js application</h2>
          <p>Build a small Express service from an empty project. Initialize npm, install production dependencies, write the server, configure environment variables, start the process, and verify its health endpoint. Commands run in this safe simulation only.</p>
        </div>
        <span className="linux-practice-tag">NODE.JS FOUNDATION</span>
      </div>

      <div className="linux-practice-grid">
        <div className="linux-terminal">
          <div className="linux-terminal-bar">
            <span className="linux-dots"><i/><i/><i/></span>
            <Terminal size={14}/>{server.cwd.endsWith("node-app") ? " deploy@server: ~/node-app" : " deploy@server: ~"}
          </div>
          <div className="linux-terminal-screen" aria-live="polite">
            {history.map((item, index) => (
              <div className={`linux-line ${item.type}`} key={index}>
                {item.type === "command" ? <><span className="linux-prompt">deploy@server:{server.cwd.endsWith("node-app") ? "~/node-app" : "~"}$ </span>{item.text}</> : item.text}
              </div>
            ))}
            <form className="linux-form" onSubmit={handleSubmit}>
              <span className="linux-prompt">$</span>
              <input value={command} onChange={(event) => setCommand(event.target.value)} placeholder="Enter a Node.js / shell command..." aria-label="Node.js command" autoComplete="off"/>
              <button type="submit">Run <ChevronRight size={14}/></button>
            </form>
          </div>
        </div>

        <aside className="linux-task-panel">
          <h3>NODE.JS SETUP CHECKLIST · {taskDone}/{nodeTasks.length}</h3>
          <div className="linux-task-list">
            {nodeTasks.map((task, index) => {
              const unlocked = index === 0 || nodeTasks.slice(0, index).every((previous) => checks[previous.key]);
              const done = checks[task.key];
              return (
                <div className={`linux-task ${done ? "done" : ""} ${unlocked ? "" : "locked"}`} key={task.key}>
                  <span className="linux-task-icon">{done ? <CheckCircle2 size={13}/> : null}</span>
                  <span>{task.label}{!unlocked && !done ? <small className="linux-task-lock">Complete the previous task first</small> : <small className="node-task-description">{task.description}</small>}</span>
                </div>
              );
            })}
          </div>
          <div className="linux-folder-preview">
            <strong>APPLICATION STATUS</strong>
            <div className="node-app-state"><i style={{background:appReady?"#71d7a0":"#64748b"}}/><Server size={14}/><span>{appReady ? "Node.js process running" : "Application not running"}</span></div>
            <div className="node-server-meta">
              <div>NODE.JS<strong>{server.nodeInstalled ? "Available" : "Not checked"}</strong></div>
              <div>DEPENDENCIES<strong>{server.dependenciesInstalled ? "Installed" : "Not installed"}</strong></div>
              <div>ENVIRONMENT<strong>{server.environmentCreated ? "Configured" : "Not configured"}</strong></div>
              <div>HEALTH CHECK<strong>{server.healthVerified ? "HTTP 200 OK" : "Not verified"}</strong></div>
            </div>
            <div className="node-server-progress"><i style={{width:`${taskDone / nodeTasks.length * 100}%`}}/></div>
          </div>
        </aside>
      </div>

      {server.sourceEditorOpened && (
        <div className="node-editor">
          <label>src/server.js · edit your Express application</label>
          <textarea value={editorCode} onChange={(event) => setEditorCode(event.target.value)} spellCheck={false}/>
          <button className="node-save" type="button" onClick={handleSaveFile}>Save server file</button>
        </div>
      )}

      {showAnswer && (
        <div className="node-answer">
          <strong>Show Answer · next command</strong>
          <p>{nextCommand ? "Run this command next. Complete each task in order; later tasks unlock after the previous task succeeds." : "You have completed every task in this mission."}</p>
          <code>{nextCommand || "Mission complete"}</code>
        </div>
      )}

      <div className="linux-practice-footer">
        <span>{completed ? "✓ Node.js foundation complete · Next: deploy this application over SSH on a real Linux server." : "Production habit: keep secrets out of source control. Use environment variables, a lockfile, and a health check. This lab does not execute real commands."}</span>
        <div className="linux-footer-actions">
          <button className="linux-answer-btn" type="button" onClick={() => setShowAnswer((visible) => !visible)}><Lightbulb size={14}/> {showAnswer ? "Hide answer" : "Show answer"}</button>
          {showAnswer && nextCommand && <button className="linux-answer-btn" type="button" onClick={() => setCommand(nextCommand)}>Use command</button>}
          <button className="linux-reset" type="button" onClick={resetPractice}><RotateCcw size={13}/> Reset</button>
        </div>
      </div>
    </section>
  );
}
