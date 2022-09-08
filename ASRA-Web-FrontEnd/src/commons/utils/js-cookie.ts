import Cookies from "js-cookie";

const TokenKey = "ASRA";

export function getToken(): any {
  return Cookies.get(TokenKey);
}

export function setToken(token: string, expiredTime: number): any {
  // Comvert from minutes to day
  let expiredTimeDay = expiredTime / 24 / 60;
  return Cookies.set(TokenKey, token, { expires: expiredTimeDay });
}

export function removeToken(): any {
  return Cookies.remove(TokenKey);
}
