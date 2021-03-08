import axios from 'axios';
import { API_URL, AUTH_INFO } from './config';

export function getPropertiesNames(cname) {
  return axios.get(`${API_URL}/properties_names/${cname}`, AUTH_INFO, { withCredentials: true });
}

export function getPropertyValues(pkey) {
  return axios.get(`${API_URL}/properties_values/${pkey}`, AUTH_INFO, { withCredentials: true });
}

export function saveProperty(property) {
  return axios.post(`${API_URL}/property`, property, AUTH_INFO, { withCredentials: true });
}

export function deleteProperty(propertyId) {
  return axios.delete(`${API_URL}/property/${propertyId}`, AUTH_INFO, { withCredentials: true });
}
