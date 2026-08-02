import { extractErrorMessage } from '../utils/errorHandler';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const apiCall = async (endpoint, { method = 'GET', body = null, query = null } = {}) => {
  let url = endpoint;
  if (query) {
    const qs = new URLSearchParams();
    Object.entries(query).forEach(([key, val]) => {
      if (val !== null && val !== undefined && val !== '') qs.append(key, val);
    });
    const str = qs.toString();
    if (str) url += `${url.includes('?') ? '&' : '?'}${str}`;
  }

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const csrf = getCookie('csrf_token') || getCookie('_csrf_token');
  if (csrf) headers['X-Frappe-CSRF-Token'] = csrf;

  const options = {
    method,
    headers,
    credentials: 'include',
  };

  if (body) options.body = JSON.stringify(body);

  const response = await fetch(url, options);

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(extractErrorMessage(data) || `API request failed (${response.status})`);
  }

  if (data && typeof data === 'object' && Object.prototype.hasOwnProperty.call(data, 'message')) {
    return data.message;
  }
  return data;
};

export { apiCall, getCookie };
