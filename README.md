# Portfolio API

REST API sederhana untuk mengelola data portfolio menggunakan **Google Sheets sebagai data store** dan **Vercel Functions sebagai serverless API**.

API ini dibuat dengan **Bun + TypeScript**, menggunakan **Google Service Account** untuk mengakses Google Sheets.

---

## ✨ Features

- 📋 Get seluruh portfolio
- 🔎 Get portfolio berdasarkan ID
- ➕ Create portfolio
- ✏️ Update portfolio
- 🗑️ Delete portfolio
- ✅ Request validation
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
│   │   └── response.ts
│   │
│   └── index.ts
│
├── test-create-payload.json
├── test-update-payload.json
├── package.json
└── tsconfig.json
```

### API Routing

```text
GET    /api/portfolio
POST   /api/portfolio

GET    /api/portfolio/:id
PUT    /api/portfolio/:id
DELETE /api/portfolio/:id
```

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

Untuk local development, buat file `.env`:

```env
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEET_ID=
```

### Google Private Key

`GOOGLE_PRIVATE_KEY` harus mempertahankan escaped newline (`\n`):

```env
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Jangan commit file `.env` ke repository.

### Google Service Account

Google Service Account yang digunakan oleh API harus memiliki akses ke target Google Spreadsheet.

Minimal berikan akses **Editor** pada spreadsheet kepada email:

```text
GOOGLE_CLIENT_EMAIL
```

---

## 📊 Google Sheet Structure

API menggunakan `Sheet1` dengan struktur kolom:

| Column | Field         |
| ------ | ------------- |
| A      | `id`          |
| B      | `title`       |
| C      | `description` |
| D      | `image`       |
| E      | `url`         |
| F      | `created_at`  |

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

Jika ID tidak ditemukan:

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

# 💻 Local Development

Start development server:

```bash
bun dev
```

Server akan berjalan di:

```text
http://localhost:3000
```

Contoh:

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
              ┌────┴────┐
              │         │
            Fix      Approved
              │         │
              └────┬────┘
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

Setiap push ke `dev` akan menghasilkan **Preview Deployment**.

### Production

Setelah perubahan sudah selesai dan teruji:

```text
dev → prod
```

Branch `prod` digunakan untuk **Production Deployment**.

---

# 🔒 Security

Environment variables berisi credential Google Service Account dan **tidak boleh disimpan di repository**.

Pastikan:

```text
.env
```

sudah masuk `.gitignore`.

Jangan pernah commit:

```text
GOOGLE_CLIENT_EMAIL
GOOGLE_PRIVATE_KEY
GOOGLE_SHEET_ID
```

ke source code.

Untuk Vercel, environment variables dikonfigurasi melalui project settings Vercel.

---

## 📄 License

Private project.
