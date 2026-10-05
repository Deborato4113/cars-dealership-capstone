# Windows setup

## 1. Backend

```powershell
cd server
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

Keep this terminal open.

Demo account:
- username: `demo`
- password: `Demo@123`

Admin account:
```powershell
python manage.py createsuperuser
```

## 2. Frontend

Open another PowerShell:

```powershell
cd client
npm install
npm run dev
```

Open:
http://localhost:5173

## 3. API test commands

```powershell
curl http://127.0.0.1:8000/api/dealers/
curl http://127.0.0.1:8000/api/dealers/1/
curl http://127.0.0.1:8000/api/dealers/state/Kansas/
curl http://127.0.0.1:8000/api/dealers/1/reviews/
curl http://127.0.0.1:8000/api/carmakes/
curl -X POST http://127.0.0.1:8000/api/analyze-review/ -H "Content-Type: application/json" -d "{\"text\":\"Fantastic services\"}"
```

## 4. GitHub

Create a public repository named `cars-dealership-capstone`, then:

```powershell
git init
git add .
git commit -m "Initial capstone project"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Do not submit fabricated evidence. Generate the command output and screenshots from the running application.
