import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import hero from "../assets/hero.png";

const Hero = () => {
  const sectionRef = useRef(null);
  const [titleVisible, setTitleVisible] = useState(false);
  const [titleSettled, setTitleSettled] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const titleY = useTransform(scrollYProgress, [0.55, 0.8], ["110vh", "0vh"]);
  const titleOpacity = useTransform(scrollYProgress, [0.55, 0.7], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest >= 0.55 && !titleVisible) setTitleVisible(true);
    if (latest >= 0.8 && !titleSettled) setTitleSettled(true);
  });

  return (
    <section ref={sectionRef} className="relative w-full h-[150vh]">
      {/* Sticky Pinning Wrapper */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background Image */}
        <img
          src={hero}
          alt="Hero"
          className="w-full h-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Hero Title Overlay */}
        <AnimatePresence>
          {(titleVisible || titleSettled) && (
            <motion.div
              initial={{ y: "110vh", opacity: 0 }}
              animate={
                titleSettled
                  ? { y: 0, opacity: 1 }
                  : { y: titleY, opacity: titleOpacity }
              }
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-end text-center px-4 z-10 select-none pointer-events-none pb-6 sm:pb-12"
            >
              <h1
                className="font-dripping uppercase tracking-widest leading-[0.8] text-[#8B0000] text-[20vw] sm:text-[18vw] md:text-[16vw] lg:text-[14vw]"
              >
                PAIN TO
              </h1>
              <h1
                className="font-dripping uppercase tracking-widest leading-[0.8] text-[#8B0000] text-[20vw] sm:text-[18vw] md:text-[16vw] lg:text-[14vw]"
              >
                PURPOSE
              </h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Hero;