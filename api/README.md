# Agentic SDLC Survey API (Azure Functions)

Node.js + TypeScript Azure Function backend for ingesting survey submissions and writing to Azure SQL.

## Endpoint

- `POST /api/survey/submit`

## Required environment variables

- `SQL_CONNECTION_STRING`
- `ALLOWED_SURVEY_VERSION` (example: `2026-04`)

For local development, copy `local.settings.sample.json` to `local.settings.json` and fill values.

## Install

```bash
cd api
npm install
```

## Build

```bash
npm run build
```

## Run locally

Requires Azure Functions Core Tools (`func`).

```bash
npm run start:build
```

## Behavior summary

- Parses JSON request body.
- Validates required top-level fields.
- Rejects unsupported survey versions.
- Loads valid questions/options from `dbo.dim_question` and `dbo.dim_option`.
- Validates submitted answer keys/options against those catalogs.
- Uses SQL transaction.
- Duplicate check by `client_submission_id` in `dbo.survey_submission`.
- Inserts:
  - `dbo.survey_submission` (1 row)
  - `dbo.survey_submission_raw` (1 row)
  - `dbo.survey_answer_fact` (N rows)
- Stores `comment` as `comment1` answer when that question exists in catalog.
