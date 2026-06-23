/**
 * seance.js — Mode "séance en cours"
 *
 * Flow : exercice → repos → exercice → ... → terminé
 *
 * Chaque exercice peut être :
 *   - à reps  : l'utilisateur valide manuellement
 *   - à durée : countdown automatique (dureeSecRep)
 *
 * @param {object} params - { niveauId, seanceId }
 */

import { navigate, goBack, logout } from '../main.js'
import { createNav } from '../components/nav.js'
import { createTimer, formatTime } from '../components/timer.js'
import seancesData from '../data/seances.json'
import niveaux from '../data/niveaux.json'
import glossaire from '../data/glossaire.json'
import '../styles/seance.css'

// ── Phase de la séance ────────────────────────────────────────────────────────
const PHASE = { EXERCICE: 'exercice', REPOS: 'repos', DONE: 'done' }

export function render(container, params, state) {
  const seance = seancesData.find(s => s.id === params.seanceId)
  const niveau = niveaux.find(n => n.id === params.niveauId)

  if (!seance || !niveau) {
    container.innerHTML = `<p>Séance introuvable.</p>`
    return
  }

  // ── État interne de la séance ─────────────────────────────────────────────
  const session = {
    exerciceIdx: 0,
    serieIdx: 1,
    phase: PHASE.EXERCICE,
    timer: null,
  }

  // ── Structure DOM fixe ────────────────────────────────────────────────────
  container.innerHTML = ''

  createNav(container, state, {
    onHome:      () => { session.timer?.destroy(); navigate('dashboard') },
    onGlossaire: () => { session.timer?.destroy(); navigate('glossaire') },
    onLogout:    () => { session.timer?.destroy(); logout() },
  })

  const main = document.createElement('main')
  main.className = 'seance-page'
  main.innerHTML = `
    <div class="seance-layout">

      <!-- En-tête fixe -->
      <header class="seance-header">
        <button type="button" class="btn-back" id="btn-quitter" aria-label="Retour">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="back-icon" aria-hidden="true">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div class="seance-header__info">
          <p class="seance-header__niveau">Niveau ${niveau.id} — ${niveau.nom}</p>
          <h1 class="seance-header__nom">${seance.nom}</h1>
        </div>
        <!-- Progression globale exercices -->
        <div class="seance-global-progress">
          <div class="progress-bar">
            <div class="progress-bar__fill" id="global-progress-fill" style="width:0%"></div>
          </div>
          <span class="progress-label" id="global-progress-label"></span>
        </div>
      </header>

      <!-- Zone principale (change selon la phase) -->
      <div class="seance-main" id="seance-main"></div>

    </div>
  `

  container.appendChild(main)

  // Bouton quitter
  main.querySelector('#btn-quitter').addEventListener('click', () => {
    session.timer?.destroy()
    goBack()
  })

  // ── Premier rendu ─────────────────────────────────────────────────────────
  _renderPhase(session, seance, niveau, state, params)
}

// ── Rendu de la phase courante ────────────────────────────────────────────────

function _renderPhase(session, seance, niveau, state, params) {
  session.timer?.destroy()
  session.timer = null

  const mainEl = document.getElementById('seance-main')
  if (!mainEl) return

  const exercice = seance.exercices[session.exerciceIdx]

  // Barre de progression globale
  const totalSeries = seance.exercices.reduce((acc, e) => acc + e.series, 0)
  const doneSeriesSoFar = seance.exercices
    .slice(0, session.exerciceIdx)
    .reduce((acc, e) => acc + e.series, 0) + (session.serieIdx - 1)
  const pct = Math.round((doneSeriesSoFar / totalSeries) * 100)
  document.getElementById('global-progress-fill').style.width = `${pct}%`
  document.getElementById('global-progress-label').textContent =
    `Exercice ${session.exerciceIdx + 1} / ${seance.exercices.length}`

  if (session.phase === PHASE.DONE) {
    _renderDone(mainEl, session, seance, niveau, state, params)
    return
  }

  if (session.phase === PHASE.REPOS) {
    _renderRepos(mainEl, session, seance, exercice, niveau, state, params)
    return
  }

  // Phase EXERCICE
  _renderExercice(mainEl, session, seance, exercice, niveau, state, params)
}

