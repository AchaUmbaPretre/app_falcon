import axios from 'axios';
import config from '../config';
const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getVehicule = async () => {
    return axios.get(`${DOMAIN}/vehicule`)
}

export const putRelierVehiculeFalcon = async (id, data) => {
    return axios.put(`${DOMAIN}/vehicule/vehicule_falcon?id_vehicule=${id}`, data);
}
