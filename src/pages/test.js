/**
 * test.js — Page test de validation d'un niveau
 *
 * Flow :
 *   1. Présentation des critères
 *   2. L'utilisateur effectue le test physiquement
 *   3. Auto-déclaration : réussi ou pas
 *   4. Si réussi → déverrouillage du niveau suivant + écran succès
 *
 * @param {object} params - { niveauId, seanceId }
 */

import { navigate, logout } from '../main.js'
import { createNav } from '../components/nav.js'
import seancesData from '../data/seances.json'
import niveaux from '../data/niveaux.json'
import '../styles/test.css'

const PHASE = { CRITERES: 'criteres', DECLARATION: 'declaration', SUCCES: 'succes', ECHEC: 'echec' }

export function render(container, params, state) {
  const test = seancesData.find(s => s.id === params.seanceId && s.type === 'test')
  const niveau = niveaux.find(n => n.id === params.niveauId)

  if (!test || !niveau) {
    container.innerHTML = `<p>Test introuvable.</p>`
    return
  }

  const session = { phase: PHASE.CRITERES }

  container.innerHTML = ''

  createNav(container, state, {
    onGlossaire: () => navigate('glossaire'),
    onLogout:    () => logout(),
  })

  const main = document.createElement('main')
  main.className = 'test-page'
  main.innerHTML = `
    <div class="test-layout">
      <header class="test-header">
        <button type="button" class="btn-back" id="btn-quitter">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="back-icon" aria-hidden="true">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Quitter
        </button>
        <p class="test-header__niveau">Niveau ${niveau.id} — ${niveau.nom}</p>
        <h1 class="test-header__nom">${test.nom}</h1>
      </header>
      <div class="test-main" id="test-main"></div>
    </div>
  `

  container.appendChild(main)

  main.querySelector('#btn-quitter').addEventListener('click', () => {
    navigate('niveau', { niveauId: params.niveauId })
  })

  _renderPhase(session, test, niveau, state, params, main)
}

// ── Rendu selon la phase ──────────────────────────────────────────────────────

function _renderPhase(session, test, niveau, state, params, main) {
  const mainEl = main.querySelector('#test-main')
  mainEl.innerHTML = ''

  switch (session.phase) {
    case PHASE.CRITERES:    _renderCriteres(mainEl, session, test, niveau, state, params, main); break
    case PHASE.DECLARATION: _renderDeclaration(mainEl, session, test, niveau, state, params, main); break
    case PHASE.SUCCES:      _renderSucces(mainEl, niveau, state, params); break
    case PHASE.ECHEC:       _renderEchec(mainEl, session, test, niveau, state, params, main); break
  }
}

// ── Phase 1 : Présentation des critères ──────────────────────────────────────

function _renderCriteres(mainEl, session, test, niveau, state, params, main) {
  mainEl.innerHTML = `
    <div class="phase-criteres">
      <div class="test-intro">
        <p class="test-intro__text">
          Effectue chacun des exercices ci-dessous. Quand tu es prêt, déclare toi-même si tu as réussi.
        </p>
        <p class="test-intro__note">Durée estimée : ${test.duree}</p>
      </div>

      <ul class="criteres-list" role="list">
        ${test.criteres.map((c, i) => `
          <li class="critere-item">
            <label class="critere-label">
              <input type="checkbox" class="critere-check" data-idx="${i}" aria-label="${c}" />
              <span class="critere-check-box" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="icon-check-sm">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              <span class="critere-text">${c}</span>
            </label>
          </li>
        `).join('')}
      </ul>

      <div class="criteres-actions">
        <button type="button" class="btn btn--primary btn--lg" id="btn-je-suis-pret">
          Je suis prêt — déclarer le résultat
        </button>
      </div>
    </div>
  `

  mainEl.querySelector('#btn-je-suis-pret').addEventListener('click', () => {
    session.phase = PHASE.DECLARATION
    _renderPhase(session, test, niveau, state, params, main)
  })
}

// ── Phase 2 : Auto-déclaration ────────────────────────────────────────────────

