import React, { useState } from 'react'
import iconLogin from './../../assets/Location tracking-bro.png'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { register } from '../../redux/apiCalls';
import { Spin } from 'antd';

const Register1 = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

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
        <div className="login_container">
            <div className="login_wrapper">
                <div className="login_left">
                    <div className="login_left_top">
                        <h2 className="login_h2">Se registrer</h2>
                        <span className="login_span">Avez-vous un compte<span className="login_span_sous"> <Link to={'/login'}> ?</Link></span></span>
                    </div>
                    <div className="login_control">
                        <label htmlFor="" className="login_label">Nom</label>
                        <input type="text" placeholder='Entrer votre nom...' name="username"  className="login_input" onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="login_control">
                        <label htmlFor="" className="login_label">Email</label>
                        <input type="email" placeholder='votre@exemple.com' name='email' className="login_input" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="login_control">
                        <div className="login_controle_row">
                            <label htmlFor="" className="login_label">Mot de passe</label>
                            <span className="login_connecte"></span>
                        </div>
                        <input type="password" className="login_input" placeholder='Entrer password' onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="login-btn">
                        <button className="btn" onClick={handleClick}>Envoyer</button>
                        {isLoading && (
                        <div className="loader-container loader-container-center">
                            <Spin size="large"/>
                        </div>
                    )}
                    </div>

                </div>
                <div className="login_right">
                    <img src={iconLogin} alt="" className="login-img" />
                </div>

            </div>
        </div>
      
    </>
  )
}

export default Register1
