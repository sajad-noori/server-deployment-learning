export const nodeTasks = [
  { key: "runtime", label: "Check Node.js and npm", hint: "node --version && npm --version", description: "Verify the runtime and package manager." },
  { key: "project", label: "Create the project folder", hint: "mkdir node-app && cd node-app", description: "Create and enter the application directory." },
  { key: "package", label: "Initialize package.json", hint: "npm init -y", description: "Create the Node.js project manifest." },
  { key: "dependencies", label: "Install dependencies", hint: "npm install express dotenv", description: "Install Express and dotenv." },
  { key: "source", label: "Create the server file", hint: "mkdir src && nano src/server.js", description: "Write the Express server and health endpoint." },
  { key: "startScript", label: "Configure the start script", hint: 'npm pkg set scripts.start="node src/server.js"', description: "Add a repeatable npm start command." },
  { key: "environment", label: "Configure production environment", hint: "create .env", description: "Set NODE_ENV and PORT outside source code." },
  { key: "health", label: "Start and verify the app", hint: "npm start, then curl -i http://127.0.0.1:3000/health", description: "Start the server and verify its health response." }
];

export const initialNodeState = {
  cwd: "/home/deploy",
  nodeInstalled: false,
  projectCreated: false,
  packageInitialized: false,
  dependenciesInstalled: false,
  sourceDirectoryCreated: false,
  sourceEditorOpened: false,
  sourceSaved: false,
  startScriptConfigured: false,
  environmentCreated: false,
  serverRunning: false,
  healthVerified: false
};

export const initialNodeChecks = {
  runtime: false,
  project: false,
  package: false,
  dependencies: false,
  source: false,
  startScript: false,
  environment: false,
  health: false
};

export const initialNodeHistory = [
  { type: "system", text: "DeployLab Node.js shell · simulated Ubuntu environment" },
  { type: "system", text: "Mission: prepare and run an Express application. Commands are simulated and do not execute on your computer or a real server." }
];

export const nodeServerTemplate = `const express = require("express");
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

export function getNextNodeCommand(checks) {
  const next = nodeTasks.find((task) => !checks[task.key]);
  return next?.hint || null;
}

export function saveNodeServerCode({ code, state, checks }) {
  if (!state.sourceEditorOpened) {
    return { state, checks, error: true, output: "Open src/server.js with nano before saving." };
  }
  if (!code.includes("express") || !code.includes("/health") || !code.includes("app.listen")) {
    return { state, checks, error: true, output: "The server file must import Express, define /health, and start listening with app.listen()." };
  }
  return {
    state: { ...state, sourceSaved: true, sourceEditorOpened: false },
    checks: { ...checks, source: true },
    error: false,
    output: "Saved src/server.js. Express app, health endpoint, and listener detected."
  };
}

export function executeNodeCommand({ command, state, checks }) {
  const fail = (output) => ({ state, checks, error: true, output });
  const pass = (output, nextState = state, nextChecks = checks) => ({ state: nextState, checks: nextChecks, error: false, output });
  const inProject = state.cwd.endsWith("/node-app");

  if (command === "help") {
    return pass("Supported commands:\nnode --version && npm --version\nmkdir node-app\ncd node-app\nnpm init -y\nnpm install express dotenv\nmkdir src\nnano src/server.js\nnpm pkg set scripts.start=\"node src/server.js\"\ncreate .env\nnpm start\ncurl -i http://127.0.0.1:3000/health\npwd\nls\nclear");
  }
  if (command === "pwd") return pass(state.cwd);
  if (command === "ls") {
    if (!inProject) return pass(state.projectCreated ? "node-app/" : "(empty directory)");
    const files = [
      state.packageInitialized && "package.json",
      state.dependenciesInstalled && "node_modules/  package-lock.json",
      state.sourceDirectoryCreated && "src/",
      state.environmentCreated && ".env"
    ].filter(Boolean);
    return pass(files.join("  ") || "(empty directory)");
  }
  if (command === "node --version" || command === "node -v") {
    return pass("v22.14.0", { ...state, nodeInstalled: true }, { ...checks, runtime: true });
  }
  if (command === "npm --version" || command === "npm -v") {
    return pass("10.9.2", { ...state, nodeInstalled: true }, { ...checks, runtime: true });
  }
  if (command === "mkdir node-app") {
    if (!state.nodeInstalled) return fail("Check Node.js and npm first.");
    if (state.projectCreated) return fail("node-app already exists.");
    return pass("Directory created: node-app", { ...state, projectCreated: true });
  }
  if (command === "cd node-app") {
    if (!state.projectCreated) return fail("Directory not found. Run mkdir node-app first.");
    return pass("Entered /home/deploy/node-app", { ...state, cwd: "/home/deploy/node-app" }, { ...checks, project: true });
  }
  if (command === "cd ..") return pass("/home/deploy", { ...state, cwd: "/home/deploy" });
  if (command === "npm init -y") {
    if (!inProject) return fail("Run npm init -y inside node-app.");
    if (state.packageInitialized) return fail("package.json already exists.");
    return pass("Wrote package.json\n{ \"name\": \"node-app\", \"version\": \"1.0.0\", \"type\": \"commonjs\" }", { ...state, packageInitialized: true }, { ...checks, package: true });
  }
  if (command === "npm install express dotenv") {
    if (!inProject || !state.packageInitialized) return fail("Run npm init -y inside node-app first.");
    return pass("added 68 packages\ncreated package-lock.json\n0 vulnerabilities found", { ...state, dependenciesInstalled: true }, { ...checks, dependencies: true });
  }
  if (command === "mkdir src") {
    if (!inProject || !state.dependenciesInstalled) return fail("Enter node-app and install dependencies before creating src/.");
    return pass("Directory created: src", { ...state, sourceDirectoryCreated: true });
  }
  if (command === "nano src/server.js") {
    if (!state.sourceDirectoryCreated) return fail("Create src/ first with mkdir src.");
    return pass("Editor opened: src/server.js", { ...state, sourceEditorOpened: true });
  }
  if (command === 'npm pkg set scripts.start="node src/server.js"') {
    if (!inProject || !state.packageInitialized) return fail("Initialize package.json inside node-app first.");
    return pass("Updated package.json: scripts.start = node src/server.js", { ...state, startScriptConfigured: true }, { ...checks, startScript: true });
  }
  if (command === "create .env") {
    if (!inProject || !state.dependenciesInstalled) return fail("Install dotenv inside node-app first.");
    return pass("Created .env with NODE_ENV=production and PORT=3000", { ...state, environmentCreated: true }, { ...checks, environment: true });
  }
  if (command === "npm start") {
    if (!inProject || !state.dependenciesInstalled || !state.sourceSaved || !state.startScriptConfigured || !state.environmentCreated) {
      return fail("Before starting, ensure you are inside node-app and have installed dependencies, saved src/server.js, configured the start script, and created .env.");
    }
    return pass("> node-app@1.0.0 start\n> node src/server.js\nServer listening on port 3000", { ...state, serverRunning: true });
  }
  if (command === "curl -i http://127.0.0.1:3000/health") {
    if (!state.serverRunning) return fail("Connection refused. Start the application with npm start first.");
    return pass("HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\"status\":\"ok\"}", { ...state, healthVerified: true }, { ...checks, health: true });
  }
  if (command === "clear") return { state, checks, error: false, output: "", clearHistory: true };
  return fail(`bash: ${command}: command not found. Type help for supported commands.`);
}
