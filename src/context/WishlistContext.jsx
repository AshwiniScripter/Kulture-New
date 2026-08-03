import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { API_ENDPOINT } from '../config/api';
import { apiCall } from '../services/apiClient';

const WishlistContext = createContext(null);

const WISHLIST_KEY = 'kv_wishlist';

// Drive server-side re-fetching once real endpoints exist on the backend.
// If false, the persisted (localStorage) wishlist is used as the source of
// truth, which already survives refreshes without any API.
const ENABLE_BACKEND_FETCH = false;

const readStored = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const WishlistProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [wishlist, setWishlist] = useState(readStored);
  const [loading, setLoading] = useState(false);

  // Persist to localStorage whenever the list changes. An empty list clears the
  // cached key so a logout truly resets the stored wishlist.
  useEffect(() => {
    if (wishlist.length === 0) {
      localStorage.removeItem(WISHLIST_KEY);
    } else {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    }
  }, [wishlist]);

  // React to auth changes once auth has finished loading (avoids wiping the
  // persisted list during the initial hydration window while `user` is null):
  //  - Logged out / guest => empty the wishlist so badges drop to 0 / hide.
  //  - Logged in          => refetch the user's wishlist from the backend.
  useEffect(() => {
    if (authLoading) return;

    if (!user?.email) {
      localStorage.removeItem(WISHLIST_KEY);
      setWishlist([]);
      return;
    }

    if (!ENABLE_BACKEND_FETCH) return;

    let cancelled = false;
    setLoading(true);
    apiCall(`${API_ENDPOINT}.api.get_user_wishlist`, { method: 'GET' })
      .then((items = []) => {
        if (!cancelled) setWishlist(Array.isArray(items) ? items : []);
      })
      .catch(() => {
        // Keep the persisted list if the endpoint is unavailable so nothing clears
        // on a refresh when the backend can't serve it.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authLoading, user?.email]);

  const addItem = useCallback(
    (id) => setWishlist((prev) => (prev.includes(id) ? prev : [...prev, id])),
    []
  );

  const removeItem = useCallback(
    (id) => setWishlist((prev) => prev.filter((x) => String(x) !== String(id))),
    []
  );

  const toggleItem = useCallback(
    (id) =>
      setWishlist((prev) =>
        prev.includes(id)
          ? prev.filter((x) => String(x) !== String(id))
          : [...prev, id]
      ),
    []
  );

  const clearWishlist = useCallback(() => setWishlist([]), []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        setWishlist,
        loading,
        addItem,
        removeItem,
        toggleItem,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider');
  return ctx;
};

export { WishlistProvider, useWishlist };