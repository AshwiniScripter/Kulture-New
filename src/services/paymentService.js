import { API_ENDPOINT } from '../config/api';
import { apiCall } from './apiClient';

// Frappe may wrap the payload in `{ message: {...} }`. Unwrap object messages
// while leaving `{ success: true, message: 'ok' }` (string message) intact so
// the `success` flag is never lost.
const unwrap = (res) => {
  if (!res) return {};
  if (res.message && typeof res.message === 'object') return res.message;
  return res;
};

const paymentService = {
  createPaymentOrder: async (amount) => {
    const result = await apiCall(`${API_ENDPOINT}.payment.create_payment_order`, {
      method: 'POST',
      body: { amount },
      raw: true,
    });
    return unwrap(result);
  },

  verifyPayment: async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
    const result = await apiCall(`${API_ENDPOINT}.payment.verify_payment`, {
      method: 'POST',
      body: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
      raw: true,
    });
    return unwrap(result);
  },
};

export default paymentService;
