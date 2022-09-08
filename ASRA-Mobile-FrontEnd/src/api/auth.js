import { post, get } from "../utils/axios";

export function login(data) {
  return post("/auth/signin", data).then((obj) => obj);
}

export function register(
  fullname,
  username,
  email,
  phoneNumber,
  city,
  district,
  ward,
  streetName,
  password
) {
  const data = {
    fullname,
    username,
    email,
    phoneNumber,
    city,
    district,
    ward,
    streetName,
    password,
  };
  return post("/auth/signup", data).then((obj) => obj);
}

export function logout() {
  const data = {};
  return get("/auth/logout", data).then((obj) => obj);
}

export function getInfo() {
  return get("/get-info").then((obj) => obj);
}
