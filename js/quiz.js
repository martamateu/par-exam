/* ============================================================
   quiz.js — Practice Exam (timer, scoring) + Flashcard mode
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initExam();
});

/* ---- STATE ---- */
let examState = {
  mode: 'exam',         // 'exam' | 'flashcard'
  answers: {},          // questionId → answer
  submitted: false,
  timerInterval: null,
  secondsLeft: 2 * 60 * 60,  // 2 hours
  flashIndex: 0,
  flashFlipped: false,
};

/* ---- INIT ---- */
function initExam() {
  const container = document.getElementById('exam-container');
  if (!container) return;

  container.innerHTML = `
    <!-- Toolbar -->
    <div class="exam-toolbar">
      <div>
        <div style="font-size:0.7rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em">Time remaining</div>
        <div class="timer-display" id="exam-timer">2:00:00</div>
      </div>
      <div style="flex:1"></div>
      <button class="exam-mode-btn active" id="btn-exam-mode" onclick="setMode('exam')">📝 Exam</button>
      <button class="exam-mode-btn" id="btn-flash-mode" onclick="setMode('flashcard')">🃏 Flashcards</button>
    </div>

    <!-- Exam mode -->
    <div id="exam-view">
      <div style="padding:16px 24px 0;display:flex;gap:16px;flex-wrap:wrap;align-items:center">
        <div style="font-size:0.85rem;color:var(--text-muted)">
          Part A: 10 × T/F (0.4 pts each) · Part B: 10 × MC (0.6 pts each) · Max: <b>10 pts</b>
        </div>
        <div style="flex:1"></div>
        <div id="exam-progress" style="font-size:0.82rem;color:var(--text-muted)"></div>
      </div>

      <div class="questions-container" id="q-part-a">
        <div style="font-size:1rem;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:.08em;padding:4px 0 8px">
          Part A — True / False
        </div>
      </div>

      <div class="questions-container" id="q-part-b">
        <div style="font-size:1rem;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:.08em;padding:4px 0 8px">
          Part B — Multiple Choice
        </div>
      </div>

      <button class="exam-submit-btn" id="exam-submit" onclick="submitExam()">Submit Exam</button>
    </div>

    <!-- Results panel -->
    <div class="results-panel" id="results-panel">
      <div style="text-align:center">
        <div style="font-size:0.9rem;color:var(--text-muted)">Your score</div>
        <div class="result-score-big" id="result-score">—</div>
        <div style="color:var(--text-muted);font-size:0.9rem;margin-bottom:20px" id="result-sub"></div>
      </div>
      <div class="result-breakdown" id="result-breakdown"></div>
      <button class="exam-submit-btn" onclick="retakeExam()" style="background:linear-gradient(135deg,#22c55e,#15803d)">↺ Retake</button>
    </div>

    <!-- Flashcard mode -->
    <div id="flash-view" style="display:none;padding:24px">
      <div class="fc-progress" id="flash-progress"></div>
      <div class="flashcard-exam" id="flash-card">
        <div id="flash-front"></div>
        <div id="flash-back" style="display:none"></div>
      </div>
      <div class="fc-exam-nav">
        <button onclick="flashPrev()">← Prev</button>
        <button onclick="flashFlip()" id="flash-flip-btn">Reveal answer</button>
        <button onclick="flashNext()">Next →</button>
      </div>
    </div>
  `;

  renderQuestions();
  startTimer();
}

/* ---- RENDER QUESTIONS ---- */
function renderQuestions() {
  const tfContainer = document.getElementById('q-part-a');
  const mcContainer = document.getElementById('q-part-b');

  QUESTIONS.forEach(q => {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.id = `qcard-${q.id}`;

    const lectureColor = { L1:'var(--l1)', L2:'var(--l2)', L3:'var(--l3)', L4:'var(--l4)', L5:'var(--l5)' }[q.lecture] || 'var(--text-muted)';

    card.innerHTML = `
      <div class="q-header">
        <span class="q-num" style="background:${lectureColor}22;color:${lectureColor};border:1px solid ${lectureColor}44">
          Q${q.id} · ${q.lecture} · ${q.weight} pts
        </span>
        <span class="q-text">${q.text}</span>
      </div>
      <div id="q-input-${q.id}">
        ${q.type === 'tf' ? renderTF(q) : renderMC(q)}
      </div>
      <div class="q-explanation" id="q-exp-${q.id}">${q.explanation}</div>
    `;

    if (q.type === 'tf') tfContainer.appendChild(card);
    else mcContainer.appendChild(card);
  });

  updateProgress();
}

function renderTF(q) {
  return `
    <div class="tf-btns">
      <button class="tf-btn" id="tf-t-${q.id}" onclick="answerTF(${q.id}, true)">True</button>
      <button class="tf-btn" id="tf-f-${q.id}" onclick="answerTF(${q.id}, false)">False</button>
    </div>
  `;
}

