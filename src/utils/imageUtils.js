import { API_BASE_URL } from '../config/api';

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('data:')) return imagePath;
  return `${API_BASE_URL}${imagePath}`;
};

export { getImageUrl };