// ── Phase : exercice ──────────────────────────────────────────────────────────

function _renderExercice(mainEl, session, seance, exercice, niveau, state, params) {
  const isTimed = 'dureeSecRep' in exercice

  // Recherche de l'entrée du glossaire correspondant à l'exercice
  const nomNorm = (s) => s.toLowerCase().trim()
  const glossaireEntry = glossaire.find(g => nomNorm(g.nom) === nomNorm(exercice.nom))

  mainEl.innerHTML = `
    <div class="phase-exercice">

      <!-- Compteur série -->
      <div class="serie-counter" aria-label="Série ${session.serieIdx} sur ${exercice.series}">
        ${Array.from({ length: exercice.series }, (_, i) => `
          <span class="serie-dot ${i < session.serieIdx ? 'serie-dot--active' : ''}"></span>
        `).join('')}
      </div>

      <p class="serie-label">Série ${session.serieIdx} / ${exercice.series}</p>

      <h2 class="exercice-nom">${exercice.nom}</h2>
      <p class="exercice-desc">${exercice.description}</p>

      ${glossaireEntry ? `
        <button type="button" class="btn-glossaire-link" id="btn-glossaire-link" aria-label="Voir ${exercice.nom} dans le glossaire">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-glossaire-link__icon" aria-hidden="true">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          Voir dans le glossaire
        </button>
      ` : ''}

      <!-- Timer ou reps -->
      ${isTimed ? `
        <div class="timer-display" role="timer" aria-live="polite">
          <span class="timer-value" id="timer-value">${formatTime(exercice.dureeSecRep)}</span>
          <span class="timer-unit">secondes</span>
        </div>
        <div class="timer-controls">
          <button type="button" class="btn btn--ghost btn--sm" id="btn-pause">Pause</button>
          <button type="button" class="btn btn--primary" id="btn-valider">Terminé</button>
        </div>
      ` : `
        <div class="reps-display" aria-label="${exercice.reps} répétitions">
          <span class="reps-value">${exercice.reps}</span>
          <span class="reps-unit">rép.</span>
        </div>
        <button type="button" class="btn btn--primary btn--lg" id="btn-valider">
          Série terminée
        </button>
      `}

    </div>
  `

  // Lien vers le glossaire
  const btnGlossaireLink = mainEl.querySelector('#btn-glossaire-link')
  if (btnGlossaireLink && glossaireEntry) {
    btnGlossaireLink.addEventListener('click', () => {
      session.timer?.destroy()
      navigate('exercice', { exerciceId: glossaireEntry.id })
    })
  }

  // Timer automatique pour les exercices chronométrés
  if (isTimed) {
    const timerEl = mainEl.querySelector('#timer-value')
    const btnPause = mainEl.querySelector('#btn-pause')
    const btnValider = mainEl.querySelector('#btn-valider')

    session.timer = createTimer({
      duration: exercice.dureeSecRep,
      onTick: (t) => { timerEl.textContent = formatTime(t) },
      onComplete: () => _afterExercice(session, seance, exercice, niveau, state, params),
    })
    session.timer.start()

    btnPause.addEventListener('click', () => {
      if (session.timer.running) {
        session.timer.pause()
        btnPause.textContent = 'Reprendre'
      } else {
        session.timer.resume()
        btnPause.textContent = 'Pause'
      }
    })

    btnValider.addEventListener('click', () => {
      session.timer.destroy()
      _afterExercice(session, seance, exercice, niveau, state, params)
    })
  } else {
    mainEl.querySelector('#btn-valider').addEventListener('click', () => {
      _afterExercice(session, seance, exercice, niveau, state, params)
    })
  }
}

// ── Phase : repos ─────────────────────────────────────────────────────────────

