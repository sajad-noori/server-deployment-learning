import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(",") || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

const lessons = [
  { id: "git-basics", title: "Git foundations", category: "Git & GitHub", level: "Beginner", duration: "25 min", summary: "Understand repositories, staging, commits, and the working tree." },
  { id: "github-workflow", title: "GitHub workflow", category: "Git & GitHub", level: "Beginner", duration: "30 min", summary: "Push code, work with branches, and open pull requests." },
  { id: "ssh-linux", title: "Connect to Linux with SSH", category: "Linux & SSH", level: "Beginner", duration: "35 min", summary: "Securely access a remote Linux server using SSH keys." },
  { id: "server-setup", title: "Prepare your server", category: "Linux & SSH", level: "Intermediate", duration: "40 min", summary: "Create a non-root user, update packages, and configure a firewall." },
  { id: "node-deploy", title: "Deploy a Node.js app", category: "Node.js", level: "Intermediate", duration: "45 min", summary: "Install Node.js, clone your repository, and configure production dependencies." },
  { id: "pm2", title: "Keep apps alive with PM2", category: "Process management", level: "Intermediate", duration: "30 min", summary: "Run, restart, monitor, and persist Node.js processes." },
  { id: "nginx", title: "NGINX reverse proxy", category: "Web server", level: "Intermediate", duration: "40 min", summary: "Route public HTTP traffic to your Node.js application." },
  { id: "https", title: "HTTPS and SSL certificates", category: "Security", level: "Intermediate", duration: "25 min", summary: "Issue and renew TLS certificates with Certbot." },
  { id: "updates", title: "Deploy updates safely", category: "Release workflow", level: "Intermediate", duration: "35 min", summary: "Pull changes, install dependencies, build, restart, and verify." },
  { id: "github-actions", title: "Automate deployment with GitHub Actions", category: "CI/CD", level: "Advanced", duration: "50 min", summary: "Understand workflows, secrets, deployment keys, and automated releases." },
  { id: "logs", title: "Logs and troubleshooting", category: "Operations", level: "Intermediate", duration: "35 min", summary: "Inspect service logs, ports, NGINX errors, and resource usage." }
];

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "deployment-learning-api", timestamp: new Date().toISOString() }));
app.get("/api/lessons", (_req, res) => res.json({ lessons }));
app.get("/api/lessons/:id", (req, res) => {
  const lesson = lessons.find((item) => item.id === req.params.id);
  if (!lesson) return res.status(404).json({ error: "Lesson not found" });
  return res.json({ lesson });
});
app.use((_req, res) => res.status(404).json({ error: "Route not found" }));

app.listen(port, () => console.log(`Learning API listening on port ${port}`));