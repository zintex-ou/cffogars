# cffogars.com

Club website of CF Fogars Veterans. Next.js 16, trilingual (`/ca`, `/es`, `/en`).
Match data, standings and squad come live from the league site (`LEAGUE_URL/api/public/team/TEAM_SLUG`, cached 5 min).

Edit by hand: `src/content/club.ts` (history, honours, sponsors, contacts, social links), `public/images/` (hero.jpg, sponsor logos).

Dev: `npm install && npm run dev` → http://localhost:3000

Deploy (Hetzner, next to the league stack): `/opt/cffogars`, env in `/srv/cffogars.env` (see `deploy/cffogars.env.example`),
`bash deploy/update.sh`. Caddy block in `deploy/Caddyfile.snippet`.
