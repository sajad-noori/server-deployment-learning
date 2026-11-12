const PROJECT_DIRECTORY = "/home/deploy/my-app";

export const permissionsDirectory = PROJECT_DIRECTORY;

export const initialPermissionsFile = {
  name: "deploy.sh",
  mode: "-rw-r--r--",
  executable: false
};

export const initialPermissionsChecks = {
  permissionsInspected: false,
  executableGranted: false,
  permissionsVerified: false,
  scriptExecuted: false
};

export function getNextPermissionsCommand(checks) {
  if (!checks.permissionsInspected) return "ls -l deploy.sh";
  if (!checks.executableGranted) return "chmod +x deploy.sh";
  if (!checks.permissionsVerified) return "ls -l deploy.sh";
  if (!checks.scriptExecuted) return "./deploy.sh";
  return null;
}

function normalize(command) {
  return command.trim().replace(/\s+/g, " ");
}

/**
 * Simulates a tiny, safe subset of Linux permission commands.
 * It never changes real files or executes a real shell script.
 */
export function executePermissionsCommand({ command, file, checks }) {
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
      output = "Supported commands: ls -l deploy.sh, chmod +x deploy.sh, ./deploy.sh, pwd, clear";
      break;
    case "clear":
      return { output: "", file, checks, clearHistory: true };
    case "pwd":
      output = PROJECT_DIRECTORY;
      break;
    case "ls -l deploy.sh":
      if (!nextChecks.permissionsInspected) {
        nextChecks.permissionsInspected = true;
        output = "-rw-r--r-- 1 deploy deploy 84 Nov 12 09:00 deploy.sh";
      } else if (!nextChecks.executableGranted) {
        output = "-rw-r--r-- 1 deploy deploy 84 Nov 12 09:00 deploy.sh";
      } else {
        output = "-rwxr-xr-x 1 deploy deploy 84 Nov 12 09:00 deploy.sh";
        nextChecks.permissionsVerified = true;
      }
      break;
    case "chmod +x deploy.sh":
      if (!nextChecks.permissionsInspected) {
        output = "Permission change not applied: inspect the current permissions first with ls -l deploy.sh.";
        error = true;
      } else if (nextChecks.executableGranted) {
        output = "chmod: execute permission is already set on deploy.sh.";
      } else {
        nextFile.mode = "-rwxr-xr-x";
        nextFile.executable = true;
        nextChecks.executableGranted = true;
        output = "Updated permissions for deploy.sh. Execute permission (+x) was added.";
      }
      break;
    case "./deploy.sh":
      if (!nextChecks.permissionsVerified) {
        output = nextChecks.executableGranted
          ? "Run blocked: verify the updated permissions first with ls -l deploy.sh."
          : "bash: ./deploy.sh: Permission denied. Add execute permission with chmod +x deploy.sh.";
        error = true;
      } else {
        nextChecks.scriptExecuted = true;
        output = "Deploy script started successfully.\nChecking application files... OK\nDeployment check complete.";
      }
      break;
    default:
      output = `bash: ${raw}: command not found. Type help to see supported commands.`;
      error = true;
  }

  return result();
}
