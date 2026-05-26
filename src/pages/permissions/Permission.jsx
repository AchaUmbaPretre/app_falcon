import React, { useCallback } from 'react';
import './permissions.css';
import { useNavigate } from 'react-router-dom';
import { usePermVehiculeData } from './hooks/usePermissionData';
import { usePermVehiculeTab } from './hooks/usePermissionTab';
import { PermissionTabs } from './components/PermissionTabs';

const Permission = () => {
    const navigate = useNavigate();
    const { users, loading, error, refetch } = usePermVehiculeData()
    const { activeKey, handleTabChange } = usePermVehiculeTab('1');
    
    const handleViewUser = useCallback((userId) => {
        navigate(`/permissionOne?userId=${userId}`);
    }, [navigate]);
    
    // Gestion d'erreur
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
        <div className="permission-container">
            <PermissionTabs
                activeKey={activeKey}
                onTabChange={handleTabChange}
                users={users}
                loading={loading}
                onViewUser={handleViewUser}
            />
        </div>
    );
};

export default Permission;