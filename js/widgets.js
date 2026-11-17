/* ============================================================
   widgets.js — 5 interactive widgets, one per lecture
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initWidgetL1();
  initWidgetL2();
  initWidgetL3();
  initWidgetL4();
  initWidgetL5();
});

/* ============================================================
   L1: Blocks World
   ============================================================ */
function initWidgetL1() {
  const el = document.getElementById('widget-l1');
  if (!el) return;

  // State: stacks are arrays bottom→top
  let state = {
    stacks: [['B','A'], ['C'], []],   // stack 0, stack 1, stack 2
    holding: null,
  };

  el.innerHTML = `
    <div class="blocks-world">
      <div class="widget-row" style="gap:24px;flex-wrap:wrap">
        <div class="widget-col">
          <div class="widget-label">Scene (click a block to select)</div>
          <div class="blocks-scene" id="bw-scene"></div>
          <div class="arm-indicator" id="bw-arm">🦾 ArmEmpty</div>
        </div>
        <div class="widget-col" style="min-width:260px">
          <div class="widget-label">Current state s</div>
          <div class="state-display" id="bw-state"></div>
          <div class="widget-label mt8">γ(s,a) result</div>
          <div class="gamma-display" id="bw-gamma">Apply an action to see the transition.</div>
        </div>
      </div>
      <div class="widget-label">Applicable actions <span style="color:var(--l2-light);font-size:0.72rem">(green = applicable)</span></div>
      <div class="actions-panel" id="bw-actions"></div>
      <div class="mt8" style="display:flex;gap:8px">
        <button class="btn" onclick="bwReset()">↺ Reset</button>
        <button class="btn btn-primary" onclick="bwRandom()">🎲 Random state</button>
      </div>
    </div>
  `;

  window.bwState = state;
  window.bwSelectedBlock = null;

  window.bwReset = () => {
    state.stacks = [['B','A'], ['C'], []];
    state.holding = null;
    window.bwSelectedBlock = null;
    bwRender();
  };

  window.bwRandom = () => {
    const blocks = ['A','B','C'];
    state.stacks = [[], [], []];
    state.holding = null;
    blocks.sort(() => Math.random()-0.5);
    // random distribution
    blocks.forEach(b => state.stacks[Math.floor(Math.random()*3)].push(b));
    window.bwSelectedBlock = null;
    bwRender();
  };

  function bwGetFacts() {
    const facts = [];
    state.stacks.forEach(stack => {
      stack.forEach((b, i) => {
        if (i === 0) facts.push(`OnTable(${b})`);
        else facts.push(`On(${b},${stack[i-1]})`);
        if (i === stack.length - 1) facts.push(`Clear(${b})`);
      });
    });
    if (state.holding) facts.push(`Holding(${state.holding})`);
    else facts.push('ArmEmpty');
    return facts;
  }

  function bwApplicableActions() {
    const facts = new Set(bwGetFacts());
    const applicable = [];
    const allBlocks = ['A','B','C'];

    allBlocks.forEach(x => {
      // pickup(x): Clear(x), OnTable(x), ArmEmpty
      if (facts.has(`Clear(${x})`) && facts.has(`OnTable(${x})`) && facts.has('ArmEmpty'))
        applicable.push({ name: `pickup(${x})`, action: 'pickup', args: [x] });
      // putdown(x): Holding(x)
      if (facts.has(`Holding(${x})`))
        applicable.push({ name: `putdown(${x})`, action: 'putdown', args: [x] });
      allBlocks.forEach(y => {
        if (x !== y) {
          // stack(x,y): Holding(x), Clear(y)
          if (facts.has(`Holding(${x})`) && facts.has(`Clear(${y})`))
            applicable.push({ name: `stack(${x},${y})`, action: 'stack', args: [x, y] });
          // unstack(x,y): On(x,y), Clear(x), ArmEmpty
          if (facts.has(`On(${x},${y})`) && facts.has(`Clear(${x})`) && facts.has('ArmEmpty'))
            applicable.push({ name: `unstack(${x},${y})`, action: 'unstack', args: [x, y] });
        }
      });
    });
    return applicable;
  }

  function bwApplyAction(act) {
    const prevFacts = bwGetFacts().join(', ');
    const [x, y] = act.args;
    if (act.action === 'pickup') {
      // remove x from stack, arm holds x
      state.stacks.forEach(s => { const i = s.indexOf(x); if (i !== -1 && i === s.length-1) s.splice(i,1); });
      state.holding = x;
    } else if (act.action === 'putdown') {
      // find empty or any stack, place x on table
      let placed = false;
      for (let s of state.stacks) { if (s.length === 0) { s.push(x); placed = true; break; } }
      if (!placed) state.stacks.push([x]);
      state.holding = null;
    } else if (act.action === 'stack') {
      // place x on top of y
      for (let s of state.stacks) { const i = s.indexOf(y); if (i !== -1 && i === s.length-1) { s.push(x); break; } }
      state.holding = null;
    } else if (act.action === 'unstack') {
      // remove x from top of y stack
      for (let s of state.stacks) { const i = s.indexOf(x); if (i !== -1 && i === s.length-1) { s.splice(i,1); break; } }
      state.holding = x;
    }
    const newFacts = bwGetFacts().join(', ');
    document.getElementById('bw-gamma').innerHTML =
      `<b>Applied: ${act.name}</b><br>Before: {${prevFacts}}<br>After:  {${newFacts}}`;
    bwRender();
  }

  window.bwRender = function() {
    const facts = bwGetFacts();
    // Scene
    const scene = document.getElementById('bw-scene');
    const colors = { A: 'block-A', B: 'block-B', C: 'block-C', D: 'block-D' };
    scene.innerHTML = state.stacks.map((stack, si) => `
      <div class="block-stack" style="flex:1;min-width:70px">
        ${stack.map((b, bi) => `<div class="block ${colors[b]||'block-A'}">${b}</div>`).join('')}
        <div class="table-line"></div>
        <div style="font-size:0.65rem;color:var(--text-dim);text-align:center;margin-top:2px">slot ${si+1}</div>
      </div>
    `).join('') + (state.holding ? `
      <div style="display:flex;flex-direction:column;align-items:center;gap:4px;margin-left:12px">
        <div style="font-size:0.7rem;color:var(--l3-light);margin-bottom:2px">🦾 Holding</div>
        <div class="block ${colors[state.holding]||'block-A'}" style="border-color:white">${state.holding}</div>
      </div>` : '');

    document.getElementById('bw-arm').textContent = state.holding
      ? `🦾 Holding: ${state.holding}`
      : '🦾 ArmEmpty';

    // State facts
    document.getElementById('bw-state').textContent = '{' + facts.join(',\n ') + '}';

    // Actions
    const applicable = bwApplicableActions();
    const allPossible = [];
    ['A','B','C'].forEach(x => {
      allPossible.push(`pickup(${x})`);
      allPossible.push(`putdown(${x})`);
      ['A','B','C'].filter(y=>y!==x).forEach(y => {
        allPossible.push(`stack(${x},${y})`);
        allPossible.push(`unstack(${x},${y})`);
      });
    });
    const appNames = new Set(applicable.map(a=>a.name));
    const actContainer = document.getElementById('bw-actions');
    actContainer.innerHTML = applicable.map(act => `
      <button class="action-btn applicable" onclick='bwDo(${JSON.stringify(act)})'>${act.name}</button>
    `).join('');
  };

  window.bwDo = (act) => bwApplyAction(act);

  bwRender();
}

