import React from "react";
import { useNavigate } from "react-router-dom";
import belt from "../assets/Category/belt.jpeg";
import bandana from "../assets/Category/bandana.jpeg";
import shades from "../assets/Category/shades.jpeg";
import watch from "../assets/Category/watch.jpeg";

const subcategories = [
  { name: "BELTS", image: belt, path: "/belts" },
  { name: "BANDANA", image: bandana, path: "/bandana" },
  { name: "SHADES", image: shades, path: "/shades" },
  { name: "WATCHES", image: watch, path: "/watches" },
];

const Accessories = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-[#0f0f0f] pt-24 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")} // Redirects to Home page
            className="bg-black/80 border border-neutral-900 p-3.5 rounded-xl hover:bg-neutral-900 text-neutral-300 transition duration-300 cursor-pointer active:scale-95 shrink-0"
            aria-label="Go back to Home"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          
          <div className="bg-black/80 border border-neutral-900 flex-1 rounded-xl py-3.5 flex justify-center items-center shadow-md">
            <h1 className="text-2xl md:text-3xl font-mono font-black tracking-widest text-neutral-300 uppercase">
              ACCESSORIES
            </h1>
          </div>
          
          {/* Spacer to keep title centered */}
          <div className="w-14 shrink-0" />
        </div>

        {/* Subcategories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {subcategories.map((sub, idx) => (
            <div
              key={sub.name}
              onClick={() => navigate(sub.path)}
              data-aos="fade-up"
              data-aos-delay={idx * 100}
              className="relative h-48 sm:h-64 lg:h-80 rounded-2xl overflow-hidden group border border-neutral-900 cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <img
                src={sub.image}
                alt={sub.name}
                className="w-full h-full object-cover group-hover:scale-105 duration-500 ease-out transition-transform"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden shadow-xl">
                <div className="w-full text-center text-neutral-300 text-sm sm:text-lg lg:text-xl font-black tracking-widest py-3">
                  {sub.name}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Accessories;