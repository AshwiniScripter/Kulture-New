import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import tshirt from "../assets/Category/tshirt.png";
import shoes from "../assets/Category/shoes.png";
import pants from "../assets/Category/pants.png";
import accessories from "../assets/Category/accessories.png";
import ProductGrid from './ProductGrid';

const ProductDetail = ({ 
  cartItems, 
  setCartItems, 
  wishlistedIds, 
  setWishlistedIds 
}) => {
  const navigate = useNavigate(); 
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-[#0f0f0f] pt-20 sm:pt-24 pb-24">

      {/* Embedded Categories Component Wrapper */}
      <section className="bg-[#0f0f0f] pt-6 pb-2 sm:pt-10 sm:pb-4 px-2 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-7xl w-full mx-auto flex flex-col gap-4 sm:gap-6">
      
          {/* Heading */}
          <div className="bg-black rounded-xl py-3 sm:py-6 shadow-xl border border-neutral-900/50" data-aos="fade-up">
            <h1 className="text-center text-neutral-300 text-2xl sm:text-5xl lg:text-6xl font-black tracking-widest uppercase selection:bg-neutral-700 selection:text-white">
              CATEGORY
            </h1>
          </div>
      
          {/* Main Grid Layout - Enforced 3-Column layout across ALL screens */}
          <div className="grid grid-cols-3 gap-2 sm:gap-6 items-stretch">
      
            {/* LEFT COLUMN (Upper Ware & Accessories) */}
            <div className="col-span-2 flex flex-col gap-2 sm:gap-6">
      
              {/* Tshirt Card */}
              <div 
                onClick={() => navigate('/upperwear')} 
                className="relative h-48 sm:h-112.5 lg:h-125 rounded-xl sm:rounded-2xl overflow-hidden group border border-neutral-900 shadow-lg cursor-pointer"
                data-aos="fade-up" data-aos-delay="100"
              >
                <img
                  src={tshirt}
                  alt="T-Shirts"
                  className="w-full h-full object-cover group-hover:scale-105 duration-500 ease-out transition-transform"
                />
                <div className="absolute bottom-2 sm:bottom-5 left-2 sm:left-5 right-2 sm:right-5 bg-black/40 backdrop-blur-md rounded-lg sm:rounded-xl py-1.5 sm:py-4 border border-white/10 shadow-2xl">
                  <h2 className="text-center text-neutral-300 text-xs sm:text-4xl lg:text-5xl font-black tracking-wider transition-colors duration-300 group-hover:text-neutral-400">
                    UPPER WARE
                  </h2>
                </div>
              </div>
      
              {/* Accessories Card */}
              <div 
                onClick={() => navigate('/accessories')} 
                className="relative h-28 sm:h-64 lg:h-72 rounded-xl sm:rounded-2xl overflow-hidden group border border-neutral-900 shadow-lg cursor-pointer"
                data-aos="fade-up" data-aos-delay="200"
              >
                <img
                  src={accessories}
                  alt="Accessories"
                  className="w-full h-full object-cover group-hover:scale-105 duration-500 transition-transform"
                />
                <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 bg-black/50 backdrop-blur-md rounded-lg sm:rounded-xl py-1 sm:py-3 border border-white/10 shadow-lg">
                  <p className="text-center text-neutral-300 text-[10px] sm:text-lg lg:text-xl font-black tracking-widest uppercase">
                    ACCESSORIES
                  </p>
                </div>
              </div>
      
            </div>
      
            {/* RIGHT COLUMN (Shoes & Lower Ware) */}
            <div className="flex flex-col gap-2 sm:gap-6">
      
              {/* Shoes Card */}
              <div 
                onClick={() => navigate('/shoes')} 
                className="relative h-28 sm:h-60 lg:h-64 rounded-xl overflow-hidden group border border-neutral-900 shadow-lg cursor-pointer"
                data-aos="fade-up" data-aos-delay="300"
              >
                <img
                  src={shoes}
                  alt="Shoes"
                  className="w-full h-full object-cover group-hover:scale-105 duration-500 transition-transform"
                />
                <div className="absolute bottom-1.5 sm:bottom-3 left-1.5 sm:left-3 right-1.5 sm:right-3 bg-black/40 backdrop-blur-sm rounded-md sm:rounded-lg py-1 sm:py-2.5 border border-white/5">
                  <h3 className="text-center text-neutral-300 text-[10px] sm:text-lg lg:text-xl font-black tracking-widest">
                    SHOES
                  </h3>
                </div>
              </div>
      
              {/* Lower Ware / Pants Card */}
              <div 
                onClick={() => navigate('/pants')} 
                className="relative flex-1 min-h-120px sm:min-h-87.5 lg:min-h-0 rounded-xl sm:rounded-2xl overflow-hidden group border border-neutral-900 shadow-lg cursor-pointer"
                data-aos="fade-up" data-aos-delay="400"
              >
                <img
                  src={pants}
                  alt="Pants"
                  className="w-full h-full object-cover group-hover:scale-105 duration-500 transition-transform"
                />
                <div className="absolute bottom-2 sm:bottom-5 left-2 sm:left-5 right-2 sm:right-5 bg-black/40 backdrop-blur-md rounded-lg sm:rounded-xl py-1.5 sm:py-3 border border-white/10">
                  <h2 className="text-center text-neutral-300 text-xs sm:text-3xl lg:text-4xl font-black tracking-wider">
                    LOWER WARE
                  </h2>
                </div>
              </div>
      
            </div>
      
          </div>
      
        </div>
      </section>

      {/* ALL PRODUCTS SECTION */}
      <div className="mt-2 sm:mt-4 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="bg-black rounded-xl py-4 sm:py-6 shadow-xl border border-neutral-900/50" data-aos="fade-up">
          <h1 className="text-center text-neutral-300 text-3xl sm:text-5xl lg:text-6xl font-black tracking-widest uppercase selection:bg-neutral-700 selection:text-white">
            ALL PRODUCTS
          </h1>
        </div>
      </div>

      <ProductGrid
        cartItems={cartItems}
        setCartItems={setCartItems}
        wishlistedIds={wishlistedIds}
        setWishlistedIds={setWishlistedIds}
      />
    </div>
  );
};

export default ProductDetail;