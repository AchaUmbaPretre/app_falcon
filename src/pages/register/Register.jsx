import React, { useState } from 'react'
import {Link} from 'react-router-dom'
import './register.scss'
import axios from 'axios'

const Register = () => {

  const [inputs, setInputs] = useState({});

  const handChange = (e) =>{
    setInputs((prev) => ({...prev, [e.target.name]: e.target.value}));
  }
  const [error, setError] = useState(false);

  const handSubmit = async (e) => {
  }

  return (
    <>
        <div className="register">
          <div className="register-container">
            <div className="register-container">
              <div className="register-left">
                <h1 className="register-h1"></h1>
                <p className="register-desc">
                </p>
                <Link to={'/login'}>
                  <span>Avez-vous un compte ?</span>
                </Link>
                <Link href="" className="register-btn">Register</Link>
              </div>
              <div className="register-right">
                <h1>Register</h1>
                <form >
                  <input type="text" placeholder='username' name='username' onChange={handChange} />
                  <input type="email" placeholder='email' name='email' onChange={handChange}/>
                  <input type="password" placeholder='password' name='password' onChange={handChange}/>
                  <input type="text" placeholder='name' name='name' onChange={handChange}/>
                  <button onClick={handSubmit} >Envoyer</button>
                  { error && <span className="error">{error}</span>} 
                </form>
              </div>
            </div>
          </div>
        </div>
    </>
  )
}

export default Register