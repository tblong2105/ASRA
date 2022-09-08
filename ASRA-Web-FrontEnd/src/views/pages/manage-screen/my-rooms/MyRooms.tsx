import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classnames from "classnames/bind";
import { Col, Row, Image, Spin, Pagination, Tag } from "antd";
import moment from "moment";
import type { PaginationProps } from "antd";

import { getMyRoomsTenant } from "api/room";

import { currencyViCode, formatCurrencyOnCard } from "commons/utils/mask";

import style from "components/Layout/components/Room/index.module.scss";
import "components/Layout/components/Room/index.scss";
import { PAYMENT_STATUS } from "commons/constants/Payment";
import Button from "components/Layout/components/Button";

const cx = classnames.bind(style);

function MyRooms() {
  const navigate = useNavigate();

  const [roomList, setRoomList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [dup, setDup] = useState<any[]>([]);

  let userInfor = JSON.parse(localStorage.getItem("userInfor") || "{}");
  let userId = userInfor.id;

  const handlePaginationChange: PaginationProps["onChange"] = (pageNumber) => {
    setCurrentPage(pageNumber);
    let dataReq = {
      id: userId,
      page: pageNumber,
    };
    getMyRoomsTenant(dataReq).then((res: any) => {
      setRoomList(res.rooms.reverse());
      setTotalItems(res.totalItems);
    });
  };

  const loadData = () => {
    let dataReq = {
      id: userId,
      page: currentPage,
    };
    setLoading(true);
    getMyRoomsTenant(dataReq).then((res: any) => {
      let numArr: any = [];
      let originData: any = res?.rooms.reverse();
      res?.rooms
        .map((room: any) => room?.title)
        .filter((title: any, i: any, rooms: any) => {
          if (rooms.indexOf(title) !== i) {
            numArr.push(i);
          }
          return rooms.indexOf(title) !== i;
        });
      numArr?.map((i: any) => {
        if (i > -1) {
          originData.splice(i, 1);
        }
      });

      setRoomList(originData);
      setCurrentPage(res?.currentPage);
      setTotalItems(res?.totalItems);
      setLoading(false);
    });
  };
  useEffect(() => {
    loadData();
  }, []);

  const onPaymentClick = (e: any, billId: number) => {
    if (e.nativeEvent.srcElement.innerText === "Payment") {
      navigate(`/payment/bill/${billId}`);
    }
  };

  const handleRoomClick = (e: any, roomId: any, roomDetailId: any) => {
    if (e.nativeEvent.srcElement.innerText !== "Payment") {
      navigate(`/manage/room-rented/${roomId}/room-no/${roomDetailId}`);
    }
  };

  return (
    <>
      <Spin
        spinning={loading}
        delay={0}
        size="large"
        className={cx("spin")}
      ></Spin>
      {roomList.length > 0
        ? roomList.map((room: any) => {
            return (
              <div key={room.id + room.roomDetailId} className="room-component">
                <Row className={cx("room-component")}>
                  <Col span={24}>
                    <Row>
                      <Col span={5} className={cx("thumbnail-room-side")}>
                        <Image
                          className={cx("thumbnail-image")}
                          src={room.thubnailImage}
                        />
                      </Col>
                      <Col
                        span={19}
                        className={cx("information-room-side")}
                        onClick={(e: any) =>
                          handleRoomClick(e, room.id, room.roomDetailId)
                        }
                      >
                        <Row>
                          <Col span={24} style={{ paddingRight: "50px" }}>
                            <p className={cx("room-title")}>{room.title}</p>
                          </Col>
                          <Col span={24}>
                            <p className={cx("room-address", "width76")}>
                              {room.address}
                            </p>
                          </Col>
                          <>
                            <Col span={18}>
                              <Row>
                                <Col span={6}>
                                  <div
                                    className={cx(
                                      "room-utilities",
                                      "room-address"
                                    )}
                                  >
                                    <div
                                      className={cx("home-icon", "icon")}
                                    ></div>
                                    {room.roomDetailName}
                                  </div>
                                </Col>
                                <Col span={9}>
                                  <div
                                    className={cx(
                                      "room-utilities",
                                      "room-address"
                                    )}
                                  >
                                    <div
                                      className={cx(
                                        "payment-date-icon",
                                        "icon"
                                      )}
                                    ></div>
                                    {moment(
                                      `${new Date().getMonth() + 1}-${
                                        room.paymentDate
                                      }-${new Date().getFullYear()}`
                                    ).format("DD MMM, YYYY")}
                                  </div>
                                </Col>
                                <Col span={9}>
                                  <div
                                    className={cx(
                                      "room-utilities",
                                      "room-address"
                                    )}
                                  >
                                    <div
                                      className={cx(
                                        "payment-status-icon",
                                        "icon"
                                      )}
                                    ></div>
                                    {room.paymentStatus ===
                                    PAYMENT_STATUS.NOT_YET ? (
                                      <Tag color={"red"}>
                                        {room.paymentStatus}
                                      </Tag>
                                    ) : room.paymentStatus ===
                                      PAYMENT_STATUS.PAID ? (
                                      <Tag color={"green"}>
                                        {room.paymentStatus}
                                      </Tag>
                                    ) : (
                                      <Tag color={"orange"}>
                                        {/* {room.paymentStatus} */}
                                        {"WAITING_CREATE_INVOICE"}
                                      </Tag>
                                    )}
                                  </div>
                                </Col>

                                <Col span={24}>
                                  <Row className={cx("multi-utilities")}>
                                    <Col span={6}>
                                      <div
                                        className={cx(
                                          "room-utilities",
                                          "room-address"
                                        )}
                                      >
                                        <div
                                          className={cx("area-icon", "icon")}
                                        ></div>
                                        {room.roomArea} m²
                                      </div>
                                    </Col>
                                    <Col span={9}>
                                      <div
                                        className={cx(
                                          "room-utilities",
                                          "room-address"
                                        )}
                                      >
                                        <div
                                          className={cx("light-icon", "icon")}
                                        ></div>
                                        {currencyViCode(room.electricityCost)} /
                                        kWh
                                      </div>
                                    </Col>
                                    <Col span={9}>
                                      <div
                                        className={cx(
                                          "room-utilities",
                                          "room-address"
                                        )}
                                      >
                                        <div
                                          className={cx("water-icon", "icon")}
                                        ></div>
                                        {currencyViCode(room.waterCost)} /
                                        person
                                      </div>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </Col>
                            <Col span={6}>
                              <Row>
                                <Col span={24}>
                                  <Row>
                                    <Col
                                      span={24}
                                      className={cx(
                                        "room-price-manage",
                                        "price-center"
                                      )}
                                    >
                                      {formatCurrencyOnCard(room.rentalPrice)}
                                    </Col>
                                    <Col
                                      span={24}
                                      className={cx(
                                        "room-price-unit-manage",
                                        "price-center"
                                      )}
                                    >
                                      Milion/Month
                                    </Col>
                                  </Row>
                                </Col>

                                <Col
                                  span={24}
                                  className={cx(
                                    "room-button-payment-manage",
                                    "price-center"
                                  )}
                                >
                                  <Button
                                    className="button-payment"
                                    disabled={
                                      room.paymentStatus !==
                                      PAYMENT_STATUS.NOT_YET
                                    }
                                    primary
                                    onClick={(e: any) =>
                                      onPaymentClick(e, room.billId)
                                    }
                                  >
                                    Payment
                                  </Button>
                                </Col>
                              </Row>
                            </Col>
                          </>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            );
          })
        : !loading && (
            <div className={cx("no-data")}>
              <div className="no-data"></div>
            </div>
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
    </>
  );
}

export default MyRooms;
