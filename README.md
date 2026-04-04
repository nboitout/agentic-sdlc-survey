# Agentic SDLC Diagnostic (Branching Survey)

A static React-based diagnostic form with branching logic:

- 10 shared core questions
- 10 role-specific questions for one branch only:
  - Developer
  - QA / Testing / Quality
  - Project / Product / Operations

Each respondent completes exactly 20 questions.

## Key features

- React UI with one-question-at-a-time flow
- Data-driven question config (`coreQuestions` + `branches`)
- Role-based branching from Q1
- Progress indicator + Previous/Next navigation
- Review screen before submit
- Validation for required answers
- Local persistence via `localStorage`
- Backend-friendly submission payload:
  - `role`
  - `coreAnswers`
  - `branch`
  - `branchAnswers`
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

## Optional final comment

Set `ENABLE_FINAL_COMMENT = true` in `app.js` to show one optional free-text field on the review screen.
