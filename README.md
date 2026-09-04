# Trivia Bot

A Slack trivia bot built with [Bolt.js](https://slack.dev/bolt-js/) and Socket Mode.

## Commands
- `/trivia-ping` — health check, replies "pong"
- `/trivia-question` — posts a new question in the channel (pulls from Open Trivia DB, falls back to `questions.json`)
- `/trivia-leaderboard` — shows top scorers
- `/trivia-reveal` — reveals the current answer and clears the question
- **DM the bot** your answer to a live question to try to score the point

## 1. Create the Slack App
1. Go to https://api.slack.com/apps → **Create New App** → **From scratch**
2. Name it (e.g. "Trivia Bot") and pick your workspace
3. Under **Socket Mode**, turn it **On**. This generates an **App-Level Token** (starts `xapp-`) — copy it, you'll need `connections:write` scope on it
4. Under **OAuth & Permissions**, add these **Bot Token Scopes**:
   - `chat:write`
   - `commands`
   - `app_mentions:read`
   - `channels:history`
   - `im:write` (needed so the bot can DM you back)
   - `im:history` (needed so the bot can read your DM answers)
5. Under **Slash Commands**, create (names are prefixed with `trivia-` to avoid colliding with other bots in the Hack Club workspace):
   - `/trivia-ping`
   - `/trivia-question`
   - `/trivia-leaderboard`
   - `/trivia-reveal`
   (Request URL can be left blank — Socket Mode doesn't need one)
6. Under **App Home**, enable the **Messages Tab** so people can DM the bot
7. Click **Install to Workspace** at the top of OAuth & Permissions — this gives you a **Bot User OAuth Token** (starts `xoxb-`)

## 2. Local Setup
```bash
npm install
cp .env.example .env
```
Fill in `.env`:
```
SLACK_BOT_TOKEN=xoxb-...
SLACK_APP_TOKEN=xapp-...
```

Run it:
```bash
npm start
```
Try `/ping` in Slack — you should get "pong" back.

## 3. Deploy to Hack Club Nest (24/7 uptime)
1. Get SSH access at https://nest.hackclub.com/ (follow their onboarding — SSH key setup)
2. SSH in: `ssh yourname@nest.hackclub.com`
3. Upload your project (excluding `node_modules` and `.env`), e.g. with `scp` or `git clone` if it's on GitHub
4. On Nest, install dependencies: `npm install`
5. Create `.env` on the server with your real tokens (never commit this file)
6. Run it persistently — Nest supports `pm2` or `tmux`:
   ```bash
   npm install -g pm2
   pm2 start index.js --name trivia-bot
   pm2 save
   ```
   `pm2` keeps it running after you disconnect and restarts it if it crashes.

## Storage
Scores live in `scores.json`, the currently active question lives in `state.json`. Both are plain JSON files that get created/updated automatically — no database needed for now.

## Next improvements (later)
- Scheduled daily question post (cron) instead of manual `/trivia`
- Difficulty/category selection
- Streaks, weekly resets, DM reminders