/* ============================================================
   L2: A* Playground
   ============================================================ */
function initWidgetL2() {
  const el = document.getElementById('widget-l2');
  if (!el) return;

  const initNodes = [
    { name: 'A', g: 3, h: 6 },
    { name: 'B', g: 5, h: 2 },
    { name: 'C', g: 2, h: 8 },
    { name: 'D', g: 7, h: 1 },
  ];

  el.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:16px">
      <div>
        <div class="widget-label">OPEN nodes — edit g and h values, then click Evaluate</div>
        <table class="astar-table" id="astar-tbl">
          <thead><tr><th>Node</th><th>g (cost so far)</th><th>h (heuristic)</th><th>f = g+h</th><th>Picks</th></tr></thead>
          <tbody id="astar-body"></tbody>
        </table>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-green" onclick="astarEvaluate()">▶ Evaluate</button>
          <button class="btn" onclick="astarAddRow()">+ Add node</button>
          <button class="btn" onclick="astarReset()">↺ Reset</button>
        </div>
      </div>
      <div>
        <div class="widget-label">h_max / h_add calculator (goal costs, comma-separated)</div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          <input id="hcalc-input" value="3, 1, 5" style="background:var(--bg3);border:1px solid var(--border);color:var(--text);padding:7px 12px;border-radius:6px;font-family:monospace;width:200px"/>
          <button class="btn btn-primary" onclick="hCalc()">Calculate</button>
          <div id="hcalc-result" style="font-family:monospace;font-size:1rem;color:var(--l2-light)"></div>
        </div>
      </div>
    </div>
  `;

  window._astarNodes = initNodes.map(n => ({...n}));

  function renderTable() {
    const tbody = document.getElementById('astar-body');
    tbody.innerHTML = window._astarNodes.map((n, i) => `
      <tr id="astar-row-${i}">
        <td><input value="${n.name}" onchange="window._astarNodes[${i}].name=this.value" style="width:40px;background:var(--bg2);border:1px solid var(--border);color:var(--text);padding:4px;border-radius:4px;text-align:center"/></td>
        <td><input type="number" value="${n.g}" onchange="window._astarNodes[${i}].g=+this.value" class="astar-table" style="width:55px;background:var(--bg2);border:1px solid var(--border);color:var(--text);padding:4px;border-radius:4px;text-align:center"/></td>
        <td><input type="number" value="${n.h}" onchange="window._astarNodes[${i}].h=+this.value" class="astar-table" style="width:55px;background:var(--bg2);border:1px solid var(--border);color:var(--text);padding:4px;border-radius:4px;text-align:center"/></td>
        <td id="astar-f-${i}" style="font-weight:800;color:var(--l2-light)">—</td>
        <td id="astar-pick-${i}">—</td>
      </tr>
    `).join('');
  }

  window.astarEvaluate = () => {
    const nodes = window._astarNodes;
    nodes.forEach(n => { n.f = n.g + n.h; });

    const minF = Math.min(...nodes.map(n=>n.f));
    const minG = Math.min(...nodes.map(n=>n.g));
    const minH = Math.min(...nodes.map(n=>n.h));
    const maxDepth = Math.max(...nodes.map(n=>n.g)); // BFS uses depth (g as proxy)
    const minDepth = Math.min(...nodes.map(n=>n.g));

    nodes.forEach((n, i) => {
      document.getElementById(`astar-f-${i}`).textContent = n.f;
      const picks = [];
      if (n.f === minF)    picks.push('<span class="pick-badge pb-astar">A*</span>');
      if (n.g === minG)    picks.push('<span class="pick-badge pb-ucs">UCS</span>');
      if (n.h === minH)    picks.push('<span class="pick-badge pb-greedy">Greedy</span>');
      if (n.g === minDepth) picks.push('<span class="pick-badge pb-bfs">BFS</span>');
      document.getElementById(`astar-pick-${i}`).innerHTML = picks.join('') || '—';

      const row = document.getElementById(`astar-row-${i}`);
      row.className = '';
      if (n.f === minF) row.classList.add('pick-astar');
    });
  };

  window.astarAddRow = () => {
    window._astarNodes.push({ name: 'X', g: 0, h: 0 });
    renderTable();
  };

  window.astarReset = () => {
    window._astarNodes = initNodes.map(n => ({...n}));
    renderTable();
    document.querySelectorAll('[id^=astar-f-],[id^=astar-pick-]').forEach(el => el.textContent = '—');
  };

  window.hCalc = () => {
    const vals = document.getElementById('hcalc-input').value
      .split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
    if (!vals.length) return;
    const hmax = Math.max(...vals);
    const hadd = vals.reduce((a,b)=>a+b,0);
    document.getElementById('hcalc-result').innerHTML =
      `h_max = <b>${hmax}</b> &nbsp;|&nbsp; h_add = <b>${hadd}</b>`;
  };

  renderTable();
}

/* ============================================================
   L3: Threat Visualiser
   ============================================================ */
function initWidgetL3() {
  const el = document.getElementById('widget-l3');
  if (!el) return;

  // ordering state: list of "X≺Y"
  let orderings = new Set(['a≺b']); // initial: a before b (from causal link)
  let linearCount = 0;

  el.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="widget-label">Causal link: <span style="color:var(--l3-light);font-family:monospace">a ─p─▶ b</span> &nbsp;|&nbsp; Threatening action: <span style="color:#ef4444;font-family:monospace">c</span> (deletes p)</div>
      <canvas class="threat-canvas" id="threat-canvas" height="160"></canvas>
      <div class="threat-status" id="threat-status">c threatens the link a─p→b and can be inserted between a and b.</div>

      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-orange" onclick="threatDemotion()">⬅ Demotion (c ≺ a)</button>
        <button class="btn btn-green"  onclick="threatPromotion()">➡ Promotion (b ≺ c)</button>
        <button class="btn"            onclick="threatReset()">↺ Reset threat</button>
      </div>

      <div style="display:flex;gap:16px;flex-wrap:wrap">
        <div class="widget-col">
          <div class="widget-label">Current orderings</div>
          <div class="state-display" id="ord-display">a ≺ b</div>
        </div>
        <div class="widget-col">
          <div class="widget-label">Linearizations count</div>
          <div class="state-display" id="lin-display" style="font-size:1.5rem;font-weight:800;text-align:center">—</div>
        </div>
      </div>
    </div>
  `;

  // positions: a, b, c
  const pos = { a: { x: 100, y: 80 }, b: { x: 320, y: 80 }, c: { x: 210, y: 160 } };
  let mode = 'threat'; // 'demotion' | 'promotion' | 'threat'

  function drawArrow(ctx, from, to, color='#f97316', label='', dashed=false) {
    ctx.save();
    ctx.strokeStyle = color; ctx.fillStyle = color;
    ctx.lineWidth = 2;
    if (dashed) ctx.setLineDash([5,4]);
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    // arrowhead
    const angle = Math.atan2(to.y-from.y, to.x-from.x);
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(to.x - 12*Math.cos(angle-0.4), to.y - 12*Math.sin(angle-0.4));
    ctx.lineTo(to.x - 12*Math.cos(angle+0.4), to.y - 12*Math.sin(angle+0.4));
    ctx.closePath(); ctx.fill();
    if (label) {
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(label, (from.x+to.x)/2 - 6, (from.y+to.y)/2 - 8);
    }
    ctx.restore();
  }

  function drawNode(ctx, label, p, color='#f97316', threat=false) {
    ctx.save();
    ctx.fillStyle = threat ? '#2d0a0a' : '#4a2010';
    ctx.strokeStyle = threat ? '#ef4444' : color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(p.x-30, p.y-24, 60, 48, 10);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = threat ? '#fca5a5' : '#fdba74';
    ctx.font = 'bold 20px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(label, p.x, p.y);
    ctx.restore();
  }

  function render() {
    const canvas = document.getElementById('threat-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth || 600;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Scale positions to canvas width
    const scl = canvas.width / 450;
    const p = {
      a: { x: pos.a.x*scl, y: pos.a.y },
      b: { x: pos.b.x*scl, y: pos.b.y },
      c: { x: pos.c.x*scl, y: pos.c.y },
    };

    // causal link a→b
    drawArrow(ctx, { x: p.a.x+30, y: p.a.y }, { x: p.b.x-30, y: p.b.y }, '#f97316', 'p');

    // threat c
    if (mode === 'threat') {
      drawArrow(ctx, { x: p.c.x, y: p.c.y-24 }, { x: (p.a.x+p.b.x)/2, y: p.a.y }, '#ef4444', '⚠️', true);
    } else if (mode === 'demotion') {
      drawArrow(ctx, { x: p.c.x+30, y: p.c.y }, { x: p.a.x, y: p.a.y+24 }, '#22c55e', 'c≺a');
    } else {
      drawArrow(ctx, { x: p.b.x, y: p.b.y+24 }, { x: p.c.x+30, y: p.c.y }, '#22c55e', 'b≺c');
    }

    drawNode(ctx, 'a', p.a);
    drawNode(ctx, 'b', p.b);
    drawNode(ctx, 'c', p.c, '#f97316', true);

    // labels
    ctx.fillStyle = '#8892b0'; ctx.font='11px sans-serif'; ctx.textAlign='center';
    ctx.fillText('producer', p.a.x, p.a.y+36);
    ctx.fillText('consumer', p.b.x, p.b.y+36);
    ctx.fillText('threat (deletes p)', p.c.x, p.c.y+36);

    updateOrderDisplay();
    computeLinearizations();
  }

  function updateOrderDisplay() {
    document.getElementById('ord-display').textContent = [...orderings].join('\n');
    const status = document.getElementById('threat-status');
    if (mode === 'threat') {
      status.className = 'threat-status warn';
      status.textContent = '⚠️ c threatens the link a─p→b. Apply Demotion or Promotion to resolve.';
    } else if (mode === 'demotion') {
      status.className = 'threat-status ok';
      status.textContent = '✅ Demotion applied: c ≺ a. c now executes before a — cannot intervene.';
    } else {
      status.className = 'threat-status ok';
      status.textContent = '✅ Promotion applied: b ≺ c. c now executes after b — link already consumed.';
    }
  }

  function computeLinearizations() {
    // Count linearizations of {a,b,c} given orderings
    const perms = [['a','b','c'],['a','c','b'],['b','a','c'],['b','c','a'],['c','a','b'],['c','b','a']];
    const ords = [...orderings];
    let count = 0;
    perms.forEach(p => {
      const valid = ords.every(o => {
        const [x, y] = o.split('≺');
        return p.indexOf(x) < p.indexOf(y);
      });
      if (valid) count++;
    });
    document.getElementById('lin-display').textContent = count;
  }

  window.threatDemotion = () => {
    // Check if a≺c already exists (would create cycle with c≺a)
    if (orderings.has('a≺c')) {
      document.getElementById('threat-status').className = 'threat-status warn';
      document.getElementById('threat-status').textContent = '🚫 Cannot demote: a≺c already exists → cycle! Use Promotion instead.';
      return;
    }
    orderings.add('c≺a');
    mode = 'demotion';
    render();
  };

  window.threatPromotion = () => {
    orderings.add('b≺c');
    mode = 'promotion';
    render();
  };

  window.threatReset = () => {
    orderings = new Set(['a≺b']);
    mode = 'threat';
    render();
  };

  setTimeout(render, 100);
  window.addEventListener('resize', () => setTimeout(render, 50));
}

/* ============================================================
   L4: Graphplan Stepper — "one coin, two wishes"
   ============================================================ */
function initWidgetL4() {
  const el = document.getElementById('widget-l4');
  if (!el) return;

  const LEVELS = [
    {
      title: 'P₀',
      type: 'prop',
      nodes: [{ label: 'has-coin', style: 'gp-prop' }],
      note: 'Initial state. No mutexes in P₀!',
    },
    {
      title: 'A₁',
      type: 'action',
      nodes: [
        { label: 'buy-tea', style: 'gp-action' },
        { label: 'buy-cake', style: 'gp-action' },
        { label: 'noop\n(has-coin)', style: 'gp-noop' },
      ],
      mutexes: [{ a: 0, b: 1, reason: 'Interference: buy-tea deletes has-coin (precond of buy-cake) ⚡' }],
      note: 'buy-tea ⚡ buy-cake (Interference)',
    },
    {
      title: 'P₁',
      type: 'prop',
      nodes: [
        { label: 'has-coin', style: 'gp-prop' },
        { label: 'tea', style: 'gp-prop' },
        { label: 'cake', style: 'gp-prop' },
      ],
      mutexes: [
        { a: 0, b: 1, reason: 'tea ⚡ has-coin' },
        { a: 0, b: 2, reason: 'cake ⚡ has-coin' },
        { a: 1, b: 2, reason: 'tea ⚡ cake (key!)' },
      ],
      note: 'tea⚡cake⚡has-coin — goal {tea,cake} is mutex → cannot extract!',
    },
    {
      title: 'A₂',
      type: 'action',
      nodes: [
        { label: 'buy-tea', style: 'gp-action' },
        { label: 'buy-cake', style: 'gp-action' },
        { label: 'noops...', style: 'gp-noop' },
      ],
      mutexes: [{ a: 0, b: 1, reason: 'Still mutex — same reasons' }],
      note: 'Same actions, same mutexes. Graph is levelling off.',
    },
    {
      title: 'P₂ = P₁',
      type: 'prop',
      nodes: [
        { label: 'has-coin', style: 'gp-prop' },
        { label: 'tea', style: 'gp-prop' },
        { label: 'cake', style: 'gp-prop' },
      ],
      mutexes: [
        { a: 1, b: 2, reason: 'tea⚡cake still mutex' },
      ],
      note: '🔚 Graph levelled off. Goals {tea, cake} still mutex → NO PLAN!',
      noPlan: true,
    },
  ];

  let currentLevel = 0;

  el.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="widget-label">Example: "One coin, two wishes" — goal: {tea AND cake}</div>
      <div class="gp-graph" id="gp-graph"></div>
      <div class="state-display" id="gp-note" style="color:var(--l4-light)"></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-purple" id="gp-next" onclick="gpNext()">▶ Next layer</button>
        <button class="btn" onclick="gpReset()">↺ Reset</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px" id="gp-mutex-info"></div>
    </div>
  `;

  function gpRenderGraph() {
    const graph = document.getElementById('gp-graph');
    const visible = LEVELS.slice(0, currentLevel + 1);

    graph.innerHTML = visible.map((lev, li) => `
      <div class="gp-col">
        <div class="gp-col-title">${lev.title}</div>
        ${lev.nodes.map((n, ni) => `
          <div class="gp-node ${n.style}" id="gpn-${li}-${ni}" style="white-space:pre-line">${n.label}</div>
        `).join('')}
        ${lev.mutexes && lev.mutexes.length ? `
          <div style="font-size:0.7rem;color:#ef4444;margin-top:6px;text-align:center">
            ${lev.mutexes.map(m => `⚡ ${lev.nodes[m.a].label.replace('\n',' ')} ⚡ ${lev.nodes[m.b].label.replace('\n',' ')}`).join('<br>')}
          </div>` : ''}
      </div>
    `).join('');

    const lev = LEVELS[currentLevel];
    document.getElementById('gp-note').textContent = lev.note;

    // Mutex info cards
    if (lev.mutexes && lev.mutexes.length) {
      document.getElementById('gp-mutex-info').innerHTML = lev.mutexes.map(m => `
        <div class="formula-card" style="border-left:3px solid #ef4444">
          <div class="formula-label">⚡ Mutex</div>
          <div class="formula-body" style="font-size:0.82rem">${m.reason}</div>
        </div>
      `).join('');
    } else {
      document.getElementById('gp-mutex-info').innerHTML = '';
    }

    if (lev.noPlan) {
      document.getElementById('gp-next').disabled = true;
      document.getElementById('gp-note').style.color = '#fca5a5';
    } else {
      document.getElementById('gp-next').disabled = false;
      document.getElementById('gp-note').style.color = 'var(--l4-light)';
    }
  }

  window.gpNext = () => {
    if (currentLevel < LEVELS.length - 1) { currentLevel++; gpRenderGraph(); }
  };
  window.gpReset = () => { currentLevel = 0; gpRenderGraph(); };

  gpRenderGraph();
}

/* ============================================================
   L5: 4×3 Grid World — Value Iteration + Q-calculator + POMDP
   ============================================================ */
function initWidgetL5() {
  const el = document.getElementById('widget-l5');
  if (!el) return;

  el.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:20px">

      <!-- Grid + sliders -->
      <div class="widget-row" style="gap:24px;align-items:flex-start">
        <div>
          <div class="widget-label">Value function V* (heatmap) &amp; Policy π*</div>
          <div class="grid-world" id="gw-grid"></div>
          <div class="mt8" style="display:flex;gap:8px">
            <button class="btn btn-red" onclick="gwNextSweep()">▶ Next sweep</button>
            <button class="btn" onclick="gwReset()">↺ Reset</button>
            <span id="gw-sweep" style="color:var(--text-muted);font-size:0.8rem;align-self:center">Sweep: 0</span>
          </div>
        </div>
        <div class="widget-col" style="min-width:220px">
          <div class="widget-label">Parameters</div>
          <div class="slider-row"><label>Living R</label><input type="range" id="sl-r" min="-2" max="0.5" step="0.01" value="-0.04" oninput="gwParamChange()"/><span class="val" id="sl-r-val">-0.04</span></div>
          <div class="slider-row"><label>Discount γ</label><input type="range" id="sl-g" min="0.1" max="1" step="0.01" value="1" oninput="gwParamChange()"/><span class="val" id="sl-g-val">1.00</span></div>
          <div class="slider-row"><label>Noise</label><input type="range" id="sl-n" min="0" max="0.4" step="0.01" value="0.1" oninput="gwParamChange()"/><span class="val" id="sl-n-val">0.10</span></div>
        </div>
      </div>

      <!-- Q-value calculator -->
      <div class="card" style="background:var(--bg3)">
        <h3 class="card-title" style="font-size:0.9rem">🧮 Q-value Calculator</h3>
        <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end">
          <div><div class="widget-label">P(s₁|s,a)</div><input id="qc-p1" type="number" value="0.6" step="0.1" min="0" max="1" style="width:70px;background:var(--bg2);border:1px solid var(--border);color:var(--text);padding:6px;border-radius:6px"/></div>
          <div><div class="widget-label">V(s₁)</div><input id="qc-v1" type="number" value="20" style="width:70px;background:var(--bg2);border:1px solid var(--border);color:var(--text);padding:6px;border-radius:6px"/></div>
          <div><div class="widget-label">V(s₂)</div><input id="qc-v2" type="number" value="5" style="width:70px;background:var(--bg2);border:1px solid var(--border);color:var(--text);padding:6px;border-radius:6px"/></div>
          <div><div class="widget-label">R (step)</div><input id="qc-r" type="number" value="-2" style="width:70px;background:var(--bg2);border:1px solid var(--border);color:var(--text);padding:6px;border-radius:6px"/></div>
          <div><div class="widget-label">γ</div><input id="qc-g" type="number" value="1" step="0.1" min="0" max="1" style="width:60px;background:var(--bg2);border:1px solid var(--border);color:var(--text);padding:6px;border-radius:6px"/></div>
          <button class="btn btn-red" onclick="calcQ()">Calculate Q</button>
        </div>
        <div class="gamma-display mt8" id="qc-result" style="min-height:48px">Fill values and click Calculate Q.</div>
      </div>

      <!-- POMDP belief updater -->
      <div class="card" style="background:var(--bg3)">
        <h3 class="card-title" style="font-size:0.9rem">👁️ POMDP Belief Updater (P→W→N)</h3>
        <div style="font-size:0.82rem;color:var(--text-muted);margin-bottom:10px">
          States: Left / Right. Prior belief b(Left)=0.6. Observation: "right". P(s\'|s,a) transition matrix, Z(o|s) observation model.
        </div>
        <div id="pomdp-steps"></div>
        <div style="display:flex;gap:8px;margin-top:10px">
          <button class="btn btn-red" id="pomdp-btn" onclick="pomdpStep()">▶ Step 1: Predict</button>
          <button class="btn" onclick="pomdpReset()">↺ Reset</button>
        </div>
      </div>
    </div>
  `;

  // ---- GRID WORLD ----
  // Layout: 3 rows × 4 cols. Row 0=top. (row,col) 0-indexed.
  // Grid: (0,3)=+1, (1,3)=-1, (1,1)=wall
  const ROWS=3, COLS=4;
  const GOAL_P = [0,3], GOAL_N = [1,3], WALL = [1,1];
  const ARROWS = ['→','↓','←','↑']; // right down left up
  const dR = [0,1,0,-1], dC = [1,0,-1,0];

  let V, sweepCount, R_live, gamma, noise;

  function isWall(r,c) { return r===WALL[0]&&c===WALL[1]; }
  function isGoalP(r,c){ return r===GOAL_P[0]&&c===GOAL_P[1]; }
  function isGoalN(r,c){ return r===GOAL_N[0]&&c===GOAL_N[1]; }
  function isTerminal(r,c){ return isGoalP(r,c)||isGoalN(r,c); }

  function gwInit() {
    R_live = parseFloat(document.getElementById('sl-r').value);
    gamma  = parseFloat(document.getElementById('sl-g').value);
    noise  = parseFloat(document.getElementById('sl-n').value);
    V = Array.from({length:ROWS}, () => Array(COLS).fill(0));
    V[GOAL_P[0]][GOAL_P[1]] = 1;
    V[GOAL_N[0]][GOAL_N[1]] = -1;
    sweepCount = 0;
  }

  function gwReward(r,c) {
    if (isGoalP(r,c)) return 1;
    if (isGoalN(r,c)) return -1;
    return R_live;
  }

  function gwTrans(r, c, a) {
    // intended + 2 side directions
    const intended = (1-noise*2);
    const side1 = noise, side2 = noise;
    const dirs = [(a+1)%4, (a+3)%4]; // sides
    function move(r,c,d) {
      const nr=r+dR[d], nc=c+dC[d];
      if (nr<0||nr>=ROWS||nc<0||nc>=COLS||isWall(nr,nc)) return [r,c];
      return [nr,nc];
    }
    const outcomes = new Map();
    function add(rc, p) { const k=rc.join(','); outcomes.set(k,(outcomes.get(k)||0)+p); }
    const [r1,c1]=move(r,c,a); add([r1,c1], intended);
    const [r2,c2]=move(r,c,dirs[0]); add([r2,c2], side1);
    const [r3,c3]=move(r,c,dirs[1]); add([r3,c3], side2);
    return outcomes;
  }

  function gwSweep() {
    const newV = V.map(row=>[...row]);
    for (let r=0;r<ROWS;r++) for (let c=0;c<COLS;c++) {
      if (isWall(r,c)||isTerminal(r,c)) continue;
      let best = -Infinity;
      for (let a=0;a<4;a++) {
        const outcomes = gwTrans(r,c,a);
        let q = 0;
        outcomes.forEach((p,[r2,c2]) => { q += p*(gwReward(r2,c2)+gamma*V[r2][c2]); });
        // actually outcomes map might be wrong — let me redo
        let qVal = 0;
        for (const [k,p] of outcomes.entries()) {
          const [nr,nc] = k.split(',').map(Number);
          qVal += p * (gwReward(nr,nc) + gamma*V[nr][nc]);
        }
        if (qVal > best) best = qVal;
      }
      newV[r][c] = Math.round(best*1000)/1000;
    }
    V = newV;
    sweepCount++;
  }

  function gwBestAction(r,c) {
    let best=-Infinity, bestA=0;
    for (let a=0;a<4;a++) {
      const outcomes = gwTrans(r,c,a);
      let qVal=0;
      for (const [k,p] of outcomes.entries()) {
        const [nr,nc]=k.split(',').map(Number);
        qVal += p*(gwReward(nr,nc)+gamma*V[nr][nc]);
      }
      if (qVal>best){best=qVal;bestA=a;}
    }
    return bestA;
  }

  function gwRenderGrid() {
    const grid = document.getElementById('gw-grid');
    if (!grid) return;
    const allV = [];
    for (let r=0;r<ROWS;r++) for (let c=0;c<COLS;c++) {
      if (!isWall(r,c)&&!isTerminal(r,c)) allV.push(V[r][c]);
    }
    const minV = Math.min(...allV), maxV = Math.max(...allV);

    let html = '';
    for (let r=0;r<ROWS;r++) for (let c=0;c<COLS;c++) {
      if (isGoalP(r,c)) {
        html += `<div class="grid-cell cell-goal-p"><div class="cell-arrow">🏆</div><div class="cell-v">+1</div></div>`;
      } else if (isGoalN(r,c)) {
        html += `<div class="grid-cell cell-goal-n"><div class="cell-arrow">☠️</div><div class="cell-v">-1</div></div>`;
      } else if (isWall(r,c)) {
        html += `<div class="grid-cell cell-wall"><div style="color:var(--text-dim);font-size:1.5rem">▓</div></div>`;
      } else {
        const v = V[r][c];
        const t = maxV === minV ? 0.5 : (v-minV)/(maxV-minV);
        const bg = `rgba(${Math.round(239*(1-t)+59*t)},${Math.round(68*(1-t)+130*t)},${Math.round(68*(1-t)+246*t)},0.4)`;
        const a = gwBestAction(r,c);
        html += `<div class="grid-cell" style="background:${bg}">
          <div class="cell-arrow">${ARROWS[a]}</div>
          <div class="cell-v">${v.toFixed(3)}</div>
        </div>`;
      }
    }
    grid.innerHTML = html;
    document.getElementById('gw-sweep').textContent = `Sweep: ${sweepCount}`;
  }

  window.gwNextSweep = () => { gwSweep(); gwRenderGrid(); };
  window.gwReset = () => { gwInit(); gwRenderGrid(); };
  window.gwParamChange = () => {
    document.getElementById('sl-r-val').textContent = parseFloat(document.getElementById('sl-r').value).toFixed(2);
    document.getElementById('sl-g-val').textContent = parseFloat(document.getElementById('sl-g').value).toFixed(2);
    document.getElementById('sl-n-val').textContent = parseFloat(document.getElementById('sl-n').value).toFixed(2);
    gwInit(); gwRenderGrid();
  };

  // ---- Q-value calculator ----
  window.calcQ = () => {
    const p1 = parseFloat(document.getElementById('qc-p1').value);
    const p2 = 1 - p1;
    const v1 = parseFloat(document.getElementById('qc-v1').value);
    const v2 = parseFloat(document.getElementById('qc-v2').value);
    const R  = parseFloat(document.getElementById('qc-r').value);
    const g  = parseFloat(document.getElementById('qc-g').value);
    const b1 = p1*(R+g*v1), b2 = p2*(R+g*v2);
    const q  = b1+b2;
    document.getElementById('qc-result').innerHTML =
      `Q(s,a) = P(s₁)·[R+γ·V(s₁)] + P(s₂)·[R+γ·V(s₂)]\n` +
      `       = ${p1}·[${R}+${g}·${v1}] + ${p2.toFixed(2)}·[${R}+${g}·${v2}]\n` +
      `       = ${p1}·${(R+g*v1).toFixed(3)} + ${p2.toFixed(2)}·${(R+g*v2).toFixed(3)}\n` +
      `       = ${b1.toFixed(3)} + ${b2.toFixed(3)}\n` +
      `       = <b>${q.toFixed(4)}</b>`;
  };

  // ---- POMDP Belief Updater ----
  // States: Left(L), Right(R). Prior: b={L:0.6, R:0.4}
  // Transition: P(L'|L,a)=0.8, P(R'|L,a)=0.2, P(L'|R,a)=0.1, P(R'|R,a)=0.9 (some action moves right)
  // Observation "right": Z(right|L)=0.2, Z(right|R)=0.8
  let pomdpStep_n = 0;
  const pomdpData = {
    bL: 0.6, bR: 0.4,
    // After predict:
    bpL: 0, bpR: 0,
    // After weigh:
    buL: 0, buR: 0,
    // After normalise:
    bnL: 0, bnR: 0,
  };

  window.pomdpReset = () => {
    pomdpStep_n = 0;
    document.getElementById('pomdp-steps').innerHTML = '';
    document.getElementById('pomdp-btn').textContent = '▶ Step 1: Predict';
    document.getElementById('pomdp-btn').disabled = false;
  };

  window.pomdpStep = () => {
    const steps = document.getElementById('pomdp-steps');
    const btn = document.getElementById('pomdp-btn');

    if (pomdpStep_n === 0) {
      // Predict
      pomdpData.bpL = 0.8*pomdpData.bL + 0.1*pomdpData.bR;
      pomdpData.bpR = 0.2*pomdpData.bL + 0.9*pomdpData.bR;
      steps.innerHTML += `
        <div class="formula-card" style="border-left:3px solid var(--l1)">
          <div class="formula-label">1️⃣ PREDICT: b̄(s\') = Σ P(s\'|s,a)·b(s)</div>
          <div class="formula-body">
            b̄(Left)  = P(L\'|L)·b(L) + P(L\'|R)·b(R) = 0.8·0.6 + 0.1·0.4 = <b>${pomdpData.bpL.toFixed(3)}</b><br>
            b̄(Right) = P(R\'|L)·b(L) + P(R\'|R)·b(R) = 0.2·0.6 + 0.9·0.4 = <b>${pomdpData.bpR.toFixed(3)}</b>
          </div>
        </div>
      `;
      btn.textContent = '▶ Step 2: Weigh';
      pomdpStep_n = 1;
    } else if (pomdpStep_n === 1) {
      // Weigh with Z(right|L)=0.2, Z(right|R)=0.8
      pomdpData.buL = 0.2 * pomdpData.bpL;
      pomdpData.buR = 0.8 * pomdpData.bpR;
      steps.innerHTML += `
        <div class="formula-card" style="border-left:3px solid var(--l3)">
          <div class="formula-label">2️⃣ WEIGH: b̃(s\') = Z(o|s\')·b̄(s\')</div>
          <div class="formula-body">
            Observation: "right" → Z(right|Left)=0.2, Z(right|Right)=0.8<br>
            b̃(Left)  = 0.2 · ${pomdpData.bpL.toFixed(3)} = <b>${pomdpData.buL.toFixed(3)}</b><br>
            b̃(Right) = 0.8 · ${pomdpData.bpR.toFixed(3)} = <b>${pomdpData.buR.toFixed(3)}</b>
          </div>
        </div>
      `;
      btn.textContent = '▶ Step 3: Normalise';
      pomdpStep_n = 2;
    } else if (pomdpStep_n === 2) {
      // Normalise
      const Z = pomdpData.buL + pomdpData.buR;
      pomdpData.bnL = pomdpData.buL / Z;
      pomdpData.bnR = pomdpData.buR / Z;
      steps.innerHTML += `
        <div class="formula-card" style="border-left:3px solid var(--l2)">
          <div class="formula-label">3️⃣ NORMALISE: b\'= b̃ / Σb̃</div>
          <div class="formula-body">
            Σ = ${pomdpData.buL.toFixed(3)} + ${pomdpData.buR.toFixed(3)} = ${Z.toFixed(3)}<br>
            b\'(Left)  = ${pomdpData.buL.toFixed(3)} / ${Z.toFixed(3)} = <b>${pomdpData.bnL.toFixed(3)}</b><br>
            b\'(Right) = ${pomdpData.buR.toFixed(3)} / ${Z.toFixed(3)} = <b>${pomdpData.bnR.toFixed(3)}</b>
          </div>
        </div>
        <div style="display:flex;gap:6px;margin-top:8px;align-items:center">
          <div class="belief-bar" style="width:${(pomdpData.bnL*200).toFixed(0)}px;background:var(--l1)">Left ${(pomdpData.bnL*100).toFixed(1)}%</div>
          <div class="belief-bar" style="width:${(pomdpData.bnR*200).toFixed(0)}px;background:var(--l5)">Right ${(pomdpData.bnR*100).toFixed(1)}%</div>
        </div>
      `;
      btn.textContent = '✅ Done';
      btn.disabled = true;
      pomdpStep_n = 3;
    }
  };

  gwInit();
  gwRenderGrid();
}
