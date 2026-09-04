require('dotenv').config();
const { App } = require('@slack/bolt');
const { getRandomQuestion } = require('./lib/questions');
const { getState, setState, clearState, addPoint, getLeaderboard } = require('./lib/storage');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

// --- /trivia-ping : basic health check slash command ---
app.command('/trivia-ping', async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

// --- /trivia-question : posts a new question in the channel ---
app.command('/trivia-question', async ({ ack, respond, command }) => {
  await ack();

  const existing = getState();
  if (existing) {
    await respond("There's already an active question! DM me your answer, or wait for it to be revealed.");
    return;
  }

  const q = await getRandomQuestion();
  setState({
    question: q.question,
    answer: q.answer,
    answeredBy: null,
    channelId: command.channel_id,
    askedAt: Date.now(),
  });

  await respond({
    response_type: 'in_channel',
    text: `🧠 *Trivia time!*\n${q.question}\n\nDM me your answer — first correct one wins the point!`,
  });
});

// --- /trivia-leaderboard : shows top scores ---
app.command('/trivia-leaderboard', async ({ ack, respond }) => {
  await ack();
  const board = getLeaderboard();
  if (board.length === 0) {
    await respond('No points on the board yet — answer a question to get started!');
    return;
  }
  const lines = board.map(([userId, score], i) => `${i + 1}. <@${userId}> — ${score} pt${score === 1 ? '' : 's'}`);
  await respond(`🏆 *Trivia Leaderboard*\n${lines.join('\n')}`);
});

// --- /trivia-reveal : manually reveal the current answer ---
app.command('/trivia-reveal', async ({ ack, respond }) => {
  await ack();
  const state = getState();
  if (!state) {
    await respond('No active question right now.');
    return;
  }
  const winnerText = state.answeredBy ? `<@${state.answeredBy}> got it right! 🎉` : 'Nobody got it this time.';
  await respond(`The answer was: *${state.answer}*\n${winnerText}`);
  clearState();
});

// --- Listen for DMs to check trivia answers ---
app.message(async ({ message, say }) => {
  // Only handle plain DMs (channel type 'im'), ignore bot messages/edits
  if (message.channel_type !== 'im' || message.subtype) return;

  const state = getState();
  if (!state) {
    await say("There's no active trivia question right now. Ask someone to run `/trivia-question` in a channel!");
    return;
  }

  if (state.answeredBy) {
    await say('That question was already answered — wait for the next one!');
    return;
  }

  const userAnswer = (message.text || '').trim().toLowerCase();
  const correctAnswer = state.answer.trim().toLowerCase();

  if (userAnswer === correctAnswer) {
    state.answeredBy = message.user;
    setState(state);
    const newScore = addPoint(message.user);
    await say(`✅ Correct! You now have ${newScore} point${newScore === 1 ? '' : 's'}.`);
  } else {
    await say('❌ Not quite — try again!');
  }
});

(async () => {
  await app.start();
  console.log('bot is running!');
})();