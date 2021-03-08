import axios from 'axios';
import { API_URL, AUTH_INFO } from './config';

export function getArchitectures() {
  return axios.get(`${API_URL}/architectures`, AUTH_INFO, { withCredentials: true });
}

export function getArchitecture(architectureId) {
  return axios.get(`${API_URL}/architecture/${architectureId}`, AUTH_INFO, { withCredentials: true });
}

export function saveNewArchitecture(architecture) {
  return axios.post(`${API_URL}/architecture`, architecture, AUTH_INFO, { withCredentials: true });
}

export function saveExistingArchitecture(architecture) {
  return axios.put(`${API_URL}/architecture/${architecture.id}`, architecture, AUTH_INFO, { withCredentials: true });
}

export function deleteArchitecture(architectureId) {
  return axios.delete(`${API_URL}/architecture/${architectureId}`, AUTH_INFO, { withCredentials: true });
}
