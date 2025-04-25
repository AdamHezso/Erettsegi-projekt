import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <nav>
        <div className="nav-left">
          <Link to="/">Főoldal</Link>
          <Link to="/store">Áruház</Link>
          <Link to="/cart">Kosár</Link>
        </div>
        <div className="nav-right">
          <Link to="/auth">Bejelentkezés</Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;