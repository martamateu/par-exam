/* ============================================================
   app.js — Tab routing, concept maps, formula cards, flashcards, traps, cheat sheet
   ============================================================ */

/* ---- TAB ROUTING ---- */
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  renderAllLectures();
  renderCheatSheet();
});

function initTabs() {
  const buttons = document.querySelectorAll('.tab-btn');
  const panels  = document.querySelectorAll('.tab-panel');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      buttons.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById('tab-' + target);
      if (panel) panel.classList.add('active');
    });
  });

  // Hamburger menu for mobile
  const ham = document.getElementById('hamburger');
  const tabs = document.querySelector('.tabs');
  if (ham) ham.addEventListener('click', () => tabs.classList.toggle('open'));
}

/* ---- RENDER ALL LECTURES ---- */
function renderAllLectures() {
  ['l1','l2','l3','l4','l5'].forEach(id => {
    renderConceptMap(id);
    renderFormulaCards(id);
    renderTraps(id);
    renderFlashcards(id);
  });
}

/* ---- CONCEPT MAPS (SVG) ---- */
const MAPS = {
  l1: `<svg viewBox="0 0 700 220" xmlns="http://www.w3.org/2000/svg" style="font-family:sans-serif">
    <!-- arrows -->
    <defs><marker id="ah1" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#3b82f6"/></marker></defs>
    <!-- nodes -->
    <rect x="10" y="80" width="130" height="52" rx="10" fill="#1e3a5f" stroke="#3b82f6" stroke-width="1.5"/>
    <text x="75" y="101" text-anchor="middle" fill="#93c5fd" font-weight="700" font-size="13">Planning Problem</text>
    <text x="75" y="119" text-anchor="middle" fill="#64748b" font-size="11">P = (Σ, s₀, g)</text>

    <rect x="200" y="20" width="130" height="52" rx="10" fill="#172e4a" stroke="#3b82f6" stroke-width="1.5"/>
    <text x="265" y="41" text-anchor="middle" fill="#93c5fd" font-weight="700" font-size="13">World Model Σ</text>
    <text x="265" y="59" text-anchor="middle" fill="#64748b" font-size="11">(S, A, γ)</text>

    <rect x="200" y="90" width="130" height="52" rx="10" fill="#172e4a" stroke="#3b82f6" stroke-width="1.5"/>
    <text x="265" y="111" text-anchor="middle" fill="#93c5fd" font-weight="700" font-size="13">STRIPS Action</text>
    <text x="265" y="129" text-anchor="middle" fill="#64748b" font-size="11">pre / add / del</text>

    <rect x="200" y="160" width="130" height="52" rx="10" fill="#172e4a" stroke="#3b82f6" stroke-width="1.5"/>
    <text x="265" y="181" text-anchor="middle" fill="#93c5fd" font-weight="700" font-size="13">CWA</text>
    <text x="265" y="199" text-anchor="middle" fill="#64748b" font-size="11">not listed = FALSE</text>

    <rect x="390" y="20" width="140" height="52" rx="10" fill="#172e4a" stroke="#3b82f6" stroke-width="1.5"/>
    <text x="460" y="41" text-anchor="middle" fill="#93c5fd" font-weight="700" font-size="13">PDDL Domain</text>
    <text x="460" y="59" text-anchor="middle" fill="#64748b" font-size="11">predicates + actions</text>

    <rect x="390" y="90" width="140" height="52" rx="10" fill="#172e4a" stroke="#3b82f6" stroke-width="1.5"/>
    <text x="460" y="111" text-anchor="middle" fill="#93c5fd" font-weight="700" font-size="13">PDDL Problem</text>
    <text x="460" y="129" text-anchor="middle" fill="#64748b" font-size="11">objects, init, goal</text>

    <rect x="390" y="160" width="140" height="52" rx="10" fill="#0d2d1e" stroke="#22c55e" stroke-width="1.5"/>
    <text x="460" y="181" text-anchor="middle" fill="#86efac" font-weight="700" font-size="13">Plan π</text>
    <text x="460" y="199" text-anchor="middle" fill="#64748b" font-size="11">solution, not part of P</text>

    <rect x="560" y="80" width="130" height="52" rx="10" fill="#1e3a5f" stroke="#3b82f6" stroke-width="1.5"/>
    <text x="625" y="101" text-anchor="middle" fill="#93c5fd" font-weight="700" font-size="13">γ(s,a)</text>
    <text x="625" y="119" text-anchor="middle" fill="#64748b" font-size="11">(s−del)∪add</text>

    <!-- edges -->
    <line x1="140" y1="106" x2="197" y2="52" stroke="#3b82f6" stroke-width="1.2" marker-end="url(#ah1)"/>
    <line x1="140" y1="106" x2="197" y2="116" stroke="#3b82f6" stroke-width="1.2" marker-end="url(#ah1)"/>
    <line x1="140" y1="116" x2="197" y2="186" stroke="#3b82f6" stroke-width="1.2" marker-end="url(#ah1)"/>
    <line x1="330" y1="46" x2="387" y2="46" stroke="#3b82f6" stroke-width="1.2" marker-end="url(#ah1)"/>
    <line x1="330" y1="116" x2="387" y2="116" stroke="#3b82f6" stroke-width="1.2" marker-end="url(#ah1)"/>
    <line x1="460" y1="142" x2="460" y2="157" stroke="#22c55e" stroke-width="1.2" marker-end="url(#ah1)" stroke-dasharray="4,3"/>
    <line x1="530" y1="116" x2="557" y2="116" stroke="#3b82f6" stroke-width="1.2" marker-end="url(#ah1)"/>
  </svg>`,

  l2: `<svg viewBox="0 0 700 220" xmlns="http://www.w3.org/2000/svg" style="font-family:sans-serif">
    <defs><marker id="ah2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#22c55e"/></marker></defs>
    <!-- Search loop -->
    <rect x="10" y="85" width="110" height="48" rx="10" fill="#14432a" stroke="#22c55e" stroke-width="1.5"/>
    <text x="65" y="106" text-anchor="middle" fill="#86efac" font-weight="700" font-size="12">OPEN list</text>
    <text x="65" y="124" text-anchor="middle" fill="#64748b" font-size="10">pick by rule</text>

    <rect x="175" y="85" width="110" height="48" rx="10" fill="#14432a" stroke="#22c55e" stroke-width="1.5"/>
    <text x="230" y="106" text-anchor="middle" fill="#86efac" font-weight="700" font-size="12">Goal test?</text>
    <text x="230" y="124" text-anchor="middle" fill="#64748b" font-size="10">when taken from OPEN</text>

    <rect x="340" y="85" width="110" height="48" rx="10" fill="#14432a" stroke="#22c55e" stroke-width="1.5"/>
    <text x="395" y="106" text-anchor="middle" fill="#86efac" font-weight="700" font-size="12">CLOSED</text>
    <text x="395" y="124" text-anchor="middle" fill="#64748b" font-size="10">expand successors</text>

    <rect x="175" y="10" width="110" height="48" rx="10" fill="#0d2d1e" stroke="#86efac" stroke-width="1.5"/>
    <text x="230" y="31" text-anchor="middle" fill="#86efac" font-weight="800" font-size="13">✅ PLAN</text>
    <text x="230" y="49" text-anchor="middle" fill="#64748b" font-size="10">goal reached</text>

    <line x1="120" y1="109" x2="172" y2="109" stroke="#22c55e" stroke-width="1.5" marker-end="url(#ah2)"/>
    <line x1="285" y1="109" x2="337" y2="109" stroke="#22c55e" stroke-width="1.5" marker-end="url(#ah2)"/>
    <line x1="450" y1="109" x2="510" y2="109" stroke="#22c55e" stroke-width="1.5"/>
    <line x1="510" y1="109" x2="510" y2="168" stroke="#22c55e" stroke-width="1.5"/>
    <line x1="510" y1="168" x2="65" y2="168" stroke="#22c55e" stroke-width="1.5"/>
    <line x1="65" y1="168" x2="65" y2="133" stroke="#22c55e" stroke-width="1.5" marker-end="url(#ah2)"/>
    <line x1="230" y1="85" x2="230" y2="58" stroke="#86efac" stroke-width="1.5" marker-end="url(#ah2)"/>

    <!-- Algorithm table -->
    <rect x="530" y="10" width="160" height="200" rx="10" fill="#1a1d27" stroke="#333755" stroke-width="1"/>
    <text x="610" y="30" text-anchor="middle" fill="#86efac" font-weight="700" font-size="11">Pick rule</text>
    <text x="545" y="52" fill="#86efac" font-size="10" font-weight="600">BFS</text><text x="600" y="52" fill="#64748b" font-size="10">oldest (FIFO)</text>
    <text x="545" y="72" fill="#86efac" font-size="10" font-weight="600">DFS</text><text x="600" y="72" fill="#64748b" font-size="10">newest (LIFO)</text>
    <text x="545" y="92" fill="#86efac" font-size="10" font-weight="600">UCS</text><text x="600" y="92" fill="#64748b" font-size="10">lowest g</text>
    <text x="545" y="112" fill="#86efac" font-size="10" font-weight="600">Greedy</text><text x="600" y="112" fill="#64748b" font-size="10">lowest h</text>
    <text x="545" y="132" fill="#86efac" font-size="10" font-weight="600">A*</text><text x="600" y="132" fill="#64748b" font-size="10">lowest f=g+h</text>
    <line x1="540" y1="140" x2="680" y2="140" stroke="#333755" stroke-width="1"/>
    <text x="545" y="158" fill="#86efac" font-size="10" font-weight="600">h_max</text><text x="600" y="158" fill="#86efac" font-size="10">✅ admissible</text>
    <text x="545" y="178" fill="#86efac" font-size="10" font-weight="600">h_add</text><text x="600" y="178" fill="#f87171" font-size="10">❌ not admiss.</text>
    <text x="545" y="198" fill="#86efac" font-size="10" font-weight="600">h_FF</text><text x="600" y="198" fill="#f87171" font-size="10">❌ not admiss.</text>
  </svg>`,

  l3: `<svg viewBox="0 0 700 220" xmlns="http://www.w3.org/2000/svg" style="font-family:sans-serif">
    <defs><marker id="ah3" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#f97316"/></marker>
    <marker id="ah3r" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#ef4444"/></marker></defs>

    <!-- Partial plan box -->
    <rect x="10" y="10" width="200" height="90" rx="10" fill="#4a2010" stroke="#f97316" stroke-width="1.5"/>
    <text x="110" y="32" text-anchor="middle" fill="#fdba74" font-weight="800" font-size="13">Partial Plan π</text>
    <text x="110" y="52" text-anchor="middle" fill="#fdba74" font-size="11">A: actions</text>
    <text x="110" y="68" text-anchor="middle" fill="#fdba74" font-size="11">≺: orderings  B: bindings</text>
    <text x="110" y="84" text-anchor="middle" fill="#fdba74" font-size="11">L: causal links</text>

    <!-- Flaws -->
    <rect x="10" y="130" width="90" height="60" rx="8" fill="#2d0a0a" stroke="#ef4444" stroke-width="1.5"/>
    <text x="55" y="153" text-anchor="middle" fill="#fca5a5" font-weight="700" font-size="11">Open Goal</text>
    <text x="55" y="171" text-anchor="middle" fill="#64748b" font-size="10">no causal link</text>

    <rect x="120" y="130" width="90" height="60" rx="8" fill="#2d0a0a" stroke="#ef4444" stroke-width="1.5"/>
    <text x="165" y="153" text-anchor="middle" fill="#fca5a5" font-weight="700" font-size="11">Threat</text>
    <text x="165" y="171" text-anchor="middle" fill="#64748b" font-size="10">action deletes p</text>

    <!-- Repairs -->
    <rect x="260" y="10" width="140" height="90" rx="10" fill="#1e1e3a" stroke="#f97316" stroke-width="1.5"/>
    <text x="330" y="32" text-anchor="middle" fill="#fdba74" font-weight="800" font-size="13">Repairs</text>
    <text x="330" y="52" text-anchor="middle" fill="#fdba74" font-size="11">Demotion: c ≺ a</text>
    <text x="330" y="68" text-anchor="middle" fill="#fdba74" font-size="11">Promotion: b ≺ c</text>
    <text x="330" y="84" text-anchor="middle" fill="#fdba74" font-size="11">Separation: x≠y</text>

    <!-- Causal link visual -->
    <rect x="440" y="40" width="60" height="36" rx="8" fill="#1a0a00" stroke="#f97316" stroke-width="1.5"/>
    <text x="470" y="63" text-anchor="middle" fill="#fdba74" font-size="12" font-weight="700">a</text>
    <line x1="503" y1="58" x2="560" y2="58" stroke="#f97316" stroke-width="2" marker-end="url(#ah3)"/>
    <text x="532" y="50" text-anchor="middle" fill="#fdba74" font-size="11">p</text>
    <rect x="563" y="40" width="60" height="36" rx="8" fill="#1a0a00" stroke="#f97316" stroke-width="1.5"/>
    <text x="593" y="63" text-anchor="middle" fill="#fdba74" font-size="12" font-weight="700">b</text>
    <text x="533" y="98" text-anchor="middle" fill="#f97316" font-size="10" font-weight="700">causal link a─p→b</text>

    <!-- Threat actor c -->
    <rect x="503" y="140" width="60" height="36" rx="8" fill="#2d0a0a" stroke="#ef4444" stroke-width="1.5"/>
    <text x="533" y="163" text-anchor="middle" fill="#fca5a5" font-size="12" font-weight="700">c</text>
    <text x="533" y="183" text-anchor="middle" fill="#ef4444" font-size="10">deletes p</text>
    <line x1="533" y1="140" x2="533" y2="78" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#ah3r)"/>
    <text x="548" y="115" fill="#ef4444" font-size="10">⚠️ THREAT</text>

    <!-- Connections -->
    <line x1="110" y1="100" x2="55" y2="128" stroke="#ef4444" stroke-width="1.2" marker-end="url(#ah3r)"/>
    <line x1="110" y1="100" x2="165" y2="128" stroke="#ef4444" stroke-width="1.2" marker-end="url(#ah3r)"/>
    <line x1="210" y1="55" x2="257" y2="55" stroke="#f97316" stroke-width="1.2" marker-end="url(#ah3)"/>
  </svg>`,

  l4: `<svg viewBox="0 0 700 220" xmlns="http://www.w3.org/2000/svg" style="font-family:sans-serif">
    <defs><marker id="ah4" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#a855f7"/></marker>
    <marker id="ahm" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#ef4444"/></marker></defs>

    <!-- P0 -->
    <rect x="10" y="60" width="90" height="100" rx="10" fill="#3b1a5a" stroke="#a855f7" stroke-width="1.5"/>
    <text x="55" y="82" text-anchor="middle" fill="#d8b4fe" font-weight="800" font-size="12">P₀</text>
    <text x="55" y="99" text-anchor="middle" fill="#d8b4fe" font-size="11">has-coin</text>
    <text x="55" y="140" text-anchor="middle" fill="#64748b" font-size="10">no mutexes!</text>

    <!-- A1 -->
    <rect x="140" y="20" width="110" height="160" rx="10" fill="#2a1240" stroke="#a855f7" stroke-width="1.5"/>
    <text x="195" y="44" text-anchor="middle" fill="#d8b4fe" font-weight="800" font-size="12">A₁</text>
    <text x="195" y="64" text-anchor="middle" fill="#d8b4fe" font-size="10">buy-tea</text>
    <text x="195" y="82" text-anchor="middle" fill="#d8b4fe" font-size="10">buy-cake</text>
    <text x="195" y="100" text-anchor="middle" fill="#64748b" font-size="10">noop(has-coin)</text>
    <line x1="150" y1="68" x2="250" y2="88" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,2"/>
    <text x="197" y="130" text-anchor="middle" fill="#ef4444" font-size="9">⚡ mutex</text>

    <!-- P1 -->
    <rect x="290" y="20" width="110" height="160" rx="10" fill="#3b1a5a" stroke="#a855f7" stroke-width="1.5"/>
    <text x="345" y="44" text-anchor="middle" fill="#d8b4fe" font-weight="800" font-size="12">P₁</text>
    <text x="345" y="64" text-anchor="middle" fill="#d8b4fe" font-size="10">has-coin</text>
    <text x="345" y="82" text-anchor="middle" fill="#d8b4fe" font-size="10">tea</text>
    <text x="345" y="100" text-anchor="middle" fill="#d8b4fe" font-size="10">cake</text>
    <line x1="315" y1="68" x2="375" y2="88" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,2"/>
    <line x1="315" y1="88" x2="375" y2="68" stroke="#ef4444" stroke-width="1" stroke-dasharray="4,2"/>
    <line x1="315" y1="85" x2="375" y2="102" stroke="#ef4444" stroke-width="1" stroke-dasharray="4,2"/>
    <text x="345" y="128" text-anchor="middle" fill="#ef4444" font-size="9">tea⚡cake⚡coin</text>

    <!-- P2 -->
    <rect x="440" y="20" width="110" height="160" rx="10" fill="#3b1a5a" stroke="#64748b" stroke-width="1.5" stroke-dasharray="6,3"/>
    <text x="495" y="44" text-anchor="middle" fill="#94a3b8" font-weight="800" font-size="12">P₂ = P₁</text>
    <text x="495" y="64" text-anchor="middle" fill="#94a3b8" font-size="10">has-coin</text>
    <text x="495" y="82" text-anchor="middle" fill="#94a3b8" font-size="10">tea</text>
    <text x="495" y="100" text-anchor="middle" fill="#94a3b8" font-size="10">cake</text>
    <text x="495" y="128" text-anchor="middle" fill="#ef4444" font-size="10">still mutex</text>

    <!-- NO PLAN -->
    <rect x="580" y="80" width="110" height="60" rx="10" fill="#2d0a0a" stroke="#ef4444" stroke-width="2"/>
    <text x="635" y="105" text-anchor="middle" fill="#fca5a5" font-weight="800" font-size="13">NO PLAN</text>
    <text x="635" y="123" text-anchor="middle" fill="#64748b" font-size="10">levelled off</text>

    <!-- arrows -->
    <line x1="100" y1="110" x2="137" y2="110" stroke="#a855f7" stroke-width="1.5" marker-end="url(#ah4)"/>
    <line x1="250" y1="110" x2="287" y2="110" stroke="#a855f7" stroke-width="1.5" marker-end="url(#ah4)"/>
    <line x1="400" y1="110" x2="437" y2="110" stroke="#a855f7" stroke-width="1.5" marker-end="url(#ah4)"/>
    <line x1="550" y1="110" x2="577" y2="110" stroke="#ef4444" stroke-width="1.5" marker-end="url(#ahm)"/>

    <!-- Heuristic legend -->
    <rect x="10" y="180" width="560" height="32" rx="6" fill="#1a1d27" stroke="#333755" stroke-width="1"/>
    <text x="20" y="200" fill="#d8b4fe" font-size="10" font-weight="700">max-level</text><text x="80" y="200" fill="#64748b" font-size="10">= max(levels) ✅</text>
    <text x="180" y="200" fill="#d8b4fe" font-size="10" font-weight="700">level-sum</text><text x="245" y="200" fill="#f87171" font-size="10">= Σ(levels) ❌</text>
    <text x="340" y="200" fill="#d8b4fe" font-size="10" font-weight="700">set-level</text><text x="400" y="200" fill="#64748b" font-size="10">= all goals non-mutex ✅</text>
  </svg>`,

  l5: `<svg viewBox="0 0 700 220" xmlns="http://www.w3.org/2000/svg" style="font-family:sans-serif">
    <defs><marker id="ah5" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#ef4444"/></marker></defs>

    <!-- State s -->
    <rect x="10" y="80" width="90" height="52" rx="10" fill="#4a1a1a" stroke="#ef4444" stroke-width="1.5"/>
    <text x="55" y="101" text-anchor="middle" fill="#fca5a5" font-weight="800" font-size="14">s</text>
    <text x="55" y="120" text-anchor="middle" fill="#64748b" font-size="11">state</text>

    <!-- Action a -->
    <rect x="150" y="80" width="80" height="52" rx="10" fill="#3a1010" stroke="#ef4444" stroke-width="1.5"/>
    <text x="190" y="101" text-anchor="middle" fill="#fca5a5" font-weight="800" font-size="13">action a</text>
    <text x="190" y="120" text-anchor="middle" fill="#64748b" font-size="10">choose</text>
    <line x1="100" y1="106" x2="147" y2="106" stroke="#ef4444" stroke-width="1.5" marker-end="url(#ah5)"/>

    <!-- Outcomes -->
    <rect x="290" y="30" width="90" height="52" rx="10" fill="#3a1010" stroke="#ef4444" stroke-width="1.5"/>
    <text x="335" y="51" text-anchor="middle" fill="#fca5a5" font-weight="800" font-size="13">s₁</text>
    <text x="335" y="69" text-anchor="middle" fill="#64748b" font-size="10">p=0.8, V=10</text>

    <rect x="290" y="130" width="90" height="52" rx="10" fill="#3a1010" stroke="#ef4444" stroke-width="1.5"/>
    <text x="335" y="151" text-anchor="middle" fill="#fca5a5" font-weight="800" font-size="13">s₂</text>
    <text x="335" y="169" text-anchor="middle" fill="#64748b" font-size="10">p=0.2, V=0</text>

    <line x1="230" y1="96" x2="287" y2="56" stroke="#ef4444" stroke-width="1.5" marker-end="url(#ah5)"/>
    <line x1="230" y1="116" x2="287" y2="156" stroke="#ef4444" stroke-width="1.5" marker-end="url(#ah5)"/>

    <!-- Formulas -->
    <rect x="420" y="10" width="270" height="60" rx="8" fill="#2d0a0a" stroke="#ef4444" stroke-width="1.5"/>
    <text x="430" y="34" fill="#fca5a5" font-weight="800" font-size="12">Q(s,a) = Σ P(s\'|s,a)·[R + γ·V(s\')]</text>
    <text x="430" y="56" fill="#64748b" font-size="11">= 0.8·(R+10) + 0.2·(R+0)</text>

    <rect x="420" y="82" width="270" height="40" rx="8" fill="#2d0a0a" stroke="#ef4444" stroke-width="1.5"/>
    <text x="430" y="102" fill="#fca5a5" font-weight="800" font-size="12">V*(s) = max_a Q(s,a)</text>
    <text x="430" y="118" fill="#64748b" font-size="10">pick best action</text>

    <rect x="420" y="134" width="270" height="40" rx="8" fill="#1a1d27" stroke="#64748b" stroke-width="1.5"/>
    <text x="430" y="154" fill="#fca5a5" font-weight="800" font-size="12">V^π(s) = Q(s, π(s))  ← no max!</text>
    <text x="430" y="170" fill="#64748b" font-size="10">policy already chose action</text>

    <rect x="420" y="184" width="270" height="30" rx="8" fill="#1a3a2a" stroke="#22c55e" stroke-width="1.5"/>
    <text x="430" y="204" fill="#86efac" font-size="11">γ=0.9, R=3, self-loop → V = 3/(1-0.9) = 30</text>
  </svg>`,
};

