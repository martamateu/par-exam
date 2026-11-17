---

## tags: \[PAR, exam, practice\]

# 📝 PAR · Practice Exam (real format)

> \[\!abstract\] Format 2 h · **Part A**: 10 True/False (0.4 each) · **Part B**: 10 multiple choice (0.6 each) · no calculator. Do it on paper, **without looking at the summary**, then check the solutions at the bottom.

---

## Part A · True / False

**1\.** Under the closed-world assumption, a fact that does not appear in the state list is considered false. (T/F)

**2\.** In PDDL, the **domain** file declares the objects, the initial state and the goal; the **problem** file declares the actions. (T/F)

**3\.** In DFS with a stack, if successors S1, S2, S3 are pushed in that order, the first one to be expanded is S3. (T/F)

**4\.** When evaluating a fixed policy in an MDP, you must take the maximum over actions at every state. (T/F)

**5\.** The heuristic h\_add is admissible. (T/F)

**6\.** A causal link a –p→ b implies that a is ordered before b. (T/F)

**7\.** *Promotion* resolves a threat by adding c ≺ a, where a is the producer of the link. (T/F)

**8\.** In Graphplan, a no-op can delete facts from the previous layer. (T/F)

**9\.** If the planning graph levels off and the goals are still mutex, Graphplan concludes there is no plan. (T/F)

**10\.** In a Markov system with γ \= 0, the value of every state is its immediate reward R(s). (T/F)

---

## Part B · Multiple choice (exactly one correct)

**11\.** Blocks World. State: `On(A,B)`, `Clear(A)`, `OnTable(B)`, `OnTable(C)`, `Clear(C)`, `ArmEmpty`. Preconditions: pickup(x): Clear(x), OnTable(x), ArmEmpty. unstack(x,y): On(x,y), Clear(x), ArmEmpty. Which actions are applicable?

- A) pickup(A) and pickup(C)  
- B) pickup(C) and unstack(A,B)  
- C) unstack(A,B) only  
- D) pickup(B) and unstack(A,B)

**12\.** s \= {P, Q, R, T}. Action a has pre \= {Q}, add \= {S}, del \= {P, T}. What is the resulting state?

- A) {Q, R, S}  
- B) {P, Q, R, S, T}  
- C) {R, S}  
- D) {Q, R, S, T}

**13\.** OPEN holds A (g=3, h=6), B (g=5, h=2), C (g=2, h=8), D (g=7, h=1). Which node does A\* expand next?

- A) A  
- B) B  
- C) C  
- D) D

**14\.** Goal facts p, q, r cost 3, 1 and 5 under the delete relaxation (each one alone). What are h\_max and h\_add?

- A) h\_max \= 5, h\_add \= 9  
- B) h\_max \= 9, h\_add \= 5  
- C) h\_max \= 5, h\_add \= 5  
- D) h\_max \= 3, h\_add \= 9

**15\.** A partial plan has 4 actions a, b, c, d whose only ordering constraints are a ≺ b and c ≺ d. How many linearizations does it have?

- A) 4  
- B) 6  
- C) 8  
- D) 12

**16\.** Causal link a –p→ b. Action c deletes p, and the plan **already contains** b ≺ c. What happens?

- A) Demotion must be applied  
- B) Promotion must be applied  
- C) There is no threat: c happens after b  
- D) The plan is inconsistent

**17\.** Graphplan. P0 \= {x, y} (no mutex). m: pre {x}, add {z}, del {y}. n: pre {y}, add {w}. Why are m and n mutex in A1?

- A) Interference: m deletes a precondition of n  
- B) Inconsistent effects  
- C) Competing needs  
- D) They are not mutex

**18\.** Three goals first appear at levels 2, 3 and 0 of the planning graph. What are max-level and level-sum?

- A) 3 and 5  
- B) 5 and 3  
- C) 3 and 3  
- D) 2 and 5

**19\.** From s, action a leads to s1 (prob 0.6, V=20) and to s2 (prob 0.4, V=5). Every move gives R \= −2, γ \= 1\. What is Q(s, a)?

- A) 12  
- B) 14  
- C) 12.5  
- D) 10.8

**20\.** A state gets R \= 3 and always stays in itself, with γ \= 0.9. What is its value?

- A) 3  
- B) 27  
- C) 30  
- D) 33

---

> \[\!success\]- ✅ SOLUTIONS (open only when you finish)  
>   
> **Part A**  
> 

> 1. **T**. What is not listed is false.  
> 2. **F**. Reversed: the domain has predicates and actions; the problem has objects, init and goal.  
> 3. **T**. LIFO stack: the last pushed comes out first.  
> 4. **F**. No max: the policy already chose the action. V^π(s)=Q(s,π(s)).  
> 5. **F**. h\_add sums costs and can overestimate; h\_max is the admissible one.  
> 6. **T**. If a produces p for b, a must come first.  
> 7. **F**. That is *demotion* (c ≺ a). Promotion is b ≺ c.  
> 8. **F**. No-ops never delete anything.  
> 9. **T**. Nothing new can happen: no plan.  
> 10. **T**. With γ \= 0 only the immediate reward counts.

>   
> **Part B** 11\. **B**. A is not on the table (pickup(A) ✗); B is not clear (pickup(B) ✗); C is clear and on the table; A is clear on B. 12\. **A**. (s − {P,T}) ∪ {S} \= {Q,R,S}. The precondition Q is **not** removed. 13\. **B**. f \= 9, 7, 10, 8 → B. (UCS would pick C by g=2; greedy D by h=1.) 14\. **A**. h\_max \= max(3,1,5) \= 5; h\_add \= 3+1+5 \= 9\. 15\. **B**. Interleave two chains of 2: 4\!/(2·2) \= 6\. 16\. **C**. If c is after b, it cannot break the link before it is consumed: no threat. 17\. **A**. m deletes y, a precondition of n. P0 has no mutexes, so no competing needs; z and w do not contradict, so no inconsistent effects. 18\. **A**. max-level \= 3; level-sum \= 2+3+0 \= 5\. 19\. **A**. 0.6·(−2+20) \+ 0.4·(−2+5) \= 10.8 \+ 1.2 \= 12\. (14 forgets R; 12.5 averages without weights; 10.8 forgets s2.) 20\. **C**. V \= 3 / (1 − 0.9) \= 30\.