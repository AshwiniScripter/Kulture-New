import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  IoLogoInstagram, 
  IoCallOutline, 
  IoLocationOutline, 
  IoArrowForward, 
  IoChevronUpOutline,
  IoChevronDownOutline
} from 'react-icons/io5';

const STORES = [
  {
    id: 'camp',
    name: 'Camp (Flagship)',
    complex: 'Amba Complex',
    address: 'Shop No. 28, 9 MG Road, Camp, Pune, Maharashtra – 411001',
    phone: '+91 83291 37605',
    tel: '+918329137605'
  },
  {
    id: 'kothrud',
    name: 'Kothrud Store',
    complex: 'Tarangan Society',
    address: 'Shop No. 3, Paud Rd, opp. Varhadi Hotel, near Hotel Durga Cold Coffee, Ideal Colony, Kothrud, Pune, Maharashtra – 411038',
    phone: '+91 89995 25051',
    tel: '+918999525051'
  },
  {
    id: 'pcmc',
    name: 'PCMC Store',
    complex: 'Siddhivinayak Ginger',
    address: '84, Kunal Icon Rd, opp. PCMC play ground, Siddhivinayak Ginger Society, Pimple Saudagar, Pimpri-Chinchwad, Maharashtra – 411027',
    phone: '+91 86250 62218',
    tel: '+918625062218'
  },
  {
    id: 'viman-nagar',
    name: 'Viman Nagar Store',
    complex: 'Bella View Society',
    address: 'Lane No. 6, Bella view society, Besides New Airport Rd, Survey Number 235, Sanjay Park, Viman Nagar, Pune, Maharashtra – 411032',
    phone: '+91 70307 87871',
    tel: '+917030787871'
  }
];

const Footer = () => {
  const [selectedStore, setSelectedStore] = useState(STORES[0]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#080808] text-neutral-400 font-mono border-t border-[#1a1a1a] relative z-20 pt-16 pb-12 px-4 sm:px-8 md:px-16 lg:px-24">
      
      {/* 1. TOP BRANDING & SCROLL CONTROL BAR */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between border-b border-[#181818] pb-10 gap-6">
        <div>
          <span className="text-[10px] text-neutral-300 font-bold tracking-[0.3em] uppercase block mb-1">
            // OFFICIAL ARCHIVE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-widest uppercase">
            KULTURE VINTAGE
          </h2>
        </div>

        <button 
          onClick={scrollToTop}
          className="flex items-center gap-2 border border-[#222] bg-[#0d0d0d] hover:bg-neutral-900 text-white text-xs font-bold px-5 py-3 rounded-xl transition duration-200 active:scale-95 cursor-pointer"
        >
          BACK TO TOP <IoChevronUpOutline className="text-sm" />
        </button>
      </div>

      {/* 2. MAIN GRID LAYOUT */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 py-12 border-b border-[#181818]">
        
        {/* Col 1: Store Location & Info with Dropdown Select (Cols 1-5) */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-white tracking-[0.2em] uppercase border-l-2 border-red-600 pl-3">
              STORE LOCATIONS
            </h3>
            <span className="text-[10px] text-neutral-500 font-mono">
              ({STORES.length} LOCATIONS)
            </span>
          </div>

          {/* Store Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedStore.id}
              onChange={(e) => {
                const store = STORES.find((s) => s.id === e.target.value);
                if (store) setSelectedStore(store);
              }}
              className="w-full bg-[#0d0d0d] border border-[#222] text-white text-xs font-bold py-3 px-4 rounded-xl appearance-none cursor-pointer focus:outline-none focus:border-red-600 transition tracking-wider uppercase pr-10"
            >
              {STORES.map((store) => (
                <option key={store.id} value={store.id} className="bg-[#0d0d0d] text-white">
                  {store.name}
                </option>
              ))}
            </select>
            <IoChevronDownOutline className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none text-sm" />
          </div>

          {/* Address Card */}
          <div className="flex items-start gap-3 bg-[#0d0d0d] border border-[#1c1c1c] p-4 rounded-xl min-h-110px transition-all">
            <IoLocationOutline className="text-neutral-300 text-xl shrink-0 mt-0.5" />
            <div className="text-xs text-neutral-300 leading-relaxed">
              <p className="font-bold text-white mb-1 uppercase tracking-wider">{selectedStore.complex}</p>
              <p className="text-neutral-400">{selectedStore.address}</p>
            </div>
          </div>

          {/* Phone Contact Card */}
          <div className="flex items-center gap-3 bg-[#0d0d0d] border border-[#1c1c1c] p-4 rounded-xl">
            <IoCallOutline className="text-neutral-300 text-xl shrink-0" />
            <div className="text-xs">
              <span className="text-neutral-500 block text-[10px] tracking-widest uppercase">DIRECT LINE ({selectedStore.name})</span>
              <a 
                href={`tel:${selectedStore.tel}`} 
                className="text-white font-bold tracking-wider hover:text-red-500 transition"
              >
                {selectedStore.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Col 2: Navigation Categories (Cols 6-8) */}
        <div className="md:col-span-3 space-y-4">
          <h3 className="text-xs font-black text-white tracking-[0.2em] uppercase border-l-2 border-red-600 pl-3">
            CATEGORIES
          </h3>
          <ul className="space-y-2.5 text-xs">
            {[
              { label: 'UPPERWEAR', path: '/upperwear' },
              { label: 'SHOES', path: '/shoes' },
              { label: 'PANTS', path: '/pants' },
              { label: 'ACCESSORIES', path: '/accessories' },
            ].map((cat) => (
              <li key={cat.label}>
                <Link 
                  to={cat.path} 
                  className="hover:text-white transition flex items-center gap-1.5 group"
                >
                  <IoArrowForward className="text-[10px] text-neutral-600 group-hover:text-neutral-300 transition" />
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Social & Connect (Cols 9-12) */}
        <div className="md:col-span-4 space-y-4">
          <h3 className="text-xs font-black text-white tracking-[0.2em] uppercase border-l-2 border-red-600 pl-3">
            CONNECT WITH US
          </h3>
          
          <p className="text-xs text-neutral-500 leading-relaxed">
            Follow our Instagram for daily drops, vintage archive updates, and exclusive streetwear releases.
          </p>

          <a 
            href="https://instagram.com/kulture.vintage_online" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-linear-to-r from-neutral-900 to-[#121212] border border-[#222] hover:border-red-600/50 p-4 rounded-xl text-xs text-white font-bold transition group w-full"
          >
            <div className="p-2 rounded-lg bg-red-600/10 text-neutral-400 group-hover:bg-red-600 group-hover:text-white transition">
              <IoLogoInstagram className="text-lg" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-neutral-500 uppercase block tracking-widest">INSTAGRAM</span>
              <span className="truncate block font-mono text-sm">@kulture.vintage_online</span>
            </div>
          </a>
        </div>

      </div>

      {/* 3. BOTTOM COPYRIGHT FOOTNOTE */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-600 gap-4">
        <p>© {new Date().getFullYear()} MAKETECHBERRY. ALL RIGHTS RESERVED.</p>
        <p className="tracking-widest uppercase">
          DESIGNED FOR <span className="text-neutral-400 font-bold">Kulture Vintage</span>
        </p>
      </div>

    </footer>
  );
};

export default Footer;