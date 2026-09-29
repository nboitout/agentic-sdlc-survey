# Digiterre / Ascendion | Lead QA AI Interview

Static React interview questionnaire based on `lead-qa-ai-interview-questionnaire.md`.
The supplied English questionnaire replaces the previous multilingual branching survey.

## Interview flow

- Part 1: 8 MCQs, with single or multiple selections as specified in the source.
- Part 2: 8 evidence-based discussion questions with response fields.
- Part 3: 1 forward-looking leadership question.
- Interviewer view: per-question notes and follow-ups, five scored dimensions (0-4 each), indicative interpretation, and five final summary fields.

Candidate name starts blank so this can be reused for other interviews. The original named candidate remains in the source document.
Questions and options are loaded from `survey-config.json`. Follow-ups and scoring descriptions retain the supplied English wording.
The prior RO UI is no longer offered for this English replacement questionnaire.

## Run locally

```bash
python -m http.server 8000
```

Open http://localhost:8000. React and Babel load from the existing CDN dependencies.

## Recording and exporting

The interview autosaves locally under `digiterreAscendionLeadQaInterviewV1`, independently of old survey drafts.
Questions can be skipped during a live interview; review shows unanswered questions.
Selecting None clears other selections, and Other reveals a text field.
An Other selection without details counts as unanswered.
Scores remain incomplete until all five dimensions are scored; zero is a valid score.

Download the Markdown interview record to retain responses. In interviewer view, exports also include notes, scoring, and the final summary.
With interviewer view off, those assessment fields are omitted from display and export.
This view switch is a presentation control, not authentication; use your own device for private assessment notes.

## Submission integration

The interview does not POST to the legacy Azure or Google Sheets endpoints.
The existing `api/` implementation requires the previous survey version and SQL question/option catalogue.
Before restoring remote submission, provision the new `lead-qa-ai-2026-09` catalogue, configure the allowed version, and define storage for interview notes, scores, and summaries.
No remote database or deployment configuration was changed as part of this questionnaire replacement.
