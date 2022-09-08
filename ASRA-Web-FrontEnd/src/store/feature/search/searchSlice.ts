import { createSlice, PayloadAction } from "@reduxjs/toolkit";
const initialState = {
  search: '',
  location:'',
  searchParams:{},
  citySearch: false,
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    dataSearch: (state: any, action: PayloadAction<any>) => {
      return {
        ...state,
        search: action.payload
      }
    },
    dataLocation: (state: any, action: PayloadAction<any>) => {
      return {
        ...state,
        location: action.payload
      }
    },
    searchParams: (state: any, action: PayloadAction<any>) => {
      return {
        ...state,
        location: action.payload
      }
    },
    citySearch: (state: any, action: PayloadAction<any>) => {
      return {
        ...state,
        citySearch: action.payload
      }
    },
  },
  extraReducers: (builder) => {},
});



export const { dataSearch, dataLocation, searchParams, citySearch } = searchSlice.actions;

export default searchSlice.reducer;
