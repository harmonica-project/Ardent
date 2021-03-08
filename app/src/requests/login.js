import axios from 'axios';
import { API_URL } from './config';

export default function loginUser(authInfo) {
  return axios.get(`${API_URL}/login`, authInfo, { withCredentials: true });
}
