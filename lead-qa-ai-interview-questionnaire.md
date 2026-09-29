# Lead QA — AI Experience Interview Questionnaire

**Candidate:** Tiberiu Chiriac  
**Role:** Lead QA / QA Automation Lead  
**Purpose:** Assess practical experience using AI in software engineering and QA, with particular attention to hands-on usage, agentic workflows, engineering judgment, and the ability to lead AI adoption across a QA organization.

---

## Recommended Interview Structure

- **Part 1 — Fast MCQ baseline:** ~5 minutes
- **Part 2 — Evidence-based free-form questions:** ~15–20 minutes
- **Part 3 — Forward-looking leadership question:** ~5 minutes
- **Interviewer scoring:** completed after the discussion

The objective is not simply to determine whether the candidate has used ChatGPT, Copilot, Claude, or similar tools. The interview should distinguish between:

1. occasional AI-assisted work,
2. regular AI-assisted QA engineering,
3. structured use of AI across QA workflows,
4. genuinely agentic QA practices in which AI can execute bounded tasks, inspect results, iterate, and escalate appropriately.

---

# Part 1 — Fast MCQ Baseline

## 1. How often have you personally used generative AI for professional software or QA work during the last 6 months?

_Select one._

- [ ] Never
- [ ] Monthly
- [ ] Weekly
- [ ] Daily
- [ ] Many times per day

**Interviewer notes:**  
____________________________________________________________

---

## 2. Which AI tools have you personally used on real engineering work?

_Select all that apply._

- [ ] ChatGPT
- [ ] GitHub Copilot
- [ ] Claude
- [ ] Claude Code
- [ ] OpenAI Codex
- [ ] Cursor
- [ ] Gemini
- [ ] QA-specific AI tools
- [ ] Client-provided internal AI tools
- [ ] Other: __________________________
- [ ] None

**Interviewer notes:**  
____________________________________________________________

---

## 3. What is the most advanced way you have personally used AI?

_Select one._

- [ ] Ask questions or request explanations
- [ ] Generate or modify code
- [ ] Work with repository-level context
- [ ] AI edits multiple files and I review the changes
- [ ] AI runs commands or tests and iterates under supervision
- [ ] An automated workflow or agent executes tasks with minimal intervention

**Interviewer notes:**  
____________________________________________________________

---

## 4. Where have you used AI specifically in QA?

_Select all that apply._

- [ ] Requirements → test scenarios
- [ ] Test strategy / test design
- [ ] Generate automation code
- [ ] Maintain or refactor automated tests
- [ ] Flaky-test diagnosis
- [ ] CI/CD failure analysis
- [ ] Coverage and edge-case discovery
- [ ] Test-data generation
- [ ] Performance testing
- [ ] Release / quality reporting
- [ ] Other: __________________________
- [ ] None

**Interviewer notes:**  
____________________________________________________________

---

## 5. Has AI ever been allowed to execute tests or commands rather than simply produce text or code for you?

_Select one._

- [ ] Never
- [ ] Experiment only
- [ ] Occasionally on real tasks
- [ ] Regularly

**Interviewer notes:**  
____________________________________________________________

---

## 6. Have you used AI in a generate → run → inspect → fix → rerun loop?

_Select one._

- [ ] Never
- [ ] Experimented with it
- [ ] Used it on real tasks
- [ ] It is part of my regular working practice

**Interviewer notes:**  
____________________________________________________________

---

## 7. Have you defined team practices for AI-generated engineering artefacts?

_Select one._

- [ ] None
- [ ] Informal practices
- [ ] Documented guidelines
- [ ] Integrated into SDLC and review processes

**Interviewer notes:**  
____________________________________________________________

---

## 8. Do you measure the impact of AI on engineering or QA?

_Select one._

- [ ] No
- [ ] Anecdotally
- [ ] Some metrics
- [ ] Systematic metrics

**Interviewer notes:**  
____________________________________________________________

---

# Part 2 — Evidence-Based Free-Form Questions

## 1. What sits behind the AI claim on your CV?

> Your CV lists **AI / LLMs / AI Automation / AI Modeling** among your areas of expertise. Can you give me the strongest concrete example behind that statement?

### Follow-up prompts

- What was the problem?
- Which AI tool or model did you use?
- What did you personally do?
- What did the AI actually do?
- What artefacts did it produce or modify?
- Was the work experimental or used in a real delivery context?
- What was the measurable outcome?
- What did the AI get wrong?

