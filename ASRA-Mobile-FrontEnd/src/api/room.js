import { get, post } from "../utils/axios";

export function suggestionRooms() {
  return get("/room/suggesstion-room").then((obj) => obj);
}

export function searchTrends() {
  return get("/room/search-trend").then((obj) => obj);
}

export function searchRooms(data) {
  return post("/room/search-room", data).then((obj) => obj);
}

export function getRoomAround(data) {
  return post("/room/around", data).then((obj) => obj);
}

export function getMyRoomsTenant(data) {
  return post("/room/my-rooms-tenant/", data).then((obj) => obj);
}
