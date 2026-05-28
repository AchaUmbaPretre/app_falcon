import axios from 'axios';
import config from '../config';
const DOMAINFDLOG = config.REACT_APP_FDLOG;

export const getMenusOne = async () => {
    return axios.get(`${DOMAINFDLOG}/api/permission/add`)
}

export const getMenus = async (userId) => {
    return axios.get(`${DOMAINFDLOG}/api/permission/one?userId=${userId}`);
};
