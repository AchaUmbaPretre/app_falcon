import axios from "axios";

const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
const currentUser = user && JSON.parse(user).currentUser;
const TOKEN = currentUser?.accessToken;
/* baseURL: 'http://localhost:8080' */
/*       REACT_APP_SERVER_DOMAIN : 'http://localhost:8070' */
/* REACT_APP_SERVER_DOMAIN : 'https://apifalcon.loginsmart-cd.com' */

export default {
  REACT_APP_SERVER_DOMAIN : 'https://apifalcon.loginsmart-cd.com',

  api_hash : '$2y$10$FbpbQMzKNaJVnv0H2RbAfel1NMjXRUoCy8pZUogiA/bvNNj1kdcY.'
};


export const userRequest = axios.create({
  baseURL: 'https://apifalcon.loginsmart-cd.com',
  headers: { Authorization: `Bearer ${TOKEN}` },
});