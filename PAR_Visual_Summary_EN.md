---

## tags: \[PAR, planning, exam, summary\]

# 🧠 PAR · Visual Summary L1–L5

> \[\!info\] Legend 📖 \= from the slides / exam guide 💡 \= pedagogical interpretation added by Claude (not from the course) ⚠️ \= classic exam trap  
>   
> \[\!abstract\] Exam: Wed 18 Nov · 11:00 · A215 · paper · 2 h **10 T/F** (0.4 each) \+ **10 multiple choice** (0.6 each). Wrong \= 0 → **answer everything**. No calculator.

---

# 1️⃣ L1 · Classical Planning & PDDL

## 🗺️ The idea in one picture

```
graph LR
  s0((s0 initial)) -->|a1| s1((s1))
  s1 -->|a2| g((g ✅ goal))
  s0 -->|a3| s3((s3))
  s3 -->|a4| s4((s4))
```

**A plan \= a path from the initial state to a goal state** in the state-transition graph. 📖

## 📦 Pieces

| Symbol | Meaning |
| :---- | :---- |
| Σ | world model (states, actions, transition) |
| **P \= (Σ, s0, g)** | the **planning problem** ⚠️ (the plan π is NOT part of it) |
| π | the **solution** (the plan) |
| planner / controller | part of the **process**, not of the problem |

## ✅ Classical assumptions 📖

`fully observable` · `deterministic` · `static` · `one action at a time` · **closed-world assumption** (anything not listed is FALSE)

## ⚙️ Applying an action (the star calculation)

```
state s      = { P, Q, R }
action a     : pre={P}  add={S}  del={Q}
applicable?  : pre ⊆ s  → yes
γ(s,a)       = (s − del) ∪ add
             = ({P,Q,R} − {Q}) ∪ {S} = {P, R, S}
```

> \[\!warning\] ⚠️ Preconditions are NOT removed automatically. Only what is in `del` is removed.

## 🧱 Blocks World (asked\!)

| Action | Preconditions | Effect |
| :---- | :---- | :---- |
| `pickup(x)` | Clear(x), OnTable(x), ArmEmpty | Holding(x) ; ¬Clear, ¬OnTable, ¬ArmEmpty (**3 deletes**) |
| `putdown(x)` | Holding(x) | OnTable, Clear, ArmEmpty ; ¬Holding |
| `stack(x,y)` | Holding(x), Clear(y) | On(x,y) ... |
| `unstack(x,y)` | On(x,y), Clear(x), ArmEmpty | Holding(x), Clear(y) ... |

```
   C        ← only C is Clear
   B        → unstack(C,B)  ✅   pickup(C) ❌ (C is not on the table)
   A        → unstack(B,A) ❌ (B is not clear)
 ─────
```

## 📝 PDDL: two files

```
DOMAIN  (define (domain blocks) ...)      PROBLEM (define (problem p1)
  :predicates                                (:domain blocks)  ← same name!
  :action pickup ?ob ...                     :objects  A B C
                                             :init  ...
                                             :goal  ...
```

- `?ob` \= **variable**. `ob` without `?` \= an **object** named ob ⚠️  
- Different `:domain` name → **error**  
- **Objects** are declared in the **problem** file, not the domain

>   
> \[\!tip\] 💡 Mnemonic **D**omain \= **D**o-rules (what can be done). **P**roblem \= **P**oints (objects, start, goal).

## 🎯 Properties

- **Sound**: every plan returned is valid.  
- **Complete**: if a plan exists, it finds one.  
- **VAL**: validates that a plan takes s0 to g.

---

# 2️⃣ L2 · Planning as Search

## 🔁 The loop (exact order\!) 📖

```
graph LR
  O[(OPEN)] -->|take node| T{goal?}
  T -- yes --> F[✅ plan]
  T -- no --> C[state → CLOSED]
  C --> E[expand]
  E -->|successors| O
```

Goal test and move to CLOSED happen **when taken from OPEN**, not when generated.

## 🧰 Who picks from OPEN

| Algorithm | Picks | Structure | Optimal | Note |
| :---- | :---- | :---- | :---- | :---- |
| **BFS** | oldest | FIFO queue | fewest actions\* | \*not cheapest if costs differ ⚠️ |
| **DFS** | newest | LIFO stack | no | push in **reverse** (S3,S2,S1 → S1 comes out) |
| **UCS** | lowest **g** | priority queue | yes if cost \> 0 | like Dijkstra |
| **Greedy** | lowest **h** | priority queue | no |  |
| **A\*** | lowest **f \= g \+ h** | priority queue | yes if h admissible |  |

