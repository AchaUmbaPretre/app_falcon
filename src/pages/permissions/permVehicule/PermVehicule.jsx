import React from 'react'
import { usePermVehiculeData } from './hooks/usePermVehiculeData';
import { PermVehiculeTable } from './components/PermVehiculeTable';

const PermVehicule = () => {
    const { clients, loading, error, refetch } = usePermVehiculeData();
    
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
        <PermVehiculeTable clients={clients} loading={loading} />
    </div>
  )
}

export default PermVehicule