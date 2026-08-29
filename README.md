# Portfolio API

REST API sederhana untuk mengelola data portfolio menggunakan **Google Sheets** sebagai data store dan **Vercel Functions** sebagai deployment platform.

## Tech Stack

- Bun
- TypeScript
- Vercel Functions
- Google Sheets API
- Google Service Account

## Project Structure

```text
.
├── api/
│   └── portfolio.ts
├── src/
│   ├── google/
│   │   └── sheets.ts
│   ├── portfolio/
│   │   ├── portfolio.service.ts
│   │   ├── portfolio.types.ts
│   │   └── portfolio.validation.ts
│   ├── utils/
│   │   └── response.ts
│   └── index.ts
├── test-payload.json
├── package.json
└── tsconfig.json
```

## Installation

Install dependencies:

```bash
bun install
```

## Environment Variables

Create a `.env` file for local development:

```env
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEET_ID=
```

`GOOGLE_PRIVATE_KEY` should preserve the escaped newline format:

```env
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

The Google Service Account must have access to the target Google Spreadsheet.

## Local Development

Start the development server:

```bash
bun dev
```

The API will be available at:

```text
http://localhost:3000
```

## API

### Get Portfolios

```http
GET /api/portfolio
```

Example:

```bash
curl http://localhost:3000/api/portfolio
```

### Get Portfolios by id

```http
GET /api/portfolio
```

Example:

```bash
curl http://localhost:3000/api/portfolio/:id
```

### Create Portfolio

```http
POST /api/portfolio
Content-Type: application/json
```

Request body:

```json
{
	"title": "My Portfolio",
	"description": "Portfolio project description",
	"image": "https://example.com/image.png",
	"url": "https://example.com"
}
```

Example using a JSON file:

```bash
curl -X POST "http://localhost:3000/api/portfolio" \
  -H "Content-Type: application/json" \
  --data-binary "@test-create-payload.json"
```

Successful response:

```json
{
	"success": true,
	"data": {
		"id": "81186ac5-1da6-4e88-8f55-0c36532010a6",
		"created_at": "2026-08-28T20:44:21.487Z"
	}
}
```

## Validation

The create endpoint validates:

- Required fields
- Field types
- Empty values
- Image URL
- Portfolio URL

Example validation response:

```json
{
	"success": false,
	"error": "Invalid URL"
}
```

## Deployment

The project is deployed using Vercel.

Branches:

```text
dev  → Preview
prod → Production
```

Development workflow:

```text
git push origin dev
        ↓
Vercel Preview Deployment
        ↓
Testing
        ↓
Merge dev → prod
        ↓
Vercel Production
```

## License

Private project.
