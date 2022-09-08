import { post, get } from "../commons/utils/axios";
export function login(username: string, password: string) {
  const data = {
    username,
    password,
  };
  return post("/auth/signin", data).then((obj) => obj);
}

export function register(
  fullname: string,
  username: string,
  email: string,
  phoneNumber: string,
  city: string,
  district: string,
  ward: string,
  streetName: string,
  password: string
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
