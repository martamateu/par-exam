# Lecture 5: MDPs & Planning under Uncertainty — Exam Cheat Sheet

## 1. Markov Decision Process (MDP) Formalization

An MDP models decision-making in stochastic environments where actions have non-deterministic outcomes.

```
                    +------------------------------------+
                    |  MDP 5-Tuple: (S, A, P, R, γ)       |
                    +-----------------+------------------+
                                      |
       +------------------+-----------+-----------+------------------+
       |                  |                       |                  |
       v                  v                       v                  v
1. States (S)      2. Actions (A)         3. Transition P   4. Reward R(s,a,s')
   Finite Set         Finite Set             P(s'|s,a)         Immediate payoff
```

### The 5-Tuple Components
* $S$: Finite set of world states.
* $A$: Finite set of actions.
* $P(s' \mid s, a)$: Transition probability function yielding probability of reaching $s'$ when executing $a$ in $s$, satisfying $\sum_{s'} P(s' \mid s, a) = 1$.
* $R(s, a, s')$: Reward function returning real-valued payoff.
* $\gamma \in [0, 1)$: Discount factor balancing immediate vs. future rewards.

### Discount Factor Dynamics ($\gamma$)
* $\gamma \to 0$: **Myopic / Short-sighted agent.** Cares almost exclusively about immediate rewards $R_0$.
* $\gamma \to 1$: **Far-sighted agent.** Values long-term future rewards equally.

### Policy ($\pi$) vs. Classical Plan
* **Classical Plan:** Rigid linear sequence of actions $(a_1, a_2, \dots, a_n)$. Fails under uncertainty.
* **Policy ($\pi: S \to A$):** Universal mapping assigning an optimal action $\pi(s)$ to *every* reachable state $s \in S$.

---

## 2. Bellman Equations & Q-Values

```
Bellman Backup Tree:
                    State s
                      |
                   Action a
                   /      \
      P(s1|s,a)   /        \   P(s2|s,a)
                 v          v
              State s1   State s2
              V(s1)      V(s2)
```

### 1. Action-Value Function ($Q^\pi(s, a)$)
Computes expected return of taking action $a$ in state $s$ and thereafter following policy $\pi$:
$$Q^\pi(s, a) = \sum_{s'} P(s' \mid s, a) \left[ R(s, a, s') + \gamma V^\pi(s') \right]$$

### 2. State-Value Function ($V^\pi(s)$)
$$V^\pi(s) = Q^\pi(s, \pi(s))$$

### 3. Bellman Optimality Equation ($V^*$)
$$V^*(s) = \max_{a \in A} \sum_{s'} P(s' \mid s, a) \left[ R(s, a, s') + \gamma V^*(s') \right]$$

> **CRITICAL EXAM TRAP:** Bellman Optimality Equations are **NON-LINEAR** due to the presence of the non-linear $\max$ operator. They CANNOT be solved directly using linear matrix algebra inversion.

---

## 3. Value Iteration vs. Policy Iteration

| Feature | Value Iteration | Policy Iteration |
| :--- | :--- | :--- |
| **Primary Target** | State value vector $V(s)$ | Policy mapping $\pi(s)$ |
| **Update Step** | Synchronous Bellman backup with $\max$ operator | Policy Evaluation (Linear System) + Greedy Improvement |
| **Linearity** | Non-linear updates in every step | Policy evaluation step uses **strictly linear equations** |
| **Step Cost** | Low ($O(\|A\| \cdot \|S\|^2)$ per step) | High ($O(\|S\|^3)$ matrix inversion in evaluation) |
| **Iteration Count** | High (converges slowly to $\epsilon$) | Very low (typically converges in 2–5 iterations) |
| **Stopping Test** | $\|V_{k+1} - V_k\|_\infty < \epsilon$ | Policy stability ($\pi_{k+1}(s) = \pi_k(s) \;\forall s$) |

---

## 4. Manual Q-Value Calculation Template

### Example Problem (Exam Q#57 Setup)
* Action $a$ in $s$ has two outcomes: $s_1$ with $P(s_1 \mid s, a) = 0.9$ and $s_2$ with $P(s_2 \mid s, a) = 0.1$.
* $V(s_1) = 10$, $V(s_2) = 0$. Step reward $R = -1$, discount factor $\gamma = 1$.

```
Step 1: Write down Q-formula
        Q(s, a) = ∑ P(s'|s,a) * [ R + γ * V(s') ]

Step 2: Evaluate Branch s1
        0.9 * [ -1 + 1 * 10 ] = 0.9 * 9 = 8.1

Step 3: Evaluate Branch s2
        0.1 * [ -1 + 1 * 0  ] = 0.1 * (-1) = -0.1

Step 4: Sum Branches
        Q(s, a) = 8.1 + (-0.1) = 8.0
```

---

## 5. POMDP Belief Update Algorithm

In Partially Observable MDPs, state $s$ is hidden. The agent maintains a belief state probability distribution $b(s)$.

Upon taking action $a$ and receiving observation $o$, the belief $b'(s')$ is updated via 3 steps:

1. **Predict (State Transition Projection):**
   $$b_{\text{pred}}(s') = \sum_{s \in S} P(s' \mid s, a) \cdot b(s)$$

2. **Weigh (Observation Likelihood Weighting):**
   $$b_{\text{unnorm}}(s') = Z(o \mid s', a) \cdot b_{\text{pred}}(s')$$

3. **Normalise (Probability Distribution Re-normalization):**
   $$b'(s') = \frac{b_{\text{unnorm}}(s')}{\sum_{s'' \in S} b_{\text{unnorm}}(s'')}$$

---

## 6. Top Exam Traps & Conceptual Checklist

| Exam Question / Concept | Correct Answer | Key Reason |
| :--- | :--- | :--- |
| **Bellman Optimality Linearity** | FALSE (Non-linear) | The $\max_a$ operator introduces non-linearity. |
| **Policy Evaluation Linearity** | TRUE (Linear) | With fixed policy $\pi(s)$, there is no $\max$ operator; it forms a linear system $V = R + \gamma P V$. |
| **Myopic Agent Discount** | $\gamma \to 0$ | Discount factor near 0 ignores future rewards beyond step 0. |
| **Q-Value Formula Subtraction** | Subtract step cost $R=-1$ | Common mistake: forgetting step cost $R$ when calculating $Q(s,a)$. |
