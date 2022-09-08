import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classnames from "classnames/bind";
import { Row, Col, Image, Spin, Pagination, Tag } from "antd";
import type { PaginationProps } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { getMyRoomsInnkeeper, visibleRoom } from "api/room";

import style from "./MyRoomsForRent.module.scss";
import "./MyRoomForRent.scss";
import Button from "components/Layout/components/Button";
import { openNotification } from "components/helper/Notification";
import { SUCCESS } from "commons/constants/Notification";
import ModalConfirm from "components/helper/ModalConfirm";

const cx = classnames.bind(style);

function MyRoomsForRent() {
  const navigate = useNavigate();

  const [roomList, setRoomList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [room, setRoom] = useState<any>({});
  const [isModalConfirmVisible, setIsModaConfirmlVisible] = useState(false);
  let userInfor = JSON.parse(localStorage.getItem("userInfor") || "{}");
  let userId = userInfor?.id;

  const handlePaginationChange: PaginationProps["onChange"] = (pageNumber) => {
    let dataReq = {
      id: userId,
      page: pageNumber,
    };
    setCurrentPage(pageNumber);
    setLoading(true);
    getMyRoomsInnkeeper(dataReq).then((res: any) => {
      setRoomList(res?.rooms);
      setTotalItems(res?.totalItems);
      setLoading(false);
    });
  };

  const loadData = () => {
    let dataReq = {
      id: userId,
      page: currentPage,
    };
    setLoading(true);
    getMyRoomsInnkeeper(dataReq).then((res: any) => {
      setRoomList(res?.rooms);
      setCurrentPage(res?.currentPage);
      setTotalItems(res?.totalItems);
      setLoading(false);
    });
  };
  useEffect(() => {
    loadData();
  }, []);

  const handleRecordClick = (e: any, room: any) => {
    if (
      e.target.type + "" == "submit" ||
      e.target.innerHTML == "Visible" ||
      e.target.innerHTML == "Invisible"
    ) {
      setRoom(room);
      setIsModaConfirmlVisible(true);
    } else {
      navigate(`/manage/room-for-rent/${room.id}`);
    }
  };

  const handleModalConfirmClick = () => {
    const roomId = room.id;
    visibleRoom({ roomId }).then((result: any) => {
      setIsModaConfirmlVisible(false);
      let dataReq = {
        id: userId,
        page: currentPage,
      };
      getMyRoomsInnkeeper(dataReq).then((res: any) => {
        setRoomList(res?.rooms);
        setCurrentPage(res?.currentPage);
        setTotalItems(res?.totalItems);
        openNotification(SUCCESS, result.message);
      });
    });
  };

  return (
    <>
      {loading ? (
        <div className={cx("spin")}>
          <Spin size="large" />
        </div>
      ) : roomList?.length > 0 ? (
        roomList.map((room) => {
          return (
            <div key={room?.id} className="room-component">
              <Row className={cx("room-component")}>
                <Col span={24}>
                  <Row>
                    <Col span={5} className={cx("thumbnail-room-side")}>
                      <Image
                        className={cx("thumbnail-image")}
                        src={room?.thubnailImage}
                      />
                    </Col>
                    <Col
                      span={19}
                      className={cx("information-room-side")}
                      onClick={(e) => handleRecordClick(e, room)}
                    >
                      <Row>
                        <Col span={24} style={{ paddingRight: "50px" }}>
                          <p className={cx("room-title")}>{room?.title}</p>
                        </Col>
                        <Col span={24}>
                          <p className={cx("room-address", "width76")}>
                            {room?.address}
                          </p>
                        </Col>
                        <Col className={cx("room-for-rent-info")} span={24}>
                          <span>Total Room:</span>&nbsp;
                          <span>
                            <Tag color="cyan" style={{ color: "#08979c" }}>
                              {room?.totalRoom}
                            </Tag>
                          </span>
                        </Col>
                        <Col className={cx("room-for-rent-info")} span={24}>
                          <span>Available Room:</span>
                          &nbsp;
                          <span>
                            {room?.availableRoom === 0 ? (
                              <Tag color="red" style={{ color: "#cf1322" }}>
                                FULLED
                              </Tag>
                            ) : (
                              <Tag color="green" style={{ color: "#389e0d" }}>
                                {room?.availableRoom}/{room?.totalRoom}
                              </Tag>
                            )}
                          </span>
                        </Col>
                        <Col className={cx("room-for-rent-info")} span={24}>
                          <span>Deposit request:</span>&nbsp;
                          <span>
                            <Tag color="volcano" style={{ color: "#d4380d" }}>
                              {room?.depositRequest}
                            </Tag>
                          </span>
                        </Col>
                        <Col className={cx("room-for-rent-info")} span={24}>
                          <span>Waiting Create Invoice:</span>&nbsp;
                          <span>
                            <Tag color="blue" style={{ color: "#108ee9" }}>
                              {room?.paymentStatusWaitingCreateCount}
                            </Tag>
                          </span>
                        </Col>
                        <Button primary className={cx("btn-hide")}>
                          {room?.status ? "Invisible" : "Visible"}
                        </Button>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          );
        })
      ) : (
        !loading && (
          <div className={cx("no-data")}>
            <div className="no-data"></div>
          </div>
        )
      )}
      <div className="pagination">
        {totalItems > 0 && (
          <Pagination
            current={currentPage}
            total={totalItems}
            showSizeChanger={false}
            onChange={handlePaginationChange}
          />
        )}
      </div>
      <ModalConfirm
        title="Confirmation"
        isModalVisible={isModalConfirmVisible}
        zIndex={3}
        close={() => setIsModaConfirmlVisible(false)}
        footer={[
          <Button
            key={1}
            id={1}
            cancel
            small
            onClick={() => setIsModaConfirmlVisible(false)}
          >
            Cancel
          </Button>,
          <Button key={2} id={2} submit small onClick={handleModalConfirmClick}>
            OK
          </Button>,
        ]}
        children={
          <div style={{ display: "flex", paddingLeft: "16px" }}>
            <ExclamationCircleOutlined
              style={{ fontSize: "22px", color: "#faad14" }}
            />
            <p style={{ paddingLeft: "16px", fontSize: "16px" }}>
              {`Do you want to ${
                room.status ? "invisible" : "visible"
              } this room?`}
            </p>
          </div>
        }
      />
    </>
  );
}

export default MyRoomsForRent;
