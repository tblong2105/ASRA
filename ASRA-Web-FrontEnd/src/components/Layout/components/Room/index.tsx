import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import { RoomCard } from "@/models/Room";
import { Col, Row, Image } from "antd";
import { currencyViCode, formatCurrencyOnCard } from "commons/utils/mask";
import styles from "./index.module.scss";
import "./index.scss";

const cx = classNames.bind(styles);

function Room(props: any) {
  const navigate = useNavigate();

  const roomCard: RoomCard = props.roomCard;

  const {
    address,
    electricityCost,
    id,
    roomArea,
    roomType,
    thubnailImage,
    title,
    waterCost,
  } = roomCard || "";

  return (
    <>
      <div className="room-component">
        <Row className={cx("room-component")}>
          <Col span={24}>
            <Row>
              <Col span={5} className={cx("thumbnail-room-side")}>
                <Image className={cx("thumbnail-image")} src={thubnailImage} />
              </Col>
              <Col
                span={19}
                className={cx("information-room-side")}
                onClick={() => navigate(`/room/${id}`)}
              >
                <Row>
                  <Col span={24} style={{ paddingRight: "50px" }}>
                    <p className={cx("room-title")}>{title}</p>
                  </Col>
                  <Col span={24}>
                    <p className={cx("room-address", "width76")}>{address}</p>
                  </Col>
                  <>
                    <Col span={18}>
                      <Row>
                        <Col span={24}>
                          <div className={cx("room-utilities", "room-address")}>
                            <div className={cx("home-icon", "icon")}></div>
                            {roomType}
                          </div>
                        </Col>
                        <Col span={24}>
                          <Row className={cx("multi-utilities")}>
                            <Col span={5}>
                              <div
                                className={cx("room-utilities", "room-address")}
                              >
                                <div className={cx("area-icon", "icon")}></div>
                                {roomArea} m²
                              </div>
                            </Col>
                            <Col span={9}>
                              <div
                                className={cx("room-utilities", "room-address")}
                              >
                                <div className={cx("light-icon", "icon")}></div>
                                {currencyViCode(electricityCost)} / kWh
                              </div>
                            </Col>
                            <Col span={9}>
                              <div
                                className={cx("room-utilities", "room-address")}
                              >
                                <div className={cx("water-icon", "icon")}></div>
                                {currencyViCode(waterCost)} / person
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={6}>
                      <Row>
                        <Col
                          span={24}
                          className={cx("room-price", "price-center")}
                        >
                          {formatCurrencyOnCard(roomCard.rentalPrice)}
                        </Col>
                        <Col
                          span={24}
                          className={cx("room-price-unit", "price-center")}
                        >
                          Milion / Month
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
    </>
  );
}

export default Room;
