# Server Deployment Learning

A practical, interactive learning platform for Git, GitHub, Linux server administration, Node.js deployment, NGINX, PM2, HTTPS, and CI/CD.

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Persistence: local browser progress (no database required for the learning experience)

## Run locally
```bash
npm install
npm run install:all
npm run dev
```
Frontend: http://localhost:5173  
API: http://localhost:5000/api/health

## Production build
```bash
npm run build
npm start
```

See `docs/deployment-guide.md` for a production deployment walkthrough.

> Never commit SSH private keys, passwords, API tokens, or production .env files.
