# DeployLab: practical server deployment course

A visual, hands-on learning platform for taking applications from a local Git repository to a production Linux server.

## Stack
- Frontend: React 18 + Vite
- Backend: Node.js + Express
- Progress: browser local storage in this first release
- Database: MySQL can be added when multi-user accounts and cross-device progress are introduced.

## Features
- Visual diagrams for Git, SSH, reverse proxy, TLS, CI/CD and request troubleshooting.
- Guided lessons with objectives, commands, explanations and checklists.
- Knowledge checks with immediate feedback.
- Simulated terminal with safe, predefined command responses. It does not execute shell commands.
- Browser-based progress tracking.
- Responsive dashboard and lesson navigation.

## Run locally

Requirements: Node.js 20+ and npm.

    npm install
    npm run install:all
    npm run dev

- React app: http://localhost:5173
- API health: http://localhost:5000/api/health

Build frontend: npm run build
Run API: npm start

## Environment
The API listens on PORT (default 5000). Set CLIENT_ORIGIN to a comma-separated list of allowed frontend origins.
The frontend uses VITE_API_URL for the API base URL. When omitted, it uses http://localhost:5000.

## Production architecture

    Browser
      | HTTPS :443
      v
    NGINX reverse proxy
      |--------------------> React static build
      |
      +--------------------> Node.js / Express API :5000
                                  |
                                  +--> MySQL (future, when accounts are added)

See docs/deployment-guide.md for an example NGINX configuration and deployment checklist.

## Safety
- Never commit .env files, passwords, SSH private keys, or access tokens.
- The practice terminal is simulated and does not provide a real shell.
- Do not run example firewall or SSH commands on a production server unless you understand their effect and have a recovery path.
