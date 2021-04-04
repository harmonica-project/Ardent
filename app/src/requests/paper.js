import axios from 'axios';
import { API_URL } from './config';

import auth from './authentication';

export function getPapers() {
  return axios.get(`${API_URL}/papers`, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => {
      auth.handleResponse(error.response);
    });
}

export function saveParsifalPapers(fileData) {
  const formData = new FormData();
  formData.append(
    'xlsArchitectures',
    fileData,
    fileData.name
  );
  return axios.post(`${API_URL}/xls/`, formData, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => {
      auth.handleResponse(error.response);
    });
}

export function deletePaper(paperId) {
  return axios.delete(`${API_URL}/paper/${paperId}`, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => {
      auth.handleResponse(error.response);
    });
}

export function saveExistingPaper(paper) {
  return axios.put(`${API_URL}/paper/${paper.id}`, paper, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => {
      auth.handleResponse(error.response);
    });
}

export function saveNewPaper(paper) {
  return axios.post(`${API_URL}/paper`, paper, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => {
      auth.handleResponse(error.response);
    });
}
