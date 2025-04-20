import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import './App.css'

function Navbar({ isLoggedIn, onLogout }) {
  return (
    <nav>
      <Link to="/">Főoldal</Link>
      {isLoggedIn ? (
        <button onClick={onLogout}>Kijelentkezés</button>
      ) : (
        <Link to="/login">Bejelentkezés/Regisztráció</Link>
      )}
    </nav>
  )
}

function HomePage() {
  return (
    <div>
      <h1>Üdvözlünk a főoldalon!</h1>
      <p>Ez a főoldal tartalma.</p>
    </div>
  )
}

function LoginPage({ onLogin }) {
  const [login, setLogin] = useState(true)
  const navigate = useNavigate()

  return (
    <div>
      <label htmlFor="uname">Username: </label> <input type="email" name="uname" id="uname" /><br />
      <label htmlFor="pass">Password: </label> <input type="password" name="pass" id="pass" /><br />
      {login
        ? ""
        : <>
          <label htmlFor="email">Email: </label> <input type="text" name="email" id="email" /><br />
        </>
      }
      <button onClick={() => {
        if (login) {
          const loginRequest = new XMLHttpRequest()
          loginRequest.open('post', 'http://localhost:3000/login')
          loginRequest.setRequestHeader('Content-Type', 'application/json')
          loginRequest.send(JSON.stringify({
            loginName: uname.value,
            loginPassword: pass.value
          }))
          loginRequest.onreadystatechange = () => {
            if (loginRequest.status === 200 && loginRequest.readyState === 4) {
              alert('Sikeres bejelentkezés')
              onLogin()
              navigate('/profile') // Navigálás a profil oldalra
            } else if (loginRequest.readyState === 4) {
              alert('Hibás bejelentkezési adatok')
            }
          }
        } else {
          setLogin(true)
        }
      }}>Bejelentkezés</button>
      <button onClick={() => {
        if (login) {
          setLogin(false)
        } else {
          const regRequest = new XMLHttpRequest()
          regRequest.open('post', 'http://localhost:3000/register')
          regRequest.setRequestHeader('Content-Type', 'application/json')
          regRequest.send(JSON.stringify({
            registerName: uname.value,
            registerPassword: pass.value
          }))
          regRequest.onreadystatechange = () => {
            if (regRequest.status === 201 && regRequest.readyState === 4) {
              alert('Sikeres regisztráció')
            } else if (regRequest.readyState === 4) {
              alert('Hiba a regisztráció során')
            }
          }
        }
      }}>Regisztráció</button>
    </div>
  )
}

function ProfilePage() {
  return (
    <div>
      <h1>Felhasználói profil</h1>
      <p>Üdvözlünk a profil oldalon!</p>
    </div>
  )
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/profile" element={isLoggedIn ? <ProfilePage /> : <HomePage />} />
      </Routes>
    </Router>
  )
}

export default App
