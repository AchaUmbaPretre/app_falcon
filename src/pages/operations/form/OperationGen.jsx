import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import config from '../../../config';
import { toast } from 'react-toastify';
import { Modal, Spin } from 'antd';
import OperationForm from './OperationForm';
import OperationControle from './OperationControle';
import OperationDementeler from './OperationDementeler';

const OperationGen = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [data, setData] = useState({})
  const navigate = useNavigate();
  const [type, setType] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleInputChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
  
    let updatedValue = fieldValue;
  
    if (fieldName === "email") {
      updatedValue = fieldValue.toLowerCase();
    } else if (Number.isNaN(Number(fieldValue))) {
      updatedValue = fieldValue.charAt(0).toUpperCase() + fieldValue.slice(1);
    }
  
  setData((prev) => ({ ...prev, [fieldName]: updatedValue }));
  };

  const handleClick = async (e) => {
    setOpen(true);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${DOMAIN}/operation/type_operation`);
        setType(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [DOMAIN]);

  
  return (
    <>
        <div className="clientForm">
          <div className="product-container">
            <div className="product-container-top">
              <div className="product-left">
                <h2 className="product-h2">Une nouvelle opération</h2>
                <span>Créer une nouvelle opération</span>
              </div>
            </div>
            <div className="product-wrapper">
              <div className="product-container-bottom">
                <div className="form-controle">
                  <label htmlFor="">Type d'opérations<span style={{color:'red'}}>*</span></label>
                  <Select
                      name="id_type"
                      options={type?.map((item) => ({
                        value: item.id_type_operations,
                        label: item.nom_type_operations,
                      }))}
                      onChange={(selectedOption) =>
                        handleInputChange({
                          target: { name: 'id_type', value: selectedOption.value },
                        })
                      }
                      placeholder="Sélectionnez une opération..."
                    />
                </div>
              </div>
              <div className="form-submit">
                <button className="btn-submit" onClick={handleClick} disabled={isLoading}>Envoyer</button>
                {isLoading && (
                <div className="loader-container loader-container-center">
                   <Spin size="large" />
                </div>
            )}
              </div>

                <Modal
                  title=""
                  centered
                  open={open}
                  onCancel={() => setOpen(false)}
                  width={1000}
                  footer={[
                            ]}
                >

                {data.id_type === 1 && <OperationForm id_type_operation={data?.id_type} />}
                {data.id_type === 3 && <OperationDementeler id_type_operation={data?.id_type} />}
                {data.id_type === 4 && <OperationControle id_type_operation={data?.id_type} />}
                </Modal>
            </div>
          </div>
        </div>
    </>
  )
}

export default OperationGen