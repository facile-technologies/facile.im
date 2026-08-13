#!/usr/bin/env bash
# Server-side release step, invoked by .github/workflows/deploy.yml after the API
# source is rsynced. Order matters: deps -> safety DB dump -> migrate -> reload.
# `set -e` means a failed migration aborts BEFORE reload, so the running app is never
# replaced with a broken release. Arg 1 = pm2 app name (facile-api-prod|facile-api-staging).
set -euo pipefail

PM2_APP="${1:?pm2 app name required}"

# node/npm/pm2 live under nvm and are not on the non-interactive PATH.
export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
. "$NVM_DIR/nvm.sh"

echo "==> npm ci"
npm ci --omit=dev

# Safety dump right before migrating (belt-and-braces with the nightly cron).
DBN=$(grep -E '^DB_NAME=' .env | cut -d= -f2 | tr -d '[:space:]')
if [ -n "$DBN" ]; then
  echo "==> pre-migrate backup of $DBN"
  mkdir -p /var/backups/facile
  mysqldump --single-transaction --no-tablespaces "$DBN" \
    | gzip > "/var/backups/facile/predeploy_${DBN}_$(date +%F_%H%M).sql.gz"
fi

echo "==> npm run migrate"
npm run migrate

echo "==> pm2 reload $PM2_APP"
pm2 reload "$PM2_APP" --update-env
