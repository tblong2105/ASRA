import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./feature/auth/authSlice";
import RoomReducer from "./feature/room/roomSlice";
import SearchReducer from "./feature/search/searchSlice";

export const store = configureStore({
  reducer: {
    UserReducer,
    RoomReducer,
    SearchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
