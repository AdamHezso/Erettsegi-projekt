import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import './App.css'
import './bootstrap-min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Navbar from './components/navbar.jsx';
import ShopPage from './components/ShopPage.jsx';
import CartPage from './components/CartPage.jsx';
import CheckoutPage from './components/CheckoutPage.jsx';
import OrderTrackingPage from './components/OrderTrackingPage.jsx';
import './components/HomePage.css';
import Footer from './components/Footer.jsx';

function HomePage() {
  const [dailyParts, setDailyParts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/parts')
      .then(res => res.json())
      .then(parts => {
        if (!Array.isArray(parts) || parts.length === 0) {
          setDailyParts([]);
          return;
        }
        // Naponta változó random ajánlatok (seed: dátum)
        const today = new Date();
        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        function seededRandom(s) {
          let x = Math.sin(s++) * 10000;
          return x - Math.floor(x);
        }
        let shuffled = [...parts];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(seededRandom(seed + i) * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setDailyParts(shuffled.slice(0, 4));
      });
  }, []);

  return (
    <div id="home" className="homepage-container">
      <h1>Üdvözlünk a főoldalon!</h1>
      <div id="carouselExampleIndicators" className="carousel slide carousel-container" data-bs-ride="carousel" data-bs-interval="3000">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="/assets/img/part1.jpg" className="d-block w-100" alt="Kép 1" />
          </div>
          <div className="carousel-item">
            <img src="/assets/img/part2.jpg" className="d-block w-100" alt="Kép 2" />
          </div>
          <div className="carousel-item">
            <img src="/assets/img/part1.jpg" className="d-block w-100" alt="Kép 3" />
          </div>
        </div>
      </div>
      <div style={{ marginTop: 40 }}>
        <h2 className="daily-offers-title">Napi ajánlatok</h2>
        <div className="daily-offers-row">
          {dailyParts.map(part => (
            <div key={part.id} className="daily-offer-card">
              <h3>{part.nev}</h3>
              <p>Ár: {part.ar ? part.ar + ' Ft' : 'N/A'}</p>
              <p>Raktárkészlet: {part.raktarkeszlet !== undefined ? part.raktarkeszlet : 'N/A'}</p>
              <button onClick={() => window.dispatchEvent(new CustomEvent('add-to-cart', { detail: part }))}>
                Kosárba
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LoginPage({ onLogin }) {
  const [login, setLogin] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Regisztráció/Bejelentkezés</h2>
        <label htmlFor="uname">Username: </label>
        <input type="email" name="uname" id="uname" /><br />
        <label htmlFor="pass">Password: </label>
        <input type="password" name="pass" id="pass" /><br />
        {login ? "" : (
          <>
            <label htmlFor="email">Email: </label>
            <input type="text" name="email" id="email" /><br />
          </>
        )}
        <button onClick={() => {
          if (login) {
            const loginRequest = new XMLHttpRequest();
            loginRequest.open('post', 'http://localhost:3000/login');
            loginRequest.setRequestHeader('Content-Type', 'application/json');
            loginRequest.send(JSON.stringify({
              loginName: uname.value,
              loginPassword: pass.value
            }));
            loginRequest.onreadystatechange = () => {
              if (loginRequest.status === 200 && loginRequest.readyState === 4) {
                const response = JSON.parse(loginRequest.responseText);
                if (response.token) {
                  localStorage.setItem('token', response.token);
                }
                alert('Sikeres bejelentkezés');
                onLogin();
                navigate('/profile'); // Navigálás a profil oldalra
              } else if (loginRequest.readyState === 4) {
                alert('Hibás bejelentkezési adatok');
              }
            };
          } else {
            setLogin(true);
          }
        }}>Bejelentkezés</button>
        <button onClick={() => {
          if (login) {
            setLogin(false);
          } else {
            const regRequest = new XMLHttpRequest();
            regRequest.open('post', 'http://localhost:3000/register');
            regRequest.setRequestHeader('Content-Type', 'application/json');
            regRequest.send(JSON.stringify({
              registerName: uname.value,
              registerPassword: pass.value,
              email: email.value
            }));
            regRequest.onreadystatechange = () => {
              if (regRequest.status === 201 && regRequest.readyState === 4) {
                alert('Sikeres regisztráció');
              } else if (regRequest.readyState === 4) {
                alert('Hiba a regisztráció során');
              }
            };
          }
        }}>Regisztráció</button>
      </div>
    </div>
  );
}

function ProfilePage({ onLogout }) {
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('http://localhost:3000/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Hiba a profil lekérdezésekor: ' + res.status);
        return res.json();
      })
      .then(data => setUser(data))
      .catch(err => setUser({ error: err.message }));
  }, []);

  const handleDelete = () => {
    if (!window.confirm('Biztosan törölni szeretnéd a felhasználót?')) return;
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/profile', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        localStorage.removeItem('token');
        if (onLogout) onLogout();
        navigate('/');
      });
  };

  if (!user) return <div style={{ marginTop: '70px' }}>Betöltés...</div>;
  if (user.error) return <div style={{ marginTop: '70px', color: 'red' }}>Hiba: {user.error}</div>;

  const handlePasswordChange = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/profile/password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ newPassword })
    })
      .then(res => res.json())
      .then(data => setMessage(data.message));
  };

  return (
    <div style={{ marginTop: '170px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '60vh' }}>
      <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '2rem 2.5rem', minWidth: 320, color: 'black' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Felhasználói profil</h1>
        <p><b>Felhasználónév:</b> {user.felnev}</p>
        <p><b>Jelszó:</b> {user.jelszo}</p>
        <p><b>Email:</b> {user.email}</p>
        <form onSubmit={handlePasswordChange} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          <label>Új jelszó:</label>
          <input type="password" placeholder="Jelszó módosítása" value={newPassword} onChange={e => setNewPassword(e.target.value)} required style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }} />
          <button type="submit" style={{ padding: '0.5rem', borderRadius: '6px', background: '#007bff', color: '#fff', border: 'none', marginTop: '0.5rem', cursor: 'pointer' }}>Jelszó módosítása</button>
        </form>
        <button onClick={handleDelete} style={{ marginTop: '2rem', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.7rem 1.2rem', cursor: 'pointer', width: '100%' }}>
          Felhasználó törlése
        </button>
        {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
      </div>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const [cart, setCart] = useState(() => []);
  const [footerData, setFooterData] = useState(() => {
    const saved = localStorage.getItem('footerData');
    if (saved) return JSON.parse(saved);
    function getRandomPhone() {
      const nums = ['+36 20', '+36 30', '+36 70', '+36 1'];
      const prefix = nums[Math.floor(Math.random() * nums.length)];
      const number = Math.floor(1000000 + Math.random() * 9000000);
      return `${prefix} ${number}`;
    }
    function getRandomEmail() {
      const names = ['info', 'kapcsolat', 'ugyfelszolgalat', 'support', 'hello'];
      const domains = ['gmail.com', 'freemail.hu', 'yahoo.com', 'protonmail.com'];
      const name = names[Math.floor(Math.random() * names.length)];
      const domain = domains[Math.floor(Math.random() * domains.length)];
      return `${name}${Math.floor(Math.random()*100)}@${domain}`;
    }
    function getRandomInsta() {
      const base = ['autoshop', 'alkatreszbolt', 'carparts', 'autobolt', 'alkatreszshop'];
      return `@${base[Math.floor(Math.random()*base.length)]}${Math.floor(Math.random()*1000)}`;
    }
    const data = {
      phone: getRandomPhone(),
      email: getRandomEmail(),
      insta: getRandomInsta()
    };
    localStorage.setItem('footerData', JSON.stringify(data));
    return data;
  });

  useEffect(() => {
    // Kosár törlése oldal újratöltésekor
    setCart([]);
    localStorage.removeItem('cart');
    // isLoggedIn szinkronizálása tokennel
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (part) => {
    setCart(prev => {
      const found = prev.find(item => item.id === part.id);
      if (found) {
        return prev.map(item => item.id === part.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...part, quantity: 1 }];
    });
  };

  const handleUpdateCart = (newCart) => {
    setCart(newCart);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    alert('Sikeres kijelentkezés');
  };

  useEffect(() => {
    const handleAddToCartEvent = (event) => {
      handleAddToCart(event.detail);
    };
    window.addEventListener('add-to-cart', handleAddToCartEvent);
    return () => {
      window.removeEventListener('add-to-cart', handleAddToCartEvent);
    };
  }, []);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/profile" element={isLoggedIn ? <ProfilePage onLogout={handleLogout} /> : <HomePage />} />
        <Route path="/shop" element={<ShopPage onAddToCart={handleAddToCart} />} />
        <Route path="/cart" element={<CartPage cart={cart} onUpdateCart={handleUpdateCart} />} />
        <Route path="/checkout" element={<CheckoutPage cart={cart} setCart={setCart} />} />
        <Route path="/order-tracking" element={localStorage.getItem('token') ? <OrderTrackingPage /> : <HomePage />} />
      </Routes>
      <Footer phone={footerData.phone} email={footerData.email} insta={footerData.insta} />
    </Router>
  );
}

export default App