> \[\!tip\] 💡 Visual trick Same loop, only **the selection rule** changes: BFS=queue · DFS=stack · UCS=g · Greedy=h · A\*=g+h.

## 🧮 A\* example (do it in 10 s)

```
OPEN:   P(g=2,h=5)  Q(g=4,h=2)  R(g=1,h=7)  S(g=6,h=1)
f=g+h:      7           6           8           7
→ A* expands Q   |  UCS → R (lowest g)  |  Greedy → S (lowest h)
```

## 📏 Admissible

`h(n) ≤ h*(n)` (never overestimates). True cost 6 → h=7 is **NOT** admissible; h=6 is; h=0 is. Duplicate in OPEN: keep the one with **lower g/f** (the worse path is discarded).

## 🔄 Progression vs Regression

- **Progression**: forward from s0. `s' = (s−del) ∪ add`  
- **Regression**: backward from goal g. **Relevant** action: adds ≥1 fact of g **and deletes none** of g.  
- 💡 Regression is harder: it works with **sets of states**.

## 🌳 Heuristics by relaxation

```
graph TD
  R[Relax the problem] --> D[Delete relaxation: once true, stays true]
  R --> P[8-puzzle]
  D --> hmax[h_max = hardest goal fact ✅ admissible]
  D --> hadd[h_add = sum of costs ❌ not admissible]
  D --> hff[h_FF = relaxed plan ❌ not admissible]
  P --> h1[h1 misplaced tiles]
  P --> h2[h2 Manhattan]
  P --> g[Gaschnig: tile jumps to blank from anywhere]
```

- Goal facts costing 1, 4, 2 → **h\_max \= 4 · h\_add \= 7**  
- 8-puzzle `1 2 3 / 4 8 _ / 7 6 5` → **h1 \= 3** (8,6,5; blank not counted), **h2 \= 5** (8→1, 6→2, 5→2)  
- Drop only "adjacent" but keep "target \= blank" → **Gaschnig**. Drop both → **h1**.

---

# 3️⃣ L3 · Plan-Space Planning (POP) & HTN

## 🧩 Node \= partial plan

`(A, ≺, B, L)` \= **A**ctions, **o**rderings, **b**indings, causal **l**inks. Always with `Start` and `Finish`.

## 🔗 Causal link and threat

```
        p
  a ━━━━━━━━▶ b      "a achieves p for b and nobody may delete it"
   \
    ╲ c  (deletes p)   ← ⚠️ THREAT
```

| Repair | Adds | Picture |
| :---- | :---- | :---- |
| **Demotion** | `c ≺ a` | `[c] → [a] ──p──▶ [b]` |
| **Promotion** | `b ≺ c` | `[a] ──p──▶ [b] → [c]` |
| **Separation** | `x ≠ y` | c deletes a different object |

> \[\!warning\] ⚠️ If `a ≺ c` already exists, demotion makes a cycle → **only promotion**. If `b ≺ c` already exists, c is after b: **not a threat**.  
>   
> \[\!tip\] 💡 Mnemonic **Pro**motion → c **pro**moted to later (b ≺ c). **De**motion → c **de**moted to earlier (c ≺ a).

## 🔧 Refinements and flaws

- **4 refinements** (they only ADD): action · ordering · binding · causal link. **Never remove an action.**  
- **Flaws**: *open goal* (precondition with no link) and *threat*.  
- **Success**: 0 flaws and consistent constraints.  
- **Least commitment**: order **only** if a causal link or a threat requires it.  
- Both state-space **and** plan-space have **sound and complete** algorithms ⚠️

## 🔢 Linearizations

```
a, b, c with only  a ≺ b   →  c before a | between a and b | after b  =  3
(3!/2 = 3)
a≺b and c≺d (two chains of 2)  →  4!/(2·2) = 6
```

## 🛒 Shopping example (asked)

`Go(HWS,SM)` deletes `At(HWS)` → threatens the link `Go(Home,HWS) –At(HWS)→ Buy(Drill,HWS)`. Links on `Sells(...)` can **never** be threatened (nobody deletes them).

## 🏗️ HTN

**Method** \= task \+ preconditions \+ **subtasks with their order**. (An operator is the one with pre/effects.)

---

# 4️⃣ L4 · Graphplan & Heuristics

## 🏢 The layered graph

