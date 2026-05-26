import { useState, useCallback } from 'react';

export const usePermVehiculeTab = (defaultKey = '1') => {
    const [activeKey, setActiveKey] = useState(defaultKey);
    
    const handleTabChange = useCallback((key) => {
        setActiveKey(key);
    }, []);
    
    return { activeKey, handleTabChange };
};