import { API_ENDPOINT } from '../config/api';
import { apiCall } from './apiClient';
import { normalizeProduct } from '../utils/productUtils';

const productService = {
  getProducts: async (category = null, store = null) => {
    const query = {};
    if (category) query.category = category;
    if (store) query.store = store;
    const result = await apiCall(`${API_ENDPOINT}.api.get_products`, {
      method: 'GET',
      query,
    });
    const list = Array.isArray(result) ? result : [];
    return list.map(normalizeProduct).filter(Boolean);
  },
};

export default productService;
