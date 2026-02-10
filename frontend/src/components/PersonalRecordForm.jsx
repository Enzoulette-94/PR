import { useEffect, useState } from 'react'

const categories = ['musculation', 'course', 'poids']
const categoryLabels = {
  musculation: 'Musculation',
  course: 'Course',
  poids: 'Poids'
}

function toInputDate(value) {
  if (!value) return ''
  return value.slice(0, 10)
}

function PersonalRecordForm({ initialValues, onCancel, onSubmit, submittingLabel }) {
  const [performedOn, setPerformedOn] = useState('')
  const [category, setCategory] = useState('musculation')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (initialValues) {
      setPerformedOn(toInputDate(initialValues.performed_on))
      setCategory(initialValues.category)
      setDescription(initialValues.description)
    } else {
      setPerformedOn('')
      setCategory('musculation')
      setDescription('')
    }
  }, [initialValues])

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({
      performed_on: performedOn,
      category,
      description
    })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 border-b border-black/10 pb-6 dark:border-white/10">
      <div>
        <label className="block text-sm" htmlFor="performed-on">
          Date
        </label>
        <input
          id="performed-on"
          type="date"
          value={performedOn}
          onChange={(event) => setPerformedOn(event.target.value)}
          className="mt-1 w-full border border-black/30 bg-white px-3 py-2 text-black outline-none focus:border-black dark:border-white/30 dark:bg-black dark:text-white dark:focus:border-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm" htmlFor="category">
          Catégorie
        </label>
        <select
          id="category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="mt-1 w-full border border-black/30 bg-white px-3 py-2 text-black outline-none focus:border-black dark:border-white/30 dark:bg-black dark:text-white dark:focus:border-white"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {categoryLabels[item]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="mt-1 min-h-24 w-full border border-black/30 bg-white px-3 py-2 text-black outline-none focus:border-black dark:border-white/30 dark:bg-black dark:text-white dark:focus:border-white"
          required
        />
      </div>

      <div className="flex items-center gap-4 text-sm">
        <button type="submit" className="underline underline-offset-4 hover:opacity-80">
          {submittingLabel}
        </button>
        <button type="button" onClick={onCancel} className="underline underline-offset-4 hover:opacity-80">
          Annuler
        </button>
      </div>
    </form>
  )
}

export default PersonalRecordForm
