# Trivia Bot

A Slack trivia bot I made using Bolt.js and Socket Mode. It lets people play trivia in a Slack channel, answer questions through DMs, and keep track of everyone's scores.

## Commands

* `/trivia-ping` - Checks if the bot is working and responds with `pong`
* `/trivia-question` - Sends a new trivia question into the channel
* `/trivia-leaderboard` - Shows the current leaderboard
* `/trivia-reveal` - Reveals the answer to the current question
* DM the bot - Send your answer to the bot while a question is active

## How It Works

When a new question is requested, the bot gets a question from Open Trivia DB. If it can't get one from there, it uses the questions saved in `questions.json`.

When someone DMs the bot an answer, it checks it against the current question. If the answer is correct, their score goes up.

The bot keeps track of the current question in `state.json` and saves player scores in `scores.json`.

## Files

* `index.js` - Main bot code and Slack commands
* `questions.json` - Backup trivia questions
* `scores.json` - Stores player scores
* `state.json` - Stores the current question
* `.env` - Stores the Slack tokens

## What I Used

* JavaScript
* Node.js
* Bolt.js
* Slack API
* Socket Mode
* Open Trivia DB
* JSON for saving the game data
