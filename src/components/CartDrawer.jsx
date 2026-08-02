import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoCloseOutline, IoTrashOutline, IoTicketOutline, IoArrowForward, IoChevronBack, IoCheckmarkCircleOutline } from "react-icons/io5";
import orderService from '../services/orderService';
import { useAuth } from '../context/AuthContext';

const CartDrawer = ({ isOpen, onClose, cartItems, setCartItems }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const [view, setView] = useState('cart'); // 'cart' | 'checkout' | 'success'
  const [orderId, setOrderId] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    email: user?.email || '',
    name: user?.full_name || user?.name || '',
    phone: user?.phone || '',
    address: '',
  });

  if (!isOpen) return null;

  // 1. Calculate Subtotal dynamically
  const subtotal = cartItems.reduce((acc, item) => {
    const numericPrice = typeof item.price === 'number' 
      ? item.price 
      : parseFloat(String(item.price).replace(/[^\d.]/g, '')) || 0;
    return acc + (numericPrice * item.quantity);
  }, 0);

  // Dynamic calculations for summary
  const taxes = cartItems.length > 0 ? Math.round(subtotal * 0.05) : 0; // 5% Tax rate example
  const shipping = subtotal > 2000 || cartItems.length === 0 ? 0 : 99;
  const total = Math.max(0, subtotal - appliedDiscount + taxes + shipping);

  // Handle Coupon Apply Action
  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'KULTURE10') {
      const discountVal = Math.round(subtotal * 0.10);
      setAppliedDiscount(discountVal);
      alert('Coupon Applied: 10% OFF!');
    } else if (couponCode.trim()) {
      alert('Invalid Coupon Code! Try "KULTURE10"');
    }
  };

  // Update specific item quantities
  const updateQuantity = (id, amount) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + amount;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  // Remove item
  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const startCheckout = () => {
    setView('checkout');
    setCheckoutError('');
    setCheckoutForm((prev) => ({
      ...prev,
      email: prev.email || user?.email || '',
      name: prev.name || user?.full_name || user?.name || '',
      phone: prev.phone || user?.phone || '',
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setCheckoutError('');
    setCheckoutLoading(true);
    try {
      const items = cartItems.map((item) => ({
        product: item.product_id || item.id,
        size: item.size || item.sizeNames?.[0] || 'One Size',
        quantity: item.quantity || 1,
      }));
      const result = await orderService.createOrder({
        customer_name: checkoutForm.name,
        customer_email: checkoutForm.email,
        customer_phone: checkoutForm.phone,
        shipping_address: checkoutForm.address,
        items,
      });
      if (result && result.success) {
        setOrderId(result.order);
        setView('success');
        setCartItems([]);
      } else {
        setCheckoutError(result?.message || 'Order creation failed.');
      }
    } catch (err) {
      setCheckoutError(err.message || 'Order creation failed.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-200 overflow-hidden font-mono">
      
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#0a0a0a] border-l border-neutral-900 text-white flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-neutral-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {view === 'checkout' && (
                <button onClick={() => setView('cart')} className="p-1 hover:bg-neutral-800 rounded-lg transition text-neutral-400 hover:text-white">
                  <IoChevronBack className="text-xl" />
                </button>
              )}
              <h2 className="text-lg font-normal tracking-[0.2em] uppercase">
                {view === 'checkout' ? 'CHECKOUT' : view === 'success' ? 'ORDER PLACED' : 'YOUR CART'}
              </h2>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-neutral-800 rounded-lg transition">
              <IoCloseOutline className="text-2xl text-neutral-400 hover:text-white" />
            </button>
          </div>

          {/* Cart Items List Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {view === 'checkout' && (
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                {!user && (
                  <div className="bg-[#151515] border border-neutral-800 rounded-xl p-3 text-[11px] text-neutral-400 leading-relaxed">
                    Please use an email linked to a registered account. <button type="button" onClick={() => { onClose(); navigate('/login'); }} className="text-white underline">Login</button> to auto-fill your details.
                  </div>
                )}
                <div>
                  <label className="block text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={checkoutForm.email}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                    className="w-full bg-[#111111] border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-600"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    value={checkoutForm.name}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                    className="w-full bg-[#111111] border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-600"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Phone</label>
                  <input
                    type="tel"
                    value={checkoutForm.phone}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                    className="w-full bg-[#111111] border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-600"
                    placeholder="9876543210"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Shipping Address *</label>
                  <textarea
                    required
                    rows={3}
                    value={checkoutForm.address}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                    className="w-full bg-[#111111] border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-600 resize-none"
                    placeholder="123 Main St, City, Country"
                  />
                </div>

                {checkoutError && (
                  <p className="text-red-500 text-[11px]">{checkoutError}</p>
                )}

                <div className="bg-[#0f0f0f] border border-neutral-900 rounded-xl p-3 text-[11px] text-neutral-400 space-y-1">
                  <div className="flex justify-between">
                    <span>SUBTOTAL</span>
                    <span className="text-neutral-200">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SHIPPING</span>
                    <span className="text-neutral-200">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TAXES</span>
                    <span className="text-neutral-200">₹{taxes.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="border-t border-neutral-800 pt-2 flex justify-between font-bold text-white text-xs">
                    <span>TOTAL</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={checkoutLoading}
                  className="w-full bg-white hover:bg-neutral-200 text-black text-xs font-bold tracking-[0.2em] py-3.5 rounded-xl uppercase transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {checkoutLoading ? 'PLACING ORDER...' : 'PLACE ORDER'}
                </button>
              </form>
            )}

            {view === 'success' && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-10">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/40 flex items-center justify-center">
                  <IoCheckmarkCircleOutline className="text-3xl text-green-400" />
                </div>
                <p className="text-xs text-neutral-400 uppercase tracking-[0.2em]">Order placed successfully!</p>
                <p className="text-sm text-white font-bold tracking-wider">ORDER ID</p>
                <p className="text-lg font-black text-green-400 tracking-widest">{orderId}</p>
                <button
                  onClick={onClose}
                  className="mt-2 w-full bg-[#1a1a1a] hover:bg-neutral-800 border border-neutral-800 text-white text-xs font-bold tracking-[0.2em] py-3 rounded-xl uppercase transition"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            )}

            {view === 'cart' && cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500">
                <p className="uppercase tracking-[0.15em] text-xs mb-2">YOUR CART IS EMPTY</p>
                <p className="text-[11px] text-neutral-600">Add pieces to build your personal culture.</p>
              </div>
            ) : view === 'cart' ? (
              cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 bg-[#111111] rounded-xl border border-neutral-900">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-lg shrink-0 border border-neutral-800" />
                  ) : (
                    <div className="w-20 h-20 bg-[#1a1a1a] rounded-lg shrink-0 border border-neutral-800" />
                  )}
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-normal uppercase truncate tracking-wider text-neutral-200">{item.title}</h4>
                      <p className="text-[10px] text-neutral-500 tracking-wide mt-0.5">{item.color || 'Black'} . {item.size || item.sizeNames?.[0] || 'One Size'}</p>
                      <p className="text-sm font-bold mt-1 text-white">{typeof item.price === 'number' ? `₹${item.price.toLocaleString('en-IN')}` : item.price}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center bg-black border border-neutral-800 rounded-md overflow-hidden">
                        <button onClick={() => updateQuantity(item.id, -1)} className="px-2.5 py-0.5 hover:bg-neutral-800 text-neutral-400 hover:text-white transition font-bold">-</button>
                        <span className="px-3 text-xs text-white">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="px-2.5 py-0.5 hover:bg-neutral-800 text-neutral-400 hover:text-white transition font-bold">+</button>
                      </div>
                      
                      <button onClick={() => removeItem(item.id)} className="text-neutral-500 hover:text-red-500 transition p-1">
                        <IoTrashOutline className="text-base" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : null}
          </div>

          {/* Checkout & Order Summary Panel (Matching Reference UI) */}
          {view === 'cart' && cartItems.length > 0 && (
            <div className="border-t border-neutral-900 p-5 bg-[#050505] space-y-4">
              
              {/* Grid Layout: Summary Card (Left) + Coupon Card (Right) */}
              <div className="grid grid-cols-12 gap-3">
                
                {/* Left Block: ORDER SUMMARY METRICS */}
                <div className="col-span-7 bg-[#0f0f0f] border border-neutral-900 rounded-xl p-3.5 space-y-2 text-[11px] tracking-wider text-neutral-400">
                  <h3 className="text-xs font-normal tracking-[0.2em] uppercase text-white mb-3">ORDER SUMMARY</h3>
                  
                  <div className="flex justify-between">
                    <span>SUBTOTAL</span>
                    <span className="text-neutral-200">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>DISCOUNT</span>
                      <span>-₹{appliedDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>SHIPPING</span>
                    <span className="text-neutral-200">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>TAXES</span>
                    <span className="text-neutral-200">₹{taxes.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="border-t border-neutral-800 pt-2 flex justify-between font-bold text-white text-xs tracking-widest">
                    <span>TOTAL</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Right Block: COUPON INPUT SECTION */}
                <div className="col-span-5 bg-[#0f0f0f] border border-neutral-900 rounded-xl p-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-normal tracking-widest uppercase text-neutral-500 block mb-2">COUPON CODE</span>
                    <div className="relative mb-2">
                      <div className="bg-[#171717] border border-neutral-800 rounded-lg py-1.5 px-2 flex items-center gap-1.5 text-neutral-400">
                        <IoTicketOutline className="text-xs shrink-0" />
                        <input 
                          type="text" 
                          placeholder="CODE"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="bg-transparent uppercase text-[10px] w-full text-white placeholder-neutral-600 focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleApplyCoupon}
                    className="w-full bg-[#1c1c1c] hover:bg-neutral-800 active:scale-[0.98] border border-neutral-800 text-white text-[10px] tracking-[0.15em] font-normal py-2 rounded-lg uppercase transition"
                  >
                    APPLY
                  </button>
                </div>

              </div>

              {/* Bottom Action Bar: Price Display + Checkout Trigger */}
              <div className="bg-[#0f0f0f] border border-neutral-900 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <div className="text-lg font-normal text-white tracking-wider">
                    ₹{total.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-neutral-500 tracking-wider">
                    29% OFF APPLIED
                  </div>
                </div>

                <button 
                  onClick={startCheckout} 
                  className="bg-[#1a1a1a] hover:bg-white hover:text-black border border-neutral-800 transition-all duration-200 px-6 py-3 rounded-xl flex items-center gap-2.5 text-xs font-normal tracking-[0.2em] text-white uppercase shadow-lg"
                >
                  CHECKOUT <IoArrowForward className="text-sm" />
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;