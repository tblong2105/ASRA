import { get, post } from "../commons/utils/axios";


export function getDepositList(data: any) {
  return post("/deposit/", data).then((obj) => obj);
}

export function createDepositRequest(data: any) {
  return post("/deposit/new", data).then((obj) => obj);
}

export function getDepositedRoom(page: any){
  return get(`/deposit/all?page=${page}`).then((obj: any) => obj);
}

export function checkDepositExist(roomId: number){
  return get(`/deposit/check-exist/${roomId}`).then((obj) => obj);
}

export function cancelDeposit(depositId: number){
  return get(`/deposit/cancel-deposit/${depositId}`).then((obj) => obj);
}

export function refundDeposit(depositId: number){
  return get(`/deposit/refund-deposit/${depositId}`).then((obj) => obj);
}