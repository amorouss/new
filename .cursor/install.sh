#!/usr/bin/env bash
#
# Cloud Agent install script for the afarines cPanel backup repository.
#
# This script restores the cPanel account backup into a locally runnable state:
#   1. Ensures PHP 7.4 (matching the host's ea-php74), Apache and MariaDB are present.
#   2. Reassembles the split *.tar.gz archives and verifies them against SHA256SUMS.txt.
#   3. Extracts the Home Directory backup (public_html) into the Apache web root.
#   4. Imports every MySQL dump and recreates the WordPress DB users.
#   5. Configures Apache name-based virtual hosts for the restored sites.
#
# It is safe to run repeatedly: each expensive step is guarded by a marker or an
# idempotent check.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="$REPO_ROOT/cpanel-backup"
WORK_DIR="${AFARINESH_WORK_DIR:-$HOME/afarinesh-restore}"
WEBROOT="${AFARINESH_WEBROOT:-/var/www/afarinesh}"
MARKERS="$WORK_DIR/.markers"

log() { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }

mkdir -p "$WORK_DIR" "$MARKERS"

# ---------------------------------------------------------------------------
# 1. System dependencies (idempotent: only installs when php7.4 is missing).
# ---------------------------------------------------------------------------
if ! command -v php >/dev/null 2>&1 || ! php -v 2>/dev/null | grep -q 'PHP 7.4'; then
  log "Installing PHP 7.4, Apache and MariaDB"
  export DEBIAN_FRONTEND=noninteractive
  sudo apt-get update -qq
  sudo apt-get install -y -qq software-properties-common
  sudo add-apt-repository -y ppa:ondrej/php
  sudo apt-get update -qq
  sudo apt-get install -y -qq \
    apache2 libapache2-mod-php7.4 \
    php7.4 php7.4-mysql php7.4-gd php7.4-mbstring php7.4-xml php7.4-curl \
    php7.4-zip php7.4-intl php7.4-bcmath php7.4-soap php7.4-imagick php7.4-gmp \
    mariadb-server mariadb-client unzip pv
else
  log "PHP 7.4 / Apache / MariaDB already installed - skipping apt install"
fi

# ---------------------------------------------------------------------------
# 2. Reassemble split archives and verify SHA-256 checksums.
# ---------------------------------------------------------------------------
declare -A ARCHIVE_PARTS=(
  ["backup-2026.08.06_00-00-00_afarines.tar.gz"]="$BACKUP_DIR/parts-account-2026-08-06"
  ["backup-2026.07.30_00-00-00_afarines.tar.gz"]="$BACKUP_DIR/parts-account-2026-07-30"
  ["backup-afarineshsystem.com-8-6-2026.tar.gz"]="$BACKUP_DIR/parts-homedir-2026-08-06"
)

log "Reassembling and verifying backup archives"
for archive in "${!ARCHIVE_PARTS[@]}"; do
  parts_dir="${ARCHIVE_PARTS[$archive]}"
  out="$WORK_DIR/$archive"
  if [ -f "$MARKERS/verified-$archive" ]; then
    echo "  - $archive already verified, skipping"
    continue
  fi
  echo "  - assembling $archive"
  cat "$parts_dir/$archive".part-* > "$out.tmp"
  mv "$out.tmp" "$out"
done

# Verify all assembled archives against the checksum manifest in one pass.
if [ ! -f "$MARKERS/verified-all" ]; then
  log "Verifying checksums (SHA256SUMS.txt)"
  ( cd "$WORK_DIR" && sha256sum -c "$BACKUP_DIR/SHA256SUMS.txt" )
  for archive in "${!ARCHIVE_PARTS[@]}"; do touch "$MARKERS/verified-$archive"; done
  touch "$MARKERS/verified-all"
fi

# ---------------------------------------------------------------------------
# 3. Extract the Home Directory backup into the Apache web root.
# ---------------------------------------------------------------------------
if [ ! -f "$MARKERS/extracted-homedir" ]; then
  log "Extracting public_html into $WEBROOT"
  sudo mkdir -p "$WEBROOT"
  sudo chown "$(id -u):$(id -g)" "$WEBROOT"
  tar xzf "$WORK_DIR/backup-afarineshsystem.com-8-6-2026.tar.gz" \
    -C "$WEBROOT" --strip-components=1 ./public_html
  touch "$MARKERS/extracted-homedir"
else
  echo "  - public_html already extracted, skipping"
fi

# The full-account archives are verified above for integrity but are redundant
# with the home directory + SQL dumps for running the sites, so we drop the
# reassembled copies to keep the working tree small.
rm -f "$WORK_DIR/backup-2026.08.06_00-00-00_afarines.tar.gz" \
      "$WORK_DIR/backup-2026.07.30_00-00-00_afarines.tar.gz" \
      "$WORK_DIR/backup-afarineshsystem.com-8-6-2026.tar.gz"

