# GITHUB_SETUP.md - Publier le monorepo sur GitHub

Guide pas à pas pour préparer le repo, pousser sur GitHub, puis enchaîner avec le déploiement décrit dans `DEPLOYMENT.md`.

## 1) Prérequis
- Avoir Git installé.
- Avoir un compte GitHub.
- Être à la racine du projet (dossier qui contient `frontend/`, `backend/`, `DEPLOYMENT.md`).

## 2) Vérifier les fichiers sensibles avant push
Le projet doit déjà ignorer les fichiers sensibles via `.gitignore`.

À vérifier rapidement:
- `frontend/.env` non versionné.
- `backend/.env` non versionné.
- `backend/config/master.key` non versionné.

Commande utile:
```bash
git status --ignored
```

## 3) Initialiser le repo Git (si pas déjà fait)
Depuis la racine du projet:
```bash
git init
git add .
git commit -m "Initial monorepo: frontend + backend"
```

## 4) Créer le repository sur GitHub
Option A (interface web):
1. Aller sur GitHub > `New repository`.
2. Nommer le repo (ex: `gogolistan`).
3. Choisir Public ou Private.
4. Ne pas ajouter de README/.gitignore/licence (ils existent déjà localement).
5. Créer le repo.

Option B (GitHub CLI):
```bash
gh repo create gogolistan --private
```

## 5) Lier le repo local au remote GitHub
Si tu as créé le repo depuis l'interface web, prends l'URL affichée (HTTPS ou SSH), puis:
```bash
git remote add origin <URL_DU_REPO_GITHUB>
git branch -M main
git push -u origin main
```

Exemple HTTPS:
```bash
git remote add origin https://github.com/<user>/gogolistan.git
git branch -M main
git push -u origin main
```

## 6) Workflow quotidien (recommandé)
Après modifications:
```bash
git add .
git commit -m "message clair"
git push
```

Pour récupérer les changements d'un autre poste:
```bash
git pull
```

## 7) Relier GitHub au déploiement (aligné avec DEPLOYMENT.md)
Une fois le repo sur GitHub:
- Render: connecter le repo, Root Directory `backend`.
- Vercel: connecter le repo, Root Directory `frontend`.

Rappels importants:
- Vercel:
  - Build command: `npm run build`
  - Output: `dist`
  - Env: `VITE_API_URL=https://<backend>.onrender.com`
- Render:
  - Build command: `bundle install && bundle exec rails db:migrate`
  - Start command: `bundle exec rails server -b 0.0.0.0 -p $PORT`
  - Env: `RAILS_ENV`, `DATABASE_URL`, `FRONTEND_ORIGIN`, `GOGOLISTAN_WRITE_PASSWORD`

## 8) Checklist rapide avant premier déploiement
- Le code est bien poussé sur GitHub (`git log`, `git status`).
- Les fichiers `.env` ne sont pas dans GitHub.
- `frontend/vercel.json` est bien présent.
- `DEPLOYMENT.md` et `DEPLOY_AUDIT.md` sont à jour.

## 9) Dépannage GitHub fréquent
### `remote origin already exists`
```bash
git remote remove origin
git remote add origin <URL_DU_REPO_GITHUB>
```

### `rejected (non-fast-forward)`
```bash
git pull --rebase origin main
git push
```

### mauvais compte GitHub utilisé
Configurer l'identité locale:
```bash
git config user.name "Ton Nom"
git config user.email "ton@email.com"
```

## 10) Commandes minimales (copier-coller)
```bash
cd /chemin/vers/ton/projet
git init
git add .
git commit -m "Initial commit"
git remote add origin <URL_DU_REPO_GITHUB>
git branch -M main
git push -u origin main
```

Ensuite suivre `DEPLOYMENT.md` pour Vercel + Render.
