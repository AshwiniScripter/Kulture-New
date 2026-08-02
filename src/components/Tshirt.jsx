import React from 'react';
import ProductCategory from './ProductCategory';
import { useProducts } from '../context/ProductsContext';

const Tshirt = (props) => {
  const { getByCategory, loading, error } = useProducts();
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
