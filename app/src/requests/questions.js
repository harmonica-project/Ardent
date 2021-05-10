import axios from 'axios';
import { API_URL } from './config';

import auth from './authentication';

export function saveQuestion(question) {
  return axios.post(`${API_URL}/questions`, question, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}

export function getQuestions() {
  return axios.get(`${API_URL}/questions`, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}

export function markAsClosed(questionId) {
  return axios.put(`${API_URL}/questions/${questionId}/close`, {}, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}
