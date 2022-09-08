import { createElement, useState, useEffect, memo, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import classnames from "classnames/bind";

import { SocketContext } from "app/socket";
import { useAppDispatch } from "app/hooks";
import { authActions } from "store/feature/auth/authSlice";
import {
  INNKEEPER_STATUS,
  USERNAME,
  USER_INFOR,
} from "commons/constants/LocalstorageConstant";
import { getToken } from "commons/utils/js-cookie";

import {
  getNotifications,
  resetNumberOfNewNotification,
  readNotification,
  findNotificationsUnread,
} from "api/socket";

import AccountMenu from "../../Header/AccountMenu";
import styles from "./index.module.scss";
import "./index.scss";

function HeaderAdmin({ collapsed, handleCollapsed }: any) {
  const { Header } = Layout;
  const cx = classnames.bind(styles);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const userInfor = JSON.parse(localStorage.getItem("userInfor") || "{}");
  const socket = useContext(SocketContext);

  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationList, setNotificationList] = useState<any[]>([]);
  const [numberOfNewNotification, setNumberOfNewNotification] =
    useState<number>(0);
  const [notificationComponentRef, setNotificationComponentRef] =
    useState<any>(null);
  const [bellIconComponentRef, setBellIconComponentRef] = useState<any>(null);
  const [notificationLoading, setNotificationLoading] =
    useState<boolean>(false);
  let token = Boolean(getToken());

  const handleResetNumberOfNewNotification = () => {
    resetNumberOfNewNotification(userInfor?.username).then((res: any) =>
      setNumberOfNewNotification(res?.data?.numberOfNewNotification)
    );
  };

  const handleReadNotification = (notificationId: string) => {
    let dataReq = {
      notificationId: notificationId,
    };
    let notificationsNewData = notificationList.map((notification) => {
      if (notification?.id === notificationId) {
        notification.isRead = true;
        readNotification(dataReq)
          .then((res) => {})
          .catch((err) => {});
      }
      return notification;
    });

    setNotificationList(notificationsNewData);
  };

  const handleLogout = () => {
    localStorage.removeItem(INNKEEPER_STATUS);
    localStorage.removeItem(USER_INFOR);
    localStorage.removeItem(USERNAME);

    dispatch(authActions.logout());
    dispatch(authActions.resetUserData());
    socket?.emit("removeUser");
    // navigate("/login");
    window.location.href = "/login";
  };

  const setNotificationComponentParentRef = (notificationRef: any) => {
    setNotificationComponentRef(notificationRef);
  };

  const setBellIconComponentParentRef = (bellIconRef: any) => {
    setBellIconComponentRef(bellIconRef);
  };

  const setNotificationStatusAtComponentChild = (status: string) => {
    setNotificationLoading(true);
    if (status === "Unread") {
      findNotificationsUnread(userInfor?.username).then((res) => {
        setNotificationList(res?.data?.notificationList);
        setNotificationLoading(false);
      });
    } else {
      getNotifications(userInfor?.username).then((res) => {
        let data = res.data;
        setNotificationList(data?.notificationList);
        setNotificationLoading(false);
      });
    }
  };

  useEffect(() => {
    socket.emit("addNewUser", userInfor?.username);
    socket?.on("getNotification", (data: any) => {
      let notification = {
        roomId: data?.roomId,
        senderId: data?.senderId,
        contractId: data?.contractId,
        id: data?.id,
        sender: data?.senderName,
        message: data?.message,
        isRead: data?.isRead,
        type: data?.type,
        thumbnail: data?.thumbnail,
        createdAt: data?.createdAt,
      };
      if (data?.message) {
        setNumberOfNewNotification(data?.numberOfNewNotification);
        setNotificationList((prev) => [notification, ...prev]);
      }
    });
  }, [socket]);

  useEffect(() => {
    if (token) {
      getNotifications(userInfor?.username).then((res: any) => {
        setNotificationList(res?.data?.notificationList);
        setNumberOfNewNotification(res?.data?.numberOfNewNotification);
      });
    }
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        notificationComponentRef?.current &&
        !notificationComponentRef?.current.contains(event.target) &&
        bellIconComponentRef?.current &&
        !bellIconComponentRef?.current.contains(event.target)
      ) {
        setShowNotification(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [notificationComponentRef]);

  useEffect(() => {
    let bellIcon = document.getElementsByClassName("bell-icon")[0];
    const handleClickInside = (event: any) => {
      let notification = document.getElementsByClassName("show-notification");
      if (
        bellIconComponentRef?.current &&
        bellIconComponentRef?.current.contains(event.target)
      ) {
        setShowNotification(notification?.length !== 0 ? false : true);
      }
    };

    bellIconComponentRef?.current?.addEventListener("click", handleClickInside);

    return () => {
      bellIcon?.removeEventListener("click", handleClickInside);
    };
  }, [bellIconComponentRef]);

  return (
    <Header className="site-layout-background" style={{ padding: 0 }}>
      {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: "trigger",
        onClick: handleCollapsed,
      })}
      <div className="account-menu-wrapper">
        <AccountMenu
          handleLogout={handleLogout}
          handleResetNumberOfNewNotification={
            handleResetNumberOfNewNotification
          }
          handleReadNotification={handleReadNotification}
          setNotificationComponentParentRef={setNotificationComponentParentRef}
          setBellIconRef={setBellIconComponentParentRef}
          setNotificationStatusAtComponentChild={
            setNotificationStatusAtComponentChild
          }
          showNotification={showNotification}
          numberOfNewNotification={numberOfNewNotification}
          notificationList={notificationList}
          notificationLoading={notificationLoading}
        />
      </div>
    </Header>
  );
}

export default memo(HeaderAdmin);
