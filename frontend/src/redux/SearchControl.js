import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tabKey: "1",
    title: "",
    num: 0,
};

const SearchControl = createSlice({
  name: "mySlice",
  initialState,
  reducers: {
    // 添加你的 reducer actions
    setSelectedTab(state, action) {
        state.tabKey = action.payload;
        if (state.tabKey === "1" && state.num > 0) {
          state.num -= 1;
        } else if (state.tabKey === "1" && state.num === 0) {
          state.num = 0;
        } else {
          state.num += 1;
        }
    },
    setSelectedTitle(state, action) {
      state.title = action.payload;
      if (state.title === "" && state.num > 0) {
        state.num -= 1;
      } else if (state.title === "" && state.num === 0) {
        state.num = 0;
      } else {
        state.num += 1;
      }
    },
    cleanAll(state) {
        state.tabKey = "1";
        state.title = "";
        state.num = 0;
    },
  },
});

export const {
  // 添加你的 reducer actions
  setSelectedTab,
  setSelectedTitle,
  cleanAll,
} = SearchControl.actions;

export default SearchControl.reducer;