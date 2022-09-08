import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthPayload, SignupPayload } from "models/User";
import {
  getToken,
  setToken,
  removeToken,
} from "commons/utils/js-cookie";
import { login, register } from "api/auth";
import { AXIOS_ERROR } from "commons/constants";

const initialState: AuthPayload = {
  username: "",
  password: "",
  name: "",
  image: "",
  roles: [],
  isLoggedIn: false,
  token: getToken(),
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<any>) => {
      state.isLoggedIn = true;
    },
    loginSuccess: (state, action: PayloadAction<any>) => {
      state.isLoggedIn = true;
      state.name = action.payload.data.name;
      let { token } = action.payload.data;
      localStorage.setItem("username", action.payload.data.name);
      setToken(token, 4320);
    },
    getInfo: (state, action: PayloadAction<any>) => {
      state.image = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      removeToken();
    },
    resetUserData: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(Register.fulfilled, (state, action: PayloadAction<any>) => {})
      .addCase(Register.rejected, (state, action: PayloadAction<any>) => {})
      .addCase(Login.fulfilled, (state, action: PayloadAction<any>) => {
        if (action.payload.name === AXIOS_ERROR) return;
        state.isLoggedIn = true;
        state.name = action.payload.username;
        let { token } = action.payload;
        localStorage.setItem("username", action.payload.username);
        localStorage.setItem("userInfor", JSON.stringify(action.payload));
        setToken(token, 4320);
      })
      .addCase(Login.rejected, (state, action: PayloadAction<any>) => {});
  },
});

export const Register = createAsyncThunk(
  "/auth/register",
  async (user: SignupPayload) => {
    let { fullname, username, email, phoneNumber, city, district, ward, streetName, password } = user;
    let data = await register(fullname, username, email, phoneNumber, city, district, ward, streetName, password)
      .then((res: any) => res)
      .catch((err: any) => err);
    return data;
  }
);

export const Login = createAsyncThunk(
  "/auth/login",
  async (user: AuthPayload) => {
    let { username, password } = user;
    let data = await login(username, password)
      .then((res: any) => res)
      .catch((err: any) => err);  
    return data;
  }
);

export const authActions = userSlice.actions;

export default userSlice.reducer;
