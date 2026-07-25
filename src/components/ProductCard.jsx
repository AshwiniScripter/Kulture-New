import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProductCard = ({
  product,
  isWishlisted = false,
  onWishlistToggle,
  onAddToCart,
  index = 0,
  variant = "default",
  className = "",
}) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 0, 0.7]);

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    onWishlistToggle?.(product);
  };

  const handleCart = (e) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const sizeClasses = {
    default: "h-72 sm:h-80 md:h-96",
    tall: "h-[400px] sm:h-[500px] md:h-[600px]",
    wide: "col-span-2 h-56 sm:h-72 md:h-[400px]",
    compact: "h-48 sm:h-56 md:h-64",
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onClick={handleClick}
      className={`relative rounded-2xl md:rounded-3xl overflow-hidden group border border-neutral-900 shadow-xl bg-[#141414] cursor-pointer ${sizeClasses[variant] || sizeClasses.default} ${className}`}
    >
      {/* Parallax Image */}
      <motion.img
        src={product.image}
        alt={product.title}
        style={{ y: imageY }}
        className="w-full h-[120%] object-cover absolute top-[-10%] left-0 group-hover:scale-110 transition-transform duration-700 ease-out"
      />

      {/* Scroll-linked fade overlay */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-black pointer-events-none"
      />

      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

      {/* Wishlist button */}
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleWishlist}
        className="absolute top-3 right-3 w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-black/70 transition-all z-10 cursor-pointer"
      >
        <svg
          className={`w-4 h-4 transition-colors duration-300 ${
            isWishlisted ? "text-red-500 fill-current scale-110" : "text-white"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </motion.button>

      {/* Bottom info bar */}
      <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 bg-black/40 backdrop-blur-md rounded-xl md:rounded-2xl p-3 md:p-4 flex items-center justify-between border border-white/10 shadow-lg group-hover:bg-black/70 transition-colors duration-300 z-10">
        <div className="min-w-0 flex-1 pr-2">
          <h3 className="text-[10px] sm:text-xs md:text-sm font-mono tracking-wider text-neutral-200 uppercase font-bold truncate">
            {product.title}
          </h3>
          <p className="text-xs sm:text-sm md:text-base font-bold text-neutral-100 font-mono mt-0.5">
            {product.price}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          onClick={handleCart}
          className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition shrink-0 z-10 cursor-pointer"
        >
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path d="M12 5v14m7-7H5" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
