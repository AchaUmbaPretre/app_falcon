import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import config from '../../../config';
import { toast } from 'react-toastify';
import { Modal, Spin } from 'antd';
import { useSelector } from 'react-redux';

const OperationRemplacement = ({ id_type_operation }) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const [client, setClient] = useState([]);
  const [idClient, setIdClient] = useState('');
  const [site, setSite] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [traceur, setTraceur] = useState([]);
  const [vehicule, setVehicule] = useState([]);
  const userId = useSelector((state) => state.user.currentUser.id);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [etat, setEtat] = useState([]);

  const handleConfirm = () => {
    setShowConfirmModal(true);
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
  };

  const handleInputChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
  
    // Vérifier si le champ est un champ de fichier
    if (e.target.type === 'file') {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        setData((prev) => ({ ...prev, [fieldName]: file }));
      } else {
        setImagePreview('');
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

  useEffect(() => {
    setIdClient(data?.id_client);
  }, [data?.id_client]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/traceur/traceur_etat`);
        setEtat(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN]);

  console.log(data)

  const handleClick = async (e) => {
    e.preventDefault();

    if (!data.id_client || !data.site) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(`${DOMAIN}/operation`, {
        ...data,
        id_type_operations: id_type_operation,
        user_cr: userId
      }, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Opération créée avec succès!');
      navigate('/operations');
      window.location.reload();
    } catch (err) {
      if (err.response && err.response.status === 400 && err.response.data && err.response.data.message) {
        const errorMessage = `Le client ${data.nom} existe déjà avec ce numéro de téléphone`;
        toast.error(errorMessage);
      } else {
        toast.error(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/client`);
        setClient(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/vehicule?id_client=${idClient}`);
        setVehicule(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN, idClient]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/traceur/traceurInstall`);
        setTraceur(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/operation/site`);
        setSite(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/users`);
        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN]);

  const supervisorOptions = users
    .filter((user) => user.role === 'superviseur')
    .map((supervisor) => ({
      value: supervisor.id,
      label: supervisor.username,
    }));

  const ingenieurOptions = users
    .filter((user) => user.role === 'technicien')
    .map((technicien) => ({
      value: technicien.id,
      label: technicien.username,
    }));

    const traceurOptions = traceur
    .filter((t) => [1, 2, 6].includes(t.id_etat_traceur))
    .map((tc) => ({
      value: tc.id_traceur,
      label: tc.code
    }));


  return (
    <>
      <div className="clientForm">
        <div className="product-container">
          <div className="product-container-top">
            <div className="product-left">
              <h2 className="product-h2">Opération : Remplacement</h2>
            </div>
          </div>
          <div className="product-wrapper">
            <div className="product-container-bottom">
              <div className="form-controle">
                <label htmlFor="">Nom client ou société<span style={{ color: 'red' }}>*</span></label>
                <Select
                  name="id_client"
                  options={client?.map((item) => ({
                    value: item.id_client,
                    label: item.nom_client,
                  }))}
                  onChange={(selectedOption) =>
                    handleInputChange({
                      target: { name: 'id_client', value: selectedOption.value },
                    })
                  }
                  placeholder="Sélectionnez un client..."
                />
              </div>
              <div className="form-controle">
                <label htmlFor="">Site <span style={{ color: 'red' }}>*</span></label>
                <Select
                  name="site"
                  options={site?.map((item) => ({
                    value: item.id_site,
                    label: item.nom_site,
                  }))}
                  onChange={(selectedOption) =>
                    handleInputChange({
                      target: { name: 'site', value: selectedOption.value },
                    })
                  }
                  placeholder="Sélectionnez un site..."
                />
              </div>
              <div className="form-controle">
                <label htmlFor="">Véhicule <span style={{ color: 'red' }}>*</span></label>
                <Select
                  name="id_vehicule"
                  options={vehicule?.map((item) => ({
                    value: item.id_vehicule,
                    label: `Marque : ${item.nom_marque} / Matricule : ${item.matricule}`,
                  }))}
                  onChange={(selectedOption) =>
                    handleInputChange({
                      target: { name: 'id_vehicule', value: selectedOption.value },
                    })
                  }
                  placeholder="Sélectionnez un véhicule..."
                />
              </div>
              <div className="form-controle">
                <label htmlFor="">Traceur <span style={{ color: 'red' }}>*</span></label>
                <Select
                  name="id_traceur"
                  options={traceurOptions?.map((item) => ({
                    value: item.value,
                    label: item.label   
                  }))}
                  onChange={(selectedOption) =>
                    handleInputChange({
                      target: { name: 'id_traceur', value: selectedOption.value },
                    })
                  }
                  placeholder="Sélectionnez un traceur..."
                />
              </div>
              <div className="form-controle">
                  <label htmlFor="">Etat du traceur <span style={{color:'red'}}>*</span></label>
                  <Select
                      name="id_etat_traceur"
                      options={etat?.map((item) => ({
                        value: item.id_etat_traceur,
                        label: item.nom_etat_traceur,
                      }))}
                      onChange={(selectedOption) =>
                        handleInputChange({
                          target: { name: 'id_etat_traceur', value: selectedOption.value },
                        })
                      }
                      placeholder="Sélectionnez un état..."
                    /> 
                </div>
              <div className="form-controle">
                <label htmlFor="">Superviseur <span style={{ color: 'red' }}>*</span></label>
                <Select
                  name="id_superviseur"
                  options={supervisorOptions}
                  onChange={(selectedOption) =>
                    handleInputChange({
                      target: { name: 'id_superviseur', value: selectedOption.value },
                    })
                  }
                  placeholder="Sélectionnez un superviseur..."
                />
              </div>
              <div className="form-controle">
                <label htmlFor="">Date d'opération <span style={{ color: 'red' }}>*</span></label>
                <input type="date" name='date_operation' className="form-input" onChange={handleInputChange} />
              </div>
              <div className="form-controle">
                <label htmlFor="">Technicien <span style={{ color: 'red' }}>*</span></label>
                <Select
                  name="id_technicien"
                  options={ingenieurOptions}
                  onChange={(selectedOption) =>
                    handleInputChange({
                      target: { name: 'id_technicien', value: selectedOption.value },
                    })
                  }
                  placeholder="Sélectionnez un technicien..."
                />
              </div>
              <div className="form-controle">
                <label htmlFor="">Qu'est-ce que tu veux changer ? <span style={{ color: 'red' }}>*</span></label>
                <div>
                  <input
                    type="radio"
                    id="numero"
                    name="changeOption"
                    value="numero"
                    onChange={(e) => setSelectedOption(e.target.value)}
                  />
                  <label htmlFor="numero">Numéro</label>
                  <input
                    type="radio"
                    id="traceur_echange"
                    name="changeOption"
                    value="traceur_echange"
                    onChange={(e) => setSelectedOption(e.target.value)}
                  />
                  <label htmlFor="traceur_echange">Traceur d'échange</label>
                </div>
              </div>
              {selectedOption === "numero" && (
                <div className="form-controle">
                  <label htmlFor="">Numéro <span style={{ color: 'red' }}>*</span></label>
                  <input type="text" name='numero' className="form-input" onChange={handleInputChange} />
                </div>
              )}
              {selectedOption === "traceur_echange" && (
                <div className="form-controle">
                  <label htmlFor="">Traceur d'échange <span style={{ color: 'red' }}>*</span></label>
                  <Select
                    name="traceur_echange"
                    options={traceur?.map((item) => ({
                      value: item.id_traceur,
                      label: item.code,
                    }))}
                    onChange={(selectedOption) =>
                      handleInputChange({
                        target: { name: 'traceur_echange', value: selectedOption.value },
                      })
                    }
                    placeholder="Sélectionnez un traceur d'échange..."
                  />
                </div>
              )}
              <div className="form-controle">
                <label htmlFor="">Problème <span style={{ color: 'red' }}>*</span></label>
                <textarea type="text" name='probleme' className="form-input" onChange={handleInputChange} style={{ height: "100px", resize: 'none' }} />
              </div>
              <div className="form-controle">
                <label htmlFor="">Observation <span style={{ color: 'red' }}>*</span></label>
                <textarea type="text" name='observation' className="form-input" onChange={handleInputChange} style={{ height: "100px", resize: 'none' }} />
              </div>
              <div className="form-controle">
                <label htmlFor="">Photo plaque <span style={{ color: 'red' }}>*</span></label>
                <input type="file" accept=".jpeg, .png, .jpg" name='photo_plaque' className="form-input" onChange={handleInputChange} />
              </div>
              <div className="form-controle">
                <label htmlFor="">Photo traceur <span style={{ color: 'red' }}>*</span></label>
                <input type="file" accept=".jpeg, .png, .jpg" name='photo_traceur' className="form-input" onChange={handleInputChange} />
              </div>
            </div>
            <div className="form-submit">
              <button className="btn-submit" onClick={handleConfirm} disabled={isLoading}>Envoyer</button>
              {isLoading && (
                <div className="loader-container loader-container-center">
                  <Spin size="large" />
                </div>
              )}
            </div>
            <Modal
              title="Confirmation"
              visible={showConfirmModal}
              onOk={handleClick}
              onCancel={handleCancel}
              centered
              cancelText={<span style={{ color: '#fff' }}>Non</span>}
              okText={<span style={{ color: '#fff' }}>Oui</span>}
              cancelButtonProps={{ style: { background: 'red' } }}
              okButtonProps={{ style: { background: 'blue' } }}
            >
              <p>Souhaitez-vous réellement effectuer cette opération ?</p>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
}

export default OperationRemplacement;
