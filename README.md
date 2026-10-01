# Digiterre / Ascendion | Lead QA AI Interview

Static React interview questionnaire based on `lead-qa-ai-interview-questionnaire.md`.
The supplied English questionnaire replaces the previous multilingual branching survey.

## Interview flow

The interface follows the Social Innovation survey's staged layout, adapted for a live interview:

1. Welcome: start an interview or explicitly resume the saved record.
2. Interview details: optional candidate, interviewer and date fields.
3. Questions: a three-part section guide, compact answer cards, position indicator and independent recorded-answer count. Sections can be revisited directly; mobile Back/Next controls stay visible while scrolling.
4. Review: complete responses grouped by part, with direct editing and a return to review.
5. Interviewer assessment: five scoring dimensions and the final summary, available with Interviewer view enabled.
6. Export: explicitly choose answers only or answers plus assessment, independently of Interviewer view. New interview is available from the introduction and export screens, with confirmation before replacing the draft.

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

The interview autosaves locally under `digiterreAscendionLeadQaInterviewV1`, independently of old survey drafts. Existing version-one interview drafts remain compatible. The saved record now also includes the current stage, visited questions, explicitly skipped questions and export preference. Nothing is overwritten merely by opening the welcome screen.
Questions can be skipped during a live interview; review distinguishes recorded, skipped, unanswered and incomplete Other responses. Position and visited-question counts are separate from answer completion. Navigation moves keyboard focus to the current heading.
Selecting None clears other selections, and Other reveals a text field.
An Other selection without details counts as unanswered.
Scores remain incomplete until all five dimensions are scored; zero is a valid score.

Download the Markdown interview record to retain responses. The export screen explicitly offers **Answers only** or **Answers & interviewer assessment**. The latter includes notes, scoring and the final summary even if Interviewer view is currently off. Answers-only exports omit those fields.
With Interviewer view off, assessment fields are hidden from the question and review screens. With it on, per-question notes and guidance are expandable and scoring has its own stage.
This view switch is a presentation control, not authentication; use your own device for private assessment notes.

Drafts remain on the device after download. A blocked local save displays a warning and a direct route to export. The download confirmation reports that the file was prepared and asks the user to check browser downloads; it does not claim remote submission or verified disk storage.

## Validation and assets

Run `node --test tests/interview.test.cjs` for draft compatibility, selection rules, completion status, scoring and export checks. No build step or package installation is needed.

`interview-model.js` contains the shared draft, answer and export rules; `app.js` renders the React screens. The question catalogue and its IDs are unchanged. The locally served Source Sans 3 font matches the reference survey's typography; its license is included in `assets/fonts/OFL.txt`.

Browser validation on 2026-10-01 covered the welcome and legacy-resume flows, all 17 question screens, None/Other selection rules, explicit skipping, section jumps, answer and identity edits from review, expandable notes, zero-score completion, draft recovery after reload, keyboard selection, and reset confirmation/cancellation. Both browser-downloaded export variants were read back to verify assessment inclusion/exclusion. Layouts were checked at 1280×720, 390×844, 320×640 and 844×390, including reachable navigation and horizontal overflow. The final fresh-browser run reported no runtime errors. The existing in-browser Babel development warning remains; the app still uses its original CDN runtime without a build step.

## Submission integration

The interview does not POST to the legacy Azure or Google Sheets endpoints.
The existing `api/` implementation requires the previous survey version and SQL question/option catalogue.
Before restoring remote submission, provision the new `lead-qa-ai-2026-09` catalogue, configure the allowed version, and define storage for interview notes, scores, and summaries.
No remote database or deployment configuration was changed as part of this questionnaire replacement.
