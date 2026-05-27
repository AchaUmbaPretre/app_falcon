// permVehiculeForm/PermVehiculeForm.jsx
import React, { useState, useEffect } from 'react';
import { Table, Input, Space, Button, message, Checkbox, Spin, Modal } from 'antd';
import { SearchOutlined, SaveOutlined, CloseOutlined, WarningOutlined } from '@ant-design/icons';
import PermVehiculeService from '../services/PermVehicule.service';

const PermVehiculeForm = ({ client, vehicules = [], onSuccess, onCancel, loading: initialLoading = false }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [saving, setSaving] = useState(false);

    const vehiculesData = vehicules?.data || vehicules || [];

    useEffect(() => {
        console.log('Véhicules reçus:', vehiculesData);
    }, [vehiculesData]);

    const filteredVehicules = vehiculesData.filter(vehicule => {
        const searchLower = searchText.toLowerCase();
        return (
            vehicule.matricule?.toLowerCase().includes(searchLower) ||
            vehicule.nom_vehicule?.toLowerCase().includes(searchLower) ||
            vehicule.immatriculation?.toLowerCase().includes(searchLower)
        );
    });

    const columns = [
        {
            title: () => (
                <Checkbox
                    checked={filteredVehicules.length > 0 && selectedRowKeys.length === filteredVehicules.length}
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
            key: 'select',
            width: 48,
            render: (_, record) => (
                <Checkbox
                    checked={selectedRowKeys.includes(record.id_vehicule)}
                    onChange={e => {
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
            title: 'Matricule / Immatriculation',
            dataIndex: 'matricule',
            key: 'matricule',
            width: 180,
            render: (text, record) => text || record.immatriculation || '-',
            sorter: (a, b) => (a.matricule || a.immatriculation || '').localeCompare(b.matricule || b.immatriculation || '')
        },
        {
            title: 'Nom du véhicule',
            dataIndex: 'nom_vehicule',
            key: 'nom_vehicule',
            render: (text) => text || '-',
            sorter: (a, b) => (a.nom_vehicule || '').localeCompare(b.nom_vehicule || '')
        }
    ];

    // 🔥 Préparer les données pour l'API utilisateur (adapté aux tables existantes)
    const preparePermissionsData = () => {
        const selectedVehicules = vehiculesData.filter(v => selectedRowKeys.includes(v.id_vehicule));
        
        return {
            // Données utilisateur (table utilisateur)
            utilisateur: {
                id_admin: client.id, // ID dans l'admin
                nom: client.nom_client || client.nom,
                prenom: client.nom_principal || client.prenom,
                email: client.email,
                role: 'Owner', // Rôle par défaut
                matricule: client.matricule,
                is_active: 1,
                // Informations supplémentaires
                id_societe: client.id_societe,
                id_departement: client.id_departement,
                id_ville: client.id_ville
            },
            // Véhicules sélectionnés avec leurs détails
            vehicules: selectedVehicules.map(v => ({
                id_admin: v.id_vehicule,
                immatriculation: v.immatriculation || v.matricule,
                numero_ordre: v.numero_ordre,
                id_marque: v.id_marque,
                id_modele: v.id_modele,
                variante: v.variante,
                annee_fabrication: v.annee_fabrication,
                annee_circulation: v.annee_circulation,
                id_cat_vehicule: v.id_cat_vehicule,
                // Autres champs du véhicule
                nom_marque: v.nom_marque,
                modele: v.modele,
                nom_cat: v.nom_cat
            })),
            // Métadonnées
            meta: {
                date_attribution: new Date().toISOString(),
                source: 'admin_app'
            }
        };
    };

    const handleSave = async () => {
        if (selectedRowKeys.length === 0) {
            message.warning('Veuillez sélectionner au moins un véhicule');
            return;
        }

        Modal.confirm({
            title: 'Confirmation des permissions',
            icon: <WarningOutlined />,
            content: (
                <div>
                    <p>Vous allez autoriser <strong>{selectedRowKeys.length} véhicule(s)</strong> pour :</p>
                    <p><strong>{client?.nom_client || client?.email}</strong></p>
                    <p>Ces données seront synchronisées avec l'application utilisateur.</p>
                </div>
            ),
            okText: 'Confirmer',
            cancelText: 'Annuler',
            onOk: async () => {
                setSaving(true);
                try {
                    const permissionsData = preparePermissionsData();
                    console.log('📦 Envoi des données:', permissionsData);
                    
                    const result = await PermVehiculeService.syncPermissionsToUserApp(permissionsData);
                    
                    message.success(`${selectedRowKeys.length} véhicule(s) autorisé(s) avec succès`);
                    onSuccess?.({
                        client: client,
                        vehicules_autorises: selectedRowKeys,
                        result: result
                    });
                } catch (error) {
                    console.error('❌ Erreur:', error);
                    message.error(error.message || 'Erreur lors de la synchronisation');
                } finally {
                    setSaving(false);
                }
            }
        });
    };

    if (initialLoading) {
        return (
            <div style={{ textAlign: 'center', padding: 50 }}>
                <Spin tip="Chargement des véhicules..." />
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div style={{ 
                marginBottom: 16, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: 12,
                background: '#f5f5f5',
                borderRadius: 8
            }}>
                <div>
                    <strong>👤 Client:</strong> {client?.nom_client || client?.email}
                    {client?.email && <span style={{ marginLeft: 16 }}><strong>📧 Email:</strong> {client.email}</span>}
                </div>
                <div>
                    <strong>✅ Sélectionnés:</strong> <span style={{ color: '#1890ff', fontWeight: 'bold' }}>{selectedRowKeys.length}</span>
                </div>
            </div>

            {/* Barre de recherche */}
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                <Input.Search 
                    placeholder="Rechercher par matricule ou nom..."
                    value={searchText} 
                    onChange={e => setSearchText(e.target.value)} 
                    style={{ width: 280 }}
                    allowClear
                />
                <Space>
                    <Button onClick={onCancel}>Annuler</Button>
                    <Button 
                        type="primary" 
                        onClick={handleSave} 
                        loading={saving}
                        icon={<SaveOutlined />}
                    >
                        Enregistrer les permissions
                    </Button>
                </Space>
            </div>

            {/* Tableau */}
            <Table
                dataSource={filteredVehicules}
                columns={columns}
                rowKey="id_vehicule"
                pagination={{ 
                    pageSize: 10, 
                    showTotal: total => `${total} véhicules`,
                    showSizeChanger: true
                }}
                size="middle"
                bordered
                rowClassName={(record) => 
                    selectedRowKeys.includes(record.id_vehicule) ? 'ant-table-row-selected-custom' : ''
                }
            />

            <style>{`
                .ant-table-row-selected-custom {
                    background-color: #e6f7ff;
                }
            `}</style>
        </div>
    );
};

export default PermVehiculeForm;