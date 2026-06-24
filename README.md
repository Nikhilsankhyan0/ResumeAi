# ResumeAI — AI-Powered Resume Analyzer & Job Recommendation Platform

> A college-level full-stack project using React, Node.js/Express, MySQL, and Python ML inference scripts.

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18 · Vite · Tailwind CSS · Redux Toolkit · Framer Motion |
| Backend   | Node.js · Express 4                     |
| Database  | MySQL 8                                 |
| ML        | Python 3 · scikit-learn (inference only) |
| Auth      | JWT (access + refresh tokens)           |

---

## Project Structure

```
resume-ai/
├── src/                        # React frontend
│   ├── components/             # UI + feature components
│   ├── pages/                  # Route-level pages
│   ├── store/                  # Redux slices
│   ├── services/               # Axios API calls
│   ├── routes/                 # AppRoutes + guards
│   └── utils/constants.js      # API endpoints, config
│
├── backend/                    # Express API server
│   ├── server.js               # Entry point
│   ├── app.js                  # Express app + middleware
│   ├── .env                    # Environment variables (do not commit)
│   ├── config/db.js            # MySQL connection pool
│   ├── routes/index.js         # Central router (all /api/* routes)
│   ├── controllers/            # HTTP handlers
│   ├── services/               # Business logic
│   ├── models/                 # DB queries (User, Resume)
│   ├── middleware/authMiddleware.js
│   ├── utils/generateToken.js
│   ├── ml/                     # Python inference scripts
│   │   ├── parser.py           # Resume text extraction
│   │   ├── ats.py              # ATS score calculator
│   │   └── recommender.py      # Job & skills recommender
│   └── uploads/                # Uploaded resume files (gitignored)
│
├── ml_models/                  # Trained model pkl files (gitignored)
│   └── skill_matching_model__3_.pkl
│
└── database/
    └── schema.sql              # MySQL table definitions
```

---

## Prerequisites

| Tool          | Version  | Check command        |
|---------------|----------|----------------------|
| Node.js       | ≥ 18     | `node -v`            |
| npm           | ≥ 9      | `npm -v`             |
| MySQL         | ≥ 8      | `mysql --version`    |
| Python        | ≥ 3.9    | `python3 --version`  |
| pip           | ≥ 23     | `pip3 --version`     |

---

## Setup Instructions

### 1. Clone and install

```bash
git clone https://github.com/your-username/resume-ai.git
cd resume-ai

# Frontend dependencies
npm install

# Backend dependencies
cd backend && npm install && cd ..
```

### 2. Install Python dependencies

```bash
pip3 install pdfplumber pypdf python-docx scikit-learn
```

### 3. Configure environment variables

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and update:

```env
DB_PASSWORD=your_mysql_password   # your MySQL root password
JWT_SECRET=any_long_random_string # at least 32 characters
```

> All other defaults work for local development.

### 4. Set up MySQL database

```bash
mysql -u root -p < database/schema.sql
```

This creates the `resumeai_db` database and all tables.  
A demo user is included: `demo@resumeai.app` / `password123`

### 5. Add ML model files

Copy the provided `.pkl` model files into the `ml_models/` folder:

```
ml_models/
└── skill_matching_model__3_.pkl
```

---

## Running the App

### Development (two terminals)

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev          # nodemon auto-restart on change
```
API will be at: `http://localhost:4000`

**Terminal 2 — Frontend:**
```bash
npm run dev          # Vite dev server
```
App will be at: `http://localhost:5173`

### Production build

```bash
# Build frontend
npm run build        # output → dist/

# Serve backend (serves built frontend too if you copy dist/ to backend/public)
cd backend
NODE_ENV=production node server.js
```

---

## API Reference

All protected endpoints require header: `Authorization: Bearer <token>`

### Auth

| Method | Endpoint              | Auth | Description              |
|--------|-----------------------|------|--------------------------|
| POST   | /api/auth/register    | ✗    | Create account           |
| POST   | /api/auth/login       | ✗    | Login, get tokens        |
| GET    | /api/auth/me          | ✓    | Get current user         |
| POST   | /api/auth/refresh     | ✗    | Refresh access token     |
| POST   | /api/auth/logout      | ✓    | Logout                   |
| POST   | /api/auth/change-password | ✓ | Change password         |

