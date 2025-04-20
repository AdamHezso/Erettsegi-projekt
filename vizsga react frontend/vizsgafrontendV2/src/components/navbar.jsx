import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  return (
    <header className="navbar-header">
      <nav className="navbar">
        <div className="navbar-left">
          <button onClick={() => navigate('/')}>Főoldal</button>
          {/* Későbbi oldalak gombjai ide kerülnek */}
        </div>
        <div className="navbar-right">
          {isLoggedIn ? (
            <button onClick={onLogout}>Kijelentkezés</button>
          ) : (
            <button onClick={() => navigate('/login')}>Bejelentkezés</button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
