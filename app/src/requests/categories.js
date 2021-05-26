import axios from 'axios';
import { API_URL } from './config';

import auth from './authentication';

export function saveCategory(categoryLabel) {
  return axios.post(`${API_URL}/categories`, { label: categoryLabel }, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}

export function deleteCategory(categoryId) {
  return axios.delete(`${API_URL}/categories/${categoryId}`, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}

export function modifyCategory(category) {
  return axios.put(`${API_URL}/categories`, category, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}

export function getCategories() {
  return axios.get(`${API_URL}/categories`, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}
