import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Card from '../components/Card'
import DiaryForm from '../components/DiaryForm'
import { diaryApi, guidesApi } from '../services/api'
import './GuideDetail.css'

function GuideDetail() {
  const { id } = useParams()
  const [guide, setGuide] = useState(null)
  const [entries, setEntries] = useState([])
  const [error, setError] = useState('')
  const [showDiaryForm, setShowDiaryForm] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [guideData, diaryData] = await Promise.all([
          guidesApi.get(id),
          diaryApi.list({ guide_id: id }),
        ])
        setGuide(guideData)
        setEntries(diaryData)
      } catch (err) {
        setError(err.message)
      }
    }
    load()
  }, [id])

  const handleDiarySubmit = async (payload) => {
    try {
      await diaryApi.create({ ...payload, entry_type: payload.entry_type || 'single_guide', guide_ids: [id] })
      setShowDiaryForm(false)
      const diaryData = await diaryApi.list({ guide_id: id })
      setEntries(diaryData)
    } catch (err) {
      setError(err.message)
    }
  }

  if (error) return <div className="page error">{error}</div>
  if (!guide) return <div className="page">Cargando...</div>

  return (
    <div className="page">
      <div className="guide-hero" style={{ borderColor: guide.theme_color || '#374151' }}>
        {guide.main_image_url && <img src={guide.main_image_url} alt={guide.name} />}
        <div>
          <h1>{guide.name}</h1>
          <p className="muted">{guide.description || 'Sin descripción'}</p>
          <p className="muted">Dominios: {(guide.domains || []).join(', ') || 'N/A'}</p>
        </div>
      </div>
      <Card
        title="Entradas de diario asociadas"
        subtitle="Explora las reflexiones vinculadas a este guía"
        action={
          <button onClick={() => setShowDiaryForm((v) => !v)}>
            {showDiaryForm ? 'Cerrar' : 'Add Diary Entry'}
          </button>
        }
      >
        {showDiaryForm && (
          <DiaryForm
            guides={[guide]}
            initialValues={{ entry_type: 'single_guide', guide_ids: [id] }}
            onSubmit={handleDiarySubmit}
            onCancel={() => setShowDiaryForm(false)}
          />
        )}
        <ul className="simple-list">
          {entries.map((entry) => (
            <li key={entry.id}>
              <div>
                <strong>{entry.title}</strong>
                <p className="muted">{new Date(entry.created_at).toLocaleString()}</p>
              </div>
            </li>
          ))}
          {entries.length === 0 && <p className="muted">Aún no hay entradas.</p>}
        </ul>
      </Card>
    </div>
  )
}

export default GuideDetail
