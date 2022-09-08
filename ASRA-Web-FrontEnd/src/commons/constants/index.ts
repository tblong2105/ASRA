import { INNKEEPER_STATUS } from "./LocalstorageConstant";
export const DATE_SETTING = {
  FORMAT_DISPLAY: "YYYY/MM/DD",
  FORMAT: "yyyy/MM/dd",
};

export const AXIOS_ERROR = "AxiosError";

export const SCREEN_LAYOUT = {
  DEFAULT_LAYOUT: "DEFAULT_LAYOUT",
  HEADER_ONLY_LAYOUT: "HEADER_ONLY_LAYOUT",
  FRAGMENT_LAYOUT: "FRAGMENT_LAYOUT",
};

export const ROUTER_TYPE = {
  PUBLIC_ROUTER: "PUBLIC_ROUTER",
  AUTH_ROUTER: "AUTH_ROUTER",
  PRIVATE_ROUTER: "PRIVATE_ROUTER",
};

export const IMAGE_RESOURCE = {
  LOCAL: "LOCAL",
  FIREBASE: "FIREBASE",
  THUMBNAIL: "THUMBNAIL",
};

export const IMAGE_TYPE = {
  PNG: "image/png",
  JPEG: "image/jpeg",
};

export const IMAGE_CITIZEN_IDENTITY = {
  FRONT: "FRONT",
  BACKSIZE: "BACKSIZE",
};

export const DEPOSIT_REQUEST_STATUS = {
  PENDING_APPROVAL: "PENDING_APPROVAL",
  APPROVED: "APPROVED",
  CANCEL: "CANCEL",
  REFUND: "REFUND",
};

export const ROOM_PATH = {
  FROM_HOME: "/room/",
  FROM_MY_ROOMS: "/room-rented/",
  FROM_MY_ROOMS_FOR_RENT: "/room-for-rent/",
};

export const IDRECOGNITION_API_KEY = "yKaQ6QFrnTQ4uVOHr3TXBgmxeUa3pXgK";
export const EXCHANGE_CURRENCE_API_KEY = "UpWYJxKEKsGY4HmCriQB5JBltxN0xnqS";

export const CONTRACT_STATUS = {
  ROOM_EMPTY: "ROOM EMPTY",
  ROOM_RENTED: "ROOM RENTED",
  WAITING_TENANT_CONFIRM: "WAITING_TENANT_CONFIRM",
  IS_ACTIVE: "IS_ACTIVE",
  ALMOST_EXPIRED: "ALMOST_EXPIRED",
  EXPIRED: "EXPIRED",
  CHECKED_OUT: "CHECKED_OUT",
  TERMINATE: "TERMINATE",
  REQUEST_TERMINATE: "REQUEST_TERMINATE",
};

export const NOTIFICATION_TYPE = {
  DEPOSIT: "DEPOSIT",
  BECOME_INNKEEPER: "BECOME INNKEEPER",
  ACCEPT_OR_REJECT: "ACCEPT OR REJECT",
  CREATE_CONTRACT: "CREATE CONTRACT",
  SIGN_CONTRACT: "SIGN CONTRACT"
};

export const ROLE_PATH = {
  ADMIN: "/admin",
};

export const BECOME_INNKEEPER = {
  PENDING_APPROVAL: "PENDING_APPROVAL",
  APPROVED: "APPROVED",
};