```
 P0 ──▶ A1 ──▶ P1 ──▶ A2 ──▶ P2 ...
 facts  actions+no-ops  facts   (each level = 1 parallel step)
```

- **No-op(f)**: pre f, add f, **deletes nothing**. Keeps f.  
- **P0 never has mutexes** (it is a real state).

## ⚡ Action mutex (3 reasons)

| Reason | Meaning |
| :---- | :---- |
| **Inconsistent effects** | one deletes what the other adds |
| **Interference** | one deletes a **precondition** of the other |
| **Competing needs** | their preconditions are mutex in P(j−1) |

## ⚡ Fact mutex

**Inconsistent support**: **every** pair of producers is mutex. (x only from m, y only from n, m–n mutex ⇒ x–y mutex.) If one action adds both facts ⇒ they are **not** mutex. Fact mutexes **can disappear** in later layers (they decrease).

## 🪙 Example "one coin, two wishes"

```
P0 = {has-coin}
A1 = {buy-tea, buy-cake, noop(has-coin)}      buy-tea ⚡ buy-cake (interference)
P1 = {has-coin, tea, cake}   mutex: tea⚡cake, tea⚡has-coin, cake⚡has-coin
P2 = P1 (same) → graph "levels off", tea/cake still mutex  ⇒  NO PLAN
```

## 🔍 Backward extraction

```
graph RL
  G[goals at level n] --> A[pick NON-mutex actions, prefer no-ops]
  A --> P[their preconditions = goals of level n-1]
  P --> Z{level 0 and all in P0?}
  Z -- yes --> OK[✅ plan]
  Z -- no, failed --> NG[record nogood, add a level]
```

- Success **only** at level 0 with all goals in P0.  
- **Nogood**: goal set that already failed at level j → fails immediately (memoization).  
- **No plan** if the graph levels off and the goals are still mutex.  
- Actions in the same step are non-mutex ⇒ can run **in any order**.  
- Graphplan minimizes **parallel steps**, not total number of actions.

## 📐 Heuristics read from the graph

| Heuristic | Computation | Admissible? |
| :---- | :---- | :---- |
| **max-level** (= h\_max with unit cost) | highest level among the goals | ✅ |
| **level-sum** | sum of levels | ❌ |
| **set-level** | first level where goals appear together **with no mutex** | ✅ (accounts for mutexes) |
| **h\_FF** | length of a relaxed plan | ❌ |

```
Goals first appear at levels 2, 3 and 0:   max-level = 3 · level-sum = 5
Truck Goal 2: at-pkg(B) at level 3 + at-truck(A) at level 0  → level-sum = 3
```

> \[\!warning\] ⚠️ Note on the 100-question bank The bank says 6 for that example. The **professor's quiz** (more reliable) answers **3**. Go with 3\.

---

# 5️⃣ L5 · MDPs & Uncertainty

## 🎲 From plan to policy

```
Plan (classical):  Up Up Right Right Right   ← breaks if the robot slips
Policy π:          one action for EVERY state  ← reacts after a slip
```

**MDP \= (S, A, P, R, γ)** 📖 · Slip: 0.8 intended · 0.1 each side · bump \= stay.

## 🧭 The 4×3 world (R \= −0.04, γ \= 1): memorize this

```
 V*                                π*
 0.812  0.868  0.918   +1         →   →   →   +1
 0.762  ▓▓▓▓   0.660   −1         ↑   ▓   ↑   −1
 0.705  0.655  0.611  0.388       ↑   ←   ←   ←
```

- (3,1) goes **Left** (long way, away from the hole): Q=0.611 vs Up 0.593.  
- (3,2) goes Up · (4,1) goes Left.  
- Top route: **1.4 %** chance of ending in −1 · bottom route: 12.2 %.

## 🧮 The 3 formulas

```
Q(s,a)  = Σ P(s'|s,a) · [ R + γ·V(s') ]       ← tree: average over outcomes
V*(s)   = max_a Q(s,a)                         ← expectation first, THEN max
V^π(s)  = Q(s, π(s))                           ← no max (the policy already chose)
```

> \[\!tip\] 💡 Why expectation before max The **agent chooses** the action (max) but the **world chooses** the outcome (average).

## 🧪 Q example (falls often)

```
a → s1 (0.9, V=10)   s2 (0.1, V=0)    R=−1, γ=1
Q = 0.9·(−1+10) + 0.1·(−1+0) = 8.1 − 0.1 = 8
```

