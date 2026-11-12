const PROJECT_DIRECTORY = "/home/deploy/my-app";

export const initialOwnershipFile = {
  name: "app.log",
  owner: "root",
  group: "root",
  mode: "-rw-r-----"
};

export const initialOwnershipChecks = {
  ownershipInspected: false,
  currentUserChecked: false,
  ownershipChanged: false,
  ownershipVerified: false
};

export function getNextOwnershipCommand(checks) {
  if (!checks.ownershipInspected) return "ls -l app.log";
  if (!checks.currentUserChecked) return "whoami";
  if (!checks.ownershipChanged) return "sudo chown deploy:deploy app.log";
  if (!checks.ownershipVerified) return "ls -l app.log";
  return null;
}

function normalize(command) {
  return command.trim().replace(/\s+/g, " ");
}

/**
 * Simulates ownership inspection and changes for one sample file.
 * No real user accounts, groups, files, or shell commands are accessed.
 */
export function executeOwnershipCommand({ command, file, checks }) {
  const raw = normalize(command);
  const key = raw.toLowerCase();
  const nextFile = { ...file };
  const nextChecks = { ...checks };
  let output = "";
  let error = false;

  const result = () => ({ output, file: nextFile, checks: nextChecks, error });

  if (!raw) return result();

  switch (key) {
    case "help":
      output = "Supported commands: ls -l app.log, whoami, sudo chown deploy:deploy app.log, pwd, clear";
      break;
    case "clear":
      return { output: "", file, checks, clearHistory: true };
    case "pwd":
      output = PROJECT_DIRECTORY;
      break;
    case "whoami":
      nextChecks.currentUserChecked = true;
      output = "deploy";
      break;
    case "ls -l app.log":
      if (!nextChecks.ownershipInspected) {
        nextChecks.ownershipInspected = true;
        output = "-rw-r----- 1 root root 2048 Nov 12 09:00 app.log";
      } else if (nextChecks.ownershipChanged) {
        output = "-rw-r----- 1 deploy deploy 2048 Nov 12 09:00 app.log";
        nextChecks.ownershipVerified = true;
      } else {
        output = "-rw-r----- 1 root root 2048 Nov 12 09:00 app.log";
      }
      break;
    case "sudo chown deploy:deploy app.log":
      if (!nextChecks.ownershipInspected) {
        output = "Ownership change not applied: inspect the file first with ls -l app.log.";
        error = true;
      } else if (!nextChecks.currentUserChecked) {
        output = "Before changing ownership, check which account you are using with whoami.";
        error = true;
      } else if (nextChecks.ownershipChanged) {
        output = "Ownership is already deploy:deploy for app.log.";
      } else {
        nextFile.owner = "deploy";
        nextFile.group = "deploy";
        nextChecks.ownershipChanged = true;
        output = "Ownership updated: app.log is now owned by deploy and belongs to the deploy group.";
      }
      break;
    default:
      output = `bash: ${raw}: command not found. Type help to see supported commands.`;
      error = true;
  }

  return result();
}