### What to look for

A strong answer should quickly become concrete: repository, tooling, workflow, prompts/instructions, context provided to the model, generated artefacts, execution, review, limitations, and outcomes.

**Interviewer notes:**  
____________________________________________________________  
____________________________________________________________  
____________________________________________________________

---

## 2. Walk me through your most recent real AI-assisted QA task.

> Take the last QA task where you used AI. Walk me through it from beginning to end.

### Ask for this sequence

**Input → AI interaction → generated artefact → execution → verification → corrections → final result**

### Follow-up

> Where did the AI get something wrong, and how did you detect it?

### What to look for

Real usage normally produces specific examples of failures, corrections, poor assumptions, or limitations.

**Interviewer notes:**  
____________________________________________________________  
____________________________________________________________  
____________________________________________________________

---

## 3. Requirements → test design

> Imagine you receive a user story with fairly weak acceptance criteria. How would you use AI to turn that into a useful test strategy?

### Follow-up prompts

- How would you identify missing information?
- How would you find negative scenarios and edge cases?
- How would you account for state transitions or dependencies?
- How would you identify non-functional requirements?
- How would you keep traceability between requirements and tests?
- How would you validate AI-generated test ideas?

### Key follow-up

> How do you know the model has not simply produced ten plausible-looking but mediocre test cases?

### What to look for

The candidate should show QA judgment, not merely prompting ability.

**Interviewer notes:**  
____________________________________________________________  
____________________________________________________________  
____________________________________________________________

---

## 4. Playwright / CI failure scenario

> You inherit a Playwright suite with 800 tests. After a frontend refactoring, 60 tests fail intermittently in CI. You have Claude Code, Codex, or Copilot available. How would you use AI to investigate and resolve the problem?

### Follow-up prompts

- What information would you give the AI?
- Would you expose the entire repository or only selected context?
- How would you distinguish product defects from automation defects?
- How would you investigate selectors, timing, network calls, shared state, and environment issues?
- Would you let AI modify tests?
- Would you allow AI to run tests?
- How would you review the resulting changes?

### Key agentic question

> What would you allow the AI to do autonomously, and where would you stop it?

### What to look for

Strong answers should include bounded scope, failure clustering, logs/traces, selective execution, iterative testing, diff review, and clear limits on autonomy.

**Interviewer notes:**  
____________________________________________________________  
____________________________________________________________  
____________________________________________________________

---

## 5. Design a bounded agentic QA loop

> Suppose I ask you to build an AI agent that receives a bug fix, adds the appropriate automated test, runs the suite, fixes its test if necessary, and stops when it is green. How would you design the loop?

### Follow-up prompts

- What inputs would the agent receive?
- What commands could it execute?
- What files could it modify?
- What would the stopping conditions be?
- How many iterations would you allow?
- What should trigger escalation to a human?
- How would you prevent the agent from weakening an assertion just to make the test pass?
- What should it be prohibited from changing?
- What logs or evidence would you retain?

### What to look for

The important concepts are:

- bounded permissions,
- explicit acceptance criteria,
- protected interfaces or files,
- deterministic test commands,
- iteration limits,
- evidence collection,
- escalation rules,
- review of generated diffs.

**Interviewer notes:**  
____________________________________________________________  
____________________________________________________________  
____________________________________________________________

---

## 6. Risks of AI-generated tests

> What problems have you encountered — or would you expect — with AI-generated automated tests?

### Potential areas to explore

- Hallucinated APIs or selectors
- Weak assertions
- Tests that merely reproduce implementation details
- Happy-path bias
- Duplicate or low-value coverage
- Brittle selectors
- Excessive mocking
- Fabricated test data
- Security or privacy issues
- Tests that pass for the wrong reason
- Maintenance burden
- False confidence from syntactically correct code

### Key follow-up

> How would you put AI-generated test code through a quality gate?

### What to look for

For a Lead QA, engineering controls and validation matter more than prompt sophistication.

**Interviewer notes:**  
____________________________________________________________  
____________________________________________________________  
____________________________________________________________

---

## 7. Leading AI adoption in a QA organization

> You join a QA organization of 15 engineers. Five use AI heavily, five occasionally, and five do not use it. What would you implement during your first three months?

### Follow-up prompts

