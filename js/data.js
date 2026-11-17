/* ============================================================
   data.js — All PAR content: formulas, traps, flashcards, quiz
   ============================================================ */

/* ---- FORMULA CARDS per lecture ---- */
const FORMULAS = {
  l1: [
    { label: 'State Transition', body: 'γ(s, a) = (s − del(a)) ∪ add(a)', note: 'Only del list is removed. Preconditions are NOT removed.' },
    { label: 'Applicability', body: 'applicable(s,a)  ⟺  pre(a) ⊆ s', note: 'ALL preconditions must be in s, not just some.' },
    { label: 'Planning Problem', body: 'P = (Σ, s₀, g)  where  Σ = (S, A, γ)', note: 'The plan π is the SOLUTION, not part of the problem.' },
    { label: 'Closed World Assumption', body: 'if p ∉ s  →  p is FALSE', note: 'Never write negative facts in :init — just omit them.', added: true },
  ],
  l2: [
    { label: 'A* evaluation', body: 'f(n) = g(n) + h(n)', note: 'g = cost so far, h = estimated cost to goal.' },
    { label: 'Admissibility', body: 'h admissible  ⟺  h(n) ≤ h*(n) ∀n', note: 'h never OVERestimates the true cost.' },
    { label: 'h_max (admissible)', body: 'h_max = max{ cost(gᵢ) : gᵢ ∈ G }', note: '✅ Admissible. Takes the hardest single goal.' },
    { label: 'h_add (not admissible)', body: 'h_add = Σ{ cost(gᵢ) : gᵢ ∈ G }', note: '❌ Not admissible. Sums costs — may overestimate.' },
    { label: 'Regression step', body: "g' = (g − add(a)) ∪ pre(a)", note: 'Relevant: add(a)∩g ≠ ∅  AND  del(a)∩g = ∅', added: true },
  ],
  l3: [
    { label: 'Partial Plan 4-tuple', body: 'π = (A, ≺, B, L)', note: 'Actions, Orderings, Bindings, causal Links.' },
    { label: 'Causal Link', body: 'aᵢ ─p→ aⱼ  means  aᵢ produces p for aⱼ', note: 'Implies ordering aᵢ ≺ aⱼ. Nobody may delete p between them.' },
    { label: 'Threat Demotion', body: 'add: c ≺ aᵢ  (threat goes BEFORE producer)', note: 'Demotion → c is demoted to earlier.' },
    { label: 'Threat Promotion', body: 'add: aⱼ ≺ c  (threat goes AFTER consumer)', note: 'Promotion → c is promoted to later.' },
    { label: 'Linearizations', body: 'Two chains [a≺b] and [c≺d]  →  4!/(2·2) = 6', note: 'Formula: n! / (k₁! · k₂! · …)', added: true },
  ],
  l4: [
    { label: 'max-level heuristic', body: 'h_maxlvl = max{ level(gᵢ) : gᵢ ∈ G }', note: '✅ Admissible. First level where the hardest goal appears.' },
    { label: 'level-sum heuristic', body: 'h_lvlsum = Σ{ level(gᵢ) : gᵢ ∈ G }', note: '❌ Not admissible. Overcounts shared actions.' },
    { label: 'set-level heuristic', body: 'First level where ALL goals appear non-mutex', note: '✅ Admissible. Stricter than max-level.' },
    { label: 'Action Mutex — 3 types', body: '1. Inconsistent effects\n2. Interference\n3. Competing needs', note: 'Fact mutex: inconsistent support (every producer pair is mutex).' },
    { label: 'No-op', body: 'noop(p): pre={p}, add={p}, del={}', note: 'No-ops NEVER delete anything. Keep facts across layers.', added: true },
  ],
  l5: [
    { label: 'Q-value', body: 'Q(s,a) = Σ P(s\'|s,a) · [R + γ·V(s\')]', note: 'Expectation FIRST (average over s\'), then max for V*.' },
    { label: 'Optimal Value', body: 'V*(s) = max_a Q(s,a)', note: 'Take the best action after averaging stochastic outcomes.' },
    { label: 'Policy Value (no max!)', body: 'V^π(s) = Q(s, π(s))', note: '⚠️ No max here — policy already chose the action.' },
    { label: 'Bellman backup', body: 'V_{k+1}(s) = max_a Σ P(s\'|s,a)[R + γ·V_k(s\')]', note: 'Each sweep looks one more step ahead.' },
    { label: 'Infinite horizon', body: 'V = R / (1 − γ)   if s stays in itself', note: 'e.g. R=3, γ=0.9 → V = 3/0.1 = 30', added: true },
    { label: 'POMDP belief update', body: '1. Predict: b̄(s\') = Σ P(s\'|s,a)·b(s)\n2. Weigh:   b̃(s\') = Z(o|s\')·b̄(s\')\n3. Normalise: b\'= b̃ / Σb̃', note: 'P→W→N recipe.' },
  ],
};

