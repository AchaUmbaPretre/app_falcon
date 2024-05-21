import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import './login.scss'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../../redux/apiCalls'
import { Spin } from 'antd'

const Login = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();


  const handleClick = async (e) => {
    e.preventDefault();
  
    try {
      setIsLoading(true);
      await login(dispatch, { username, password },navigate);

    } catch (error) {
      console.log(error);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
        <div className="login">
          <div className="login-container">
            <div className="login-left">
              <h1 className="login-h1"></h1>
              <p className="login-desc">
              </p>
              <Link to={'/register'} style={{color:'#000'}}>
                <span>Tu n'as pas de compte ?</span>
              </Link> 
            </div>
            <div className="login-right">
              <h1>Se connecter</h1>
              <form >
                <input type="text" placeholder='username' name='username' onChange={(e) => setUsername(e.target.value)}/>
                <input type="password" placeholder='password' name='password' onChange={(e) => setPassword(e.target.value)} />
                <button onClick={handleClick}>Envoyer</button>
                {isLoading && (
                <div className="loader-container loader-container-center">
                  <Spin size="large"/>
                </div>
            )}
              </form>
            </div>
          </div>
        </div>
    </>
  )
}

export default Login