import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  IoPencil, 
  IoBagOutline, 
  IoHeartOutline, 
  IoPricetagOutline, 
  IoStarOutline,
  IoChevronForward,
  IoPersonOutline,
  IoLocationOutline,
  IoShieldCheckmarkOutline,
  IoNotificationsOutline,
  IoHeadsetOutline,
  IoLogOutOutline,
  IoCloseOutline,
  IoCheckmarkCircle,
  IoCubeOutline,
  IoCheckmark,
  IoReloadOutline,
  IoChevronBack
} from "react-icons/io5";
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';

const buildTrackingOrders = (apiOrders) =>
  (apiOrders || []).map((o) => {
    const firstItem = (o.items && o.items[0]) || {};
    return {
      id: o.order_id || o.name,
      item: firstItem.product_name || 'Order',
      size: firstItem.size || '—',
      price: `₹${Number(o.grand_total ?? o.sub_total ?? 0).toLocaleString('en-IN')}`,
      image: firstItem.image || null,
      status: o.status || 'Submitted',
      paymentStatus: o.payment_status || 'Pending',
      orderDate: o.order_date,
      address: o.shipping_address || '—',
      estimatedDelivery: '—',
      steps: [
        { label: 'Order Placed', date: o.order_date || '—', completed: true },
        { label: 'Confirmed', date: '—', completed: true },
        { label: 'In Progress', date: '—', completed: false, active: true },
        { label: 'Delivered', date: '—', completed: false }
      ]
    };
  });

