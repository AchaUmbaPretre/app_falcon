import axios from 'axios';
import config from '../../../../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
const DOMAINDLOG = config.REACT_APP_FDLOG;

class PermVehiculeService {
    constructor() {
        if(!PermVehiculeService.instance) {
            PermVehiculeService.instance = this;
        }
        return PermVehiculeService.instance;
    }

    async fetchVehiculeDlog() {
        try {
            const { data } = await axios.get(`${DOMAINDLOG}/api/charroi/vehicule`)
            return data
        } catch (error) {
            console.error('❌ Failed to fetch users:', error);
            throw new Error('Impossible de charger les utilisateurs');
        }
    }

    async fetchClient() {
        try {
            const { data } = await axios.get(`${DOMAIN}/client`)
            return data
        } catch (error) {
            console.error('❌ Failed to fetch client:', error);
            throw new Error('Impossible de charger les clients');
        }
    }
}

const instance = new PermVehiculeService();
Object.freeze(instance);

export default instance;