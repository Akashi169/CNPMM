import axios from '../util/axios.customize';

export const getProducts = async (params) => {
  // params có thể bao gồm: search, category, minPrice, maxPrice, sort, page, limit
  try {
    const response = await axios.get('/api/products', { params });
    return response; 
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
export const getCategories = async () => {
  try {
    const response = await axios.get('/api/categories');
    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`/api/products/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching product detail:', error);
    throw error;
  }
};
