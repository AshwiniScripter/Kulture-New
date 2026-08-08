import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import {
  IoSearchOutline,
  IoHeartOutline,
  IoClose,
  IoPersonOutline,
  IoMenu,
  IoHomeOutline,
  IoSparkles,
  IoInformationCircleOutline,
  IoLogInOutline,
} from "react-icons/io5";
import logo from "../assets/logo.png";
import { useProducts } from "../context/ProductsContext";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ cartCount = 0, wishlistCount = 0, onCartClick }) => {
  const navigate = useNavigate();
  const { products } = useProducts();
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        (p.title || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q)
    );
  }, [query, products]);

  const handleSelect = (id) => {
    navigate(`/product/${id}`);
    setSearchOpen(false);
    setQuery("");
  };

  const goToProfile = () => {
    navigate(user ? "/profile" : "/login");
  };

  return (
    <>
      <nav className="absolute top-0 left-0 w-full z-150 bg-transparent">
        <div className="flex items-center justify-between px-6 pt-6">
          <Link to="/">
            <img src={logo} alt="Logo" className="w-16 md:w-20 cursor-pointer" />
          </Link>

          {/* Desktop Navigation Icons */}
          <div className="hidden md:flex items-center gap-5">
            {/* About Us Icon (Matches style & size of other navbar icons) */}
            <button
              type="button"
              onClick={() => navigate("/about")}
              aria-label="About Us"
              title="About Us"
              className="text-white hover:text-neutral-300 transition cursor-pointer"
            >
              <IoInformationCircleOutline className="text-4xl" />
            </button>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="text-white hover:text-neutral-300 transition cursor-pointer"
            >
              <IoSearchOutline className="text-4xl" />
            </button>

            <button
              type="button"
              onClick={() => navigate("/wishlist")}
              aria-label="Wishlist"
              className="relative text-white hover:text-neutral-300 transition cursor-pointer"
            >
              <IoHeartOutline className="text-4xl" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 bg-red-600 rounded-full text-xs flex items-center justify-center pointer-events-none font-mono">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onCartClick}
              aria-label="Shopping Cart"
              className="relative text-white hover:text-neutral-300 transition cursor-pointer"
            >
              <HiOutlineShoppingCart className="text-4xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 bg-red-600 rounded-full text-xs flex items-center justify-center pointer-events-none font-mono">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile Icon */}
            <button
              type="button"
              onClick={goToProfile}
              aria-label={user ? "Profile" : "Login"}
              className="text-white hover:text-neutral-300 transition cursor-pointer"
            >
              {user ? (
                <IoPersonOutline className="text-4xl" />
              ) : (
                <IoLogInOutline className="text-4xl" />
              )}
            </button>
          </div>

          {/* Mobile Cart + Hamburger */}
          <div className="flex items-center gap-3 sm:gap-4 md:hidden">
            <button
              type="button"
              onClick={onCartClick}
              aria-label="Shopping Cart"
              className="relative text-white hover:text-neutral-300 transition cursor-pointer"
            >
              <HiOutlineShoppingCart className="text-4xl" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center pointer-events-none">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              className="text-white hover:text-neutral-300 transition cursor-pointer"
            >
              {mobileMenuOpen ? (
                <IoClose className="text-4xl" />
              ) : (
                <IoMenu className="text-4xl" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-0 z-140 pt-24 px-4 md:hidden">
          <div className="bg-[#141414] border border-neutral-900 rounded-2xl shadow-2xl overflow-hidden mx-2">
            <button
              onClick={() => { setSearchOpen(true); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-neutral-900 transition cursor-pointer text-left border-b border-neutral-900"
            >
              <IoSearchOutline className="text-xl text-neutral-400" />
              <span className="text-sm font-mono font-bold tracking-wider text-neutral-200 uppercase">Search</span>
            </button>
            <button
              onClick={() => { navigate("/"); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-neutral-900 transition cursor-pointer text-left border-b border-neutral-900"
            >
              <IoHomeOutline className="text-xl text-neutral-400" />
              <span className="text-sm font-mono font-bold tracking-wider text-neutral-200 uppercase">Home</span>
            </button>
            <button
              onClick={() => { navigate("/new-arrival"); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-neutral-900 transition cursor-pointer text-left border-b border-neutral-900"
            >
              <IoSparkles className="text-xl text-neutral-400" />
              <span className="text-sm font-mono font-bold tracking-wider text-neutral-200 uppercase">New Arrival</span>
            </button>
            <button
              onClick={() => { navigate("/about"); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-neutral-900 transition cursor-pointer text-left border-b border-neutral-900"
            >
              <IoInformationCircleOutline className="text-xl text-neutral-400" />
              <span className="text-sm font-mono font-bold tracking-wider text-neutral-200 uppercase">About Us</span>
            </button>
            <button
              onClick={() => { navigate("/wishlist"); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-neutral-900 transition cursor-pointer text-left border-b border-neutral-900"
            >
              <IoHeartOutline className="text-xl text-neutral-400" />
              <span className="text-sm font-mono font-bold tracking-wider text-neutral-200 uppercase">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="ml-auto bg-red-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">{wishlistCount}</span>
              )}
            </button>
            <button
              onClick={() => { navigate(user ? "/profile" : "/login"); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-neutral-900 transition cursor-pointer text-left"
            >
              <IoPersonOutline className="text-xl text-neutral-400" />
              <span className="text-sm font-mono font-bold tracking-wider text-neutral-200 uppercase">
                {user ? 'Profile' : 'Login'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-200 bg-black/95 backdrop-blur-md flex flex-col">
          <div className="max-w-3xl w-full mx-auto px-4 pt-6 flex items-center gap-3">
            <div className="flex-1 flex items-center bg-[#141414] border border-neutral-800 rounded-xl px-4 py-3 focus-within:border-red-600 transition">
              <IoSearchOutline className="text-xl text-neutral-500 shrink-0" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, categories..."
                className="flex-1 bg-transparent text-white text-sm font-mono placeholder-neutral-600 outline-none ml-3"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-neutral-500 hover:text-white transition cursor-pointer">
                  <IoClose className="text-lg" />
                </button>
              )}
            </div>
            <button
              onClick={() => { setSearchOpen(false); setQuery(""); }}
              className="text-neutral-400 hover:text-white text-xs font-mono font-bold tracking-wider uppercase transition cursor-pointer shrink-0"
            >
              Cancel
            </button>
          </div>

          <div className="max-w-3xl w-full mx-auto px-4 mt-4 flex-1 overflow-y-auto pb-8">
            {query.trim() === "" ? (
              <div className="flex flex-col items-center justify-center pt-20">
                <IoSearchOutline className="text-4xl text-neutral-700 mb-4" />
                <p className="text-sm font-mono font-bold tracking-wider text-neutral-600 uppercase">
                  Type to search products
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="flex flex-col items-center justify-center pt-20">
                <p className="text-sm font-mono font-bold tracking-wider text-neutral-600 uppercase">
                  No results for "{query}"
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
                  {results.length} {results.length === 1 ? "result" : "results"} found
                </p>
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelect(product.id)}
                    className="flex items-center gap-4 bg-[#141414] border border-neutral-900 hover:border-neutral-700 rounded-xl p-3 transition text-left cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-lg bg-[#0e0e0e] overflow-hidden shrink-0 border border-neutral-800">
                      {product.image ? (
                        <img src={product.image} alt={product.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition" />
                      ) : (
                        <div className="w-full h-full bg-neutral-900" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono font-bold text-white tracking-wider uppercase truncate">
                        {product.title}
                      </p>
                      <p className="text-[10px] font-mono text-neutral-500 tracking-wider uppercase mt-0.5">
                        {product.category || 'Products'}
                      </p>
                    </div>
                    <p className="text-sm font-mono font-black text-neutral-300 shrink-0">
                      {typeof product.price === 'number'
                        ? `₹${product.price.toLocaleString('en-IN')}`
                        : product.price}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;