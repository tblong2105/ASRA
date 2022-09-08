import { memo } from "react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  BellOutlined,
  CaretDownOutlined,
  LogoutOutlined,
  UserOutlined,
  LockOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";

import { useAppSelector } from "app/hooks";
import { imageSelector } from "store/selectors";
import { ROLE_ADMIN } from "commons/constants/Role";
import { manageItems } from "commons/masterData/MenuManage";

import Notification from "./Notification";

function AccountMenu({
  handleResetNumberOfNewNotification,
  handleReadNotification,
  setNotificationComponentParentRef,
  setNotificationStatusAtComponentChild,
  handleLogout,
  setBellIconRef,
  showNotification,
  numberOfNewNotification,
  notificationList,
  notificationLoading,
}: any) {
  const navigate = useNavigate();
  const image = useAppSelector(imageSelector);

  let userInfor = JSON.parse(localStorage.getItem("userInfor") || "{}");

  const bellIconRef = useRef<any>(null);

  useEffect(() => {
    // Get bell icon ref from component child
    setBellIconRef(bellIconRef);
  }, [bellIconRef]);

  const handleNavigateManage = (index: number, tabkey: number) => {
    manageItems.forEach((element) => {
      element.className = "";
    });
    manageItems[index].className = "active";
    navigate("/manage", {
      state: {
        tabkey: tabkey,
      },
    });
  };

  const setNotificationRef = (notificationRef: any) => {
    setNotificationComponentParentRef(notificationRef);
  };

  return (
    <>
      {/* NOTIFICATION */}
      <div
        onClick={() =>
          numberOfNewNotification && handleResetNumberOfNewNotification()
        }
        className="bell-icon"
      >
        {numberOfNewNotification !== undefined &&
          numberOfNewNotification !== 0 && (
            <div className="notification-count">
              <span>{numberOfNewNotification}</span>
            </div>
          )}
        <BellOutlined className="bell" ref={bellIconRef} />
        <Notification
          handleReadNotification={handleReadNotification}
          setNotificationRef={setNotificationRef}
          setNotificationStatusAtComponentChild={
            setNotificationStatusAtComponentChild
          }
          notificationList={notificationList}
          showNotification={showNotification}
          notificationLoading={notificationLoading}
        />
      </div>
      {/* ACCOUNT MENU */}
      <div className="action">
        <div className="profile">
          <div className="username">
            <p>{userInfor?.username}</p>
            <CaretDownOutlined />
          </div>
          <div className="arrow-icon"></div>
          <div
            onClick={() =>
              !userInfor?.roles?.includes(ROLE_ADMIN) &&
              handleNavigateManage(0, 1)
            }
          >
            {userInfor?.image || image ? (
              <img className="thumbnail" src={userInfor?.image || image} />
            ) : (
              <button className="btn-logout">
                <span className="first-character-name">
                  {userInfor?.username?.charAt(0)}
                </span>
              </button>
            )}
          </div>
        </div>
        <div className="menu">
          <h3>
            {userInfor.fullname}
            <br />
            <span>{userInfor.email}</span>
          </h3>
          <ul>
            {!userInfor?.roles?.includes(ROLE_ADMIN) && (
              <li>
                <DatabaseOutlined />
                <a onClick={() => handleNavigateManage(0, 1)}>Management</a>
              </li>
            )}
            {/*
            Kh fix dc bug tab manage nen cmt 
            <li>
              <LockOutlined />
              <a onClick={() => handleNavigateManage(5, 6)}>Change Password</a>
            </li> */}
            <li onClick={handleLogout}>
              <LogoutOutlined />
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default memo(AccountMenu);
