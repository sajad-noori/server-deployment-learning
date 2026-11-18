import test from "node:test";
import assert from "node:assert/strict";
import {
  executeNodeCommand,
  getNextNodeCommand,
  initialNodeChecks,
  initialNodeState,
  nodeServerTemplate,
  saveNodeServerCode
} from "./level1NodeSetup.js";

function run(command, state = initialNodeState, checks = initialNodeChecks) {
  return executeNodeCommand({ command, state, checks });
}

test("supports the combined Node.js and npm version command", () => {
  const result = run("node --version && npm --version");
  assert.equal(result.error, false);
  assert.equal(result.checks.runtime, true);
  assert.match(result.output, /v22\.14\.0/);
  assert.match(result.output, /10\.9\.2/);
});

test("supports creating and entering the project in one command", () => {
  const runtime = run("node --version");
  const result = run("mkdir node-app && cd node-app", runtime.state, runtime.checks);
  assert.equal(result.error, false);
  assert.equal(result.checks.project, true);
  assert.equal(result.state.cwd, "/home/deploy/node-app");
});

test("stops a command chain when a command fails", () => {
  const result = run("mkdir node-app && npm init -y");
  assert.equal(result.error, true);
  assert.equal(result.state.projectCreated, false);
  assert.equal(result.state.packageInitialized, false);
});

test("does not present an editor action as a terminal command", () => {
  const state = {
    ...initialNodeState,
    cwd: "/home/deploy/node-app",
    nodeInstalled: true,
    projectCreated: true,
    packageInitialized: true,
    dependenciesInstalled: true,
    sourceDirectoryCreated: true,
    sourceEditorOpened: true
  };
  const checks = {
    ...initialNodeChecks,
    runtime: true,
    project: true,
    package: true,
    dependencies: true
  };
  assert.equal(getNextNodeCommand(checks, state), null);
});

test("rejects an incomplete Express server file without advancing progress", () => {
  const state = { ...initialNodeState, sourceEditorOpened: true };
  const result = saveNodeServerCode({ code: "console.log('hello')", state, checks: initialNodeChecks });
  assert.equal(result.error, true);
  assert.equal(result.checks.source, false);
  assert.equal(result.state.sourceSaved, false);
});

test("completes the Node.js setup and health check through chained commands", () => {
  let state = initialNodeState;
  let checks = initialNodeChecks;

  const execute = (command) => {
    const result = run(command, state, checks);
    assert.equal(result.error, false, result.output);
    state = result.state;
    checks = result.checks;
    return result;
  };

  execute("node --version && npm --version");
  execute("mkdir node-app && cd node-app");
  execute("npm init -y");
  execute("npm install express dotenv");
  execute("mkdir src");
  execute("nano src/server.js");

  const saved = saveNodeServerCode({ code: nodeServerTemplate, state, checks });
  assert.equal(saved.error, false);
  state = saved.state;
  checks = saved.checks;

  execute('npm pkg set scripts.start="node src/server.js"');
  execute("create .env");
  const health = execute("npm start && curl -i http://127.0.0.1:3000/health");

  assert.equal(checks.health, true);
  assert.equal(state.serverRunning, true);
  assert.equal(state.healthVerified, true);
  assert.match(health.output, /HTTP\/1\.1 200 OK/);
});
