#!/bin/bash
# Run this on EC2 (Amazon Linux 2/2023 or Ubuntu) from the project root.
# Usage: cd /path/to/The-Chordinator && bash scripts/setup-ec2.sh

set -e

echo "==> Installing Node.js 18..."
install_node() {
  export NVM_DIR="$HOME/.nvm"
  if [ -s "$NVM_DIR/nvm.sh" ]; then
    . "$NVM_DIR/nvm.sh"
  fi
  if command -v node &>/dev/null && [ "$(node -v | cut -d. -f1 | tr -d v)" -ge 18 ]; then
    echo "Node already installed: $(node -v)"
    return 0
  fi
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
  nvm install 18
  nvm use 18
}
install_node
# Ensure node/npm in PATH for rest of script (nvm may have been installed just now)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18 2>/dev/null || true

echo "==> Installing nginx..."
if command -v yum &>/dev/null; then
  sudo yum install -y nginx || true
elif command -v apt-get &>/dev/null; then
  sudo apt-get update && sudo apt-get install -y nginx
fi

echo "==> Building the app..."
npm ci 2>/dev/null || npm install
npm run build

echo "==> Deploying to nginx..."
sudo rm -rf /usr/share/nginx/html/chordinator
sudo mkdir -p /usr/share/nginx/html/chordinator
sudo cp -r dist/* /usr/share/nginx/html/chordinator/

# SPA: serve index.html for all routes
sudo tee /etc/nginx/conf.d/chordinator.conf <<'NGINX'
server {
  listen 80;
  listen [::]:80;
  server_name _;
  root /usr/share/nginx/html/chordinator;
  index index.html;
  location / {
    try_files $uri $uri/ /index.html;
  }
  location ~* \.(js|css|svg|ico|woff2?)$ {
    add_header Cache-Control "public, max-age=31536000";
  }
}
NGINX

# Prefer our config as default (remove others that might take port 80)
sudo rm -f /etc/nginx/conf.d/default.conf /etc/nginx/default.d/default.conf 2>/dev/null || true

echo "==> Starting nginx..."
sudo systemctl enable nginx
sudo systemctl restart nginx

echo "Done. App is at http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'EC2_PUBLIC_IP')"
echo "If you use the default server, open http://<this-instance-public-ip> in your browser."
