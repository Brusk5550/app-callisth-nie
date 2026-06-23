# Génération des images — Glossaire Cali

## Contexte

L'application Cali affiche une image illustrative pour chacun des **39 exercices** du glossaire.  
Les images sont chargées statiquement par Vite depuis `/src/assets/exercices/`.

---

## Spécifications visuelles (à respecter strictement)

| Critère | Valeur |
|---|---|
| Style | Schéma illustratif — silhouette humaine en trait épuré, sans décor ni fond |
| Couleurs | **Noir et blanc uniquement** — traits noirs sur fond blanc |
| Couleur d'accent | **Rouge uniquement**, réservé aux flèches indiquant la direction du mouvement |
| Format de fichier | PNG |
| Dimensions recommandées | 400 × 400 px minimum, ratio carré |
| Fond | Blanc uni (`#FFFFFF`) |
| Trait | Contour net, silhouette lisible — pas de réalisme photographique |
| Texte | Aucun texte dans l'image |

### Exemple de prompt type (à adapter par exercice)

> Minimalist black and white instructional diagram of a person doing **[NOM DE L'EXERCICE]**.  
> Clean line art, white background, no text, no shading, no decoration.  
> Red arrows only to indicate the direction of movement.  
> Style: calisthenics exercise schematic illustration.

---

## Nommage des fichiers

Le nom du fichier doit correspondre **exactement** à la valeur du champ `"image"` dans `glossaire.json`.  
Toutes les images vont dans : `src/assets/exercices/`

---

## Liste complète des 39 exercices

### Poussée (9 exercices)

| Fichier à générer | Exercice | Niveau min | Mouvement clé |
|---|---|---|---|
| `pompes-genoux.png` | Pompes genoux | Débutant | Pompe en appui sur les genoux, coudes à 45°, corps aligné genoux→épaules |
| `pompes-strictes.png` | Pompes strictes | Débutant | Pompe classique, corps rigide des pieds aux épaules, amplitude complète |
| `pompes-diamant.png` | Pompes diamant | Intermédiaire | Mains formant un losange sous la poitrine, coudes serrés le long du corps |
| `pompes-decline.png` | Pompes déclinées | Intermédiaire | Pieds sur une chaise, mains au sol, corps incliné tête en bas |
| `pompes-pike.png` | Pompes pike | Débutant | Hanches levées en V inversé, tête descend entre les mains |
| `pompes-pike-elevation.png` | Pompes pike sur élévation | Avancé | Idem pike mais pieds sur une surface surélevée, angle plus vertical |
| `pompes-piques.png` | Pompes piquées (HSPU) | Élite | Équilibre sur les mains dos au mur, descente de la tête vers le sol |
| `pompes-archer.png` | Pompes archer | Avancé | Une main sous l'épaule, l'autre tendue sur le côté — pompe unilatérale |
| `pseudo-planche-push-up.png` | Pseudo planche push-up | Élite | Pompe avec mains au niveau des hanches, doigts vers les pieds, corps incliné en avant |
| `dips-chaise.png` | Dips sur chaise | Débutant | Mains sur le bord d'une chaise, dos proche, descente à 90° des coudes |
| `dips-paralleles.png` | Dips parallèles | Intermédiaire | Entre deux barres parallèles, corps légèrement penché, descente à 90° |
| `dips-profonds.png` | Dips profonds | Avancé | Dips avec amplitude maximale, épaules descendant sous les coudes |
| `dips-lestes.png` | Dips lestés | Avancé | Dips sur barres avec ceinture lestée visible autour de la taille |

### Traction (11 exercices)

| Fichier à générer | Exercice | Niveau min | Mouvement clé |
|---|---|---|---|
| `rowing-table.png` | Rowing sur table | Débutant | Allongé sous une table, bras tirant le buste vers le plateau |
| `tractions-assistees.png` | Tractions assistées à la bande | Débutant | Barre en hauteur, bande élastique sous les genoux, traction assistée |
| `tractions-prise-large.png` | Tractions prise large | Intermédiaire | Prise pronation large, coudes tirés vers le bas et l'extérieur |
| `tractions-prise-serree.png` | Tractions prise serrée | Intermédiaire | Prise pronation resserrée, mains proches au centre de la barre |
| `tractions-supination.png` | Tractions en supination (chin-up) | Intermédiaire | Prise supination (paumes vers soi), largeur d'épaules |
| `tractions-lestees.png` | Tractions lestées | Avancé | Traction classique avec ceinture lestée visible autour de la taille |
| `tractions-tempo.png` | Tractions tempo | Avancé | Traction avec flèches rouges indiquant montée lente / descente lente |
| `tractions-explosives.png` | Tractions explosives | Avancé | Traction avec flèches rouges vers le haut, corps dépassant la barre |
| `deadhang.png` | Deadhang | Débutant | Suspension passive à la barre, bras tendus, épaules légèrement actives |
| `rowing-anneau.png` | Rowing sur anneaux | Avancé | Rowing incliné sur anneaux ou TRX, corps à 45° |
| `tractions-front-lever.png` | Tractions front lever | Avancé | Position front lever tuck (genoux ramenés, corps horizontal) + mouvement de traction |

### Gainage (7 exercices)

| Fichier à générer | Exercice | Niveau min | Mouvement clé |
|---|---|---|---|
| `superman.png` | Superman | Débutant | Ventre au sol, bras et jambes levés simultanément, flèches rouges vers le haut |
| `gainage-frontal.png` | Gainage frontal | Débutant | Appui sur avant-bras et orteils, corps rectiligne, vue de profil |
| `gainage-lateral.png` | Gainage latéral | Débutant | Appui sur un avant-bras, corps de profil, hanche levée |
| `hollow-body-hold.png` | Hollow body hold | Intermédiaire | Allongé sur le dos, dos plaqué, bras et jambes décollés à 15-20 cm du sol |
| `dragon-flag-negatif.png` | Dragon flag négatif | Intermédiaire | Sur un banc, corps vertical tenant l'arrière du banc, descente lente — flèche rouge vers le bas |
| `l-sit-progression.png` | L-sit progression (jambes pliées) | Intermédiaire | Appui sur les mains au sol, genoux remontés, fessiers décollés |
| `l-sit.png` | L-sit | Avancé | Appui sur les mains, jambes tendues horizontales formant un L parfait |
| `l-sit-v-sit.png` | L-sit vers V-sit | Élite | Appui sur les mains, jambes tendues au-dessus de l'horizontale formant un V |

### Skills (7 exercices)

| Fichier à générer | Exercice | Niveau min | Mouvement clé |
|---|---|---|---|
| `front-lever-tuck.png` | Front lever tuck | Avancé | Suspendu à la barre, genoux ramenés, corps horizontal, face vers le ciel |
| `front-lever-avance.png` | Front lever avancé | Élite | Idem mais une jambe tendue, l'autre pliée |
| `muscle-up-bande.png` | Muscle-up à la bande | Avancé | Bande sous les pieds, passage explosif de la traction aux dips en séquence |
| `muscle-up-barre.png` | Muscle-up à la barre | Élite | Passage explosif au-dessus d'une barre horizontale — séquence traction + dip |
| `muscle-up-anneaux.png` | Muscle-up aux anneaux | Élite | Idem muscle-up mais sur anneaux de gymnastique |
| `planche-tuck.png` | Planche tuck | Élite | Appui sur les mains, genoux ramenés, épaules en avant de les mains, corps incliné |
| `back-lever-tuck.png` | Back lever tuck | Élite | Suspendu à la barre, corps horizontal face au sol, genoux ramenés |

### Jambes (2 exercices)

| Fichier à générer | Exercice | Niveau min | Mouvement clé |
|---|---|---|---|
| `squat.png` | Squat | Débutant | Descente cuisses parallèles au sol, genoux dans l'axe des orteils, dos droit |
| `fentes-alternees.png` | Fentes alternées | Débutant | Grand pas en avant, genou arrière proche du sol, flèche rouge vers le bas |

---

## Checklist de livraison

- [ ] 39 fichiers PNG générés
- [ ] Noms de fichiers identiques à la colonne "Fichier à générer" (respect de la casse, tirets)
- [ ] Fond blanc uni sur chaque image
- [ ] Aucun texte intégré dans les images
- [ ] Flèches en rouge uniquement pour les directions de mouvement
- [ ] Images déposées dans `src/assets/exercices/`

---

## Intégration dans l'app

L'app charge les images avec ce chemin :

```html
<img src="/src/assets/exercices/[nom-du-fichier].png" alt="..." />
```

En cas d'image manquante, un placeholder `?` s'affiche automatiquement — aucune erreur ne bloque l'interface.
