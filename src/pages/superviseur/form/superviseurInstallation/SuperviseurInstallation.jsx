import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Modal, Spin } from 'antd';
import config from '../../../../config';
import './superviseurInstallation.scss'
import { useSelector } from 'react-redux';
import AddModalClient from '../../../operations/addModalClient/AddModalClient';

const SuperviseurInstallation = ({id_type_operation = 1}) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [data, setData] = useState({})
  const navigate = useNavigate();
  const [client, setClient] = useState([]);
  const [idClient, setIdClient] = useState('');
  const [site, setSite] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [traceur, setTraceur] = useState([]);
  const [vehicule, setVehicule] = useState([]);
  const [imagePreview, setImagePreview] = useState('');
  const userId = useSelector((state) => state.user.currentUser.id);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [open, setOpen] = useState(false);

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

  const showModal = (e) => {
    setOpen(true);
  };

  
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
  }, [DOMAIN,idClient]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/traceur`);
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


  const handleConfirm = () => {
    setShowConfirmModal(true);
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
  }

  useEffect(()=>{
    setIdClient(data?.id_client)
  },[data?.id_client])

  const handleClick = async (e) => {
    e.preventDefault();
  
    if (!data.id_client || !data.site ) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }
  
    try {
      setIsLoading(true);
      await axios.post(`${DOMAIN}/operation`,{
        ...data,
        id_type_operations : id_type_operation,
        user_cr : userId
      },{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success("Opération d'installation effectuée avec succès !");
      navigate('/installation');
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
  }

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
  .filter((t) => t.id_etat_traceur === 1)
  .map((tc) => ({
    value: tc.id_traceur,
    label: tc.numero_serie
  }));
  
  return (
    <>
        <div className="superviseurInstall">
          <div className="product-container">
            <div className="product-container-top">
              <div className="product-left">
                <h2 className="product-h2"> Opération : Installation</h2>
              </div>
            </div>
            <div className="product-wrapper">
              <div className="product-container-bottom">
                <div className="form-controle">
                  <label htmlFor="">Nom client ou société<span style={{color:'red'}}>*</span><PlusCircleOutlined onClick={showModal} className='icon_plus' /></label>
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
                  <label htmlFor="">Site <span style={{color:'red'}}>*</span></label>
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
                  <label htmlFor="">Véhicule <span style={{color:'red'}}>*</span></label>
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
                  <label htmlFor="">Traceur <span style={{color:'red'}}>*</span></label>
                  <Select
                      name="id_traceur"
                      options={traceurOptions}
                      onChange={(selectedOption) =>
                        handleInputChange({
                          target: { name: 'id_traceur', value: selectedOption.value },
                        })
                      }
                      placeholder="Sélectionnez un traceur..."
                    />
                </div>
                <div className="form-controle">
                  <label htmlFor="">Superviseur <span style={{color:'red'}}>*</span></label>
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
                  <label htmlFor="">Date d'opération <span style={{color:'red'}}>*</span></label>
                  <input type="date" name='date_operation' className="form-input" onChange={handleInputChange} />
                </div>
                <div className="form-controle">
                  <label htmlFor="">Technicien <span style={{color:'red'}}>*</span></label>
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
                    <label htmlFor="">Kilometre <span style={{color:'red'}}>*</span></label>
                    <input type="text" name='kilometre' className="form-input" onChange={handleInputChange} />
                </div>
                <div className="form-controle">
                    <label htmlFor="">Tension <span style={{color:'red'}}>*</span></label>
                    <input type="text" name='tension' className="form-input" onChange={handleInputChange} />
                </div>
                <div className="form-controle">
                    <label htmlFor="">photo plaque <span style={{color:'red'}}>*</span></label>
                    <input type="file" accept=".jpeg, .png, .jpg" name='photo_plaque' className="form-input" onChange={handleInputChange} />
                </div>
                <div className="form-controle">
                    <label htmlFor="">photo traceur <span style={{color:'red'}}>*</span></label>
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
              <p>Est-ce que le traceur installé a déjà été configuré ?</p>
            </Modal>

            <Modal
              title=""
              centered
              open={open}
              onCancel={() => setOpen(false)}
              width={1100}
              footer={[]}
            >
              <AddModalClient />
            </Modal>
          </div>
        </div>
    </>
  )
}

export default SuperviseurInstallation