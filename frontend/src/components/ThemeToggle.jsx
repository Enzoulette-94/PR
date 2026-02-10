import { useTheme } from '../context/ThemeContext'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="fixed right-4 top-3 z-50 text-xs uppercase tracking-wide underline underline-offset-4 hover:opacity-80"
      aria-label="Basculer le thème"
    >
      {theme === 'dark' ? 'DARK' : 'LIGHT'}
    </button>
  )
}

export default ThemeToggle
