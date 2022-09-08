import { post, get } from "../commons/utils/axios";

export function editRoomDetail(data: any) {
  return post("/room-detail/edit", data).then((obj) => obj);
}

export function getRoomDetailName(roomId: string) {
  return get(`/room-detail/room-detail-name/${roomId}`).then((obj: any) => obj);
}

export function getRoomDetailWithContract(roomDetailId: string) {
  return get(`/room-detail/${roomDetailId}`).then((obj: any) => obj);
}