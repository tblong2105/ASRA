import styles from "./ChangePassword.module.scss";
import { Row, Col, Form, Input } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Button from "components/Layout/components/Button";
import classNames from "classnames/bind";
import ModalConfirm from "components/helper/ModalConfirm";
import { useState } from "react";
import { changePassword } from "api/account";
import { openNotification } from "components/helper/Notification";
import { SUCCESS } from "commons/constants/Notification";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

function ChangePassword() {
  const onFinishFailed = (errorInfo: any) => {};
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = (data: any) => {
    setOldPassword(data.oldPassword);
    setNewPassword(data.newPassword);
    setIsModalVisible(true);
  };
  const handleChangePassword = () => {
    changePassword(oldPassword, newPassword).then((res: any) => {
      openNotification(SUCCESS, res.message.messageDetail);
      navigate("/");
    });
  };

  return (
    <>
      <Row className={cx("content")}>
        <Col span={12} className={cx("right-content")}>
          <Form
            name="basic"
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 24 }}
            initialValues={{ remember: true }}
            onFinish={handleSubmit}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
            className={cx("form-data")}
          >
            <div className={cx("first-title")}>Change Password</div>
            <div className={cx("second-title")}>Change your password</div>

            <Form.Item
              className={cx("old-password")}
              name="oldPassword"
              label="Old Password"
              rules={[
                {
                  required: true,
                  message: "Please input your old password!",
                },
                {
                  min: 6,
                  message: "Old password must be at least 6 characters",
                },
              ]}
              hasFeedback
            >
              <Input.Password
                className={""}
                placeholder="Enter your old password"
              />
            </Form.Item>

            <Form.Item
              className={cx("new-password")}
              name="newPassword"
              label="New Password"
              rules={[
                {
                  required: true,
                  message: "Please input your new password!",
                },
                {
                  min: 6,
                  message: "New password must be at least 6 characters",
                },
              ]}
              hasFeedback
            >
              <Input.Password
                className={""}
                placeholder="Enter your new password"
              />
            </Form.Item>

            <Form.Item
              className={cx("confirm-password")}
              name="confirmPassword"
              label="Confirm New Password"
              dependencies={["newPassword"]}
              rules={[
                {
                  required: true,
                  message: "Please input your confirm new password!",
                },
                {
                  min: 6,
                  message: "Confirm new password must be at least 6 characters",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      "Confirm new password and new password don't match"
                    );
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password
                className={""}
                placeholder="Enter your confirm new password"
              />
            </Form.Item>

            <Form.Item>
              <Button primary type="submit" className={cx("btn-change-pass")}>
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <ModalConfirm
        title="Confirmation"
        isModalVisible={isModalVisible}
        zIndex={3}
        close={() => setIsModalVisible(false)}
        footer={[
          <Button
            key={1}
            id={1}
            cancel
            small
            onClick={() => setIsModalVisible(false)}
          >
            Cancel
          </Button>,
          <Button
            key={2}
            id={2}
            submit
            small
            onClick={() => handleChangePassword()}
          >
            OK
          </Button>,
        ]}
        children={
          <div style={{ display: "flex", paddingLeft: "16px" }}>
            <ExclamationCircleOutlined
              style={{ fontSize: "22px", color: "#faad14" }}
            />
            <p style={{ paddingLeft: "16px", fontSize: "16px" }}>
              Do you want to change your password?
            </p>
          </div>
        }
      />
    </>
  );
}

export default ChangePassword;
