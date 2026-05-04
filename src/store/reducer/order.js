import {createSlice } from '@reduxjs/toolkit'

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        orders: [],
        total: 0,
        foodPatnerOrder : [],
        loading: true
    },
    reducers: {
        addOrder: (state, action) => {
            state.items.push(action.payload);
            state.total += action.payload.price;
        },
        fetchOrders: (state, action) => {
            state.orders = action.payload;
            state.loading = false;  
        },
        fetchFoodPatnerOrder : (state, action) => {
            state.foodPatnerOrder = action.payload;
            state.loading = false;
        }
    }
})

export const { addOrder, fetchOrders, fetchFoodPatnerOrder } = orderSlice.actions
export default orderSlice.reducer