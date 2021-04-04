import axios from 'axios';
import { API_URL } from './config';

import auth from './authentication';

export function getBaseComponents() {
  return axios.get(`${API_URL}/component_base`, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => {
      auth.handleResponse(error.response);
    });
}

export function getComponentsInstances() {
  return axios.get(`${API_URL}/component_instance`, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => {
      auth.handleResponse(error.response);
    });
}

export function getComponentsNames() {
  return axios.get(`${API_URL}/components_names`, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => {
      auth.handleResponse(error.response);
    });
}

export function saveNewComponentInstance(component) {
  return axios.post(`${API_URL}/component_instance`, component, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => {
      auth.handleResponse(error.response);
    });
}

export function saveExistingComponentInstance(component) {
  return axios.put(`${API_URL}/component_instance/${component.id}`, component, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => {
      auth.handleResponse(error.response);
    });
}

export function saveNewBaseComponent(component) {
  return axios.post(`${API_URL}/component_base`, component, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => {
      auth.handleResponse(error.response);
    });
}

export function saveExistingBaseComponent(component) {
  return axios.put(`${API_URL}/component_base/${component.id}`, component, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => {
      auth.handleResponse(error.response);
    });
}

export function deleteComponentInstance(componentId) {
  return axios.delete(`${API_URL}/component_instance/${componentId}`, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => {
      auth.handleResponse(error.response);
    });
}

export function getComponentInstance(componentId) {
  return axios.get(`${API_URL}/component_instance/${componentId}`, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => {
      auth.handleResponse(error.response);
    });
}
