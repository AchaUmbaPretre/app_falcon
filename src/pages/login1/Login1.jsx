import React from 'react'
import iconLogin from './../../assets/Location tracking-bro.png'
import './login1.scss'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../../redux/apiCalls'
import { Spin } from 'antd'
import { FacebookOutlined, FacebookFilled,GoogleOutlined} from '@ant-design/icons';

const Login1 = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const handleClick = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            await login(dispatch, { username, password }, navigate);

        } catch (error) {
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
                            <h2 className="login_h2">Se connecter</h2>
                            <span className="login_span">Tu n'as pas de compte<span className="login_span_sous"><Link to={'/register'}> ?</Link></span></span>
                        </div>
                        <div className="login_control">
                            <label htmlFor="" className="login_label">Email</label>
                            <input type="text" placeholder='votre@exemple.com' className="login_input" name='username' onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="login_control">
                            <div className="login_controle_row">
                                <label htmlFor="" className="login_label">Mot de passe</label>
                                {/* <span className="login_connecte">forgot password ?</span> */}
                            </div>
                            <input type="password" className="login_input" name='password' onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="login_row_checked">
                            <input type="checkbox" name="" id="" />
                            <span className="login_checkbox">Remember me</span>
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
                            <button className='btn-rx fb'><FacebookFilled />Facebook</button>
                            <button className='btn-rx google'><GoogleOutlined />Google</button>

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

export default Login1
