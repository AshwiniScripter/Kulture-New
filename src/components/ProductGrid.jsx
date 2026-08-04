import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import { cartLineKey } from '../utils/productUtils';

const ProductGrid = ({ 
  cartItems, 
  setCartItems, 
  wishlistedIds, 
  setWishlistedIds, 
  onProductClick
}) => {
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();
  const [wishlistAlert, setWishlistAlert] = useState(null);
  const [cartAlert, setCartAlert] = useState(null);

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
      const newItem = { ...product, size: product.sizeNames?.[0] || product.size || 'One Size', quantity: 1 };
      const existingItem = prevItems.find((item) => cartLineKey(item) === cartLineKey(newItem));
      if (existingItem) {
        return prevItems.map((item) =>
          cartLineKey(item) === cartLineKey(newItem) ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, newItem];
    });

    setCartAlert(product.title);
    setTimeout(() => setCartAlert(null), 2500);
  };

  return (
    <section className="bg-[#0f0f0f] text-white pt-2 pb-12 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Toast Overlay Stack */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        {wishlistAlert && (
          <div className={`bg-black/90 backdrop-blur-md border rounded-xl p-4 shadow-2xl flex items-center gap-3 transition-all duration-300 ${
            wishlistAlert.status === 'added' ? 'border-red-600/50' : 'border-neutral-800'
          }`}>
            <div className={`p-2 rounded-lg ${wishlistAlert.status === 'added' ? 'bg-red-600/20' : 'bg-neutral-800'}`}>
              <svg className={`w-5 h-5 ${wishlistAlert.status === 'added' ? 'text-neutral-300 fill-current' : 'text-neutral-400'}`} viewBox="0 0 24 24" fill={wishlistAlert.status === 'added' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
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
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-neutral-400 uppercase tracking-wider font-mono">Cart Updated</p>
              <p className="text-sm font-bold text-white truncate">{cartAlert} added!</p>
            </div>
          </div>
        )}
      </div>

      {/* Grid Container */}
      <div className="max-w-7xl w-full mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="w-10 h-10 text-neutral-700 mb-4 animate-spin" fill="none" viewBox="0 0 24 24"><path className="opacity-25" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
            <p className="text-sm font-mono font-bold tracking-wider text-neutral-500 uppercase">Loading products...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-sm font-mono font-bold tracking-wider text-red-500 uppercase">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="w-12 h-12 text-neutral-700 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
            <p className="text-sm font-mono font-bold tracking-wider text-neutral-500 uppercase">No products available yet</p>
          </div>
        ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 auto-rows-max">
          {products.map((product, index) => {
            const isWishlisted = wishlistedIds.includes(product.id);

            return (
              <div 
                key={product.id} 
                onClick={() => {
                  if (onProductClick) {
                    onProductClick(product);
                  } else {
                    navigate(`/product/${product.id}`);
                  }
                }}
                data-aos="fade-up"
                data-aos-delay={(index % 6) * 100}
                className={`relative rounded-2xl md:rounded-3xl overflow-hidden group border border-neutral-900 shadow-xl bg-[#141414] cursor-pointer transition-all duration-500 ${product.gridClass}`}
              >
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full bg-[#1a1a1a]" />
                )}

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerWishlist(product);
                  }}
                  className="absolute top-3 right-3 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-black/70 transition-all z-10"
                >
                  <svg className={`w-4 h-4 transition-colors duration-300 ${isWishlisted ? 'text-neutral-300 fill-current scale-110' : 'text-white'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </button>

                <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 bg-black/40 backdrop-blur-md rounded-xl md:rounded-2xl p-3 md:p-4 flex items-center justify-between border border-white/10 shadow-lg group-hover:bg-black/60 transition-colors duration-300">
                  <div className="min-w-0 flex-1 pr-2">
                    <h3 className="text-[10px] sm:text-xs md:text-sm font-mono tracking-wider text-neutral-200 uppercase font-bold truncate">
                      {product.title}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base font-bold text-neutral-100 font-mono mt-0.5">
                      {product.price}
                    </p>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); 
                      triggerCart(product);
                    }}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition active:scale-90 shrink-0 z-10"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M12 5v14m7-7H5"/>
                    </svg>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;