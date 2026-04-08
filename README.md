# Agentic SDLC Diagnostic (Branching Survey, EN/FR/RO/PT)

Static React survey with role-based branching and multilingual UI (English, French, Romanian, Portuguese).

## Structure

- 11 shared core required questions
- 12 role-specific required questions from one selected branch:
  - Developer
  - QA / Testing / Quality
  - Project / Product / Business Analysis / Operations
- 1 final optional free-text comment

## Key features

- 4-language selector (`EN | FR | RO | PT`) at top-right
- Role-selection question includes clearer examples, helper text, and multilingual tooltip (hover/click desktop, tap mobile)
- Instant language switch for labels/questions/options without resetting answers
- Stable answer values (language-independent keys)
- Data-driven questionnaire config (no duplicated components)
- Visual core-to-branch transition panel with distinct section styling
- Required validation for single/multi-select questions
- Optional final free-text comment
- Local persistence via `localStorage`
- Backend-friendly payload:
  - `role`
  - `contractModel`
  - `coreAnswers`
  - `branch`
  - `branchAnswers`
  - `comment`
  - `submittedAt`
- Google Sheets-friendly submission path (for Google Apps Script Web App endpoints)

## Run locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Save responses to Google Sheets (Apps Script)

This survey can post directly to a Google Apps Script Web App URL (for example `https://script.google.com/macros/s/.../exec`) using a hidden form submission pattern inspired by your **Humano-Veritas** project.

### 1) Create a Google Sheet

Create a spreadsheet and add a tab named `Responses`.

### 2) Create Apps Script

In the sheet: **Extensions → Apps Script**, then paste:

```javascript
function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Responses') || ss.insertSheet('Responses');

  const row = [
    new Date().toISOString(),
    e.parameter.role || '',
    e.parameter.branch || '',
    e.parameter.contract_model || '',
    e.parameter.submitted_at || '',
    e.parameter.survey_date || '',
    e.parameter.team_name || '',
    e.parameter.respondent || '',
    e.parameter.comment || '',
    e.parameter.core_answers_json || '',
    e.parameter.branch_answers_json || '',
    e.parameter.payload_json || ''
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'received_at',
      'role',
      'branch',
      'contract_model',
      'submitted_at',
      'survey_date',
      'team_name',
      'respondent',
      'comment',
      'core_answers_json',
      'branch_answers_json',
      'payload_json'
    ]);
  }

  sheet.appendRow(row);
  return ContentService.createTextOutput('OK');
}
```

### 3) Deploy as Web App

- **Deploy → New deployment**
- Type: **Web app**
- Execute as: **Me**
- Who has access: **Anyone with the link** (or your org policy equivalent)
- Copy the `/exec` URL

### 4) Use the endpoint in the survey

Paste that URL in the survey’s **Submission endpoint** field and submit.

Notes:
- For Apps Script URLs, the app sends form fields (`payload_json`, `core_answers_json`, `branch_answers_json`, plus top-level metadata columns).
- For non-Apps Script endpoints, the app keeps the existing JSON `fetch` POST behavior.
