import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { useSnackbar } from './SnackbarContext';
import { api } from '../api/api';

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);
  const { user } = useContext(AuthContext);
  const { showSnackbar } = useSnackbar();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error('Error parsing saved cart:', err);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem._id === item._id);
      let newCart;
      if (existingItem) {
        if (user) {
          showSnackbar(`${item.name} quantity updated!`, 'success');
        }
        newCart = prevCart.map(cartItem =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        if (user) {
          showSnackbar(`${item.name} added to cart!`, 'success');
        }
        newCart = [...prevCart, { ...item, quantity: 1 }];
      }
      // Save to localStorage immediately
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });

    if (!user) {
      setPendingItem(item);
      setShowAuthModal(true);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item._id !== itemId);
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 0) {
      quantity = 0;
    }
    setCart(prevCart => {
      const newCart = prevCart.map(item =>
        item._id === itemId ? { ...item, quantity } : item
      );
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem('cart', JSON.stringify([]));
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const retryAddToCart = async (item) => {
    if (item) {
      await addToCart(item);
      setPendingItem(null);
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalAmount,
      searchQuery,
      setSearchQuery,
      showAuthModal,
      setShowAuthModal,
      pendingItem,
      retryAddToCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
