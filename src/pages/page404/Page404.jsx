import React, { useState } from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const Page404 = () => {
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
      status="404"
      title="404"
      subTitle="Désolé, la page que vous avez visitée n'existe pas."
      extra={<Button type="primary" onClick={Logout}>Retour à l'accueil</Button>}
    />
  );
};

export default Page404;