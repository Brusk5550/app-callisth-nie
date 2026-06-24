# Journal de prompting — Projet Cali

> Ce journal retrace les interactions clés avec l'IA (Claude, Anthropic) au cours du développement du prototype Cali. Il documente les prompts significatifs, les itérations, les succès et les échecs.

---

## Méthode générale

L'IA a été utilisée comme **agent de développement principal**, pilotée via Cowork (interface desktop Claude). Un fichier `CLAUDE.md` a été rédigé en amont pour cadrer le comportement de l'agent : stack technique imposée (Vite + HTML/CSS/JS vanilla), règles Git, format de communication, architecture cible.

L'utilisateur formulait les demandes en langage naturel (souvent en français, parfois approximatif) — l'agent interprétait l'intention, proposait des options si nécessaire, puis implémentait.

---

## Phase 1 — Cadrage et initialisation

### Prompt clé
> *"Voici le cahier des charges du projet. Crée le CLAUDE.md qui servira de référentiel à l'agent pour toute la durée du projet."*

**Ce qui a fonctionné :** Rédiger le `CLAUDE.md` avant toute session de code s'est révélé déterminant. L'agent s'y référait systématiquement pour trancher les ambiguïtés (ex. : pas de framework, pas de localStorage, cosmétique auth).

**Itération :** La première version du CLAUDE.md était trop vague sur la gestion de l'état. Ajout d'une règle explicite : *"état géré en mémoire uniquement, réinitialisé au rechargement"*.

---

## Phase 2 — Scaffold et architecture

### Prompt clé
> *"Initialise le projet Vite avec la structure de dossiers définie dans le CLAUDE.md, sans créer les fichiers de contenu."*

