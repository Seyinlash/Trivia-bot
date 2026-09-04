const fs = require('fs');
const path = require('path');

const QUESTIONS_PATH = path.join(__dirname, '..', 'questions.json');

function decodeHtml(str) {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&eacute;/g, 'é');
}

// Option B: Open Trivia DB (falls back to local bank if it fails)
async function fetchFromOpenTriviaDB() {
  try {
    const res = await fetch('https://opentdb.com/api.php?amount=1&type=multiple');
    const data = await res.json();
    const item = data.results && data.results[0];
    if (!item) {
      console.log('[questions] API returned no results, falling back to local bank');
      return null;
    }
    console.log('[questions] Got a question from Open Trivia DB');
    return {
      question: decodeHtml(item.question),
      answer: decodeHtml(item.correct_answer),
    };
  } catch (err) {
    console.log('[questions] API call failed, falling back to local bank:', err.message);
    return null;
  }
}

// Option A: local static bank
function getLocalQuestion() {
  const bank = JSON.parse(fs.readFileSync(QUESTIONS_PATH, 'utf8'));
  const pick = bank[Math.floor(Math.random() * bank.length)];
  return pick;
}

async function getRandomQuestion() {
  const apiQuestion = await fetchFromOpenTriviaDB();
  if (apiQuestion) return apiQuestion;
  return getLocalQuestion();
}

module.exports = { getRandomQuestion, getLocalQuestion };