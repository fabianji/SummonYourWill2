import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Guides from './pages/Guides'
import GuideDetail from './pages/GuideDetail'
import Diary from './pages/Diary'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/guides/:id" element={<GuideDetail />} />
          <Route path="/diary" element={<Diary />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
