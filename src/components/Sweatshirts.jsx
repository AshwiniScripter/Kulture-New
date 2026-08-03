import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCategory from './ProductCategory';
import { useProducts } from '../context/ProductsContext';

const Sweatshirts = (props) => {
  const navigate = useNavigate();
  const { getByCategory, loading, error } = useProducts();
  const baseProducts = getByCategory('upperwear') || [];

  const products = useMemo(() => {
    return baseProducts.filter((p) => {
      const haystack = [p.subcategory, p.item_group, p.category, p.name, p.product_name, p.title]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes('sweatshirt') || haystack.includes('sweater');
    });
  }, [baseProducts]);

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white px-3 md:px-6 pt-28 md:pt-32 pb-12">
      {/* Custom Top Header */}
      <div className="mx-auto max-w-7xl mb-8 flex items-center gap-3">
        <button
          onClick={() => navigate('/upperwear')}
          className="w-12 h-12 bg-[#121212] border border-neutral-800/80 rounded-xl flex items-center justify-center hover:bg-neutral-800 transition shrink-0"
          aria-label="Back to Upperwear"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="bg-[#121212] border border-neutral-800/80 rounded-xl py-3 px-6 flex-1 text-center">
          <h1 className="text-lg md:text-2xl font-black tracking-widest uppercase text-white">SWEATSHIRTS</h1>
        </div>
      </div>

      {/* Product Grid without Duplicate Header */}
      <ProductCategory title="" hideHeader={true} products={products} loading={loading} error={error} {...props} />
    </div>
  );
};

export default Sweatshirts;