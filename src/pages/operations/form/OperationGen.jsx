import React, { useEffect,useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import config from '../../../config';
import { Modal, Spin } from 'antd';
import OperationForm from './OperationForm';
import OperationControle from './OperationControle';
import OperationDementeler from './OperationDementeler';
import OperationTransfert from './OperationTransfert';
import OperationRemplacement from './OperationRemplacement';
import './operationGen.scss'
import {
  AppstoreAddOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';
import { getOperationIcon } from './utils/operationUtils';


const OperationGen = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [data, setData] = useState({})
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
        <div className="operationForm">
          <div className="operation-container">
            <div className="operation-container-top">
              <div className="operation-left">
                <div className="operation-title">
                  <AppstoreAddOutlined className="operation-title-icon" />
                  <h2 className="operation-h2">Nouvelle opération</h2>
                </div>
                <span>Créer et gérer une opération système</span>
              </div>
            </div>

            <div className="operation-wrapper" style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
              <div className="operation-container-bottom" style={{margin: 0, width:'100%'}}>
                <div className="form-controle" style={{margin: 0, width:'100%'}}>
                  <label htmlFor="">Type d'opérations<span style={{color:'red'}}>*</span></label>
                  <Select
                    name="id_type"
                    options={type?.map((item) => ({
                      value: item.id_type_operations,
                      label: (
                        <div className="select-option">
                          <span className="select-option-icon">
                            {getOperationIcon(item.id_type_operations)}
                          </span>
                          <span>{item.nom_type_operations}</span>
                        </div>
                      ),
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
                <button className="btn-submit" onClick={handleClick} disabled={isLoading}><PlusCircleOutlined /> Ouvrir</button>
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
                  width={1100}
                  footer={[]}
                >
                    {data.id_type === 1 && <OperationForm id_type_operation={data?.id_type} />}
                    {data.id_type === 2 && <OperationTransfert id_type_operation={data?.id_type} />}
                    {data.id_type === 3 && <OperationDementeler id_type_operation={data?.id_type} />}
                    {data.id_type === 4 && <OperationControle id_type_operation={data?.id_type} />}
                    {data.id_type === 5 && <OperationRemplacement id_type_operation={data?.id_type} />}
                </Modal>
            </div>
          </div>
        </div>
    </>
  )
}

export default OperationGen