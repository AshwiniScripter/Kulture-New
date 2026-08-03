import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCategory from './ProductCategory';
import { useProducts } from '../context/ProductsContext';

const SLEEVE_BUTTONS = [
  { id: 'all', label: 'ALL', keywords: [] },
  { id: 'half', label: 'HALF SLEEVE', keywords: ['half'] },
  { id: 'full', label: 'FULL SLEEVE', keywords: ['full'] },
];

const Shirts = (props) => {
  const navigate = useNavigate();
  const { getByCategory, loading, error } = useProducts();
  const [sleeve, setSleeve] = useState('all');
  const baseProducts = getByCategory('upperwear') || [];

  const products = useMemo(() => {
    let result = baseProducts.filter((p) => {
      const haystack = [p.subcategory, p.item_group, p.category, p.name, p.product_name, p.title]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes('shirt') && !haystack.includes('t-shirt') && !haystack.includes('tshirt');
    });

    if (sleeve !== 'all') {
      const target = SLEEVE_BUTTONS.find((s) => s.id === sleeve);
      result = result.filter((p) => {
        const haystack = [p.sleeve_type, p.sleeve, p.name, p.product_name, p.title]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return target && target.keywords.some((kw) => haystack.includes(kw));
      });
    }

    return result;
  }, [baseProducts, sleeve]);

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white px-3 md:px-6 pt-28 md:pt-32 pb-12">
      <div className="mx-auto max-w-7xl mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate('/upperwear')}
          className="w-12 h-12 bg-[#121212] border border-neutral-800/80 rounded-xl flex items-center justify-center hover:bg-neutral-800 transition shrink-0"
          aria-label="Back"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="bg-[#121212] border border-neutral-800/80 rounded-xl py-3 px-6 flex-1 text-center">
          <h1 className="text-lg md:text-2xl font-black tracking-widest uppercase text-white">SHIRTS</h1>
        </div>
      </div>

      {/* Sleeve Filter Bar */}
      <div className="mx-auto max-w-7xl mb-6 flex justify-end border-b border-neutral-800 pb-4">
        <div className="flex gap-2">
          {SLEEVE_BUTTONS.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setSleeve(btn.id)}
              className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-full border transition ${
                sleeve === btn.id
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-neutral-400 border-neutral-800 hover:border-neutral-600'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <ProductCategory title="" products={products} loading={loading} error={error} {...props} />
    </div>
  );
};

export default Shirts;