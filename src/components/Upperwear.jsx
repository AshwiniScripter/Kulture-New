import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCategory from './ProductCategory';
import CategoryBentoGrid from './CategoryBentoGrid';
import { useProducts } from '../context/ProductsContext';

const CATEGORY = 'upperwear';

const categoryImage = (file) => import.meta.env.BASE_URL + 'images/categories/' + file;

const SUB_CATEGORIES = [
  {
    id: 'jackets',
    label: 'JACKETS',
    keywords: ['jacket'],
    image: categoryImage('jackets.svg'),
  },
  {
    id: 'sweatshirts',
    label: 'SWEATSHIRTS',
    keywords: ['sweatshirt', 'sweater'],
    image: categoryImage('sweatshirts.svg'),
  },
  {
    id: 'hoodies',
    label: 'HOODIES',
    keywords: ['hoodie'],
    image: categoryImage('hoodies.svg'),
  },
  {
    id: 'tanks',
    label: 'TANKS',
    keywords: ['tank'],
    image: categoryImage('tanks.svg'),
  },
  {
    id: 'shirts',
    label: 'SHIRTS',
    keywords: ['shirt'],
    image: categoryImage('shirts.svg'),
  },
  {
    id: 'tshirts',
    label: 'T-SHIRTS',
    keywords: ['t-shirt', 'tshirt', 't shirt'],
    image: categoryImage('tshirts.svg'),
  },
  {
    id: 'top-innerwear',
    label: 'TOP INNERWEAR',
    keywords: ['innerwear', 'inner', 'undershirt', 'thermal'],
    image: categoryImage('top-innerwear.svg'),
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
  const { getByCategory, fetchByCategory, loading, error, products } = useProducts();
  const [selectedSub, setSelectedSub] = useState(null);
  const [sleeve, setSleeve] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterCount, setFilterCount] = useState(0);

  useEffect(() => {
    fetchByCategory(CATEGORY);
  }, [fetchByCategory]);

  const showSleeveFilter = selectedSub && CARRIES_SLEEVE_FILTER.includes(selectedSub);
  const activeSubObj = SUB_CATEGORIES.find((s) => s.id === selectedSub);

  const filteredProducts = useMemo(() => {
    const base = selectedSub ? getByCategory(CATEGORY, selectedSub) : getByCategory(CATEGORY);

    if (selectedSub && showSleeveFilter && sleeve !== 'all') {
      const sleeveTarget = SLEEVE_BUTTONS.find((s) => s.id === sleeve);
      return base.filter((p) => {
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

    return base;
  }, [products, selectedSub, showSleeveFilter, sleeve, getByCategory]);

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

        {/* Header Title Box with Larger Font */}
        <div className="bg-[#121212] border border-neutral-800/80 rounded-xl py-3 px-6 flex-1 text-center">
          <h1 className="text-lg md:text-2xl font-black tracking-widest uppercase text-white">
            {selectedSub ? activeSubObj?.label : 'UPPERWEAR'}
          </h1>
        </div>

        {/* Filter Button (Right of category name) */}
        {selectedSub && (
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
        )}
      </div>

      {/* 1. SUBCATEGORY VISUAL CARDS GRID (Asymmetric, mirrors home categories grid) */}
      {!selectedSub && (
        <CategoryBentoGrid
          category={CATEGORY}
          items={SUB_CATEGORIES}
          onSelect={(cat) => {
            setSelectedSub(cat.id);
            setSleeve('all');
            fetchByCategory(CATEGORY, cat.id);
          }}
        />
      )}

      {/* 2. OPTIONAL SLEEVE FILTER */}
      {showSleeveFilter && (
        <div className="mx-auto max-w-7xl mb-6 flex items-center justify-between border-b border-neutral-800 pb-4">
          <button
            onClick={() => {
              setSelectedSub(null);
              setSleeve('all');
              fetchByCategory(CATEGORY);
            }}
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
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          onFilterCountChange={setFilterCount}
          {...props}
        />
      )}
    </div>
  );
};

export default Upperwear;