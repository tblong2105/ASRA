import { post } from "../utils/axios";

export function createPayment(data) {
  return post(`/payment/create`, data).then((obj) => obj);
}
