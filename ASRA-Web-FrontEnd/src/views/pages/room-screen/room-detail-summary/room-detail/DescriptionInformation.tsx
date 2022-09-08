import { memo } from "react";
import { Row, Col } from "antd";
import { ProfileOutlined } from "@ant-design/icons";
import { ROOM_PATH } from "commons/constants";

function DescriptionInformation({ pathName, description, cx }: any) {
  return (
    <>
      {/* DETAIL DESCRIPTION INFORMATION*/}
      <Col className={cx("detail-description-info-card")} span={15}>
        <Row>
          <Col
            className={cx("title")}
            span={pathName.includes(ROOM_PATH.FROM_MY_ROOMS_FOR_RENT) ? 8 : 7}
          >
            <ProfileOutlined
              style={
                pathName.includes(ROOM_PATH.FROM_MY_ROOMS_FOR_RENT)
                  ? { marginLeft: "-14px" }
                  : { marginLeft: "-12px" }
              }
              className={cx("description-icon")}
            />
            <span className={cx("detail-description-info-text")}>
              Description
            </span>
          </Col>
        </Row>
        <Row style={{ marginTop: "24px", paddingLeft: "6px" }}>
          <Col
            style={{ textAlign: "start" }}
            span={24}
            dangerouslySetInnerHTML={{ __html: description }}
          ></Col>
        </Row>
      </Col>
    </>
  );
}

export default memo(DescriptionInformation);
