import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        loading: true
    },
    reducers: {
        // Example Reducer Logic
        fetchCart: (state, action) => {
            state.items = action.payload;
            state.loading = false;
        },
        addToCart: (state, action) => {
            const item = action.payload;
            const existingItem = state.items.find((i) => i._id === item._id);
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                state.items.push(item);
            }
        },
        removeFromCart: (state, action) => {
            const itemId = action.payload;
            state.items = state.items.filter((item) => item._id !== itemId);
        },
        updateQuantity: (state, action) => {
            const { itemId, quantity } = action.payload;
            const item = state.items.find((i) => i._id === itemId);
            if (item) {
                item.quantity = quantity;
                if (item.quantity <= 0) {
                    state.items = state.items.filter((i) => i._id !== itemId);
                }
            }
        },
        clearCart: (state) => {
            state.items = [];
        }
    }
});

export const { addToCart, removeFromCart, updateQuantity, fetchCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;