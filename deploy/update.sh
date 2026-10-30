#!/usr/bin/env bash
# Pull and rebuild cffogars.com on the server.
set -euo pipefail
cd /opt/cffogars
git pull -q
docker compose -p cffogars -f deploy/docker-compose.prod.yml up -d --build
docker image prune -f >/dev/null
