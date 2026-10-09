# ClearCity — Municipal Issue Reporting & AI Dispatch Platform

A senior-level decoupled civic tech platform combining a **Next.js 15 App Router (TypeScript + Tailwind CSS)** frontend with a **Django 6 REST Framework (DRF)** API backend, OpenAI Vision AI classification, EXIF GPS extraction, and multi-container Docker orchestration.

---

## 🏗 Architecture & Stack Overview

```
                        ┌──────────────────────────────────────────────┐
                        │     Next.js 15 (App Router, TypeScript)      │
                        │     Tailwind CSS + Dark/Light + i18n        │
                        │     Frontend Server: http://localhost:3000   │
                        └──────────────────────┬───────────────────────┘
                                               │
                                     JSON REST API / CORS
                                               │
                        ┌──────────────────────▼───────────────────────┐
                        │  Django REST Framework (DRF) + Django 6      │
                        │  ORM, OpenAI AI Classifier, EXIF, SMTP       │
                        │  Backend API: http://localhost:8000/api/v1/  │
                        └──────────────────────────────────────────────┘
```

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Lucide React, i18n (AZ, EN, RU), Dark/Light theme.
- **Backend**: Django 6, Django REST Framework, Django CORS Headers, Gunicorn, Pillow, EXIF metadata parser, OpenAI Vision API with fallback.
- **Database**: SQLite (local development) / PostgreSQL (production).
- **Deployment**: Docker, Docker Compose, Coolify, Traefik.

---

## 📁 Repository Structure

```
ClearCity/
├── clearcity/                    # Django Core Configuration & WSGI/ASGI
│   ├── settings.py               # Settings with DRF & CORS configurations
│   ├── urls.py                   # Global routing & media security rules
│   └── wsgi.py
├── reports/                      # Core Django App
│   ├── models.py                 # Department, Category, Report, StatusHistory, AIClassification
│   ├── serializers.py            # DRF REST Serializers
│   ├── api_views.py              # REST API ViewSets & endpoints
│   ├── views.py                  # Legacy template views
│   ├── utils.py                  # OpenAI image classifier & EXIF GPS extractor
│   └── management/commands/      # Database seeding scripts
├── core/                         # Utility modules & secure media serving
├── frontend/                     # Decoupled Next.js 15 App Router
│   ├── app/                      # Next.js Pages (/, /report, /track, /department)
│   ├── components/               # Navbar, Footer, UI elements
│   ├── context/                  # LanguageContext & ThemeContext
│   ├── lib/                      # Axios API client & i18n dictionaries
│   ├── Dockerfile                # Next.js production multi-stage build
│   └── package.json
├── docker-compose.yml            # Multi-container orchestration (Backend + Frontend)
├── Dockerfile                    # Django production Docker build
├── entrypoint.sh                 # Database migration & boot script
├── requirements.txt              # Python backend dependencies
└── manage.py
```

---

## ⚡ Quick Start

### Option 1: Docker Compose (Recommended)

Run the full decoupled stack (Frontend + Backend) with a single command:

```bash
docker compose up --build
```

- **Next.js Frontend**: http://localhost:3000
- **Django REST API**: http://localhost:8000/api/v1/

---

### Option 2: Local Manual Setup

#### 1. Backend Setup (Django REST API)

```bash
# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations & seed initial data
python manage.py migrate
python manage.py seed_data

# Create superuser for Django Admin
python manage.py createsuperuser

# Start Django API backend
python manage.py runserver 0.0.0.0:8000
```

#### 2. Frontend Setup (Next.js 15)

```bash
cd frontend

# Install Node dependencies
npm install

# Start Next.js development server
npm run dev
```

- **Frontend Application**: http://localhost:3000
- **Django REST API**: http://localhost:8000/api/v1/categories/
- **Django Admin Panel**: http://localhost:8000/admin/ *(admin / admin123)*

---

## 🔌 REST API Specifications

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/categories/` | List all available issue categories |
| `GET` | `/api/v1/departments/` | List active municipal departments |
| `POST` | `/api/v1/reports/` | Submit report (photo upload, address, GPS, description) |
| `GET` | `/api/v1/reports/track/<token>/` | Fetch real-time status & audit history by token |
| `POST` | `/api/v1/reports/update-status/<token>/` | Department status update endpoint |
| `POST` | `/api/v1/classify-photo/` | Standalone AI image classification endpoint |

---

## 📄 License

MIT License &copy; 2026 ClearCity
