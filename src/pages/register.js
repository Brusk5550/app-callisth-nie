/**
 * register.js — Page d'inscription
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

        <h1 class="auth-title">Créer un compte</h1>
        <p class="auth-subtitle">Commence ta progression en callisthénie.</p>

        <form class="auth-form" id="register-form" novalidate>

          <div class="form-field" id="field-name">
            <label class="form-label" for="register-name">Prénom</label>
            <input
              class="form-input"
              type="text"
              id="register-name"
              name="name"
              autocomplete="given-name"
              placeholder="Ton prénom"
              required
            />
            <span class="form-error" aria-live="polite"></span>
          </div>

          <div class="form-field" id="field-email">
            <label class="form-label" for="register-email">Adresse e-mail</label>
            <input
              class="form-input"
              type="email"
              id="register-email"
              name="email"
              autocomplete="email"
              placeholder="exemple@email.com"
              required
            />
            <span class="form-error" aria-live="polite"></span>
          </div>

          <div class="form-field" id="field-password">
            <label class="form-label" for="register-password">Mot de passe</label>
            <div class="input-wrapper">
              <input
                class="form-input"
                type="password"
                id="register-password"
                name="password"
                autocomplete="new-password"
                placeholder="8 caractères minimum"
                required
              />
              <button
                type="button"
                class="input-toggle-visibility"
                aria-label="Afficher le mot de passe"
                data-target="register-password"
              >
                <svg class="icon-eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
            <span class="form-error" aria-live="polite"></span>
          </div>

          <div class="form-field" id="field-confirm">
            <label class="form-label" for="register-confirm">Confirmer le mot de passe</label>
            <div class="input-wrapper">
              <input
                class="form-input"
                type="password"
                id="register-confirm"
                name="confirm"
                autocomplete="new-password"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                class="input-toggle-visibility"
                aria-label="Afficher le mot de passe"
                data-target="register-confirm"
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
            Créer mon compte
          </button>

        </form>

        <p class="auth-switch">
          Déjà un compte ?
          <button type="button" class="auth-switch__link" id="go-login">Se connecter</button>
        </p>

      </div>
    </div>
  `

  _bindEvents()
}

// ── Logique interne ───────────────────────────────────────────────────────────

function _bindEvents() {
  const form = document.getElementById('register-form')
  const goLogin = document.getElementById('go-login')

  // Navigation vers login
  goLogin.addEventListener('click', () => navigate('login'))

  // Toggle visibilité mots de passe
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

  // Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    if (_validate(form)) {
      login() // Auth cosmétique → redirige vers dashboard
    }
  })
}

/**
 * Validation UI : prénom, email, mot de passe (min 8 car.), confirmation.
 * @returns {boolean} true si valide
 */
function _validate() {
  let isValid = true

  const nameField    = document.getElementById('field-name')
  const nameInput    = document.getElementById('register-name')
  const emailField   = document.getElementById('field-email')
  const emailInput   = document.getElementById('register-email')
  const pwdField     = document.getElementById('field-password')
  const pwdInput     = document.getElementById('register-password')
  const confirmField = document.getElementById('field-confirm')
  const confirmInput = document.getElementById('register-confirm')

  // Prénom
  if (!nameInput.value.trim()) {
    _setError(nameField, 'Le prénom est requis.')
    isValid = false
  }

  // Email
  if (!emailInput.value.trim()) {
    _setError(emailField, 'L\'adresse e-mail est requise.')
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
    _setError(emailField, 'Format d\'e-mail invalide.')
    isValid = false
  }

  // Mot de passe
  if (!pwdInput.value) {
    _setError(pwdField, 'Le mot de passe est requis.')
    isValid = false
  } else if (pwdInput.value.length < 8) {
    _setError(pwdField, '8 caractères minimum.')
    isValid = false
  }

  // Confirmation
  if (!confirmInput.value) {
    _setError(confirmField, 'Confirme ton mot de passe.')
    isValid = false
  } else if (confirmInput.value !== pwdInput.value) {
    _setError(confirmField, 'Les mots de passe ne correspondent pas.')
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
