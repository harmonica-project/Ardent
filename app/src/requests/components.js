import axios from 'axios';
import { API_URL } from './config';

import auth from './authentication';

export function saveNewComponentInstance(component) {
  return axios.post(`${API_URL}/components/instances`, component, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}

export function saveExistingComponentInstance(component) {
  return axios.put(`${API_URL}/components/instances/${component.id}`, component, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}

export function saveNewBaseComponent(component) {
  return axios.post(`${API_URL}/components/bases`, component, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}

export function saveExistingBaseComponent(component) {
  return axios.put(`${API_URL}/components/bases/${component.id}`, component, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}

export function deleteComponentInstance(componentId) {
  return axios.delete(`${API_URL}/components/instances/${componentId}`, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}

export function getComponentInstance(componentId) {
  return axios.get(`${API_URL}/components/instances/${componentId}`, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}

export function getFullComponents() {
  return axios.get(`${API_URL}/components/`, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}

export function deleteBaseComponent(componentId) {
  return axios.delete(`${API_URL}/components/bases/${componentId}`, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}
