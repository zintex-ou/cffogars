#!/usr/bin/env bash
# Refresh cached Veo videos (and league data) — run from host cron.
TOKEN="$(grep ADMIN_TOKEN /srv/cffogars.env | cut -d= -f2)"
curl -s -X POST "https://cffogars.com/api/revalidate?token=$TOKEN" >> /var/log/cffogars-refresh.log 2>&1; echo >> /var/log/cffogars-refresh.log
