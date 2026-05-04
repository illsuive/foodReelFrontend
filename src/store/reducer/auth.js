import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    FoodPatner : null,
    loading : true,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginAsUser : (state, action) => {
            state.user = action.payload;
            state.loading = false;
        },
        loginAsFoodPartner : (state, action) => {
            state.FoodPatner = action.payload;
            state.loading = false;
        },
        logOut : (state) => {
            state.user = null;
            state.FoodPatner = null;
            state.loading = false;
        }
    }

})

export const { loginAsUser, loginAsFoodPartner, logOut } = authSlice.actions;

export default authSlice.reducer;