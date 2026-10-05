# Cars Dealership Capstone

## Repository name
cars-dealership-capstone

## Project name
Cars Dealership - Full Stack Capstone

A responsive Django REST + React application for browsing U.S. car dealerships, filtering by state, viewing dealership details and reviews, registering/logging in, and posting reviews.

## Stack
- Django + Django REST Framework
- SQLite
- React + Vite
- Docker
- GitHub Actions

## Quick start

### Backend
```bash
cd server
python -m venv venv
# Windows PowerShell:
# .\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py createsuperuser
python manage.py runserver
```

Backend: http://127.0.0.1:8000/

### Frontend
In another terminal:
```bash
cd client
npm install
npm run dev
```

Frontend: http://localhost:5173/

The frontend uses `VITE_API_URL=http://127.0.0.1:8000/api`.

## Required endpoints
- `POST /api/register/`
- `POST /api/login/`
- `POST /api/logout/`
- `GET /api/dealers/`
- `GET /api/dealers/<id>/`
- `GET /api/dealers/state/<state>/`
- `GET /api/dealers/<id>/reviews/`
- `GET /api/carmakes/`
- `POST /api/analyze-review/`

## Submission evidence
The `evidence/` directory contains templates/placeholders. Replace them with the real terminal outputs and screenshots generated after running the application. Do not submit placeholders as evidence.
