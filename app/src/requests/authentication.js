import axios from 'axios';
import { BehaviorSubject } from 'rxjs';
import { API_URL } from './config';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('currentUser');
  currentUserSubject.next(null);
  document.location.reload(true);
}

function handleResponse(response) {
  if (!response.data.success) {
    if ([401, 403].indexOf(response.status) !== -1) {
      // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
      logout();
    }

    return response;
  }

  return response.data;
}

function login(username, password) {
  const requestOptions = {
    headers: { 'Content-Type': 'application/json' }
  };

  return axios.post(`${API_URL}/users/authenticate`, { username, password }, requestOptions)
    .then((data) => handleResponse(data))
    .then((user) => {
      delete user.success;
      // store user details and jwt token in local storage to keep user logged
      localStorage.setItem('currentUser', JSON.stringify(user));
      currentUserSubject.next(user);
      return user;
    })
    .catch((error) => handleResponse(error.response));
}

function updateUser(newUser) {
  const newCurrentUser = {
    ...currentUserSubject.value,
    user: newUser
  };
  currentUserSubject.next(newCurrentUser);
  localStorage.setItem('currentUser', JSON.stringify(newCurrentUser));
}

function getAuthHeaders() {
  // return authorization header with jwt token
  const currentUser = currentUserSubject.value;
  if (currentUser) return { headers: { Authorization: `Bearer ${currentUser.token}` } };
  return {};
}

const authenticationService = {
  login,
  logout,
  handleResponse,
  getAuthHeaders,
  updateUser,
  currentUser: currentUserSubject.asObservable(),
  get currentUserValue() { return currentUserSubject.value; }
};

export default authenticationService;
