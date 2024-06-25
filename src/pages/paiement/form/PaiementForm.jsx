import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import config from '../../../config';
import { ToastContainer, toast } from 'react-toastify';
import { Spin, Modal, Tabs, DatePicker } from 'antd';
import './paiementForm.scss';
import { useSelector } from 'react-redux';

const { TabPane } = Tabs;

const PaiementForm = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [data, setData] = useState({});
  const [dataClient, setDataClient] = useState([]);
  const [methode, setMethode] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.currentUser.id);


  const handleInputChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
  
    // Vérifier si le champ est un champ de fichier
    if (e.target.type === 'file') {
      const file = e.target.files[0];

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
        };
        reader.readAsDataURL(file);
        setData((prev) => ({ ...prev, [fieldName]: file }));
      } else {
        setData((prev) => ({ ...prev, [fieldName]: null }));
      }
    } else {
      // Traitement pour les autres types de champs
      let updatedValue = fieldValue;
      if (fieldName === "contact_email") {
        updatedValue = fieldValue.toLowerCase();
      } else if (Number.isNaN(Number(fieldValue))) {
        if (typeof fieldValue === "string" && fieldValue.length > 0) {
          updatedValue = fieldValue.charAt(0).toUpperCase() + fieldValue.slice(1);
        }
      }
      setData((prev) => ({ ...prev, [fieldName]: updatedValue }));
    }
  };

  const fetchClient = useCallback(async () => {
    try {
      const { data } = await axios.get(`${DOMAIN}/client`);
      setDataClient(data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    }
  }, [DOMAIN]);

  const fetchMethode = useCallback(async () => {
    try {
      const { data } = await axios.get(`${DOMAIN}/paiement/methode`);
      setMethode(data);
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
    }
  }, [DOMAIN]);

  useEffect(() => {
    fetchClient();
    fetchMethode();
  }, [fetchClient, fetchMethode]);

/*   useEffect(() => {
    if (data.id_client && data.date_paiement && data.methode) {
      setActiveTab("2");
    }
  }, [data]); */

  const handleSubmit = async () => {
    if (!data.id_client || !data.montant) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(`${DOMAIN}/paiement`, {...data, user_paiement: userId },{
        headers: {
        'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Paiement créé avec succès!');
      navigate('/paiement');
      window.location.reload();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const showModal = () => {
    if (!data.id_client || !data.montant) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    handleSubmit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDateChange = (date, dateString) => {
    setData((prevData) => ({ ...prevData, date_paiement: dateString }));
};

  return (
    <>
      <ToastContainer />
      <div className="paiementForm">
        <div className="product-container">
          <div className="product-container-top">
            <h2 className="product-h2">Paiement</h2>
          </div>
          <div className="product-wrapper">
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="Informations Client" key="1">
                <form className="product-container-bottom form_hand">
                  <div className="form-controle">
                    <label htmlFor="id_client">
                      Client <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select
                      name="id_client"
                      options={dataClient.map((item) => ({
                        value: item.id_client,
                        label: item.nom_client,
                      }))}
                      onChange={(selectedOption) => setData((prev) => ({ ...prev, id_client: selectedOption.value }))}
                      placeholder="Sélectionnez un client..."
                    />
                  </div>

                  <div className="form-controle">
                    <label htmlFor="montant">
                      Montant <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      name="montant"
                      className="form-input"
                      onChange={handleInputChange}
                      required
                      placeholder="ex : 100"
                    />
                  </div>

                  <div className="form-controle">
                    <label htmlFor="methode">
                      Méthode de paiement <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select
                      name="methode"
                      options={methode.map((item) => ({
                        value: item.id_methode,
                        label: item.nom_methode,
                      }))}
                      onChange={(selectedOption) => setData((prev) => ({ ...prev, methode: selectedOption.value }))}
                      placeholder="Sélectionnez une méthode..."
                    />
                  </div>
                  <div className="form-controle" style={{ display: "flex", flexDirection: 'column' }}>
                    <label>
                      Date de paiement <span style={{ color: 'red' }}>*</span>
                    </label>
                    <DatePicker name='date_paiement' onChange={handleDateChange} />
                  </div>
                </form>
              </TabPane>

              <TabPane tab="Détails du Paiement" key="2">
                <form className="product-container-bottom form_hand">
                  <div className="form-controle">
                    <label htmlFor="numero_paiement">
                      Numéro de paiement <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input 
                      type="number"
                      min="0"
                      name="code_paiement"
                      className="form-input"
                      placeholder="ex : 123456"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-controle">
                    <label htmlFor="document">
                      Document <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input 
                      type="file"
                      name="document"
                      className="form-input"
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-controle">
                    <label htmlFor="reference">
                      Référence <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="text" 
                      name="ref" 
                      className="form-input"
                      onChange={handleInputChange}
                      placeholder="Référence" 
                    />
                  </div>
                </form>
                <div className="form-submit">
                <button type="button" className="btn-submit" onClick={showModal} disabled={isLoading}>
                  Envoyer
                </button>
                {isLoading && (
                  <div className="loader-container loader-container-center">
                    <Spin size="large" />
                  </div>
              )}
            </div>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>

      <Modal
        title="Confirmer l'opération"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Oui"
        cancelText="Non"
      >
        <p>Êtes-vous sûr de vouloir effectuer cette opération ?</p>
      </Modal>
    </>
  );
};

export default PaiementForm;
