import axios from 'axios';
import { API_URL } from './config';

import auth from './authentication';

export function saveConnection(connection) {
  return axios.post(`${API_URL}/connections`, connection, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}

export function deleteConnection(connectionId) {
  return axios.delete(`${API_URL}/connections/${connectionId}`, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}

export function modifyConnection(connection) {
  return axios.put(`${API_URL}/connections`, connection, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}
