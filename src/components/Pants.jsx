import React from 'react';
import ProductCategory from './ProductCategory';
import { useProducts } from '../context/ProductsContext';

const Pants = (props) => {
  const { getByCategory, loading, error, refresh } = useProducts();
  return (
    <ProductCategory
      title="PANTS"
      products={getByCategory('pants')}
      loading={loading}
      error={error}
      onRetry={refresh}
      {...props}
    />
  );
};

export default Pants;
