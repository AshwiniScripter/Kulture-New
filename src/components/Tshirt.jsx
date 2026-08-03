import React, { useEffect } from 'react';
import ProductCategory from './ProductCategory';
import { useProducts } from '../context/ProductsContext';

const Tshirt = (props) => {
  const { getByCategory, fetchByCategory, loading, error } = useProducts();

  useEffect(() => {
    fetchByCategory('tshirts');
  }, [fetchByCategory]);

  const products = getByCategory('tshirts');
  return (
    <ProductCategory
      title="T SHIRTS"
      products={products}
      loading={loading}
      error={error}
      {...props}
    />
  );
};

export default Tshirt;