# Agentic SDLC Maturity Survey

Static web survey for the 40-question **AI Coding / Agentic SDLC Maturity Questionnaire**.

## What this app does

- Renders all questionnaire sections and questions with stable wording.
- Captures a required **survey date** so monthly snapshots can be tracked.
- Supports single-choice and multiple-choice questions.
- Sends responses as JSON to a **Google Apps Script Web App URL**.
- Allows local draft save/reload via browser `localStorage`.

## Files

- `index.html`: page structure and form shell.
- `styles.css`: lightweight styling.
- `app.js`: question bank + rendering + submit/draft logic.

## Run locally

Open `index.html` in a browser, or run a static server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Google Sheets integration (suggested)

1. Create a Google Sheet with a tab named `Responses`.
2. In Google Apps Script, create a web app with a `doPost(e)` handler that:
   - parses incoming JSON,
   - flattens answers,
   - appends one row per submission.
3. Deploy as Web App with access to your intended audience.
4. Paste the deployment URL into the form field **Google Apps Script Web App URL**.

> Note: if browser CORS blocks the request, configure your Apps Script response headers accordingly.
