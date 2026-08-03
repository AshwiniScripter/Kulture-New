import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCategory from './ProductCategory';
import { useProducts } from '../context/ProductsContext';

const CATEGORY = 'lowerwear';

// Helper for dynamic SVG imports matching Upperwear style
const categoryImage = (file) => import.meta.env.BASE_URL + 'images/categories/' + file;

const SUB_CATEGORIES = [
  {
    id: 'jeans',
    label: 'JEANS',
    image: categoryImage('jeans.svg'),
  },
  {
    id: 'sweatpants',
    label: 'SWEATPANTS',
    image: categoryImage('sweatpants.svg'),
  },
  {
    id: 'jorts',
    label: 'JORTS',
    image: categoryImage('jorts.svg'),
  },
  {
    id: 'liner-pants',
    label: 'LINER PANTS',
    image: categoryImage('liner-pants.svg'),
  },
];

const Lowerwear = (props) => {
  const navigate = useNavigate();
  const { getByCategory, fetchByCategory, loading, error } = useProducts();
  const [selectedSub, setSelectedSub] = useState(null);

  useEffect(() => {
    fetchByCategory(CATEGORY);
  }, [fetchByCategory]);

  const activeSubObj = SUB_CATEGORIES.find((s) => s.id === selectedSub);

  const products = selectedSub ? getByCategory(CATEGORY, selectedSub) : getByCategory(CATEGORY);

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white px-3 md:px-6 pt-28 md:pt-32 pb-12">
      {/* Header Bar */}
      <div className="mx-auto max-w-7xl mb-8 flex items-center gap-3">
        {/* Square Back Button */}
        <button
          onClick={() => {
            if (selectedSub) {
              setSelectedSub(null);
              fetchByCategory(CATEGORY);
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

        {/* Dynamic Header Title Box */}
        <div className="bg-[#121212] border border-neutral-800/80 rounded-xl py-3 px-6 flex-1 text-center">
          <h1 className="text-lg md:text-2xl font-black tracking-widest uppercase text-white">
            {selectedSub ? activeSubObj?.label : 'LOWERWEAR'}
          </h1>
        </div>
      </div>

      {/* 1. SUBCATEGORY VISUAL CARDS GRID (Visible when no subcategory selected) */}
      {!selectedSub && (
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {SUB_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedSub(cat.id);
                fetchByCategory(CATEGORY, cat.id);
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

      {/* 2. PRODUCT GRID */}
      <ProductCategory title="" products={products} loading={loading} error={error} {...props} />
    </div>
  );
};

export default Lowerwear;