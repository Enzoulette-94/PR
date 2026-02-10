# DEPLOYMENT.md - GOGOLISTAN

Guide de déploiement frontend (Vercel) + backend (Render) aligné sur l'audit de production.

## 1) Backend Rails API sur Render

### 1.1 Créer la base PostgreSQL
1. Render Dashboard > `New` > `PostgreSQL`.
2. Créer la base (ex: `gogolistan-db`).
3. Laisser Render injecter `DATABASE_URL` dans le service web, ou la copier si besoin manuel.

### 1.2 Créer le Web Service backend
1. Render Dashboard > `New` > `Web Service`.
2. Connecter le repo GitHub.
3. Paramètres recommandés:
- Root Directory: `backend`
- Environment: `Ruby`
- Build Command: `bundle install && bundle exec rails db:migrate`
- Start Command: `bundle exec rails server -b 0.0.0.0 -p $PORT`

### 1.3 Variables d'environnement backend (obligatoires)
- `RAILS_ENV=production`
- `DATABASE_URL=<injecté par Render Postgres>`
- `FRONTEND_ORIGIN=https://<app>.vercel.app`
- `GOGOLISTAN_WRITE_PASSWORD=<secret>`
- `RAILS_MASTER_KEY=<si credentials utilisées en production>`

### 1.4 Vérifications backend après déploiement
- `GET https://<backend>.onrender.com/up` -> 200.
- `GET https://<backend>.onrender.com/people` -> JSON.
- `GET https://<backend>.onrender.com/stats/goals` -> `{ completed, total }`.

## 2) Frontend React/Vite sur Vercel

1. Vercel > `Add New...` > `Project`.
2. Importer le repo GitHub.
3. Paramètres recommandés:
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

### Variables d'environnement frontend (obligatoires)
- `VITE_API_URL=https://<backend>.onrender.com`

## 3) Couplage Front / Back
- Mettre `FRONTEND_ORIGIN` côté Render avec l'URL Vercel exacte (https inclus).
- Redéployer le backend après changement d'ENV.
- Redéployer le frontend après changement de `VITE_API_URL`.

## 4) CORS et erreurs fréquentes

### CORS bloqué
Symptôme: `blocked by CORS policy`.

À vérifier:
- `FRONTEND_ORIGIN` exact.
- Backend redéployé après changement ENV.
- Backend autorise bien les méthodes `GET/POST/PATCH/DELETE/OPTIONS`.

### 401 sur écriture PR
Symptôme: `Invalid write password.`

À vérifier:
- `GOGOLISTAN_WRITE_PASSWORD` défini côté Render.
- Header `X-WRITE-PASSWORD` bien envoyé côté frontend.

### DB non connectée
Symptôme: `ActiveRecord::ConnectionNotEstablished`.

À vérifier:
- `DATABASE_URL` injecté dans le service backend.
- Base Render active.

### 404 au refresh d'une route frontend
Symptôme: refresh sur `/xavier` retourne 404.

À vérifier:
- `frontend/vercel.json` présent avec rewrite vers `/index.html`.

## 5) Checklist finale en production
- `/`, `/xavier`, `/thomas`, `/yanice`, `/yannis`, `/enzo` chargent correctement.
- Refresh direct sur `/xavier` fonctionne (pas de 404).
- Toggle goals persiste et met à jour le compteur global accueil.
- CRUD PR fonctionne avec mot de passe valide.
- Mot de passe invalide retourne erreur claire (401).
- Stats accueil affichent `Nombre d'objectifs validés par les gogoles: X sur Y`.

## 6) Validation locale

Backend:
```bash
cd backend
bundle install
bin/rails db:create db:migrate db:seed
GOGOLISTAN_WRITE_PASSWORD=<secret> FRONTEND_ORIGIN=http://localhost:5173 bin/rails s -p 3000
```

Frontend:
```bash
cd frontend
npm install
VITE_API_URL=http://localhost:3000 npm run dev
```

## 7) Validation locale prod-like (frontend)
```bash
cd frontend
npm run build
npm run preview
```
Puis tester:
- `http://localhost:4173/`
- `http://localhost:4173/xavier`
