const SERVER_DIRECTORY = "/home/deploy";

export const initialServerState = {
  connected: false,
  user: "laptop",
  packagesUpdated: false,
  nginxInstalled: false,
  sshAllowed: false,
  webPortsAllowed: false,
  firewallEnabled: false,
  nginxListening: true,
  sshServiceActive: true,
  disk: "24G used of 80G",
  memory: "1.2 GiB used of 4 GiB"
};

export const initialServerChecks = {
  connected: false,
  identityVerified: false,
  packagesUpdated: false,
  nginxInstalled: false,
  sshRuleAdded: false,
  webRulesAdded: false,
  firewallEnabled: false,
  firewallVerified: false,
  portsInspected: false,
  sshServiceChecked: false,
  logsInspected: false,
  resourcesChecked: false
};

export const serverTasks = [
  { label: "Connect to the remote server", key: "connected" },
  { label: "Verify the deployment account", key: "identityVerified" },
  { label: "Refresh package information", key: "packagesUpdated" },
  { label: "Install the NGINX web server", key: "nginxInstalled" },
  { label: "Allow SSH through the firewall", key: "sshRuleAdded" },
  { label: "Allow HTTP and HTTPS traffic", key: "webRulesAdded" },
  { label: "Enable and verify the firewall", key: "firewallVerified" },
  { label: "Inspect listening network ports", key: "portsInspected" },
  { label: "Check the SSH service and its logs", key: "logsInspected" },
  { label: "Check disk and memory resources", key: "resourcesChecked" }
];

export function getNextServerCommand(checks) {
  if (!checks.connected) return "ssh deploy@203.0.113.10";
  if (!checks.identityVerified) return "id";
  if (!checks.packagesUpdated) return "sudo apt update";
  if (!checks.nginxInstalled) return "sudo apt install nginx -y";
  if (!checks.sshRuleAdded) return "sudo ufw allow OpenSSH";
  if (!checks.webRulesAdded) return "sudo ufw allow 80/tcp && sudo ufw allow 443/tcp";
  if (!checks.firewallEnabled) return "sudo ufw enable";
  if (!checks.firewallVerified) return "sudo ufw status";
  if (!checks.portsInspected) return "ss -tulpn";
  if (!checks.sshServiceChecked) return "systemctl status ssh";
  if (!checks.logsInspected) return "journalctl -u ssh -n 5";
  if (!checks.resourcesChecked) return "df -h && free -h";
  return null;
}

function normalize(command) {
  return command.trim().replace(/\s+/g, " ").replace(/\s*&&\s*/g, " && ");
}

/**
 * Safe, in-memory Ubuntu server preparation simulator.
 * It does not open SSH connections, install packages, or change a real firewall.
 */
