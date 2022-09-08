import { SCREEN_LAYOUT } from "../commons/constants";
import Home from "../views/pages/home-screen/Home";
import Signin from "../views/pages/auth-screen/Signin";
import Signup from "../views/pages/auth-screen/Signup";
import Search from "../views/pages/search-screen/Search";
import CreateRoom from "../views/pages/room-screen/create-room";
import ForgotPassword from "../views/pages/forgot-password-screen/ForgotPassword";
import NewPassword from "../views/pages/new-password-screen/NewPassword";
import RoomDetail from "../views/pages/room-screen/room-detail-summary/RoomDetailSummary";
import Manage from "../views/pages/manage-screen/Manage";
import CreateContract from "../views/pages/contract-screen/create-contract";
import PreviewContract from "../views/pages/contract-screen/preview-contract";
import PayPal from "views/pages/room-screen/room-detail-summary/deposit-holder/PayPal";
import ViewDetailContract from "views/pages/contract-screen/view-detail-contract/view-detail-contract";
import PaymentPayPal from "views/pages/payment-screen/payment/Payment-Paypal";
import PaymentPayPalNative from "views/pages/payment-screen/payment-native/Payment-Paypal-Native";
import Dashboard from "views/pages/admin/dashboard/Dashboard";
import RoomListAdmin from "views/pages/admin/room/Room";
import UserListAdmin from "views/pages/admin/user/User";
import InnkeeperListAdmin from "views/pages/admin/innkeeper/Innkeeper";
import PaymentListAdmin from "views/pages/admin/payment/Payment";
import PaymentInformation from "views/pages/payment-screen/payment-information/payment-information";
import AboutUs from "../views/pages/about-us-screen";
import DepositHolderNativeAppPaypal from "views/pages/room-screen/room-detail-summary/deposit-holder-native-app/DepositHolderNativeAppPaypal";
import DepositHolderInformation from "views/pages/room-screen/room-detail-summary/deposit-holder-information/deposit-holder-information";

const authRoutes = [
  { path: "/login", component: Signin, layout: SCREEN_LAYOUT.DEFAULT_LAYOUT },
  {
    path: "/register",
    component: Signup,
    layout: SCREEN_LAYOUT.DEFAULT_LAYOUT,
  },
  {
    path: "/forgot-password",
    component: ForgotPassword,
    layout: SCREEN_LAYOUT.DEFAULT_LAYOUT,
  },
  {
    path: "/forgot-password-verify/:token",
    component: NewPassword,
    layout: SCREEN_LAYOUT.DEFAULT_LAYOUT,
  },
];

const guestRoutes = [
  { path: "/", component: Home, layout: SCREEN_LAYOUT.DEFAULT_LAYOUT },
  {
    path: "/search",
    component: Search,
    layout: SCREEN_LAYOUT.HEADER_ONLY_LAYOUT,
  },
  {
    path: "/search/address=:",
    component: Search,
    layout: SCREEN_LAYOUT.HEADER_ONLY_LAYOUT,
  },
  {
    path: "/search/*",
    component: Search,
    layout: SCREEN_LAYOUT.HEADER_ONLY_LAYOUT,
  },
  {
    path: "/about-us",
    component: AboutUs,
    layout: SCREEN_LAYOUT.HEADER_ONLY_LAYOUT,
  },
  {
    path: "/room/:roomId",
    component: RoomDetail,
    layout: SCREEN_LAYOUT.DEFAULT_LAYOUT,
  },
  {
    path: "/paypal/native/deposit-info/:depositInfo/user-info/:userInfo",
    component: DepositHolderNativeAppPaypal,
    layout: SCREEN_LAYOUT.FRAGMENT_LAYOUT,
  },
  {
    path: "/payment/bill/native/:billId",
    component: PaymentPayPalNative,
    layout: SCREEN_LAYOUT.DEFAULT_LAYOUT,
  },
];

const userRoutes = [
  {
    path: "/manage/room-rented/:roomId/room-no/:roomDetailId",
    component: RoomDetail,
    layout: SCREEN_LAYOUT.DEFAULT_LAYOUT,
  },
  {
    path: "/paypal",
    component: PayPal,
    layout: SCREEN_LAYOUT.DEFAULT_LAYOUT,
  },
  {
    path: "/contract/detail/:contractId",
    component: ViewDetailContract,
    layout: SCREEN_LAYOUT.DEFAULT_LAYOUT,
  },
  {
    path: "/payment/bill/:billId",
    component: PaymentPayPal,
    layout: SCREEN_LAYOUT.DEFAULT_LAYOUT,
  },
  {
    path: "/payment/information/:billId",
    component: PaymentInformation,
    layout: SCREEN_LAYOUT.DEFAULT_LAYOUT,
  },
  {
    path: "/depositholder/information",
    component: DepositHolderInformation,
    layout: SCREEN_LAYOUT.DEFAULT_LAYOUT,
  },
  {
    path: "/manage",
    component: Manage,
    layout: SCREEN_LAYOUT.DEFAULT_LAYOUT,
  },
];

const innkeeperRoutes = [
  {
    path: "/room/new",
    component: CreateRoom,
    layout: SCREEN_LAYOUT.DEFAULT_LAYOUT,
  },
  {
    path: "/contract/new",
    component: CreateContract,
    layout: SCREEN_LAYOUT.DEFAULT_LAYOUT,
  },
  {
    path: "/contract/preview",
    component: PreviewContract,
    layout: SCREEN_LAYOUT.DEFAULT_LAYOUT,
  },
  {
    path: "/manage/room-for-rent/:roomId",
    component: RoomDetail,
    layout: SCREEN_LAYOUT.DEFAULT_LAYOUT,
  },
  {
    path: "/manage/room-for-rent/:roomId/edit",
    component: CreateRoom,
    layout: SCREEN_LAYOUT.DEFAULT_LAYOUT,
  },
];

const adminRoutes = [
  {
    path: "/admin/dashboard",
    component: Dashboard,
    layout: SCREEN_LAYOUT.FRAGMENT_LAYOUT,
  },
  {
    path: "/admin/room",
    component: RoomListAdmin,
    layout: SCREEN_LAYOUT.FRAGMENT_LAYOUT,
  },
  {
    path: "/admin/user",
    component: UserListAdmin,
    layout: SCREEN_LAYOUT.FRAGMENT_LAYOUT,
  },
  {
    path: "/admin/innkeeper",
    component: InnkeeperListAdmin,
    layout: SCREEN_LAYOUT.FRAGMENT_LAYOUT,
  },
  {
    path: "/admin/payment",
    component: PaymentListAdmin,
    layout: SCREEN_LAYOUT.FRAGMENT_LAYOUT,
  },
];

export { guestRoutes, userRoutes, authRoutes, innkeeperRoutes, adminRoutes };
