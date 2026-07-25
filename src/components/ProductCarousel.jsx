import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProductCarousel = ({
  products = [],
  title = "",
  wishlistedIds = [],
  onWishlistToggle,
  onAddToCart,
  className = "",
  cardWidth = "w-64 sm:w-72 md:w-80",
  cardHeight = "h-72 sm:h-80 md:h-96",
}) => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.7;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section ref={sectionRef} className={`relative py-6 ${className}`}>
      {/* Title + Nav Arrows */}
      {title && (
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 mb-5 max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-lg sm:text-xl md:text-2xl font-black tracking-[0.2em] uppercase text-white"
          >
            {title}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="flex gap-2"
          >
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-neutral-800 bg-[#111] hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-neutral-800 bg-[#111] hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        </div>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 sm:px-6 lg:px-8 pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product, idx) => (
          <CarouselCard
            key={product.id}
            product={product}
            index={idx}
            isInView={isInView}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            isWishlisted={wishlistedIds.includes(product.id)}
            onWishlistToggle={onWishlistToggle}
            onAddToCart={onAddToCart}
            onClick={() => navigate(`/product/${product.id}`)}
          />
        ))}
      </div>

      {/* Fade edges */}
      <div className="pointer-events-none absolute top-0 left-0 w-8 h-full bg-linear-to-r from-[#0f0f0f] to-transparent z-10" />
      <div className="pointer-events-none absolute top-0 right-0 w-8 h-full bg-linear-to-l from-[#0f0f0f] to-transparent z-10" />
    </section>
  );
};

function CarouselCard({
  product,
  index,
  isInView,
  cardWidth,
  cardHeight,
  isWishlisted,
  onWishlistToggle,
  onAddToCart,
  onClick,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onClick={onClick}
      className={`snap-start shrink-0 ${cardWidth} relative rounded-2xl overflow-hidden group border border-neutral-900 bg-[#141414] cursor-pointer ${cardHeight}`}
    >
      {/* Image with smooth zoom */}
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
      />

      {/* Hover gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-50 group-hover:opacity-90 transition-opacity duration-500" />

      {/* Wishlist */}
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          onWishlistToggle?.(product);
        }}
        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-black/70 transition-all z-10 cursor-pointer"
      >
        <svg
          className={`w-4 h-4 transition-colors duration-300 ${
            isWishlisted ? "text-red-500 fill-current" : "text-white"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </motion.button>

      {/* Bottom info */}
      <div className="absolute bottom-3 left-3 right-3 bg-black/50 backdrop-blur-md rounded-xl p-3 flex items-center justify-between border border-white/10 group-hover:bg-black/70 transition-colors duration-300 z-10">
        <div className="min-w-0 flex-1 pr-2">
          <h3 className="text-[10px] sm:text-xs font-mono tracking-wider text-neutral-200 uppercase font-bold truncate">
            {product.title}
          </h3>
          <p className="text-xs sm:text-sm font-bold text-neutral-100 font-mono mt-0.5">
            {product.price}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.(product);
          }}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition shrink-0 z-10 cursor-pointer"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M12 5v14m7-7H5" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}

export default ProductCarousel;
