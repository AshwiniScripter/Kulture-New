import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import productService from '../services/productService';
import { matchCategory } from '../utils/productUtils';

const ProductsContext = createContext(null);

const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await productService.getProducts();
      setProducts(list);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getById = useCallback(
    (id) => {
      const key = String(id);
      return products.find((p) => String(p.id) === key) || null;
    },
    [products]
  );

  const getByCategory = useCallback(
    (key) => products.filter((p) => matchCategory(p.category, key)),
    [products]
  );

  const value = useMemo(
    () => ({ products, loading, error, refresh, getById, getByCategory }),
    [products, loading, error, refresh, getById, getByCategory]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within a ProductsProvider');
  return ctx;
};

export { ProductsProvider, useProducts };
