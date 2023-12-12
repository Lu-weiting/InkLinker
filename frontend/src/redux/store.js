import { configureStore } from "@reduxjs/toolkit";

import LoadingControl from "./LoadingControl";
import SearchControl from "./SearchControl";

const store = configureStore({
  reducer: {
    SearchControl: SearchControl,
    LoadingControl: LoadingControl
  },
});

export default store;