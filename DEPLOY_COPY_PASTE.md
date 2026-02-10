# DEPLOY_COPY_PASTE.md

Copie/colle directement ces blocs dans les variables d'environnement.

## Render (backend)

Dans Render > Service backend > Environment > Add Environment Variable:

```env
RAILS_ENV=production
FRONTEND_ORIGIN=https://TON-APP.vercel.app
GOGOLISTAN_WRITE_PASSWORD=TON_MOT_DE_PASSE_SECRET
```

### DATABASE_URL (Render)
- Si Render l'injecte automatiquement via la base liée: ne rien ajouter.
- Sinon, ajoute:

```env
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DB_NAME
```

### RAILS_MASTER_KEY (si nécessaire)
Ajoute seulement si Rails le demande au démarrage:

```env
RAILS_MASTER_KEY=COLLE_ICI_TA_MASTER_KEY
```

## Vercel (frontend)

Dans Vercel > Project Settings > Environment Variables:

```env
VITE_API_URL=https://TON-BACKEND.onrender.com
```

## Valeurs à remplacer
- `https://TON-APP.vercel.app` -> URL réelle de ton frontend Vercel.
- `TON_MOT_DE_PASSE_SECRET` -> mot de passe que tu choisis pour les write PR.
- `https://TON-BACKEND.onrender.com` -> URL réelle de ton backend Render.
