import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
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

// HomePage: reszponzív ajánlatok és carousel
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
        // Napi random ajánlatok (seed: dátum)
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
    <div id="home" className="homepage-container container py-3">
      <h1 className="text-center mb-4">Welcome to the homepage!</h1>
      {/* Bootstrap carousel - reszponzív képekkel */}
      <div className="container mb-4">
        <div id="carouselExampleIndicators" className="carousel slide rounded shadow overflow-hidden" data-bs-ride="carousel" data-bs-interval="5000">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="/assets/img/part4.jpg" className="d-block w-100 carousel-img" alt="Image 1" />
            </div>
            <div className="carousel-item">
              <img src="/assets/img/part5.jpg" className="d-block w-100 carousel-img" alt="Image 2" />
            </div>
            <div className="carousel-item">
              <img src="/assets/img/part3.jpg" className="d-block w-100 carousel-img" alt="Image 3" />
            </div>
          </div>
        </div>
      </div>
      <h2 className="daily-offers-title text-center mb-4">Daily Offers</h2>
      <div className="row g-3">
        {dailyParts.map(part => (
          <div key={part.id} className="col-12 col-sm-6 col-lg-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h3 className="card-title">{part.name}</h3>
                <p className="card-text">Price: {part.price ? part.price + ' Ft' : 'N/A'}</p>
                <p className="card-text">Stock: {part.stock !== undefined ? part.stock : 'N/A'}</p>
                <button className="btn btn-primary mt-auto w-100"
                  onClick={() => window.dispatchEvent(new CustomEvent('add-to-cart', { detail: part }))}>
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// LoginPage: reszponzív bejelentkezés/regisztráció
function LoginPage({ onLogin }) {
  const [login, setLogin] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="login-form p-4 rounded shadow" style={{ maxWidth: 350, width: '100%', background: '#fff' }}>
        <h2 className="mb-4 text-center">{login ? "Login" : "Register"}</h2>
        <label htmlFor="uname" className="form-label">Username:</label>
        <input type="email" name="uname" id="uname" className="form-control mb-2" />
        <label htmlFor="pass" className="form-label">Password:</label>
        <input type="password" name="pass" id="pass" className="form-control mb-2" />
        {!login && (
          <>
            <label htmlFor="email" className="form-label">Email:</label>
            <input type="text" name="email" id="email" className="form-control mb-2" />
          </>
        )}
        <div className="d-grid gap-2 mt-3">
          <button className="btn btn-primary"
            onClick={() => {
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
                    alert('Login successful');
                    onLogin();
                    navigate('/profile');
                  } else if (loginRequest.readyState === 4) {
                    alert('Invalid login credentials');
                  }
                };
              } else {
                setLogin(true);
              }
            }}>Login</button>
          <button className="btn btn-outline-secondary"
            onClick={() => {
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
                    alert('Registration successful');
                  } else if (regRequest.readyState === 4) {
                    alert('Registration error');
                  }
                };
              }
            }}>{login ? "Switch to Register" : "Register"}</button>
        </div>
      </div>
    </div>
  );
}

// ProfilePage: reszponzív profil, jelszóváltás, törlés
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
        if (!res.ok) throw new Error('Error fetching profile: ' + res.status);
        return res.json();
      })
      .then(data => setUser(data))
      .catch(err => setUser({ error: err.message }));
  }, []);

  const handleDelete = () => {
    if (!window.confirm('Are you sure you want to delete your user?')) return;
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

  if (!user) return <div style={{ marginTop: '70px' }}>Loading...</div>;
  if (user.error) return <div style={{ marginTop: '70px', color: 'red' }}>Error: {user.error}</div>;

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
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="bg-white border rounded shadow p-4" style={{ minWidth: 280, maxWidth: 400, width: '100%', color: 'black' }}>
        <h1 className="text-center mb-4">User Profile</h1>
        <p><b>Username:</b> {user.username}</p>
        <p><b>Password:</b> {user.password}</p>
        <p><b>Email:</b> {user.email}</p>
        <form onSubmit={handlePasswordChange} className="mt-3">
          <label className="form-label">New password:</label>
          <input type="password" placeholder="Change password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="form-control mb-2" />
          <button type="submit" className="btn btn-primary w-100">Change password</button>
        </form>
        <button onClick={handleDelete} className="btn btn-danger w-100 mt-3">
          Delete user
        </button>
        {message && <p className="text-success mt-2">{message}</p>}
      </div>
    </div>
  );
}

// Main application component, handles routing, cart, and authentication state
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
      const names = ['info', 'contact', 'customer_service', 'support', 'hello'];
      const domains = ['gmail.com', 'freemail.hu', 'yahoo.com', 'protonmail.com'];
      const name = names[Math.floor(Math.random() * names.length)];
      const domain = domains[Math.floor(Math.random() * domains.length)];
      return `${name}${Math.floor(Math.random()*100)}@${domain}`;
    }
    function getRandomInsta() {
      const base = ['autoshop', 'carparts', 'autoparts', 'autostore', 'partsshop'];
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
    // Clear cart on page reload
    setCart([]);
    localStorage.removeItem('cart');
    // Sync isLoggedIn with token
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
    alert('Logout successful');
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
