/**
 * exercice.js — Page de détail d'un exercice du glossaire
 *
 * @param {object} params - { exerciceId: string }
 */

import { navigate, goBack, logout } from '../main.js'
import { createNav } from '../components/nav.js'
import exercices from '../data/glossaire.json'
import '../styles/exercice.css'

const NIVEAUX_LABELS = ['', 'Débutant', 'Intermédiaire', 'Avancé', 'Élite']

const CATEGORIE_LABELS = {
  poussee:  'Poussée',
  traction: 'Traction',
  gainage:  'Gainage',
  skill:    'Skill',
  jambes:   'Jambes',
}

export function render(container, params, state) {
  const ex = exercices.find(e => e.id === params.exerciceId)

  if (!ex) {
    container.innerHTML = `<p>Exercice introuvable.</p>`
    return
  }

  // Exercices liés (même catégorie, différent)
  const lies = exercices
    .filter(e => e.categorie === ex.categorie && e.id !== ex.id)
    .slice(0, 3)

  container.innerHTML = ''

  createNav(container, state, {
    onHome:      () => navigate('dashboard'),
    onGlossaire: () => navigate('glossaire'),
    onLogout:    () => logout(),
  })

  const main = document.createElement('main')
  main.className = 'exercice-page'

  main.innerHTML = `
    <div class="exercice-layout">

      <button type="button" class="btn-back" id="btn-retour" aria-label="Retour">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="back-icon" aria-hidden="true">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>

      <div class="exercice-hero">

        <!-- Image -->
        <div class="exercice-hero__image" id="hero-image">
          <img
            src="/src/assets/exercices/${ex.image}"
            alt="Schéma de l'exercice ${ex.nom}"
            onerror="this.parentElement.classList.add('exercice-hero__image--placeholder')"
          />
        </div>

        <!-- Infos -->
        <div class="exercice-hero__info">
          <div class="exercice-hero__tags">
            <span class="exercice-tag exercice-tag--cat">${CATEGORIE_LABELS[ex.categorie] ?? ex.categorie}</span>
            <span class="exercice-tag exercice-tag--niveau">Niv. ${ex.niveauMin} — ${NIVEAUX_LABELS[ex.niveauMin]}</span>
          </div>

          <h1 class="exercice-hero__nom">${ex.nom}</h1>

          <p class="exercice-hero__desc">${ex.description}</p>

          <div class="exercice-muscles">
            <h2 class="exercice-muscles__title">Muscles ciblés</h2>
            <ul class="exercice-muscles__list" role="list">
              ${ex.muscles.map(m => `<li class="muscle-tag">${m}</li>`).join('')}
            </ul>
          </div>
        </div>

      </div>

      <!-- Exercices liés -->
      ${lies.length > 0 ? `
        <section class="exercices-lies" aria-label="Exercices similaires">
          <h2 class="exercices-lies__title">Dans la même catégorie</h2>
          <div class="exercices-lies__grid" id="lies-grid"></div>
        </section>
      ` : ''}

    </div>
  `

  container.appendChild(main)

  main.querySelector('#btn-retour').addEventListener('click', () => goBack())

  // Exercices liés
  if (lies.length > 0) {
    const grid = main.querySelector('#lies-grid')
    lies.forEach(e => {
      const card = document.createElement('button')
      card.type = 'button'
      card.className = 'lie-card'
      card.setAttribute('aria-label', `Voir ${e.nom}`)
      card.innerHTML = `
        <div class="lie-card__image">
          <img
            src="/src/assets/exercices/${e.image}"
            alt=""
            loading="lazy"
            onerror="this.parentElement.classList.add('lie-card__image--placeholder')"
          />
        </div>
        <p class="lie-card__nom">${e.nom}</p>
        <p class="lie-card__niveau">Niv. ${e.niveauMin} — ${NIVEAUX_LABELS[e.niveauMin]}</p>
      `
      card.addEventListener('click', () => navigate('exercice', { exerciceId: e.id }))
      grid.appendChild(card)
    })
  }
}
