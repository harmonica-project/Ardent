import axios from 'axios';
import { API_URL } from './config';

import auth from './authentication';

export function saveConnection(connection) {
  return axios.post(`${API_URL}/connection`, connection, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => {
      auth.handleResponse(error.response);
    });
}

export function deleteConnection(connectionId) {
  return axios.delete(`${API_URL}/connection/${connectionId}`, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => {
      auth.handleResponse(error.response);
    });
}
