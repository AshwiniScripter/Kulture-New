import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import { AuthProvider } from "./context/AuthContext";
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


// 1. Unified Home View Layout
function Home({
  cartItems,
  setCartItems,
  wishlistedIds,
  setWishlistedIds,
}) {
  return (
    <div>
      <Hero />
      <MarqueeBanner />
      <Categories />
      <ProductGrid
        cartItems={cartItems}
        setCartItems={setCartItems}
        wishlistedIds={wishlistedIds}
        setWishlistedIds={setWishlistedIds}
      />
    </div>
  );
}

// 2. Main Application Wrapper & Controller
function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlistedIds, setWishlistedIds] = useState([]);

  const totalCartCount = cartItems.reduce(
    (acc, item) => acc + (item.quantity || 1),
    0
  );

  return (
    <AuthProvider>
      <ProductsProvider>
        <BrowserRouter basename="/Kulture-New">
          {/* Forces viewport jump to top on navigation */}
          <ScrollToTopSystem />

          <div className="bg-[#0f0f0f] min-h-screen text-white relative flex flex-col justify-between">
            <div>
              {/* Global Navigation Bar */}
              <Navbar
                cartCount={totalCartCount}
                wishlistCount={wishlistedIds.length} 
                onCartClick={() => setIsCartOpen(true)}
              />

              {/* Client Side View Routes */}
              <Routes>
                <Route
                  path="/"
                  element={
                    <Home
                      cartItems={cartItems}
                      setCartItems={setCartItems}
                      wishlistedIds={wishlistedIds}
                      setWishlistedIds={setWishlistedIds}
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
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  wishlistedIds={wishlistedIds}
                  setWishlistedIds={setWishlistedIds}
                />
              }
            />

            {/* DYNAMIC PRODUCT SPECIFIC ROUTE PARAMETER */}
            <Route
              path="/product/:id"
              element={
                <ProductDetailView
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  wishlistedIds={wishlistedIds}
                  setWishlistedIds={setWishlistedIds}
                  onCartOpen={() => setIsCartOpen(true)}
                />
              }
            />

            {/* DEDICATED APPLICATION WISHLIST MANAGEMENT VIEW */}
            <Route 
              path="/wishlist" 
              element={
                <Wishlist 
                  wishlistedIds={wishlistedIds} 
                  setWishlistedIds={setWishlistedIds}
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                />
              } 
            />

            {/* NEW ARRIVAL VIEW */}
            <Route
              path="/new-arrival"
              element={
                <NewArrival
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  wishlistedIds={wishlistedIds}
                  setWishlistedIds={setWishlistedIds}
                />
              }
            />

            {/* PROFILE VIEW */}
            <Route path="/profile" element={<Profile />} />

            {/* ADDRESSES MANAGEMENT VIEW */}
            <Route path="/addresses" element={<Addresses />} />

            {/* Dedicated Catalogue View Routes */}
            <Route
              path="/tshirts"
              element={
                <Tshirt
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  wishlistedIds={wishlistedIds}
                  setWishlistedIds={setWishlistedIds}
                />
              }
            />

            <Route
              path="/shoes"
              element={
                <Shoes
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  wishlistedIds={wishlistedIds}
                  setWishlistedIds={setWishlistedIds}
                />
              }
            />

            <Route
              path="/pants"
              element={
                <Pants
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  wishlistedIds={wishlistedIds}
                  setWishlistedIds={setWishlistedIds}
                />
              }
            />

            <Route
              path="/accessories"
              element={
                <Accessories
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  wishlistedIds={wishlistedIds}
                  setWishlistedIds={setWishlistedIds}
                />
              }
            />

            <Route
              path="/belts"
              element={
                <Belts
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  wishlistedIds={wishlistedIds}
                  setWishlistedIds={setWishlistedIds}
                />
              }
            />

            <Route
              path="/bandana"
              element={
                <Bandana
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  wishlistedIds={wishlistedIds}
                  setWishlistedIds={setWishlistedIds}
                />
              }
            />

            <Route
              path="/watches"
              element={
                <Watches
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  wishlistedIds={wishlistedIds}
                  setWishlistedIds={setWishlistedIds}
                />
              }
            />

            <Route
              path="/shades"
              element={
                <Shades
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  wishlistedIds={wishlistedIds}
                  setWishlistedIds={setWishlistedIds}
                />
              }
            />
          </Routes>
        </div>

        {/* Global Cart Drawer */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          setCartItems={setCartItems}
        />

        {/* Global Floating FAQ Chatbot */}
        <FAQBot />

        {/* Global Footer */}
        <Footer />
      </div>
      </BrowserRouter>
      </ProductsProvider>
    </AuthProvider>
  );
}

export default App;