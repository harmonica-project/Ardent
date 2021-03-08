import axios from 'axios';
import { API_URL, AUTH_INFO } from './config';

export function getPapers() {
  return axios.get(`${API_URL}/papers`, AUTH_INFO, { withCredentials: true });
}

export function saveParsifalPapers(fileData) {
  const formData = new FormData();
  formData.append(
    'xlsArchitectures',
    fileData,
    fileData.name
  );
  return axios.post(`${API_URL}/xls/`, formData, AUTH_INFO, { withCredentials: true });
}

export function deletePaper(paperId) {
  return axios.delete(`${API_URL}/paper/${paperId}`, AUTH_INFO, { withCredentials: true });
}

export function saveExistingPaper(paper) {
  return axios.put(`${API_URL}/paper/${paper.id}`, paper, AUTH_INFO, { withCredentials: true });
}

export function saveNewPaper(paper) {
  return axios.post(`${API_URL}/paper`, paper, AUTH_INFO, { withCredentials: true });
}
