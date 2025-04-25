import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthPage() {
    const [login, setLogin] = useState(true)

    return (
      <>
        <div>
          <label htmlFor='email'>Email: </label> <input type="email" name="email" id="email" /><br />
          <label htmlFor='pass'>Password: </label> <input type="password" name="pass" id="pass" /><br />
          {login
            ? ""
            : <>
              <label htmlFor='uname'>Username: </label> <input type="text" name="uname" id="uname" /><br />
            </>
          }
          <button onClick={() => {
            if (login) {
              const loginRequest = new XMLHttpRequest()
              loginRequest.open('post', 'http://127.1.1.1:3000/login')
              loginRequest.setRequestHeader('Content-Type', 'Application/JSON')
              loginRequest.send(JSON.stringify({
                loginEmail: email.value,
                loginPassword: pass.value
              }))
              loginRequest.onreadystatechange = () => {
                if(loginRequest.status == 200 && loginRequest.readyState == 4){
                  alert('sikeres bejelentkezés')
                }
              }
            }
            else {
              setLogin((login) => true)
            }
          }}>Bejelentkezés</button>
          <button onClick={() => {
            if (login) {
              setLogin((login) => false)
            }
            else {
              const regRequest = new XMLHttpRequest()
              regRequest.open('post', 'http://127.1.1.1:3000/register')
              regRequest.setRequestHeader('Content-Type', 'Application/JSON')
              regRequest.send(JSON.stringify({
                regEmail: email.value,
                regPassword: pass.value,
                regName: uname.value
              }))
              regRequest.onreadystatechange = () => {
                if(regRequest.status == 201 && regRequest.readyState == 4){
                  alert('sikeres regisztráció')
                }
              }
            }
          }}>Regisztráció</button>
  
        </div>
      </>
    )
}

export default AuthPage;