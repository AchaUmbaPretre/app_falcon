import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import './register.scss'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux'
import { Spin } from 'antd'
import { register } from '../../redux/apiCalls'

const Register = () => {

  const [inputs, setInputs] = useState({});
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isFetching, error } = useSelector((state) => state.user);

  const handleClick = async (e) => {
    e.preventDefault();
  
    try {
      setIsLoading(true);
      await register(dispatch, { username, email, password });
      toast.success('Enregistrement réussi !');
      navigate('/login');
      window.location.reload();
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement.');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
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
                <Link to={'/login'} style={{color:'#000'}}>
                  <span>Avez-vous un compte ?</span>
                </Link>
              </div>
              <div className="register-right">
                <h1>Register</h1>
                <form >
                  <input type="text" placeholder='username' name='username' onChange={(e) => setUsername(e.target.value)} />
                  <input type="email" placeholder='email' name='email' onChange={(e) => setEmail(e.target.value)} />
                  <input type="password" placeholder='password' name='password'  onChange={(e) => setPassword(e.target.value)}/>
                  <button onClick={handleClick} >Envoyer</button>
                  {isLoading && (
                  <div className="loader-container loader-container-center">
                    <Spin size="large"/>
                  </div>
              )}
                </form>
              </div>
            </div>
          </div>
        </div>
    </>
  )
}

export default Register