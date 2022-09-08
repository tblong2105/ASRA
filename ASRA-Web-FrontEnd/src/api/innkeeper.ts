import { post, get } from "../commons/utils/axios";


export function getInnkeeperInformation(innkeeperId: number){
  return get(`/innkeeper/information/${innkeeperId}`).then((obj: any) => obj);
}