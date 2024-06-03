import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/apiCalls';
import { Spin } from 'antd';
import { FacebookFilled, GoogleOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import iconLogin from './../../assets/Location tracking-bro.png';
import './login.scss';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleClick = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await login(dispatch, { username, password }, navigate);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login_container">
            <div className="login_wrapper">
                <div className="login_left">
                    <div className="login_left_top">
                        <h2 className="login_h2">Se connecter</h2>
                        <span className="login_span">
                            Tu n'as pas de compte ?
                            <span className="login_span_sous">
                                <Link to="/register"> Inscrivez-vous</Link>
                            </span>
                        </span>
                    </div>
                    <div className="login_control">
                        <label htmlFor="username" className="login_label">Email</label>
                        <input 
                            type="text" 
                            id="username" 
                            placeholder="votre@exemple.com" 
                            className="login_input" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
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
                                value={password} 
                                placeholder='Entrer votre mot de passe'
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
                    <div className="login_row_checked">
                        <input type="checkbox" id="remember-me" />
                        <label htmlFor="remember-me" className="login_checkbox">Remember me</label>
                    </div>
                    <div className="login-btn">
                        <button className="btn" onClick={handleClick}>Envoyer</button>
                        {isLoading && (
                            <div className="loader-container loader-container-center">
                                <Spin size="large" />
                            </div>
                        )}
                    </div>

                    <div className="login-ligne">
                        <span className="ligne"></span>
                        Or login with
                        <span className="ligne"></span>
                    </div>

                    <div className="login-rsx-rows">
                        <button className="btn-rx fb">
                            <FacebookFilled /> Facebook
                        </button>
                        <button className="btn-rx google">
                            <GoogleOutlined /> Google
                        </button>
                    </div>
                </div>
                <div className="login_right">
                    <img src={iconLogin} alt="Login Illustration" className="login-img" />
                </div>
            </div>
        </div>
    );
};

export default Login;
