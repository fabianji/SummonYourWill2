import { NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Spiritual Universe</div>
      <div className="navbar-links">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/guides">Guides</NavLink>
        <NavLink to="/diary">Diary</NavLink>
      </div>
    </nav>
  )
}

export default Navbar
