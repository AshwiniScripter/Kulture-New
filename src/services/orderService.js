import { API_ENDPOINT } from '../config/api';
import { apiCall } from './apiClient';
import { getImageUrl } from '../utils/imageUtils';

const normalizeOrder = (order) => {
  if (!order) return null;
  return {
    ...order,
    order_id: order.order_id || order.name || order.id,
    items: (order.items || []).map((item) => ({
      ...item,
      image: getImageUrl(item.image),
    })),
  };
};

const orderService = {
  createOrder: async (orderData) =>
    apiCall(`${API_ENDPOINT}.api.create_order`, {
      method: 'POST',
      body: orderData,
    }),

  getUserOrders: async (email = null) => {
    const query = {};
    if (email) query.customer_email = email;
    const result = await apiCall(`${API_ENDPOINT}.api.get_user_orders`, {
      method: 'GET',
      query,
    });
    const list = Array.isArray(result) ? result : [];
    return list.map(normalizeOrder).filter(Boolean);
  },
};

export default orderService;
