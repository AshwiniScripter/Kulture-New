import React from 'react';
import ProductCategory from './ProductCategory';
import { useProducts } from '../context/ProductsContext';

const Shades = (props) => {
  const { getByCategory, loading, error, refresh } = useProducts();
  return (
    <ProductCategory
      title="SHADES"
      products={getByCategory('shades')}
      loading={loading}
      error={error}
      onRetry={refresh}
      {...props}
    />
  );
};

export default Shades;
