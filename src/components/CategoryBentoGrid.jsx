import React, { useMemo } from 'react';
import { useProducts } from '../context/ProductsContext';

// Masonry-style interlocking layout. Cards flow into a CSS multi-column
// container so shorter cards pack tightly against taller ones with no empty
// vertical gaps (unlike CSS Grid rows, which stretch to the tallest item).
// Heights cycle through tall/short variants to keep the staggered look.
const STAGGER_HEIGHTS = [
  'h-72 sm:h-96', // tall
  'h-40 sm:h-56', // short
  'h-72 sm:h-96', // tall
  'h-40 sm:h-56', // short
  'h-96 sm:h-112', // extra tall
];

const Card = ({ cat, onSelect }) => (
  <div
    className={`relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-neutral-800 bg-[#121212] group transition duration-300 hover:border-neutral-600 ${cat.slot}`}
  >
    {cat.image ? (
      <img
        src={cat.image}
        alt={cat.name || cat.label}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 duration-500 ease-out transition-transform"
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
    ) : (
      <div className="w-full h-full bg-[#121212]" />
    )}

    {/* Single background watermark text (only when no image to avoid duplicates) */}
    {!cat.image && (
      <div className="select-none pointer-events-none absolute inset-0 flex items-center justify-center text-neutral-800/30 font-bold uppercase tracking-[0.3em] text-lg sm:text-xl">
        <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[90%]">
          {cat.name || cat.label || ''}
        </span>
      </div>
    )}

    <div className="absolute bottom-2 sm:bottom-5 left-2 sm:left-5 right-2 sm:right-5 bg-black/40 backdrop-blur-md rounded-lg sm:rounded-xl border border-white/10 shadow-2xl p-0 overflow-hidden">
      <button
        type="button"
        onClick={() => onSelect && onSelect(cat)}
        className="w-full text-center text-neutral-300 text-xs sm:text-xl lg:text-2xl font-black tracking-wider py-2 sm:py-4 transition-colors duration-300 hover:text-white hover:bg-white/5 cursor-pointer block uppercase"
      >
        {cat.name || cat.label}
        <span className="block text-[10px] sm:text-xs font-mono text-neutral-400 font-normal tracking-normal lowercase mt-0.5">
          {cat.count === 1 ? '1 item' : `${cat.count || 0} items`}
        </span>
      </button>
    </div>
  </div>
);

const CategoryBentoGrid = ({ category, items = [], onSelect }) => {
  const { getByCategory } = useProducts();

  const tiles = useMemo(
    () =>
      items.map((item, index) => ({
        ...item,
        name: item.label,
        count: getByCategory(category, item.id).length,
        slot: STAGGER_HEIGHTS[index % STAGGER_HEIGHTS.length],
      })),
    [items, category, getByCategory]
  );

  return (
    <div className="mx-auto max-w-7xl columns-2 gap-3 sm:gap-6 space-y-3 sm:space-y-6 w-full mb-8">
      {tiles.map((tile) => (
        <div key={tile.id} className="break-inside-avoid">
          <Card cat={tile} onSelect={onSelect} />
        </div>
      ))}
    </div>
  );
};

export default CategoryBentoGrid;