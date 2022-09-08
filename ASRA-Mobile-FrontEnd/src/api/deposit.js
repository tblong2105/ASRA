import { get, post } from "../utils/axios";

export function createDepositRequest(data) {
  return post("/deposit/new", data).then((obj) => obj);
}

export function checkDepositExist(roomId) {
  return get(`/deposit/check-exist/${roomId}`).then((obj) => obj);
}
