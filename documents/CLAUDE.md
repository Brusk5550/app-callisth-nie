# CLAUDE.md — Agent de développement Cali

> Ce fichier est lu automatiquement par Claude Code à chaque session.
> Il constitue le référentiel de travail de l'agent pour le projet Cali.
> **En cas de contradiction entre une instruction en session et ce fichier, ce fichier prime.**
> **En cas de contradiction entre ce fichier et le CDC du projet, le CDC prime.**

---

## 1. Contexte du projet

**Cali** est une application web de callisthénie progressive, développée comme prototype démonstratif dans le cadre d'un projet de gestion de projet.

- **Dépôt GitHub** : https://github.com/Brusk5550/app-callisth-nie
- **Nature** : prototype statique, sans backend, sans base de données réelle
- **Objectif central** : permettre à un utilisateur de progresser à travers 4 niveaux de callisthénie, avec un système de déverrouillage par tests de validation

---

## 2. Stack technique

| Élément | Choix | Remarque |
|---|---|---|
| Outil de build | **Vite.js** | Imposé — ne pas substituer |
| Langages | **HTML / CSS vanilla / JS vanilla** | Pas de framework CSS ni JS |
| Framework JS | Aucun | Pas de React, Vue, Svelte, etc. |
| Framework CSS | Aucun | Pas de Tailwind, Bootstrap, etc. |
| Authentification | Cosmétique uniquement | Tout clic = connexion, sans backend |
| Stockage | Aucun | Pas de localStorage, pas d'IndexedDB |
| Données | Fichiers JSON statiques locaux | Embarqués dans le projet |
| Hébergement cible | Statique | GitHub Pages / Netlify / Vercel |

---

## 3. Règles absolues — à respecter sans exception

### 3.1 Git & versioning

- **Ne jamais exécuter `git commit`, `git push`, `git merge` ou toute commande Git de manière autonome.**
- Lorsqu'un commit est pertinent, **proposer un message de commit** (format Conventional Commits recommandé : `feat:`, `fix:`, `style:`, `docs:`, etc.) et attendre la **validation explicite** de l'utilisateur avant toute action.
- Ne jamais créer de branche, supprimer l'historique ou modifier l'état du dépôt sans demande explicite.

### 3.2 Autonomie & décisions

