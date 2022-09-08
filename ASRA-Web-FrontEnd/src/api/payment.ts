import { post, get } from "../commons/utils/axios";


export function CreatePayment(data: any){
  return post(`/payment/create`,data).then((obj: any) => obj);
}