import { memo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Spin } from "antd";
import moment from "moment";

import { NOTIFICATION_TYPE } from "commons/constants";

function Notification({
  handleReadNotification,
  setNotificationStatusAtComponentChild,
  notificationList,
  showNotification,
  setNotificationRef,
  notificationLoading,
}: any) {
  const navigate = useNavigate();
  const notificationRef = useRef<any>(null);

  const handleClickNotificationDetail = (notification: any) => {
    if (!notification?.isRead) {
      handleReadNotification(notification?.id);
    }
    switch (true) {
      case NOTIFICATION_TYPE.DEPOSIT === notification?.type:
        navigate(`/manage/room-for-rent/${notification?.roomId}`, {
          state: {
            sender: notification?.sender,
          },
        });
        break;
      case NOTIFICATION_TYPE.CREATE_CONTRACT === notification?.type:
        navigate("/manage", {
          state: {
            sender: notification?.sender,
            tabkey: 5,
          },
        });
        break;
      case NOTIFICATION_TYPE.BECOME_INNKEEPER === notification?.type:
        navigate("/admin/innkeeper", {
          state: {
            sender: notification?.sender,
          },
        });
        break;
      case NOTIFICATION_TYPE.ACCEPT_OR_REJECT === notification?.type:
        navigate("/room/new");
        break;
      case NOTIFICATION_TYPE.SIGN_CONTRACT === notification?.type:
        navigate(`/contract/detail/${notification?.contractId}`);
        break;
      default:
        break;
    }

    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  const handleGetNotificationByStatus = (status: string) => {
    setNotificationStatusAtComponentChild(status);
  };

  useEffect(() => {
    // Get notification ref from component child
    setNotificationRef(notificationRef);
  }, []);

  return (
    <div
      className={`notification-wrapper ${
        showNotification && `show-notification`
      }`}
      ref={notificationRef}
    >
      <Row className="notification-title">
        <Col>
          <h1>Notification</h1>
        </Col>
      </Row>
      {notificationList?.length !== 0 ? (
        <>
          <Row style={{ marginLeft: "12px" }}>
            <Col className="all-text" span={4}>
              <span onClick={() => handleGetNotificationByStatus("All")}>
                All
              </span>
            </Col>
            <Col
              style={{ marginLeft: "10px" }}
              className="unread-text"
              span={5}
            >
              <span onClick={() => handleGetNotificationByStatus("Unread")}>
                Unread
              </span>
            </Col>
          </Row>
          <Row style={{ margin: "8px 8px 0 12px" }}>
            <Col className="news-text" span={18}>
              <span>News</span>
            </Col>
            <Col className="see-all-text" span={6}>
              <span>See all</span>
            </Col>
          </Row>
          <Spin spinning={notificationLoading} delay={0}>
            <ul className="notification-contain">
              {notificationList?.map((notification: any) => {
                return (
                  <li
                    key={notification?.id}
                    onClick={() => handleClickNotificationDetail(notification)}
                  >
                    <Row>
                      <Col span={21}>
                        <Row className="notification-card">
                          <Col className="avatar" span={4}>
                            {notification?.thumbnail ? (
                              <img src={notification?.thumbnail} alt="avatar" />
                            ) : (
                              <div
                                style={{
                                  width: "46px",
                                  height: "46px",
                                  borderRadius: "23px",
                                  backgroundColor: "#595959",
                                  border: "0.6px solid #8b8b8b",
                                  color: "#fff",
                                  fontSize: "20px",
                                  fontWeight: "bold",
                                  textTransform: "uppercase",
                                }}
                              >
                                <span
                                  style={{
                                    position: "absolute",
                                    top: "14px",
                                    left: "22px",
                                  }}
                                >
                                  {notification?.sender?.charAt(0)}
                                </span>
                              </div>
                            )}
                          </Col>
                          <Col className="notification-body" span={20}>
                            <p className="content">
                              <b>{notification?.sender}</b>&nbsp;
                              {notification?.message}
                            </p>
                          </Col>
                          <Col>
                            <Col
                              style={
                                !notification?.isRead
                                  ? { color: "#00bfb9" }
                                  : {}
                              }
                              className="date"
                            >
                              <span>
                                {moment(
                                  Date.parse(notification?.createdAt)
                                ).format("DD-MMM-YYYY")}
                              </span>
                            </Col>
                          </Col>
                        </Row>
                      </Col>
                      <Col className="notification-active" span={3}>
                        {!notification?.isRead && (
                          <div className="active-icon" />
                        )}
                      </Col>
                    </Row>
                  </li>
                );
              })}
            </ul>
          </Spin>
        </>
      ) : (
        <div className="no-data-notification">
          <img
            src="https://batdongsan.com.vn/trang-ca-nhan/images/icons/noti-empty-icon.svg"
            alt="no data"
          />
        </div>
      )}
    </div>
  );
}

export default memo(Notification);
