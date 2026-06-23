/**
 * niveau-card.js — Carte d'un niveau (dashboard)
 *
 * @param {object} niveau      - données du niveau (niveaux.json)
 * @param {object} progression - { debloque, seancesCompletees }
 * @param {Function} onClick   - callback au clic (uniquement si débloqué)
 * @returns {HTMLElement}
 */

const NB_SEANCES = 5

export function createNiveauCard(niveau, progression, onClick) {
  const { debloque, seancesCompletees } = progression
  const pct = debloque ? Math.round((seancesCompletees / NB_SEANCES) * 100) : 0

  const card = document.createElement('article')
  card.className = `niveau-card${debloque ? '' : ' niveau-card--locked'}`
  card.setAttribute('aria-label', `Niveau ${niveau.id} — ${niveau.nom}`)

  card.innerHTML = `
    <div class="niveau-card__header">
      <span class="niveau-card__num">Niveau ${niveau.id}</span>
      ${debloque
        ? `<span class="niveau-card__badge niveau-card__badge--open">Débloqué</span>`
        : `<span class="niveau-card__badge niveau-card__badge--locked" aria-label="Verrouillé">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-lock" aria-hidden="true">
               <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
               <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
             </svg>
             Verrouillé
           </span>`
      }
    </div>

    <h2 class="niveau-card__title">${niveau.nom}</h2>

    <p class="niveau-card__meta">${niveau.dureeSéance} · 5 séances</p>

    ${debloque ? `
      <div class="niveau-card__progress" aria-label="Progression : ${seancesCompletees} séance${seancesCompletees > 1 ? 's' : ''} sur ${NB_SEANCES}">
        <div class="progress-bar">
          <div class="progress-bar__fill" style="width: ${pct}%"></div>
        </div>
        <span class="progress-label">${seancesCompletees} / ${NB_SEANCES} séances</span>
      </div>
    ` : `
      <div class="niveau-card__progress niveau-card__progress--empty" aria-hidden="true">
        <div class="progress-bar">
          <div class="progress-bar__fill" style="width: 0%"></div>
        </div>
        <span class="progress-label">Valide le test du niveau précédent pour débloquer</span>
      </div>
    `}

    ${debloque
      ? `<button type="button" class="btn btn--primary btn--sm niveau-card__cta">Voir les séances</button>`
      : `<button type="button" class="btn btn--ghost btn--sm niveau-card__cta" disabled aria-disabled="true">Verrouillé</button>`
    }
  `

  if (debloque) {
    card.querySelector('.niveau-card__cta').addEventListener('click', onClick)
    card.style.cursor = 'default'
  }

  return card
}
