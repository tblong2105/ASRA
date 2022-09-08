import { post, get } from "../commons/utils/axios";

export function getAllRoomAdmin(data: any) {
  return post("/admin/get-all-room", data).then((obj) => obj);
}

export function getAllUserAdmin(data: any) {
  return post("/admin/get-all-user", data).then((obj) => obj);
}

export function getAllInnkeepers(data: any) {
  return post("/admin/get-all-innkeepers", data).then((obj) => obj);
}

export function getDetailsInnkeeper(id: any) {
  return get(`/admin/get-details-innkeeper?id=${id}`).then((obj) => obj);
}

export function updateStatusInnkeeper(data: any) {
  return post("/admin/update-status-innkeeper", data).then((obj) => obj);
}

export function getAllPayments(data: any) {
  return post("/admin/get-all-payments", data).then((obj) => obj);
}

export function getDashboardData() {
  return get(`/admin/get-dashboard`).then((obj) => obj);
}
