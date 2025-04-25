import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ isLoggedIn, onLogout }) {
  return (
    <header className="navbar-header">
      <nav className="navbar">
        <div className="navbar-left">
          <Link className="nav-link" to="/">Főoldal</Link> {/* A navbar-brand helyett nav-link osztály */}
        </div>
        <div className="navbar-right">
          <div className="navbar-buttons">
            {!isLoggedIn && (
              <Link className="nav-link" to="/login">Bejelentkezés</Link>
            )}
            {isLoggedIn && (
              <>
                <Link className="nav-link" to="/profile">Profil</Link>
                <button className="nav-link" onClick={onLogout}>Kijelentkezés</button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
