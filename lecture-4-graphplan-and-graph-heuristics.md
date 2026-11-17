# Lecture 4: Graphplan & Graph-Based Heuristics — Exam Cheat Sheet

## 1. Planning Graph Architecture & Construction

Graphplan builds a polynomial-sized layered graph alternating between proposition layers ($P$) and action layers ($A$).

```
[P0: Initial Facts] ===> [A1: Actions & No-Ops] ===> [P1: Propositions] ===> [A2...] ===> [Pk: Goals]
```

### Key Elements of the Planning Graph
* **Proposition Layer ($P_j$):** Contains all facts that *could* be true at step $j$.
* **Action Layer ($A_j$):** Contains all actions whose preconditions are present in $P_{j-1}$ and are not mutex.
* **No-ops (Persistence Actions):** Fictitious actions of the form $\text{noop}(p)$ with precondition $p$ and effect $p$. They carry facts unchanged from $P_{j-1}$ to $P_j$.
* **Levelling Off:** The graph levels off when $P_{n+1} = P_n$ and $A_{n+1} = A_n$ with identical mutex relations.

---

## 2. Formal Rules of Mutual Exclusion (MUTEX)

Two actions or facts cannot occur simultaneously at the same layer if they are mutually exclusive.

```
Action Mutex Types:
1. Inconsistent Effects : Action a1 deletes an effect of action a2.
2. Interference         : Action a1 deletes a precondition of action a2.
3. Competing Needs      : Precondition of a1 and precondition of a2 are mutex in P_{j-1}.

Fact Mutex Type:
1. Inconsistent Support : EVERY action producing fact p is mutex with EVERY action producing fact q in A_j.
```

### Action Mutex Rules (Layer $A_j$)
1. **Inconsistent Effects:** Action $a_1$ deletes an effect of action $a_2$ ($\text{effects}^-(a_1) \cap \text{effects}^+(a_2) \neq \emptyset$). Example: Action $\text{Eat(Cake)}$ deletes $\text{Have(Cake)}$, while $\text{noop(Have(Cake))}$ maintains it.
2. **Interference:** Action $a_1$ deletes a precondition of action $a_2$ ($\text{effects}^-(a_1) \cap \text{precond}(a_2) \neq \emptyset$). Example: $\text{drive(A, B)}$ deletes $\text{at-truck(A)}$, required by $\text{load(A)}$.
3. **Competing Needs:** Action $a_1$ and action $a_2$ have preconditions that are mutex in layer $P_{j-1}$.

### Fact Mutex Rule (Layer $P_j$)
* **Inconsistent Support:** Fact $p$ and fact $q$ are mutex in $P_j$ if **all possible action pairs** (including no-ops) that generate $p$ and $q$ in $A_j$ are action-mutex.

> **Persistence Rule:** If a pair of facts is NOT mutex at layer $P_j$, it can **NEVER** become mutex at any subsequent layer $P_k$ ($k > j$).

---

## 3. Plan Extraction & Termination (`EXTRACT`)

Plan extraction performs backward regression search from level $k$ down to level 0.

### Algorithm Flow
1. At layer $P_j$, select a non-mutex subset of actions from $A_j$ that achieves all goals at $P_j$.
2. Regress: The preconditions of these selected actions become the new subgoals for layer $P_{j-1}$.
3. Repeat recursively for level $j-1, j-2, \dots$

> **Success Condition:** `EXTRACT` reports success **WHEN AND ONLY WHEN** it reaches level $j = 0$ and all remaining subgoals belong to the initial state $P_0$ ($\text{goals} \subseteq P_0$).

### Nogoods & Unsolvability
* **Nogoods:** If backward extraction fails at level $j$ for a set of goals, that goal set is stored in $Nogoods(j)$ to immediately prune identical failing branches in future iterations.
* **Unsolvability (No Plan Exists):** Graphplan proves no plan exists if:
  1. The graph levels off and goals remain mutex in $P_{\text{level-off}}$.
  2. After levelling off, an entire search pass fails without generating any new $Nogoods$.

### Action Execution Order within a Step
* Actions selected in the same step of a plan found by Graphplan are **pairwise non-mutex**.
* Therefore, they can be executed in **any arbitrary sequential order** or simultaneously in parallel.

---

## 4. Planning Graph Heuristics

```
Heuristic Summary Table:
| Heuristic     | Mutex-Aware? | Formula / Definition                          | Admissible? |
| :------------ | :----------- | :-------------------------------------------- | :---------- |
| max-level     | Yes          | max { level(g) : g ∈ G }                      | YES         |
| level-sum     | Yes          | ∑ { level(g) : g ∈ G }                        | NO          |
| set-level     | Yes          | Level where all G exist AND no pair is mutex  | YES         |
| h_FF          | No           | Unique action count in delete-relaxed plan    | NO          |
```

### Detailed Heuristic Characteristics
1. **`max-level`:** Finds the maximum level index where any single goal appears. Admissible. Matches $h_{\max}$ on unit-cost delete-relaxed graphs.
2. **`level-sum`:** Sums the first-appearance levels of all goals. Inadmissible because it overcounts actions shared between goals.
3. **`set-level`:** Finds the first level where all goals are present and **pairwise non-mutex**. Admissible and captures negative goal interactions.
4. **Impact of Mutex Constraints:** Moving from a delete-relaxed graph to a mutex-aware graph **raises heuristic values**, bringing estimations closer to optimal $h^*$.

---

## 5. Top Exam Traps & Conceptual Checklist

| Exam Question / Concept | Correct Answer | Key Reason |
| :--- | :--- | :--- |
| **Actions in Same Graphplan Step** | Executable in any order | Pairwise non-mutex actions do not delete each other's preconditions or effects. |
| **`EXTRACT` Success Test** | Reaches level $j=0$ with goals $\subseteq P_0$ | Success is confirmed ONLY at $j=0$, not when actions are selected at higher layers. |
| **`set-level` vs. `max-level`** | `set-level` captures goal mutexes | `max-level` ignores goal interactions; `set-level` waits until all goal pairs are non-mutex. |
| **Fact Mutex Persistence** | Once non-mutex, stays non-mutex forever | Mutex constraints strictly monotonically decrease as levels advance. |