function _renderDeclaration(mainEl, session, test, niveau, state, params, main) {
  mainEl.innerHTML = `
    <div class="phase-declaration">
      <h2 class="declaration-question">As-tu réussi tous les critères ?</h2>
      <p class="declaration-sub">Sois honnête avec toi-même — c'est la seule façon de progresser durablement.</p>

      <ul class="criteres-list criteres-list--recap" role="list" aria-label="Rappel des critères">
        ${test.criteres.map(c => `
          <li class="critere-item critere-item--recap">
            <span class="critere-dot" aria-hidden="true">·</span>
            <span class="critere-text">${c}</span>
          </li>
        `).join('')}
      </ul>

      <div class="declaration-actions">
        <button type="button" class="btn btn--success btn--lg" id="btn-reussi">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="btn-icon" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Oui, j'ai réussi !
        </button>
        <button type="button" class="btn btn--ghost btn--sm" id="btn-echec">
          Non, je dois encore m'entraîner
        </button>
      </div>
    </div>
  `

  mainEl.querySelector('#btn-reussi').addEventListener('click', () => {
    _debloquerNiveauSuivant(niveau, state)
    session.phase = PHASE.SUCCES
    _renderPhase(session, test, niveau, state, params, main)
  })

  mainEl.querySelector('#btn-echec').addEventListener('click', () => {
    session.phase = PHASE.ECHEC
    _renderPhase(session, test, niveau, state, params, main)
  })
}

// ── Phase 3 : Succès ──────────────────────────────────────────────────────────

function _renderSucces(mainEl, niveau, state, params) {
  const niveauSuivant = niveaux.find(n => n.id === niveau.id + 1)

  mainEl.innerHTML = `
    <div class="phase-succes">
      <div class="succes-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="20 6 9 17 4 12" stroke-width="2.5"/>
        </svg>
      </div>

      <h2 class="succes-title">Niveau ${niveau.id} validé !</h2>
      <p class="succes-subtitle">${niveau.nom}</p>

      ${niveauSuivant ? `
        <div class="succes-unlock">
          <p class="succes-unlock__label">Débloqué</p>
          <p class="succes-unlock__niveau">Niveau ${niveauSuivant.id} — ${niveauSuivant.nom}</p>
        </div>
      ` : `
        <div class="succes-final">
          <p class="succes-final__text">Tu as atteint le niveau Élite. Félicitations !</p>
        </div>
      `}

      <div class="succes-actions">
        ${niveauSuivant ? `
          <button type="button" class="btn btn--primary btn--lg" id="btn-niveau-suivant">
            Découvrir le niveau ${niveauSuivant.id}
          </button>
        ` : ''}
        <button type="button" class="btn btn--ghost btn--sm" id="btn-dashboard">
          Tableau de bord
        </button>
      </div>
    </div>
  `

  if (niveauSuivant) {
    mainEl.querySelector('#btn-niveau-suivant').addEventListener('click', () => {
      navigate('niveau', { niveauId: niveauSuivant.id })
    })
  }

  mainEl.querySelector('#btn-dashboard').addEventListener('click', () => {
    navigate('dashboard')
  })
}

// ── Phase 4 : Échec ───────────────────────────────────────────────────────────

function _renderEchec(mainEl, session, test, niveau, state, params, main) {
  mainEl.innerHTML = `
    <div class="phase-echec">
      <div class="echec-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12" stroke-width="2.5"/>
          <line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2.5"/>
        </svg>
      </div>

      <h2 class="echec-title">Pas encore…</h2>
      <p class="echec-subtitle">Retourne t'entraîner et repasse le test quand tu te sens prêt.</p>
      <p class="echec-note">Le test peut être repassé à tout moment.</p>

      <div class="echec-actions">
        <button type="button" class="btn btn--primary" id="btn-reessayer">
          Réessayer maintenant
        </button>
        <button type="button" class="btn btn--ghost btn--sm" id="btn-retour-niveau">
          Retour aux séances
        </button>
      </div>
    </div>
  `

  mainEl.querySelector('#btn-reessayer').addEventListener('click', () => {
    session.phase = PHASE.CRITERES
    _renderPhase(session, test, niveau, state, params, main)
  })

  mainEl.querySelector('#btn-retour-niveau').addEventListener('click', () => {
    navigate('niveau', { niveauId: params.niveauId })
  })
}

// ── Déverrouillage ────────────────────────────────────────────────────────────

function _debloquerNiveauSuivant(niveau, state) {
  const suivant = state.progression.niveaux.find(n => n.id === niveau.id + 1)
  if (suivant) suivant.debloque = true
}
