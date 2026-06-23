/**
 * main.js — Point d'entrée et routeur de l'application Cali
 *
 * Routing côté client basé sur un attribut data-page.
 * Pas de localStorage, pas de framework — état en mémoire uniquement.
 */

import './styles/main.css'

// ── État applicatif (en mémoire, réinitialisé au rechargement) ──────────────
const state = {
  isLoggedIn: false,
  currentPage: 'login',
}

// ── Import des pages (lazy via dynamic import) ───────────────────────────────
const pages = {
  login:     () => import('./pages/login.js'),
  register:  () => import('./pages/register.js'),
  dashboard: () => import('./pages/dashboard.js'),
  niveau:    () => import('./pages/niveau.js'),
  seance:    () => import('./pages/seance.js'),
  test:      () => import('./pages/test.js'),
  glossaire: () => import('./pages/glossaire.js'),
}

// ── Routeur ──────────────────────────────────────────────────────────────────
/**
 * Navigue vers une page et injecte son contenu dans #app.
 * @param {string} pageName - clé dans l'objet pages
 * @param {object} [params] - paramètres optionnels passés à la page
 */
export async function navigate(pageName, params = {}) {
  const loader = pages[pageName]
  if (!loader) {
    console.warn(`[router] Page inconnue : "${pageName}"`)
    return
  }

  // Garde : glossaire réservé aux connectés
  if (pageName === 'glossaire' && !state.isLoggedIn) {
    navigate('login')
    return
  }

  state.currentPage = pageName
  const { render } = await loader()
  const appEl = document.getElementById('app')
  appEl.innerHTML = ''
  render(appEl, params, state)
}

/**
 * Marque l'utilisateur comme connecté (auth cosmétique).
 */
export function login() {
  state.isLoggedIn = true
  navigate('dashboard')
}

/**
 * Déconnecte l'utilisateur et revient au login.
 */
export function logout() {
  state.isLoggedIn = false
  navigate('login')
}

// ── Démarrage ────────────────────────────────────────────────────────────────
navigate('login')
