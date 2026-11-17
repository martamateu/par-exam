# Lecture 3: Plan-Space Planning & Flaw Resolution — Exam Cheat Sheet

## 1. Plan-Space Search vs. State-Space Search

Plan-space planning operates by searching through the space of **partial plans** rather than world states, guided by the **Least Commitment Principle**.

```
State-Space Search:   [State s0] ===(action)===> [State s1] ===(action)===> [State s2]
Plan-Space Search:    [Partial Plan π1] ===(refine)===> [Partial Plan π2] ===(refine)===> [Valid Plan π*]
```

### The Least Commitment Principle
* Planners defer decisions regarding action orderings and variable bindings until necessary.
* Avoids premature commitments that lead to combinatorial backtracking in state-space search.

---

## 2. Formal Structure of a Partial Plan

A partial plan $\pi$ is formally defined as a 4-tuple:
$$\pi = (A, \prec, B, L)$$

### 1. Actions Set ($A$)
Contains all actions included in the plan, plus two dummy actions:
* **Start Action ($a_0$):** Has no preconditions ($\text{precond}(a_0) = \emptyset$) and adds initial state facts ($\text{effects}^+(a_0) = s_0$).
* **Goal Action ($a_\infty$):** Requires goal facts as preconditions ($\text{precond}(a_\infty) = g$) and has no effects ($\text{effects}(a_\infty) = \emptyset$).
* Constraint: $a_0 \prec a_i \prec a_\infty$ for all $a_i \in A$.

### 2. Ordering Constraints ($\prec$)
A set of partial temporal ordering constraints over actions (e.g., $a_i \prec a_j$ specifies that action $a_i$ must execute before action $a_j$).

### 3. Variable Binding Constraints ($B$)
A set of equality ($x = y$) or inequality ($x \neq y$) constraints over action variables.

### 4. Causal Links ($L$)
A set of directed links of the form $a_i \xrightarrow{p} a_j$, recording that action $a_i$ generates predicate $p$ required as a precondition by action $a_j$.

---

## 3. The 4 Plan Refinement Operations

To repair plan flaws, the search algorithm applies refinement operations. **Refinements strictly add constraints/elements to the plan structure.**

```
                           +---------------------------+
                           | Plan Refinement Operations|
                           +-------------+-------------+
                                         |
     +-------------------+---------------+---------------+-------------------+
     |                   |                               |                   |
     v                   v                               v                   v
1. Add Action       2. Add Ordering                 3. Add Binding      4. Add Causal Link
   to A                to ≺                            to B                to L
```

> **CRITICAL EXAM TRAP:** Plan-space search ONLY adds elements ($A, \prec, B, L$). **NO refinement operation EVER removes an action from $A$**.

---

## 4. Flaws in Partial Plans & Repair Mechanics

A partial plan $\pi$ is a complete solution if and only if it contains **zero flaws** (no open goals and no threats).

```
Flaw Types:
1. Open Goal Flaw  : Precondition p of action a_k has no causal link supporting it.
2. Threat Flaw     : Action a_k deletes predicate p used in causal link a_i --(p)--> a_j.
```

### 1. Open Goal Flaws
* **Definition:** A precondition $p$ of action $a_k \in A$ that lacks a supporting causal link $a_i \xrightarrow{p} a_k$.
* **Repair:** Find an existing action $a_i \in A$ or instantiate a new action $a_{\text{new}}$ that achieves $p$, then add:
  1. Action $a_i$ to $A$ (if new).
  2. Causal link $a_i \xrightarrow{p} a_k$ to $L$.
  3. Ordering constraint $a_i \prec a_k$ to $\prec$.

### 2. Threat Flaws (Causal Link Interference)
An action $a_k \in A$ threatens a causal link $a_i \xrightarrow{p} a_j$ if:
1. $a_k$ deletes $p$ ($\text{effects}^-(a_k) \cap p \neq \emptyset$).
2. $a_k$ can be ordered between $a_i$ and $a_j$ without violating existing ordering constraints ($\prec \cup \{a_i \prec a_k, a_k \prec a_j\}$ is consistent).

```
Demotion:   a_k ≺ a_i ────────> a_i ──────(p)──────> a_j
Promotion:  a_i ──────(p)──────> a_j ────────> a_k
Separation: a_i ──────(p)──────> a_j  (with binding var(a_k) ≠ var(p))
```

### Threat Repair Strategies
1. **Demotion:** Force the threat $a_k$ to execute BEFORE the producer action $a_i$ by adding ordering $a_k \prec a_i$.
2. **Promotion:** Force the threat $a_k$ to execute AFTER the consumer action $a_j$ by adding ordering $a_j \prec a_k$.
3. **Separation:** Prevent $a_k$ from deleting $p$ by adding variable inequality constraints (e.g., $x \neq y$) to $B$.

---

## 5. Top Exam Traps & Conceptual Checklist

| Exam Question / Concept | Correct Answer | Key Reason |
| :--- | :--- | :--- |
| **Removing an Action from $A$** | NOT a refinement operation | Refinements strictly monotonic: they only ADD actions, orderings, bindings, or causal links. |
| **Demotion vs. Promotion** | Demotion puts threat BEFORE producer | Demotion adds $a_{\text{threat}} \prec a_{\text{producer}}$; Promotion adds $a_{\text{consumer}} \prec a_{\text{threat}}$. |
| **Solution Condition** | Open goals = 0 AND Threats = 0 | A partial plan is valid if all preconditions have causal links and all threats are resolved. |
| **Linearization** | Total order satisfying $\prec$ | A partial order plan may have multiple valid sequential linearizations. |
