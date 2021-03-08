import axios from 'axios';
import { API_URL, AUTH_INFO } from './config';

export function saveConnection(connection) {
  return axios.post(`${API_URL}/connection`, connection, AUTH_INFO, { withCredentials: true });
}

export function deleteConnection(connectionId) {
  return axios.delete(`${API_URL}/connection/${connectionId}`, AUTH_INFO, { withCredentials: true });
}
