import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import PersonTabs from './components/PersonTabs'
import Home from './pages/Home'
import Person from './pages/Person'

function App() {
  const location = useLocation()
  const showCountdownLink = location.pathname !== '/'

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <PersonTabs showCountdownLink={showCountdownLink} />
      <main className="mx-auto w-full max-w-5xl px-4 pb-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/xavier" element={<Person name="Xavier" slug="xavier" />} />
          <Route path="/thomas" element={<Person name="Thomas" slug="thomas" />} />
          <Route path="/yanice" element={<Person name="Yanice" slug="yanice" />} />
          <Route path="/yannis" element={<Person name="Yannis" slug="yannis" />} />
          <Route path="/enzo" element={<Person name="Enzo" slug="enzo" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
