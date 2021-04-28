import axios from 'axios';
import { API_URL } from './config';

import auth from './authentication';

export function getUsers() {
  return axios.get(`${API_URL}/users`, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}

export function getUser(username) {
  return axios.get(`${API_URL}/users/${username}`, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}

export function setUser(user) {
  return axios.put(`${API_URL}/users/${user.username}/information`, user, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}

export function setNewPassword(user) {
  return axios.put(`${API_URL}/users/${user.username}/password`, user, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}

export function createUser(user) {
  return axios.post(`${API_URL}/users/register`, user, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}

export default function getInviteToken() {
  return axios.get(`${API_URL}/users/token`, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => auth.handleResponse(error.response));
}