### Resume Analysis

| Method | Endpoint                              | Auth | Description                  |
|--------|---------------------------------------|------|------------------------------|
| POST   | /api/recommendations/analyze          | ✓    | Upload + full ML analysis    |
| POST   | /api/recommendations/score            | ✓    | Re-score vs new JD           |
| GET    | /api/recommendations/jobs             | ✓    | Jobs from skill list         |
| POST   | /api/recommendations/missing-skills   | ✓    | Skill gap analysis           |
| GET    | /api/recommendations/history          | ✓    | Past analyses                |

### Resume CRUD

| Method | Endpoint              | Auth | Description              |
|--------|-----------------------|------|--------------------------|
| POST   | /api/resume/upload    | ✓    | Upload resume file       |
| GET    | /api/resume/history   | ✓    | Upload history           |
| DELETE | /api/resume/:id       | ✓    | Delete a resume          |

### User Profile

| Method | Endpoint              | Auth | Description              |
|--------|-----------------------|------|--------------------------|
| GET    | /api/user/profile     | ✓    | Get profile              |
| PUT    | /api/user/profile     | ✓    | Update profile           |

---

## Example API Calls

### Register
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Smith","email":"jane@example.com","password":"password123"}'
```

### Analyze Resume
```bash
curl -X POST http://localhost:4000/api/recommendations/analyze \
  -H "Authorization: Bearer <your_token>" \
  -F "resume=@/path/to/resume.pdf" \
  -F "jd_text=Looking for a Python developer with AWS and Docker experience" \
  -F "target_role=INFORMATION-TECHNOLOGY"
```

### Missing Skills
```bash
curl -X POST http://localhost:4000/api/recommendations/missing-skills \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"skills":["python","sql","git"],"target_role":"INFORMATION-TECHNOLOGY"}'
```

---

## ML Pipeline

The Node backend runs Python scripts via `child_process.spawn`:

```
Resume File (PDF/DOCX)
       │
       ▼
  parser.py          → extracts text, skills, education, experience
       │
       ├──────────────────────────┐
       ▼                          ▼
   ats.py                  recommender.py
  (ATS score 0–100)        (role match + job listings)
       │                          │
       └──────────┬───────────────┘
                  ▼
           Combined JSON response
```

**ATS Score Formula** (derived from training data):
```
ATS = TF-IDF(20%) + Semantic(35%) + Skills(20%) + Experience(15%) + Certifications(10%)
```

**Supported roles** (from `skill_matching_model__3_.pkl`):
`INFORMATION-TECHNOLOGY`, `FINANCE`, `HR`, `DESIGNER`, `DIGITAL-MEDIA`,
`BUSINESS-DEVELOPMENT`, `HEALTHCARE`, `ENGINEERING`, `BANKING`, and 15 more.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `python3: command not found` | Set `PYTHON_BIN=python` in `.env` (Windows) |
| `Cannot connect to MySQL` | Check `DB_PASSWORD` in `.env`; ensure MySQL is running |
| `CORS error in browser` | Confirm `ALLOWED_ORIGINS` includes your frontend URL |
| `File upload fails` | Check `uploads/` folder exists and is writable |
| `ML script timeout` | Large PDFs take longer; increase `TIMEOUT` in `mlService.js` |
| `No module named pdfplumber` | Run `pip3 install pdfplumber pypdf python-docx scikit-learn` |

---

## Database Schema (summary)

```sql
users       (id, name, email, password_hash, title, location, ...)
resumes     (id, user_id, original_name, stored_name, file_size, ...)
analyses    (id, resume_id, ats_score, skills JSON, gaps JSON, insights JSON)
saved_jobs  (id, user_id, job_id, title, company, match_pct, ...)
```

Full schema: `database/schema.sql`

---

## .gitignore additions

```
backend/.env
backend/uploads/
ml_models/*.pkl
node_modules/
dist/
```

---

## Team / Credits

Built as a college final-year project demonstrating full-stack development,
REST API design, JWT authentication, MySQL database design, and ML model inference.

---

*ResumeAI — College Project 2024–25*
