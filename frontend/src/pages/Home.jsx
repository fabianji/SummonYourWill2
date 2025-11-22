import { useEffect, useState } from 'react'
import Card from '../components/Card'
import { diaryApi, guidesApi } from '../services/api'
import './Home.css'

function Home() {
  const [guides, setGuides] = useState([])
  const [diaryEntries, setDiaryEntries] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const [guideData, diaryData] = await Promise.all([guidesApi.list(), diaryApi.list()])
        setGuides(guideData)
        setDiaryEntries(diaryData)
      } catch (err) {
        setError(err.message)
      }
    }
    loadData()
  }, [])

  const recentEntries = diaryEntries.slice(0, 3)
  const recentGuides = guides.slice(0, 3)

  return (
    <div className="page">
      <h1>Personal Universe</h1>
      <p className="muted">
        Un espacio para organizar tus guías espirituales, diarios y habilidades. Mantén la lógica desacoplada para
        futuras apps móviles.
      </p>
      {error && <div className="error">{error}</div>}
      <div className="grid">
        <Card title="Guides" subtitle="Resumen de tus guías">
          {recentGuides.length === 0 && <p className="muted">Aún no hay guías.</p>}
          <ul className="simple-list">
            {recentGuides.map((guide) => (
              <li key={guide.id}>
                <div className="pill" style={{ backgroundColor: guide.theme_color || '#1f2937' }}></div>
                <span>{guide.name}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Últimas entradas" subtitle="Diario personal y por guía">
          {recentEntries.length === 0 && <p className="muted">Escribe tu primera entrada.</p>}
          <ul className="simple-list">
            {recentEntries.map((entry) => (
              <li key={entry.id}>
                <div>
                  <strong>{entry.title}</strong>
                  <p className="muted">{new Date(entry.created_at).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}

export default Home
