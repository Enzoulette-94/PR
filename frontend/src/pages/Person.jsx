import { useCallback, useMemo, useState, useEffect } from 'react'
import PasswordModal from '../components/PasswordModal'
import PersonalRecordForm from '../components/PersonalRecordForm'
import {
  createPersonalRecord,
  deletePersonalRecord,
  getGoals,
  getPerson,
  getPersonalRecords,
  updateGoal,
  updatePersonalRecord
} from '../lib/apiClient'
import { emitGoalsChanged } from '../lib/events'

const categories = ['musculation', 'course', 'poids']
const categoryLabels = {
  musculation: 'Musculation',
  course: 'Course',
  poids: 'Poids'
}

function formatDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('fr-FR')
}

function sortByNewest(records) {
  return [...records].sort((a, b) => {
    const da = new Date(a.performed_on).getTime()
    const db = new Date(b.performed_on).getTime()
    if (da !== db) return db - da
    return b.id - a.id
  })
}

function Person({ name, slug }) {
  const [person, setPerson] = useState(null)
  const [goals, setGoals] = useState([])
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [formMode, setFormMode] = useState(null)
  const [editingRecord, setEditingRecord] = useState(null)
  const [pendingWrite, setPendingWrite] = useState(null)
  const [writeLoading, setWriteLoading] = useState(false)

  const fetchRecords = useCallback(async () => {
    const data = await getPersonalRecords(slug)
    setRecords(sortByNewest(data))
  }, [slug])

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setErrorMessage('')

      try {
        const [personData, goalsData] = await Promise.all([getPerson(slug), getGoals(slug)])
        setPerson(personData)
        setGoals(goalsData)
        await fetchRecords()
      } catch (error) {
        setErrorMessage(error.message || 'Erreur lors du chargement.')
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [slug, fetchRecords])

  const groupedRecords = useMemo(() => {
    const grouped = { musculation: [], course: [], poids: [] }
    records.forEach((record) => {
      grouped[record.category] = grouped[record.category] || []
      grouped[record.category].push(record)
    })
    return grouped
  }, [records])

  const toggleGoal = async (goalId, nextCompleted) => {
    setErrorMessage('')
    const previous = goals
    setGoals((current) => current.map((goal) => (goal.id === goalId ? { ...goal, completed: nextCompleted } : goal)))

    try {
      await updateGoal(goalId, nextCompleted)
      emitGoalsChanged()
    } catch (error) {
      setGoals(previous)
      setErrorMessage(error.message || 'Impossible de mettre à jour cet objectif.')
    }
  }

  const onCreateRequest = (payload) => {
    setPendingWrite({ type: 'create', payload })
  }

  const onEditRequest = (payload) => {
    if (!editingRecord) return
    setPendingWrite({ type: 'update', payload, recordId: editingRecord.id })
  }

  const onDeleteRequest = (recordId) => {
    setPendingWrite({ type: 'delete', recordId })
  }

  const resolvePendingAction = async (password) => {
    if (!pendingWrite) return

    setWriteLoading(true)
    setErrorMessage('')

    try {
      if (pendingWrite.type === 'create') {
        await createPersonalRecord(slug, pendingWrite.payload, password)
      }

      if (pendingWrite.type === 'update') {
        await updatePersonalRecord(pendingWrite.recordId, pendingWrite.payload, password)
      }

      if (pendingWrite.type === 'delete') {
        await deletePersonalRecord(pendingWrite.recordId, password)
      }

      await fetchRecords()
      setFormMode(null)
      setEditingRecord(null)
      setPendingWrite(null)
    } catch (error) {
      if (error.status === 401) {
        setErrorMessage('Mot de passe incorrect')
      } else {
        setErrorMessage(error.message || 'Erreur lors de la modification des records.')
      }
    } finally {
      setWriteLoading(false)
    }
  }

  if (loading) {
    return <p className="py-8">Chargement...</p>
  }

  return (
    <section className="pb-10 pt-8">
      <h1 className="text-center text-4xl font-bold sm:text-6xl">{name}</h1>

      {errorMessage ? <p className="mt-4 text-red-600">{errorMessage}</p> : null}

      <div className="mt-8 border-b border-black/10 pb-8 dark:border-white/10">
        <h2 className="text-xl font-semibold">Description</h2>
        <p className="mt-3 opacity-90">{person?.description?.trim() ? person.description : 'Description à venir...'}</p>
      </div>

      <div className="mt-8 border-b border-black/10 pb-8 dark:border-white/10">
        <h2 className="text-xl font-semibold">Objectifs</h2>
        <ul className="mt-4">
          {goals.map((goal) => (
            <li
              key={goal.id}
              className={`border-b border-black/10 py-2 dark:border-white/10 ${
                goal.completed ? 'bg-emerald-200/60 text-black dark:bg-emerald-900/40 dark:text-white' : 'hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <label className="flex cursor-pointer items-center gap-3 px-2">
                <input
                  type="checkbox"
                  checked={Boolean(goal.completed)}
                  onChange={(event) => toggleGoal(goal.id, event.target.checked)}
                  className="h-4 w-4"
                />
                <span className="flex-1">{goal.title}</span>
                {goal.completed ? <span className="text-xs uppercase tracking-wide opacity-80">Validé</span> : null}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 border-b border-black/10 pb-8 dark:border-white/10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Personal Records</h2>
          <button
            type="button"
            onClick={() => {
              setFormMode('create')
              setEditingRecord(null)
            }}
            className="text-sm underline underline-offset-4 hover:opacity-80"
          >
            Ajouter PR
          </button>
        </div>

        {formMode === 'create' ? (
          <PersonalRecordForm
            initialValues={null}
            submittingLabel="Ajouter"
            onSubmit={onCreateRequest}
            onCancel={() => setFormMode(null)}
          />
        ) : null}

        {formMode === 'edit' ? (
          <PersonalRecordForm
            initialValues={editingRecord}
            submittingLabel="Modifier"
            onSubmit={onEditRequest}
            onCancel={() => {
              setFormMode(null)
              setEditingRecord(null)
            }}
          />
        ) : null}

        <div className="mt-5 space-y-8">
          {categories.map((category) => (
            <div key={category}>
              <h3
                className={`text-lg ${
                  category === 'musculation'
                    ? 'text-red-700 dark:text-red-500'
                    : category === 'course'
                      ? 'text-blue-700 dark:text-blue-500'
                      : ''
                }`}
              >
                {categoryLabels[category]}:
              </h3>
              <ul className="mt-3 space-y-3">
                {groupedRecords[category]?.map((record) => (
                  <li key={record.id} className="border-b border-black/10 pb-3 dark:border-white/10">
                    <p className="text-sm opacity-70">{formatDate(record.performed_on)}</p>
                    <p className="mt-1 whitespace-pre-wrap">{record.description}</p>
                    <div className="mt-2 flex gap-4 text-sm">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingRecord(record)
                          setFormMode('edit')
                        }}
                        className="underline underline-offset-4 hover:opacity-80"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteRequest(record.id)}
                        className="underline underline-offset-4 hover:opacity-80"
                      >
                        Supprimer
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              {groupedRecords[category]?.length === 0 ? <p className="mt-3 opacity-60">Aucun PR.</p> : null}
            </div>
          ))}
        </div>
      </div>

      <PasswordModal
        isOpen={Boolean(pendingWrite)}
        actionLabel="Confirme l'action avec le mot de passe"
        onCancel={() => setPendingWrite(null)}
        onValidate={resolvePendingAction}
        loading={writeLoading}
      />
    </section>
  )
}

export default Person
