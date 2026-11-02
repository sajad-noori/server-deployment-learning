# DeployLab production deployment guide

This guide describes one common layout for an Ubuntu server. Adapt paths, domain names, ports, and service names to your environment.

## 1. Prepare the server

Connect over SSH, update packages, create a non-root deployment user, and configure the firewall. Allow SSH before enabling the firewall so you do not lock yourself out.

    sudo apt update && sudo apt upgrade -y
    sudo adduser deploy
    sudo usermod -aG sudo deploy
    sudo ufw allow OpenSSH
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw enable

## 2. Install Node.js and NGINX

Install a supported Node.js LTS release using a trusted distribution or official Node.js installation guidance. Install NGINX from the Ubuntu package repository.

    sudo apt install nginx -y
    node --version
    npm --version

## 3. Clone and install

As the deployment user:

    git clone https://github.com/sajad-noori/server-deployment-learning.git
    cd server-deployment-learning
    npm install
    npm run install:all
    npm run build

Set API environment variables in a protected environment file or service configuration. Do not commit secrets.

## 4. Run the API with PM2

    sudo npm install -g pm2
    cd server
    PORT=5000 CLIENT_ORIGIN=https://YOUR_DOMAIN npm start

For a persistent production process, configure PM2 with an ecosystem file or systemd unit. With PM2, start the application with a process name, run pm2 startup, execute the generated system command, then run pm2 save.

## 5. Configure NGINX

Build the frontend and configure NGINX to serve the static files while forwarding API requests to Express. Replace YOUR_DOMAIN with a domain you control.

    server {
        listen 80;
        server_name YOUR_DOMAIN www.YOUR_DOMAIN;

        root /var/www/deploylab/client/dist;
        index index.html;

        location /api/ {
            proxy_pass http://127.0.0.1:5000/api/;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location / {
            try_files $uri $uri/ /index.html;
        }
    }

Copy or symlink client/dist to /var/www/deploylab/client/dist, then test and reload NGINX:

    sudo nginx -t
    sudo systemctl reload nginx

## 6. Enable HTTPS

Point DNS records at the server, ensure ports 80 and 443 are reachable, then use a trusted ACME client such as Certbot for your NGINX site. Test renewal with the client's dry-run option.

## 7. Verify and troubleshoot

- Check the API: curl -i http://127.0.0.1:5000/api/health
- Check the process: pm2 status or systemctl status YOUR_SERVICE
- Inspect app logs: pm2 logs or journalctl -u YOUR_SERVICE -n 100
- Check NGINX: sudo nginx -t and sudo tail -n 100 /var/log/nginx/error.log
- Check listeners: ss -tulpn
- Check storage and memory: df -h && free -h

A 502 response commonly indicates NGINX cannot reach the upstream application. Confirm that the API is running, listening on the configured port, and reachable locally.

## Security checklist

- SSH key authentication; disable password/root SSH login only after confirming an alternate access path.
- Firewall allows only required ports.
- Application runs as a non-root user.
- Secrets are stored outside Git.
- HTTPS is enabled and renewal is monitored.
- Dependencies and OS packages receive regular security updates.
- Logs and backups are reviewed routinely.
