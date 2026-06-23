/**
 * nav.js — Navigation principale
 *
 * Injecte la nav dans le container fourni.
 * @param {HTMLElement} container - élément parent
 * @param {object} state - état applicatif global
 * @param {object} handlers - { onGlossaire, onLogout }
 */

export function createNav(container, state, { onGlossaire, onLogout }) {
  const nav = document.createElement('nav')
  nav.className = 'main-nav'
  nav.setAttribute('aria-label', 'Navigation principale')

  nav.innerHTML = `
    <div class="nav-inner">
      <div class="nav-brand">
        <span class="nav-brand__logo" aria-hidden="true">C</span>
        <span class="nav-brand__name">Cali</span>
      </div>

      <ul class="nav-links" role="list">
        <li>
          <button type="button" class="nav-link" id="nav-glossaire">
            Glossaire
          </button>
        </li>
        <li>
          <button type="button" class="nav-link nav-link--logout" id="nav-logout" aria-label="Se déconnecter">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-icon" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>Déconnexion</span>
          </button>
        </li>
      </ul>
    </div>
  `

  nav.querySelector('#nav-glossaire').addEventListener('click', onGlossaire)
  nav.querySelector('#nav-logout').addEventListener('click', onLogout)

  container.appendChild(nav)
}
