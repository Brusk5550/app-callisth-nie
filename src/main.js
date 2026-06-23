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
  currentParams: {},
  navHistory: [],      // pile : [{ page, params }, ...]
  progression: {
    niveaux: [
      { id: 1, debloque: true,  seancesCompletees: 0 },
      { id: 2, debloque: false, seancesCompletees: 0 },
      { id: 3, debloque: false, seancesCompletees: 0 },
      { id: 4, debloque: false, seancesCompletees: 0 },
    ]
  },
  testHistory: []
  // Entrées : { niveauId, niveauNom, reussi, date (ISO string) }
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
  exercice:  () => import('./pages/exercice.js'),
}

// ── Routeur ──────────────────────────────────────────────────────────────────
/**
 * Navigue vers une page et injecte son contenu dans #app.
 * @param {string} pageName - clé dans l'objet pages
 * @param {object} [params] - paramètres optionnels passés à la page
 */
// Pages qui ne doivent pas être empilées dans l'historique
const NO_HISTORY = ['login', 'register']

export async function navigate(pageName, params = {}, _pushHistory = true) {
  const loader = pages[pageName]
  if (!loader) {
    console.warn(`[router] Page inconnue : "${pageName}"`)
    return
  }

  // Garde : glossaire et exercice réservés aux connectés
  if ((pageName === 'glossaire' || pageName === 'exercice') && !state.isLoggedIn) {
    navigate('login')
    return
  }

  // Empile la page courante avant de changer
  if (_pushHistory && !NO_HISTORY.includes(state.currentPage)) {
    state.navHistory.push({ page: state.currentPage, params: state.currentParams })
  }

  state.currentPage = pageName
  state.currentParams = params
  const { render } = await loader()
  const appEl = document.getElementById('app')

  // Fade out
  appEl.classList.remove('page-enter')
  appEl.classList.add('page-exit')

  await new Promise(r => setTimeout(r, 120))

  appEl.innerHTML = ''
  window.scrollTo({ top: 0, behavior: 'instant' })
  render(appEl, params, state)

  // Fade in
  appEl.classList.remove('page-exit')
  appEl.classList.add('page-enter')
}

/**
 * Revient à la page précédente dans l'historique.
 * Si la pile est vide, revient au dashboard.
 */
export function goBack() {
  const prev = state.navHistory.pop()
  if (prev) {
    navigate(prev.page, prev.params, false)
  } else {
    navigate('dashboard', {}, false)
  }
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
  state.navHistory = []
  navigate('login', {}, false)
}

// ── Démarrage ────────────────────────────────────────────────────────────────
navigate('login')
