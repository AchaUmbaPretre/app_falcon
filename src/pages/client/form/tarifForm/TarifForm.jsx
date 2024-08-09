import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Spin, Modal, Button } from 'antd';
import config from '../../../../config';

const TarifForm = ({ id_client }) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [fields, setFields] = useState([
    { type: 'Abonnement', tarif: '', prix: '' },
    { type: 'Installation', tarif: '', prix: '' },
    { type: 'Démantèlement', tarif: '', prix: '' },
    { type: 'Transfert', tarif: '', prix: '' },
    { type: 'Controle technique', tarif: '', prix: '' }
  ]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfirmLoading, setModalConfirmLoading] = useState(false);

  const handleInputChange = useCallback((index, e) => {
    const { name, value } = e.target;
    const updatedFields = [...fields];
    updatedFields[index][name] = value;
    setFields(updatedFields);
  }, [fields]);

  const handleAddField = useCallback(() => {
    setFields([...fields, { type: '', tarif: '', prix: '' }]);
  }, [fields]);

  const handleRemoveField = useCallback((index) => {
    setFields(fields.filter((_, i) => i !== index));
  }, [fields]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setModalVisible(true);
  }, [fields]);


  const handleConfirmSend = useCallback(async () => {
    try {
      setModalConfirmLoading(true);
      await axios.post(`${DOMAIN}/client/tarifForm`, {
        tarifDetails: fields,
        id_client: id_client
      });
      toast.success('Les tarifs ont été envoyés avec succès!');
      navigate('/client');
      window.location.reload();
    } catch (err) {
      if (err.response && err.response.status === 400 && err.response.data && err.response.data.error) {
        const errorMessage = err.response.data.error;
        toast.error(errorMessage);
      } else {
        toast.error(err.message);
      }
    } finally {
      setModalConfirmLoading(false);
      setModalVisible(false);
      setIsLoading(false);
    }
  }, [fields, DOMAIN, navigate, id_client]);

  return (
    <div className="clientForms">
      <ToastContainer />
      <div className="product-container">
        <div className="product-container-top">
          <div className="product-left">
            <h2 className="product-h2">Ajouter des tarifs</h2>
            <span></span>
          </div>
        </div>
        <div className="product-wrapper">
          <div>
            <form onSubmit={handleSubmit} className="product-container-bottom" style={{ display: 'flex', flexDirection: 'column' }}>
              {fields.map((field, index) => (
                <div key={index} className="form-controle">
                  <label htmlFor={`type-${index}`}>
                    Type de tarif <span style={{ color: 'red' }}>*</span>
                  </label>
                  <select
                    name='type'
                    id={`type-${index}`}
                    className="form-input"
                    value={field.type}
                    onChange={(e) => handleInputChange(index, e)}
                    required
                  >
                    <option value="">Sélectionner un type</option>
                    <option value="Abonnement">Abonnement</option>
                    <option value="Installation">Installation</option>
                    <option value="Démantèlement">Démantèlement</option>
                    <option value="Transfert">Transfert</option>
                    <option value="Controle technique">Controle technique</option>
                  </select>
                  <label htmlFor={`prix-${index}`}>
                    Prix <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type='text'
                    name='prix'
                    id={`prix-${index}`}
                    className="form-input"
                    value={field.prix}
                    onChange={(e) => handleInputChange(index, e)}
                    required
                  />
                  <Button type="link" onClick={() => handleRemoveField(index)}>Supprimer</Button>
                </div>
              ))}
              <Button type="button" onClick={handleAddField}>Ajouter un tarif</Button>
              <div className="form-submit">
                <button type="submit" className="btn-submit" disabled={isLoading}>
                  Envoyer
                </button>
                {isLoading && (
                  <div className="loader-container loader-container-center">
                    <Spin size="large" />
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <Modal
        title="Confirmer l'envoi"
        visible={modalVisible}
        confirmLoading={modalConfirmLoading}
        onCancel={() => setModalVisible(false)}
        onOk={handleConfirmSend}
        className="confirmation-modal"
      >
        <p className="modal-text">Voulez-vous envoyer les informations suivantes ?</p>
        <ul>
          {fields.map((field, index) => (
            <li key={index}>
              <strong>Type de tarif :</strong> {field.type} -  <strong>Prix :</strong> {field.prix} $
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
};

export default TarifForm;
