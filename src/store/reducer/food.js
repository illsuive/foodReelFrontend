import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    reels: [],
    loading: true
}

const foodSlice = createSlice({
    name: "food",
    initialState,
    reducers: {
        setReels: (state, action) => {
            state.reels = action.payload;
            state.loading = false;
        },
        handleLike: (state, action) => {
            const { foodId, isLiked, likesCount } = action.payload;
            const reel = state.reels.find(r => r._id === foodId);

            if (reel) {
                reel.isLiked = isLiked;
                if (reel.likes) {
                    reel.likes.length = likesCount;
                } else {
                    reel.likesCount = likesCount;
                }
            }
        }
    }
});

export const { setReels, handleLike } = foodSlice.actions;
export default foodSlice.reducer;