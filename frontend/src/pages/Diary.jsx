import { useEffect, useState } from 'react'
import Card from '../components/Card'
import DiaryForm from '../components/DiaryForm'
import { diaryApi, guidesApi } from '../services/api'
import './Diary.css'

function Diary() {
  const [entries, setEntries] = useState([])
  const [guides, setGuides] = useState([])
  const [filters, setFilters] = useState({ entry_type: '', guide_id: '' })
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  const loadData = async (params = {}) => {
    try {
      const [entryData, guideData] = await Promise.all([diaryApi.list(params), guidesApi.list()])
      setEntries(entryData)
      setGuides(guideData)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadData(filters)
  }, [])

  const handleSubmit = async (payload) => {
    try {
      await diaryApi.create(payload)
      setShowForm(false)
      loadData(filters)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    const nextFilters = { ...filters, [name]: value }
    setFilters(nextFilters)
    loadData(nextFilters)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Diario</h1>
          <p className="muted">Reflexiona sobre tu viaje espiritual y asocia guías.</p>
        </div>
        <button onClick={() => setShowForm((v) => !v)}>{showForm ? 'Cerrar' : 'Add Diary Entry'}</button>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="filters">
        <label>
          Tipo
          <select name="entry_type" value={filters.entry_type} onChange={handleFilterChange}>
            <option value="">Todos</option>
            <option value="personal">Personal</option>
            <option value="single_guide">Single guide</option>
            <option value="multi_guide">Multi guide</option>
          </select>
        </label>
        <label>
          Guía
          <select name="guide_id" value={filters.guide_id} onChange={handleFilterChange}>
            <option value="">Todos</option>
            {guides.map((guide) => (
              <option key={guide.id} value={guide.id}>
                {guide.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {showForm && <DiaryForm guides={guides} onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />}
      <div className="grid">
        {entries.map((entry) => (
          <Card key={entry.id} title={entry.title} subtitle={new Date(entry.created_at).toLocaleString()}>
            <p className="muted">Tipo: {entry.entry_type}</p>
            {entry.guide_ids?.length > 0 && <p className="muted">Guías: {entry.guide_ids.join(', ')}</p>}
            <p>{entry.content}</p>
            {entry.mood_tags?.length > 0 && <p className="muted">Moods: {entry.mood_tags.join(', ')}</p>}
          </Card>
        ))}
        {entries.length === 0 && <p className="muted">No hay entradas para estos filtros.</p>}
      </div>
    </div>
  )
}

export default Diary
