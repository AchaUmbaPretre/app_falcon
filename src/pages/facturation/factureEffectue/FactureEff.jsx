import React, { useState, useEffect, useCallback } from 'react';
import config from '../../../config';
import useQuery from '../../../useQuery';
import { getColorForOperationType } from '../../../utils'
import { BarcodeOutlined, ThunderboltOutlined, DollarOutlined, CalendarOutlined } from '@ant-design/icons';
import './factureEffectue.scss';
import { Button, DatePicker, Input, Modal, Select, Spin, Table, Tag } from 'antd';
import moment from 'moment';
import axios from 'axios';
import { toast,ToastContainer } from 'react-toastify';
const { Option } = Select;

const FactureEff = () => {
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const query = useQuery();
    const dateStart = query.get('start_date');
    const dateEnd = query.get('end_date');
    const idClient = query.get('id_client');
    const [searchValue, setSearchValue] = useState('');
    const [date, setDate] = useState(null);
    const [data, setData] = useState({ actif: [], autres: [] });
    const [selectedRowKeys, setSelectedRowKeys] = useState({ actif: [], autres: [] });
    const [montant, setMontant] = useState(0);
    const [loading, setLoading] = useState(true);
    const [dataAll, setDataAll] = useState([]);
    const [tarif, setTarif] = useState([]);
    const [tarifClient, setTarifClient] = useState([]);
    const [montantFilter, setMontantFilter] = useState('');
    const [showTarifClient, setShowTarifClient] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [vehicule, setVehicule] = useState([]);
    const [remise, setRemise] = useState(0);
    const scroll = { x: 300 };
    const [totalVehicule, setTotalVehicule] = useState('');
    const [commentaire, setCommentaire] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const monthsDifference = dateEnd && dateStart ? moment(dateEnd).diff(moment(dateStart), 'months') : 0;
    const totalMontantBeforeRemise = montant * dataAll.length * monthsDifference;
    const totalMontant = totalMontantBeforeRemise - remise;

    
    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCancelModal = () => {
        setIsModalVisible(false);
    };

    const handleConfirmModal = () => {
        onFinish();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${DOMAIN}/facture/factureOperation`, {
                    params: { start_date: dateStart, end_date: dateEnd, id_client: idClient }
                });
                setData(response.data);
                const actifKeys = response.data.actif.map(item => item.id_vehicule);
                console.log(actifKeys)
                setSelectedRowKeys({
                    actif: actifKeys,
                    autres: []
                });
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [DOMAIN, dateStart, dateEnd, idClient]);


    useEffect(() => {
        const selectedIds = [
            ...selectedRowKeys.actif,
            ...selectedRowKeys.autres
        ];

        const combinedData = [
            ...data.actif,
            ...data.autres
        ];
        
        const uniqueVehicules = Array.from(new Map(combinedData
            .filter(item => selectedIds.includes(item.id_vehicule))
            .map(item => [item.id_vehicule, item])) 
            .values()
        );

        const updatedVehicules = uniqueVehicules.map(item => ({
            id_vehicule: item.id_vehicule,
            prix: item.prix || montant
        }));
      
        setVehicule(updatedVehicules);
        setDataAll(selectedIds);
    }, [selectedRowKeys, data, montant]);

    useEffect(() => {
        const fetchClientTarif = async () => {
            try {
                const { data } = await axios.get(`${DOMAIN}/facture/clientTarifOne?id_client=${idClient}`);
                setTarifClient(data);
            
                if (data.length > 0) {
                    setMontantFilter(data[0].prixClientTarif);
                    setMontant(data[0].prixClientTarif);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des tarifs:', error);
            }
        };
        fetchClientTarif();
    }, [DOMAIN, idClient]);

    useEffect(() => {
        const fetchTarif = async () => {
            try {
                const { data } = await axios.get(`${DOMAIN}/facture/tarif`);
                setTarif(data);
            
                const defaultTarif = data.find(item => item.type === 'Abonnement mensuel');
                if (defaultTarif) {
                    setMontantFilter(defaultTarif.prix);
                    setMontant(defaultTarif.prix);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des tarifs:', error);
            }
        };
        fetchTarif();
    }, [DOMAIN]);

    const onSelectChange = (tableType, newSelectedRowKeys) => {
        setSelectedRowKeys(prev => ({
            ...prev,
            [tableType]: newSelectedRowKeys
        }));
    };

    const rowSelectionActif = {
        selectedRowKeys: selectedRowKeys.actif,
        onChange: (newSelectedRowKeys) => onSelectChange('actif', newSelectedRowKeys),
    };

    const rowSelectionAutres = {
        selectedRowKeys: selectedRowKeys.autres,
        onChange: (newSelectedRowKeys) => onSelectChange('autres', newSelectedRowKeys),
    };

    const handleChange = (id, prix) => {
        const price = parseFloat(prix) || 0; 
        setVehicule(prevSelectedRows =>
            prevSelectedRows.map(row =>
                row.id_vehicule === id ? { ...row, prix: price } : row
            )
        );
    };

    const calculateTotalAmount = () => {

        const selectedVehicules = vehicule.filter(v => 
            selectedRowKeys.actif.includes(v.id_vehicule) || selectedRowKeys.autres.includes(v.id_vehicule)
        );
        
        const totalAmount = selectedVehicules.reduce((acc, curr) => acc + (curr.prix * monthsDifference), 0);
        return totalAmount - remise;
    };

    useEffect(()=>{
        const calculateTotalAmountUse = () => {

            const selectedVehicules = vehicule.filter(v => 
                selectedRowKeys.actif.includes(v.id_vehicule) || selectedRowKeys.autres.includes(v.id_vehicule)
            );
            
            const totalAmount = selectedVehicules.reduce((acc, curr) => acc + (curr.prix * monthsDifference), 0);
            setTotalVehicule(totalAmount)
            return totalAmount - remise;
        };

        calculateTotalAmountUse()
    })

    const calculateTotalAmountVehicule = () => {
        const selectedVehicules = vehicule.filter(v => 
            selectedRowKeys.actif.includes(v.id_vehicule) || selectedRowKeys.autres.includes(v.id_vehicule)
        );
        
        const totalAmoutVehicule = selectedVehicules.reduce((acc, curr) => acc + curr.prix, 0);
        
        return totalAmoutVehicule;
    };
    
    const calculateDaysInPeriod = (startDate, endDate) => {
        return moment(endDate).diff(moment(startDate), 'days') + 1; // Inclure le jour de fin
    };
    
    // Fonction pour calculer le nombre de jours actifs
    const calculateDaysActive = (startDate, endDate, vehicleStartDate) => {
        const periodStart = moment(startDate);
        const periodEnd = moment(endDate);
        const vehicleStart = moment(vehicleStartDate);
    
        if (vehicleStart.isBefore(periodStart)) {
            console.log('Le véhicule était actif avant le début de la période.');
            return calculateDaysInPeriod(periodStart, periodEnd);
        } else {
            console.log('Le véhicule était actif pendant la période.');
            return calculateDaysInPeriod(vehicleStart, periodEnd);
        }
    };
    
    // Fonction pour calculer le montant
    const calculateAmountForVehicle = (prix, dateOperation, startDate, endDate) => {
        console.log(dateOperation)
        const daysActive = calculateDaysActive(startDate, endDate, dateOperation);
        console.log("Jours d'activité:", daysActive); 
    
        const totalDaysInMonth = moment(endDate).daysInMonth();
        console.log('Nombre total de jours dans le mois :', totalDaysInMonth);
    
        const amount = (daysActive * prix) / totalDaysInMonth;
        console.log('Calculated Amount:', amount);

    return amount;
    };
    

    const columnsCommon = [
        { 
            title: '#', 
            dataIndex: 'id', 
            key: 'id', 
            render: (_, __, index) => index + 1, 
            width: "3%"
        },
        {
            title: 'Véhicule',
            dataIndex: 'nom_vehicule',
            key: 'nom_vehicule',
            render: (text) => (
                <Tag color='green'>
                    <BarcodeOutlined style={{ marginRight: '5px' }} />
                    {text}
                </Tag>
            ),
        },
        {
            title: "Date début",
            dataIndex: 'date_operation',
            key: 'date_operation',
            sorter: (a, b) => moment(a.date_operation).unix() - moment(b.date_operation).unix(),
            sortDirections: ['descend', 'ascend'],
            render: (text) => (
                <Tag icon={<CalendarOutlined />} color="blue">
                    {moment(dateStart).format('DD-MM-YYYY')}
                </Tag>
            ),
        },
        {
            title: "Date fin",
            dataIndex: 'date_operation',
            key: 'date_operation',
            sorter: (a, b) => moment(a.date_operation).unix() - moment(b.date_operation).unix(),
            sortDirections: ['descend', 'ascend'],
            render: (text) => (
                <Tag icon={<CalendarOutlined />} color="blue">
                    {moment(dateEnd).format('DD-MM-YYYY')}
                </Tag>
            ),
        },
        {
            title: "Tarif",
            render: (text, record) => (
                <div>
                    <Input
                        type="number"
                        min="0"
                        onChange={(e) => handleChange(record.id_vehicule, Number(e.target.value))}
                        value={vehicule.find(v => v.id_vehicule === record.id_vehicule)?.prix || ''}
                        placeholder="Tarif..."
                        className='days-input'
                        style={{ width: "90px" }}
                    />
                </div>
            )
        },
        {
            title: 'Montant',
            key: 'montant',
            render: (text, record) => {
                // Trouver le véhicule et obtenir son prix
                const vehicle = vehicule.find(v => v.id_vehicule === record.id_vehicule);
                const price = vehicle ? vehicle.prix : 0;
                
                // Calculer le montant
                const amount = calculateAmountForVehicle(price, record.date_operation, dateStart, dateEnd);
        
                return (
                    <Tag color={amount > 0 ? 'green' : 'red'}>
                        {amount.toFixed(2)} <DollarOutlined style={{ marginLeft: "5px" }} />
                    </Tag>
                );
            },
        }
    ];

    const columnsWithOperation = [
        ...columnsCommon,
        {
            title: "Type d'opération",
            dataIndex: 'type_operations',
            key: 'type_operations',
            render: (text) => (
                <Tag color={getColorForOperationType(text)}>
                    <ThunderboltOutlined style={{ marginRight: 5 }} />
                    {text}
                </Tag>
            ),
        }
    ];

    const handleTarifChange = (value) => {
        setMontantFilter(value);
        setMontant(value);
    };

    const handleRemiseChange = (e) => {
        setRemise(parseFloat(e.target.value) || 0);
    };

    const onFinish = useCallback(async (e) => {

        setIsSubmitting(true);

        if (vehicule.some(vehicle => !vehicle.id_vehicule )) {
            toast.error('Veuillez remplir tous les champs requis');
            return;
          }

          if (!date) {
            toast.error('Veuillez indiquer la date');
            return;
        }
        

        setIsSubmitting(true);
        try {
            const response = await axios.post(`${DOMAIN}/facture`, {
                id_client: idClient,
                date_facture: date,
                total: totalVehicule,
                remise: remise,
                details : vehicule,
                commentaire : commentaire
            });

            if (response.status === 200) {
                toast.success('Facture créée avec succès!');
            } else {
                toast.error('Erreur lors de la création de la facture.');
            }
        } catch (error) {
            console.error('Erreur lors de la création de la facture:', error);
            toast.error('Erreur lors de la création de la facture.');
        } finally {
            setIsSubmitting(false);
            setIsModalVisible(false);
        }
    }, [vehicule, montant, dateStart, dateEnd, idClient, totalMontant, remise, isSubmitting, date]);


    const filteredActif = data.actif?.filter((item) =>
        item.nom_vehicule?.toLowerCase().includes(searchValue.toLowerCase())
      );
    
      const filteredAutre = data.autres?.filter((item) =>
        item.nom_vehicule?.toLowerCase().includes(searchValue.toLowerCase())
      );

    return (
        <div className="factureEffectue">
            <ToastContainer />
            <div className="facture_title_date">
                <h1 className="facture_h1">
                    Du {moment(dateStart).format('DD-MM-YYYY')} au {moment(dateEnd).format('DD-MM-YYYY')} 
                     ({monthsDifference} mois)
                </h1>
            </div>
            <div className="factureEffectue_wrapper">
                <div className="factureEffectue_left">
                    <div className='facture_rows_title'>
                        <div className="facture_row_title">
                            <h2 className="facture_h2">Liste des véhicules</h2>
                            <span>{vehicule.length} véhicule(s) sélectionné(s)</span>
                        </div>
                        <div className='row_inputs'>
                            <Input.Search 
                                type="search"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder='Recherche...'
                            />
                        </div>
                    </div>
                    <div className="facture_tab">
                        <h3>Etat actif</h3>
                        <Table
                            rowSelection={rowSelectionActif}
                            columns={columnsWithOperation}
                            dataSource={filteredActif}
                            loading={loading}
                            rowKey="id_vehicule"
                            scroll={scroll}
                        />
                        <h3>Autres</h3>
                        <Table
                            rowSelection={rowSelectionAutres}
                            columns={columnsWithOperation}
                            dataSource={filteredAutre}
                            loading={loading}
                            scroll={scroll}
                            rowKey="id_vehicule"
                            title={() => `Les opérations qui ont lieu entre ${moment(dateStart).format('DD-MM-YYYY')} et ${moment(dateEnd).format('DD-MM-YYYY')}`}
                        />
                    </div>
                </div>
                <div className="factureEffectue_right">
                    <h2 className="facture_h2">Détails de la facture</h2>
                    <div className="factureEffectue_rows">
                        <span className="facture_desc">Sélectionnez le tarif {showTarifClient && 'personnel'} <span>*</span></span>
                        {!showTarifClient && (
                            <Select value={montantFilter} onChange={handleTarifChange} style={{ width: 200 }}>
                                {tarif.map((item) => (
                                    <Option key={item.id_tarif} value={item.prix}>{`${item.type} : ${item.prix}$`}</Option>
                                ))}
                            </Select>
                        )}
                        {showTarifClient && (
                            <Select value={montantFilter} onChange={handleTarifChange} style={{ width: 200 }}>
                                {tarifClient.map((item) => (
                                    <Option key={item.id_clientTarif} value={item.prixClientTarif}>{`${item.typeClientTarif} : ${item.prixClientTarif}`}</Option>
                                ))}
                            </Select>
                        )}
                    </div>
                    <Button onClick={() => setShowTarifClient(prev => !prev)}> 
                        {showTarifClient ? 'Cacher le tarif personnel' : 'Afficher le tarif personnel'}
                    </Button>
                    
                    <div className='facture_montant_rows'>
                        <span className="facture_desc">Montant à payer pour {dataAll.length} véhicule(s) : <span>*</span></span>
                        <span>{calculateTotalAmountVehicule()} $</span>
                    </div>
                    <div className='facture_montant_rows'>
                        <span className="facture_desc">Montant total pour {monthsDifference} mois  <span>*</span> :</span>
                        <span>{calculateTotalAmount()} $</span>
                    </div>
                    <div className='facture_montant_rows'>
                        <span className="facture_desc">Remise : <span>*</span> :</span>
                        <Input
                            id="remise"
                            type="number"
                            min="0"
                            step="0.01"
                            value={remise}
                            onChange={handleRemiseChange}
                        />
                    </div>
                    <div className='facture_montant_rows'>
                        <span className="facture_desc">Commentaire : <span>*</span> :</span>
                        <Input.TextArea
                            type="text"
                            onChange={(e)=> setCommentaire(e.target.value)}
                        />
                    </div>
                    <div className='facture_montant_rows'>
                        <span className="facture_desc">Date : <span>*</span></span>
                        <DatePicker 
                            value={date ? moment(date) : null} 
                            onChange={(date) => setDate(date ? date.format('YYYY-MM-DD') : '')}
                        />
                    </div>
                    <Button type="primary" onClick={handleOpenModal} loading={isSubmitting}>Envoyer</Button>
                    {loading && (
                  <div className="loader-container loader-container-center">
                    <Spin size="large" />
                  </div>
                )}
                </div>
                <Modal
                    title="Confirmation de Soumission"
                    visible={isModalVisible}
                    onOk={handleConfirmModal}
                    onCancel={handleCancelModal}
                    okText="Confirmer"
                    cancelText="Annuler"
                    confirmLoading={isSubmitting}
                >
                    <p>Êtes-vous sûr de vouloir soumettre cette facture ?</p>
                    <p><b>Date:</b> {date ? moment(date).format('DD-MM-YYYY') : 'Non définie'}</p>
                    <p><b>Montant Total:</b> {totalVehicule} {showTarifClient ? '$' : '$'}</p>
                    <p><b>Commentaire:</b> {commentaire || 'Aucun'}</p>
                </Modal>
            </div>
        </div>
    );
};

export default FactureEff;