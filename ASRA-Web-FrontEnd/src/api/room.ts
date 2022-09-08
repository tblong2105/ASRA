import { SearchParams } from "models/Room/Search";
import { Room_Type } from "commons/constants/MasterData";
import { post, get } from "../commons/utils/axios";
import { getLatLongData } from "commons/utils/latlng";

export function getRoomType() {
  const a = get("/master/get-room-type").then((obj) => {
    localStorage.setItem(Room_Type, JSON.stringify(obj));
    return obj;
  });

  return a.then();
}

export async function createRoom(data: any) {
  await getLatLongData(data).then((res: any) => {
    data = {
      ...data,
      lat: res.lat,
      lng: res.lng,
    };
  });
  return await post("/room/create-room", data).then((obj) => obj);
}

export async function editRoom(data: any) {
  let dataReq = {};
  if (!data?.deleteImageFlag) {
    await getLatLongData(data).then((res: any) => {
      dataReq = {
        ...data,
        lat: res.lat,
        lng: res.lng,
      };
    });
  } else {
    dataReq = data;
  }
  return await post("/room/edit-room", dataReq).then((obj) => obj);
}

export function searchRooms(resResponse: SearchParams) {
  if (resResponse.page === 0) {
    resResponse.page = 1;
  }
  return post("/room/search-room", resResponse).then((obj) => obj);
}

export function searchTrends() {
  return get("/room/search-trend").then((obj) => obj);
}

export function suggestionRooms() {
  return get("/room/suggesstion-room").then((obj) => obj);
}

export function getRoomDetail(data: any) {
  return post("/room/detail-room", data).then((obj) => obj);
}

export function getMyRoomsTenant(data: any) {
  return post("/room/my-rooms-tenant/", data).then((obj) => obj);
}

export function getMyRoomsInnkeeper(data: any) {
  return post("/room/my-rooms-innkeeper/", data).then((obj) => obj);
}

export function getRentalPrice(roomId: number) {
  return get(`/room/rental-price/${roomId}`).then((obj) => obj);
}

export function visibleRoom(data: any) {
  return post("/room/visible-room", data).then((obj) => obj);
}
