// Same-origin API base. The app is served behind an HTTPS reverse proxy that
// forwards `/api` to the backend, so requests are relative (no mixed content).
// Set VITE_API_BASE_URL to override (e.g. a specific host) if needed.
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || '';

const API_ENDPOINT = `${API_BASE_URL}/api/method/custom_ecommerse`;

export { API_BASE_URL, API_ENDPOINT };