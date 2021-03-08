import axios from 'axios';
import { API_URL, AUTH_INFO } from './config';

export function getComponentsInstances() {
  return axios.get(`${API_URL}/components_instances`, AUTH_INFO, { withCredentials: true });
}

export function getComponentsNames() {
  return axios.get(`${API_URL}/components_names`, AUTH_INFO, { withCredentials: true });
}

export function saveNewComponentInstance(component) {
  return axios.post(`${API_URL}/component_instance`, component, AUTH_INFO, { withCredentials: true });
}

export function saveExistingComponentInstance(component) {
  return axios.put(`${API_URL}/component_instance/${component.id}`, component, AUTH_INFO, { withCredentials: true });
}

export function deleteComponentInstance(componentId) {
  return axios.delete(`${API_URL}/component_instance/${componentId}`, AUTH_INFO, { withCredentials: true });
}

export function getComponentInstance(componentId) {
  return axios.get(`${API_URL}/component_instance/${componentId}`, AUTH_INFO, { withCredentials: true });
}