/* ---- CLASSIC TRAPS per lecture ---- */
const TRAPS = {
  l1: [
    { text: '<strong>PDDL files:</strong> Domain = predicates + actions. Problem = objects + init + goal. NOT reversed.' },
    { text: '<strong>Variables in PDDL</strong> must start with <code>?</code>. Without it, it\'s a constant object.' },
    { text: '<strong>Preconditions are NOT removed</strong> by γ(s,a). Only del(a) is removed.' },
    { text: '<strong>CWA:</strong> never write negative facts in :init. Omitting = false.' },
    { text: '<strong>γ is a partial function:</strong> undefined when pre(a) ⊄ s.' },
  ],
  l2: [
    { text: '<strong>DFS push order:</strong> if S1 S2 S3 pushed in that order, S3 comes out first (LIFO).' },
    { text: '<strong>BFS = fewest steps</strong>, NOT cheapest cost. Use UCS for cheapest.' },
    { text: '<strong>h_add is NOT admissible</strong> — it sums costs and can overestimate. h_max IS admissible.' },
    { text: '<strong>Duplicate nodes in OPEN:</strong> keep the one with lower g (better path).' },
    { text: '<strong>Regression:</strong> relevant action must NOT delete any goal fact.' },
  ],
  l3: [
    { text: '<strong>Promotion = b ≺ c</strong> (threat goes AFTER consumer). Demotion = c ≺ a (threat goes BEFORE producer).' },
    { text: '<strong>Refinements only ADD</strong> to (A, ≺, B, L). Never remove an action.' },
    { text: '<strong>If a ≺ c already exists</strong>, demotion creates a cycle → only promotion is possible.' },
    { text: '<strong>If b ≺ c already exists</strong>, c is after b → NOT a threat at all.' },
    { text: '<strong>Both state-space and plan-space</strong> planners can be sound and complete.' },
  ],
  l4: [
    { text: '<strong>P0 never has mutexes</strong> — it\'s a real observed state.' },
    { text: '<strong>No-ops never delete anything.</strong> They only carry a fact forward.' },
    { text: '<strong>Fact mutex can disappear</strong> in later layers (monotonically decreasing).' },
    { text: '<strong>level-sum is NOT admissible.</strong> max-level and set-level ARE admissible.' },
    { text: '<strong>No plan:</strong> graph levels off AND goals are still mutex. Both conditions required.' },
  ],
  l5: [
    { text: '<strong>V^π has NO max</strong> — the policy already fixed the action. Only V* has max.' },
    { text: '<strong>γ = 0 → V(s) = R(s)</strong>. Only immediate reward counts. NOT V=0.' },
    { text: '<strong>Q formula order:</strong> Σ (average) first, THEN max for V*. Never max first.' },
    { text: '<strong>Policy evaluation is linear</strong> (no max). Bellman optimality is non-linear (has max).' },
    { text: '<strong>π₀ must reach an exit</strong> when γ=1 (otherwise infinite loop with negative reward).' },
  ],
};

