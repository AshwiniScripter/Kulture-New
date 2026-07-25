import React from "react";
import { motion } from "framer-motion";

const MobileFrameWrapper = ({
  children,
  className = "",
  showFrame = true,
  maxWidth = "max-w-[430px]",
}) => {
  return (
    <div className={`w-full flex justify-center ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`w-full ${maxWidth} relative`}
      >
        {/* Desktop frame border */}
        {showFrame && (
          <div className="hidden md:block absolute -inset-3 border-2 border-neutral-800 rounded-2rem pointer-events-none">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 translate-y-0 w-32 h-1 bg-neutral-800 rounded-b-xl" />
            {/* Corner accents */}
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-red-600 rounded-tl-md" />
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-red-600 rounded-tr-md" />
            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-red-600 rounded-bl-md" />
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-red-600 rounded-br-md" />
          </div>
        )}

        {/* Content container */}
        <div className="overflow-hidden bg-[#0a0a0a]">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default MobileFrameWrapper;
