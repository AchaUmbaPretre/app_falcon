import React, { useState } from 'react';
import { Modal } from 'antd';
import { usePermVehiculeData } from './hooks/usePermVehiculeData';
import { PermVehiculeTable } from './components/PermVehiculeTable';
import PermVehiculeForm from './permVehiculeForm/PermVehiculeForm';

const PermVehicule = () => {
    const { clients, vehicules, loading, error, refetch } = usePermVehiculeData();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);

    const handleViewUser = (userId) => {
        const client = clients.find(c => c.id === userId);
        setSelectedClient(client);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedClient(null);
    };

    const handleSuccess = () => {
        // Rafraîchir les données après une mise à jour réussie
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
                title=""
                open={modalVisible}
                onCancel={handleCloseModal}
                footer={null}
                width={900}
                destroyOnClose
            >
                {selectedClient && (
                    <PermVehiculeForm
                        vehicules={vehicules}
                        client={selectedClient}
                        onSuccess={handleSuccess}
                        onCancel={handleCloseModal}
                    />
                )}
            </Modal>
        </div>
    );
};

export default PermVehicule;