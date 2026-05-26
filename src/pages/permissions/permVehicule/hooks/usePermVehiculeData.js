import { useCallback, useState, useEffect } from "react";
import PermVehiculeService from '../services/PermVehicule.service';

const initialState = {
    clients: [],
    vehicules: [],
    loading: true,
    error: null
};

export const usePermVehiculeData = () => {
    const [state, setState] = useState(initialState);
    
    const loadClients = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const clients = await PermVehiculeService.fetchClient();
            setState(prev => ({ ...prev, clients, loading: false, error: null }));
        } catch (error) {
            setState(prev => ({ 
                ...prev,
                clients: [], 
                loading: false, 
                error: error.message || 'Erreur inconnue' 
            }));
        }
    }, []);

    const loadVehicules = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const vehicules = await PermVehiculeService.fetchVehiculeDlog();
            setState(prev => ({ ...prev, vehicules, loading: false, error: null }));
        } catch (error) {
            setState(prev => ({ 
                ...prev,
                vehicules: [], 
                loading: false, 
                error: error.message || 'Erreur inconnue' 
            }));
        }
    }, []);
    
    useEffect(() => {
        const loadData = async () => {
            await Promise.all([loadClients(), loadVehicules()]);
        };
        loadData();
    }, [loadClients, loadVehicules]);

    const refetch = useCallback(() => {
        const loadData = async () => {
            await Promise.all([loadClients(), loadVehicules()]);
        };
        loadData();
    }, [loadClients, loadVehicules]);
    
    const refetchClients = useCallback(() => {
        loadClients();
    }, [loadClients]);

    const refetchVehicules = useCallback(() => {
        loadVehicules();
    }, [loadVehicules]);
    
    return { 
        clients: state.clients,
        vehicules: state.vehicules,
        loading: state.loading, 
        error: state.error,
        refetch,
        refetchClients,
        refetchVehicules
    };
};