# Agentic SDLC Diagnostic (Branching Survey)

A static React-based diagnostic form with branching logic:

- 11 shared core required questions
- 12 role-specific required questions for one branch only:
  - Developer
  - QA / Testing / Quality
  - Project / Product / Operations
- 1 final optional free-text comment

## Key features

- React UI with one-question-at-a-time flow
- Data-driven questionnaire config (`coreQuestions`, `branches`, `finalOptionalComment`)
- Role-based branching from Q1
- Progress indicator + Previous/Next navigation
- Validation for all required single-choice and multi-select questions
- Optional free-text question at the end
- Local persistence via `localStorage`
- Backend-friendly submission payload:
  - `role`
  - `coreAnswers`
  - `branch`
  - `branchAnswers`
  - `comment`
  - `submittedAt`
  - `metadata`

## Files

- `index.html`: page shell + React CDN bootstrap
- `app.js`: survey config, branching, UI logic
- `styles.css`: enterprise-style survey styling

## Run locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Submission behavior

- If an endpoint is provided in the form, the app sends `POST` JSON.
- If endpoint is left empty, submission is mocked locally (payload logged in browser console).
