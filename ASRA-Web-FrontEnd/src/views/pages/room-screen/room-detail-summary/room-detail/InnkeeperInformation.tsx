import { memo } from "react";
import { Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";
import moment from "moment";

function InnkeeperInformation({
  innkeeperFullName,
  innkeeperImage,
  innkeeperPhoneNumber,
  createDateSubmitted,
  userInfor,
  cx,
}: any) {
  return (
    <>
      {/*INNKEEPER INFORMATION */}
      <Col className={cx("innkeeper-info-card")} span={8}>
        <Row>
          <Col className={cx("title")} span={21}>
            <UserOutlined className={cx("user-icon")} />
            <span className={cx("innkeeper-info-text")}>
              Innkeeper Information
            </span>
          </Col>
        </Row>
        <Row className={cx("innkeeper-info-description")}>
          <Col span={5}>
            {innkeeperImage ? (
              <img className={cx("avatar")} src={innkeeperImage} alt="" />
            ) : (
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "30px",
                  backgroundColor: "#595959",
                  border: "0.6px solid #8b8b8b",
                  color: "#fff",
                  fontSize: "20px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                <span
                  style={{ position: "absolute", top: "16px", left: "24px" }}
                >
                  {userInfor?.fullname?.charAt(0)}
                </span>
              </div>
            )}
          </Col>
          <Col
            className={cx("user-info")}
            span={8}
            style={{ borderRight: "1px solid" }}
          >
            <span>{innkeeperFullName}</span>
            <span>{innkeeperPhoneNumber}</span>
          </Col>
          <Col
            className={cx("user-info")}
            span={8}
            style={{ marginLeft: "20px" }}
          >
            <span>Date Submitted</span>
            <span>{moment(createDateSubmitted).format("MMM DD, YYYY")}</span>
          </Col>
        </Row>
      </Col>
    </>
  );
}

export default memo(InnkeeperInformation);
