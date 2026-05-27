// services/PermVehicule.service.js (mis à jour)
import axios from 'axios';
import config from '../../../../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN; // API admin
const USER_APP_DOMAIN = config.REACT_APP_FDLOG; // API utilisateur (à configurer)

class PermVehiculeService {
    static instance = null;

    constructor() {
        if (!PermVehiculeService.instance) {
            PermVehiculeService.instance = this;
        }
        return PermVehiculeService.instance;
    }

    // API Admin - Récupérer les clients
    async fetchClient() {
        try {
            const { data } = await axios.get(`${DOMAIN}/client`);
            return data;
        } catch (error) {
            console.error('❌ Failed to fetch client:', error);
            throw new Error('Impossible de charger les clients');
        }
    }

    // API Admin - Récupérer les véhicules d'un client
    async fetchVehiculeById(id_client) {
        try {
            const { data } = await axios.get(`${DOMAIN}/vehicule/clientById?id_client=${id_client}`);
            return data;
        } catch (error) {
            console.error('❌ Failed to fetch vehicules:', error);
            throw new Error('Impossible de charger les véhicules');
        }
    }

    // 🔥 NOUVEAU: API Utilisateur - Envoyer les permissions
    async syncPermissionsToUserApp(permissionsData) {
        try {
            console.log('📤 Envoi des permissions à l\'API utilisateur:', permissionsData);
            
            const { data } = await axios.post(`${USER_APP_DOMAIN}/api/permission/user_vehicule_permission`, permissionsData, {
                headers: {
                    'Content-Type': 'application/json',
                    // Ajoutez un token d'authentification si nécessaire
                    // 'Authorization': `Bearer ${yourAdminToken}`
                }
            });
            
            console.log('✅ Permissions synchronisées avec succès:', data);
            return data;
        } catch (error) {
            console.error('❌ Failed to sync permissions:', error);
            throw new Error('Impossible de synchroniser les permissions');
        }
    }

    // 🔥 Alternative: Envoi séparé client + véhicules
    async syncClientToUserApp(clientData) {
        try {
            const { data } = await axios.post(`${USER_APP_DOMAIN}/api/auth/register`, clientData);
            return data;
        } catch (error) {
            console.error('❌ Failed to sync client:', error);
            throw error;
        }
    }

    async syncVehiculesToUserApp(vehiculesData) {
        try {
            const { data } = await axios.post(`${USER_APP_DOMAIN}/api/vehicule/vehicule`, vehiculesData);
            return data;
        } catch (error) {
            console.error('❌ Failed to sync vehicules:', error);
            throw error;
        }
    }
}

const instance = new PermVehiculeService();
Object.freeze(instance);

export default instance;