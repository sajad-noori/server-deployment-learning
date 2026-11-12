const PROJECT_PATH = "/home/deploy/my-app";

export const initialFileManagementSystem = {
  [PROJECT_PATH]: ["README.md", "package.json", "server.js", "src/"]
};

export const initialFileManagementChecks = {
  draftCreated: false,
  draftCopied: false,
  copyRenamed: false,
  draftRemoved: false,
  finalVerified: false
};

export const fileManagementPaths = { project: PROJECT_PATH };

function cloneFileSystem(fileSystem) {
  return Object.fromEntries(
    Object.entries(fileSystem).map(([path, entries]) => [path, [...entries]])
  );
}

function normalize(command) {
  return command.trim().replace(/\\s+/g, " ");
}

/**
 * Runs a small, safe subset of Linux file commands against an in-memory
 * directory listing. No real shell commands or local files are accessed.
 */
export function executeFileManagementCommand({
  command,
  currentDirectory,
  fileSystem,
  checks
}) {
  const raw = normalize(command);
  const key = raw.toLowerCase();
  const nextFileSystem = cloneFileSystem(fileSystem);
  const nextChecks = { ...checks };
  let output = "";

  const result = (nextDirectory = currentDirectory, clearHistory = false) => ({
    output,
    currentDirectory: nextDirectory,
    fileSystem: nextFileSystem,
    checks: nextChecks,
    clearHistory
  });

  if (!raw) return result();

  const requirePrevious = (condition, message) => {
    if (condition) return false;
    output = message;
    return true;
  };

  switch (key) {
    case "help":
      output = "Supported commands: pwd, ls, touch draft.txt, cp draft.txt draft-copy.txt, mv draft-copy.txt final-draft.txt, rm draft.txt, clear";
      break;
    case "clear":
      return { output: "", currentDirectory, fileSystem, checks, clearHistory: true };
    case "pwd":
      output = currentDirectory;
      break;
    case "ls":
      if (requirePrevious(nextChecks.draftRemoved,
        "Finish the previous task first: remove draft.txt with rm draft.txt.")) break;
      output = nextFileSystem[PROJECT_PATH].join("   ");
      if (nextFileSystem[PROJECT_PATH].includes("final-draft.txt") &&
          !nextFileSystem[PROJECT_PATH].includes("draft.txt")) {
        nextChecks.finalVerified = true;
      }
      break;
    case "touch draft.txt":
      if (currentDirectory !== PROJECT_PATH) {
        output = "touch: this mission's files are in /home/deploy/my-app.";
      } else if (nextChecks.draftCreated) {
        output = "touch: draft.txt already exists.";
      } else {
        nextFileSystem[PROJECT_PATH].push("draft.txt");
        nextChecks.draftCreated = true;
        output = "Created empty file: draft.txt";
      }
      break;
    case "cp draft.txt draft-copy.txt":
      if (requirePrevious(nextChecks.draftCreated,
        "Complete the previous task first: create draft.txt with touch draft.txt.")) break;
      if (nextFileSystem[PROJECT_PATH].includes("draft-copy.txt")) {
        output = "cp: destination 'draft-copy.txt' already exists.";
      } else {
        nextFileSystem[PROJECT_PATH].push("draft-copy.txt");
        nextChecks.draftCopied = true;
        output = "Copied 'draft.txt' to 'draft-copy.txt'.";
      }
      break;
    case "mv draft-copy.txt final-draft.txt":
      if (requirePrevious(nextChecks.draftCopied,
        "Complete the previous task first: copy draft.txt with cp draft.txt draft-copy.txt.")) break;
      if (!nextFileSystem[PROJECT_PATH].includes("draft-copy.txt")) {
        output = "mv: cannot stat 'draft-copy.txt': No such file or directory.";
      } else {
        nextFileSystem[PROJECT_PATH] = nextFileSystem[PROJECT_PATH]
          .filter((name) => name !== "draft-copy.txt");
        nextFileSystem[PROJECT_PATH].push("final-draft.txt");
        nextChecks.copyRenamed = true;
        output = "Renamed 'draft-copy.txt' to 'final-draft.txt'.";
      }
      break;
    case "rm draft.txt":
      if (requirePrevious(nextChecks.copyRenamed,
        "Complete the previous task first: rename the copy with mv draft-copy.txt final-draft.txt.")) break;
      if (!nextFileSystem[PROJECT_PATH].includes("draft.txt")) {
        output = "rm: cannot remove 'draft.txt': No such file or directory.";
      } else {
        nextFileSystem[PROJECT_PATH] = nextFileSystem[PROJECT_PATH]
          .filter((name) => name !== "draft.txt");
        nextChecks.draftRemoved = true;
        output = "Removed 'draft.txt'.";
      }
      break;
    default:
      output = `bash: ${raw}: command not found. Type help to see supported commands.`;
  }

  return result();
}
