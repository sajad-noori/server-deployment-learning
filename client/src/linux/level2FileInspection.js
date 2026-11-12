export const FILE_INSPECTION_DIRECTORY = "/home/deploy/my-app";

export const initialFileInspectionChecks = {
  readmeInspected: false,
  packageInspected: false
};

export const fileInspectionTasks = [
  { label: "Read the project instructions (README.md)", key: "readmeInspected" },
  { label: "Inspect the project configuration (package.json)", key: "packageInspected" }
];

const PROJECT_FILES = {
  "readme.md": "# My App\n\nA simple Node.js application.\n\n## Getting started\nInstall dependencies with npm install, then start the app with npm start.",
  "package.json": '{\n  "name": "my-app",\n  "version": "1.0.0",\n  "scripts": {\n    "start": "node server.js"\n  },\n  "dependencies": {}\n}'
};

function normalize(command) {
  return command.trim().replace(/\s+/g, " ").toLowerCase();
}

/**
 * Pure command simulator for Level 2. File contents are fixed teaching
 * fixtures, not files read from the user's computer or a real server.
 */
export function executeFileInspectionCommand({ command, checks }) {
  const raw = command.trim();
  const normalized = normalize(raw);
  const nextChecks = { ...checks };
  let output = "";
  let clearHistory = false;

  if (!normalized) return { output, checks: nextChecks, clearHistory };

  switch (normalized) {
    case "help":
      output = "Supported commands: pwd, ls, cat README.md, cat package.json, clear";
      break;
    case "clear":
      clearHistory = true;
      break;
    case "pwd":
      output = FILE_INSPECTION_DIRECTORY;
      break;
    case "ls":
      output = "README.md   package.json   server.js   src/";
      break;
    case "cat readme.md":
      output = PROJECT_FILES["readme.md"];
      nextChecks.readmeInspected = true;
      break;
    case "cat package.json":
      if (!nextChecks.readmeInspected) {
        output = "Complete the previous task first: read README.md with cat README.md.";
      } else {
        output = PROJECT_FILES["package.json"];
        nextChecks.packageInspected = true;
      }
      break;
    default:
      output = `bash: ${raw}: command not found. Try cat README.md or cat package.json.`;
  }

  return { output, checks: nextChecks, clearHistory };
}

export function getNextFileInspectionCommand(checks) {
  if (!checks.readmeInspected) return "cat README.md";
  if (!checks.packageInspected) return "cat package.json";
  return null;
}

export function isFileInspectionMissionComplete(checks) {
  return fileInspectionTasks.every(({ key }) => checks[key]);
}
