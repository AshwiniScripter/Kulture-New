import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const COLOR_HEX_MAP = {
  Black: '#111111',
  White: '#f5f5f5',
  Red: '#dc2626',
  Green: '#166534',
  Blue: '#1d4ed8',
  Brown: '#78350f',
  Silver: '#9ca3af',
};

const ProductCategory = ({ 
  title, 
  products = [], 
  loading = false, 
  error = null,
  onRetry = null,
  cartItems = [], 
  setCartItems, 
  wishlistedIds = [], 
  setWishlistedIds,
  filterOpen: externalFilterOpen,
  setFilterOpen: externalSetFilterOpen,
  onFilterCountChange = null
}) => {
  const navigate = useNavigate();
  const [wishlistAlert, setWishlistAlert] = useState(null);
  const [cartAlert, setCartAlert] = useState(null);
  const [internalFilterOpen, setInternalFilterOpen] = useState(false);

  const isControlled =
    externalFilterOpen !== undefined && externalSetFilterOpen !== undefined;
  const filterOpen = isControlled ? externalFilterOpen : internalFilterOpen;
  const setFilterOpen = isControlled
    ? externalSetFilterOpen
    : setInternalFilterOpen;

  const [sortBy, setSortBy] = useState('featured');
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  useEffect(() => { 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }, []);

  const availableColors = useMemo(() => {
    const colorSet = new Set();
    products.forEach(p => (p.colors || []).forEach(c => colorSet.add(c)));
    return Array.from(colorSet);
  }, [products]);

  const availableSizes = useMemo(() => {
    const sizeSet = new Set();
    products.forEach(p => (p.sizes || []).forEach(s => sizeSet.add(s)));
    return Array.from(sizeSet);
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedColors.length > 0) {
      result = result.filter(p => 
        p.colors && p.colors.some(c => selectedColors.includes(c))
      );
    }

    if (selectedSizes.length > 0) {
      result = result.filter(p => 
        p.sizes && p.sizes.some(s => selectedSizes.includes(s))
      );
    }

    if (priceMin !== '') {
      result = result.filter(p => (p.priceNum || 0) >= Number(priceMin));
    }
    if (priceMax !== '') {
      result = result.filter(p => (p.priceNum || 0) <= Number(priceMax));
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.priceNum || 0) - (b.priceNum || 0));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.priceNum || 0) - (a.priceNum || 0));
    } else if (sortBy === 'name-az') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return result;
  }, [products, selectedColors, selectedSizes, priceMin, priceMax, sortBy]);

  const activeFilterCount = 
    selectedColors.length + 
    selectedSizes.length + 
    (priceMin !== '' ? 1 : 0) + 
    (priceMax !== '' ? 1 : 0);

  useEffect(() => {
    if (onFilterCountChange) onFilterCountChange(activeFilterCount);
  }, [activeFilterCount, onFilterCountChange]);

  const resetFilters = () => {
    setSortBy('featured');
    setSelectedColors([]);
    setSelectedSizes([]);
    setPriceMin('');
    setPriceMax('');
  };

  const toggleColor = (color) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const triggerWishlist = (product) => {
    const isAlreadyWishlisted = wishlistedIds.includes(product.id);
    if (isAlreadyWishlisted) {
      setWishlistAlert({ title: product.title, status: 'removed' });
      setWishlistedIds(prev => prev.filter((id) => id !== product.id));
    } else {
      setWishlistAlert({ title: product.title, status: 'added' });
      setWishlistedIds(prev => [...prev, product.id]);
    }
    setTimeout(() => setWishlistAlert(null), 2500);
  };

  const triggerCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    setCartAlert(product.title);
    setTimeout(() => setCartAlert(null), 2500);
  };

  return (
    <div className="bg-[#0f0f0f] pt-24 pb-24 text-white">
      {/* Toast Overlay Stack */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        {wishlistAlert && (
          <div className={`bg-black/90 backdrop-blur-md border rounded-xl p-4 shadow-2xl flex items-center gap-3 transition-all duration-300 ${wishlistAlert.status === 'added' ? 'border-red-600/50' : 'border-neutral-800'}`}>
            <div className={`p-2 rounded-lg ${wishlistAlert.status === 'added' ? 'bg-red-600/20' : 'bg-neutral-800'}`}>
              <svg className={`w-5 h-5 ${wishlistAlert.status === 'added' ? 'text-neutral-300 fill-current' : 'text-neutral-400'}`} viewBox="0 0 24 24" fill={wishlistAlert.status === 'added' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-neutral-400 uppercase tracking-wider font-mono">Wishlist</p>
              <p className="text-sm font-bold text-white truncate">{wishlistAlert.title} {wishlistAlert.status}!</p>
            </div>
          </div>
        )}
        {cartAlert && (
          <div className="bg-neutral-900/90 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-2xl flex items-center gap-3 transition-all duration-300">
            <div className="bg-white/10 p-2 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-neutral-400 uppercase tracking-wider font-mono">Cart Updated</p>
              <p className="text-sm font-bold text-white truncate">{cartAlert} added!</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation & Title Header Container (ONLY renders when title is provided) */}
      {title && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="flex items-center gap-3 mb-3">
            {/* BACK BUTTON */}
            <button 
              onClick={() => navigate(-1)}
              className="bg-black/80 border border-neutral-900 p-3 rounded-xl hover:bg-neutral-900 text-neutral-300 transition duration-300 cursor-pointer active:scale-95 shrink-0 flex items-center justify-center w-12 h-12"
              aria-label="Back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            </button>

            {/* TITLE BANNER */}
            <div className="flex-1 bg-black border border-neutral-900/60 rounded-xl py-3 px-6 flex items-center justify-center shadow-xl min-h-48px">
              <h1 className="text-neutral-300 text-lg sm:text-2xl font-black tracking-widest uppercase text-center">
                {title}
              </h1>
            </div>

            {/* FILTERS BUTTON (Right of title) */}
            <button 
              onClick={() => setFilterOpen(!filterOpen)}
              className={`bg-black/80 border px-4 h-12 rounded-xl transition duration-300 cursor-pointer active:scale-95 relative shrink-0 flex items-center gap-2 text-xs font-mono ${filterOpen ? 'border-red-600 text-white' : 'border-neutral-900 hover:bg-neutral-900 text-neutral-300'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M3 12h18M3 20h18M7 2v4M17 10v4M11 18v4" /></svg>
              <span>FILTERS</span>
              {activeFilterCount > 0 && (
                <span className="ml-1 w-5 h-5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Filter Panel */}
      {filterOpen && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-[#141414] border border-neutral-900 rounded-2xl p-5 md:p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-mono font-black tracking-widest text-white uppercase">Filters</h2>
              <div className="flex items-center gap-3">
                {activeFilterCount > 0 && (
                  <button onClick={resetFilters} className="text-[10px] font-mono font-bold tracking-wider text-neutral-500 hover:text-neutral-300 transition uppercase cursor-pointer">
                    Clear All
                  </button>
                )}
                <button onClick={() => setFilterOpen(false)} className="text-neutral-500 hover:text-white transition cursor-pointer">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Sort By */}
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2 block">Sort By</span>
                <div className="flex flex-col gap-1.5">
                  {[
                    { value: 'featured', label: 'Featured' },
                    { value: 'price-low', label: 'Price: Low to High' },
                    { value: 'price-high', label: 'Price: High to Low' },
                    { value: 'name-az', label: 'Name: A - Z' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value)}
                      className={`text-left text-xs font-mono px-3 py-2 rounded-lg border transition cursor-pointer ${
                        sortBy === opt.value 
                          ? 'border-red-600 bg-red-600/10 text-neutral-300' 
                          : 'border-neutral-800 text-neutral-400 hover:border-neutral-600'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2 block">Color</span>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map(color => (
                    <button
                      key={color}
                      onClick={() => toggleColor(color)}
                      className={`flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-full border transition cursor-pointer ${
                        selectedColors.includes(color)
                          ? 'border-red-600 bg-red-600/10 text-neutral-300'
                          : 'border-neutral-800 text-neutral-400 hover:border-neutral-600'
                      }`}
                    >
                      <span 
                        className="w-3 h-3 rounded-full border border-neutral-600 shrink-0" 
                        style={{ backgroundColor: COLOR_HEX_MAP[color] || '#888' }}
                      />
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Filter */}
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2 block">Size</span>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`text-[11px] font-mono font-bold px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                        selectedSizes.includes(size)
                          ? 'border-red-600 bg-red-600/10 text-neutral-300'
                          : 'border-neutral-800 text-neutral-400 hover:border-neutral-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2 block">Price Range</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="w-full bg-[#0f0f0f] border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-red-600 transition"
                  />
                  <span className="text-neutral-600 text-xs">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="w-full bg-[#0f0f0f] border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-red-600 transition"
                  />
                </div>
              </div>
            </div>

            {/* Active Filters Summary */}
            {activeFilterCount > 0 && (
              <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-500 uppercase">Active:</span>
                {selectedColors.map(c => (
                  <button key={c} onClick={() => toggleColor(c)} className="flex items-center gap-1 text-[10px] font-mono bg-red-600/10 text-neutral-300 border border-red-600/30 rounded-full px-2.5 py-1 cursor-pointer">
                    {c}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                ))}
                {selectedSizes.map(s => (
                  <button key={s} onClick={() => toggleSize(s)} className="flex items-center gap-1 text-[10px] font-mono bg-red-600/10 text-neutral-300 border border-red-600/30 rounded-full px-2.5 py-1 cursor-pointer">
                    {s}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                ))}
                {priceMin !== '' && (
                  <button onClick={() => setPriceMin('')} className="flex items-center gap-1 text-[10px] font-mono bg-red-600/10 text-neutral-300 border border-red-600/30 rounded-full px-2.5 py-1 cursor-pointer">
                    Min: ₹{priceMin}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                )}
                {priceMax !== '' && (
                  <button onClick={() => setPriceMax('')} className="flex items-center gap-1 text-[10px] font-mono bg-red-600/10 text-neutral-300 border border-red-600/30 rounded-full px-2.5 py-1 cursor-pointer">
                    Max: ₹{priceMax}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results Count */}
      {(activeFilterCount > 0 || sortBy !== 'featured') && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <p className="text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'} found
          </p>
        </div>
      )}

      {/* Grid */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl w-full mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <svg className="w-10 h-10 text-neutral-700 mb-4 animate-spin" fill="none" viewBox="0 0 24 24"><path className="opacity-25" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
              <p className="text-sm font-mono font-bold tracking-wider text-neutral-500 uppercase">Loading products...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-sm font-mono font-bold tracking-wider text-red-500 uppercase">{error}</p>
              {onRetry && (
                <button onClick={onRetry} className="mt-3 text-xs font-mono font-bold tracking-wider text-neutral-300 hover:text-neutral-400 transition uppercase cursor-pointer">
                  Try Again
                </button>
              )}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <svg className="w-12 h-12 text-neutral-700 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
              <p className="text-sm font-mono font-bold tracking-wider text-neutral-500 uppercase">No products match your filters</p>
              <button onClick={resetFilters} className="mt-3 text-xs font-mono font-bold tracking-wider text-neutral-300 hover:text-neutral-400 transition uppercase cursor-pointer">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 auto-rows-max">
              {filteredProducts.map((product, index) => {
                const isWishlisted = wishlistedIds.includes(product.id);
                return (
                  <div key={product.id} onClick={() => navigate(`/product/${product.id}`)} data-aos="fade-up" data-aos-delay={(index % 6) * 100} className={`relative rounded-2xl md:rounded-3xl overflow-hidden group border border-neutral-900 shadow-xl bg-[#141414] transition-all duration-500 cursor-pointer ${product.gridClass}`}>
                    {product.image ? (
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    ) : (
                      <div className="w-full h-full bg-[#1a1a1a]" />
                    )}
                    <button onClick={(e) => { e.stopPropagation(); triggerWishlist(product); }} className="absolute top-3 right-3 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-black/70 transition-all z-10 cursor-pointer">
                      <svg className={`w-4 h-4 transition-colors duration-300 ${isWishlisted ? 'text-neutral-300 fill-current scale-110' : 'text-white'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                    </button>
                    <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 bg-black/40 backdrop-blur-md rounded-xl md:rounded-2xl p-3 md:p-4 flex items-center justify-between border border-white/10 shadow-lg group-hover:bg-black/60 transition-colors duration-300">
                      <div className="min-w-0 flex-1 pr-2">
                        <h3 className="text-[10px] sm:text-xs md:text-sm font-mono tracking-wider text-neutral-200 uppercase font-bold truncate">{product.title}</h3>
                        <p className="text-xs sm:text-sm md:text-base font-bold text-neutral-100 font-mono mt-0.5">{product.price}</p>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); triggerCart(product); }} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition active:scale-90 shrink-0 z-10 cursor-pointer">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14m7-7H5"/></svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductCategory;