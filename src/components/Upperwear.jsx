import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCategory from './ProductCategory';
import { useProducts } from '../context/ProductsContext';

const CATEGORY = 'upperwear';

const SUB_CATEGORIES = [
  {
    id: 'jackets',
    label: 'JACKETS',
    keywords: ['jacket'],
    image: '/images/categories/jackets.jpg',
  },
  {
    id: 'sweatshirts',
    label: 'SWEATSHIRTS',
    keywords: ['sweatshirt', 'sweater'],
    image: '/images/categories/sweatshirts.jpg',
  },
  {
    id: 'hoodies',
    label: 'HOODIES',
    keywords: ['hoodie'],
    image: '/images/categories/hoodies.jpg',
  },
  {
    id: 'tanks',
    label: 'TANKS',
    keywords: ['tank'],
    image: '/images/categories/tanks.jpg',
  },
  {
    id: 'shirts',
    label: 'SHIRTS',
    keywords: ['shirt'],
    image: '/images/categories/shirts.jpg',
  },
  {
    id: 'tshirts',
    label: 'T-SHIRTS',
    keywords: ['t-shirt', 'tshirt', 't shirt'],
    image: '/images/categories/tshirts.jpg',
  },
];

const SLEEVE_BUTTONS = [
  { id: 'all', label: 'ALL', keywords: [] },
  { id: 'half', label: 'HALF SLEEVE', keywords: ['half'] },
  { id: 'full', label: 'FULL SLEEVE', keywords: ['full'] },
];

const CARRIES_SLEEVE_FILTER = ['shirts', 'tshirts'];

const Upperwear = (props) => {
  const navigate = useNavigate();
  const { getByCategory, loading, error } = useProducts();
  const baseProducts = getByCategory(CATEGORY) || [];

  const [selectedSub, setSelectedSub] = useState(null);
  const [sleeve, setSleeve] = useState('all');

  const showSleeveFilter = selectedSub && CARRIES_SLEEVE_FILTER.includes(selectedSub);
  const activeSubObj = SUB_CATEGORIES.find((s) => s.id === selectedSub);

  const filteredProducts = useMemo(() => {
    let result = baseProducts;

    if (activeSubObj && activeSubObj.keywords.length > 0) {
      result = result.filter((p) => {
        const haystack = [
          p.subcategory,
          p.item_group,
          p.category,
          p.name,
          p.product_name,
          p.title,
          p.sleeve_type,
          p.sleeve,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return activeSubObj.keywords.some((kw) => haystack.includes(kw));
      });
    }

    if (showSleeveFilter && sleeve !== 'all') {
      const sleeveTarget = SLEEVE_BUTTONS.find((s) => s.id === sleeve);
      result = result.filter((p) => {
        const haystack = [
          p.sleeve_type,
          p.sleeve,
          p.subcategory,
          p.item_group,
          p.name,
          p.product_name,
          p.title,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return (
          sleeveTarget &&
          sleeveTarget.keywords.some((kw) => haystack.includes(kw))
        );
      });
    }

    return result;
  }, [baseProducts, activeSubObj, showSleeveFilter, sleeve]);

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white px-3 md:px-6 pt-28 md:pt-32 pb-12">
      {/* Header Bar */}
      <div className="mx-auto max-w-7xl mb-8 flex items-center gap-3">
        {/* Square Back Button */}
        <button
          onClick={() => {
            if (selectedSub) {
              setSelectedSub(null);
              setSleeve('all');
            } else {
              navigate(-1);
            }
          }}
          className="w-12 h-12 bg-[#121212] border border-neutral-800/80 rounded-xl flex items-center justify-center hover:bg-neutral-800 transition shrink-0"
          aria-label="Back"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Header Title Box with Larger Font */}
        <div className="bg-[#121212] border border-neutral-800/80 rounded-xl py-3 px-6 flex-1 text-center">
          <h1 className="text-lg md:text-2xl font-black tracking-widest uppercase text-white">
            {selectedSub ? activeSubObj?.label : 'UPPERWEAR'}
          </h1>
        </div>
      </div>

      {/* 1. SUBCATEGORY VISUAL CARDS GRID */}
      {!selectedSub && (
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {SUB_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedSub(cat.id);
                setSleeve('all');
              }}
              className="relative group cursor-pointer overflow-hidden rounded-xl border border-neutral-800 bg-[#161616] aspect-3/4 flex flex-col justify-end p-3 transition hover:border-neutral-500"
            >
              <img
                src={cat.image}
                alt={cat.label}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition duration-300 opacity-80"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />

              <div className="relative z-10 bg-neutral-800/90 backdrop-blur-sm rounded-lg py-2 px-2 text-center border border-neutral-700/50">
                <span className="text-xs md:text-sm font-mono font-bold tracking-wider uppercase text-white block truncate">
                  {cat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. OPTIONAL SLEEVE FILTER */}
      {showSleeveFilter && (
        <div className="mx-auto max-w-7xl mb-6 flex items-center justify-between border-b border-neutral-800 pb-4">
          <button
            onClick={() => setSelectedSub(null)}
            className="text-xs font-mono text-neutral-400 hover:text-white uppercase tracking-wider"
          >
            ← View All Categories
          </button>
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
      )}

      {/* 3. PRODUCT GRID */}
      {selectedSub && (
        <ProductCategory
          title=""
          products={filteredProducts}
          loading={loading}
          error={error}
          {...props}
        />
      )}
    </div>
  );
};

export default Upperwear;