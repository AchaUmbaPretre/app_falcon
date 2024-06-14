import React, { useState } from 'react';
import axios from 'axios';
import config from '../../../config';
import { toast,ToastContainer } from 'react-toastify';
import { Spin, Button, Table, Input, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const NumeroForm = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [numeros, setNumeros] = useState(['']);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfirmLoading, setModalConfirmLoading] = useState(false);

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

  const handleClick = () => {
    if (numeros.some(numero => !numero)) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    // Ouvrir le modal de confirmation
    setModalVisible(true);
  };

  const handleConfirmSend = async () => {
    try {
      setModalConfirmLoading(true);
      await axios.post(`${DOMAIN}/affectation/numero_post`, { numeros });
      toast.success('Numéros créés avec succès!');
      window.location.reload();
    } catch (err) {
      if (err.response && err.response.status === 400 && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error(err.message);
      }
    } finally {
      setModalConfirmLoading(false);
      setModalVisible(false);
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
      width: "25%",
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
    <div className="traceurForm">
    <ToastContainer />
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
              <button type="primary" onClick={handleClick} disabled={isLoading} className='btn-submit'>
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
      </div>

      <Modal
        title="Confirmer l'envoi"
        visible={modalVisible}
        confirmLoading={modalConfirmLoading}
        onCancel={() => setModalVisible(false)}
        onOk={handleConfirmSend}
      >
        <p >Êtes-vous sûr de vouloir envoyer les données ?</p>
      </Modal>
    </div>
  );
};

export default NumeroForm;
