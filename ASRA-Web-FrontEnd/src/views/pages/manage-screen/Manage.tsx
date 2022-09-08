import { Col, Row } from "antd";
import classNames from "classnames/bind";
import { useEffect, useState, useContext } from "react";
import styles from "./index.module.scss";
import ChangePassword from "./change-password-screen/ChangePassword";
import EditProfile from "./my-profile/EditProfile";
import MyRooms from "./my-rooms/MyRooms";
import MyRoomsForRent from "./my-rooms-for-rent/MyRoomsForRent";
import MyDepositedRoom from "./my-deposited-room/MyDepositedRoom";
import MyWaitingContract from "./my-waiting-contract/MyWaitingContract";
import { manageItems } from "commons/masterData/MenuManage";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "app/hooks";
import { authActions } from "store/feature/auth/authSlice";
import {
  INNKEEPER_STATUS,
  USERNAME,
  USER_INFOR,
} from "commons/constants/LocalstorageConstant";
import { SocketContext } from "../../../app/socket";
var oldTabKey = 0;
function Manage() {
  const socket = useContext(SocketContext)
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cx = classNames.bind(styles);
  const { state }: any = useLocation();
  const [tabKey, setTabkey] = useState<number>();
  let manageItem: any = manageItems;

  useEffect(() => {
    if (state?.tabkey) {
      itemClick(state.tabkey);
    }
  }, []);

  const itemClick = (tabKey: any) => {
    manageItem.forEach((item: any) => {
      if (tabKey === 1) {
      }

      if (tabKey !== 7) {
        setTabkey(tabKey);
        //Handle active item click
        if (item.tabKey === tabKey) {
          item.className = "active";
        } else {
          item.className = "";
        }
      } else {
        //Handle Logout
        dispatch(authActions.logout());
        localStorage.removeItem(INNKEEPER_STATUS);
        localStorage.removeItem(USER_INFOR);
        localStorage.removeItem(USERNAME);
        socket?.emit("removeUser");
        navigate("/login");
      }
    });
  };

  return (
    <>
      <Row className={cx("manage-screen")}>
        <Col span={8} className={cx("left-content")}>
          <Row className={cx("slide-bar")}>
            <Col span={24} className={cx("manage-item")}>
              {manageItem.map((item: any, index: any) => {
                return (
                  <Row
                    key={index}
                    className={`${cx("item")} ${cx(item.className)}`}
                    onClick={(e: any) => itemClick(item.tabKey)}
                  >
                    <Col span={4}>
                      <div className={item.iconClass}></div>
                    </Col>
                    <Col span={20} className={cx("item-content")}>
                      <Row>
                        <Col span={24} className={cx("item-title")}>
                          {item.title}
                        </Col>
                        <Col span={24} className={cx("item-description")}>
                          {item.description}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                );
              })}
            </Col>
          </Row>
        </Col>
        <Col span={16} className={cx("right-content")}>
          <Row className={cx("component-content")}>
            <Col span={24}>
              {/* Đọc biến manageItem ở đầu file để biết màn hình mình thuộc tabKey nào */}
              {tabKey === 1 && <EditProfile />}
              {tabKey === 2 && <MyRooms />}
              {tabKey === 3 && <MyDepositedRoom />}
              {tabKey === 4 && <MyRoomsForRent />}
              {tabKey === 5 && <MyWaitingContract />}
              {tabKey === 6 && <ChangePassword />}
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
export default Manage;
