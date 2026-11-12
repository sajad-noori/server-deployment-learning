const PROJECT_PATH = "/home/deploy/my-app";
const LOGS_PATH = `${PROJECT_PATH}/logs`;

export const initialFileSystem = {
  [PROJECT_PATH]: ["README.md", "package.json", "server.js", "src/"]
};

export const initialFileOperationChecks = {
  directoryCreated: false,
  directoryEntered: false,
  fileCreated: false,
  fileVerified: false
};

function normalizeCommand(command) {
  return command.trim().replace(/\s+/g, " ");
}

function listDirectory(path, fileSystem) {
  const entries = fileSystem[path] || [];
  return entries.length ? entries.join("   ") : "Directory is empty.";
}

/**
 * Executes one supported command against the lesson's in-memory file system.
 * It never runs a real shell command or touches the learner's computer.
 */
export function executeFileOperationCommand({
  command,
  currentDirectory,
  fileSystem,
  checks
}) {
  const rawCommand = normalizeCommand(command);
  const commandKey = rawCommand.toLowerCase();
  const nextFileSystem = {
    ...fileSystem,
    [PROJECT_PATH]: [...fileSystem[PROJECT_PATH]],
    ...(fileSystem[LOGS_PATH] ? { [LOGS_PATH]: [...fileSystem[LOGS_PATH]] } : {})
  };
  const nextChecks = { ...checks };
  let nextDirectory = currentDirectory;
  let output = "";

  if (!rawCommand) {
    return { output, currentDirectory, fileSystem, checks, clearHistory: false };
  }

  switch (commandKey) {
    case "help":
      output = "Supported commands: pwd, ls, mkdir logs, cd logs, cd .., touch deploy.log, clear";
      break;
    case "pwd":
      output = currentDirectory;
      break;
    case "ls":
      output = listDirectory(currentDirectory, nextFileSystem);
      if (currentDirectory === LOGS_PATH && nextFileSystem[LOGS_PATH]?.includes("deploy.log")) {
        nextChecks.fileVerified = true;
      }
      break;
    case "mkdir logs":
      if (currentDirectory !== PROJECT_PATH) {
        output = "mkdir: create logs from inside /home/deploy/my-app.";
      } else if (nextFileSystem[LOGS_PATH]) {
        output = "mkdir: cannot create directory 'logs': File exists";
      } else {
        nextFileSystem[PROJECT_PATH].push("logs/");
        nextFileSystem[LOGS_PATH] = [];
        nextChecks.directoryCreated = true;
        output = "Created directory: logs/";
      }
      break;
    case "cd logs":
      if (currentDirectory !== PROJECT_PATH) {
        output = "bash: logs: No such directory here. Return to my-app first.";
      } else if (!nextFileSystem[LOGS_PATH]) {
        output = "bash: cd: logs: No such file or directory. Create it with mkdir logs first.";
      } else {
        nextDirectory = LOGS_PATH;
        nextChecks.directoryEntered = true;
        output = "You are now inside /home/deploy/my-app/logs";
      }
      break;
    case "cd ..":
      if (currentDirectory === LOGS_PATH) {
        nextDirectory = PROJECT_PATH;
        output = "You moved to /home/deploy/my-app";
      } else {
        output = "You are already at the project folder for this mission.";
      }
      break;
    case "touch deploy.log":
      if (currentDirectory !== LOGS_PATH) {
        output = "touch: cannot touch 'deploy.log': Enter the logs directory first.";
      } else {
        if (!nextFileSystem[LOGS_PATH].includes("deploy.log")) {
          nextFileSystem[LOGS_PATH].push("deploy.log");
        }
        nextChecks.fileCreated = true;
        output = "Created empty file: deploy.log";
      }
      break;
    case "clear":
      return {
        output: "",
        currentDirectory,
        fileSystem,
        checks,
        clearHistory: true
      };
    default:
      output = `bash: ${rawCommand}: command not found. Type help to see supported commands.`;
  }

  return {
    output,
    currentDirectory: nextDirectory,
    fileSystem: nextFileSystem,
    checks: nextChecks,
    clearHistory: false
  };
}

export const fileOperationPaths = {
  project: PROJECT_PATH,
  logs: LOGS_PATH
};
