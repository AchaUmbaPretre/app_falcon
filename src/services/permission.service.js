import axios from 'axios';
import config from '../config';
const DOMAINFDLOG = config.REACT_APP_FDLOG;

export const putPermission = async (userId, optionId, submenuId, finalPermissions ) => {
    return axios.put(`${DOMAINFDLOG}/api/permission/update/${userId}/permissions/add/${optionId}?submenuId=${submenuId}`, finalPermissions)
}