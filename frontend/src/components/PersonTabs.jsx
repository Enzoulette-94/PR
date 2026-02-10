import { Link, NavLink } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const tabs = [
  { to: '/xavier', label: 'Xavier' },
  { to: '/thomas', label: 'Thomas' },
  { to: '/yanice', label: 'Yanice' },
  { to: '/yannis', label: 'Yannis' },
  { to: '/enzo', label: 'Enzo' }
]

function PersonTabs({ showCountdownLink }) {
  const { theme, toggleTheme } = useTheme()
  const sharedTextClass = 'text-sm'

  return (
    <header className="border-b border-black/10 dark:border-white/20">
      <div className="flex items-center gap-3 px-4 py-4">
        <div className="w-20 shrink-0 sm:w-24">
          {showCountdownLink ? (
            <Link to="/" className={`${sharedTextClass} hover:opacity-80`}>
              Décompte
            </Link>
          ) : null}
        </div>

        <nav className="flex-1">
          <div className="grid grid-cols-5 items-center gap-2">
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  `truncate text-center ${sharedTextClass} whitespace-nowrap transition ${
                    isActive ? 'underline opacity-100' : 'opacity-60 hover:opacity-100 dark:opacity-70'
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </div>
        </nav>

        <button
          type="button"
          onClick={toggleTheme}
          className={`w-20 shrink-0 text-right ${sharedTextClass} tracking-wide hover:opacity-80 sm:w-24`}
          aria-label="Basculer le thème"
        >
          {theme === 'dark' ? 'Dark' : 'Light'}
        </button>
      </div>
    </header>
  )
}

export default PersonTabs
