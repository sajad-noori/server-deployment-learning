import { useState } from "react";
import { CheckCircle2, Circle, RotateCcw, Terminal, Play, Server, FileCode2 } from "lucide-react";

const steps = [
  ["Check the runtime", "Confirm Node.js and npm are installed.", "node --version  and  npm --version"],
  ["Create the project", "Create a folder for the application and enter it.", "mkdir node-app  then  cd node-app"],
  ["Initialize Node.js", "Generate package.json for this application.", "npm init -y"],
  ["Install dependencies", "Install Express and dotenv for the web server and configuration.", "npm install express dotenv"],
  ["Create the server", "Create src/server.js and add a working Express health endpoint.", "mkdir src  then  nano src/server.js"],
  ["Add the start script", "Configure npm start to launch your server.", "npm pkg set scripts.start=\"node src/server.js\""],
  ["Configure production", "Set production mode and the listening port in .env.", "Create .env with NODE_ENV=production and PORT=3000"],
  ["Start and verify", "Start the app and request its health endpoint.", "npm start  then  curl -i http://127.0.0.1:3000/health"],
];
const serverCode = `const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (_req, res) => res.send("Node.js app is running"));
app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port ${port}`);
});
`;
const initial = [
  { type: "system", text: "DeployLab · Node.js deployment practice shell" },
  { type: "system", text: "Safe simulator: commands change this lab only; they do not run on your computer or a real server." },
  { type: "system", text: "Type help to list supported commands." },
];

export function NodeDeploymentLab({ onComplete }) {
  const [history, setHistory] = useState(initial);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState("/home/deploy");
  const [node, setNode] = useState(false);
  const [folder, setFolder] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [src, setSrc] = useState(false);
  const [editor, setEditor] = useState(false);
  const [codeSaved, setCodeSaved] = useState(false);
  const [script, setScript] = useState(false);
  const [env, setEnv] = useState(false);
  const [running, setRunning] = useState(false);
  const [verified, setVerified] = useState(false);
  const [code, setCode] = useState(serverCode);
  const [done, setDone] = useState([]);

  const checks = [node, folder && cwd.endsWith("node-app"), initialized, installed, codeSaved, script, env, verified];
  const completed = checks.filter(Boolean).length;
  const current = checks.findIndex((x) => !x);
  const percent = Math.round((completed / steps.length) * 100);
  const log = (type, text) => setHistory((h) => [...h, { type, text }]);
  const mark = (i) => setDone((d) => d.includes(i) ? d : [...d, i]);

  function run(raw) {
    const cmd = raw.trim(); if (!cmd) return;
    log("command", `${cwd}$ ${cmd}`);
    const fail = (s) => log("error", s);
    const out = (s) => log("output", s);
    if (cmd === "help") out("node --version | npm --version | mkdir node-app | cd node-app | npm init -y | npm install express dotenv | mkdir src | nano src/server.js | npm pkg set scripts.start=\"node src/server.js\" | create .env | npm start | curl -i http://127.0.0.1:3000/health | pwd | ls | clear");
    else if (cmd === "clear") setHistory([]);
    else if (cmd === "pwd") out(cwd);
    else if (cmd === "ls") out(cwd.endsWith("node-app") ? `${initialized ? "package.json  " : ""}${installed ? "node_modules/  package-lock.json  " : ""}${src ? "src/  " : ""}${env ? ".env  " : ""}` || "(empty directory)" : folder ? "node-app/" : "(empty home directory)");
    else if (cmd === "node --version" || cmd === "node -v") { setNode(true); mark(0); out("v22.14.0"); }
    else if (cmd === "npm --version" || cmd === "npm -v") { setNode(true); mark(0); out("10.9.2"); }
    else if (cmd === "mkdir node-app") { if (!node) fail("Check Node.js and npm first."); else { setFolder(true); out("Directory created: node-app"); } }
    else if (cmd === "cd node-app") { if (!folder) fail("Directory not found. Run mkdir node-app first."); else { setCwd("/home/deploy/node-app"); mark(1); out("Entered /home/deploy/node-app"); } }
    else if (cmd === "cd ..") { setCwd("/home/deploy"); out(cwd); }
    else if (cmd === "npm init -y") { if (!cwd.endsWith("node-app")) fail("Run this inside node-app."); else { setInitialized(true); mark(2); out("Wrote package.json\n{ \"name\": \"node-app\", \"version\": \"1.0.0\", \"type\": \"commonjs\" }"); } }
    else if (cmd === "npm install express dotenv") { if (!initialized) fail("Initialize the project with npm init -y first."); else { setInstalled(true); mark(3); out("added 68 packages\ncreated package-lock.json\n0 vulnerabilities found"); } }
    else if (cmd === "mkdir src") { if (!installed) fail("Install dependencies before creating the application source."); else { setSrc(true); out("Directory created: src"); } }
    else if (cmd === "nano src/server.js") { if (!src) fail("Create src/ first with mkdir src."); else setEditor(true); }
    else if (cmd === 'npm pkg set scripts.start="node src/server.js"') { if (!initialized) fail("Run npm init -y first."); else { setScript(true); out("Updated package.json: scripts.start = node src/server.js"); } }
    else if (cmd === "create .env") { if (!installed) fail("Install dotenv first."); else { setEnv(true); out("Created .env with NODE_ENV=production and PORT=3000"); } }
    else if (cmd === "npm start") { if (!installed || !codeSaved || !script || !env) fail("Before starting: install dependencies, save src/server.js, add the start script, and create .env."); else { setRunning(true); out("> node-app@1.0.0 start\n> node src/server.js\nServer listening on port 3000"); } }
    else if (cmd === "curl -i http://127.0.0.1:3000/health") { if (!running) fail("Connection refused. Start the application with npm start first."); else { setVerified(true); mark(7); out("HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\"status\":\"ok\"}"); if (completed < steps.length) onComplete?.(); } }
    else fail(`bash: ${cmd}: command not found. Type help for supported commands.`);
    setInput("");
  }

  function saveCode() {
    if (!code.includes("express") || !code.includes("/health") || !code.includes("app.listen")) return;
    setCodeSaved(true); setEditor(false); mark(4); log("output", "Saved src/server.js. Express app and /health endpoint detected.");
  }
  function reset() {
    setHistory(initial); setInput(""); setCwd("/home/deploy"); setNode(false); setFolder(false); setInitialized(false); setInstalled(false); setSrc(false); setEditor(false); setCodeSaved(false); setScript(false); setEnv(false); setRunning(false); setVerified(false); setCode(serverCode); setDone([]);
  }

  return <section className="ndl">
    <style>{`.ndl{border:1px solid var(--border-subtle,#334155);border-radius:16px;overflow:hidden;margin:18px 0;background:var(--surface-primary,#111827);color:var(--text-primary,#e5e7eb)}.ndl-head{padding:20px;background:linear-gradient(120deg,rgba(36,130,91,.16),rgba(49,91,145,.15));border-bottom:1px solid var(--border-subtle,#334155)}.ndl-head small{font-size:10px;letter-spacing:.13em;color:#69d49b;font-weight:800}.ndl-head h2{font-size:21px;margin:8px 0}.ndl-head p{font-size:13px;line-height:1.6;color:var(--text-secondary,#aab6c8);margin:0}.ndl-bar{height:6px;background:#263449;border-radius:10px;margin-top:15px;overflow:hidden}.ndl-bar i{display:block;height:100%;background:#62c993}.ndl-meta{display:flex;justify-content:space-between;margin-top:7px;font-size:11px;color:var(--text-secondary,#aab6c8)}.ndl-grid{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(230px,.8fr);gap:15px;padding:16px}.ndl-tasks{display:grid;gap:8px}.ndl-task{border:1px solid var(--border-subtle,#334155);border-radius:10px;padding:11px 12px;opacity:.5}.ndl-task.active{opacity:1;border-color:#59bd8b}.ndl-task.done{opacity:1}.ndl-task strong{font-size:13px}.ndl-task p{font-size:11px;color:var(--text-secondary,#aab6c8);margin:5px 0}.ndl-task small{font-size:10px;color:var(--text-secondary,#aab6c8)}.ndl-console{border:1px solid #34445a;border-radius:12px;background:#0b1220;overflow:hidden}.ndl-console-head{padding:9px 12px;background:#172235;display:flex;justify-content:space-between;font-size:11px;color:#cbd5e1}.ndl-output{height:260px;overflow:auto;padding:12px;font:12px/1.6 ui-monospace,monospace;white-space:pre-wrap;overflow-wrap:anywhere}.ndl-line.command{color:#8ce0b1}.ndl-line.error{color:#ff9999}.ndl-line.system{color:#8da3bd}.ndl-line.output{color:#e2e8f0}.ndl-form{display:flex;gap:7px;padding:9px;border-top:1px solid #29384c}.ndl-form input{min-width:0;flex:1;background:#111c2c;border:1px solid #40516a;border-radius:7px;color:white;padding:10px;font:12px ui-monospace,monospace}.ndl button{cursor:pointer}.ndl-form button,.ndl-save{border:0;border-radius:7px;background:#26734f;color:white;padding:0 13px;font-weight:700}.ndl-hint{padding:0 12px 10px;color:#91a5bd;font-size:10px}.ndl-editor{padding:12px;background:#132238;border-top:1px solid #34445a}.ndl-editor label{display:block;font-size:12px;margin-bottom:7px}.ndl-editor textarea{box-sizing:border-box;width:100%;min-height:210px;resize:vertical;background:#08111e;color:#d9e8f7;border:1px solid #40536d;border-radius:7px;padding:10px;font:12px/1.5 ui-monospace,monospace}.ndl-save{padding:9px 13px;margin-top:9px}.ndl-side{border:1px solid var(--border-subtle,#334155);border-radius:11px;padding:13px;height:max-content}.ndl-side h3{font-size:13px;margin:0 0 12px}.ndl-check{display:flex;gap:8px;align-items:center;font-size:11px;color:var(--text-secondary,#aab6c8);margin:10px 0}.ndl-check.ok{color:#72d5a1}.ndl-foot{display:flex;justify-content:space-between;gap:10px;padding:12px 16px;border-top:1px solid var(--border-subtle,#334155);font-size:10px;color:var(--text-secondary,#aab6c8)}.ndl-foot button{display:flex;align-items:center;gap:5px;background:transparent;border:1px solid var(--border-subtle,#40516a);border-radius:7px;color:inherit;padding:7px 9px}@media(max-width:720px){.ndl-grid{grid-template-columns:1fr}.ndl-output{height:220px}.ndl-foot{flex-direction:column}}`}</style>
    <header className="ndl-head"><small>NODE.JS · HANDS-ON LAB</small><h2>Build and run a production-style Node.js app</h2><p>Create a small Express service from an empty folder. You will use real-world commands, write the server file, configure environment variables, start the app, and verify its health endpoint. This terminal is simulated; it does not connect to a real server.</p><div className="ndl-bar"><i style={{width:`${percent}%`}}/></div><div className="ndl-meta"><span>{completed} / {steps.length} tasks completed</span><strong>{percent}%</strong></div></header>
    <div className="ndl-grid"><div className="ndl-tasks">{steps.map(([title,desc,hint],i)=><article className={`ndl-task ${checks[i]?'done':i===current?'active':''}`} key={title}><div style={{display:'flex',gap:8,alignItems:'center'}}>{checks[i]?<CheckCircle2 size={16} color="#65cf98"/>:<Circle size={16}/>}<strong>{i+1}. {title}</strong></div><p>{desc}</p><small>{checks[i]?'Completed':i===current?hint:'Complete the previous task first.'}</small></article>)}</div>
      <aside className="ndl-side"><h3><Server size={14} style={{verticalAlign:'middle',marginRight:5}}/> Server checklist</h3>{[["Node.js runtime",node],["Project initialized",initialized],["Dependencies installed",installed],["Server source saved",codeSaved],["Start script configured",script],["Production .env",env],["HTTP health check",verified]].map(([name,ok])=><div className={`ndl-check ${ok?'ok':''}`} key={name}>{ok?<CheckCircle2 size={13}/>:<Circle size={13}/>} {name}</div>)}<hr style={{border:0,borderTop:'1px solid var(--border-subtle,#334155)',margin:'13px 0'}}/><div style={{fontSize:12,display:'flex',alignItems:'center',gap:7}}><span style={{width:7,height:7,borderRadius:9,background:running?'#65cf98':'#64748b'}}/>{running?'Application running · :3000':'Application stopped'}</div></aside>
      <div className="ndl-console"><div className="ndl-console-head"><span><Terminal size={13} style={{verticalAlign:'middle',marginRight:5}}/> deploy@server</span><span>{cwd}</span></div><div className="ndl-output">{history.map((line,i)=><div key={i} className={`ndl-line ${line.type}`}>{line.text}</div>)}</div><form className="ndl-form" onSubmit={e=>{e.preventDefault();run(input)}}><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Enter a command..." aria-label="Terminal command"/><button type="submit"><Play size={13}/> Run</button></form><div className="ndl-hint">Commands are validated in sequence. Start with <code>node --version</code>. Use <code>help</code> if you get stuck.</div>{editor&&<div className="ndl-editor"><label><FileCode2 size={13} style={{verticalAlign:'middle',marginRight:5}}/>src/server.js — edit the Express application</label><textarea value={code} onChange={e=>setCode(e.target.value)} spellCheck="false"/><button className="ndl-save" type="button" onClick={saveCode}>Save server file</button></div>}</div>
    </div><footer className="ndl-foot"><span>Training sandbox · no commands execute on your device</span><button type="button" onClick={reset}><RotateCcw size={12}/> Reset practice</button></footer>
  </section>;
}

export default NodeDeploymentLab;