const Profile = ({ wishlistedIds = [] }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [profileUser, setProfileUser] = useState({
    name: user?.full_name || user?.name || 'Kulture Member',
    username: `@${(user?.full_name || 'kulture').toLowerCase().replace(/\s+/g, '.')}`,
    bio: "Streetwear lover. Culture believer. Always evolving.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profileUser);

  // Modal Views State
  const [activeModal, setActiveModal] = useState(null); // 'personal' | 'password' | 'notifications' | 'track' | 'support' | null
  const [toastMessage, setToastMessage] = useState('');

  // Backend Real-Time Tracking State
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Extended Profile State
  const [personalDetails, setPersonalDetails] = useState({
    firstName: user?.full_name?.split(' ')[0] || "",
    lastName: user?.full_name?.split(' ').slice(1).join(' ') || "",
    email: user?.email || "",
    phone: user?.phone || ""
  });

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    securityAlerts: true
  });

  // Dashboard stats (orders/wishlist come from live client state; coupons & K Points
  // default to 0 until a backend stats endpoint is available)
  const [stats, setStats] = useState({ coupons: 0, kPoints: 0 });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const sessionEmail = user?.email;
    if (!sessionEmail) {
      setLoadingOrders(false);
      return;
    }

    const displayName = user?.display_name || user?.name || user?.full_name;
    setProfileUser((prev) => ({
      ...prev,
      name: displayName || prev.name,
      username: `@${(displayName || 'kulture').toLowerCase().replace(/\s+/g, '.')}`,
    }));
    setPersonalDetails((prev) => ({
      ...prev,
      firstName: displayName?.split(' ')[0] || prev.firstName,
      lastName: displayName?.split(' ').slice(1).join(' ') || prev.lastName,
      email: user?.email || prev.email,
      phone: user?.phone || prev.phone,
    }));
    fetchUserOrders();
  }, [user?.email]);

  // 1. BACKEND API: Fetch User Orders
  const fetchUserOrders = async () => {
    setLoadingOrders(true);
    try {
      const email = user?.email;
      const data = await orderService.getUserOrders(email || undefined);
      setOrders(buildTrackingOrders(data));
    } catch (err) {
      console.warn("Could not fetch orders:", err.message);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfileUser(formData);
    localStorage.setItem("kv_user_profile", JSON.stringify(formData));
    setIsEditing(false);
    showToast("Profile header updated!");
  };

  const handleSavePersonalInfo = (e) => {
    e.preventDefault();
    setProfileUser(prev => ({ ...prev, name: `${personalDetails.firstName} ${personalDetails.lastName}` }));
    setActiveModal(null);
    showToast("Personal information saved!");
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    setActiveModal(null);
    showToast("Password updated successfully!");
  };

  const handleMenuItemClick = (path) => {
    if (path === "/personal-info") setActiveModal('personal');
    else if (path === "/track-order") {
      setSelectedOrder(null); // Reset selection to show full order list
      setActiveModal('track');
    }
    else if (path === "/password") setActiveModal('password');
    else if (path === "/notifications") setActiveModal('notifications');
    else if (path === "/support") setActiveModal('support');
    else navigate(path);
  };

  return (
    <div className="min-h-screen bg-[#080808] pt-20 pb-24 px-4 sm:px-6 lg:px-8 text-neutral-200 font-sans relative">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-neutral-900 border border-green-500/40 text-green-400 text-xs px-4 py-3 rounded-xl flex items-center gap-2 shadow-2xl animate-bounce">
          <IoCheckmarkCircle className="text-base" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-md md:max-w-lg mx-auto space-y-5">

        {/* 1. TOP HEADER BANNER */}
        <div className="pt-2 pb-1">
          <span className="text-[11px] font-mono tracking-[0.25em] text-neutral-500 uppercase block mb-1">
            PROFILE
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight leading-none uppercase">
            Your style.
          </h1>
          <h1 className="text-3xl font-black text-white tracking-tight leading-none uppercase">
            Your identity.
          </h1>
        </div>

        {/* 2. PROFILE HERO CARD */}
        <div className="bg-[#111111] border border-neutral-800/80 rounded-2xl p-5 relative overflow-hidden shadow-2xl">
          <div className="flex items-start gap-4 mb-6">
            <div className="relative shrink-0">
              <img
                src={profileUser.avatar}
                alt={profileUser.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-neutral-700/80 shadow-md"
              />
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <h2 className="text-lg font-bold text-white tracking-wide truncate">
                {profileUser.name}
              </h2>
              <p className="text-xs text-neutral-500 font-mono mb-2">
                {profileUser.username}
              </p>
              <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                {profileUser.bio}
              </p>

              <button
                onClick={() => {
                  setFormData(profileUser);
                  setIsEditing(true);
                }}
                className="mt-3 inline-flex items-center gap-1.5 bg-[#1a1a1a] hover:bg-neutral-800 border border-neutral-700/60 px-3 py-1.5 rounded-lg text-[11px] font-medium text-neutral-300 transition active:scale-95 cursor-pointer"
              >
                <IoPencil className="text-xs" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-4 border-t border-neutral-800/80 pt-4 text-center">
            <div className="space-y-1">
              <IoBagOutline className="mx-auto text-lg text-neutral-400" />
              <p className="text-sm font-bold text-white font-mono">{orders.length}</p>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Orders</p>
            </div>
            <div className="space-y-1 border-l border-neutral-800/60">
              <IoHeartOutline className="mx-auto text-lg text-neutral-400" />
              <p className="text-sm font-bold text-white font-mono">{wishlistedIds.length}</p>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Wishlist</p>
            </div>
            <div className="space-y-1 border-l border-neutral-800/60">
              <IoPricetagOutline className="mx-auto text-lg text-neutral-400" />
              <p className="text-sm font-bold text-white font-mono">{stats.coupons}</p>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Coupons</p>
            </div>
            <div className="space-y-1 border-l border-neutral-800/60">
              <IoStarOutline className="mx-auto text-lg text-neutral-400" />
              <p className="text-sm font-bold text-white font-mono">{stats.kPoints}</p>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider">K Points</p>
            </div>
          </div>
        </div>

        {/* 3. ACCOUNT MENU LIST */}
        <div className="bg-[#111111] border border-neutral-800/80 rounded-2xl p-2 shadow-xl divide-y divide-neutral-800/50">
          <p className="text-[11px] font-bold text-neutral-400 tracking-widest uppercase px-3 pt-3 pb-2">
            Account Menu
          </p>

          {[
            { label: "Personal Information", icon: IoPersonOutline, path: "/personal-info" },
            { label: "Track Order", icon: IoCubeOutline, path: "/track-order" },
            { label: "Addresses", icon: IoLocationOutline, path: "/addresses" },
            { label: "Password", icon: IoShieldCheckmarkOutline, path: "/password" },
            { label: "Notification Preferences", icon: IoNotificationsOutline, path: "/notifications" },
          ].map((item, index) => {
            const IconComponent = item.icon;
            return (
              <button
                key={index}
                onClick={() => handleMenuItemClick(item.path)}
                className="w-full flex items-center justify-between p-3.5 hover:bg-neutral-800/40 rounded-xl transition cursor-pointer text-left group"
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="text-lg text-neutral-400 group-hover:text-white transition" />
                  <span className="text-xs font-medium text-neutral-300 group-hover:text-white transition">
                    {item.label}
                  </span>
                </div>
                <IoChevronForward className="text-xs text-neutral-600 group-hover:text-neutral-400 transition" />
              </button>
            );
          })}
        </div>

        {/* 4. MORE ACTIONS & SUPPORT */}
        <div className="bg-[#111111] border border-neutral-800/80 rounded-2xl p-3 shadow-xl space-y-3">
          <p className="text-[11px] font-bold text-neutral-400 tracking-widest uppercase px-1 pt-1">
            More
          </p>

          <button 
            onClick={() => handleMenuItemClick("/support")}
            className="w-full flex items-center justify-center gap-2 bg-[#181818] hover:bg-neutral-800 border border-neutral-800 py-3 px-3 rounded-xl text-xs font-medium text-neutral-300 transition cursor-pointer"
          >
            <IoHeadsetOutline className="text-base text-neutral-400" />
            <span>Help & Support</span>
          </button>

          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="group w-full flex items-center justify-center gap-2 bg-[#181818] hover:bg-red-900/20 hover:border-red-600/40 border border-neutral-800 py-3 rounded-xl text-xs font-bold text-neutral-300 hover:text-red-400 transition cursor-pointer"
          >
            <IoLogOutOutline className="text-base group-hover:text-red-400 transition" />
            <span>Log Out</span>
          </button>
        </div>

      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111111] border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h3 className="text-sm font-bold text-white tracking-widest uppercase">Edit Profile</h3>
              <button 
                onClick={() => setIsEditing(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <IoCloseOutline className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-4 space-y-4">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#181818] border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-[#181818] border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                  Bio
                </label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-[#181818] border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-600 resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="w-full bg-[#181818] border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-[#181818] hover:bg-neutral-800 text-neutral-300 text-xs font-bold py-3 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-3 rounded-xl transition cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DYNAMIC MODALS FOR MENU ITEMS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111111] border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                {activeModal === 'track' && selectedOrder && (
                  <button 
                    onClick={() => setSelectedOrder(null)} 
                    className="text-neutral-400 hover:text-white mr-1"
                  >
                    <IoChevronBack className="text-lg" />
                  </button>
                )}
                <h3 className="text-sm font-bold text-white tracking-widest uppercase">
                  {activeModal === 'personal' && 'Personal Information'}
                  {activeModal === 'track' && (selectedOrder ? `Order #${selectedOrder.id}` : 'Select Order to Track')}
                  {activeModal === 'password' && 'Password'}
                  {activeModal === 'notifications' && 'Notifications'}
                  {activeModal === 'support' && 'Help & Support'}
                </h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <IoCloseOutline className="text-xl" />
              </button>
            </div>

            {/* 1. PERSONAL INFORMATION FORM */}
            {activeModal === 'personal' && (
              <form onSubmit={handleSavePersonalInfo} className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-neutral-500 block mb-1">First Name</label>
                    <input
                      type="text"
                      value={personalDetails.firstName}
                      onChange={(e) => setPersonalDetails({ ...personalDetails, firstName: e.target.value })}
                      className="w-full bg-[#181818] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-neutral-500 block mb-1">Last Name</label>
                    <input
                      type="text"
                      value={personalDetails.lastName}
                      onChange={(e) => setPersonalDetails({ ...personalDetails, lastName: e.target.value })}
                      className="w-full bg-[#181818] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-neutral-500 block mb-1">Email</label>
                  <input
                    type="email"
                    value={personalDetails.email}
                    onChange={(e) => setPersonalDetails({ ...personalDetails, email: e.target.value })}
                    className="w-full bg-[#181818] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-neutral-500 block mb-1">Phone</label>
                  <input
                    type="tel"
                    value={personalDetails.phone}
                    onChange={(e) => setPersonalDetails({ ...personalDetails, phone: e.target.value })}
                    className="w-full bg-[#181818] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-3 rounded-xl transition cursor-pointer uppercase tracking-wider"
                >
                  Save Details
                </button>
              </form>
            )}

            {/* 2. REAL-TIME MULTI-ORDER LIST & TRACKING */}
            {activeModal === 'track' && (
              <div className="mt-4 space-y-4">
                
                {/* STATE A: Show All Active Orders */}
                {!selectedOrder && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                      <span>RECENT ORDERS ({orders.length})</span>
                      <button 
                        onClick={fetchUserOrders} 
                        className="flex items-center gap-1 hover:text-white transition cursor-pointer"
                      >
                        <IoReloadOutline className={loadingOrders ? "animate-spin" : ""} /> Refresh
                      </button>
                    </div>

                    {loadingOrders ? (
                      <div className="py-8 text-center text-xs text-neutral-500">Loading live orders...</div>
                    ) : orders.length === 0 ? (
                      <div className="py-8 text-center text-xs text-neutral-500">No active orders found.</div>
                    ) : (
                      orders.map((ord) => (
                        <div
                          key={ord.id}
                          onClick={() => setSelectedOrder(ord)}
                          className="flex items-center justify-between bg-[#181818] p-3 rounded-xl border border-neutral-800 hover:border-neutral-700 transition cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <img src={ord.image} alt={ord.item} className="w-12 h-12 rounded-lg object-cover" />
                            <div className="text-xs space-y-0.5">
                              <p className="font-bold text-white group-hover:text-red-500 transition">{ord.item}</p>
                              <p className="text-[10px] text-neutral-500 font-mono">ID: {ord.id} • {ord.price}</p>
                              <p className="text-[10px] text-emerald-400 font-medium">Est: {ord.estimatedDelivery}</p>
                            </div>
                          </div>
                          <IoChevronForward className="text-neutral-600 group-hover:text-white transition" />
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* STATE B: Show Detailed Tracking for Selected Order */}
                {selectedOrder && (
                  <div className="space-y-5">
                    <div className="flex gap-3 bg-[#181818] p-3 rounded-xl border border-neutral-800">
                      <img 
                        src={selectedOrder.image} 
                        alt={selectedOrder.item} 
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 text-xs space-y-1">
                        <p className="font-bold text-white leading-tight">{selectedOrder.item}</p>
                        <p className="text-neutral-400 text-[10px]">Size: {selectedOrder.size} | {selectedOrder.price}</p>
                        <p className="text-neutral-500 font-mono text-[10px]">Order ID: {selectedOrder.id}</p>
                      </div>
                    </div>

                    <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 text-center">
                      <p className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">Estimated Delivery</p>
                      <p className="text-sm font-bold text-emerald-300 mt-0.5">{selectedOrder.estimatedDelivery}</p>
                    </div>

                    {/* Timeline Vertical Stepper */}
                    <div className="px-2 space-y-0">
                      {selectedOrder.steps.map((step, index) => (
                        <div key={index} className="flex gap-4 relative pb-6 last:pb-0">
                          {index !== selectedOrder.steps.length - 1 && (
                            <div 
                              className={`absolute left-11px top-6 w-2px h-full ${
                                step.completed ? "bg-emerald-500" : "bg-neutral-800"
                              }`}
                            />
                          )}

                          <div className="relative z-10 shrink-0">
                            <div 
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                                step.completed 
                                  ? "bg-emerald-500 text-black font-bold" 
                                  : step.active 
                                  ? "bg-red-600 text-white animate-pulse" 
                                  : "bg-neutral-800 text-neutral-500"
                              }`}
                            >
                              {step.completed ? <IoCheckmark className="text-xs stroke-3" /> : index + 1}
                            </div>
                          </div>

                          <div className="text-xs">
                            <p className={`font-semibold ${step.completed || step.active ? "text-white" : "text-neutral-500"}`}>
                              {step.label}
                            </p>
                            <p className="text-[10px] text-neutral-500 font-mono mt-0.5">{step.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-[#181818] p-3 rounded-xl border border-neutral-800 text-xs space-y-1">
                      <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">Delivering To</p>
                      <p className="text-neutral-300 font-medium">{selectedOrder.address}</p>
                    </div>

                    <button
                      onClick={() => { setActiveModal('support'); }}
                      className="w-full bg-[#181818] hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-xs font-bold py-2.5 rounded-xl transition cursor-pointer"
                    >
                      Need Help With This Order?
                    </button>
                  </div>
                )}

              </div>
            )}

            {/* 3. PASSWORD FORM */}
            {activeModal === 'password' && (
              <form onSubmit={handleSavePassword} className="mt-4 space-y-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-neutral-500 block mb-1">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-[#181818] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-neutral-500 block mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-[#181818] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-3 rounded-xl transition cursor-pointer uppercase tracking-wider"
                >
                  Update Password
                </button>
              </form>
            )}

            {/* 4. NOTIFICATION PREFERENCES */}
            {activeModal === 'notifications' && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#181818] rounded-xl border border-neutral-800">
                  <div>
                    <p className="text-xs font-bold text-white">Order Status Alerts</p>
                    <p className="text-[10px] text-neutral-500">Shipping and delivery updates</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.orderUpdates}
                    onChange={() => setNotifications({ ...notifications, orderUpdates: !notifications.orderUpdates })}
                    className="accent-red-600 w-4 h-4 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-[#181818] rounded-xl border border-neutral-800">
                  <div>
                    <p className="text-xs font-bold text-white">Promotions & Offers</p>
                    <p className="text-[10px] text-neutral-500">Exclusive drop notifications</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.promotions}
                    onChange={() => setNotifications({ ...notifications, promotions: !notifications.promotions })}
                    className="accent-red-600 w-4 h-4 cursor-pointer"
                  />
                </div>
                <button
                  onClick={() => { setActiveModal(null); showToast("Notification settings saved!"); }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-3 rounded-xl transition cursor-pointer uppercase tracking-wider mt-2"
                >
                  Save Preferences
                </button>
              </div>
            )}

            {/* 5. HELP & SUPPORT */}
            {activeModal === 'support' && (
              <div className="mt-4 space-y-3 text-xs">
                <div className="p-3 bg-[#181818] rounded-xl border border-neutral-800 space-y-1">
                  <p className="font-bold text-white uppercase text-[10px] tracking-wider">Email Us</p>
                  <p className="text-neutral-400">support@kulturevintage.com</p>
                </div>
                <div className="p-3 bg-[#181818] rounded-xl border border-neutral-800 space-y-1">
                  <p className="font-bold text-white uppercase text-[10px] tracking-wider">Support Hours</p>
                  <p className="text-neutral-400">Mon - Sun: 11:00 AM - 10:00 PM IST</p>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full bg-[#181818] hover:bg-neutral-800 text-white text-xs font-bold py-3 rounded-xl transition cursor-pointer uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;