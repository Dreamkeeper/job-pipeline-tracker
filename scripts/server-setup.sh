#!/usr/bin/env bash
#
# One-time provisioning for the Job Pipeline Tracker host.
#
# Run this once on the VPS (it is idempotent, so re-running is safe). It does
# NOT touch any existing services. It only adds an nginx site that listens on a
# non-standard TLS port, because port 443 on this host is already in use.
#
# After this, day-to-day updates use scripts/deploy.sh.
#
# Usage on the server:  bash server-setup.sh
#
set -euo pipefail

WEBROOT=/var/www/jt
DOMAIN=jt.dkvasnikov.ru
ORIGIN_PORT=2053

echo "== nginx present? =="
command -v nginx >/dev/null || { echo "install nginx first: apt-get install -y nginx"; exit 1; }

echo "== web root =="
mkdir -p "$WEBROOT"

echo "== origin TLS cert (Cloudflare-to-origin leg; browsers see Cloudflare's edge cert) =="
mkdir -p /etc/nginx/ssl
if [ ! -f /etc/nginx/ssl/jt.crt ]; then
  openssl req -x509 -nodes -newkey rsa:2048 -days 3650 \
    -keyout /etc/nginx/ssl/jt.key -out /etc/nginx/ssl/jt.crt \
    -subj "/CN=${DOMAIN}"
  chmod 600 /etc/nginx/ssl/jt.key
fi

echo "== server block =="
cat > /etc/nginx/sites-available/jt <<NGINXEOF
server {
    listen ${ORIGIN_PORT} ssl;
    listen [::]:${ORIGIN_PORT} ssl;
    http2 on;
    server_name ${DOMAIN};

    ssl_certificate     /etc/nginx/ssl/jt.crt;
    ssl_certificate_key /etc/nginx/ssl/jt.key;

    root ${WEBROOT};
    index index.html;

    location /assets/ {
        try_files \$uri =404;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    add_header X-Content-Type-Options "nosniff" always;
}
NGINXEOF

ln -sf /etc/nginx/sites-available/jt /etc/nginx/sites-enabled/jt

echo "== firewall =="
ufw allow ${ORIGIN_PORT}/tcp comment "jt static site (Cloudflare origin)" || true

echo "== test + reload =="
nginx -t
systemctl reload nginx

echo "== ownership =="
chown -R www-data:www-data "$WEBROOT" || true

echo "DONE: nginx serving ${WEBROOT} on https (self-signed) port ${ORIGIN_PORT}"