function renderMC(q) {
  return `
    <div class="mc-options">
      ${q.options.map(opt => `
        <div class="mc-option" id="mc-${q.id}-${opt.label}" onclick="answerMC(${q.id}, '${opt.label}')">
          <span class="mc-letter">${opt.label}</span>
          <span>${opt.text}</span>
        </div>
      `).join('')}
    </div>
  `;
}

/* ---- ANSWER HANDLERS ---- */
window.answerTF = (id, val) => {
  if (examState.submitted) return;
  examState.answers[id] = val;
  document.getElementById(`tf-t-${id}`).className = 'tf-btn' + (val === true  ? ' selected-t' : '');
  document.getElementById(`tf-f-${id}`).className = 'tf-btn' + (val === false ? ' selected-f' : '');
  updateProgress();
};

window.answerMC = (id, opt) => {
  if (examState.submitted) return;
  examState.answers[id] = opt;
  const q = QUESTIONS.find(q=>q.id===id);
  q.options.forEach(o => {
    document.getElementById(`mc-${id}-${o.label}`).className = 'mc-option' + (o.label === opt ? ' selected' : '');
  });
  updateProgress();
};

function updateProgress() {
  const answered = Object.keys(examState.answers).length;
  const total = QUESTIONS.length;
  const el = document.getElementById('exam-progress');
  if (el) el.textContent = `${answered} / ${total} answered`;
}

/* ---- TIMER ---- */
function startTimer() {
  clearInterval(examState.timerInterval);
  examState.timerInterval = setInterval(() => {
    if (examState.submitted) { clearInterval(examState.timerInterval); return; }
    examState.secondsLeft--;
    if (examState.secondsLeft <= 0) {
      examState.secondsLeft = 0;
      clearInterval(examState.timerInterval);
      submitExam();
    }
    updateTimerDisplay();
  }, 1000);
}

