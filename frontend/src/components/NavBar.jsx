import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <header className="navbar">
      <div className="brand">Spiritual Universe</div>
      <nav>
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/guides">Guides</NavLink>
        <NavLink to="/diary">Diary</NavLink>
        <NavLink to="/abilities">Abilities</NavLink>
        <NavLink to="/media">Media</NavLink>
      </nav>
    </header>
  );
};

export default NavBar;
