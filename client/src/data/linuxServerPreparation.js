export const linuxServerPreparationLesson = {
  id: "linux-server-preparation",
  title: "Linux practice: prepare a server for deployment",
  group: "linux",
  level: "Intermediate",
  duration: "30 min",
  summary: "Connect to a remote Ubuntu server, prepare essential software, secure access, and check server health.",
  objective: "Create an SSH key pair, install its public key, connect remotely, and use apt, UFW, ss, systemctl, journalctl, df, and free to prepare and inspect a server before deployment.",
  steps: [{
    title: "Prepare a remote Linux server",
    body: "You have a new Ubuntu server and a deployment account named deploy. Create an SSH key pair on your computer, copy only the public key to the server, connect remotely, verify the account, update package information, install NGINX, configure the firewall without blocking SSH, inspect network listeners and the SSH service, and check available server resources. This entire workshop is simulated and does not connect to a real server.",
    command: "ssh deploy@203.0.113.10",
    explain: "SSH keys authenticate you without sending your private key to the server: keep the private key on your computer and install only the public key remotely. SSH gives you a secure remote terminal. apt manages Ubuntu packages, UFW controls firewall rules, ss inspects listening sockets, systemctl manages services, journalctl reads service logs, and df/free report disk and memory usage."
  }],
  quiz: "Why should you allow OpenSSH before enabling the UFW firewall?",
  options: [
    "So the server can install NGINX faster",
    "To avoid blocking your SSH connection and locking yourself out",
    "Because HTTP and HTTPS require port 22"
  ],
  answer: 1,
  why: "If UFW blocks port 22 before allowing SSH, your remote session or future SSH connections can be cut off. Always permit the SSH service before enabling the firewall."
};
