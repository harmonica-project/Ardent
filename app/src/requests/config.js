const getAuthInfo = () => {
  const username = localStorage.getItem('username');
  const password = localStorage.getItem('password');

  if (!username || !password) return {};
  return { auth: { username, password } };
};

export const API_URL = '<< Your API URL >>';
export const AUTH_INFO = getAuthInfo();
