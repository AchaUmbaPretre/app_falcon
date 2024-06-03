import React, { useState } from 'react';
import iconLogin from './../../assets/Location tracking-bro.png';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { register } from '../../redux/apiCalls';
import { Spin } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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
            toast.error("Erreur lors de l'enregistrement.");
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="login_container">
                <div className="login_wrapper">
                    <div className="login_left">
                        <div className="login_left_top">
                            <h2 className="login_h2">S'enregistrer</h2>
                            <span className="login_span">
                                Avez-vous un compte ?
                                <span className="login_span_sous">
                                    <Link to="/login"> Connectez-vous</Link>
                                </span>
                            </span>
                        </div>
                        <div className="login_control">
                            <label htmlFor="username" className="login_label">Nom</label>
                            <input 
                                type="text" 
                                id="username" 
                                placeholder="Entrer votre nom..." 
                                className="login_input" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                            />
                        </div>
                        <div className="login_control">
                            <label htmlFor="email" className="login_label">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                placeholder="votre@exemple.com" 
                                className="login_input" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>
                        <div className="login_control">
                            <div className="login_controle_row">
                                <label htmlFor="password" className="login_label">Mot de passe</label>
                            </div>
                            <div className="login_password_wrapper">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    id="password" 
                                    className="login_input" 
                                    placeholder="Entrer mot de passe" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                />
                                <span 
                                    className="login_password_eye" 
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                </span>
                            </div>
                        </div>
                        <div className="login-btn">
                            <button className="btn" onClick={handleClick}>Envoyer</button>
                            {isLoading && (
                                <div className="loader-container loader-container-center">
                                    <Spin size="large" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="login_right">
                        <img src={iconLogin} alt="Login Illustration" className="login-img" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;
