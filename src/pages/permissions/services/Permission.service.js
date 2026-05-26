import axios from 'axios';
import config from '../../../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

class PermissionService {
    constructor() {
        if (!PermissionService.instance) {
            PermissionService.instance = this;
        }
        return PermissionService.instance;
    }
    
    async fetchUsers() {
        try {
            const { data } = await axios.get(`${DOMAIN}/users`);
            return data;
        } catch (error) {
            console.error('❌ Failed to fetch users:', error);
            throw new Error('Impossible de charger les utilisateurs');
        }
    }
    
    async fetchUserById(id) {
        try {
            const { data } = await axios.get(`${DOMAIN}/users/${id}`);
            return data;
        } catch (error) {
            console.error(`❌ Failed to fetch user ${id}:`, error);
            throw new Error('Impossible de charger l\'utilisateur');
        }
    }
}

const instance = new PermissionService();
Object.freeze(instance);

export default instance;