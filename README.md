# ShareRide — Covoiturage étudiant pour le Togo 🇹🇬

Plateforme de covoiturage étudiant basée sur un système de **matching par requête** :
un étudiant poste une requête ("Je vais à l'Université de Lomé, départ 7h00"),
les autres étudiants vérifiés sur ce trajet sont notifiés et peuvent répondre
"Je peux t'aider". L'étudiant choisit une réponse, confirme, puis coordonne le
trajet via un chat intégré.

## Stack

- **Frontend** : Next.js 14 (App Router, TypeScript), Tailwind CSS, React Query
- **Backend** : FastAPI (Python), SQLAlchemy, JWT
- **DB** : SQLite (fichier `backend/shareride.db`, créé + peuplé automatiquement)

## Lancer le projet

### 1. Backend (FastAPI) — port 8000

```bash
cd backend
python -m venv venv
./venv/Scripts/activate        # Windows
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

Au premier démarrage, la base SQLite est créée et peuplée avec 4 utilisateurs
et 3 requêtes de démo (voir `app/seed.py`).

### 2. Frontend (Next.js) — port 3000

```bash
cd frontend
npm install
npm run dev
```

Le frontend proxifie `/api/*` et `/uploads/*` vers `http://127.0.0.1:8000`
(voir `next.config.mjs`) — inutile de configurer CORS ou une URL d'API séparée.

Ouvrir **http://localhost:3000**.

## Comptes de démo

Mot de passe pour tous : `password123`

| Email | Nom | Université | Véhicule |
|---|---|---|---|
| ahmed@ipnet.tg | Ahmed Diallo | IPNET | Moto |
| amara@ul.tg | Amara Kokou | Université de Lomé | Voiture |
| kofi@polytech.tg | Kofi Mensah | Polytechnique | Moto |
| ama@ul.tg | Ama Sefako | Université de Lomé | Voiture |

Tous vérifiés (badge ✅). Pour tester le flux de vérification de documents,
crée un nouveau compte via `/auth/signup` — le statut passe automatiquement
de "En attente" à "Vérifié" après quelques secondes (vérification mockée).

## Fonctionnalités

- Auth JWT (signup multi-étapes avec upload de documents + photo de profil)
- Création de requête + feed avec filtres (départ, destination, horaire ±30min)
- Notifications automatiques aux étudiants vérifiés lors d'une nouvelle requête
- Dashboard de réponses avec confirmation/refus
- Chat en temps réel (polling) avec partage de position et bouton SOS
- Notation mutuelle après trajet complété
- Profil avec historique et statut de vérification
- Mode sombre, responsive mobile-first
