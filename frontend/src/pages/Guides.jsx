import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import GuideForm from '../components/GuideForm'
import { guidesApi } from '../services/api'
import './Guides.css'

function Guides() {
  const [guides, setGuides] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  const loadGuides = async () => {
    try {
      const data = await guidesApi.list()
      setGuides(data)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadGuides()
  }, [])

  const handleSubmit = async (payload) => {
    try {
      await guidesApi.create(payload)
      setShowForm(false)
      loadGuides()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Guides</h1>
          <p className="muted">Define tus guías espirituales y sus dominios.</p>
        </div>
        <button onClick={() => setShowForm((v) => !v)}>{showForm ? 'Cerrar' : 'Add Guide'}</button>
      </div>
      {error && <div className="error">{error}</div>}
      {showForm && <GuideForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />}
      <div className="grid guides-grid">
        {guides.map((guide) => (
          <Card
            key={guide.id}
            title={guide.name}
            subtitle={guide.description || 'Sin descripción'}
            action={<Link to={`/guides/${guide.id}`}>Ver detalle</Link>}
          >
            <div className="guide-meta">
              <span className="pill" style={{ backgroundColor: guide.theme_color || '#1f2937' }}></span>
              <div>
                <p className="muted">Domains: {(guide.domains || []).join(', ') || 'N/A'}</p>
              </div>
            </div>
          </Card>
        ))}
        {guides.length === 0 && <p className="muted">Agrega tu primer guía.</p>}
      </div>
    </div>
  )
}

export default Guides