# ---------------------------------------------------------------------------
# 3b. Point PHP's mysqlnd driver at the real MariaDB socket.
#
# WordPress connects with DB_HOST='localhost', which makes mysqli use a unix
# socket. mysqlnd's built-in default (/tmp/mysql.sock) does not match Debian's
# socket (/run/mysqld/mysqld.sock), so we set it explicitly for every SAPI.
# ---------------------------------------------------------------------------
log "Configuring PHP MariaDB socket"
SOCK="/run/mysqld/mysqld.sock"
for sapi_dir in /etc/php/7.4/*/conf.d; do
  [ -d "$sapi_dir" ] || continue
  printf 'mysqli.default_socket = %s\npdo_mysql.default_socket = %s\nmysql.default_socket = %s\n' \
    "$SOCK" "$SOCK" "$SOCK" | sudo tee "$sapi_dir/99-afarinesh-socket.ini" >/dev/null
done

# ---------------------------------------------------------------------------
# 4. Import MySQL dumps and (re)create the WordPress database users.
# ---------------------------------------------------------------------------
log "Starting MariaDB for import"
sudo service mariadb start >/dev/null 2>&1 || true
for _ in $(seq 1 30); do sudo mysqladmin ping >/dev/null 2>&1 && break; sleep 1; done

# database -> "user:password" taken from each site's wp-config.php
declare -A DB_USERS=(
  ["afarines_main"]="afarines_shop:sL%Q~9I2rGm1"
  ["afarines_rfid"]="afarines_rfid:ms511136665"
  ["afarines_telemetry"]="afarines_telemet:@}bd4RJw_xaD"
)

log "Importing databases"
for dump in "$BACKUP_DIR"/mysql/*.sql.gz; do
  db="$(basename "$dump" .sql.gz)"
  sudo mysql -e "CREATE DATABASE IF NOT EXISTS \`$db\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
  count="$(sudo mysql -N -B -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$db';")"
  if [ "$count" -gt 0 ]; then
    echo "  - $db already has $count tables, skipping import"
  else
    echo "  - importing $db"
    zcat "$dump" | sudo mysql "$db"
  fi
done

log "Creating database users"
for db in "${!DB_USERS[@]}"; do
  cred="${DB_USERS[$db]}"
  user="${cred%%:*}"
  pass="${cred#*:}"
  sudo mysql <<SQL
CREATE USER IF NOT EXISTS '${user}'@'localhost' IDENTIFIED BY '${pass}';
ALTER USER '${user}'@'localhost' IDENTIFIED BY '${pass}';
GRANT ALL PRIVILEGES ON \`${db}\`.* TO '${user}'@'localhost';
FLUSH PRIVILEGES;
SQL
done

# ---------------------------------------------------------------------------
# 5. Configure Apache virtual hosts for the restored sites.
# ---------------------------------------------------------------------------
log "Configuring Apache virtual hosts"
sudo a2enmod rewrite >/dev/null 2>&1 || true
echo "ServerName localhost" | sudo tee /etc/apache2/conf-available/servername.conf >/dev/null
sudo a2enconf servername >/dev/null 2>&1 || true

write_vhost() {
  local file="$1" server_name="$2" aliases="$3" docroot="$4"
  sudo tee "/etc/apache2/sites-available/$file" >/dev/null <<CONF
<VirtualHost *:80>
    ServerName $server_name
    ${aliases:+ServerAlias $aliases}
    DocumentRoot $docroot
    <Directory $docroot>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    ErrorLog \${APACHE_LOG_DIR}/${file%.conf}-error.log
    CustomLog \${APACHE_LOG_DIR}/${file%.conf}-access.log combined
</VirtualHost>
CONF
}

write_vhost "afarinesh-main.conf"      "afarineshsystem.com"      "www.afarineshsystem.com" "$WEBROOT/public_html"
write_vhost "afarinesh-shop.conf"      "afarineshshop.com"        "www.afarineshshop.com"   "$WEBROOT/public_html/shop"
write_vhost "afarinesh-telemetry.conf" "telemetry.afarineshsystem.com" ""                   "$WEBROOT/public_html/telemetry"
write_vhost "afarinesh-rfid.conf"      "rfid.afarineshsystem.com" ""                        "$WEBROOT/public_html/rfid"

sudo a2dissite 000-default >/dev/null 2>&1 || true
for site in afarinesh-main afarinesh-shop afarinesh-telemetry afarinesh-rfid; do
  sudo a2ensite "$site" >/dev/null 2>&1 || true
done

# Apache must be able to read the restored files.
sudo chown -R www-data:www-data "$WEBROOT"

log "Install complete. Run .cursor/start.sh (or the 'start' phase) to launch services."
