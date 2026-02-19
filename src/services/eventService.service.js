import axios from 'axios';
import config from '../config';
const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getEvent = async () => {
  return axios.get(`${DOMAIN}/api/monitoring/`);
};

export const getFalcon = async () => {
  return axios.get('https://apidlog.loginsmart-cd.com/api/falcon'); // toujours en HTTPS car ton site est en HTTPS
};


export const getGeofences = async(params) => {
  return axios.get('https://apidlog.loginsmart-cd.com/api/point_in_geofences', { params });
}