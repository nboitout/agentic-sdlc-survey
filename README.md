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
- Optional secondary Azure Function JSON submission (in addition to existing primary submission)

## Run locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Runtime configuration (Azure secondary submission)

This static app supports runtime config via:

1) `window.__APP_CONFIG__` (preferred), or  
2) `<meta>` tags in `index.html`.

Available keys:

- `azureSurveySubmitUrl` (example: `https://<function-app>.azurewebsites.net/api/survey/submit`)
- `sourceEnv` (`dev`, `prod`, etc.)

In `index.html`:

- `<meta name="azure-survey-submit-url" content="">`
- `<meta name="app-source-env" content="prod">`

The submit behavior is:

1. Existing primary destination runs first (Google Apps Script or generic endpoint).
2. Azure submission is attempted in addition (best-effort).
3. If Azure fails but primary succeeds, submission still completes for the respondent.

## Save responses to Google Sheets (Apps Script)

This survey posts directly to a Google Apps Script Web App URL (for example `https://script.google.com/macros/s/.../exec`) using a hidden `form` POST to a hidden iframe (CORS-safe, no preflight).

### 1) Create a Google Sheet

Create a spreadsheet and add a tab named `Responses`.

### 2) Create Apps Script

In the sheet: **Extensions → Apps Script**, then paste:

```javascript
const SHEET_NAME = 'Responses';

function doPost(e) {
  try {
    // Form POST (application/x-www-form-urlencoded) => e.parameter
    // JSON POST (application/json) => e.postData.contents
    let data;
    if (e.parameter && Object.keys(e.parameter).length > 0) {
      data = e.parameter;
    } else {
      data = JSON.parse(e.postData.contents);
    }

    writeToSheet(data);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Browser health check: opening /exec should append a test row.
function doGet() {
  try {
    writeToSheet({
      timestamp: new Date().toISOString(),
      role: 'TEST_BROWSER',
      branch: 'qa_testing_quality',
      contract_model: 'test',
      submitted_at: new Date().toISOString(),
      survey_date: new Date().toISOString().slice(0, 10),
      team_name: 'Smoke Test',
      respondent: 'Browser Check',
      comment: 'Apps Script doGet test',
      core_answers_json: '{}',
      branch_answers_json: '{}',
      payload_json: '{}'
    });
    return ContentService
      .createTextOutput('OK: wrote test row to sheet "' + SHEET_NAME + '".')
      .setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService
      .createTextOutput('ERROR: ' + err.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

// Editor health check: Run > testWrite
function testWrite() {
  writeToSheet({
    timestamp: new Date().toISOString(),
    role: 'TEST_EDITOR',
    branch: 'developer',
    submitted_at: new Date().toISOString(),
    team_name: 'Smoke Test',
    respondent: 'Editor Check',
    comment: 'Apps Script testWrite',
    core_answers_json: '{}',
    branch_answers_json: '{}',
    payload_json: '{}'
  });
}

function writeToSheet(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(getHeaders());
    sheet.setFrozenRows(1);
  }

  const headers = getHeaders();
  const row = headers.map((h) => (data[h] !== undefined ? data[h] : ''));
  sheet.appendRow(row);
}

function getHeaders() {
  return [
    'timestamp',
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
    'payload_json',
    // legacy compatibility keys sent by the survey frontend:
    'societe',
    'poste',
    'nom'
  ];
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
- For Apps Script URLs, the app sends form fields (readable from `e.parameter`) via hidden form POST.
- Apps Script URL detection supports both `script.google.com` and `script.googleusercontent.com` Web App links.
- It also sends compatibility keys for legacy scripts with fixed headers:
  - `timestamp`, `societe`, `poste`, `nom`
  - plus survey-native keys (`payload_json`, `core_answers_json`, `branch_answers_json`, `role`, `branch`, etc.)
- For non-Apps Script endpoints, the app keeps the existing JSON `fetch` POST behavior.

## Azure payload format

When `azureSurveySubmitUrl` is configured, the app posts this JSON shape:

```json
{
  "clientSubmissionId": "uuid-generated-in-frontend",
  "surveyVersion": "2026-04",
  "clientSubmittedAt": "2026-04-09T10:15:30.123Z",
  "language": "en",
  "role": "developer",
  "branch": "developer",
  "contractModel": "staff_augmentation",
  "coreAnswers": { "...": "..." },
  "branchAnswers": { "...": "..." },
  "comment": "",
  "sourceApp": "agentic-sdlc-survey",
  "sourceEnv": "prod"
}
```
