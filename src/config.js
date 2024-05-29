import axios from "axios";

const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
const currentUser = user && JSON.parse(user).currentUser;
const TOKEN = currentUser?.accessToken;
/* baseURL: 'http://localhost:8080' */
/*       REACT_APP_SERVER_DOMAIN : 'http://localhost:8070' */
/* REACT_APP_SERVER_DOMAIN : 'https://apifalcon.loginsmart-cd.com' */

export default {
      REACT_APP_SERVER_DOMAIN : 'https://apifalcon.loginsmart-cd.com' 
};

export const userRequest = axios.create({
      baseURL: 'https://apifalcon.loginsmart-cd.com',
      header: { token: `Bearer ${TOKEN}` },
});