function _renderRepos(mainEl, session, seance, exercice, niveau, state, params) {
  const reposSec = exercice?.reposSec ?? 60

  mainEl.innerHTML = `
    <div class="phase-repos">
      <p class="repos-label">Repos</p>
      <div class="timer-display" role="timer" aria-live="polite">
        <span class="timer-value" id="timer-value">${formatTime(reposSec)}</span>
        <span class="timer-unit">secondes</span>
      </div>
      <div class="timer-controls">
        <button type="button" class="btn btn--ghost btn--sm" id="btn-pause">Pause</button>
        <button type="button" class="btn btn--primary" id="btn-passer">Passer</button>
      </div>
      ${_nextHint(session, seance)}
    </div>
  `

  const timerEl = mainEl.querySelector('#timer-value')
  const btnPause = mainEl.querySelector('#btn-pause')
  const btnPasser = mainEl.querySelector('#btn-passer')

  const advance = () => _afterRepos(session, seance, niveau, state, params)

  session.timer = createTimer({
    duration: reposSec,
    onTick: (t) => { timerEl.textContent = formatTime(t) },
    onComplete: advance,
  })
  session.timer.start()

  btnPause.addEventListener('click', () => {
    if (session.timer.running) {
      session.timer.pause()
      btnPause.textContent = 'Reprendre'
    } else {
      session.timer.resume()
      btnPause.textContent = 'Pause'
    }
  })

  btnPasser.addEventListener('click', () => {
    session.timer.destroy()
    advance()
  })
}

// ── Phase : terminé ───────────────────────────────────────────────────────────

function _renderDone(mainEl, session, seance, niveau, state, params) {
  // Mise à jour progression (si séance normale, pas replay)
  const prog = state.progression.niveaux.find(n => n.id === params.niveauId)
  if (prog && seance.numero > prog.seancesCompletees) {
    prog.seancesCompletees = seance.numero
  }

  mainEl.innerHTML = `
    <div class="phase-done">
      <div class="done-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="20 6 9 17 4 12" stroke-width="2.5"/>
        </svg>
      </div>
      <h2 class="done-title">Séance terminée !</h2>
      <p class="done-subtitle">${seance.nom}</p>
      <p class="done-meta">Niveau ${niveau.id} — ${niveau.nom}</p>
      <div class="done-actions">
        <button type="button" class="btn btn--primary btn--lg" id="btn-retour-niveau">
          Retour au niveau
        </button>
        <button type="button" class="btn btn--ghost btn--sm" id="btn-dashboard">
          Tableau de bord
        </button>
      </div>
    </div>
  `

  mainEl.querySelector('#btn-retour-niveau').addEventListener('click', () => {
    navigate('niveau', { niveauId: params.niveauId })
  })
  mainEl.querySelector('#btn-dashboard').addEventListener('click', () => {
    navigate('dashboard')
  })
}

// ── Transitions ───────────────────────────────────────────────────────────────

function _afterExercice(session, seance, exercice, niveau, state, params) {
  const isLastSerie = session.serieIdx >= exercice.series
  const isLastExercice = session.exerciceIdx >= seance.exercices.length - 1

  if (isLastSerie && isLastExercice) {
    session.phase = PHASE.DONE
    _renderPhase(session, seance, niveau, state, params)
    return
  }

  // Passer en repos avant la prochaine série ou le prochain exercice
  session.phase = PHASE.REPOS
  _renderPhase(session, seance, niveau, state, params)
}

function _afterRepos(session, seance, niveau, state, params) {
  const exercice = seance.exercices[session.exerciceIdx]
  const isLastSerie = session.serieIdx >= exercice.series

  if (isLastSerie) {
    // Exercice suivant
    session.exerciceIdx++
    session.serieIdx = 1
  } else {
    // Série suivante
    session.serieIdx++
  }

  session.phase = PHASE.EXERCICE
  _renderPhase(session, seance, niveau, state, params)
}

// ── Hint "exercice suivant" ───────────────────────────────────────────────────

function _nextHint(session, seance) {
  const exercice = seance.exercices[session.exerciceIdx]
  const isLastSerie = session.serieIdx >= exercice.series

  if (isLastSerie) {
    const nextEx = seance.exercices[session.exerciceIdx + 1]
    if (!nextEx) return ''
    return `<p class="repos-next">Prochain exercice : <strong>${nextEx.nom}</strong></p>`
  }
  return `<p class="repos-next">Série suivante : <strong>${session.serieIdx + 1} / ${exercice.series}</strong></p>`
}
