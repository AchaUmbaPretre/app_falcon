import axios from 'axios';
import config from '../config';
const DOMAINFDLOG = config.REACT_APP_FDLOG;

export const getUsers = async () => {
    return axios.get(`${DOMAINFDLOG}/api/user`)
}