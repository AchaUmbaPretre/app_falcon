import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import config from '../../../config';
import { ToastContainer, toast } from 'react-toastify';
import { Table, Button, Spin, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import './traceurForm.scss';

const TraceurForm = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const navigate = useNavigate();
  const [traceurs, setTraceurs] = useState([{ model: '', numero_serie: '', code: '', numero: '' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [modelOptions, setModelOptions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const newTraceurs = [...traceurs];
    newTraceurs[index][name] = value;
    setTraceurs(newTraceurs);
  };

  const handleModelChange = (index, selectedOption) => {
    const newTraceurs = [...traceurs];
    newTraceurs[index].model = selectedOption.value;
    setTraceurs(newTraceurs);
  };

  const addTraceur = () => {
    setTraceurs([...traceurs, { model: '', numero_serie: '', code: '', numero: '' }]);
  };

  const removeTraceur = (index) => {
    const newTraceurs = traceurs.filter((_, i) => i !== index);
    setTraceurs(newTraceurs);
  };

  useEffect(() => {
    const fetchModel = async () => {
      try {
        const response = await axios.get(`${DOMAIN}/traceur/traceur_model`);
        setModelOptions(
          response.data.map((item) => ({
            value: item.id_model_traceur,
            label: item.nom_model,
          }))
        );
      } catch (error) {
        console.error('Error fetching model:', error);
      }
    };
    fetchModel();
  }, [DOMAIN]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (traceurs.some((traceur) => !traceur.model || !traceur.numero_serie || !traceur.code)) {
      toast.error('Veuillez remplir tous les champs requis pour chaque traceur');
      return;
    }

    // Afficher le modal de confirmation avec les données des traceurs
    setModalData(traceurs);
    setModalVisible(true);
  };

  const handleConfirmSend = async () => {
    try {
      setIsLoading(true);
      await Promise.all(traceurs.map((traceur) => axios.post(`${DOMAIN}/traceur`, traceur)));
      toast.success('Traceurs créés avec succès!');
      navigate('/traceurs');
      window.location.reload();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setModalVisible(false);
    }
  };

  const handleCancelSend = () => {
    setModalVisible(false);
  };

  const columns = [
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
      render: (_, record, index) => (
        <Select
          options={modelOptions}
          onChange={(selectedOption) => handleModelChange(index, selectedOption)}
          placeholder="Sélectionnez un model..."
          value={modelOptions.find((option) => option.value === traceurs[index].model)}
        />
      ),
    },
    {
      title: 'Numéro série',
      dataIndex: 'numero_serie',
      key: 'numero_serie',
      render: (_, record, index) => (
        <input
          type="text"
          name="numero_serie"
          className="form-input"
          onChange={(e) => handleInputChange(index, e)}
          value={traceurs[index].numero_serie}
          placeholder="Entrer le numéro de série..."
          required
        />
      ),
    },
    {
      title: 'Telephone',
      dataIndex: 'numero',
      key: 'numero',
      render: (_, record, index) => (
        <input
          type="text"
          name="numero"
          className="form-input"
          onChange={(e) => handleInputChange(index, e)}
          value={traceurs[index].numero}
          placeholder="Entrer le téléphone..."
          required
        />
      ),
    },
    {
      title: 'Code(nomenclature)',
      dataIndex: 'code',
      key: 'code',
      render: (_, record, index) => (
        <input
          type="text"
          name="code"
          className="form-input"
          onChange={(e) => handleInputChange(index, e)}
          value={traceurs[index].code}
          placeholder="Entrer le code..."
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, __, index) => (
        <div className="action-buttons" style={{ display: 'flex' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={addTraceur} style={{ marginRight: '8px' }} />
          {traceurs.length > 1 && (
            <Button
              type="danger"
              icon={<DeleteOutlined />}
              onClick={() => removeTraceur(index)}
              style={{ color: 'red', border: '1px solid red' }}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <ToastContainer />
      <div className="traceurForm">
        <div className="product-container">
          <div className="product-container-top">
            <div className="product-left">
              <h2 className="product-h2">Nouveaux traceurs</h2>
              <span>Enregistrer de nouveaux traceurs</span>
            </div>
          </div>
          <div className="product-wrapper">
            <div className="product-container-bottom">
              <Table
                dataSource={traceurs}
                columns={columns}
                pagination={false}
                rowKey={(record, index) => index}
              />
              <div className="form-submit" style={{ margin: '20px 0' }}>
                <button type="primary" onClick={handleSubmit} disabled={isLoading} className="btn-submit">
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
      </div>

      {/* Modal de confirmation */}
      <Modal
        title="Confirmer l'envoi des traceurs"
        visible={modalVisible}
        onCancel={handleCancelSend}
        footer={[
          <Button key="cancel" onClick={handleCancelSend}>
            Annuler
          </Button>,
          <Button key="send" type="primary" onClick={handleConfirmSend} loading={isLoading}>
            Envoyer
          </Button>,
        ]}
      >
        {modalData && (
          <div>
            <p>Vous êtes sur le point d'envoyer les traceurs suivants :</p>
            <ul>
              {modalData.map((traceur, index) => (
                <li key={index}>
                  <strong>Modèle:</strong> {traceur.model}, <strong>Numéro de série:</strong> {traceur.numero_serie},{' '}
                  <strong>Téléphone:</strong> {traceur.numero}, <strong>Code:</strong> {traceur.code}
                </li>
              ))}
            </ul>
            <p>Confirmez-vous l'envoi de ces traceurs ?</p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default TraceurForm;
