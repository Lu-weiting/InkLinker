import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // 添加你的 state 属性
  isLoadingPosts: false,
  isLoadingProfile: false,
};

const LoadingControl = createSlice({
  name: "activeTab",
  initialState,
  reducers: {
    // 添加你的 reducer actions
    setIsLoadingPosts: (state, action) => {
      state.isLoadingPosts = action.payload;
    },
    setIsLoadingProfile: (state, action) => {
      state.isLoadingProfile = action.payload;
    },
  },
});

export const {
  // 添加你的 reducer actions
  setIsLoadingPosts,
  setIsLoadingProfile,
} = LoadingControl.actions;

export default LoadingControl.reducer;