⚠️ Typical wrong answers: 9 (only the likely outcome) · 8.1 (forgot s2) · 8.9 (forgot R on s1).

## ⚖️ Value iteration vs Policy iteration

|  | Value iteration | Policy iteration |
| :---- | :---- | :---- |
| Works on | values V\_k | policies (+ exact values) |
| 1 iteration | one backup per state (cheap) | **solve a linear system** (expensive) |
| \# iterations | many (30 in 4×3) | few (2 in the car) |
| Stops when | values change \< ε | the policy **does not change** |
| Equation | non-linear (has max) | linear evaluation (no max) |

```
graph LR
  pi0[π0] --> ev[Evaluate V^π exactly]
  ev --> im[Improve: argmax Q]
  im -->|changed| ev
  im -->|no change| opt[✅ π* optimal]
```

⚠️ With γ \= 1, π0 must **surely reach an exit** (not "Left in column 1").

## 🏎️ Racing car (γ \= 0.5)

```
π0 = always Slow  → V = (2, 2, 0)
improve: Cool→Fast (Q=3 > 2), Warm→Slow  → π1
V^π1 = (3.5, 2.5, 0)  → improve again: no change → π* ✅
```

## ☁️ Weather system (no actions, γ \= 0.5)

```
V(WIND) = 0 + 0.5·( 0.5·V(SUN) + 0.5·V(HAIL) )
Exact: SUN 4.8 · WIND −1.6 · HAIL −11.2
```

- **γ \= 0** → V(s) \= R(s) · γ near 1 → distant future matters.  
- State that stays in itself with reward 10, γ=0.9 → V \= 10/(1−0.9) \= **100**.  
- Value iteration on a Markov system: V\_{k+1}(s) \= R(s)+γ·ΣP·V\_k(s'); each sweep looks 1 step further.

## 🎛️ What changes the policy (4×3) 📖

| Change | Effect |
| :---- | :---- |
| very negative R (−2) | hurry: even enters the hole |
| R \= −0.04 | safe route (the default) |
| R ≈ −0.01 | avoid the hole at all costs |
| **R \= \+0.5 and γ \= 0.9** | **avoids exits** (living pays more than exiting) → next to \+1 picks **Left** |
| γ \= 0.9 | short route (a detour costs more) |
| more noise | more caution |

## 👁️ POMDP: you can't see the state

`POMDP = MDP + (O, Z)` · uses a **belief b(s)** (distribution summing to 1\) instead of s.

```
Prior belief  b = (Left 0.6, Right 0.4)        Observation: "right"
1) PREDICT   b̄(Left)=0.8·0.6+0.1·0.4=0.52   b̄(Right)=0.2·0.6+0.9·0.4=0.48
2) WEIGH     Z("right"|Left)=0.2 → 0.104     Z("right"|Right)=0.8 → 0.384
3) NORMALISE ÷0.488 → b' = (0.213, 0.787)
```

> \[\!tip\] 💡 Recipe: **P**redict (P) → **W**eigh (Z) → **N**ormalise.

## 🔧 Plan execution

**Monitor → Repair → Replan.**

- Repair uses the **causal links** (L3) to know what broke.  
- FF-Replan: determinise and replan; **dangerous** if outcomes are irreversible (the hole).

---

# 🏁 Tips to pass

> \[\!success\] 🎯 Strategy  
> 

> 1. **Answer everything** (wrong \= 0, same as blank).  
> 2. **T/F**: look for trap words: *always / never / only / guarantees*.  
> 3. Calculation MCQs: **compute first, then look at the options** (distractors are typical mistakes).  
> 4. Practise **by hand** one of each: f-value, h\_max/h\_add, γ(s,a), linearizations, Q-value.  
> 5. If torn between two options, drop the one that sounds extreme.

## 🔟 Pairs that get confused

| ✅ Correct | ❌ Confusion |
| :---- | :---- |
| h\_max admissible | h\_add / level-sum admissible |
| Promotion \= b ≺ c | Promotion \= c ≺ a |
| BFS \= fewest actions | BFS \= cheapest |
| P0 has no mutex | P0 has mutexes |
| Sound \+ complete in both spaces | only state-space |
| Regression: must not delete goals | regression may delete goals |
| γ \= 0 → V \= R | γ \= 0 → V \= 0 |
| V^π has no max | V^π has max |
| Q: Σ first, max after | max first |
| π0 must reach an exit (γ=1) | π0 anything |

