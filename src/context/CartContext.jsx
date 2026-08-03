import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { API_ENDPOINT } from '../config/api';
import { apiCall } from '../services/apiClient';

const CartContext = createContext(null);

const CART_KEY = 'kv_cart';

// Drive server-side re-fetching once real endpoints exist on the backend.
// If false, the persisted (localStorage) cart is used as the source of truth,
// which already survives refreshes without any API.
const ENABLE_BACKEND_FETCH = false;

const readStored = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const CartProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState(readStored);
  const [loading, setLoading] = useState(false);

  const totalCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  useEffect(() => {
    if (cart.length === 0) {
      localStorage.removeItem(CART_KEY);
    } else {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }, [cart]);

  // Once auth has finished loading (never wipes during the hydration window):
  //  - Logged out / guest => empty the cart so nothing leaks to guests.
  //  - Logged in          => refetch the user's cart from the backend.
  useEffect(() => {
    if (authLoading) return;

    if (!user?.email) {
      localStorage.removeItem(CART_KEY);
      setCart([]);
      return;
    }

    if (!ENABLE_BACKEND_FETCH) return;

    let cancelled = false;
    setLoading(true);
    apiCall(`${API_ENDPOINT}.api.get_user_cart`, { method: 'GET' })
      .then((items = []) => {
        if (!cancelled) setCart(Array.isArray(items) ? items : []);
      })
      .catch(() => {
        // Keep the persisted cart if the endpoint is unavailable so nothing
        // clears on a refresh when the backend can't serve it.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authLoading, user?.email]);

  const addItem = useCallback(
    (item) =>
      setCart((prev) => {
        const existing = prev.find((x) => String(x.id) === String(item.id));
        if (existing) {
          return prev.map((x) =>
            String(x.id) === String(item.id)
              ? { ...x, quantity: (x.quantity || 0) + (item.quantity || 1) }
              : x
          );
        }
        return [...prev, { ...item, quantity: item.quantity || 1 }];
      }),
    []
  );

  const removeItem = useCallback(
    (id) => setCart((prev) => prev.filter((x) => String(x.id) !== String(id))),
    []
  );

  const updateQuantity = useCallback(
    (id, quantity) =>
      setCart((prev) =>
        quantity <= 0
          ? prev.filter((x) => String(x.id) !== String(id))
          : prev.map((x) =>
              String(x.id) === String(id) ? { ...x, quantity } : x
            )
      ),
    []
  );

  const clearCart = useCallback(() => setCart([]), []);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        totalCount,
        loading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};

export { CartProvider, useCart };