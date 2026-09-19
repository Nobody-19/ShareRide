# ShareRide — Covoiturage étudiant pour le Togo 🇹🇬

**Le covoiturage qui reste entre étudiants.**

Plateforme de covoiturage étudiant basée sur un système de **matching par requête** :
un étudiant poste une requête ("Je vais à l'Université de Lomé, départ 7h00"),
les autres étudiants vérifiés sur ce trajet sont notifiés et peuvent répondre
"Je peux t'aider". L'étudiant choisit une réponse, confirme, puis coordonne le
trajet via un chat intégré.

Pour donner une vraie raison à un étudiant véhiculé de s'arrêter, ShareRide calcule
un **prix indicatif fixé à 50 % du tarif taxi habituel** du trajet (ex. 500 FCFA en
taxi → 250 FCFA sur ShareRide), réglé en direct entre les deux étudiants (cash ou
Mobile Money) — la plateforme ne prend aucune commission.

🔗 **Site vitrine** : https://nobody-19.github.io/ShareRide/
🔗 **Démo en ligne** : voir la section [Démo en ligne](#démo-en-ligne) ci-dessous (dispo pendant les sessions de démonstration)

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

## Démo en ligne

Pendant les sessions de démonstration, le prototype tourne en local et est exposé
publiquement via un tunnel Ngrok. Ce lien est temporaire (il expire à la fermeture
du tunnel) — hors démo, utilise les instructions ci-dessus pour lancer le projet
localement, ou consulte le [site vitrine](https://nobody-19.github.io/ShareRide/)
qui reste accessible en permanence.

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

- **Prix incitatif automatique** : à la publication d'une requête, l'étudiant indique
  le tarif taxi habituel de son trajet ; ShareRide affiche aussitôt un prix suggéré à
  50 % de ce tarif, visible sur le fil de trajets, la fiche détaillée et le dashboard
- Auth JWT (signup multi-étapes avec upload de documents + photo de profil)
- Création de requête + feed avec filtres (départ, destination, horaire ±30min)
- Notifications automatiques aux étudiants vérifiés déjà présents sur ce trajet
  (requête ou réponse antérieure sur le même départ/destination)
- Dashboard de réponses avec confirmation/refus
- Chat en temps réel (polling) avec partage de position et bouton SOS
- Notation mutuelle après trajet complété
- Profil avec historique et statut de vérification
- Mode sombre, responsive mobile-first

## Documents du projet

- `ShareRide_Document_Explicatif_*.docx` — document explicatif complet (problème,
  solution, fonctionnalités, captures du prototype)
- `ShareRide_Presentation_*.pptx` — présentation de pitch (8 slides)

Ces fichiers sont générés localement et ne sont pas versionnés dans ce dépôt ;
demande-les à l'équipe si besoin.

## Équipe — 404_Found

| Nom | Rôle |
|---|---|
| DAOU R. Kris | Chef d'équipe · Développeur Backend |
| KOFFI Kouamba Joséphine | Développeuse Frontend · Licence 3 |
| RUTH KAESLYN Abomo Niobe | Développeuse Backend · Licence 3 |
| ALIBI Guy E. | Développeur Frontend |
