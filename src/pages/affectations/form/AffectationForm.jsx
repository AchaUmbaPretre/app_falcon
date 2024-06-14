import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import config from '../../../config';
import { toast, ToastContainer } from 'react-toastify';
import { Spin, Button, Table, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const AffectationForm = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [traceurOptions, setTraceurOptions] = useState([]);
  const [numeroOptions, setNumeroOptions] = useState([]);
  const [pairs, setPairs] = useState([{ id_numero: null, id_traceur: null }]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchTraceurs = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/traceur`);
        setTraceurOptions(data.map((item) => ({
          value: item.id_traceur,
          label: item.numero_serie,
        })));
      } catch (error) {
        console.log(error);
      }
    };
    fetchTraceurs();
  }, [DOMAIN]);

  useEffect(() => {
    const fetchNumeros = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/affectation/numero`);
        setNumeroOptions(data.map((item) => ({
          value: item.id_numero,
          label: item.numero,
        })));
      } catch (error) {
        console.log(error);
      }
    };
    fetchNumeros();
  }, [DOMAIN]);

  const handleAddPair = () => {
    setPairs([...pairs, { id_numero: null, id_traceur: null }]);
  };

  const handleRemovePair = (index) => {
    const updatedPairs = pairs.filter((_, i) => i !== index);
    setPairs(updatedPairs);
  };

  const handleChangePair = (index, field, value) => {
    const updatedPairs = pairs.map((pair, i) =>
      i === index ? { ...pair, [field]: value } : pair
    );
    setPairs(updatedPairs);
  };

  const handleSubmit = () => {
    setIsModalVisible(true);
  };

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${DOMAIN}/affectation`, { affectations: pairs });
      toast.success('Affectations créées avec succès!');
      navigate('/affectation');
      window.location.reload();
    } catch (err) {
      if (err.response && err.response.status === 400 && err.response.data && err.response.data.errors) {
        err.response.data.errors.forEach(error => toast.error(error));
      } else if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Une erreur s'est produite. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
      setIsModalVisible(false);
    }
  };

  const columns = [
    {
      title: 'Numéro',
      dataIndex: 'id_numero',
      key: 'id_numero',
      render: (value, record, index) => (
        <Select
          value={numeroOptions.find(option => option.value === value)}
          options={numeroOptions}
          onChange={(selectedOption) =>
            handleChangePair(index, 'id_numero', selectedOption.value)
          }
          placeholder="Sélectionnez un numéro..."
        />
      )
    },
    {
      title: 'Traceur',
      dataIndex: 'id_traceur',
      key: 'id_traceur',
      render: (value, record, index) => (
        <Select
          value={traceurOptions.find(option => option.value === value)}
          options={traceurOptions}
          onChange={(selectedOption) =>
            handleChangePair(index, 'id_traceur', selectedOption.value)
          }
          placeholder="Sélectionnez un traceur..."
        />
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record, index) => (
        <>
          <Button
            icon={<DeleteOutlined />}
            type="danger"
            onClick={() => handleRemovePair(index)}
          />
          <Button
            type="dashed"
            onClick={handleAddPair}
            style={{ width: '40%' }}
          >
            <PlusOutlined />
          </Button>
        </>
      )
    }
  ];

  return (
    <>
    <ToastContainer />
      <div className="client">
      <div className="client_wrapper">
        <div className="client_wrapper_top">
          <div className="client_text_row">
            <div className="client_text_left">
              <h2 className="client_h2">Une nouvelle affectation</h2>
              <span className="client_span">Enregistrer une nouvelle affectation</span>
            </div>
          </div>
        </div>
        <div className="client_wrapper_center">
          <div className="client_wrapper_center_bottom">
            <div className="product-bottom-top">
              <div className="product-bottom-right">
              </div>
            </div>

            <Table
              dataSource={pairs}
              columns={columns}
              pagination={false}
              rowKey={(record, index) => index}
            />
            <div className="form-submit">
              <Button
                type="primary"
                onClick={handleSubmit}
                disabled={isLoading}
                style={{ width: '90%', marginTop: '16px' }}
              >
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

      <Modal
        title="Confirmation"
        visible={isModalVisible}
        onOk={handleConfirm}
        onCancel={() => setIsModalVisible(false)}
      >
        <p>Voulez-vous vraiment affecter {pairs.length} paires ?</p>
      </Modal>
    </div>
    </>
  );
};

export default AffectationForm;
