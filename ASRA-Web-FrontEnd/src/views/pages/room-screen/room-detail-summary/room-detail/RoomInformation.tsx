import { memo } from "react";
import { Row, Col } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { ROOM_PATH } from "commons/constants";
function RoomInformation({
  rentalPrice,
  roomArea,
  deposit,
  capacity,
  electricityCost,
  waterCost,
  internetCost,
  address,
  totalRoom,
  totalRoomEmpty,
  roomNo,
  pathName,
  roomRented,
  cx,
}: any) {
  return (
    <>
      {/*ROOM DETAIL INFORMATION */}
      <Col
        className={cx("room-info-card")}
        span={pathName.includes(ROOM_PATH.FROM_MY_ROOMS_FOR_RENT) ? 23 : 15}
      >
        <Row>
          <Col
            className={cx("title")}
            span={pathName.includes(ROOM_PATH.FROM_MY_ROOMS_FOR_RENT) ? 6 : 9}
          >
            <HomeOutlined
              style={
                pathName.includes(ROOM_PATH.FROM_MY_ROOMS_FOR_RENT)
                  ? {}
                  : { marginLeft: "-10px" }
              }
              className={cx("home-icon")}
            />
            <span className={cx("room-info-text")}>Room Information</span>
          </Col>
        </Row>
        <Row className={cx("room-info-description")}>
          {pathName.includes(ROOM_PATH.FROM_MY_ROOMS) && roomRented && (
            <>
              <Col className={cx("price")} span={6}>
                <span>Room Name</span>
                <span>{roomNo}</span>
              </Col>
              <Col className={cx("address")} span={18}>
                <span>Address</span>
                <span>{address}</span>
              </Col>
            </>
          )}
        </Row>
        <Row className={cx("room-info-description")}>
          <Col className={cx("price")} span={6}>
            <span>Rental Price</span>
            <span>{rentalPrice}</span>
          </Col>
          <Col className={cx("area")} span={6}>
            <span>Area</span>
            <span>{roomArea} m²</span>
          </Col>
          <Col className={cx("deposit")} span={6}>
            <span>Deposit</span>
            <span>{deposit}</span>
          </Col>
          <Col className={cx("capacity")} span={6}>
            <span>Capacity</span>
            <span>{capacity} male or female</span>
          </Col>
        </Row>
        <Row className={cx("room-info-description")}>
          <Col className={cx("price")} span={6}>
            <span>Electricity</span>
            <span>{electricityCost}</span>
          </Col>
          <Col className={cx("area")} span={6}>
            <span>Water</span>
            <span>{waterCost}</span>
          </Col>
          <Col className={cx("deposit")} span={6}>
            <span>Wifi</span>
            <span>{internetCost}</span>
          </Col>
          <Col className={cx("capacity")} span={6}>
            {pathName.includes(ROOM_PATH.FROM_MY_ROOMS_FOR_RENT) ? (
              <>
                <span>Available</span>
                {totalRoomEmpty === 0 ? (
                  <span style={{ color: "#00bfb9", textAlign: "left" }}>
                    Fulled {totalRoom}/{totalRoom}
                  </span>
                ) : (
                  <span style={{ color: "#00bfb9", textAlign: "left" }}>
                    {totalRoomEmpty} / {totalRoom}
                  </span>
                )}
              </>
            ) : (
              <>
                <span>
                  {pathName.includes(ROOM_PATH.FROM_MY_ROOMS) && roomRented
                    ? "Status"
                    : "Available"}
                </span>
                {pathName.includes(ROOM_PATH.FROM_MY_ROOMS) && roomRented ? (
                  <span style={{ color: "#00bfb9", textAlign: "left" }}>
                    Renting
                  </span>
                ) : (
                  <>
                    {totalRoomEmpty <= 0 ? (
                      <span style={{ color: "#e03c31", textAlign: "left" }}>
                        Fulled
                      </span>
                    ) : (
                      <span style={{ color: "#00bfb9", textAlign: "left" }}>
                        Yes
                      </span>
                    )}
                  </>
                )}
              </>
            )}
          </Col>
        </Row>
        {!pathName.includes(ROOM_PATH.FROM_MY_ROOMS) && (
          <Row className={cx("room-info-description")}>
            <Col className={cx("address")} span={24}>
              <span>Address</span>
              <span>{address}</span>
            </Col>
          </Row>
        )}
      </Col>
    </>
  );
}

export default memo(RoomInformation);
