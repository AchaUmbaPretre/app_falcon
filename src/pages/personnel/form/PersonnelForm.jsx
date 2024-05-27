import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../../config';
import { toast } from 'react-toastify';
import { Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../../redux/apiCalls';

const PersonnelForm = () => {
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
        <div className="clientForm">
          <div className="product-container">
            <div className="product-container-top">
              <div className="product-left">
                <h2 className="product-h2">Un nouveau personnel</h2>
                <span>Créer un nouveau personnel</span>
              </div>
            </div>
            <div className="product-wrapper">
              <div className="product-container-bottom">
                <div className="form-controle">
                  <label htmlFor="">Nom <span style={{color:'red'}}>*</span></label>
                  <input type="text" name='username' className="form-input"  required/>
                </div>
                <div className="form-controle">
                  <label htmlFor="">Role <span style={{color:'red'}}>*</span></label>
                  <input type="text" name='role' className="form-input" />
                </div>
                <div className="form-controle">
                  <label htmlFor="">Telephone <span style={{color:'red'}}>*</span></label>
                  <input type="tel" name='telephone' className="form-input" required />
                </div>
                <div className="form-controle">
                  <label htmlFor="">Email <span style={{color:'red'}}>*</span></label>
                  <input type="email" name="email" className="form-input" />
                </div>
              </div>
              <div className="form-submit">
                <button className="btn-submit" onClick={handleClick} disabled={isLoading}>Envoyer</button>
                {isLoading && (
                  <div className="loader-container loader-container-center">
                    <Spin size="large" />
                  </div>
            )}
              </div>
            </div>
          </div>
        </div>
    </>
  )
}

export default PersonnelForm