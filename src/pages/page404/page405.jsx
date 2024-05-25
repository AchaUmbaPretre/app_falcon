import React, { useState } from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const Page405 = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState('')

  const Logout = async () => {
    try {
      setCurrentUser(null);
      localStorage.setItem('persist:root', JSON.stringify(currentUser));
      navigate('/login')
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <Result
    status="403"
    title="403"
    subTitle="Veuillez attendre l'autorisation de l'administrateur pour accéder à votre compte"
    extra={<Button type="primary" onClick={Logout} >Retour</Button>}
  />
  );
};

export default Page405;