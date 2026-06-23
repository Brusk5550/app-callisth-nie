# Cali — Application de callisthénie progressive

> Prototype statique développé dans le cadre d'un projet de gestion (EAFC).

---

## À propos

**Cali** est une application web d'accompagnement à la pratique de la callisthénie. Elle guide l'utilisateur à travers **4 niveaux de progression** — du débutant à l'élite — grâce à un système de séances guidées et de tests de validation auto-déclaratifs.

Le projet est un **prototype démonstratif** : aucun backend, aucune persistance des données, authentification cosmétique.

---

## Fonctionnalités

| Fonctionnalité | Statut |
|---|---|
| 20 séances réparties sur 4 niveaux | ✅ |
| Mode séance guidé avec timer | ✅ |
| 3 tests de validation inter-niveaux | ✅ |
| Système de déverrouillage progressif | ✅ |
| Glossaire illustré de 39 exercices | ✅ |
| Historique des tests passés | ✅ |
| Authentification cosmétique | ✅ |
| Animations de transition | ✅ |
| Navigation avec historique (retour contextuel) | ✅ |
| Écran de félicitations (niveau Élite) | ✅ |

---

## Niveaux & progression

```
Niveau 1 — Débutant        5 séances × 20-25 min  →  Test 1  →
Niveau 2 — Intermédiaire   5 séances × 30-35 min  →  Test 2  →
Niveau 3 — Avancé          5 séances × 40-50 min  →  Test 3  →
Niveau 4 — Élite           5 séances × 50-60 min
```

Les tests sont **auto-déclaratifs** : l'utilisateur coche les critères accomplis et déclare lui-même sa réussite. Un niveau validé reste accessible librement.

---

## Stack technique

| Élément | Choix |
|---|---|
| Build tool | [Vite.js](https://vitejs.dev/) |
| Langages | HTML · CSS vanilla · JavaScript vanilla |
| Framework JS/CSS | Aucun |
| Données | Fichiers JSON statiques locaux |
| Stockage | Aucun (état en mémoire uniquement) |
| Auth | Cosmétique (tout clic = connexion) |
| Cible de déploiement | GitHub Pages / Netlify / Vercel |

---

## Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/Brusk5550/app-callisth-nie.git
cd app-callisth-nie

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev
```


### Build de production

```bash
npm run build    # génère le dossier dist/
npm run preview  # prévisualise le build
```

---

## Structure du projet

```
app-callisth-nie/
├── index.html
├── vite.config.js
├── package.json
├── CLAUDE.md          # Instructions agent de développement
├── IMAGES.md          # Cahier des charges pour la génération des visuels
└── src/
    ├── main.js                 # Routeur SPA + état applicatif
    ├── styles/
    │   ├── main.css            # Variables CSS, reset, styles partagés
    │   ├── auth.css            # Pages login / register
    │   ├── dashboard.css       # Tableau de bord + nav
    │   ├── niveau.css          # Page détail d'un niveau
    │   ├── seance.css          # Mode séance + timer
    │   ├── test.css            # Page test de validation
    │   ├── glossaire.css       # Glossaire + cartes exercices
    │   └── exercice.css        # Page détail exercice
    ├── pages/
    │   ├── login.js            # Connexion (cosmétique)
    │   ├── register.js         # Inscription (cosmétique)
    │   ├── dashboard.js        # Vue d'ensemble des 4 niveaux
    │   ├── niveau.js           # Séances + test d'un niveau
    │   ├── seance.js           # Mode séance guidé
    │   ├── test.js             # Passation du test de validation
    │   ├── glossaire.js        # Glossaire des 39 exercices
    │   └── exercice.js         # Détail d'un exercice
    ├── components/
    │   ├── nav.js              # Barre de navigation principale
    │   └── timer.js            # Composant countdown (exercice + repos)
    ├── data/
    │   ├── niveaux.json        # Définition des 4 niveaux
    │   ├── seances.json        # 20 séances + 3 tests
    │   └── glossaire.json      # 39 exercices (id, nom, muscles, description)
    └── assets/
        └── exercices/          # Illustrations des exercices (PNG 400×400)
```

---

## Architecture SPA

L'application fonctionne comme une **Single Page Application** sans framework ni modification d'URL. Le routeur dans `main.js` :

- charge les pages via **dynamic import** (code splitting automatique par Vite)
- maintient un **historique de navigation en mémoire** (`state.navHistory`)
- gère les transitions via des classes CSS (`page-exit` / `page-enter`)
- expose `navigate(page, params)` et `goBack()` à toutes les pages

L'état applicatif (progression, historique des tests, session) est stocké **en mémoire uniquement** et se réinitialise au rechargement — conformément aux contraintes du prototype.

---

## Visuels

Les illustrations d'exercices sont des **schémas illustratifs** PNG (400×400 px) :
- fond blanc, trait noir, flèches de direction en rouge uniquement
- un fichier par exercice, nommé selon l'`id` dans `glossaire.json`
- à déposer dans `src/assets/exercices/`

Le fichier [`IMAGES.md`](./IMAGES.md) contient le cahier des charges complet et les prompts pour la génération par IA.

En l'absence d'image, un placeholder `?` s'affiche automatiquement.

---

## Auteurs

Projet réalisé dans le cadre du cours **WEB1 — Conception IA** à l'EAFC.
