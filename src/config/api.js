const API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL || 'http://72.62.199.223';

const API_ENDPOINT = `${API_BASE_URL}/api/method/custom_ecommerse`;

export { API_BASE_URL, API_ENDPOINT };
