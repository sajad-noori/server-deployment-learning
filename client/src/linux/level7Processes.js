const PROJECT_DIRECTORY = "/home/deploy/my-app";

export const initialApplicationProcess = {
  pid: 2481,
  command: "node server.js",
  owner: "deploy",
  state: "running",
  cpu: "2.4%",
  memory: "48.2 MB"
};

export const initialProcessChecks = {
  processListViewed: false,
  processFound: false,
  processDetailsVerified: false,
  stopRequested: false,
  processVerifiedStopped: false
};

export const processTasks = [
  { label: "Inspect the running processes", key: "processListViewed" },
  { label: "Find the application process", key: "processFound" },
  { label: "Verify its PID and owner", key: "processDetailsVerified" },
  { label: "Request a graceful stop", key: "stopRequested" },
  { label: "Verify the process has stopped", key: "processVerifiedStopped" }
];

export function getNextProcessCommand(checks) {
  if (!checks.processListViewed) return "ps aux";
  if (!checks.processFound) return "pgrep -af server.js";
  if (!checks.processDetailsVerified) return "ps -o pid,user,stat,cmd -p 2481";
  if (!checks.stopRequested) return "kill 2481";
  if (!checks.processVerifiedStopped) return "pgrep -af server.js";
  return null;
}

function normalize(command) {
  return command.trim().replace(/\s+/g, " ");
}

/**
 * Safe in-memory process simulator for Linux lesson 7.
 * It never inspects or terminates processes on the learner's computer.
 */
export function executeProcessCommand({ command, process, checks }) {
  const raw = normalize(command);
  const key = raw.toLowerCase();
  const nextProcess = { ...process };
  const nextChecks = { ...checks };
  let output = "";
  let error = false;

  const result = () => ({ output, process: nextProcess, checks: nextChecks, error });

  if (!raw) return result();

  switch (key) {
    case "help":
      output = "Supported commands: ps aux, pgrep -af server.js, ps -o pid,user,stat,cmd -p 2481, kill 2481, pwd, clear";
      break;
    case "clear":
      return { output: "", process, checks, clearHistory: true };
    case "pwd":
      output = PROJECT_DIRECTORY;
      break;
    case "ps aux":
      if (nextChecks.processListViewed) {
        output = nextProcess.state === "running"
          ? "USER       PID %CPU %MEM COMMAND\nroot         1  0.0  0.1 /sbin/init\ndeploy    2481  2.4  1.2 node server.js\ndeploy    2510  0.0  0.1 bash"
          : "USER       PID %CPU %MEM COMMAND\nroot         1  0.0  0.1 /sbin/init\ndeploy    2510  0.0  0.1 bash";
      } else {
        nextChecks.processListViewed = true;
        output = "USER       PID %CPU %MEM COMMAND\nroot         1  0.0  0.1 /sbin/init\ndeploy    2481  2.4  1.2 node server.js\ndeploy    2510  0.0  0.1 bash";
      }
      break;
    case "pgrep -af server.js":
      if (!nextChecks.processListViewed) {
        output = "Complete the previous task first: inspect the process list with ps aux.";
        error = true;
      } else if (!nextChecks.stopRequested && nextProcess.state === "running") {
        nextChecks.processFound = true;
        output = "2481 node server.js";
      } else if (nextChecks.stopRequested && nextProcess.state === "stopped") {
        nextChecks.processVerifiedStopped = true;
        output = "No matching processes found. The application process has stopped.";
      } else {
        output = "No matching processes found.";
      }
      break;
    case "ps -o pid,user,stat,cmd -p 2481":
      if (!nextChecks.processFound) {
        output = "Find the application process first with pgrep -af server.js.";
        error = true;
      } else if (nextProcess.state !== "running") {
        output = "ps: process 2481 no longer exists.";
        error = true;
      } else {
        nextChecks.processDetailsVerified = true;
        output = "  PID USER     STAT CMD\n 2481 deploy   S    node server.js";
      }
      break;
    case "kill 2481":
      if (!nextChecks.processDetailsVerified) {
        output = "Before stopping anything, find the application and verify its PID and owner.";
        error = true;
      } else if (nextProcess.state !== "running") {
        output = "kill: process 2481 is not running.";
        error = true;
      } else {
        nextProcess.state = "stopped";
        nextChecks.stopRequested = true;
        output = "SIGTERM sent to process 2481. The application shut down gracefully.";
      }
      break;
    default:
      output = `bash: ${raw}: command not found. Type help to see supported commands.`;
      error = true;
  }

  return result();
}
