import React from "react";
import hero from "../assets/hero.png";

const Hero = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden" data-aos="fade-up">
      {/* Background Image */}
      <img
        src={hero}
        alt="Hero"
        className="w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Hero Title Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10 select-none">
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
      </div>
    </section>
  );
};

export default Hero;