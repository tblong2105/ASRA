import type { RootState } from "./index";

export const usernameSelector = (state: RootState) => state.UserReducer.name;

export const imageSelector = (state: RootState) => state.UserReducer.image;

export const isLoggedInSelector = (state: RootState) =>
  state.UserReducer.isLoggedIn;

export const roomSelector = (state: RootState) => state.RoomReducer.room;

export const searchSelector = (state: RootState) => state.SearchReducer.search;

export const locationSelector = (state: RootState) => state.SearchReducer.location;

export const searchParamsSelector = (state: RootState) => state.SearchReducer.searchParams;

export const citySearchSelector = (state: RootState) => state.SearchReducer.citySearch;


