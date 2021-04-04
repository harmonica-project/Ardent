import axios from 'axios';
import { API_URL } from './config';

import auth from './authentication';

export function getArchitectures() {
  return axios.get(`${API_URL}/architectures`, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => {
      auth.handleResponse(error.response);
    });
}

export function getArchitecture(architectureId) {
  return axios.get(`${API_URL}/architecture/${architectureId}`, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => {
      auth.handleResponse(error.response);
    });
}

export function saveNewArchitecture(architecture) {
  return axios.post(`${API_URL}/architecture`, architecture, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => {
      auth.handleResponse(error.response);
    });
}

export function saveExistingArchitecture(architecture) {
  return axios.put(`${API_URL}/architecture/${architecture.id}`, architecture, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => {
      auth.handleResponse(error.response);
    });
}

export function deleteArchitecture(architectureId) {
  return axios.delete(`${API_URL}/architecture/${architectureId}`, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => {
      auth.handleResponse(error.response);
    });
}
