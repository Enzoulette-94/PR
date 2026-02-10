# GOGOLISTAN Monorepo

Application web en monorepo:
- `frontend/`: React + Vite + TailwindCSS (SPA)
- `backend/`: Ruby on Rails API-only + PostgreSQL

## Prérequis
- Ruby (3.3+ recommandé)
- Rails (8+)
- Node.js (18+)
- npm (9+)
- PostgreSQL (local)

## Structure
- `backend`: API JSON (people, goals, personal records)
- `frontend`: SPA avec routes `/`, `/xavier`, `/thomas`, `/yanice`, `/yannis`, `/enzo`
- `scripts/dev.sh`: lance backend + frontend en même temps

## Installation

### 1) Backend
```bash
cd backend
bundle install
cp .env.example .env
```

Configure `backend/.env`:
```env
GOGOLISTAN_WRITE_PASSWORD=<YOUR_WRITE_PASSWORD>
FRONTEND_ORIGIN=https://your-project.vercel.app
```

### 2) Frontend
```bash
cd ../frontend
npm install
cp .env.example .env
```

Configure `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000
```

## Base de données
Depuis `backend/`:
```bash
bin/rails db:create
bin/rails db:migrate
bin/rails db:seed
```

## Lancement local

### Option A: deux terminaux
Terminal 1:
```bash
cd backend
bundle exec rails server -p 3000
```

Terminal 2:
```bash
cd frontend
npm run dev
```

### Option B: script unique
Depuis la racine:
```bash
./scripts/dev.sh
```

## Variables d’environnement

### Backend (`backend/.env`)
- `GOGOLISTAN_WRITE_PASSWORD`: mot de passe de protection des écritures PR
- `FRONTEND_ORIGIN`: origine frontend autorisée en prod (URL Vercel)
- `DATABASE_URL`: fourni en production (Render)

### Frontend (`frontend/.env`)
- `VITE_API_URL`: URL de l’API Rails (local: `http://localhost:3000`)

## Déploiement
Guide complet: `DEPLOYMENT.md`
