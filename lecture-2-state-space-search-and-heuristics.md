# Lecture 2: State-Space Search & Delete Relaxation Heuristics — Exam Cheat Sheet

## 1. State-Space Search Directions

State-space search formulates planning as navigating a graph where nodes represent world states and edges represent actions.

```
Progression (Forward Search):  s0  ==[a1]==>  s1  ==[a2]==>  s2 ... ===> s_goal (g ⊆ s)
Regression  (Backward Search): s0 <===[a1]== g2 <==[a2]==  g1 <========== Goal g
```

### Forward Progression Search
* **Start:** Initial state $s_0$.
* **Applicability:** Action $a$ is applicable in state $s$ if $\text{precond}(a) \subseteq s$.
* **State Transition:** $s' = (s \setminus \text{effects}^-(a)) \cup \text{effects}^+(a)$.
* **Goal Check:** Search terminates when a state $s$ is reached such that $g \subseteq s$.

### Backward Regression Search
* **Start:** Goal formula $g$.
* **Relevance:** Action $a$ is relevant to subgoal set $g$ if:
  1. $\text{effects}^+(a) \cap g \neq \emptyset$ (action $a$ achieves at least one required goal fact).
  2. $\text{effects}^-(a) \cap g = \emptyset$ (action $a$ does not delete any required goal fact).
* **Regression Step:** The regressed subgoal set $g'$ is:
  $$g' = (g \setminus \text{effects}^+(a)) \cup \text{precond}(a)$$
* **Termination Check:** Search terminates when $g' \subseteq s_0$.

---

## 2. Uninformed & Informed Search Algorithms

| Search Algorithm | OPEN List Structure | Evaluation Function $f(n)$ | Complete? | Optimal? | Exam Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BFS** (Breadth-First) | FIFO Queue | $f(n) = \text{depth}(n)$ | **Yes** | **Only if unit costs** | Finds shortest step plan, NOT cheapest cost plan when costs vary. |
| **DFS** (Depth-First) | LIFO Stack | $f(n) = -\text{depth}(n)$ | **No** | **No** | Can get trapped in infinite paths; minimal memory footprint. |
| **UCS** (Uniform-Cost) | Priority Queue | $f(n) = g(n)$ | **Yes** (if $c(a) > 0$) | **Yes** | Equivalent to Dijkstra's algorithm; expands nodes by increasing path cost $g(n)$. |
| **GBFS** (Greedy Best-First)| Priority Queue | $f(n) = h(n)$ | **No** | **No** | Purely guided by heuristic estimation; fast but prone to suboptimal loops. |
| **A* Search** | Priority Queue | $f(n) = g(n) + h(n)$ | **Yes** (if $c(a) > 0$) | **Yes** (if $h$ admissible) | Minimizes total estimated cost. If $h(n) = 0$, A* reduces exactly to **UCS**. |

---

## 3. Heuristic Properties: Admissibility & Consistency

### Admissibility (Optimistic Estimator)
A heuristic $h(n)$ is admissible if it never overestimates the true minimal cost $h^*(n)$ to reach the goal:
$$0 \le h(n) \le h^*(n) \quad \forall n$$
* Guarantee: Admissibility guarantees A* tree search produces optimal solutions.

### Consistency / Monotonicity
A heuristic $h(n)$ is consistent if, for every transition $n \xrightarrow{a} n'$, it satisfies the triangle inequality:
$$h(n) \le c(n, a, n') + h(n') \quad \text{and} \quad h(\text{goal}) = 0$$
* Guarantee: Consistency guarantees that $f(n)$ is non-decreasing along any path, ensuring optimal execution for A* graph search without re-opening nodes in CLOSED.
* Relationship: Every consistent heuristic is admissible ($h_{\text{consistent}} \implies h_{\text{admissible}}$).

---

## 4. Delete Relaxation Heuristics ($h^+$, $h_{\max}$, $h_{\text{add}}$, $h_{\text{FF}}$)

Delete relaxation simplifies STRIPS problems by setting $\text{effects}^-(a) = \emptyset$ for all actions. Once a fact becomes true, it remains true forever.

```
Delete-Relaxed Heuristic Spectrum:
------------------------------------------------------------------------------------>
h_max (Admissible, Underestimates) <--- h+ (Optimal Relaxed, NP-Hard) ---> h_add & h_FF (Inadmissible)
```

### 1. Optimal Relaxed Heuristic ($h^+$)
* Defines the exact shortest plan length in the delete-relaxed problem.
* $h^+(s)$ is strictly **admissible** ($h^+(s) \le h^*(s)$).
* Computing $h^+(s)$ is **NP-hard**; hence practical planners use polynomial-time approximations ($h_{\max}, h_{\text{add}}, h_{\text{FF}}$).

### 2. Max Heuristic ($h_{\max}$)
$$h_{\max}(p, s) = \begin{cases} 0 & \text{if } p \in s \\ \min_{a \in \text{achievers}(p)} \left[ c(a) + \max_{q \in \text{precond}(a)} h_{\max}(q, s) \right] & \text{otherwise} \end{cases}$$
* **Admissibility:** **ADMISSIBLE** ($h_{\max}(s) \le h^+(s) \le h^*(s)$).
* **Behavior:** Takes the maximum cost among subgoals; ignores positive goal interactions and sub-goal overlaps.

### 3. Additive Heuristic ($h_{\text{add}}$)
$$h_{\text{add}}(p, s) = \begin{cases} 0 & \text{if } p \in s \\ \min_{a \in \text{achievers}(p)} \left[ c(a) + \sum_{q \in \text{precond}(a)} h_{\text{add}}(q, s) \right] & \text{otherwise} \end{cases}$$
* **Admissibility:** **NOT ADMISSIBLE** (Inadmissible).
* **Behavior:** Assumes subgoals are independent and sums their costs. Overestimates when actions support multiple goals simultaneously.

### 4. Fast-Forward Heuristic ($h_{\text{FF}}$)
1. Constructs the delete-relaxed planning graph.
2. Performs backward regression to extract a relaxed plan $\pi_{\text{relaxed}}$.
3. Returns $h_{\text{FF}}(s) = \sum_{a \in \pi_{\text{relaxed}}} c(a)$.
* **Admissibility:** **NOT ADMISSIBLE** (Inadmissible).
* **Behavior:** Avoids overcounting shared actions present in the extracted relaxed plan, making it highly accurate for search guidance.

### 5. Gaschnig's Heuristic (8-Puzzle Domain)
* Relaxes the 8-puzzle movement rule: any tile can jump directly into the blank space from anywhere on the board in 1 step.
* **Admissibility:** **ADMISSIBLE** ($h_{\text{Gaschnig}} \le h^*$).

---

## 5. Top Exam Traps & Calculation Formulas

| Exam Question / Concept | Correct Answer | Key Reason |
| :--- | :--- | :--- |
| **Setting $h(n) = 0$ in A*** | Converts A* to **UCS** | $f(n) = g(n) + 0 = g(n)$, which orders nodes solely by accumulated path cost. |
| **BFS Optimality** | False for variable action costs | BFS only finds the minimum step count; UCS is required for variable costs. |
| **Admissibility Formula** | $h(n) \le h^*(n)$ | Must **NEVER overestimate**. Writing $h(n) \ge h^*(n)$ is FALSE. |
| **$h_{\text{add}}$ Admissibility** | Inadmissible | Overcounts shared actions when multiple subgoals require the same prerequisite action. |
| **Delete Relaxation Fact Persistence** | True | Removing delete lists means facts accumulated in state $s$ stay true permanently. |
