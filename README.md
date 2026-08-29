# Portfolio API

REST API untuk mengelola data portfolio menggunakan **Google Sheets sebagai data store** dan **Vercel Functions sebagai serverless API**.

API ini dibuat menggunakan **Bun + TypeScript** dan menggunakan **Google Service Account** untuk mengakses Google Sheets.

---

## ✨ Features

- 📋 Get seluruh portfolio
- 🔎 Get portfolio berdasarkan ID
- ➕ Create portfolio
- ✏️ Update portfolio
- 🗑️ Delete portfolio
- ✅ Request validation
- 🌐 CORS configuration
- ⚡ Cache-Control untuk GET request
- 🛡️ Rate limiting menggunakan Vercel Firewall
- 🔐 Google Service Account authentication
- ☁️ Serverless deployment menggunakan Vercel
- 🌱 Separate development dan production environment

---

## 🛠️ Tech Stack

| Technology             | Purpose                              |
| ---------------------- | ------------------------------------ |
| [Bun](https://bun.com) | JavaScript runtime & package manager |
| TypeScript             | Type safety                          |
| Vercel Functions       | Serverless API                       |
| Google Sheets API      | Data storage                         |
| Google Service Account | Google API authentication            |
| Vercel Firewall        | Rate limiting                        |

---

## 📁 Project Structure

```text
.
├── api/
│   ├── portfolio.ts
│   └── portfolio/
│       └── [id].ts
│
├── src/
│   ├── google/
│   │   └── sheets.ts
│   │
│   ├── portfolio/
│   │   ├── portfolio.service.ts
│   │   ├── portfolio.types.ts
│   │   └── portfolio.validation.ts
│   │
│   ├── utils/
│   │   ├── cache.ts
│   │   ├── cors.ts
│   │   └── response.ts
│   │
│   └── index.ts
│
├── test-create-payload.json
├── test-update-payload.json
├── .env
├── .gitignore
├── LICENSE
├── package.json
├── README.md
└── tsconfig.json
```

> `.env` hanya digunakan untuk local development dan tidak boleh di-commit ke repository.

### API Routing

```text
GET    /api/portfolio
POST   /api/portfolio

GET    /api/portfolio/:id
PUT    /api/portfolio/:id
DELETE /api/portfolio/:id
```

### Directory Description

| Path                    | Description                                        |
| ----------------------- | -------------------------------------------------- |
| `api/`                  | Vercel serverless function entry points            |
| `api/portfolio.ts`      | Handler untuk `/api/portfolio`                     |
| `api/portfolio/[id].ts` | Handler untuk `/api/portfolio/:id`                 |
| `src/google/`           | Google Sheets integration                          |
| `src/portfolio/`        | Portfolio business logic dan validation            |
| `src/utils/`            | Shared utilities seperti response, CORS, dan cache |
| `src/index.ts`          | Local Bun HTTP server                              |
| `test-*.json`           | JSON payload untuk testing API                     |
| `.env`                  | Local environment variables                        |
| `.gitignore`            | Files excluded from Git                            |
| `LICENSE`               | Project license                                    |
| `README.md`             | Project documentation                              |

---

## 🚀 Installation

Clone repository dan install dependencies:

```bash
git clone <repository-url>
cd portfolio-api
bun install
```

---

## 🔐 Environment Variables

Untuk local development, buat file:

```text
.env
```

Contoh:

```env
CORS_ORIGINS=http://localhost:9000,http://localhost:3000
CACHE_CONTROL=public, s-maxage=60, stale-while-revalidate=300
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEET_ID=
```

### Google Service Account

API menggunakan Google Service Account untuk mengakses Google Sheets.

Environment variables yang diperlukan:

| Variable              | Description                        |
| --------------------- | ---------------------------------- |
| `GOOGLE_CLIENT_EMAIL` | Email Google Service Account       |
| `GOOGLE_PRIVATE_KEY`  | Private key Google Service Account |
| `GOOGLE_SHEET_ID`     | ID target Google Spreadsheet       |

Google Service Account harus memiliki akses **Editor** pada spreadsheet yang digunakan.

### Google Private Key

`GOOGLE_PRIVATE_KEY` harus mempertahankan escaped newline (`\n`):

```env
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Jangan commit `.env` ke repository.

---

## 📊 Google Sheet Structure

API menggunakan:

```text
Sheet1
```

dengan struktur:

| Column | Field         | Description           |
| ------ | ------------- | --------------------- |
| A      | `id`          | Portfolio UUID        |
| B      | `title`       | Portfolio title       |
| C      | `description` | Portfolio description |
| D      | `image`       | Portfolio image URL   |
| E      | `url`         | Portfolio URL         |
| F      | `created_at`  | Creation timestamp    |

Contoh:

| id   | title        | description           | image       | url         | created_at               |
| ---- | ------------ | --------------------- | ----------- | ----------- | ------------------------ |
| UUID | My Portfolio | Portfolio description | https://... | https://... | 2026-08-28T20:44:21.487Z |

Baris pertama digunakan sebagai header.

---

# 📡 API Reference

## Get Portfolios

Mengambil seluruh portfolio.

```http
GET /api/portfolio
```

### Example

```bash
curl http://localhost:3000/api/portfolio
```

### Response

```json
{
	"success": true,
	"data": [
		{
			"id": "08ca28fb-7b48-430d-b52f-2808b4d0375d",
			"title": "My Portfolio",
			"description": "Portfolio project description",
			"image": "https://example.com/image.png",
			"url": "https://example.com",
			"created_at": "2026-08-28T20:44:21.487Z"
		}
	]
}
```

Response GET menggunakan `Cache-Control` sesuai konfigurasi environment.

---

## Get Portfolio by ID

Mengambil satu portfolio berdasarkan ID.

```http
GET /api/portfolio/:id
```

### Example

```bash
curl http://localhost:3000/api/portfolio/08ca28fb-7b48-430d-b52f-2808b4d0375d
```

### Response

```json
{
	"success": true,
	"data": {
		"id": "08ca28fb-7b48-430d-b52f-2808b4d0375d",
		"title": "My Portfolio",
		"description": "Portfolio project description",
		"image": "https://example.com/image.png",
		"url": "https://example.com",
		"created_at": "2026-08-28T20:44:21.487Z"
	}
}
```

### Not Found

```json
{
	"success": false,
	"error": "Portfolio not found"
}
```

HTTP status:

```text
404 Not Found
```

---

## Create Portfolio

Membuat portfolio baru.

```http
POST /api/portfolio
Content-Type: application/json
```

### Request Body

```json
{
	"title": "My Portfolio",
	"description": "Portfolio project description",
	"image": "https://example.com/image.png",
	"url": "https://example.com"
}
```

### Example

Menggunakan JSON file:

```bash
curl -X POST "http://localhost:3000/api/portfolio" \
  -H "Content-Type: application/json" \
  --data-binary "@test-create-payload.json"
```

### Response

```json
{
	"success": true,
	"data": {
		"id": "81186ac5-1da6-4e88-8f55-0c36532010a6",
		"created_at": "2026-08-28T20:44:21.487Z"
	}
}
```

---

## Update Portfolio

Mengubah portfolio berdasarkan ID.

```http
PUT /api/portfolio/:id
Content-Type: application/json
```

### Request Body

```json
{
	"title": "Updated Portfolio",
	"description": "Updated portfolio description",
	"image": "https://example.com/new-image.png",
	"url": "https://example.com"
}
```

### Example

```bash
curl -X PUT "http://localhost:3000/api/portfolio/08ca28fb-7b48-430d-b52f-2808b4d0375d" \
  -H "Content-Type: application/json" \
  --data-binary "@test-update-payload.json"
```

### Response

```json
{
	"success": true,
	"data": {
		"id": "08ca28fb-7b48-430d-b52f-2808b4d0375d",
		"title": "Updated Portfolio",
		"description": "Updated portfolio description",
		"image": "https://example.com/new-image.png",
		"url": "https://example.com",
		"created_at": "2026-08-28T20:44:21.487Z"
	}
}
```

> `created_at` tetap mempertahankan nilai sebelumnya ketika portfolio di-update.

---

## Delete Portfolio

Menghapus portfolio berdasarkan ID.

```http
DELETE /api/portfolio/:id
```

### Example

```bash
curl -X DELETE "http://localhost:3000/api/portfolio/08ca28fb-7b48-430d-b52f-2808b4d0375d"
```

### Response

```json
{
	"success": true,
	"data": {
		"id": "08ca28fb-7b48-430d-b52f-2808b4d0375d"
	}
}
```

### Not Found

```json
{
	"success": false,
	"error": "Portfolio not found"
}
```

HTTP status:

```text
404 Not Found
```

---

# ✅ Validation

Create dan Update menggunakan validation yang sama.

Validation mencakup:

- Required fields
- Field types
- Empty values
- Valid image URL
- Valid portfolio URL

### Required Fields

| Field         | Type   | Required |
| ------------- | ------ | -------- |
| `title`       | string | Yes      |
| `description` | string | Yes      |
| `image`       | string | Yes      |
| `url`         | string | Yes      |

### Example Validation Error

```json
{
	"success": false,
	"error": "Invalid URL"
}
```

---

# 🌐 CORS

CORS dikonfigurasi melalui environment variable:

```env
CORS_ORIGINS=http://localhost:9000,http://localhost:3000
```

Multiple origins dipisahkan menggunakan koma.

Contoh:

```env
CORS_ORIGINS=http://localhost:9000,https://example.com
```

API hanya memberikan `Access-Control-Allow-Origin` untuk origin yang terdaftar.

---

# ⚡ Cache

GET portfolio menggunakan cache melalui `Cache-Control`.

Konfigurasi dilakukan melalui:

```env
CACHE_CONTROL=public, s-maxage=60, stale-while-revalidate=300
```

Mutation request seperti:

```text
POST
PUT
DELETE
```

menggunakan:

```text
Cache-Control: no-store
```

Dengan konfigurasi default:

```text
s-maxage=60
stale-while-revalidate=300
```

artinya response dapat digunakan oleh cache selama 60 detik dan dapat direvalidasi secara stale hingga 300 detik.

---

# 🛡️ Rate Limiting

Mutation endpoint dilindungi menggunakan **Vercel Firewall Rate Limiting**.

Konfigurasi saat ini:

```text
15 requests / minute
```

Rate limit menggunakan kombinasi:

```text
IP Address + User Agent
```

Rate limiting diterapkan untuk membatasi request berlebihan pada endpoint yang melakukan perubahan data.

---

# 💻 Local Development

Start development server:

```bash
bun dev
```

Server akan berjalan di:

```text
http://localhost:3000
```

Test API:

```bash
curl http://localhost:3000/api/portfolio
```

---

# ☁️ Deployment

Project menggunakan **Vercel** untuk deployment.

Branch digunakan untuk memisahkan environment:

```text
dev  → Preview
prod → Production
```

### Development Workflow

```text
                    GitHub
                       │
                       ▼
                  dev branch
                       │
                       ▼
             Vercel Preview Deploy
                       │
                       ▼
                    Testing
                       │
                 ┌─────┴─────┐
                 │           │
                Fix       Approved
                 │           │
                 └─────┬─────┘
                       ▼
                  Merge to prod
                       │
                       ▼
             Vercel Production
```

### Development

```bash
git checkout dev
git push origin dev
```

Setiap push ke `dev` menghasilkan **Preview Deployment**.

### Production

Setelah perubahan selesai dan sudah teruji:

```text
dev → prod
```

Branch `prod` digunakan untuk **Production Deployment**.

---

# 🔒 Security

Credential Google Service Account harus disimpan sebagai environment variables.

Jangan pernah commit:

```text
.env
```

ke repository.

Pastikan `.gitignore` memiliki:

```text
.env
.env.*
!.env.example
```

Environment variables untuk deployment production dikonfigurasi melalui Vercel Project Settings.

---

# 📄 License

Project ini menggunakan license yang terdapat pada:

```text
LICENSE
```

Silakan lihat file tersebut untuk detail lengkap mengenai hak penggunaan dan distribusi project.

---

## 📌 Project Status

Current version:

```text
Portfolio API
├── CRUD              ✅
├── Validation        ✅
├── Google Sheets     ✅
├── CORS              ✅
├── Cache-Control     ✅
├── Rate Limiting     ✅
├── Vercel Preview    ✅
└── Vercel Production ✅
```

Planned:

```text
Media / Image API
Contact API
Email Notification
```