function updateTimerDisplay() {
  const h = Math.floor(examState.secondsLeft / 3600);
  const m = Math.floor((examState.secondsLeft % 3600) / 60);
  const s = examState.secondsLeft % 60;
  const display = `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  const el = document.getElementById('exam-timer');
  if (el) {
    el.textContent = display;
    el.style.color = examState.secondsLeft < 300 ? '#ef4444' : '#fbbf24';
  }
}

/* ---- SUBMIT ---- */
window.submitExam = () => {
  examState.submitted = true;
  clearInterval(examState.timerInterval);

  let totalScore = 0, maxScore = 0;
  const byLecture = {};

  QUESTIONS.forEach(q => {
    const ans = examState.answers[q.id];
    maxScore += q.weight;
    const correct = (q.type === 'tf') ? (ans === q.answer) : (ans === q.answer);

    if (correct) totalScore += q.weight;

    if (!byLecture[q.lecture]) byLecture[q.lecture] = { score: 0, max: 0 };
    byLecture[q.lecture].max += q.weight;
    if (correct) byLecture[q.lecture].score += q.weight;

    // Show correct/wrong on card
    const card = document.getElementById(`qcard-${q.id}`);
    if (card) card.classList.add(correct ? 'correct' : 'wrong');

    // Show explanation
    const exp = document.getElementById(`q-exp-${q.id}`);
    if (exp) exp.classList.add('show');

    // Highlight answers
    if (q.type === 'tf') {
      const tBtn = document.getElementById(`tf-t-${q.id}`);
      const fBtn = document.getElementById(`tf-f-${q.id}`);
      if (q.answer === true)  tBtn.classList.add('correct-ans');
      if (q.answer === false) fBtn.classList.add('correct-ans');
      if (ans === true  && !correct) tBtn.classList.add('wrong-ans');
      if (ans === false && !correct) fBtn.classList.add('wrong-ans');
    } else {
      q.options.forEach(o => {
        const optEl = document.getElementById(`mc-${q.id}-${o.label}`);
        if (!optEl) return;
        if (o.label === q.answer) optEl.classList.add('correct');
        else if (o.label === ans && !correct) optEl.classList.add('wrong');
      });
    }
  });

  // Show results
  const resultPanel = document.getElementById('results-panel');
  resultPanel.classList.add('show');

  const pct = (totalScore/maxScore*100).toFixed(1);
  document.getElementById('result-score').textContent = `${totalScore.toFixed(1)} / ${maxScore.toFixed(1)}`;
  document.getElementById('result-score').style.color = totalScore >= 5 ? '#4ade80' : '#f87171';
  document.getElementById('result-sub').textContent = `${pct}% · ${totalScore >= 5 ? '✅ Pass' : '❌ Fail (need ≥5)'}`;

  const lColors = { L1:'var(--l1)', L2:'var(--l2)', L3:'var(--l3)', L4:'var(--l4)', L5:'var(--l5)' };
  document.getElementById('result-breakdown').innerHTML =
    Object.entries(byLecture).map(([lec, {score, max}]) => `
      <div class="result-chunk" style="border-color:${lColors[lec]}44">
        <div class="rc-num" style="color:${lColors[lec]}">${score.toFixed(1)}/${max.toFixed(1)}</div>
        <div class="rc-label">${lec}</div>
        <div style="font-size:0.7rem;color:var(--text-dim)">${(score/max*100).toFixed(0)}%</div>
      </div>
    `).join('') + `
      <div class="result-chunk" style="border-color:#fbbf2444">
        <div class="rc-num" style="color:#fbbf24">${totalScore.toFixed(1)}/${maxScore.toFixed(1)}</div>
        <div class="rc-label">Total</div>
        <div style="font-size:0.7rem;color:var(--text-dim)">${pct}%</div>
      </div>
    `;

  // Hide submit button
  const btn = document.getElementById('exam-submit');
  if (btn) btn.style.display = 'none';

  // Scroll to results
  resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

window.retakeExam = () => {
  examState = {
    mode: 'exam', answers: {}, submitted: false,
    timerInterval: null, secondsLeft: 7200,
    flashIndex: 0, flashFlipped: false,
  };
  const container = document.getElementById('exam-container');
  if (container) { container.innerHTML = ''; initExam(); }
};

/* ---- MODE SWITCH ---- */
window.setMode = (mode) => {
  examState.mode = mode;
  document.getElementById('exam-view').style.display   = mode === 'exam'      ? 'block' : 'none';
  document.getElementById('flash-view').style.display  = mode === 'flashcard' ? 'block' : 'none';
  document.getElementById('btn-exam-mode').classList.toggle('active', mode === 'exam');
  document.getElementById('btn-flash-mode').classList.toggle('active', mode === 'flashcard');
  if (mode === 'flashcard') renderFlashCard();
};

/* ---- FLASHCARD MODE ---- */
function renderFlashCard() {
  const q = QUESTIONS[examState.flashIndex];
  const total = QUESTIONS.length;
  examState.flashFlipped = false;

  document.getElementById('flash-progress').textContent =
    `Question ${examState.flashIndex + 1} of ${total} · ${q.lecture} · ${q.weight} pts`;

  const lColors = { L1:'var(--l1)', L2:'var(--l2)', L3:'var(--l3)', L4:'var(--l4)', L5:'var(--l5)' };
  const col = lColors[q.lecture] || 'var(--text-muted)';

  document.getElementById('flash-front').innerHTML = `
    <div style="font-size:0.75rem;font-weight:700;color:${col};text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px">
      Q${q.id} · ${q.lecture} · ${q.type === 'tf' ? 'True/False' : 'Multiple Choice'}
    </div>
    <div style="font-size:1.05rem;line-height:1.5;font-weight:600">${q.text}</div>
    ${q.type === 'mc' ? `
      <div style="margin-top:12px;font-size:0.82rem;color:var(--text-muted)">
        ${q.options.map(o=>`<div style="padding:3px 0"><b>${o.label})</b> ${o.text}</div>`).join('')}
      </div>` : ''}
  `;

  document.getElementById('flash-back').innerHTML = `
    <div style="font-size:0.75rem;font-weight:700;color:${col};text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px">
      ✅ Answer
    </div>
    <div style="font-size:1.3rem;font-weight:900;margin-bottom:10px;color:${col}">
      ${q.type === 'tf' ? (q.answer ? 'TRUE ✓' : 'FALSE ✗') : `${q.answer}) ${q.options.find(o=>o.label===q.answer)?.text}`}
    </div>
    <div style="font-size:0.85rem;color:var(--text-muted);line-height:1.5">${q.explanation}</div>
  `;

  document.getElementById('flash-front').style.display = 'flex';
  document.getElementById('flash-back').style.display  = 'none';
  document.getElementById('flash-flip-btn').textContent = 'Reveal answer';
}

window.flashFlip = () => {
  examState.flashFlipped = !examState.flashFlipped;
  document.getElementById('flash-front').style.display = examState.flashFlipped ? 'none' : 'flex';
  document.getElementById('flash-back').style.display  = examState.flashFlipped ? 'block' : 'none';
  document.getElementById('flash-flip-btn').textContent = examState.flashFlipped ? 'Hide answer' : 'Reveal answer';
};

window.flashNext = () => {
  examState.flashIndex = (examState.flashIndex + 1) % QUESTIONS.length;
  renderFlashCard();
};

window.flashPrev = () => {
  examState.flashIndex = (examState.flashIndex - 1 + QUESTIONS.length) % QUESTIONS.length;
  renderFlashCard();
};
