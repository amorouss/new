#!/usr/bin/env bash
#
# Cloud Agent start script for the afarines cPanel backup repository.
#
# Runs on every boot. It starts the database and web server and makes the
# restored production hostnames resolve to this machine so the WordPress sites
# (whose siteurl is stored as the production domain) load unchanged.
set -euo pipefail

log() { printf '\n\033[1;32m==> %s\033[0m\n' "$*"; }

# ---------------------------------------------------------------------------
# Map the account's production hostnames to localhost (idempotent).
# ---------------------------------------------------------------------------
HOSTS_LINE="127.0.0.1 afarineshsystem.com www.afarineshsystem.com rfid.afarineshsystem.com telemetry.afarineshsystem.com pvccard.afarineshsystem.com afarineshshop.com www.afarineshshop.com"
if ! grep -qF "afarineshsystem.com" /etc/hosts; then
  echo "$HOSTS_LINE" | sudo tee -a /etc/hosts >/dev/null
fi

# ---------------------------------------------------------------------------
# Ensure the runtime lock dir exists (tmpfs, recreated each boot). Apache's
# init script needs /run/lock (a.k.a. /var/lock) to start.
# ---------------------------------------------------------------------------
sudo mkdir -p /run/lock && sudo chmod 1777 /run/lock

# ---------------------------------------------------------------------------
# Start services (tolerant of already-running daemons).
# ---------------------------------------------------------------------------
log "Starting MariaDB"
sudo service mariadb start >/dev/null 2>&1 || true
for _ in $(seq 1 30); do sudo mysqladmin ping >/dev/null 2>&1 && break; sleep 1; done
sudo mysqladmin ping

log "Starting Apache"
sudo service apache2 restart >/dev/null 2>&1 || sudo service apache2 start
sleep 1
sudo apache2ctl -t

log "Services are up. Restored sites:"
cat <<'EOF'
  http://afarineshsystem.com/            (main landing page)
  http://afarineshshop.com/              (WordPress + WooCommerce shop)
  http://telemetry.afarineshsystem.com/  (WordPress + Elementor)
  http://rfid.afarineshsystem.com/       (WordPress + Polylang)
EOF