- How would you establish a baseline?
- Which use cases would you prioritize first?
- How would you choose tools?
- What guardrails would you introduce?
- How would you share successful practices?
- Would you create reusable prompts, workflows, agents, or templates?
- How would you treat client data and source-code confidentiality?
- How would you deal with engineers who are skeptical?
- How would you scale successful experiments?

### What to look for

A strong answer should move beyond simply purchasing licenses or organizing training.

A useful progression may look like:

**baseline → experiments → high-value use cases → shared practices → guardrails → reusable workflows → metrics → scaling**

**Interviewer notes:**  
____________________________________________________________  
____________________________________________________________  
____________________________________________________________

---

## 8. Measuring impact

> How would you demonstrate to me after three months that AI has actually improved the QA organization?

### Possible outcome areas

- Cycle time
- Automation throughput
- Lead time from requirement to executable tests
- Test-maintenance effort
- Flaky-test resolution time
- CI failure diagnosis time
- Coverage of important risk areas
- Escaped defects
- Review effort
- Release confidence
- Cost per automated test or workflow
- Engineer adoption
- Rework caused by poor AI output

### Key follow-up

> Which metrics would you avoid because they measure AI activity rather than engineering value?

### What to look for

The candidate should distinguish metrics such as **number of prompts** or **AI-generated lines of code** from actual engineering outcomes.

**Interviewer notes:**  
____________________________________________________________  
____________________________________________________________  
____________________________________________________________

---

# Part 3 — Forward-Looking Question

## 9. How does QA change in the age of coding agents?

> What has changed in software testing because of coding agents — not just generative AI — and what do you think a QA Lead needs to do differently over the next two years?

### Areas worth exploring

- AI increasingly generates production code as well as tests
- Specifications become more important
- Stronger acceptance criteria and invariants
- Independent verification of AI-produced artefacts
- Evaluation of generated code and tests
- Risk-based testing
- Automated test generation and maintenance
- Agent permissions and guardrails
- Observability and traceability
- Human review at critical decision points
- QA as an engineering discipline rather than a final testing phase

### What to look for

The key distinction is whether the candidate still thinks mainly in terms of:

**Human writes application → QA writes tests → AI helps write some test code**

or is moving toward:

**AI increasingly produces application and test artefacts → QA focuses more heavily on specifications, invariants, evaluation, risk, observability, and independent verification**

**Interviewer notes:**  
____________________________________________________________  
____________________________________________________________  
____________________________________________________________

---

# Interviewer Scoring Sheet

Score each dimension from **0 to 4**.

| Dimension | 0 | 1 | 2 | 3 | 4 | Score |
|---|---|---|---|---|---|---|
| **Hands-on AI use** | None | Occasional experimentation | Regular assistant use | Advanced repository-level use | Deep daily engineering use | ___ / 4 |
| **AI in QA** | None | Ad hoc experimentation | Generates tests/code | Used across several QA activities | Integrated across QA workflow | ___ / 4 |
| **Agentic experience** | None | Has heard of it | Understands the concept | Has experimented with execution loops | Uses bounded autonomous/iterative execution on real work | ___ / 4 |
| **Engineering judgment** | Trusts generated output | Limited validation | Reviews output | Uses clear validation and guardrails | Strong failure awareness, controls, escalation, and independent verification | ___ / 4 |
| **Lead capability** | Individual use only | Informal sharing | Can introduce team practices | Can define adoption framework and metrics | Can systematically transform a QA organization | ___ / 4 |

## Total

**Score: ______ / 20**

### Indicative interpretation

- **0–5:** Traditional QA leader with little AI exposure
- **6–10:** AI-aware QA engineer / lead
- **11–15:** Strong AI-assisted QA practitioner
- **16–20:** AI-native / agentic QA lead

> These ranges are interviewer guidance only. They should not be shown to the candidate during the interview.

---

# Final Interviewer Summary

## Strongest evidence of real AI experience

____________________________________________________________  
____________________________________________________________  
____________________________________________________________

## Main gaps or concerns

____________________________________________________________  
____________________________________________________________  
____________________________________________________________

## Evidence of agentic engineering experience

____________________________________________________________  
____________________________________________________________  
____________________________________________________________

## Evidence of QA leadership in an AI-enabled environment

____________________________________________________________  
____________________________________________________________  
____________________________________________________________

## Overall notes

____________________________________________________________  
____________________________________________________________  
____________________________________________________________  
____________________________________________________________