export function executeServerCommand({ command, server, checks }) {
  const raw = normalize(command);
  const key = raw.toLowerCase();
  const nextServer = { ...server };
  const nextChecks = { ...checks };
  let output = "";
  let error = false;
  const result = () => ({ output, server: nextServer, checks: nextChecks, error });

  if (!raw) return result();
  if (key === "help") {
    output = "Supported commands: ssh deploy@203.0.113.10, id, sudo apt update, sudo apt install nginx -y, sudo ufw allow OpenSSH, sudo ufw allow 80/tcp && sudo ufw allow 443/tcp, sudo ufw enable, sudo ufw status, ss -tulpn, systemctl status ssh, journalctl -u ssh -n 5, df -h && free -h, pwd, clear";
    return result();
  }
  if (key === "clear") return { output: "", server, checks, clearHistory: true };
  if (key === "pwd") {
    output = nextServer.connected ? SERVER_DIRECTORY : "/Users/learner";
    return result();
  }
  if (key === "ssh deploy@203.0.113.10") {
    if (nextChecks.connected) output = "Already connected to deploy@203.0.113.10.";
    else {
      nextServer.connected = true;
      nextServer.user = "deploy";
      nextChecks.connected = true;
      output = "Connected to 203.0.113.10.\nUbuntu 24.04 LTS · deploy@server\nThis is a simulated remote session. No real network connection was made.";
    }
    return result();
  }
  if (!nextServer.connected) {
    return { ...result(), output: "You are still on your own computer. Connect to the remote server first with ssh deploy@203.0.113.10.", error: true };
  }

  switch (key) {
    case "id":
      nextChecks.identityVerified = true;
      output = "uid=1001(deploy) gid=1001(deploy) groups=1001(deploy),27(sudo)";
      break;
    case "sudo apt update":
      if (!nextChecks.identityVerified) {
        output = "Verify which account you are using first with id.";
        error = true;
      } else {
        nextServer.packagesUpdated = true;
        nextChecks.packagesUpdated = true;
        output = "Hit:1 http://archive.ubuntu.com/ubuntu noble InRelease\nReading package lists... Done\nPackage information refreshed.";
      }
      break;
    case "sudo apt install nginx -y":
      if (!nextChecks.packagesUpdated) {
        output = "Refresh package information first with sudo apt update.";
        error = true;
      } else {
        nextServer.nginxInstalled = true;
        nextChecks.nginxInstalled = true;
        output = "Installing nginx and required packages...\nSetting up nginx...\nInstallation complete.";
      }
      break;
    case "sudo ufw allow openssh":
      if (!nextChecks.identityVerified) {
        output = "Verify your deployment account first with id.";
        error = true;
      } else {
        nextServer.sshAllowed = true;
        nextChecks.sshRuleAdded = true;
        output = "Rule added\nRule added (v6)\nSSH traffic is allowed.";
      }
      break;
    case "sudo ufw allow 80/tcp && sudo ufw allow 443/tcp":
      if (!nextChecks.sshRuleAdded) {
        output = "Allow OpenSSH before changing or enabling the firewall. Otherwise, you could lock yourself out.";
        error = true;
      } else {
        nextServer.webPortsAllowed = true;
        nextChecks.webRulesAdded = true;
        output = "Rule added: 80/tcp (HTTP)\nRule added: 443/tcp (HTTPS)";
      }
      break;
    case "sudo ufw enable":
      if (!nextChecks.sshRuleAdded || !nextChecks.webRulesAdded) {
        output = "Safety check: allow OpenSSH, HTTP, and HTTPS before enabling UFW. This prevents blocking remote access or website traffic.";
        error = true;
      } else {
        nextServer.firewallEnabled = true;
        nextChecks.firewallEnabled = true;
        output = "Firewall is active and enabled on system startup.";
      }
      break;
    case "sudo ufw status":
      if (!nextChecks.firewallEnabled) {
        output = "UFW is inactive. Complete the firewall setup and enable it first.";
        error = true;
      } else {
        nextChecks.firewallVerified = true;
        output = "Status: active\n22/tcp (OpenSSH) ALLOW\n80/tcp ALLOW\n443/tcp ALLOW";
      }
      break;
    case "ss -tulpn":
      if (!nextChecks.nginxInstalled) {
        output = "Install the web server first. Then inspect listening sockets with ss -tulpn.";
        error = true;
      } else {
        nextChecks.portsInspected = true;
        output = "Netid State  Local Address:Port\ntcp   LISTEN 0.0.0.0:22   (sshd)\ntcp   LISTEN 0.0.0.0:80   (nginx)\nNo application is listening on 443 yet; HTTPS will be configured later.";
      }
      break;
    case "systemctl status ssh":
      nextChecks.sshServiceChecked = true;
      output = "ssh.service - OpenBSD Secure Shell server\nActive: active (running)\nLoaded: loaded; enabled";
      break;
    case "journalctl -u ssh -n 5":
      if (!nextChecks.sshServiceChecked) {
        output = "Check the SSH service state first with systemctl status ssh.";
        error = true;
      } else {
        nextChecks.logsInspected = true;
        output = "Nov 12 09:00:01 server sshd[810]: Server listening on 0.0.0.0 port 22.\nNov 12 09:02:14 server sshd[922]: Accepted publickey for deploy.\n-- End of recent ssh.service logs --";
      }
      break;
    case "df -h && free -h":
      if (!nextChecks.logsInspected) {
        output = "Complete the service and log checks first.";
        error = true;
      } else {
        nextChecks.resourcesChecked = true;
        output = "Filesystem  Size Used Avail Use% Mounted on\n/dev/vda1    80G  24G   53G  32% /\n\n              total  used  free\nMem:          4.0G  1.2G  2.8G";
      }
      break;
    default:
      output = `bash: ${raw}: command not found. Type help to see supported commands.`;
      error = true;
  }
  return result();
}
