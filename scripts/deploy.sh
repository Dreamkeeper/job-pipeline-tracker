#!/usr/bin/env bash
#
# Build and deploy Job Pipeline Tracker to the VPS.
#
# This updates an already-provisioned host (nginx server block, TLS cert and
# firewall are set up once, by hand, and documented in the README). It only
# rebuilds the bundle, ships it, and reloads nginx.
#
# Usage:
#   ./scripts/deploy.sh
#   DEPLOY_HOST=myhost ./scripts/deploy.sh   # override the SSH host alias
#
set -euo pipefail

HOST="${DEPLOY_HOST:-app}"     # SSH host alias, configured in your ~/.ssh/config
REMOTE_DIR="/var/www/jt"

echo "==> Building production bundle"
npm run build

echo "==> Packing dist/"
tar -czf dist.tar.gz -C dist .

echo "==> Uploading to ${HOST}:${REMOTE_DIR}"
scp dist.tar.gz "${HOST}:/tmp/jt-dist.tar.gz"

echo "==> Extracting on server and reloading nginx"
ssh "${HOST}" "set -e; \
  rm -rf ${REMOTE_DIR:?}/*; \
  tar -xzf /tmp/jt-dist.tar.gz -C ${REMOTE_DIR}; \
  rm -f /tmp/jt-dist.tar.gz; \
  chown -R www-data:www-data ${REMOTE_DIR}; \
  nginx -t && systemctl reload nginx"

rm -f dist.tar.gz
echo "==> Done. https://jt.dkvasnikov.ru"
