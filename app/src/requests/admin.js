import axios from 'axios';
import { API_URL } from './config';

import auth from './authentication';

export default function getInviteToken() {
  return axios.get(`${API_URL}/admin/invite_token`, auth.getAuthHeaders())
    .then((data) => auth.handleResponse(data))
    .catch((error) => {
      auth.handleResponse(error.response);
    });
}
