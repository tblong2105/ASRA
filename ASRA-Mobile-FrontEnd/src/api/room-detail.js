import { post, get } from "../utils/axios";

export function getRoomDetailWithContract(roomDetailId) {
  return get(`/room-detail/${roomDetailId}`).then((obj) => obj);
}

export function getRoomDetail(data) {
  return post("/room/detail-room", data).then((obj) => obj);
}
