import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Room } from "models/Room";

const initialState: Room = {
  room: {
    roomType: "",
    roomsName: [],
    capacity: 0,
    gender: "",
    roomArea: 0,
    rentalPrice: 0,
    deposit: 0,
    electricityCost: 0,
    waterCost: 0,
    internetCost: 0,
    city: "",
    district: "",
    ward: "",
    streetName: "",
    imageList: [],
    thumbnailImage: null,
    utilities: [],
    title: "",
    description: "",
  },
};

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    dataRoom: (state: any, action: PayloadAction<any>) => {
      return {
        ...state,
        room: { ...state.room, ...action.payload },
      };
    },
    resetDataRoom: () => initialState,
  },
  extraReducers: (builder) => {},
});

export const { dataRoom, resetDataRoom } = roomSlice.actions;

export default roomSlice.reducer;
