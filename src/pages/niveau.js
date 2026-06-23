/**
 * niveau.js — Détail d'un niveau
 *
 * Affiche les 5 séances + le test de validation.
 * Si le niveau est verrouillé : lecture seule, pas de lancement.
 *
 * @param {object} params - { niveauId: number }
 */

import { navigate, logout } from '../main.js'
import { createNav } from '../components/nav.js'
import niveaux from '../data/niveaux.json'
import seances from '../data/seances.json'
import '../styles/niveau.css'

export function render(container, params, state) {
  const niveauId = params.niveauId ?? 1
  const niveauData = niveaux.find(n => n.id === niveauId)
  const progression = state.progression.niveaux.find(n => n.id === niveauId)

  if (!niveauData) {
    container.innerHTML = `<p>Niveau introuvable.</p>`
    return
  }

  const debloque = progression.debloque
  const seancesNiveau = seances.filter(s => s.niveauId === niveauId && s.type === 'seance')
  const testNiveau = seances.find(s => s.niveauId === niveauId && s.type === 'test')

  container.innerHTML = ''

  // ── Navigation ────────────────────────────────────────────────────────────
  createNav(container, state, {
    onGlossaire: () => navigate('glossaire'),
    onLogout: () => logout(),
  })

  // ── Contenu principal ─────────────────────────────────────────────────────
  const main = document.createElement('main')
  main.className = 'niveau-page'

  // Bouton retour
  const back = document.createElement('button')
  back.type = 'button'
  back.className = 'btn-back'
  back.setAttribute('aria-label', 'Retour au tableau de bord')
  back.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="back-icon" aria-hidden="true">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
    Tableau de bord
  `
  back.addEventListener('click', () => navigate('dashboard'))
  main.appendChild(back)

  // En-tête du niveau
  const header = document.createElement('header')
  header.className = 'niveau-header'
  header.innerHTML = `
    <div class="niveau-header__meta">
      <span class="niveau-header__num">Niveau ${niveauData.id}</span>
      ${!debloque ? `
        <span class="niveau-header__locked-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-lock-sm" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Verrouillé
        </span>
      ` : ''}
    </div>
    <h1 class="niveau-header__title">${niveauData.nom}</h1>
    <p class="niveau-header__info">${niveauData.dureeSéance} par séance · ${niveauData.nbSeances} séances + 1 test</p>
    ${debloque ? `
      <div class="niveau-header__progress">
        <div class="progress-bar">
          <div class="progress-bar__fill" style="width: ${Math.round((progression.seancesCompletees / 5) * 100)}%"></div>
        </div>
        <span class="progress-label">${progression.seancesCompletees} / 5 séances complétées</span>
      </div>
    ` : `
      <p class="niveau-header__locked-msg">Valide le test du niveau précédent pour débloquer ce niveau.</p>
    `}
  `
  main.appendChild(header)

  // Liste des séances
  const section = document.createElement('section')
  section.className = 'niveau-seances'
  section.setAttribute('aria-label', 'Séances du niveau')

  const sectionTitle = document.createElement('h2')
  sectionTitle.className = 'section-title'
  sectionTitle.textContent = 'Séances'
  section.appendChild(sectionTitle)

  const list = document.createElement('ol')
  list.className = 'seances-list'
  list.setAttribute('role', 'list')

  seancesNiveau.forEach(seance => {
    const completee = debloque && seance.numero <= progression.seancesCompletees
    const courante = debloque && seance.numero === progression.seancesCompletees + 1
    const item = _createSeanceItem(seance, { debloque, completee, courante }, () => {
      navigate('seance', { niveauId, seanceId: seance.id })
    })
    list.appendChild(item)
  })

  section.appendChild(list)
  main.appendChild(section)

  // Carte test de validation
  if (testNiveau) {
    const testSection = document.createElement('section')
    testSection.className = 'niveau-test'
    testSection.setAttribute('aria-label', 'Test de validation')

    const testTitle = document.createElement('h2')
    testTitle.className = 'section-title'
    testTitle.textContent = 'Test de validation'
    testSection.appendChild(testTitle)

    testSection.appendChild(_createTestCard(testNiveau, debloque, () => {
      navigate('test', { niveauId, seanceId: testNiveau.id })
    }))

    main.appendChild(testSection)
  }

  container.appendChild(main)
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function _createSeanceItem(seance, { debloque, completee, courante }, onStart) {
  const li = document.createElement('li')
  li.className = `seance-item${completee ? ' seance-item--done' : ''}${courante ? ' seance-item--current' : ''}${!debloque ? ' seance-item--locked' : ''}`

  li.innerHTML = `
    <div class="seance-item__left">
      <div class="seance-item__num" aria-hidden="true">
        ${completee
          ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="icon-check" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`
          : seance.numero
        }
      </div>
      <div class="seance-item__info">
        <p class="seance-item__nom">${seance.nom}</p>
        <p class="seance-item__meta">${seance.duree} · ${seance.exercices.length} exercices</p>
      </div>
    </div>
    <div class="seance-item__right">
      ${courante
        ? `<span class="seance-badge seance-badge--current">Suivante</span>`
        : completee
          ? `<span class="seance-badge seance-badge--done">Complétée</span>`
          : ''
      }
      ${debloque
        ? `<button type="button" class="btn btn--primary btn--sm" aria-label="Lancer la séance ${seance.numero}">
             ${completee ? 'Rejouer' : 'Commencer'}
           </button>`
        : `<button type="button" class="btn btn--ghost btn--sm" disabled aria-disabled="true">Verrouillé</button>`
      }
    </div>
  `

  if (debloque) {
    li.querySelector('button.btn--primary').addEventListener('click', onStart)
  }

  return li
}

function _createTestCard(test, debloque, onStart) {
  const card = document.createElement('div')
  card.className = `test-card${!debloque ? ' test-card--locked' : ''}`

  card.innerHTML = `
    <div class="test-card__header">
      <div>
        <h3 class="test-card__title">${test.nom}</h3>
        <p class="test-card__meta">${test.duree} estimé · Auto-déclaratif</p>
      </div>
      ${debloque
        ? `<button type="button" class="btn btn--primary btn--sm" id="btn-test">Passer le test</button>`
        : `<button type="button" class="btn btn--ghost btn--sm" disabled aria-disabled="true">Verrouillé</button>`
      }
    </div>
    <ul class="test-card__criteres" role="list" aria-label="Critères de validation">
      ${test.criteres.map(c => `
        <li class="test-critere">
          <span class="test-critere__icon" aria-hidden="true">·</span>
          ${c}
        </li>
      `).join('')}
    </ul>
  `

  if (debloque) {
    card.querySelector('#btn-test').addEventListener('click', onStart)
  }

  return card
}
