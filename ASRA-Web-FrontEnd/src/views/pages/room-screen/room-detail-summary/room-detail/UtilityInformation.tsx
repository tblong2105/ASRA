import { memo } from "react";
import { Row, Col } from "antd";
import { ReconciliationOutlined } from "@ant-design/icons";
import { ROOM_PATH } from "commons/constants";
function UtilityInformation({
  ac,
  bed,
  kitchen,
  parking,
  refrigerator,
  time,
  toilet,
  wifi,
  wmc,
  television,
  pathName,
  cx,
}: any) {
  return (
    <>
      {/* UTILITIES INFORMATION*/}
      <Col className={cx("utilities-info-card")} span={15}>
        <Row>
          <Col className={cx("title")} span={6}>
            <ReconciliationOutlined
              style={
                pathName.includes(ROOM_PATH.FROM_MY_ROOMS_FOR_RENT)
                  ? {}
                  : { marginLeft: "-16px" }
              }
              className={cx("utility-icon")}
            />
            <span className={cx("utilities-info-text")}>Utilities</span>
          </Col>
        </Row>
        <Row style={{ marginTop: "24px" }}>
          <Col
            className={bed ? "bed-utility-green-icon" : "bed-utility-icon"}
            span={4}
            style={{ marginRight: "40px" }}
          ></Col>
          <Col
            className={time ? "time-utility-green-icon" : "time-utility-icon"}
            span={4}
            style={{ marginRight: "40px" }}
          ></Col>
          <Col
            className={
              wmc
                ? "washing-machine-utility-green-icon"
                : "washing-machine-utility-icon"
            }
            span={4}
            style={{ marginRight: "40px" }}
          ></Col>
          <Col
            className={
              ac
                ? "air-condition-utility-green-icon"
                : "air-condition-utility-icon"
            }
            span={4}
            style={{ marginRight: "40px" }}
          ></Col>
        </Row>
        <Row style={{ marginTop: "24px" }}>
          <Col
            className={
              television
                ? "television-utility-green-icon"
                : "television-utility-icon"
            }
            span={4}
            style={{ marginRight: "63px", marginLeft: "-6px" }}
          ></Col>
          <Col
            className={
              refrigerator
                ? "refrigerator-utility-green-icon"
                : "refrigerator-utility-icon"
            }
            span={4}
            style={{ marginRight: "40px" }}
          ></Col>
          <Col
            className={
              parking ? "parking-utility-green-icon" : "parking-utility-icon"
            }
            span={4}
            style={{ marginRight: "20px", marginLeft: "-16px" }}
          ></Col>
          <Col
            className={
              toilet ? "toilet-utility-green-icon" : "toilet-utility-icon"
            }
            span={4}
            style={{ marginRight: "40px" }}
          ></Col>
        </Row>
        <Row style={{ marginTop: "24px" }}>
          <Col
            className={
              kitchen ? "kitchen-utility-green-icon" : "kitchen-utility-icon"
            }
            span={4}
            style={{ marginRight: "53px", marginLeft: "-14px" }}
          ></Col>
          <Col
            className={wifi ? "wifi-utility-green-icon" : "wifi-utility-icon"}
            span={4}
            style={{ marginRight: "40px" }}
          ></Col>
        </Row>
      </Col>
    </>
  );
}

export default memo(UtilityInformation);
