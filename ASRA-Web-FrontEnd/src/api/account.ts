import { Profile } from "models/User";
import { post, get } from "../commons/utils/axios";

export function getUserInformation() {
  return get("/account/get-profile").then((obj: any) => obj);
}

export function updateProfile(data: any) {
  return post("/account/edit-profile", data).then((obj) => obj);
}

export function changePassword(oldPassword: string, newPassword: string) {
  return post("/account/change-password", { oldPassword, newPassword }).then(
    (obj) => obj
  );
}

export function becomeInnkeeper(data: any) {
  return post("/account/become-innkeeper", data).then((obj) => obj);
}

export function becomeInnkeeperStatus() {
  return get("/account/become-innkeeper-status").then((obj: any) => obj);
}

export function getAllUsersByInnkeeperRoom() {
  return get("/account/get-all-user-innkeeper-role").then((obj) => obj);
}

export function getAllUserByUsername(username: string) {
  return get(`/account/get-all-user-name?username=${username}`).then(
    (obj) => obj
  );
}

export function getAllUserByUsernameAndInnkeeperRole(username: string) {
  return get(`/account/get-all-innkeeper-name?username=${username}`).then(
    (obj) => obj
  );
}

export function getAllUserDepositedRoom(roomId: number) {
  return get(`/account/get-all-user-deposited-room?id=${roomId}`).then(
    (obj) => obj
  );
}

export function requestForgotPassword(email: any){
  return get(`/account/forgot-password?mail=${email}`).then(
    (obj) => obj
  );
}

export function newPassword(data:any){
  return post(`/account/forgot-password-change`,data).then(
    (obj) => obj
  );
}