- **Ne jamais décider à la place de l'utilisateur.**
- Pour chaque décision de code (structure de fichiers, nommage, approche d'implémentation, choix CSS), **présenter les options possibles** avec leurs avantages et inconvénients, puis attendre le choix de l'utilisateur.
- Si une demande en session contredit le CDC, **signaler explicitement la contradiction** et rappeler que le CDC prime — puis proposer une solution conforme au CDC.

### 3.3 Commandes npm

- **Ne jamais lancer `npm install`, `npm run dev`, `npm run build` ou toute commande terminal de manière autonome.**
- Rappeler à l'utilisateur de les exécuter lui-même le cas échéant, avec la commande exacte à taper.

### 3.4 Références & bonnes pratiques

- Toujours se baser sur les **documentations officielles** : MDN Web Docs, documentation Vite.js, spécifications HTML/CSS.
- Respecter les **bonnes pratiques de codage** :
  - Nomenclature cohérente et explicite (kebab-case pour les fichiers CSS/HTML, camelCase pour les variables JS)
  - Séparation des responsabilités (structure / style / comportement)
  - Code lisible, commenté aux endroits non évidents
  - Pas de code mort ni de variables inutilisées
- Respecter les **bonnes pratiques UI/UX** :
  - Hiérarchie visuelle claire
  - Feedback utilisateur systématique (états hover, focus, loading, succès/erreur)
  - Accessibilité de base (attributs `alt`, `aria-label`, contraste suffisant, navigation clavier)
  - Mobile-first ou responsive adapté

---

## 4. Architecture cible du projet

```
app-callisthenie/
├── CLAUDE.md                  # Ce fichier
├── README.md                  # Documentation du projet
├── index.html                 # Point d'entrée HTML
├── vite.config.js             # Configuration Vite
├── package.json
├── src/
│   ├── main.js                # Point d'entrée JavaScript
│   ├── styles/
│   │   ├── main.css           # Styles globaux, variables CSS, reset
│   │   ├── auth.css           # Styles des pages login/register
│   │   ├── dashboard.css      # Styles du tableau de bord
│   │   ├── seance.css         # Styles du mode séance & timer
│   │   └── glossaire.css      # Styles du glossaire
│   ├── pages/
│   │   ├── login.js           # Page de connexion
│   │   ├── register.js        # Page d'inscription
│   │   ├── dashboard.js       # Vue d'ensemble des niveaux
│   │   ├── niveau.js          # Détail d'un niveau (séances + test)
│   │   ├── seance.js          # Mode "séance en cours" avec timer
│   │   ├── test.js            # Mode "test de niveau"
│   │   └── glossaire.js       # Glossaire des exercices
│   ├── components/
│   │   ├── timer.js           # Composant timer (exercice + repos)
│   │   ├── nav.js             # Navigation principale
│   │   ├── exercice-card.js   # Carte d'un exercice
│   │   └── niveau-card.js     # Carte d'un niveau (dashboard)
│   ├── data/
│   │   ├── niveaux.json       # Structure des 4 niveaux
│   │   ├── seances.json       # 20 séances + 3 tests de validation
│   │   └── glossaire.json     # Liste des exercices avec descriptions
│   └── assets/
│       └── exercices/         # ~35-40 schémas illustratifs (PNG/SVG)
└── public/
    └── favicon.ico
```

> Cette architecture est une **proposition de départ**. L'agent doit la soumettre à l'utilisateur et intégrer ses modifications avant de créer les fichiers.

---

## 5. Données métier du projet

### 5.1 Structure des niveaux

| Niveau | Nom | Durée séance | Nb séances | Test inclus |
|---|---|---|---|---|
| 1 | Débutant | 20-25 min | 5 | Oui (6e séance) |
| 2 | Intermédiaire | 30-35 min | 5 | Oui (6e séance) |
| 3 | Avancé | 40-50 min | 5 | Oui (6e séance) |
| 4 | Élite | 50-60 min | 5 | — (niveau final) |

> Les tests de validation sont des **séances distinctes** (la 6e), pas comptées parmi les 5 séances classiques.

### 5.2 Tests de validation

| Transition | Critères |
|---|---|
| Niveau 1 → 2 | 3 tractions strictes + gainage planche 30 sec + 15 pompes strictes |
| Niveau 2 → 3 | 8 tractions strictes + 5 pompes archer (assistées) + L-sit 10 sec |
| Niveau 3 → 4 | 12 tractions strictes + 1 muscle-up strict + front lever tuck 10 sec |

### 5.3 Règles de progression

- Un niveau déverrouillé = accessible librement (relecture + pratique)
- Un niveau non déverrouillé = consultable en lecture seule (pas de lancement de séance)
- L'utilisateur peut **rejouer tout niveau déjà validé**, même après être passé au suivant
- La validation du test est **auto-déclarative** : l'utilisateur confirme lui-même avoir réussi les critères
- Le test peut être repassé à tout moment, même après validation

### 5.4 Authentification (prototype)

- Interface visuelle complète (formulaires login + register avec validation UI)
- **Aucune vérification réelle** : tout clic sur "Se connecter" accède à l'app
- Pas de token, pas de backend, pas de sécurité réelle
- L'état "connecté" est géré **en mémoire uniquement** (réinitialisé au rechargement)
- Le **glossaire est réservé aux utilisateurs connectés** (même cosmétiquement)

---

## 6. Priorités MoSCoW (source : moscow_cali.docx)

### Must — Noyau du prototype (non négociable)

- Les 20 séances des 4 niveaux (5 × 4)
- Les 3 séances de test de validation
- Système de déverrouillage des niveaux par test validé
- Mode "séance en cours" avec timer automatique guidé
- Authentification cosmétique (interface fonctionnelle visuellement)

### Should — Forte valeur ajoutée

- Glossaire illustré des exercices (accès réservé aux connectés)
- Suivi de progression dans le niveau actuel (indicateur visuel X/5 séances)
- Vue "séance du jour" (accès rapide à la prochaine séance)
- Historique des tests passés

### Could — Si le temps le permet

- Indicateur de progression globale (niveau actuel / 4)
- Animations de transition entre les vues
- Mode sombre

### Won't — Hors périmètre prototype

- Persistance des données entre sessions (pas de localStorage)
- Vidéos de démonstration des exercices
- Personnalisation du parcours
- Backend / base de données / API

---

## 7. Assets multimédia

| Critère | Spécification |
|---|---|
| Type | Image fixe (schéma illustratif) |
| Quantité | ~35 à 40 (un par exercice du glossaire) |
| Style | Noir et blanc, silhouette/trait épuré, sans décor |
| Couleur d'accent | Rouge uniquement, pour les flèches de direction |
| Génération | IA (déjà prévu dans le CDC) |
| Stockage | `/src/assets/exercices/` — chargés statiquement par Vite |

---

## 8. Déroulé de la première session

Lors de la toute première session Claude Code dans ce projet, l'agent doit :

1. **Confirmer la lecture de ce fichier** et signaler toute incohérence détectée
2. **Proposer un plan d'initialisation** de l'environnement de travail :
   - Init du dépôt local connecté à `https://github.com/Brusk5550/app-callisth-nie`
   - Scaffold ViteJS (HTML/CSS/JS vanilla)
   - Structure de dossiers conforme à la section 4
   - README.md initial
3. **Attendre la validation** de l'utilisateur avant de créer le moindre fichier
4. **Rappeler** à l'utilisateur de lancer `npm install` puis `npm run dev` après le scaffold

---

## 9. Format de communication de l'agent

- Toujours répondre en **français**
- Pour les décisions : présenter les options sous forme de liste numérotée, avec pour chacune ses avantages et ses limites
- Pour les suggestions de commit : format `type(scope): description courte` (Conventional Commits)
- Pour les rappels de commandes : toujours afficher la commande exacte dans un bloc de code
- Ne pas reformuler ce que l'utilisateur vient de dire — aller directement à l'essentiel
