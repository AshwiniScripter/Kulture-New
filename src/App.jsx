import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider, useWishlist } from "./context/WishlistContext";
import { CartProvider, useCart } from "./context/CartContext";
import { ProductsProvider } from "./context/ProductsContext";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MarqueeBanner from "./components/MarqueeBanner";
import Categories from "./components/Categories";

import ProductGrid from "./components/ProductGrid";
import CartDrawer from "./components/CartDrawer";
import ProductDetail from "./components/ProductDetail";
import ProductDetailView from "./components/ProductDetailView"; 
import Wishlist from "./components/Wishlist"; 
import Footer from "./components/Footer";
import About from "./components/About"; // <-- Added About import

import Tshirt from "./components/Tshirt"; 
import Shoes from "./components/Shoes";
import Pants from "./components/Pants";
import Accessories from "./components/Accessories";
import Bandana from "./components/Bandana";
import Shades from "./components/Shades";
import Belts from "./components/Belts"; 
import Watches from "./components/Watches"; 
import NewArrival from "./components/NewArrival";
import Profile from "./components/Profile"; 
import Addresses from "./components/Addresses";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ForgotPassword from "./components/ForgotPassword";

// FAQ Bot Component
import FAQBot from "./components/FAQBot"; 

// Scroll behavior hook
function ScrollToTopSystem() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}


// Derive the router basename from the deployment subpath so the app works
// under any GitHub Pages / hosted project path (e.g. /Kulture-New or /kulture-vintage).
const getAppBasename = () => {
  const segment = window.location.pathname.split('/').filter(Boolean)[0];
  if (segment && import.meta.env.BASE_URL && import.meta.env.BASE_URL !== '/') {
    return import.meta.env.BASE_URL.replace(/\/+$/, '');
  }
  return segment ? `/${segment}` : '';
};
const APP_BASENAME = getAppBasename();

// 1. Unified Home View Layout
function Home({
  cartItems,
  setCartItems,
  wishlist,
  setWishlist,
}) {
  return (
    <div>
      <Hero />
      <MarqueeBanner />
      <Categories />
      <ProductGrid
        cartItems={cartItems}
        setCartItems={setCartItems}
        wishlistedIds={wishlist}
        setWishlistedIds={setWishlist}
      />
    </div>
  );
}

// 2. Main Application Wrapper & Controller
function AppContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { wishlist, setWishlist } = useWishlist();
  const { cart, setCart, totalCount } = useCart();

  return (
    <>
      {/* Forces viewport jump to top on navigation */}
      <ScrollToTopSystem />

      <div className="bg-[#0f0f0f] min-h-screen text-white relative flex flex-col justify-between">
            <div>
              {/* Global Navigation Bar */}
              <Navbar
                cartCount={totalCount}
                wishlistCount={wishlist.length} 
                onCartClick={() => setIsCartOpen(true)}
              />

              {/* Client Side View Routes */}
              <Routes>
                <Route
                  path="/"
                  element={
                    <Home
                      cartItems={cart}
                      setCartItems={setCart}
                      wishlist={wishlist}
                      setWishlist={setWishlist}
                    />
                  }
                />

                {/* AUTHENTICATION VIEW ROUTES */}
                <Route path="/login" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* ABOUT US VIEW ROUTE */}
            <Route path="/about" element={<About />} />

            <Route
              path="/products"
              element={
                <ProductDetail
                  cartItems={cart}
                  setCartItems={setCart}
                  wishlistedIds={wishlist}
                  setWishlistedIds={setWishlist}
                />
              }
            />

            {/* DYNAMIC PRODUCT SPECIFIC ROUTE PARAMETER */}
            <Route
              path="/product/:id"
              element={
                <ProductDetailView
                  cartItems={cart}
                  setCartItems={setCart}
                  wishlistedIds={wishlist}
                  setWishlistedIds={setWishlist}
                  onCartOpen={() => setIsCartOpen(true)}
                />
              }
            />

            {/* DEDICATED APPLICATION WISHLIST MANAGEMENT VIEW */}
            <Route 
              path="/wishlist" 
              element={
                <Wishlist 
                  wishlistedIds={wishlist} 
                  setWishlistedIds={setWishlist}
                  cartItems={cart}
                  setCartItems={setCart}
                />
              } 
            />

            {/* NEW ARRIVAL VIEW */}
            <Route
              path="/new-arrival"
              element={
                <NewArrival
                  cartItems={cart}
                  setCartItems={setCart}
                  wishlistedIds={wishlist}
                  setWishlistedIds={setWishlist}
                />
              }
            />

            {/* PROFILE VIEW */}
            <Route path="/profile" element={<Profile wishlistedIds={wishlist} setWishlistedIds={setWishlist} />} />

            {/* ADDRESSES MANAGEMENT VIEW */}
            <Route path="/addresses" element={<Addresses />} />

            {/* Dedicated Catalogue View Routes */}
            <Route
              path="/tshirts"
              element={
                <Tshirt
                  cartItems={cart}
                  setCartItems={setCart}
                  wishlistedIds={wishlist}
                  setWishlistedIds={setWishlist}
                />
              }
            />

            <Route
              path="/shoes"
              element={
                <Shoes
                  cartItems={cart}
                  setCartItems={setCart}
                  wishlistedIds={wishlist}
                  setWishlistedIds={setWishlist}
                />
              }
            />

            <Route
              path="/pants"
              element={
                <Pants
                  cartItems={cart}
                  setCartItems={setCart}
                  wishlistedIds={wishlist}
                  setWishlistedIds={setWishlist}
                />
              }
            />

            <Route
              path="/accessories"
              element={
                <Accessories
                  cartItems={cart}
                  setCartItems={setCart}
                  wishlistedIds={wishlist}
                  setWishlistedIds={setWishlist}
                />
              }
            />

            <Route
              path="/belts"
              element={
                <Belts
                  cartItems={cart}
                  setCartItems={setCart}
                  wishlistedIds={wishlist}
                  setWishlistedIds={setWishlist}
                />
              }
            />

            <Route
              path="/bandana"
              element={
                <Bandana
                  cartItems={cart}
                  setCartItems={setCart}
                  wishlistedIds={wishlist}
                  setWishlistedIds={setWishlist}
                />
              }
            />

            <Route
              path="/watches"
              element={
                <Watches
                  cartItems={cart}
                  setCartItems={setCart}
                  wishlistedIds={wishlist}
                  setWishlistedIds={setWishlist}
                />
              }
            />

            <Route
              path="/shades"
              element={
                <Shades
                  cartItems={cart}
                  setCartItems={setCart}
                  wishlistedIds={wishlist}
                  setWishlistedIds={setWishlist}
                />
              }
            />
          </Routes>
        </div>

        {/* Global Cart Drawer */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cart}
          setCartItems={setCart}
        />

        {/* Global Floating FAQ Chatbot */}
        <FAQBot />

        {/* Global Footer */}
        <Footer />
      </div>
    </>
  );
}

// Wrap the app in all required providers and the router.
function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <ProductsProvider>
            <BrowserRouter basename={APP_BASENAME}>
              <AppContent />
            </BrowserRouter>
          </ProductsProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;