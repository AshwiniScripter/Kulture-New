import React from 'react';
import ProductCategory from './ProductCategory';
import { useProducts } from '../context/ProductsContext';

const Bandana = (props) => {
  const { getByCategory, loading, error, refresh } = useProducts();
  return (
    <ProductCategory
      title="BANDANA"
      products={getByCategory('bandana')}
      loading={loading}
      error={error}
      onRetry={refresh}
      {...props}
    />
  );
};

export default Bandana;
