# Backend API - GOGOLISTAN

Backend Rails API-only.

## Setup rapide
```bash
bundle install
cp .env.example .env
bin/rails db:create db:migrate db:seed
bundle exec rails server -p 3000
```

## Variables d’environnement
- `GOGOLISTAN_WRITE_PASSWORD`: mot de passe requis pour écrire des PR (create/update/delete)
- `FRONTEND_ORIGIN`: URL frontend autorisée en prod
- `DATABASE_URL`: URL PostgreSQL en production (Render)

## CORS
La config est dans `config/initializers/cors.rb`.
- En dev: autorise `http://localhost:5173`
- En prod: autorise uniquement `FRONTEND_ORIGIN`

## Endpoints JSON

### People
- `GET /people`
- `GET /people/:slug`

Exemple:
```bash
curl http://localhost:3000/people
curl http://localhost:3000/people/xavier
```

### Goals
- `GET /people/:slug/goals`
- `PATCH /goals/:id` avec body `{ "goal": { "completed": true } }`

Exemple:
```bash
curl http://localhost:3000/people/xavier/goals

curl -X PATCH http://localhost:3000/goals/1 \
  -H "Content-Type: application/json" \
  -d '{"goal":{"completed":true}}'
```

### Personal Records
- `GET /people/:slug/personal_records` (public)
- `POST /people/:slug/personal_records` (protégé)
- `PATCH /personal_records/:id` (protégé)
- `DELETE /personal_records/:id` (protégé)

Header requis sur écritures:
- `X-WRITE-PASSWORD: <password>`

Exemples:
```bash
curl http://localhost:3000/people/xavier/personal_records

curl -X POST http://localhost:3000/people/xavier/personal_records \
  -H "Content-Type: application/json" \
  -H "X-WRITE-PASSWORD: <YOUR_WRITE_PASSWORD>" \
  -d '{"personal_record":{"category":"musculation","performed_on":"2026-02-01","description":"Squat 5x5 100kg"}}'

curl -X PATCH http://localhost:3000/personal_records/1 \
  -H "Content-Type: application/json" \
  -H "X-WRITE-PASSWORD: <YOUR_WRITE_PASSWORD>" \
  -d '{"personal_record":{"description":"Squat 5x5 102.5kg"}}'

curl -X DELETE http://localhost:3000/personal_records/1 \
  -H "X-WRITE-PASSWORD: <YOUR_WRITE_PASSWORD>"
```

## Erreurs usuelles
- `401` + `{ "error": "Invalid write password." }` si mot de passe incorrect.
- `422` + message d’erreur si validation échoue.
- `404` + message si ressource introuvable.
