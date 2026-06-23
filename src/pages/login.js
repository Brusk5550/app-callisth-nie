/**
 * login.js — Page de connexion
 *
 * Auth cosmétique : tout submit valide accède au dashboard.
 * Validation UI côté client uniquement.
 */

import { login, navigate } from '../main.js'
import '../styles/auth.css'

export function render(container) {
  container.innerHTML = `
    <div class="auth-layout">
      <div class="auth-card">

        <div class="auth-brand">
          <span class="auth-brand__logo">C</span>
          <span class="auth-brand__name">Cali</span>
        </div>

        <h1 class="auth-title">Connexion</h1>
        <p class="auth-subtitle">Reprends ta progression là où tu l'as laissée.</p>

        <form class="auth-form" id="login-form" novalidate>

          <div class="form-field" id="field-email">
            <label class="form-label" for="login-email">Adresse e-mail</label>
            <input
              class="form-input"
              type="email"
              id="login-email"
              name="email"
              autocomplete="email"
              placeholder="exemple@email.com"
              required
            />
            <span class="form-error" aria-live="polite"></span>
          </div>

          <div class="form-field" id="field-password">
            <label class="form-label" for="login-password">Mot de passe</label>
            <div class="input-wrapper">
              <input
                class="form-input"
                type="password"
                id="login-password"
                name="password"
                autocomplete="current-password"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                class="input-toggle-visibility"
                aria-label="Afficher le mot de passe"
                data-target="login-password"
              >
                <svg class="icon-eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
            <span class="form-error" aria-live="polite"></span>
          </div>

          <button type="submit" class="btn btn--primary btn--full">
            Se connecter
          </button>

        </form>

        <p class="auth-switch">
          Pas encore de compte ?
          <button type="button" class="auth-switch__link" id="go-register">Créer un compte</button>
        </p>

      </div>
    </div>
  `

  _bindEvents()
}

// ── Logique interne ───────────────────────────────────────────────────────────

function _bindEvents() {
  const form = document.getElementById('login-form')
  const goRegister = document.getElementById('go-register')

  // Navigation vers register
  goRegister.addEventListener('click', () => navigate('register'))

  // Toggle visibilité mot de passe
  document.querySelectorAll('.input-toggle-visibility').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target)
      const isPassword = input.type === 'password'
      input.type = isPassword ? 'text' : 'password'
      btn.setAttribute('aria-label', isPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe')
    })
  })

  // Nettoyage erreur au focus
  form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', () => _clearError(input.closest('.form-field')))
  })

  // Submit — auth cosmétique, pas de validation requise
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    login()
  })
}

/**
 * Validation UI basique (champs non vides + format email).
 * @returns {boolean} true si valide
 */
function _validate(form) {
  let isValid = true

  const emailField = document.getElementById('field-email')
  const emailInput = document.getElementById('login-email')
  const passwordField = document.getElementById('field-password')
  const passwordInput = document.getElementById('login-password')

  // Email
  if (!emailInput.value.trim()) {
    _setError(emailField, 'L\'adresse e-mail est requise.')
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
    _setError(emailField, 'Format d\'e-mail invalide.')
    isValid = false
  }

  // Mot de passe
  if (!passwordInput.value) {
    _setError(passwordField, 'Le mot de passe est requis.')
    isValid = false
  }

  return isValid
}

function _setError(fieldEl, message) {
  fieldEl.classList.add('form-field--error')
  fieldEl.querySelector('.form-error').textContent = message
}

function _clearError(fieldEl) {
  fieldEl.classList.remove('form-field--error')
  fieldEl.querySelector('.form-error').textContent = ''
}
