import axios from 'axios';
import config from '../../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

const getMenuPermissions = async (userId) => {
  try {
    const response = await axios.get(`${DOMAIN}/menu/permissions?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des permissions de menu :', error);
    throw error; 
  }
};

export { getMenuPermissions };
