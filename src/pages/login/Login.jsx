import React from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import './login.scss'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [input, setInput] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handChange = (e) =>{
    setInput((prev)=>({...prev, [ e.target.name]:e.target.value  }));
  }

  const handClick = async (e) =>{
    
  }
  return (
    <>
        <div className="login">
          <div className="login-container">
            <div className="login-left">
              <h1 className="login-h1"></h1>
              <p className="login-desc">
              </p>
              <Link to={'/register'}>
                <span>Tu n'as pas de compte ?</span>
              </Link>
              <Link to={'/register'} className="login-btn">Register</Link>
            </div>
            <div className="login-right">
              <h1>Login</h1>
              <form >
                <input type="text" placeholder='username' name='username' onChange={handChange} />
                <input type="password" placeholder='password' name='password' onChange={handChange} />
                <button onClick={handClick}>Envoyer</button>
                { error && <span className="error">{error}</span> }
              </form>
            </div>
          </div>
        </div>
    </>
  )
}

export default Login