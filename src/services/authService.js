import { API_ENDPOINT } from '../config/api';
import { apiCall } from './apiClient';

const authService = {
  register: async ({ full_name, email, password, phone }) =>
    apiCall(`${API_ENDPOINT}.auth.register`, {
      method: 'POST',
      body: { full_name, email, password, phone },
    }),

  login: async (email, password) =>
    apiCall(`${API_ENDPOINT}.auth.login`, {
      method: 'POST',
      body: { email, password },
    }),

  getProfile: async () => apiCall(`${API_ENDPOINT}.auth.get_profile`, { method: 'GET' }),

  sendOtp: async (email) =>
    apiCall(`${API_ENDPOINT}.auth.send_otp`, {
      method: 'POST',
      body: { email },
    }),

  verifyOtp: async (email, otp) =>
    apiCall(`${API_ENDPOINT}.auth.verify_otp`, {
      method: 'POST',
      body: { email, otp },
    }),

  resetPassword: async (email, verification_token, new_password) =>
    apiCall(`${API_ENDPOINT}.auth.reset_password`, {
      method: 'POST',
      body: { email, verification_token, new_password },
    }),
};

export default authService;