/* ---- FLASHCARD DATA per lecture (from lecture MD files) ---- */
const FLASHCARDS = {
  l1: [
    { tag: 'L1 · Core', title: 'What is Σ?', body: 'World model (S, A, γ) — states, actions, transition.', answer: 'Σ = (S, A, γ)\nS: finite states\nA: finite actions\nγ: state-transition function (partial, deterministic)' },
    { tag: 'L1 · Core', title: '8 Classical Postulates', body: 'What assumptions does classical planning make?', answer: 'Finite, Fully Observable, Deterministic, Static, Restricted Goals, Discrete Time, Sequential, Offline Planning' },
    { tag: 'L1 · STRIPS', title: 'Action structure', body: 'Three components of a STRIPS action?', answer: 'precond(a): must hold in s\neffects+(a): add list\neffects−(a): delete list' },
    { tag: 'L1 · PDDL', title: 'Domain vs Problem file', body: 'Which file declares what in PDDL?', answer: 'DOMAIN: predicates, action schemas\nPROBLEM: objects, :init (s₀), :goal (g)\nMnemonic: Domain=Do-rules, Problem=Points' },
    { tag: 'L1 · Trap', title: 'γ(s,a) formula', body: 'How is the successor state computed?', answer: 'γ(s,a) = (s − del(a)) ∪ add(a)\n⚠️ Preconditions are NOT removed!' },
    { tag: 'L1 · Concept', title: 'CWA', body: 'What does the Closed-World Assumption mean?', answer: 'Any fact NOT listed in s is assumed FALSE.\nNever write negative facts in :init.' },
    { tag: 'L1 · Concept', title: 'Planner properties', body: 'Sound vs Complete?', answer: 'Sound: every plan returned is valid.\nComplete: if a plan exists, it finds one.\nVAL: validates that a plan goes s₀→g.' },
    { tag: 'L1 · Blocks', title: 'Blocks World Actions', body: '4 actions and their preconditions?', answer: 'pickup(x): Clear(x),OnTable(x),ArmEmpty\nputdown(x): Holding(x)\nstack(x,y): Holding(x),Clear(y)\nunstack(x,y): On(x,y),Clear(x),ArmEmpty' },
  ],
  l2: [
    { tag: 'L2 · Algorithms', title: 'Search algorithm comparison', body: 'BFS / DFS / UCS / Greedy / A* — what do they pick?', answer: 'BFS: oldest (FIFO) → fewest steps\nDFS: newest (LIFO stack)\nUCS: lowest g → optimal cost\nGreedy: lowest h → not optimal\nA*: lowest f=g+h → optimal if h admissible' },
    { tag: 'L2 · A*', title: 'When is A* optimal?', body: 'Condition for A* optimality?', answer: 'When h is ADMISSIBLE:\nh(n) ≤ h*(n) for all n\n(never overestimates true cost to goal)' },
    { tag: 'L2 · Heuristics', title: 'h_max vs h_add', body: 'Which is admissible and why?', answer: 'h_max = max(goal costs) ✅ ADMISSIBLE\nh_add = sum(goal costs) ❌ NOT admissible\n(h_add overcounts shared actions)' },
    { tag: 'L2 · Search', title: 'Progression vs Regression', body: 'Direction of search?', answer: 'Progression: forward from s₀\n  s\' = (s−del) ∪ add\nRegression: backward from goal g\n  g\' = (g−add(a)) ∪ pre(a)\n  Relevant: adds ≥1 goal fact AND deletes none' },
    { tag: 'L2 · DFS', title: 'DFS stack order', body: 'If S1 S2 S3 pushed, which comes out first?', answer: 'S3 — LIFO stack: last in, first out.\n⚠️ Classic exam trap!' },
    { tag: 'L2 · Heuristics', title: 'Delete Relaxation', body: 'What is the delete relaxation?', answer: 'Set del(a) = ∅ for all actions.\nOnce true, always true.\nEnables polynomial h_max, h_add, h_FF.' },
    { tag: 'L2 · 8-puzzle', title: 'Heuristics for 8-puzzle', body: 'h1, h2, Gaschnig?', answer: 'h1: misplaced tiles (count, not blank)\nh2: Manhattan distance sum\nGaschnig: relax "adjacent only" rule → tile jumps to blank\nAll admissible. h2 ≥ h1.' },
    { tag: 'L2 · Concept', title: 'If h=0 in A*', body: 'What algorithm does A* become?', answer: 'UCS (Uniform Cost Search)\nf = g+0 = g → orders only by path cost.' },
  ],
  l3: [
    { tag: 'L3 · Structure', title: 'Partial Plan 4-tuple', body: 'π = ?', answer: 'π = (A, ≺, B, L)\nA: actions (inc. Start, Finish)\n≺: ordering constraints\nB: variable bindings\nL: causal links aᵢ─p→aⱼ' },
    { tag: 'L3 · Links', title: 'Causal link meaning', body: 'What does aᵢ ─p→ aⱼ mean?', answer: 'aᵢ achieves p for aⱼ.\nImplies aᵢ ≺ aⱼ.\nNo action between them may delete p.' },
    { tag: 'L3 · Threats', title: 'Threat definition', body: 'When does c threaten aᵢ ─p→ aⱼ?', answer: 'c deletes p  AND\nc can be ordered between aᵢ and aⱼ\n(no existing constraint prevents it)' },
    { tag: 'L3 · Threats', title: 'Demotion vs Promotion', body: 'Which ordering does each add?', answer: 'Demotion: c ≺ aᵢ  (c goes BEFORE producer)\nPromotion: aⱼ ≺ c  (c goes AFTER consumer)\nSeparation: add binding x≠y' },
    { tag: 'L3 · Refinements', title: '4 Refinement Operations', body: 'What can POP add?', answer: '1. Add action to A\n2. Add ordering to ≺\n3. Add binding to B\n4. Add causal link to L\n⚠️ NEVER removes an action!' },
    { tag: 'L3 · Flaws', title: '2 Types of Flaws', body: 'What is a flaw in POP?', answer: '1. Open Goal: precond of some action has no causal link\n2. Threat: an action could delete a causal link\'s fact\nSolution when 0 flaws remain.' },
    { tag: 'L3 · Math', title: 'Linearizations count', body: 'a≺b and c≺d (two chains of 2)?', answer: '4! / (2! · 2!) = 24/4 = 6\nFormula for two independent chains of length k: n!/(k₁!·k₂!…)' },
    { tag: 'L3 · HTN', title: 'HTN Method vs Operator', body: 'Difference?', answer: 'Operator: pre + effects (primitive action)\nMethod: task + preconditions + SUBTASKS with order\n(decomposes compound tasks into subtasks)' },
  ],
  l4: [
    { tag: 'L4 · Structure', title: 'Planning graph layers', body: 'P₀ → A₁ → P₁ → ...?', answer: 'P₀ → A₁ → P₁ → A₂ → P₂ → ...\nPⱼ: facts that COULD be true at step j\nAⱼ: actions applicable in Pⱼ₋₁\nNo-ops carry facts forward.' },
    { tag: 'L4 · Mutex', title: '3 Action Mutex types', body: 'Why are two actions mutex?', answer: '1. Inconsistent Effects: a₁ deletes effect of a₂\n2. Interference: a₁ deletes precond of a₂\n3. Competing Needs: their preconditions are mutex in Pⱼ₋₁' },
    { tag: 'L4 · Mutex', title: 'Fact Mutex (Inconsistent Support)', body: 'When are two facts mutex?', answer: 'p and q are mutex if EVERY pair of producers\n(one for p, one for q) is action-mutex.\n⚠️ If one action adds BOTH → NOT mutex.' },
    { tag: 'L4 · No-ops', title: 'What is a no-op?', body: 'No-op(p) structure?', answer: 'noop(p): pre={p}, add={p}, del={}\nCarries p from Pⱼ₋₁ to Pⱼ.\n⚠️ No-ops NEVER delete anything.' },
    { tag: 'L4 · Heuristics', title: 'max-level vs level-sum', body: 'Admissible? Formula?', answer: 'max-level = max(levels of goals) ✅ admissible\nlevel-sum = Σ(levels of goals) ❌ not admissible\nset-level = first level all goals non-mutex ✅ admissible' },
    { tag: 'L4 · Extract', title: 'EXTRACT success condition', body: 'When does backward extraction succeed?', answer: 'ONLY when it reaches level j=0\nAND all remaining subgoals ⊆ P₀.\nNot when actions are selected at higher levels!' },
    { tag: 'L4 · No-plan', title: 'When is there NO plan?', body: 'Graphplan termination with no plan?', answer: 'Graph LEVELS OFF (Pₙ₊₁=Pₙ)\nAND goals are still mutex.\nBoth conditions needed.' },
    { tag: 'L4 · P0', title: 'P0 and mutexes', body: 'Does P0 have mutexes?', answer: 'NO. P0 is the actual initial state.\nAll facts in P0 are simultaneously true.\n⚠️ Classic trap.' },
  ],
  l5: [
    { tag: 'L5 · MDP', title: 'MDP 5-tuple', body: 'Components of an MDP?', answer: '(S, A, P, R, γ)\nS: states, A: actions\nP(s\'|s,a): transition probabilities\nR: reward function\nγ ∈ [0,1): discount factor' },
    { tag: 'L5 · Values', title: 'V* vs V^π', body: 'Key difference?', answer: 'V*(s) = max_a Q(s,a)  ← has max\nV^π(s) = Q(s, π(s))  ← NO max\n⚠️ Policy evaluation: NO max operator.' },
    { tag: 'L5 · Q-value', title: 'Q(s,a) formula', body: 'Step-by-step?', answer: 'Q(s,a) = Σ P(s\'|s,a) · [R + γ·V(s\')]\n1. For each outcome s\': compute R + γV(s\')\n2. Multiply by P(s\'|s,a)\n3. Sum all outcomes' },
    { tag: 'L5 · Discount', title: 'Effect of γ', body: 'γ→0 vs γ→1?', answer: 'γ=0: myopic, only immediate reward matters\n  V(s) = R(s)\nγ=1: far-sighted, all future equally valued\nγ=0.9, self-loop, R=3: V = 3/(1-0.9) = 30' },
    { tag: 'L5 · Iteration', title: 'Value vs Policy Iteration', body: 'Key differences?', answer: 'Value Iter: updates V, cheap per step, many iterations\nPolicy Iter: evaluates π exactly (linear system), few iterations\nBoth converge to V*, π*.' },
    { tag: 'L5 · 4x3', title: '4×3 Grid World', body: 'V* at corners (R=−0.04, γ=1)?', answer: 'Top-right: +1 (goal)\nMid-right: −1 (pit)\nTop-left: 0.812\nBottom-left: 0.705\nπ*: top row → right; col 1 → up; (3,1) → left' },
    { tag: 'L5 · POMDP', title: 'POMDP belief update', body: '3 steps P→W→N?', answer: '1. PREDICT: b̄(s\') = Σ P(s\'|s,a)·b(s)\n2. WEIGH: b̃(s\') = Z(o|s\')·b̄(s\')\n3. NORMALISE: b\'= b̃ / Σb̃' },
    { tag: 'L5 · Policy', title: 'Policy vs Plan', body: 'Classical plan vs MDP policy?', answer: 'Plan: fixed sequence (a₁,a₂,...aₙ) — breaks if world is stochastic\nPolicy π: S→A, one action for EVERY state\n→ handles unexpected outcomes' },
  ],
};

