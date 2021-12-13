import axios from 'axios';
import { API_URL } from './config';

import auth from './authentication';

export function saveNewProject(paper) {
  return axios.post(`${API_URL}/projects`, paper, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}

export function getProjectArchitectures(projectURL) {
  return axios.get(`${API_URL}/projects/${projectURL}/architectures`, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}

export function getProjectPapers(projectURL) {
  return axios.get(`${API_URL}/projects/${projectURL}/papers`, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}

export function getProjectQuestions(projectURL) {
  return axios.get(`${API_URL}/projects/${projectURL}/questions`, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}

export function getProjectBaseComponents(projectURL) {
  return axios.get(`${API_URL}/projects/${projectURL}/components/bases`, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}

export function deleteProject(projectURL) {
  return axios.delete(`${API_URL}/projects/${projectURL}`, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}
