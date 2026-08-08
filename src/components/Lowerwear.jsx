import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCategory from './ProductCategory';
import CategoryBentoGrid from './CategoryBentoGrid';
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
  {
    id: 'bottom-innerwear',
    label: 'BOTTOM INNERWEAR',
    image: categoryImage('bottom-innerwear.svg'),
  },
];

const Lowerwear = (props) => {
  const navigate = useNavigate();
  const { getByCategory, fetchByCategory, loading, error } = useProducts();
  const [selectedSub, setSelectedSub] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterCount, setFilterCount] = useState(0);

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

        {/* Filter Button (Right of category name) */}
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          aria-label="Filters"
          className={`relative w-12 h-12 bg-[#121212] border rounded-xl flex items-center justify-center hover:bg-neutral-800 transition shrink-0 cursor-pointer ${
            filterOpen ? 'border-red-600 text-white' : 'border-neutral-800/80 text-white'
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4h18M3 12h18M3 20h18M7 2v4M17 10v4M11 18v4"
            />
          </svg>
          {filterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {filterCount}
            </span>
          )}
        </button>
      </div>

      {/* 1. SUBCATEGORY VISUAL CARDS GRID (Asymmetric, grid home categories grid style) */}
      {!selectedSub && (
        <CategoryBentoGrid
          category={CATEGORY}
          items={SUB_CATEGORIES}
          onSelect={(cat) => {
            setSelectedSub(cat.id);
            fetchByCategory(CATEGORY, cat.id);
          }}
        />
      )}

      {/* 2. PRODUCT GRID */}
      <ProductCategory
        title=""
        products={products}
        loading={loading}
        error={error}
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        onFilterCountChange={setFilterCount}
        {...props}
      />
    </div>
  );
};

export default Lowerwear;