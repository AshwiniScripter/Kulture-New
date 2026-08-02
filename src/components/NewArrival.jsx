import React from 'react';
import ProductCategory from './ProductCategory';
import { useProducts } from '../context/ProductsContext';

const NewArrival = (props) => {
  const { products, loading, error, refresh } = useProducts();
  return (
    <ProductCategory
      title="NEW ARRIVAL"
      products={products}
      loading={loading}
      error={error}
      onRetry={refresh}
      {...props}
    />
  );
};

export default NewArrival;
