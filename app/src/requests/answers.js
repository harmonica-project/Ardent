import axios from 'axios';
import { API_URL } from './config';

import auth from './authentication';

export function saveAnswer(answer) {
  return axios.post(`${API_URL}/answers`, answer, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}

export function getAnswers(questionId) {
  return axios.get(`${API_URL}/answers/${questionId}`, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}

export function deleteAnswer(answerId) {
  return axios.delete(`${API_URL}/answers/${answerId}`, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}
