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
import About from "./components/About";

// Catalogue & Subcategory Imports
import Upperwear from "./components/Upperwear";
import Jackets from "./components/Jackets";
import Sweatshirts from "./components/Sweatshirts";
import Hoodies from "./components/Hoodies";
import Tanks from "./components/Tanks";
import Shirts from "./components/Shirts";
import Tshirt from "./components/Tshirt"; 
import TopInnerwear from "./components/TopInnerwear";
import BottomInnerwear from "./components/BottomInnerwear"; 

import Lowerwear from "./components/Lowerwear";
import Jeans from "./components/Jeans";
import Sweatpants from "./components/Sweatpants";
import Jorts from "./components/Jorts";
import LinerPants from "./components/LinerPants";

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
import OrderSuccess from "./components/OrderSuccess";
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

            {/* ORDER CONFIRMATION / SUCCESS VIEW */}
            <Route path="/order-success/:id" element={<OrderSuccess />} />

            {/* UPPERWEAR MAIN LANDING & SUBCATEGORY ROUTES */}
            <Route
              path="/upperwear"
              element={
                <Upperwear
                  cartItems={cart}
                  setCartItems={setCart}
                  wishlistedIds={wishlist}
                  setWishlistedIds={setWishlist}
                />
              }
            />
            <Route
              path="/upperwear/jackets"
              element={
                <Jackets
                  cartItems={cart}
                  setCartItems={setCart}
                  wishlistedIds={wishlist}
                  setWishlistedIds={setWishlist}
                />
              }
            />
            <Route
              path="/upperwear/sweatshirts"
              element={
                <Sweatshirts
                  cartItems={cart}
                  setCartItems={setCart}
                  wishlistedIds={wishlist}
                  setWishlistedIds={setWishlist}
                />
              }
            />
            <Route
              path="/upperwear/hoodies"
              element={
                <Hoodies
                  cartItems={cart}
                  setCartItems={setCart}
                  wishlistedIds={wishlist}
                  setWishlistedIds={setWishlist}
                />
              }
            />
            <Route
              path="/upperwear/tanks"
              element={
                <Tanks
                  cartItems={cart}
                  setCartItems={setCart}
                  wishlistedIds={wishlist}
                  setWishlistedIds={setWishlist}
                />
              }
            />
            <Route
              path="/upperwear/shirts"
              element={
                <Shirts
                  cartItems={cart}
                  setCartItems={setCart}
                  wishlistedIds={wishlist}
                  setWishlistedIds={setWishlist}
                />
              }
            />
            <Route
              path="/upperwear/tshirts"
              element={
                <Tshirt
                  cartItems={cart}
                  setCartItems={setCart}
                  wishlistedIds={wishlist}
                  setWishlistedIds={setWishlist}
                />
              }
            />

            {/* Top-level /tshirts route alias */}
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

            {/* TOP INNERWEAR SUBCATEGORY ROUTE */}
            <Route
              path="/upperwear/top-innerwear"
              element={
                <TopInnerwear
                  cartItems={cart}
                  setCartItems={setCart}
                  wishlistedIds={wishlist}
                  setWishlistedIds={setWishlist}
                />
              }
            />

            {/* LOWERWEAR LANDING & SUBCATEGORY ROUTES */}
            <Route
              path="/lowerwear"
              element={
                <Lowerwear
                  cartItems={cart}
                  setCartItems={setCart}
                  wishlistedIds={wishlist}
                  setWishlistedIds={setWishlist}
                />
              }
            />
            <Route
              path="/jeans"
              element={
                <Jeans
                  cartItems={cart}
                  setCartItems={setCart}
                  wishlistedIds={wishlist}
                  setWishlistedIds={setWishlist}
                />
              }
            />
            <Route
              path="/sweatpants"
              element={
                <Sweatpants
                  cartItems={cart}
                  setCartItems={setCart}
                  wishlistedIds={wishlist}
                  setWishlistedIds={setWishlist}
                />
              }
            />
            <Route
              path="/jorts"
              element={
                <Jorts
                  cartItems={cart}
                  setCartItems={setCart}
                  wishlistedIds={wishlist}
                  setWishlistedIds={setWishlist}
                />
              }
            />
            <Route
              path="/liner-pants"
              element={
                <LinerPants
                  cartItems={cart}
                  setCartItems={setCart}
                  wishlistedIds={wishlist}
                  setWishlistedIds={setWishlist}
                />
              }
            />

            {/* BOTTOM INNERWEAR SUBCATEGORY ROUTE */}
            <Route
              path="/lowerwear/bottom-innerwear"
              element={
                <BottomInnerwear
                  cartItems={cart}
                  setCartItems={setCart}
                  wishlistedIds={wishlist}
                  setWishlistedIds={setWishlist}
                />
              }
            />

            {/* OTHER CATEGORIES */}
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