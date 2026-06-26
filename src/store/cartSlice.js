import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsed = JSON.parse(savedCart);
      return {
        items: parsed.items || [],
        totalQuantity: parsed.totalQuantity || 0,
        totalPrice: parsed.totalPrice || 0
      };
    }
  } catch (error) {
    console.error('Failed to load cart from storage:', error);
  }
  return {
    items: [],
    totalQuantity: 0,
    totalPrice: 0
  };
};

const saveCartToStorage = (state) => {
  try {
    localStorage.setItem('cart', JSON.stringify({
      items: state.items,
      totalQuantity: state.totalQuantity,
      totalPrice: state.totalPrice
    }));
  } catch (error) {
    console.error('Failed to save cart to storage:', error);
  }
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      
      // Stock protection check
      const currentQty = existingItem ? existingItem.quantity : 0;
      if (currentQty >= newItem.stock) {
        return; // No stock left
      }

      if (!existingItem) {
        state.items.push({
          ...newItem,
          quantity: 1
        });
      } else {
        existingItem.quantity += 1;
      }
      
      state.totalQuantity += 1;
      state.totalPrice = parseFloat((state.totalPrice + newItem.price).toFixed(2));
      saveCartToStorage(state);
    },
    removeItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        state.totalQuantity -= 1;
        state.totalPrice = parseFloat((state.totalPrice - existingItem.price).toFixed(2));
        
        if (existingItem.quantity === 1) {
          state.items = state.items.filter(item => item.id !== id);
        } else {
          existingItem.quantity -= 1;
        }
        
        if (state.totalQuantity < 0) state.totalQuantity = 0;
        if (state.totalPrice < 0) state.totalPrice = 0;
        
        saveCartToStorage(state);
      }
    },
    deleteItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalPrice = parseFloat((state.totalPrice - (existingItem.price * existingItem.quantity)).toFixed(2));
        state.items = state.items.filter(item => item.id !== id);
        
        if (state.totalQuantity < 0) state.totalQuantity = 0;
        if (state.totalPrice < 0) state.totalPrice = 0;
        
        saveCartToStorage(state);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      saveCartToStorage(state);
    }
  }
});

export const { addItem, removeItem, deleteItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
