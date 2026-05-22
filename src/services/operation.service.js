import axios from 'axios';
import config from '../config';
const DOMAIN = config.REACT_APP_SERVER_DOMAIN;


export const getDerniereOperation = async () => {
    return axios.get(`${DOMAIN}/operation/derniere_operation`)
}
