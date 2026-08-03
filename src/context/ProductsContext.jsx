import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import productService from '../services/productService';
import { matchCategory, matchSubcategory } from '../utils/productUtils';

const ProductsContext = createContext(null);

const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ category: null, subcategory: null });
  const cacheRef = useRef(new Map());

  const mergeList = useCallback((list) => {
    (list || []).forEach((p) => {
      if (p && p.id !== undefined && p.id !== null) {
        cacheRef.current.set(String(p.id), p);
      }
    });
    return Array.from(cacheRef.current.values());
  }, []);

  const refresh = useCallback(
    async (nextFilters = filters) => {
      setLoading(true);
      setError(null);
      try {
        const list = await productService.getProducts({
          category: nextFilters.category,
          subcategory: nextFilters.subcategory,
        });
        setProducts(mergeList(list));
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    },
    [filters, mergeList]
  );

  useEffect(() => {
    refresh(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category, filters.subcategory]);

  const fetchByCategory = useCallback((category, subcategory) => {
    setFilters((prev) => {
      const next = { category: category || null, subcategory: subcategory || null };
      return prev.category === next.category && prev.subcategory === next.subcategory ? prev : next;
    });
  }, []);

  const getById = useCallback((id) => cacheRef.current.get(String(id)) || null, []);

  const getByCategory = useCallback((category, subcategory) => {
    const list = Array.from(cacheRef.current.values());
    const base = category ? list.filter((p) => matchCategory(p.category, category)) : list;
    return subcategory ? base.filter((p) => matchSubcategory(p, subcategory)) : base;
  }, []);

  const value = useMemo(
    () => ({ products, loading, error, refresh, getById, getByCategory, fetchByCategory }),
    [products, loading, error, refresh, getById, getByCategory, fetchByCategory]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within a ProductsProvider');
  return ctx;
};

export { ProductsProvider, useProducts };