function renderConceptMap(id) {
  const el = document.getElementById(id + '-map');
  if (el && MAPS[id]) el.innerHTML = MAPS[id];
}

/* ---- FORMULA CARDS ---- */
function renderFormulaCards(id) {
  const container = document.getElementById(id + '-formulas');
  if (!container) return;
  const formulas = FORMULAS[id] || [];
  container.innerHTML = formulas.map(f => `
    <div class="formula-card">
      <div class="formula-label">${f.label}${f.added ? '<span class="badge-added">💡 added</span>' : ''}</div>
      <div class="formula-body">${f.body.replace(/\n/g, '<br>')}</div>
      ${f.note ? `<div class="formula-note">${f.note}</div>` : ''}
    </div>
  `).join('');
}

/* ---- TRAPS ---- */
function renderTraps(id) {
  const container = document.getElementById(id + '-traps');
  if (!container) return;
  const traps = TRAPS[id] || [];
  container.innerHTML = traps.map(t => `
    <div class="trap-item">
      <span class="trap-icon">⚠️</span>
      <span class="trap-text">${t.text}</span>
    </div>
  `).join('');
}

/* ---- FLASHCARDS (cheat sheet style) ---- */
function renderFlashcards(id) {
  const container = document.getElementById(id + '-flashcards');
  if (!container) return;
  const cards = FLASHCARDS[id] || [];
  container.innerHTML = cards.map((c, i) => `
    <div class="flashcard" onclick="this.classList.toggle('flipped')" title="Click to flip">
      <div class="fc-front">
        <div class="fc-tag">${c.tag}</div>
        <div class="fc-title">${c.title}</div>
        <div class="fc-body">${c.body}</div>
        <div class="fc-hint">tap to reveal →</div>
      </div>
      <div class="fc-back">
        <div class="fc-tag">${c.tag} · Answer</div>
        <div class="fc-answer" style="font-family:'Courier New',monospace; white-space:pre-line; font-size:0.8rem">${c.answer}</div>
        <div class="fc-hint">← tap to flip back</div>
      </div>
    </div>
  `).join('');
}

