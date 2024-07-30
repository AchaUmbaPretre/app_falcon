import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Input, Skeleton, Modal, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import iconClient from './../../../assets/clients.png';
import config from '../../../config';

const { RangePicker } = DatePicker;

function FactureClient () {
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const [client, setClient] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [dateRange, setDateRange] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`${DOMAIN}/recharge/rechargerClient`);
                setClient(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [DOMAIN]);

    const handleClientClick = (client) => {
        setSelectedClient(client);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        if (selectedClient && dateRange.length === 2) {
            const [startDate, endDate] = dateRange;
            navigate(`/factureEffectue?id_client=${selectedClient.id_client}&start_date=${startDate.format('YYYY-MM-DD')}&end_date=${endDate.format('YYYY-MM-DD')}`);
        }
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleDateChange = (dates) => {
        setDateRange(dates);
    };

    const filteredData = client?.filter((item) => 
        item.nom_client?.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
        <>
            <div className="recharge_form">
                <div className="recharge_form_wrapper">
                    <div className="recharge_title_rows">
                        <h2 className="recharge_client_title">LISTE DES CLIENTS</h2>
                        <div className="recharge_row_searchs">
                            <Input.Search 
                                value={searchValue} 
                                onChange={(e) => setSearchValue(e.target.value)}  
                                placeholder='Recherche...' 
                                className='product-search' 
                            />
                        </div>
                    </div>
                    {loading ? (
                        <div className="skeleton-container">
                            {[...Array(5)].map((_, index) => (
                                <Skeleton key={index} active avatar paragraph={{ rows: 1 }} />
                            ))}
                        </div>
                    ) : (
                        filteredData.length > 0 ? (
                            <div className="recharge_form_rows">
                                {filteredData.map(dd => (
                                    <div 
                                        className="recharge_form_row" 
                                        key={dd.id_client} 
                                        onClick={() => handleClientClick(dd)}
                                    >
                                        <img src={iconClient} alt="" className="recharge_img" />
                                        <div className="recharge_form_bottom">
                                            <span className="recharge_span">Nom : {dd.nom_client}</span>
                                            <span className="recharge_span">Actif : {dd.nbre_actif}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div>Aucun client trouvé</div>
                        )
                    )}
                </div>
            </div>

            <Modal 
                title="Sélectionner une plage de dates" 
                visible={isModalVisible} 
                onOk={handleOk} 
                onCancel={handleCancel}
            >
                <RangePicker onChange={handleDateChange} />
            </Modal>
        </>
    );
}

export default FactureClient;
