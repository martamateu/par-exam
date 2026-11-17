# Lecture 1: Classical Planning & PDDL — Exam Cheat Sheet

## 1. Classical State-Transition Model

Automated planning models the world as a formal state-transition system $\Sigma = (S, A, \gamma)$, where:
* $S$ is the finite set of all possible world states.
* $A$ is the finite set of available actions.
* $\gamma: S \times A \to S$ is the state transition function.

> **Key Exam Property:** The transition function $\gamma(s, a)$ is a **deterministic partial function**. It is partial because an action $a$ is defined and executable only in states $s$ where its preconditions are fully satisfied. It is deterministic because applying $a$ to state $s$ yields exactly one deterministic successor state $s'$.

### The 8 Postulates of Classical Planning
1. **Finite State Space:** The set of states $S$ is finite.
2. **Fully Observable:** The agent has complete and accurate information about the current state $s \in S$.
3. **Deterministic:** Executing an action $a$ in state $s$ leads to a single, predictable outcome state $\gamma(s, a)$.
4. **Static Environment:** The world changes only through actions executed by the agent (no exogenous events or dynamic environment changes).
5. **Restricted Goals:** Goals are specified as a explicit set of target states $S_g \subseteq S$ or a logical goal formula $g$ that must be reached.
6. **Discrete Time:** Actions occur instantaneously at discrete steps.
7. **Sequential Execution:** Actions are executed one after another in a linear sequence (or in non-interfering parallel steps).
8. **Offline Planning:** The planner computes the complete plan prior to executing the first action.

---

## 2. STRIPS Representation & Closed-World Assumption

STRIPS (STanford Research Institute Problem Solver) represents states and actions using first-order predicates and propositional logic.

### State Representation
* A state $s$ is represented as a finite set of positive ground atomic facts (e.g., $s = \{\text{on-table}(A), \text{clear}(A), \text{arm-empty}\}$).

> **Closed-World Assumption (CWA):** Any ground atomic fact that is not explicitly present in the state set $s$ is assumed to be **FALSE**. Consequently, states only explicitly store positive facts.

### Action Structure
An action $a$ is defined by three components:
1. $\text{precond}(a)$: The set of positive predicates that must be present in state $s$ for $a$ to be applicable.
2. $\text{effects}^+(a)$ (Add List): The set of positive predicates added to the state after executing $a$.
3. $\text{effects}^-(a)$ (Delete List): The set of predicates removed from the state after executing $a$.

### State Transition Rule
Action $a$ is applicable in state $s$ if and only if:
$$\text{precond}(a) \subseteq s$$

If applicable, the resulting successor state $s' = \gamma(s, a)$ is computed by:
$$\gamma(s, a) = (s \setminus \text{effects}^-(a)) \cup \text{effects}^+(a)$$

---

## 3. PDDL Architecture & Syntax Rules

PDDL (Planning Domain Definition Language) separates the domain physics from individual problem instances.

```
                         +-------------------------+
                         |   Domain File (.pddl)   |
                         |  - Predicates           |
                         |  - Action Schema        |
                         +------------+------------+
                                      |
                                      v
+-------------------------+      +----+-----+      +-------------------------+
|  Problem File (.pddl)   | ---> |  Planner | ---> |  Plan: (pick-up A)      |
|  - Objects              |      +----------+      |        (stack A B)      |
|  - Initial State (:init)|                        +-------------------------+
|  - Goal State (:goal)   |
+-------------------------+
```

### Domain File Components (`domain.pddl`)
* `(define (domain <domain-name>)`: Declares domain identity.
* `(:requirements :strips :typing :negative-preconditions)`: Specifies required language features.
* `(:types block location - object)`: Defines object hierarchy under typed PDDL.
* `(:predicates (on ?x ?y) (clear ?x) (arm-empty))`: Declares predicate schemas with variable parameters starting with `?`.
* `(:action <action-name>)`: Defines action parameters, preconditions, and effects.

```lisp
(:action stack
  :parameters (?x - block ?y - block)
  :precondition (and (holding ?x) (clear ?y))
  :effect (and (not (holding ?x))
               (not (clear ?y))
               (on ?x ?y)
               (clear ?x)
               (arm-empty)))
```

### Problem File Components (`problem.pddl`)
* `(define (problem <problem-name>)`: Names the problem instance.
* `(:domain <domain-name>)`: References the corresponding domain file.
* `(:objects A B C - block)`: Declares all ground objects.
* `(:init (on-table A) (on-table B) (clear A) (clear B) (arm-empty))`: Defines initial state $s_0$ listing positive ground facts only.
* `(:goal (and (on A B) (on B C)))`: Specifies target condition $g$.

---

## 4. Top Exam Traps & Conceptual Checklist

| Exam Concept / Trap | Common Misconception | Correct Theoretical Fact |
| :--- | :--- | :--- |
| **Variable Syntax** | `(clear ob)` is a variable | **FALSE.** Variables MUST start with `?` (e.g., `?ob`). Without `?`, PDDL treats `ob` as a constant object, triggering a parser error if not defined. |
| **Initial State (`:init`)** | Negative facts like `(not (on A B))` can be written in `:init` | **FALSE.** Under CWA, negative facts are never written in `:init`. Omitting a fact automatically renders it false. |
| **Action Applicability** | An action can execute if some of its preconditions are met | **FALSE.** Every predicate in $\text{precond}(a)$ must be an exact subset of state $s$. |
| **Transition Function** | $\gamma(s, a)$ is defined for all state-action pairs | **FALSE.** $\gamma$ is a **partial function** defined only when $\text{precond}(a) \subseteq s$. |
| **Deterministic World** | Actions may fail or have uncertain outcomes | **FALSE.** Classical planning assumes deterministic transitions with 100% certainty. |
