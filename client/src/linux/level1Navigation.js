export const NAVIGATION_START_DIRECTORY = "/home/deploy";

export const initialNavigationChecks = {
  locationChecked: false,
  foldersListed: false,
  projectEntered: false,
  projectFilesListed: false
};

export const navigationTasks = [
  { label: "Check where you are", key: "locationChecked" },
  { label: "List the available folders", key: "foldersListed" },
  { label: "Enter the my-app folder", key: "projectEntered" },
  { label: "List the application files", key: "projectFilesListed" }
];

const PROJECT_DIRECTORY = "/home/deploy/my-app";

function normalize(command) {
  return command.trim().replace(/\s+/g, " ").toLowerCase();
}

export function getNextNavigationCommand(checks, currentDirectory) {
  if (!checks.locationChecked) return "pwd";
  if (!checks.foldersListed) {
    return currentDirectory === NAVIGATION_START_DIRECTORY ? "ls" : "cd ..";
  }
  if (!checks.projectEntered) {
    return currentDirectory === NAVIGATION_START_DIRECTORY ? "cd my-app" : "cd ..";
  }
  if (!checks.projectFilesListed) {
    return currentDirectory === PROJECT_DIRECTORY ? "ls" : "cd my-app";
  }
  return null;
}

/**
 * Pure command simulator for Level 1. It only changes the supplied
 * in-memory state and never invokes a real operating-system shell.
 */
export function executeNavigationCommand({ command, currentDirectory, checks }) {
  const raw = command.trim();
  const normalized = normalize(raw);
  const nextChecks = { ...checks };
  let nextDirectory = currentDirectory;
  let output = "";
  let clearHistory = false;

  if (!normalized) return { output, currentDirectory, checks: nextChecks, clearHistory };

  switch (normalized) {
    case "help":
      output = "Supported commands: pwd, ls, cd my-app, cd .., clear";
      break;
    case "clear":
      clearHistory = true;
      break;
    case "pwd":
      output = currentDirectory;
      nextChecks.locationChecked = true;
      break;
    case "ls":
    case "ls -la":
      if (!nextChecks.locationChecked) {
        output = "Complete the previous task first: check your current location with pwd.";
      } else if (currentDirectory === NAVIGATION_START_DIRECTORY && !nextChecks.foldersListed) {
        output = "my-app/   backups/";
        nextChecks.foldersListed = true;
      } else if (currentDirectory === NAVIGATION_START_DIRECTORY) {
        output = "my-app/   backups/";
      } else if (currentDirectory === PROJECT_DIRECTORY && nextChecks.projectEntered) {
        output = "README.md   package.json   server.js   src/";
        nextChecks.projectFilesListed = true;
      } else if (currentDirectory === PROJECT_DIRECTORY) {
        output = "Complete the previous task first: enter the my-app folder.";
      } else {
        output = "No files to display.";
      }
      break;
    case "cd my-app":
      if (!nextChecks.locationChecked || !nextChecks.foldersListed) {
        output = !nextChecks.locationChecked
          ? "Complete the previous task first: check your current location with pwd."
          : "Complete the previous task first: list the available folders with ls.";
      } else if (currentDirectory === NAVIGATION_START_DIRECTORY) {
        nextDirectory = PROJECT_DIRECTORY;
        nextChecks.projectEntered = true;
        output = "You are now inside /home/deploy/my-app";
      } else {
        output = "You are already inside my-app.";
      }
      break;
    case "cd ..":
      if (currentDirectory === PROJECT_DIRECTORY) {
        nextDirectory = NAVIGATION_START_DIRECTORY;
        output = "You moved to /home/deploy";
      } else {
        output = "You are already in /home/deploy.";
      }
      break;
    default:
      output = `bash: ${raw}: command not found. Try pwd, ls, or cd my-app.`;
  }

  return { output, currentDirectory: nextDirectory, checks: nextChecks, clearHistory };
}

export function isNavigationMissionComplete(checks) {
  return navigationTasks.every(({ key }) => checks[key]);
}
