import React, { useState } from 'react';
import { Modal } from 'antd';
import { usePermVehiculeData } from './hooks/usePermVehiculeData';
import { PermVehiculeTable } from './components/PermVehiculeTable';
import PermVehiculeForm from './permVehiculeForm/PermVehiculeForm';

const PermVehicule = () => {
    const { clients, loading, error, refetch, loadVehiculesByClient } = usePermVehiculeData();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [clientVehicules, setClientVehicules] = useState([]);
    const [loadingVehicules, setLoadingVehicules] = useState(false);

    const handleViewUser = async (userId) => {
        const client = clients.find(c => c.id_client === userId);
        if (!client) return;
        
        setSelectedClient(client);
        setModalVisible(true);
        setLoadingVehicules(true);

        
        try {
            const vehicules = await loadVehiculesByClient(client.id_client);
            setClientVehicules(vehicules);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoadingVehicules(false);
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedClient(null);
        setClientVehicules([]);
    };

    const handleSuccess = () => {
        refetch();
        handleCloseModal();
    };

    if (error) {
        return (
            <div className="permission-error">
                <h3>⚠️ Erreur</h3>
                <p>{error}</p>
                <button onClick={refetch}>Réessayer</button>
            </div>
        );
    }

    return (
        <div>
            <PermVehiculeTable 
                clients={clients} 
                loading={loading} 
                onViewUser={handleViewUser}
            />
            
            <Modal
                title={`Permissions - ${selectedClient?.nom_client || selectedClient?.email}`}
                open={modalVisible}
                onCancel={handleCloseModal}
                footer={null}
                width={800}
                destroyOnClose
            >
                {selectedClient && (
                    <PermVehiculeForm
                        client={selectedClient}
                        vehicules={clientVehicules}
                        onSuccess={handleSuccess}
                        onCancel={handleCloseModal}
                        loading={loadingVehicules}
                    />
                )}
            </Modal>
        </div>
    );
};

export default PermVehicule;