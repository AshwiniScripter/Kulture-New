import React from 'react';
import ProductCategory from './ProductCategory';
import { useProducts } from '../context/ProductsContext';

const Watches = (props) => {
  const { getByCategory, loading, error, refresh } = useProducts();
  return (
    <ProductCategory
      title="WATCHES"
      products={getByCategory('watches')}
      loading={loading}
      error={error}
      onRetry={refresh}
      {...props}
    />
  );
};

export default Watches;