/* ---- CHEAT SHEET ---- */
function renderCheatSheet() {
  const container = document.getElementById('cheat-container');
  if (!container) return;

  container.innerHTML = `
    <div class="cheat-grid">
      ${CHEAT_PAIRS.map((p, i) => `
        <div class="cheat-pair">
          <div class="cp-correct">
            <span class="cp-text">${p.correct}</span>
          </div>
          <div class="cp-vs">vs</div>
          <div class="cp-wrong">
            <span class="cp-text">${p.wrong}</span>
          </div>
        </div>
      `).join('')}
    </div>

    <div style="padding:0 24px 24px">
      <div class="card">
        <h2 class="card-title">🎯 Exam Strategy</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px">
          ${[
            ['1', 'Answer everything', 'Wrong = 0, same as blank. Never leave blank.'],
            ['2', 'T/F trap words', 'Look for: always / never / only / guarantees.'],
            ['3', 'Compute first', 'Calculate before looking at MCQ options.'],
            ['4', 'Practice by hand', 'f-value, h_max/h_add, γ(s,a), linearizations, Q-value.'],
            ['5', 'Two options left?', 'Drop the extreme-sounding one.'],
          ].map(([n, t, d]) => `
            <div class="formula-card">
              <div class="formula-label">${n}. ${t}</div>
              <div class="formula-body" style="font-family:inherit;font-size:0.85rem">${d}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
