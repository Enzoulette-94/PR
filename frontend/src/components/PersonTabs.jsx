import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/xavier', label: 'Xavier' },
  { to: '/thomas', label: 'Thomas' },
  { to: '/yanice', label: 'Yanice' },
  { to: '/yannis', label: 'Yannis' },
  { to: '/enzo', label: 'Enzo' }
]

function PersonTabs() {
  return (
    <header className="overflow-x-auto border-b border-black/10 dark:border-white/20">
      <nav className="flex min-w-max items-center gap-6 px-4 py-4 pr-20 sm:justify-center sm:pr-4">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `text-base whitespace-nowrap transition ${
                isActive ? 'underline opacity-100' : 'opacity-60 hover:opacity-100 dark:opacity-70'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

export default PersonTabs
