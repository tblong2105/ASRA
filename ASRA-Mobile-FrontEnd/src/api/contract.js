import { get, post } from "../utils/axios";
export function getWaitingContract(page){
    return get(`/contract/account/list-wait?page=${page}`).then((obj) => obj);
}

export function getContractDetail(contractId){
  return get(`/contract/detail/${contractId}`).then((obj) => obj);
}