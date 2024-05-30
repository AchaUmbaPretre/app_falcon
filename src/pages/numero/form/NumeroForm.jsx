import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../../config';
import { toast } from 'react-toastify';
import { Spin, Button, Table, Input } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const NumeroForm = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [numeros, setNumeros] = useState(['']);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (index, event) => {
    const values = [...numeros];
    values[index] = event.target.value;
    setNumeros(values);
  };

  const handleAddField = () => {
    setNumeros([...numeros, '']);
  };

  const handleRemoveField = (index) => {
    const values = [...numeros];
    values.splice(index, 1);
    setNumeros(values);
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (numeros.some(numero => !numero)) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(`${DOMAIN}/affectation/numero_post`, { numeros });
      toast.success('Numéros créés avec succès!');
      navigate('/numero');
      window.location.reload();
    } catch (err) {
      if (err.response && err.response.status === 400 && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      title: 'Numéro',
      dataIndex: 'numero',
      key: 'numero',
      render: (text, record, index) => (
        <Input
          type="tel"
          name={`numero-${index}`}
          className="form-input"
          value={numeros[index]}
          onChange={(e) => handleInputChange(index, e)}
          placeholder='+243'
          style={{padding: '10px'}}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: "15%",
      render: (text, record, index) => (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {numeros.length > 1 && (
            <Button onClick={() => handleRemoveField(index)} danger>
              <DeleteOutlined />
            </Button>
          )}
          {index === numeros.length - 1 && (
            <Button onClick={handleAddField} type="dashed">
              <PlusOutlined />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const data = numeros.map((numero, index) => ({ key: index, numero }));

  return (
    <div className="clientForm">
      <div className="product-container">
        <div className="product-container-top">
          <div className="product-left">
            <h2 className="product-h2">Nouveau numéro</h2>
            <span>Créer un nouveau numéro</span>
          </div>
        </div>
        <div className="product-wrapper">
          <div className="product-container-bottom" style={{display:'flex', flexDirection:'column'}}>
            <Table
              columns={columns}
              dataSource={data}
              pagination={false}
              bordered
            />
            <div className="form-submit" style={{ marginTop: '20px' }}>
              <Button type="primary" onClick={handleClick} disabled={isLoading}>
                Envoyer
              </Button>
              {isLoading && (
                <div className="loader-container loader-container-center">
                  <Spin size="large" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumeroForm;
