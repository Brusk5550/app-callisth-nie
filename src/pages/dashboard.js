/**
 * dashboard.js — Vue d'ensemble des niveaux
 */

import { navigate, logout } from '../main.js'
import { createNav } from '../components/nav.js'
import { createNiveauCard } from '../components/niveau-card.js'
import niveaux from '../data/niveaux.json'
import '../styles/dashboard.css'

export function render(container, params, state) {
  container.innerHTML = ''

  // ── Navigation ────────────────────────────────────────────────────────────
  createNav(container, state, {
    onGlossaire: () => navigate('glossaire'),
    onLogout: () => logout(),
  })

  // ── Contenu principal ─────────────────────────────────────────────────────
  const main = document.createElement('main')
  main.className = 'dashboard'

  // En-tête
  const header = document.createElement('header')
  header.className = 'dashboard__header'
  header.innerHTML = `
    <h1 class="dashboard__title">Tableau de bord</h1>
    <p class="dashboard__subtitle">Suis ta progression et lance ta prochaine séance.</p>
  `
  main.appendChild(header)

  // Bannière "séance du jour"
  const niveauActif = state.progression.niveaux.find(n => n.debloque && n.seancesCompletees < 5)
  if (niveauActif) {
    const niveauData = niveaux.find(n => n.id === niveauActif.id)
    const prochaine = niveauActif.seancesCompletees + 1

    const banner = document.createElement('section')
    banner.className = 'dashboard__banner'
    banner.innerHTML = `
      <div class="banner-content">
        <div>
          <p class="banner-label">Séance du jour</p>
          <p class="banner-title">Niveau ${niveauData.id} · Séance ${prochaine}</p>
          <p class="banner-meta">${niveauData.dureeSéance}</p>
        </div>
        <button type="button" class="btn btn--primary" id="btn-seance-du-jour">
          Commencer
        </button>
      </div>
    `
    banner.querySelector('#btn-seance-du-jour').addEventListener('click', () => {
      navigate('seance', { niveauId: niveauData.id, seanceNum: prochaine })
    })
    main.appendChild(banner)
  }

  // Grille des niveaux
  const section = document.createElement('section')
  section.className = 'dashboard__niveaux'
  section.setAttribute('aria-label', 'Niveaux disponibles')

  const grid = document.createElement('div')
  grid.className = 'niveaux-grid'

  niveaux.forEach(niveau => {
    const progression = state.progression.niveaux.find(n => n.id === niveau.id)
    const card = createNiveauCard(niveau, progression, () => {
      navigate('niveau', { niveauId: niveau.id })
    })
    grid.appendChild(card)
  })

  section.appendChild(grid)
  main.appendChild(section)
  container.appendChild(main)
}
