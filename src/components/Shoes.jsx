import React from 'react';
import ProductCategory from './ProductCategory';
import { useProducts } from '../context/ProductsContext';

const Shoes = (props) => {
  const { getByCategory, loading, error, refresh } = useProducts();
  return (
    <ProductCategory
      title="SHOES"
      products={getByCategory('shoes')}
      loading={loading}
      error={error}
      onRetry={refresh}
      {...props}
    />
  );
};

export default Shoes;