**Ce qui a fonctionné :** Demander le scaffold en deux temps (structure d'abord, contenu ensuite) a évité de valider une mauvaise organisation dès le départ. L'agent a proposé l'arborescence complète et attendu la validation.

**Ce qui n'a pas fonctionné :** Le premier scaffold incluait un `index.css` à la racine au lieu de `src/styles/main.css` — corrigé par une relecture de la structure avant de peupler les fichiers.

---

## Phase 3 — Données métier (JSON)

### Prompt clé
> *"Génère les 20 séances réparties sur 4 niveaux + les 3 tests de validation, selon les règles du CLAUDE.md."*

**Ce qui a fonctionné :** Fournir les critères des tests directement dans le CLAUDE.md (ex. : "3 tractions + gainage 30 sec + 15 pompes pour passer N1→N2") a permis à l'agent de produire des données cohérentes sans reformulation.

**Itération :** Le premier `seances.json` généré ne respectait pas le ratio exercices/repos par séance. Prompt correctif :
> *"Les séances de niveau 1 doivent faire 20-25 min. Recalcule les durées en tenant compte des temps de repos entre séries."*

**Ce qui n'a pas fonctionné :** La première version du `glossaire.json` avait des noms d'exercices qui ne correspondaient pas exactement aux noms utilisés dans `seances.json`, cassant le système de lien glossaire ↔ séance. Résolu en normalisant les noms via une fonction JS (`nomNorm`).

---

## Phase 4 — Routeur et navigation

### Prompt clé
> *"Implémente un routeur SPA en JS vanilla : navigate(page, params), gestion de l'état en mémoire, sans URL change."*

**Ce qui a fonctionné :** Décrire le comportement attendu (pas de rechargement, params passés en mémoire, état global unique) plutôt que de demander une implémentation technique précise. L'agent a proposé le pattern `state` centralisé avec `navigate()` exporté.

**Itération — historique de navigation :**
> *"Il faut que peux importe ou l'on se trouve sur le site, la flèche retour ramène à l'écrant sur le quel on était."*

L'agent a ajouté une pile `navHistory: []` dans le state et une fonction `goBack()` qui dépile. Première version : le retour depuis login/register empilait ces pages dans l'historique, créant des boucles. Corrigé en excluant login et register de l'empilement.

**Scroll au changement de page — prompt :**
> *"Il faut que lorsque je clique sur un lien, je sois directement au dessus de la page."*

Ajout d'un `window.scrollTo({ top: 0, behavior: 'instant' })` dans `navigate()` avant le rendu — solution en une ligne, zéro itération.

---

## Phase 5 — Pages et composants

### Timer — prompt clé
> *"Dans les exercices, il faut que les timers soit activés par un bouton par l'utilisateur au départ, et ensuite les autres s'enchaines pour respecter les timing de repos."*

**Ce qui a fonctionné :** La description du comportement attendu (démarrage manuel pour la préparation, automatique ensuite) était suffisamment claire pour que l'agent produise la logique du premier coup : affichage d'un bouton "Démarrer", puis enchaînement automatique des timers de repos.

**Itération :** Les boutons Pause/Terminé n'apparaissaient pas après le clic sur "Démarrer" car `controlsEl.innerHTML` était réinitialisé au mauvais moment. Corrigé en injectant les nouveaux boutons dans le callback du clic.

---

### Lien glossaire depuis une séance — prompt clé
> *"Dans la passation des exercices, il faut rajouter les liens vers l'élément du glossaire relié à l'exo."*

**Ce qui a fonctionné :** L'agent a proposé une normalisation des noms (`nomNorm`) pour faire correspondre les noms d'exercices dans `seances.json` et `glossaire.json` malgré des formulations légèrement différentes.

**Ce qui n'a pas fonctionné :** 3 exercices n'avaient pas de correspondance exacte (casse ou ponctuation différente). Résolu en ajoutant un fallback silencieux (pas de bouton affiché si aucun match).

---

### Écran de félicitations — prompt clé
> *"Rajoutons un écran de félicitation lorsque l'on finit le dernier test, dans lequel on leur raconte que ce n'est que le commencement de leur voyage dans la calisthénie mais en les encourageant."*

**Ce qui a fonctionné :** La demande incluait le ton attendu (encourageant, bienveillant). L'agent a rédigé les textes directement. Aucune correction nécessaire sur le fond.

**Itération technique :** Détecter le "dernier test" était subtil — le niveau 4 existe (Élite), donc `niveauSuivant` n'est jamais null. L'agent a résolu en vérifiant l'absence d'un niveau `id + 2` : `!niveaux.find(n => n.id === niveauSuivant.id + 1)`.

---

## Phase 6 — Génération des assets visuels

### Prompt clé
> *"Génère les images selon le fichier IMAGES.md."*

**Contexte :** L'agent a d'abord créé `IMAGES.md` (cahier des charges des visuels) lors d'une session précédente, à la demande :
> *"On commit puis tu crées un .md pour que l'un de tes collègues puisse générer les images."*

**Ce qui a fonctionné :** Rédiger les specs visuelles dans un fichier dédié avant de lancer la génération. L'agent a produit un script Python (Pillow) générant 41 PNG de façon programmatique.

**Ce qui n'a pas fonctionné :**
- Première tentative avec `cairosvg` — bibliothèque indisponible dans le sandbox. Pivot vers PIL pur.
- Demande d'une image "réaliste" :
  > *"Refait une des images mais en style réaliste."*
  L'agent a tenté une version avec PIL en niveaux de gris plus détaillée — le résultat restait schématique, le rendu réaliste étant impossible avec PIL seul. Conclusion : PIL est adapté aux schémas, pas au photoréalisme. Les images réalistes nécessiteraient un modèle de diffusion (Midjourney, DALL·E, etc.).

**Stratégie placeholder :**
> *"Pour le moment renomme le dossier image en deprecated_[nom du dossier] mais sans changer les liens des images."*

En renommant le dossier source, toutes les balises `<img>` déclenchent leur `onerror`, affichant automatiquement le `?` placeholder. Solution élégante : zéro modification du code applicatif.

---

## Phase 7 — Corrections et polish

### Centrage des cartes glossaire
**Problème rapporté :** *"En mode desktop les placeholders / images ne sont pas centrés dans les cartes."*

**Première hypothèse (incorrecte) :** Problème de centrage du `::after` pseudo-élément — ajout de `position: absolute`. Cela a déplacé le `?` au centre de l'écran sur certaines pages car les conteneurs n'avaient pas tous `position: relative`. **Annulé.**

**Bonne hypothèse :** Le `<button>` dans une grille CSS stretche la carte mais sans layout flex interne, l'espace excédentaire se répartit de façon imprévisible. Fix : `display: flex; flex-direction: column` sur `.exercice-card` + `flex-shrink: 0` sur la zone image.

**Apprentissage :** Demander une capture d'écran avant d'implémenter aurait évité la première itération incorrecte.

---

### Progression 5/5 après test validé
**Problème rapporté :** *"Si l'utilisateur a directement fait le test et réussi, le suivi du niveau doit afficher complet (5/5 séances)."*

**Fix immédiat :** Dans `_debloquerNiveauSuivant()`, ajouter `courant.seancesCompletees = 5` avant de débloquer le niveau suivant. Une ligne, zéro itération.

---

## Bilan global

### Ce qui a bien fonctionné
- Le `CLAUDE.md` comme contrat de session : l'agent s'y référait sans qu'on ait besoin de rappeler les contraintes à chaque fois
- Les prompts de comportement plutôt que de technique ("je veux que ça fasse X" plutôt que "implémente un pattern Y")
- La séparation scaffolding / données / UI en phases successives
- Les demandes de validation avant implémentation (aucun fichier créé sans accord)

### Ce qui a nécessité des itérations
- Les correspondances de noms entre fichiers JSON (normalisation nécessaire)
- La détection du "dernier test" (logique non triviale)
- Le diagnostic des bugs CSS (nécessite une capture d'écran pour éviter les fausses pistes)

### Ce qui n'a pas fonctionné
- La génération d'images réalistes avec PIL — outil inadapté au rendu photoréaliste
- Les premières tentatives de centrage CSS basées sur une hypothèse incorrecte

### Recommandations pour un prochain projet
1. Rédiger le `CLAUDE.md` / fichier de contraintes **avant** la première session de code
2. Valider les structures de données (JSON) **avant** d'implémenter les pages qui en dépendent
3. Fournir une capture d'écran pour tout bug visuel — évite les corrections "à l'aveugle"
4. Pour les assets visuels, prévoir un outil dédié (modèle de diffusion) si le style réaliste est requis
