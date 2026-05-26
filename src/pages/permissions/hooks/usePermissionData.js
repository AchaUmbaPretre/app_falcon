import { useState, useEffect, useCallback } from 'react';
import PermissionService from '../services/Permission.service';

const initialState = {
    users: [],
    loading: true,
    error: null
};

export const usePermVehiculeData = () => {
    const [state, setState] = useState(initialState);
    
    const loadUsers = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const users = await PermissionService.fetchUsers();
            setState({ users, loading: false, error: null });
        } catch (error) {
            setState({ 
                users: [], 
                loading: false, 
                error: error.message || 'Erreur inconnue' 
            });
        }
    }, []);
    
    useEffect(() => {
        loadUsers();
    }, [loadUsers]);
    
    const refetch = useCallback(() => {
        loadUsers();
    }, [loadUsers]);
    
    return { ...state, refetch };
};