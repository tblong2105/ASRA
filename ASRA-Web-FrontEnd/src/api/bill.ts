import { post, get } from "../commons/utils/axios";


export function getBilltDetail(billId: string){
  return get(`/bill/view/${billId}`).then((obj: any) => obj);
}

export function paymentBillForRoom(data: any){
  return post(`/bill/payment`,data).then((obj: any) => obj);
}

export function createBillNormal(data: any){
  return post(`/bill/create`,data).then((obj: any) => obj);
}