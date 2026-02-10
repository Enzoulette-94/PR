import { useCallback, useEffect, useState } from 'react'
import Countdown from '../components/Countdown'
import { getGoalsStats } from '../lib/apiClient'
import { appEvents } from '../lib/events'

function Home() {
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState('')

  const fetchStats = useCallback(async () => {
    setStatsError('')

    try {
      const data = await getGoalsStats()
      setStats(data)
    } catch (_error) {
      setStatsError('Impossible de charger le récapitulatif.')
    } finally {
      setStatsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  useEffect(() => {
    const handleGoalsChanged = () => {
      fetchStats()
    }

    appEvents.addEventListener('goals:changed', handleGoalsChanged)

    return () => {
      appEvents.removeEventListener('goals:changed', handleGoalsChanged)
    }
  }, [fetchStats])

  return (
    <section className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold leading-none sm:text-8xl md:text-9xl">GOGOLISTAN</h1>
      <p className="mt-6 text-red-600 text-lg sm:text-xl">décompte avant la mort:</p>
      <p className="mt-2 text-red-600 text-2xl sm:text-3xl">
        <Countdown />
      </p>

      <div className="mt-8 text-base sm:text-lg">
        {statsLoading ? <p>Chargement...</p> : null}
        {statsError ? <p className="text-red-600">{statsError}</p> : null}
        {!statsLoading && !statsError ? (
          <p>
            Nombre d'objectifs validés par les gogoles: {stats?.completed ?? 0} sur {stats?.total ?? 0}
          </p>
        ) : null}
      </div>
    </section>
  )
}

export default Home
