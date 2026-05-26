import { useCallback, useState } from "react";
import PermVehiculeService from '../services/PermVehicule.service'
import { useEffect } from "react";

const initialState = {
    clients: [],
    loading: true,
    error: null
};

export const usePermVehiculeData = () => {
    const [state, setState] = useState({});
    
    const loadClients = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const clients = await PermVehiculeService.fetchClient();
            setState({ clients, loading: false, error: null });
        } catch (error) {
            setState({ 
                clients: [], 
                loading: false, 
                error: error.message || 'Erreur inconnue' 
            });
        }
    }, []);
    
    useEffect(() => {
        loadClients();
    }, [loadClients]);

    const refetch = useCallback(() => {
        loadClients();
    }, [loadClients]);
    
    return { ...state, refetch };

}