import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import config from '../../../config';
import { toast, ToastContainer } from 'react-toastify';
import { Spin, Modal, Table, Button, Input, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import './vehiculesForm.scss';

const VehiculesForm = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [vehicles, setVehicles] = useState([{}]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [marque, setMarque] = useState([]);
  const [client, setClient] = useState([]);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const handleInputChange = (index, e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;

    let updatedValue = fieldValue;

    if (fieldName === "email") {
      updatedValue = fieldValue.toLowerCase();
    } else if (Number.isNaN(Number(fieldValue))) {
      updatedValue = fieldValue.charAt(0).toUpperCase() + fieldValue.slice(1);
    }

    const updatedVehicles = [...vehicles];
    updatedVehicles[index] = { ...updatedVehicles[index], [fieldName]: updatedValue };
    setVehicles(updatedVehicles);
  };

  const handleSelectChange = (index, name, selectedOption) => {
    const updatedVehicles = [...vehicles];
    updatedVehicles[index] = { ...updatedVehicles[index], [name]: selectedOption.value };
    setVehicles(updatedVehicles);
  };

  const addVehicleRow = () => {
    setVehicles([...vehicles, {}]);
  };

  const removeVehicleRow = (index) => {
    const updatedVehicles = vehicles.filter((_, idx) => idx !== index);
    setVehicles(updatedVehicles);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/vehicule/marque`);
        setMarque(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN]);

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

  const handleClick = (e) => {
    e.preventDefault();
    setIsConfirmVisible(true);
  };

  const handleConfirm = async () => {
    setIsConfirmVisible(false);

    if (vehicles.some(vehicle => !vehicle.id_marque || !vehicle.matricule)) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(`${DOMAIN}/vehicule`, { vehicles });
      toast.success('Véhicules créés avec succès!');
      navigate('/vehicules');
      window.location.reload();
    } catch (err) {
      if (err.response && err.response.status === 400 && err.response.data && err.response.data.error) {
        const errorMessage = err.response.data.error;
        toast.error(errorMessage);
      } else {
        toast.error(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsConfirmVisible(false);
  };

  console.log(vehicles)

  const columns = [
    {
      title: 'Client ou société',
      dataIndex: 'id_client',
      render: (text, record, index) => (
        <Select
          name="id_client"
          options={client.map(item => ({ value: item.id_client, label: item.nom_client }))}
          onChange={selectedOption => handleSelectChange(index, 'id_client', selectedOption)}
          placeholder="Sélectionnez un client..."
        />
      ),
    },
    {
      title: 'Marque',
      dataIndex: 'id_marque',
      render: (text, record, index) => (
        <Select
          name="id_marque"
          options={marque.map(item => ({ value: item.id_marque, label: item.nom_marque }))}
          onChange={selectedOption => handleSelectChange(index, 'id_marque', selectedOption)}
          placeholder="Sélectionnez une marque..."
        />
      ),
    },
    {
      title: 'Matricule',
      dataIndex: 'matricule',
      render: (text, record, index) => (
        <Input
          type="text"
          name="matricule"
          value={record.matricule}
          onChange={e => handleInputChange(index, e)}
          required
        />
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record, index) => (
        <Space size="middle">
          <Button icon={<MinusCircleOutlined />} onClick={() => removeVehicleRow(index)} />
          <Button
                type="dashed"
                onClick={addVehicleRow}
                icon={<PlusOutlined />}
                style={{ marginRight: '6px' }}
              >
              </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <ToastContainer />
      <div className="clientForm">
        <div className="product-container">
          <div className="product-container-top">
            <div className="product-left">
              <h2 className="product-h2">Nouveaux véhicules</h2>
              <span>Enregistrer de nouveaux véhicules</span>
            </div>
          </div>
          <div className="product-wrappers">
            <div className="product-container-bottom">
              <Table
                dataSource={vehicles}
                columns={columns}
                pagination={false}
                rowKey={(record, index) => index}
              />
            </div>
            <div className="form-submit">
              <button className="btn-submit" onClick={handleClick} disabled={isLoading} classNames='btn-submit' style={{marginTop:'20px'}}>
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
        title="Confirmation"
        visible={isConfirmVisible}
        onOk={handleConfirm}
        onCancel={handleCancel}
        okText="Oui"
        cancelText="Non"
        className="confirmation-modal"
      >
        <p className="modal-text">Êtes-vous sûr de vouloir envoyer ces données ?</p>
        <div className="modal-data">
          {vehicles.map((vehicle, index) => (
            <div key={index}>
              <p><strong>Client ou société:</strong> {client.find(c => c.id_client === vehicle.id_client)?.nom_client}</p>
              <p><strong>Marque:</strong> {marque.find(m => m.id_marque === vehicle.id_marque)?.nom_marque}</p>
              <p><strong>Matricule:</strong> {vehicle.matricule}</p>
              <hr />
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default VehiculesForm;
