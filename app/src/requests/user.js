import axios from 'axios';
import { API_URL } from './config';

import auth from './authentication';

export function getUser(username) {
  return axios.get(`${API_URL}/user/${username}`, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => {
      auth.handleResponse(error.response);
    });
}

export function setUser(user) {
  return axios.put(`${API_URL}/user/${user.username}/information`, user, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => {
      auth.handleResponse(error.response);
    });
}

export function setNewPassword(user) {
  return axios.put(`${API_URL}/user/${user.username}/password`, user, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => {
      auth.handleResponse(error.response);
    });
}
