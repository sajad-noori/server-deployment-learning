import { useMemo } from "react";
import {
  ArrowRight, CheckCircle2, Cloud, KeyRound, Laptop,
  LockKeyhole, Network, Package, Server, ShieldCheck, Terminal,
  UserRound, Wifi
} from "lucide-react";
import "./LinuxStepVisual.css";

const visuals = {
  "ssh-linux": [
    {
      eyebrow: "SSH CONNECTION",
      title: "A secure path from your laptop to the server",
      description: "Your SSH client starts a connection to the server. The SSH daemon (sshd) listens for it, usually on TCP port 22.",
      nodes: [
        { icon: Laptop, title: "Your computer", detail: "SSH client", tone: "client" },
        { icon: Network, title: "Encrypted tunnel", detail: "TCP · port 22", tone: "secure" },
        { icon: Server, title: "Linux server", detail: "sshd service", tone: "server" }
      ],
      foot: "Commands travel through the encrypted channel—not as readable plain text."
    },
    {
      eyebrow: "KEY GENERATION",
      title: "One pair of keys, two different jobs",
      description: "ssh-keygen creates both files on your own computer. The public key can be shared; the private key must stay secret.",
      nodes: [
        { icon: Laptop, title: "Your computer", detail: "Key generation", tone: "client" },
        { icon: KeyRound, title: "Private key", detail: "id_ed25519 · keep secret", tone: "private" },
        { icon: ShieldCheck, title: "Public key", detail: "id_ed25519.pub · shareable", tone: "public" }
      ],
      foot: "A passphrase adds protection if someone obtains your private-key file."
    },
    {
      eyebrow: "PUBLIC-KEY INSTALLATION",
      title: "Only the public key is copied to the server",
      description: "ssh-copy-id appends your public key to the remote account's authorized_keys file. Your private key never leaves your device.",
      nodes: [
        { icon: KeyRound, title: "Public key", detail: "Sent to the server", tone: "public" },
        { icon: Wifi, title: "SSH connection", detail: "Secure transfer", tone: "secure" },
        { icon: Server, title: "authorized_keys", detail: "~/.ssh/authorized_keys", tone: "server" }
      ],
      foot: "The server stores the public key so it can verify a future login challenge."
    },
    {
      eyebrow: "AUTHENTICATION",
      title: "Prove you own the private key",
      description: "When you connect, the server checks whether your public key is authorized. Your SSH client proves possession without sending the private key.",
      nodes: [
        { icon: Laptop, title: "SSH client", detail: "Proves key ownership", tone: "client" },
        { icon: LockKeyhole, title: "Key verification", detail: "Challenge / response", tone: "secure" },
        { icon: CheckCircle2, title: "Access granted", detail: "Remote shell opens", tone: "public" }
      ],
      foot: "Successful key authentication opens a shell under the selected Linux user."
    }
  ],
  "server-setup": [
    {
      eyebrow: "SYSTEM UPDATES",
      title: "Refresh package information, then install updates",
      description: "apt update downloads the latest package indexes. apt upgrade installs available updates using those indexes.",
      nodes: [
        { icon: Cloud, title: "Package repositories", detail: "Latest package indexes", tone: "secure" },
        { icon: Package, title: "apt update", detail: "Refresh package list", tone: "client" },
        { icon: Server, title: "Linux packages", detail: "apt upgrade", tone: "server" }
      ],
      foot: "The two commands do different jobs: update refreshes indexes; upgrade installs updates."
    },
    {
      eyebrow: "USER PRIVILEGES",
      title: "Create a separate account for daily administration",
      description: "A deploy user has its own home directory and permissions. Use sudo only for tasks that actually need elevated privileges.",
      nodes: [
        { icon: UserRound, title: "Administrator", detail: "Creates an account", tone: "client" },
        { icon: Terminal, title: "sudo adduser", detail: "Create deploy user", tone: "secure" },
        { icon: Server, title: "/home/deploy", detail: "Separate account", tone: "server" }
      ],
      foot: "Avoid using root for routine work: a mistake made as root can affect the whole system."
    },
    {
      eyebrow: "FIREWALL RULES",
      title: "Allow the services you need before turning the firewall on",
      description: "UFW controls incoming traffic. Add the SSH rule first, then allow web traffic on ports 80 and 443.",
      nodes: [
        { icon: Laptop, title: "SSH · TCP 22", detail: "Keep remote access", tone: "public" },
        { icon: Network, title: "UFW rules", detail: "Allow 22, 80, 443", tone: "secure" },
        { icon: Cloud, title: "Web traffic", detail: "HTTP / HTTPS", tone: "server" }
      ],
      foot: "If SSH is not allowed before enabling UFW, you could lock yourself out of the server."
    },
    {
      eyebrow: "ENABLE & VERIFY",
      title: "Turn on the firewall and verify the active policy",
      description: "Enable UFW only after confirming the SSH rule. Keep your current SSH session open and test a second connection.",
      nodes: [
        { icon: ShieldCheck, title: "UFW enabled", detail: "Firewall is active", tone: "secure" },
        { icon: CheckCircle2, title: "Status check", detail: "ufw status verbose", tone: "public" },
        { icon: Laptop, title: "Second SSH login", detail: "Confirm access works", tone: "client" }
      ],
      foot: "Do not close your original session until the second SSH connection succeeds."
    }
  ]
};

export default function LinuxStepVisual({ lessonId, stepIndex = 0 }) {
  const lessonVisuals = visuals[lessonId];
  const visual = useMemo(
    () => lessonVisuals?.[stepIndex] ?? null,
    [lessonId, stepIndex]
  );

  if (!visual) return null;

  return (
    <section className="linux-visual" aria-label={visual.title}>
      <div className="linux-visual-heading">
        <span className="linux-visual-eyebrow"><Network size={14} /> {visual.eyebrow}</span>
        <span className="linux-visual-live"><i /> LIVE FLOW</span>
      </div>
      <h3>{visual.title}</h3>
      <p className="linux-visual-description">{visual.description}</p>
      <div className="linux-flow" role="img" aria-label={visual.nodes.map(node => node.title).join(" then ")}>
        {visual.nodes.map((node, index) => {
          const Icon = node.icon;
          return (
            <div className="linux-flow-part" key={node.title}>
              <div className={`linux-flow-node tone-${node.tone} flow-step-${index + 1}`}>
                <span className="linux-flow-icon"><Icon size={21} /></span>
                <strong>{node.title}</strong>
                <small>{node.detail}</small>
              </div>
              {index < visual.nodes.length - 1 && (
                <div className="linux-flow-connector" aria-hidden="true">
                  <span className="linux-flow-line" />
                  <span className="linux-flow-packet" />
                  <ArrowRight size={15} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="linux-visual-foot"><CheckCircle2 size={15} /><span>{visual.foot}</span></div>
    </section>
  );
}
