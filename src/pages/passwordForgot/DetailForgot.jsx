import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/apiCalls';
import { Spin } from 'antd';
import { FacebookFilled, GoogleOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import iconLogin from './../../assets/Location tracking-bro.png';
import config from '../../config';
import axios from 'axios';
import { toast } from 'react-toastify';

const DetailForgot = () => {
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const { data } = await axios.get(`${DOMAIN}/client/client_contact`);
          } catch (error) {
            console.log(error);
          }
        };
        fetchData();
      }, [DOMAIN]);

    return (
        <div className="login_container">
            <div className="login_wrapper">
                <div className="login_left">
                    <div className="login_left_top">
                        <h2 className="login_h2">Trouvez votre compte</h2>
                        <span className="login_span">
                            Tu n'as pas de compte ?
                            <span className="login_span_sous">
                                <Link to="/register"> Inscrivez-vous</Link>
                            </span>
                        </span>
                    </div>
                    <div className="login_control">
                        <Link className="login_label">Email</Link>
                    </div>
                </div>
                <div className="login_right">
                    <img src={iconLogin} alt="Login Illustration" className="login-img" />
                </div>
            </div>
        </div>
    );
};

export default DetailForgot;
