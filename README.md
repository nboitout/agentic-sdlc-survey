# Agentic SDLC Diagnostic (Branching Survey, EN/FR)

Static React survey with role-based branching and bilingual English/French UI.

## Structure

- 11 shared core required questions
- 12 role-specific required questions from one selected branch:
  - Developer
  - QA / Testing / Quality
  - Project / Product / Operations
- 1 final optional free-text comment

## Key features

- EN/FR language toggle (`EN | FR`) at top-right
- Instant language switch for labels/questions/options without resetting answers
- Stable answer values (language-independent keys)
- Data-driven questionnaire config (no duplicated components)
- Required validation for single/multi-select questions
- Optional final free-text comment
- Local persistence via `localStorage`
- Backend-friendly payload:
  - `role`
  - `coreAnswers`
  - `branch`
  - `branchAnswers`
  - `comment`
  - `submittedAt`

## Run locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
