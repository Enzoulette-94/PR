# Deploy Audit - GOGOLISTAN

Date: 2026-02-10

## Résumé
- Frontend (Vercel): OK
- Backend (Render): OK avec prérequis d'environnement

## Changements appliqués pendant cet audit
- Aucun correctif code bloquant nécessaire.
- Ajout de ce rapport `DEPLOY_AUDIT.md`.

## Checklist Front (Vercel)
- `frontend/package.json` scripts: OK (`dev: vite`, `build: vite build`).
- Build output Vite: OK (`dist/`).
- SPA rewrite React Router: OK (`frontend/vercel.json` catch-all vers `/index.html`).
- `BrowserRouter` conservé: OK.
- Variable d'environnement frontend: OK (`VITE_API_URL` utilisée dans `frontend/src/lib/apiClient.js`, pas d'URL hardcodée).
- Routes directes/refresh (`/xavier`, etc.): OK en config (rewrite présent).

Paramètres Vercel recommandés:
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Env var: `VITE_API_URL=https://<backend>.onrender.com`

## Checklist Back (Render)
- Rails API-only + Postgres: OK.
- `production` DB via `DATABASE_URL`: OK (`backend/config/database.yml`).
- Puma écoute `PORT`: OK (`backend/config/puma.rb`).
- Endpoint stats utilisé par l'accueil: OK (`GET /stats/goals`).
- Endpoints front requis présents: OK (`people`, `goals`, `personal_records`, `stats/goals`).

Paramètres Render recommandés:
- Root Directory: `backend`
- Build Command: `bundle install && bundle exec rails db:migrate`
- Start Command: `bundle exec rails server -b 0.0.0.0 -p $PORT`

Variables Render obligatoires:
- `RAILS_ENV=production`
- `DATABASE_URL=<injecté par Render Postgres>`
- `FRONTEND_ORIGIN=https://<app>.vercel.app`
- `GOGOLISTAN_WRITE_PASSWORD=<secret>`
- `RAILS_MASTER_KEY=<si credentials utilisées en prod>`

## Checklist CORS / API
- Dev origin: OK (`http://localhost:5173`).
- Prod origin via ENV: OK (`FRONTEND_ORIGIN`).
- Méthodes autorisées: OK (`get post patch put delete options head`).
- Headers autorisés: OK (`headers: :any`, inclut `Content-Type` et `X-WRITE-PASSWORD`).
- Erreurs typiques:
  - CORS: `FRONTEND_ORIGIN` incorrect ou backend non redéployé.
  - 401 PR write: mauvais `X-WRITE-PASSWORD` ou `GOGOLISTAN_WRITE_PASSWORD` absent.
  - 404 refresh SPA: rewrite Vercel absent/cassé.

## Checklist Sécurité
- `.env` ignorés: OK (racine, frontend, backend).
- `.env.example` présents: OK (`frontend/.env.example`, `backend/.env.example`).
- Secret write password hardcodé dans le code: OK (non détecté).
- Point d'attention: vérifier que `backend/config/master.key` n'est pas versionné dans le dépôt distant.

## Tests manuels en prod
1. Front routes
- Ouvrir `/`, `/xavier`, `/thomas`, `/yanice`, `/yannis`, `/enzo`.
- Refresh direct sur `/xavier` (doit charger, pas de 404).

2. Goals
- Cocher/décocher un objectif sur une page personne.
- Vérifier persistance après refresh.
- Vérifier mise à jour du compteur global sur `/`.

3. Personal Records
- Créer/modifier/supprimer un PR avec mot de passe valide.
- Vérifier erreur claire en mot de passe invalide (401).
- Vérifier répartition par catégorie.

4. Stats accueil
- Vérifier affichage: `Nombre d'objectifs validés par les gogoles: X sur Y`.
- Vérifier changement de X après toggle goal.

## Validation locale (commandes exactes)
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

## Validation prod-like (local)
```bash
cd frontend
npm run build
npm run preview
```
Puis tester directement:
- `http://localhost:4173/`
- `http://localhost:4173/xavier`

## Résultats des vérifications exécutées pendant l'audit
- `npm run build` (frontend): OK.
- `bundle exec rails routes` (backend): OK pour routes requises.
- Vérification DB runtime backend dans ce sandbox: NON VALIDABLE (connexion Postgres locale bloquée par environnement sandbox).
