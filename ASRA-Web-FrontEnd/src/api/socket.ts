import axios from "axios";
const PRODUCTION_BASE_URL = "14.225.254.106";
const DEVELOPMENT_BASE_URL = "localhost";

export function checkUserExited(username: string) {
  return axios
    .get(
      `http://${PRODUCTION_BASE_URL}:5001/api/users/exited?username=${username}`
    )
    .then((obj) => obj.data);
}

export function createNewUser(data: any) {
  return axios
    .post(`http://${PRODUCTION_BASE_URL}:5001/api/users/create`, data)
    .then((obj) => obj.data);
}

export function resetNumberOfNewNotification(username: string) {
  return axios
    .get(
      `http://${PRODUCTION_BASE_URL}:5001/api/users/reset-number-of-new-notification?username=${username}`
    )
    .then((obj) => obj.data);
}

export function getNotifications(username: string) {
  return axios
    .get(
      `http://${PRODUCTION_BASE_URL}:5001/api/notifications?username=${username}`
    )
    .then((obj) => obj.data);
}

export function readNotification(data: any) {
  return axios
    .post(`http://${PRODUCTION_BASE_URL}:5001/api/notifications/read`, data)
    .then((obj) => obj.data);
}

export function findNotificationsUnread(username: string) {
  return axios
    .get(
      `http://${PRODUCTION_BASE_URL}:5001/api/notifications/status/?username=${username}`
    )
    .then((obj) => obj.data);
}
