import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import { toast } from 'react-toastify';
import config from '../../config';
import iconLogin from './../../assets/Location tracking-bro.png';

const PassWordForgot = () => {
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);

    const handleClick = async (e) => {
        e.preventDefault();
        setIsLoading(true);
    
        try {
            const response = await axios.post(`${DOMAIN}/users/detail_forgot?email=${email}`);
            const data = response.data;
    
            if (Array.isArray(data) && data.length > 0) {
                setUser(data[0]);
            } else {
                toast.error('Aucun utilisateur trouvé.');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClickNew = async (e) => {
        e.preventDefault();
        setIsLoading(true);
    
        try {
             await axios.put(`${DOMAIN}/users/password_reset/${user.id}?password=${password}`);
             toast.success('Mot de passe a été changé avec succès!');
             navigate('/login');
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login_container">
            <div className="login_wrapper">
                {!user ? (
                    <div className="login_left">
                        <div className="login_left_top">
                            <h2 className="login_h2">Trouvez votre compte</h2>
                            <span className="login_span">
                                Vous n'avez pas de compte ?
                                <span className="login_span_sous">
                                    <Link to="/register"> Inscrivez-vous</Link>
                                </span>
                            </span>
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
                        <div className="login-btn">
                            <button className="btn" onClick={handleClick} disabled={isLoading}>
                                Envoyer
                            </button>
                            {isLoading && (
                                <div className="loader-container loader-container-center">
                                    <Spin size="large" />
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="login_left">
                        <div className="login_left_top">
                            <h2 className="login_h2">Détail de votre compte</h2>
                        </div>
                        <div className="login_control">
                            <span className="login_label">Nom : {user.username}</span>
                            <span className="login_label">Email : {user.email}</span>
                            <div className="login_password_wrapper">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                id="password" 
                                className="login_input" 
                                value={password} 
                                placeholder='Entrer votre nouveau mot de passe... '
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                            <span 
                                className="login_password_eye" 
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                            </span>
                        </div>
                        <div className="login-btn">
                            <button className="btn" onClick={handleClickNew} disabled={isLoading}>
                                Envoyer
                            </button>
                            {isLoading && (
                                <div className="loader-container loader-container-center">
                                    <Spin size="large" />
                                </div>
                            )}
                        </div>
                        </div>
                    </div>
                )}
                <div className="login_right">
                    <img src={iconLogin} alt="Login Illustration" className="login-img" />
                </div>
            </div>
        </div>
    );
};

export default PassWordForgot;
