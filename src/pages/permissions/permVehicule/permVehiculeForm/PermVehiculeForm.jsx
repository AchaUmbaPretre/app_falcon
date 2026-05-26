import React, { useState } from 'react';
import { Table, Input, Space, Button, Card, message, Checkbox } from 'antd';
import { SearchOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';

const PermVehiculeForm = ({ vehicules, client, onSuccess, onCancel }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);

    const vehiculesData = vehicules?.data || vehicules || [];

    const filteredVehicules = vehiculesData.filter(vehicule => {
        const searchLower = searchText.toLowerCase();
        return (
            vehicule.immatriculation?.toLowerCase().includes(searchLower) ||
            vehicule.nom_marque?.toLowerCase().includes(searchLower) ||
            vehicule.modele?.toLowerCase().includes(searchLower)
        );
    });

    const columns = [
        {
            title: () => (
                <Checkbox
                    checked={selectedRowKeys.length === filteredVehicules.length && filteredVehicules.length > 0}
                    indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < filteredVehicules.length}
                    onChange={() => {
                        if (selectedRowKeys.length === filteredVehicules.length) {
                            setSelectedRowKeys([]);
                        } else {
                            setSelectedRowKeys(filteredVehicules.map(v => v.id_vehicule));
                        }
                    }}
                />
            ),
            key: 'selection',
            width: 48,
            render: (_, record) => (
                <Checkbox
                    checked={selectedRowKeys.includes(record.id_vehicule)}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setSelectedRowKeys([...selectedRowKeys, record.id_vehicule]);
                        } else {
                            setSelectedRowKeys(selectedRowKeys.filter(id => id !== record.id_vehicule));
                        }
                    }}
                />
            )
        },
        {
            title: 'Immatriculation',
            dataIndex: 'immatriculation',
            key: 'immatriculation',
            width: 180,
            sorter: (a, b) => (a.immatriculation || '').localeCompare(b.immatriculation || '')
        },
        {
            title: 'Marque',
            dataIndex: 'nom_marque',
            key: 'nom_marque',
            width: 150,
            sorter: (a, b) => (a.nom_marque || '').localeCompare(b.nom_marque || '')
        },
        {
            title: 'Modèle',
            dataIndex: 'modele',
            key: 'modele',
            width: 150,
            sorter: (a, b) => (a.modele || '').localeCompare(b.modele || '')
        },
        {
            title: 'Catégorie',
            dataIndex: 'nom_cat',
            key: 'nom_cat',
            width: 120,
            render: (text) => text || '-'
        }
    ];

    const handleSave = async () => {
        if (selectedRowKeys.length === 0) {
            message.warning('Veuillez sélectionner au moins un véhicule');
            return;
        }

        setLoading(true);
        try {
            // Appel API ici
            console.log('Client:', client?.id, 'Véhicules:', selectedRowKeys);
            message.success(`${selectedRowKeys.length} véhicule(s) autorisé(s)`);
            onSuccess?.(selectedRowKeys);
        } catch (error) {
            message.error('Erreur lors de l\'enregistrement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '16px 0' }}>
            {/* Header */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 16,
                paddingBottom: 12,
                borderBottom: '1px solid #e8e8e8'
            }}>
                <div>
                    <span style={{ fontWeight: 500, color: '#333' }}>Client :</span>
                    <span style={{ marginLeft: 8, color: '#666' }}>
                        {client?.nom_client || client?.email || 'Non spécifié'}
                    </span>
                </div>
                <div>
                    <span style={{ fontWeight: 500, color: '#333' }}>Sélection :</span>
                    <span style={{ marginLeft: 8, color: '#1890ff', fontWeight: 500 }}>
                        {selectedRowKeys.length}
                    </span>
                </div>
            </div>

            {/* Toolbar */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 16
            }}>
                <Input
                    placeholder="Rechercher..."
                    prefix={<SearchOutlined style={{ color: '#999' }} />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 260 }}
                    allowClear
                />
                <Space size={8}>
                    <Button onClick={onCancel} icon={<CloseOutlined />}>
                        Annuler
                    </Button>
                    <Button 
                        type="primary" 
                        onClick={handleSave}
                        loading={loading}
                        icon={<SaveOutlined />}
                    >
                        Enregistrer
                    </Button>
                </Space>
            </div>

            {/* Table */}
            <Table
                columns={columns}
                dataSource={filteredVehicules}
                rowKey="id_vehicule"
                size="middle"
                bordered={false}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `${total} véhicules`,
                    pageSizeOptions: ['10', '20', '50']
                }}
                rowClassName={(record) => 
                    selectedRowKeys.includes(record.id_vehicule) ? 'ant-table-row-selected-custom' : ''
                }
            />

            <style>{`
                .ant-table-row-selected-custom {
                    background-color: #fafafa;
                }
                .ant-table-row-selected-custom:hover td {
                    background-color: #f5f5f5 !important;
                }
            `}</style>
        </div>
    );
};

export default PermVehiculeForm;