import axios from 'axios';
import config from '../../../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
const DOMAINDLOG = config.DOMAINDLOG;

class PermVehiculeService {
    constructor() {
        if(!PermVehiculeService.instance) {
            PermVehiculeService.instance = this;
        }
        return PermVehiculeService.instance;
    }

    async fetchVehiculeDlog() {
        try {
            const { data } = await axios.get(`${DOMAINDLOG}/charroi/vehicule`)
            return data
        } catch (error) {
            console.error('❌ Failed to fetch users:', error);
            throw new Error('Impossible de charger les utilisateurs');
        }
    }
}

const instance = new PermVehiculeService();
Object.freeze(instance);

export default instance;