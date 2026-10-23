#!/bin/sh
# Daily price backup: exports the pool as prices.csv into a Git checkout of
# the private prices repository, commits the export and Grokbot's inbox/, and
# pushes. Run from cron on the server, for example:
#   15 23 * * * PRICE_API_KEY=... /srv/redsearate/scripts/backup-prices.sh /data/redsearate-prices
set -eu
dir=${1:?usage: backup-prices.sh <prices-repo-checkout>}
site=${SITE_URL:-http://localhost:3000}
: "${PRICE_API_KEY:?PRICE_API_KEY is required}"

curl -fsS -H "Authorization: Bearer $PRICE_API_KEY" "$site/api/prices" -o "$dir/prices.csv.tmp"
mv "$dir/prices.csv.tmp" "$dir/prices.csv"
cd "$dir"
git add -A
git diff --cached --quiet || git commit -q -m "prices $(TZ=Asia/Shanghai date +%F)"
git push -q
