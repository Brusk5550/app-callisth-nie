/**
 * timer.js — Composant countdown timer
 *
 * Usage :
 *   const t = createTimer({ duration: 30, onTick, onComplete })
 *   t.start()
 *   t.pause()
 *   t.resume()
 *   t.reset(newDuration)
 *   t.destroy()
 */

export function createTimer({ duration, onTick, onComplete }) {
  let timeLeft = duration
  let intervalId = null
  let running = false

  function _tick() {
    if (timeLeft <= 0) {
      _stop()
      onComplete?.()
      return
    }
    timeLeft--
    onTick?.(timeLeft)
  }

  function _stop() {
    clearInterval(intervalId)
    intervalId = null
    running = false
  }

  return {
    get timeLeft() { return timeLeft },
    get running() { return running },

    start() {
      if (running) return
      running = true
      onTick?.(timeLeft) // tick immédiat pour afficher la valeur initiale
      intervalId = setInterval(_tick, 1000)
    },

    pause() {
      _stop()
    },

    resume() {
      if (running || timeLeft <= 0) return
      running = true
      intervalId = setInterval(_tick, 1000)
    },

    reset(newDuration) {
      _stop()
      timeLeft = newDuration ?? duration
      onTick?.(timeLeft)
    },

    destroy() {
      _stop()
    },
  }
}

/**
 * Formate un nombre de secondes en MM:SS
 * @param {number} seconds
 * @returns {string}
 */
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}
