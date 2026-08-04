import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoHeart, IoBagOutline } from 'react-icons/io5';
import { useProducts } from '../context/ProductsContext';
import { cartLineKey } from '../utils/productUtils';

const Wishlist = ({ wishlistedIds = [], setWishlistedIds, cartItems = [], setCartItems }) => {
  const navigate = useNavigate();
  const { getById } = useProducts();

  const wishlistedProducts = wishlistedIds
    .map((item) => {
      if (typeof item === 'object' && item !== null) return item;
      return getById(item);
    })
    .filter(Boolean);

  const removeFromWishlist = (idToRemove) => {
    setWishlistedIds(wishlistedIds.filter(item => {
      const id = typeof item === 'object' ? item.id : item;
      return String(id) !== String(idToRemove);
    }));
  };

  const buildCartItem = (product) => ({
    id: product.id,
    title: product.title,
    price: typeof product.price === 'number' ? `₹${product.price.toLocaleString('en-IN')}` : product.price,
    priceNum: product.priceNum || product.finalPrice,
    image: product.image,
    color: product.colors?.[0] || 'Black',
    size: product.sizeNames?.[0] || product.size || 'One Size',
    quantity: 1
  });

  const mergeIntoCart = (nextItems) => {
    setCartItems((prev) => {
      const merged = [...prev];
      nextItems.forEach((newItem) => {
        const idx = merged.findIndex((item) => cartLineKey(item) === cartLineKey(newItem));
        if (idx >= 0) {
          merged[idx] = { ...merged[idx], quantity: merged[idx].quantity + newItem.quantity };
        } else {
          merged.push(newItem);
        }
      });
      return merged;
    });
  };

  const handleAddToCart = (product) => {
    const cartProduct = buildCartItem(product);
    mergeIntoCart([cartProduct]);
    removeFromWishlist(product.id);
  };

  const handleAddAllToCart = () => {
    const newItems = wishlistedProducts.map(buildCartItem);
    mergeIntoCart(newItems);
    setWishlistedIds([]);
  };

  const totalSum = wishlistedProducts.reduce(
    (sum, item) => sum + (item.priceNum || item.finalPrice || Number(item.price?.replace?.(/[^\d.]/g, '')) || 1999),
    0
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-neutral-400 font-mono selection:bg-neutral-800 flex flex-col pt-24 pb-8 px-4 sm:px-8 md:px-12">
      
      {/* 1. Section Title */}
      <div className="w-full text-center py-6 mb-2 max-w-6xl mx-auto">
        <h1 className="text-base sm:text-xl font-black tracking-[0.3em] text-neutral-300 uppercase">
          WISHLIST
        </h1>
      </div>

      {/* 2. Main Grid Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto mb-8">
        {wishlistedProducts.length === 0 ? (
          <div className="w-full min-h-300px flex flex-col items-center justify-center border border-dashed border-[#171717] rounded-xl bg-[#0a0a0a]/30 p-8">
            <p className="text-neutral-600 mb-4 uppercase tracking-[0.15em] text-xs">YOUR WISHLIST IS EMPTY</p>
            <button 
              onClick={() => navigate('/')} 
              className="px-6 py-2.5 bg-white text-black font-bold text-xs tracking-widest uppercase rounded hover:bg-neutral-200 transition"
            >
              EXPLORE SHOP
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistedProducts.map((product, idx) => {
              const currentId = product.id;
              return (
                <div key={currentId} data-aos="fade-up" data-aos-delay={idx * 100} className="flex gap-4 items-stretch w-full border border-[#141414] bg-[#0a0a0a] rounded-xl p-3 sm:p-4 hover:border-[#222] transition">
                  
                  {/* Product Image Box */}
                  <div className="w-[45%] sm:w-[50%] relative bg-[#0e0e0e] border border-[#161616] rounded-xl overflow-hidden aspect-square shrink-0">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.title} 
                        className="w-full h-full object-cover opacity-90" 
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1a1a1a]" />
                    )}
                    {idx === 0 && (
                      <span className="absolute top-2 left-2 text-[8px] sm:text-[9px] font-sans font-extrabold text-black bg-white px-1.5 py-0.5 rounded tracking-wide">
                        NEW
                      </span>
                    )}
                    <button 
                      onClick={() => removeFromWishlist(currentId)} 
                      className="absolute top-2 right-2 bg-black/60 backdrop-blur-md p-1.5 sm:p-2 rounded-full text-neutral-400 transition hover:scale-105"
                    >
                      <IoHeart className="text-xs sm:text-sm text-red-500" />
                    </button>
                  </div>

                  {/* Product Context */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex flex-col justify-center flex-1">
                      <h3 className="text-neutral-300 text-xs font-bold tracking-wider uppercase truncate">
                        {product.title}
                      </h3>
                      <p className="text-[10px] text-neutral-600 tracking-wide mt-0.5">
                        {product.colors?.[0] || 'Black'} . {product.sizeNames?.[0] || 'One Size'}
                      </p>
                      <p className="text-neutral-300 font-bold text-sm sm:text-base mt-2 tracking-wide">
                        {typeof product.price === 'number' ? `₹${product.price.toLocaleString('en-IN')}` : product.price}
                      </p>
                      {product.discount > 0 && (
                        <p className="text-[10px] text-neutral-500 tracking-wider mt-0.5">
                          {product.discount}% OFF
                        </p>
                      )}
                    </div>

                    <button 
                      onClick={() => handleAddToCart(product)} 
                      className="mt-3 w-full h-9 sm:h-11 border border-[#1a1a1a] bg-[#070707] hover:bg-[#121212] rounded-lg flex items-center justify-center gap-2 text-[10px] sm:text-xs font-bold tracking-[0.15em] text-neutral-300 uppercase transition duration-150"
                    >
                      <IoBagOutline className="text-xs sm:text-base" /> CART
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 3. Sticky Action Bar (Sticks while scrolling, stops right before footer) */}
      {wishlistedProducts.length > 0 && (
        <div className="sticky bottom-4 mt-auto w-full max-w-6xl mx-auto z-30">
          <div className="bg-[#070707]/95 backdrop-blur-md px-4 py-3 sm:py-4 border border-[#1a1a1a] rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            
            {/* Summary Tag */}
            <div className="border border-[#141414] bg-[#090909] rounded-xl p-3 flex-1 sm:flex-initial flex items-center justify-between sm:gap-12 text-xs font-bold text-neutral-300 tracking-[0.15em]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#0e0e0e] flex items-center justify-center border border-[#181818]">
                  <IoHeart className="text-xs text-neutral-400" />
                </div>
                <span>{wishlistedProducts.length} ITEMS</span>
              </div>
              <div className="flex gap-2 text-neutral-500 font-medium">
                TOTAL <span className="text-neutral-200">₹{totalSum.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Master Button */}
            <button 
              onClick={handleAddAllToCart} 
              className="w-full sm:w-auto px-8 h-12 sm:h-14 bg-white hover:bg-neutral-200 rounded-xl flex items-center justify-center gap-2.5 text-xs font-bold tracking-[0.2em] text-black uppercase transition duration-200 shadow-lg"
            >
              <IoBagOutline className="text-lg" /> ADD ALL TO CART
            </button>
            
          </div>
        </div>
      )}

    </div>
  );
};

export default Wishlist;
