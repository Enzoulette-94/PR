import { useEffect, useState } from 'react'

function PasswordModal({ isOpen, actionLabel, onCancel, onValidate, loading }) {
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setPassword('')
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onValidate(password)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md border border-black/20 bg-white p-5 text-black dark:border-white/20 dark:bg-black dark:text-white"
      >
        <p className="text-sm opacity-80">{actionLabel}</p>
        <label className="mt-4 block text-sm" htmlFor="write-password-input">
          Mot de passe
        </label>
        <input
          id="write-password-input"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full border border-black/30 bg-white px-3 py-2 text-black outline-none focus:border-black dark:border-white/30 dark:bg-black dark:text-white dark:focus:border-white"
          required
          autoFocus
        />

        <div className="mt-4 flex items-center gap-4 text-sm">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="underline underline-offset-4 hover:opacity-80 disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="underline underline-offset-4 hover:opacity-80 disabled:opacity-50"
          >
            {loading ? 'Validation...' : 'Valider'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PasswordModal
