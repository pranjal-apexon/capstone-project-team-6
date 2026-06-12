import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartState, CartItem } from '../types/order.types';

// ⚡ FIX: Helper function to safely read items AND compute the correct initial total amount
const getInitialCartState = (): CartState => {
  try {
    const savedCart = localStorage.getItem('cart');
    const items: CartItem[] = savedCart ? JSON.parse(savedCart) : [];
    const totalAmount = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    return { items, totalAmount };
  } catch (error) {
    return { items: [], totalAmount: 0 };
  }
};

const initialState: CartState = getInitialCartState();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.productId === action.payload.productId);

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      state.totalAmount = state.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.productId !== action.payload);
      state.totalAmount = state.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    updateCartQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find((item) => item.productId === action.payload.productId);
      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity;
      }
      state.totalAmount = state.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      localStorage.removeItem('cart');
    },

    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.totalAmount = state.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
  },
});

export const { addToCart, removeFromCart, updateCartQuantity, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;