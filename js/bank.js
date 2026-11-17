/* ============================================================
   bank.js — Full Question Bank (Q1-63) with filters
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  renderBank();
});

/* Active filters state */
const bankFilters = {
  lecture: 'all',   // 'all' | 'L1'...'L5'
  difficulty: 'all', // 'all' | 'easy' | 'medium' | 'hard'
  hotOnly: false,
};

function renderBank() {
  const container = document.getElementById('bank-container');
  if (!container) return;

  // Merge exam QUESTIONS (Q1-20) into BANK array with difficulty markers
  const examAsBank = QUESTIONS.map(q => ({
    id: 'Q' + q.id,
    type: q.type,
    lecture: q.lecture,
    difficulty: 'medium',
    hot: false,
    text: q.text,
    options: q.options || null,
    answer: q.answer,
    explanation: q.explanation,
  }));

  const allQuestions = [...examAsBank, ...BANK];

  container.innerHTML = `
    <!-- Filter bar -->
    <div class="bank-filters">
      <span style="font-size:0.78rem;color:var(--text-dim);font-weight:700;align-self:center">LECTURE:</span>
      <button class="filter-btn active" data-filter="lecture" data-val="all" onclick="bankFilter('lecture','all',this)">All</button>
      <button class="filter-btn f-l1" data-filter="lecture" data-val="L1" onclick="bankFilter('lecture','L1',this)">📦 L1</button>
      <button class="filter-btn f-l2" data-filter="lecture" data-val="L2" onclick="bankFilter('lecture','L2',this)">🔍 L2</button>
      <button class="filter-btn f-l3" data-filter="lecture" data-val="L3" onclick="bankFilter('lecture','L3',this)">🔗 L3</button>
      <button class="filter-btn f-l4" data-filter="lecture" data-val="L4" onclick="bankFilter('lecture','L4',this)">🏢 L4</button>
      <button class="filter-btn f-l5" data-filter="lecture" data-val="L5" onclick="bankFilter('lecture','L5',this)">🎲 L5</button>
      <span style="font-size:0.78rem;color:var(--text-dim);font-weight:700;align-self:center;margin-left:8px">DIFFICULTY:</span>
      <button class="filter-btn active" data-filter="difficulty" data-val="all" onclick="bankFilter('difficulty','all',this)">All</button>
      <button class="filter-btn" data-filter="difficulty" data-val="easy" onclick="bankFilter('difficulty','easy',this)" style="color:#22c55e">Easy</button>
      <button class="filter-btn f-hard" data-filter="difficulty" data-val="medium" onclick="bankFilter('difficulty','medium',this)" style="color:#f97316">Medium</button>
      <button class="filter-btn f-hard" data-filter="difficulty" data-val="hard" onclick="bankFilter('difficulty','hard',this)" style="color:#ef4444">Hard</button>
      <button class="filter-btn f-hot ${bankFilters.hotOnly?'active':''}" onclick="bankToggleHot(this)" style="color:#fbbf24">⭐ Hot only</button>
    </div>
    <div class="bank-stats" id="bank-stats"></div>
    <div class="bank-grid" id="bank-grid"></div>
  `;

  // Store all questions globally for filtering
  window._bankAllQ = allQuestions;
  applyBankFilters();
}

function applyBankFilters() {
  const all = window._bankAllQ || [];
  const grid = document.getElementById('bank-grid');
  const stats = document.getElementById('bank-stats');
  if (!grid) return;

  const filtered = all.filter(q => {
    if (bankFilters.lecture !== 'all' && q.lecture !== bankFilters.lecture) return false;
    if (bankFilters.difficulty !== 'all' && q.difficulty !== bankFilters.difficulty) return false;
    if (bankFilters.hotOnly && !q.hot) return false;
    return true;
  });

  stats.textContent = `Showing ${filtered.length} of ${all.length} questions`;

  const lColors = { L1:'var(--l1)', L2:'var(--l2)', L3:'var(--l3)', L4:'var(--l4)', L5:'var(--l5)' };
  const dm = DIFFICULTY_META;

  grid.innerHTML = filtered.map(q => {
    const col = lColors[q.lecture] || '#818cf8';
    const diff = dm[q.difficulty] || dm.medium;

    let optionsHTML = '';
    if (q.type === 'mc' && q.options) {
      optionsHTML = `<div class="bank-options">
        ${q.options.map(o => `
          <div class="bank-opt ${o.label === q.answer ? 'correct-opt' : 'wrong-opt'}">
            <span style="font-weight:800;min-width:18px">${o.label})</span>
            <span>${o.text}</span>
            ${o.label === q.answer ? '<span style="margin-left:auto;color:var(--l2)">✓</span>' : ''}
          </div>
        `).join('')}
      </div>`;
    } else if (q.type === 'tf') {
      optionsHTML = `<div class="bank-options">
        <div class="bank-opt ${q.answer === true ? 'correct-opt' : 'wrong-opt'}">
          <span style="font-weight:800">TRUE</span>
          ${q.answer === true ? '<span style="margin-left:auto;color:var(--l2)">✓</span>' : ''}
        </div>
        <div class="bank-opt ${q.answer === false ? 'correct-opt' : 'wrong-opt'}">
          <span style="font-weight:800">FALSE</span>
          ${q.answer === false ? '<span style="margin-left:auto;color:var(--l2)">✓</span>' : ''}
        </div>
      </div>`;
    }

    return `
      <div class="bank-card" id="bc-${q.id}">
        <div class="bank-card-header" onclick="toggleBankCard('${q.id}')">
          <span class="bank-q-id" style="background:${col}22;color:${col}">${q.id} · ${q.lecture}</span>
          <span class="badge-diff" style="background:${diff.bg};color:${diff.color}">${diff.label}</span>
          ${q.hot ? '<span class="badge-hot">⭐</span>' : ''}
          <span class="bank-q-text">${q.text}</span>
          <span class="bank-toggle">▼</span>
        </div>
        <div class="bank-card-body">
          ${optionsHTML}
          <div class="bank-answer-row">
            <span style="color:var(--l2);font-size:1rem;flex-shrink:0">💡</span>
            <span>${q.explanation}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.toggleBankCard = (id) => {
  const card = document.getElementById('bc-' + id);
  if (card) card.classList.toggle('open');
};

window.bankFilter = (type, val, btn) => {
  bankFilters[type] = val;
  // Update active class for that filter group
  document.querySelectorAll(`[data-filter="${type}"]`).forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyBankFilters();
};

window.bankToggleHot = (btn) => {
  bankFilters.hotOnly = !bankFilters.hotOnly;
  btn.classList.toggle('active', bankFilters.hotOnly);
  applyBankFilters();
};