/* ---- CHEAT SHEET: 10 confusing pairs ---- */
const CHEAT_PAIRS = [
  { correct: 'h_max is admissible', wrong: 'h_add / level-sum are admissible' },
  { correct: 'Promotion = b ≺ c  (threat AFTER consumer)', wrong: 'Promotion = c ≺ a  (threat before producer)' },
  { correct: 'BFS = fewest actions (not cheapest cost)', wrong: 'BFS = cheapest cost plan' },
  { correct: 'P0 has NO mutexes (real state)', wrong: 'P0 can have mutexes' },
  { correct: 'Both state-space AND plan-space: sound + complete', wrong: 'Only state-space is sound and complete' },
  { correct: 'Regression: relevant action must NOT delete any goal fact', wrong: 'Regression may delete goal facts' },
  { correct: 'γ = 0  →  V(s) = R(s)  (immediate reward only)', wrong: 'γ = 0  →  V(s) = 0' },
  { correct: 'V^π(s) = Q(s, π(s))  — no max', wrong: 'V^π(s) has a max operator' },
  { correct: 'Q: Σ (expectation) first, THEN max for V*', wrong: 'max first, then expectation' },
  { correct: 'π₀ must surely reach an exit when γ=1', wrong: 'π₀ can be anything when γ=1' },
];

