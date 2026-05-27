// hooks/usePermVehiculeData.js
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
            return clients;
        } catch (error) {
            setState(prev => ({ 
                ...prev,
                clients: [], 
                loading: false, 
                error: error.message || 'Erreur inconnue' 
            }));
            throw error;
        }
    }, []);

    const loadVehiculesByClient = useCallback(async (id_client) => {
        
        if (!id_client) {
            console.warn('⚠️ Pas d\'ID client');
            return [];
        }
        
        try {
            console.log('📡 Appel API pour le client:', id_client);
            const response = await PermVehiculeService.fetchVehiculeById(id_client);
            console.log('📦 Réponse brute de l\'API:', response);
            
            // Gère différents formats de réponse
            const vehiculesData = response?.data || response || [];
            console.log('✅ Véhicules extraits:', vehiculesData);
            console.log('📊 Nombre de véhicules:', vehiculesData.length);
            
            return vehiculesData;
        } catch (error) {
            console.error('❌ Erreur chargement véhicules:', error);
            return [];
        }
    }, []);
    
    useEffect(() => {
        loadClients();
    }, [loadClients]);

    const refetch = useCallback(() => {
        loadClients();
    }, [loadClients]);
    
    return { 
        clients: state.clients,
        vehicules: state.vehicules,
        loading: state.loading,
        loadingVehicules: state.loadingVehicules,
        error: state.error,
        refetch,
        loadVehiculesByClient
    };
};