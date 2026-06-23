/**
 * glossaire.js — Glossaire illustré des exercices
 *
 * Accessible uniquement aux utilisateurs connectés (garde dans main.js).
 * Filtre par catégorie + recherche textuelle.
 */

import { navigate, goBack, logout } from '../main.js'
import { createNav } from '../components/nav.js'
import exercices from '../data/glossaire.json'
import '../styles/glossaire.css'

const CATEGORIES = [
  { id: 'tous',    label: 'Tous' },
  { id: 'poussee', label: 'Poussée' },
  { id: 'traction', label: 'Traction' },
  { id: 'gainage', label: 'Gainage' },
  { id: 'skill',   label: 'Skills' },
  { id: 'jambes',  label: 'Jambes' },
]

export function render(container, params, state) {
  container.innerHTML = ''

  createNav(container, state, {
    onHome: () => navigate('dashboard'),
    onGlossaire: () => {},
    onLogout: () => logout(),
  })

  const main = document.createElement('main')
  main.className = 'glossaire-page'
  main.innerHTML = `
    <div class="glossaire-layout">

      <header class="glossaire-header">
        <button type="button" class="btn-back" id="btn-retour" aria-label="Retour">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="back-icon" aria-hidden="true">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h1 class="glossaire-title">Glossaire</h1>
        <p class="glossaire-subtitle">${exercices.length} exercices — descriptions et muscles ciblés.</p>
      </header>

      <!-- Barre de recherche -->
      <div class="glossaire-search-wrap">
        <label class="sr-only" for="search-input">Rechercher un exercice</label>
        <input
          class="glossaire-search"
          type="search"
          id="search-input"
          placeholder="Rechercher un exercice…"
          autocomplete="off"
        />
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </div>

      <!-- Filtres catégorie -->
      <div class="glossaire-filters" role="group" aria-label="Filtrer par catégorie">
        ${CATEGORIES.map(c => `
          <button
            type="button"
            class="filter-btn${c.id === 'tous' ? ' filter-btn--active' : ''}"
            data-categorie="${c.id}"
          >${c.label}</button>
        `).join('')}
      </div>

      <!-- Compteur -->
      <p class="glossaire-count" id="glossaire-count" aria-live="polite"></p>

      <!-- Grille -->
      <div class="glossaire-grid" id="glossaire-grid" role="list"></div>

    </div>
  `

  container.appendChild(main)

  main.querySelector('#btn-retour').addEventListener('click', () => goBack())

  // État des filtres
  let categorieActive = 'tous'
  let recherche = ''

  const gridEl   = main.querySelector('#glossaire-grid')
  const countEl  = main.querySelector('#glossaire-count')
  const searchEl = main.querySelector('#search-input')

  function _update() {
    const filtered = exercices.filter(ex => {
      const matchCat = categorieActive === 'tous' || ex.categorie === categorieActive
      const matchSearch = ex.nom.toLowerCase().includes(recherche) ||
                          ex.muscles.some(m => m.toLowerCase().includes(recherche))
      return matchCat && matchSearch
    })

    countEl.textContent = `${filtered.length} exercice${filtered.length > 1 ? 's' : ''}`
    gridEl.innerHTML = ''

    if (filtered.length === 0) {
      gridEl.innerHTML = `<p class="glossaire-empty">Aucun exercice trouvé.</p>`
      return
    }

    filtered.forEach(ex => gridEl.appendChild(_createCard(ex)))
  }

  // Filtres
  main.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      main.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-btn--active'))
      btn.classList.add('filter-btn--active')
      categorieActive = btn.dataset.categorie
      _update()
    })
  })

  // Recherche
  searchEl.addEventListener('input', () => {
    recherche = searchEl.value.trim().toLowerCase()
    _update()
  })

  _update()
}

// ── Carte exercice ────────────────────────────────────────────────────────────

function _createCard(ex) {
  const card = document.createElement('button')
  card.type = 'button'
  card.className = 'exercice-card'
  card.setAttribute('role', 'listitem')
  card.setAttribute('aria-label', `Voir ${ex.nom}`)
  card.addEventListener('click', () => navigate('exercice', { exerciceId: ex.id }))

  const niveauLabel = ['', 'Débutant', 'Intermédiaire', 'Avancé', 'Élite'][ex.niveauMin] ?? ''

  card.innerHTML = `
    <div class="exercice-card__image">
      <img
        src="/src/assets/exercices/${ex.image}"
        alt="Schéma de l'exercice ${ex.nom}"
        loading="lazy"
        onerror="this.parentElement.classList.add('exercice-card__image--placeholder')"
      />
      <span class="exercice-card__categorie">${_labelCategorie(ex.categorie)}</span>
    </div>
    <div class="exercice-card__body">
      <div class="exercice-card__meta">
        <span class="exercice-card__niveau">Niv. ${ex.niveauMin} — ${niveauLabel}</span>
      </div>
      <h2 class="exercice-card__nom">${ex.nom}</h2>
      <p class="exercice-card__desc">${ex.description}</p>
      <ul class="exercice-card__muscles" aria-label="Muscles ciblés">
        ${ex.muscles.map(m => `<li class="muscle-tag">${m}</li>`).join('')}
      </ul>
    </div>
  `

  return card
}

function _labelCategorie(id) {
  const map = { poussee: 'Poussée', traction: 'Traction', gainage: 'Gainage', skill: 'Skill', jambes: 'Jambes' }
  return map[id] ?? id
}
