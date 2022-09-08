import { post } from "../commons/utils/axios";

export function deleteImage(data: any) {
  return post("/image-master/delete", data).then((obj) => obj);
}
