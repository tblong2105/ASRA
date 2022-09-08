import { CreateContractRequestBody } from "models/Contract";
import { post, get } from "../commons/utils/axios";


export function createContract(data: CreateContractRequestBody){
  return post(`/contract/create`, data).then((obj: any) => obj);
}

export function getContractDetail(contractId: string){
  return get(`/contract/detail/${contractId}`).then((obj: any) => obj);
}

export function getInnkeeperContractList(roomId: string){
  return get(`/contract/innkeeper/list/${roomId}`).then((obj: any) => obj);
}

export function getWaitingContract(page: any){
  return get(`/contract/account/list-wait?page=${page}`).then((obj: any) => obj);
}

export function terminateContract(contractId: any){
  return get(`/contract/terminate/${contractId}`).then((obj: any) => obj);
}

export function requestTerminateContract(contractId: any){
  return get(`/contract/request-terminate/${contractId}`).then((obj: any) => obj);
}