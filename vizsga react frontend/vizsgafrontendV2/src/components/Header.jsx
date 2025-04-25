import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Header() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    navigate('/');
  };

  return (
    <header className="navbar-header">
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/">Főoldal</Link>
          <Link to="/store">Áruház</Link>
          <Link to="/cart">Kosár</Link>
        </div>
        <div className="navbar-right">
          {!loggedIn ? (
            <Link to="/auth">Bejelentkezés</Link>
          ) : (
            <button onClick={handleLogout}>Kijelentkezés</button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;