/* ---- QUIZ QUESTIONS ---- */
const QUESTIONS = [
  // Part A — True/False (weight 0.4)
  {
    id: 1, type: 'tf', weight: 0.4,
    text: 'Under the closed-world assumption, a fact that does not appear in the state list is considered false.',
    answer: true,
    explanation: 'CWA: what is not listed is assumed FALSE. States only store positive facts.',
    lecture: 'L1',
  },
  {
    id: 2, type: 'tf', weight: 0.4,
    text: 'In PDDL, the domain file declares the objects, the initial state and the goal; the problem file declares the actions.',
    answer: false,
    explanation: 'Reversed! Domain = predicates + actions. Problem = objects + :init + :goal.',
    lecture: 'L1',
  },
  {
    id: 3, type: 'tf', weight: 0.4,
    text: 'In DFS with a stack, if successors S1, S2, S3 are pushed in that order, the first one to be expanded is S3.',
    answer: true,
    explanation: 'LIFO stack: last pushed (S3) comes out first.',
    lecture: 'L2',
  },
  {
    id: 4, type: 'tf', weight: 0.4,
    text: 'When evaluating a fixed policy in an MDP, you must take the maximum over actions at every state.',
    answer: false,
    explanation: 'No max needed. V^π(s) = Q(s, π(s)). The policy already chose the action.',
    lecture: 'L5',
  },
  {
    id: 5, type: 'tf', weight: 0.4,
    text: 'The heuristic h_add is admissible.',
    answer: false,
    explanation: 'h_add sums costs and can OVERESTIMATE → not admissible. h_max is the admissible one.',
    lecture: 'L2',
  },
  {
    id: 6, type: 'tf', weight: 0.4,
    text: 'A causal link a –p→ b implies that a is ordered before b.',
    answer: true,
    explanation: 'If a produces p for b, a must execute before b. Ordering aᵢ ≺ aⱼ is implicit.',
    lecture: 'L3',
  },
  {
    id: 7, type: 'tf', weight: 0.4,
    text: 'Promotion resolves a threat by adding c ≺ a, where a is the producer of the link.',
    answer: false,
    explanation: 'That is DEMOTION (c before producer). PROMOTION adds b ≺ c (threat after consumer).',
    lecture: 'L3',
  },
  {
    id: 8, type: 'tf', weight: 0.4,
    text: 'In Graphplan, a no-op can delete facts from the previous layer.',
    answer: false,
    explanation: 'No-ops have del={}. They NEVER delete anything. They only carry facts forward.',
    lecture: 'L4',
  },
  {
    id: 9, type: 'tf', weight: 0.4,
    text: 'If the planning graph levels off and the goals are still mutex, Graphplan concludes there is no plan.',
    answer: true,
    explanation: 'Nothing new can happen after levelling off. Mutex goals = no plan exists.',
    lecture: 'L4',
  },
  {
    id: 10, type: 'tf', weight: 0.4,
    text: 'In a Markov system with γ = 0, the value of every state is its immediate reward R(s).',
    answer: true,
    explanation: 'γ=0 → future discounted to zero. V(s) = R(s) + 0·(future) = R(s).',
    lecture: 'L5',
  },

  // Part B — Multiple Choice (weight 0.6)
  {
    id: 11, type: 'mc', weight: 0.6,
    text: 'Blocks World. State: On(A,B), Clear(A), OnTable(B), OnTable(C), Clear(C), ArmEmpty. Which actions are applicable?',
    options: [
      { label: 'A', text: 'pickup(A) and pickup(C)' },
      { label: 'B', text: 'pickup(C) and unstack(A,B)' },
      { label: 'C', text: 'unstack(A,B) only' },
      { label: 'D', text: 'pickup(B) and unstack(A,B)' },
    ],
    answer: 'B',
    explanation: 'pickup(A)❌ A is not OnTable. pickup(C)✅ Clear+OnTable+ArmEmpty. unstack(A,B)✅ On(A,B)+Clear(A)+ArmEmpty. pickup(B)❌ B is not Clear.',
    lecture: 'L1',
  },
  {
    id: 12, type: 'mc', weight: 0.6,
    text: 's = {P, Q, R, T}. Action a: pre={Q}, add={S}, del={P,T}. What is γ(s,a)?',
    options: [
      { label: 'A', text: '{Q, R, S}' },
      { label: 'B', text: '{P, Q, R, S, T}' },
      { label: 'C', text: '{R, S}' },
      { label: 'D', text: '{Q, R, S, T}' },
    ],
    answer: 'A',
    explanation: '(s − {P,T}) ∪ {S} = {Q,R,S}. Precondition Q is NOT removed — only del list is removed!',
    lecture: 'L1',
  },
  {
    id: 13, type: 'mc', weight: 0.6,
    text: 'OPEN: A(g=3,h=6), B(g=5,h=2), C(g=2,h=8), D(g=7,h=1). Which node does A* expand next?',
    options: [
      { label: 'A', text: 'Node A (f=9)' },
      { label: 'B', text: 'Node B (f=7)' },
      { label: 'C', text: 'Node C (f=10)' },
      { label: 'D', text: 'Node D (f=8)' },
    ],
    answer: 'B',
    explanation: 'f values: A=9, B=7, C=10, D=8. A* picks lowest f → B(f=7). UCS picks C(g=2). Greedy picks D(h=1).',
    lecture: 'L2',
  },
  {
    id: 14, type: 'mc', weight: 0.6,
    text: 'Goal facts p, q, r cost 3, 1 and 5 (delete relaxation). What are h_max and h_add?',
    options: [
      { label: 'A', text: 'h_max=5, h_add=9' },
      { label: 'B', text: 'h_max=9, h_add=5' },
      { label: 'C', text: 'h_max=5, h_add=5' },
      { label: 'D', text: 'h_max=3, h_add=9' },
    ],
    answer: 'A',
    explanation: 'h_max = max(3,1,5) = 5. h_add = 3+1+5 = 9.',
    lecture: 'L2',
  },
  {
    id: 15, type: 'mc', weight: 0.6,
    text: 'A partial plan has 4 actions a,b,c,d. Only ordering constraints: a≺b and c≺d. How many linearizations?',
    options: [
      { label: 'A', text: '4' },
      { label: 'B', text: '6' },
      { label: 'C', text: '8' },
      { label: 'D', text: '12' },
    ],
    answer: 'B',
    explanation: 'Interleave two chains of length 2: 4!/(2!·2!) = 24/4 = 6.',
    lecture: 'L3',
  },
  {
    id: 16, type: 'mc', weight: 0.6,
    text: 'Causal link a–p→b. Action c deletes p. The plan already contains b≺c. What happens?',
    options: [
      { label: 'A', text: 'Demotion must be applied' },
      { label: 'B', text: 'Promotion must be applied' },
      { label: 'C', text: 'There is no threat: c happens after b' },
      { label: 'D', text: 'The plan is inconsistent' },
    ],
    answer: 'C',
    explanation: 'If b≺c, then c executes AFTER b. The link a─p→b is already consumed before c can delete p. No threat.',
    lecture: 'L3',
  },
  {
    id: 17, type: 'mc', weight: 0.6,
    text: 'Graphplan. P0={x,y} (no mutex). m: pre{x},add{z},del{y}. n: pre{y},add{w}. Why are m and n mutex in A1?',
    options: [
      { label: 'A', text: 'Interference: m deletes a precondition of n' },
      { label: 'B', text: 'Inconsistent effects' },
      { label: 'C', text: 'Competing needs' },
      { label: 'D', text: 'They are not mutex' },
    ],
    answer: 'A',
    explanation: 'm deletes y, which is a precondition of n → Interference. P0 has no mutexes so no competing needs. z and w don\'t contradict so no inconsistent effects.',
    lecture: 'L4',
  },
  {
    id: 18, type: 'mc', weight: 0.6,
    text: 'Three goals first appear at levels 2, 3 and 0 of the planning graph. What are max-level and level-sum?',
    options: [
      { label: 'A', text: 'max-level=3, level-sum=5' },
      { label: 'B', text: 'max-level=5, level-sum=3' },
      { label: 'C', text: 'max-level=3, level-sum=3' },
      { label: 'D', text: 'max-level=2, level-sum=5' },
    ],
    answer: 'A',
    explanation: 'max-level = max(2,3,0) = 3. level-sum = 2+3+0 = 5.',
    lecture: 'L4',
  },
  {
    id: 19, type: 'mc', weight: 0.6,
    text: 'From s, action a → s1(prob 0.6, V=20) and s2(prob 0.4, V=5). Every move: R=−2, γ=1. What is Q(s,a)?',
    options: [
      { label: 'A', text: '12' },
      { label: 'B', text: '14' },
      { label: 'C', text: '12.5' },
      { label: 'D', text: '10.8' },
    ],
    answer: 'A',
    explanation: 'Q = 0.6·(−2+20) + 0.4·(−2+5) = 0.6·18 + 0.4·3 = 10.8 + 1.2 = 12.',
    lecture: 'L5',
  },
  {
    id: 20, type: 'mc', weight: 0.6,
    text: 'A state gets R=3 and always stays in itself, with γ=0.9. What is its value?',
    options: [
      { label: 'A', text: '3' },
      { label: 'B', text: '27' },
      { label: 'C', text: '30' },
      { label: 'D', text: '33' },
    ],
    answer: 'C',
    explanation: 'V = R/(1−γ) = 3/(1−0.9) = 3/0.1 = 30.',
    lecture: 'L5',
  },
];
