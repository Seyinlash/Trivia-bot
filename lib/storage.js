const fs = require('fs');
const path = require('path');

const SCORES_PATH = path.join(__dirname, '..', 'scores.json');
const STATE_PATH = path.join(__dirname, '..', 'state.json');

function readJson(filePath, fallback) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return fallback;
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ---- Scores ----
function getScores() {
  return readJson(SCORES_PATH, {});
}

function addPoint(userId) {
  const scores = getScores();
  scores[userId] = (scores[userId] || 0) + 1;
  writeJson(SCORES_PATH, scores);
  return scores[userId];
}

function getLeaderboard(limit = 10) {
  const scores = getScores();
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

// ---- Current question state ----
// state = { question, answer, answeredBy, channelId, askedAt }
function getState() {
  return readJson(STATE_PATH, null);
}

function setState(state) {
  writeJson(STATE_PATH, state);
}

function clearState() {
  writeJson(STATE_PATH, null);
}

module.exports = {
  getScores,
  addPoint,
  getLeaderboard,
  getState,
  setState,
  clearState,
};