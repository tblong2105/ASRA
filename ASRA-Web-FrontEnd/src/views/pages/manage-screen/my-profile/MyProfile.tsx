import { Col, Row, Avatar, Upload } from "antd";
import Button from "components/Layout/components/Button";
import styles from "./MyProfile.module.scss";
import classNames from "classnames/bind";
import { UploadOutlined } from "@ant-design/icons";

const cx = classNames.bind(styles);

function MyProfile(props: any) {

  const profile = props.profile

  return (
    <>
      <div className="my-profile-screen">
        <Row className={cx("my-profile-screen")}>
          <Col span={16}>
            <Row>
              <Col span={24}>
                <p className={cx("my-profile-header")}>My Profile</p>
              </Col>
              <Col span={24}>
                <p className={cx("my-profile-text")}>
                  Setup your general profile details.
                </p>
              </Col>
              <Col span={24}>
                <p className={cx("my-profile-title")}>Full Name</p>
              </Col>
              <Col span={24}>
                <p className={cx("my-profile-details")}>{profile.fullName}</p>
              </Col>
              <Col span={24}>
                <p className={cx("my-profile-title")}>Email</p>
              </Col>
              <Col span={24}>
                <p className={cx("my-profile-details")}>{profile.email}</p>
              </Col>
              <Col span={24}>
                <p className={cx("my-profile-title")}>Age</p>
              </Col>
              <Col span={24}>
                <p className={cx("my-profile-details")}>{profile.age !== 0 ? profile.age : "Not Applicable"}</p>
              </Col>
              <Col span={24}>
                <p className={cx("my-profile-title")}>Gender</p>
              </Col>
              <Col span={24}>
                <p className={cx("my-profile-details")}>{profile.gender === "0" ? "Other" : profile.gender === "1" ? "Male" : profile.gender === "2" ? "Female" : "Not Applicable"}</p>
              </Col>
              <Col span={24}>
                <p className={cx("my-profile-title")}>Profession</p>
              </Col>
              <Col span={24}>
                <p className={cx("my-profile-details")}>{profile.profession ? profile.profession : "Not Applicable"}</p>
              </Col>
              <Col span={24}>
                <p className={cx("my-profile-title")}>Phone Number</p>
              </Col>
              <Col span={24}>
                <p className={cx("my-profile-details")}>{profile.phoneNumber ? profile.phoneNumber : "Not Applicable"}</p>
              </Col>
              <Col span={24}>
                <p className={cx("my-profile-title")}>Address</p>
              </Col>
              <Col span={24}>
                <p className={cx("my-profile-details")}>
                  {profile.city ? `${profile.streetName}, ${profile.ward}, ${profile.district}, ${profile.city}` : "Not Application"}
                  {/* {profile.streetName}, {profile.ward}, {profile.district}, {profile.city} */}
                </p>
              </Col>
              <Col span={24}>
                <Button
                  primary
                  className={cx("edit-button")}
                  onClick={props.changeStatusViewProfile}
                >
                  Edit
                </Button>
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <Row>
              <Col span={24}>
                <p className={cx("my-profile-avatar-title")}>Profile Picture</p>
              </Col>
              <Col span={24} className={cx("my-profile-avatar-image")}>
                <Avatar src={profile.image} size={164} />
              </Col>
              <Col span={24}>
                <Upload>
                  <Button
                    primary
                    icon={<UploadOutlined />}
                    className={cx("my-profile-avatar-button")}
                  >
                    Upload Image
                  </Button>
                </Upload>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default MyProfile;
