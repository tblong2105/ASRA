import { newPassword } from "api/account";
import { Form, Input, Row, Col, Divider } from "antd";
import Button from "components/Layout/components/Button";
import styles from "./NewPassword.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { openNotification } from "components/helper/Notification";
import { SUCCESS } from "commons/constants/Notification";

function NewPassword() {

  const navigate = useNavigate();
  const params = useParams();
  const onFinishFailed = (errorInfo: any) => {};

  const handleNewPass = (data: any) => {
    newPassword({token: params.token, password: data.newPass}).then((res:any) => {
      openNotification(SUCCESS, res.message.messageDetail)
      navigate("/login")
    })
  };

  return (
    <>
      <Row className={styles.content}>
        <Col span={13} className={styles.left_side}>
          <div className="big-icon"></div>
        </Col>
        <Col span={11} className={styles.right_side}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 24 }}
            initialValues={{ remember: true }}
            onFinish={handleNewPass}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
            className={styles.form_data}
          >
            <div className={styles.txt_new_password}>New Password</div>
            <Divider className={styles.first_divider}></Divider>
            <Form.Item
              className={`required-no-icon ${styles.form_item}`}
              name="newPass"
              label="New Password"
              rules={[
                { required: true, message: "Please input your new password!" },
                {
                  min: 6,
                  message: "New password must be at least 6 characters",
                },
              ]}
              hasFeedback
            >
              <Input.Password
                placeholder="Enter your new password"
                className={styles.input_field}
              />
            </Form.Item>

            <Form.Item
              className={`required-no-icon ${styles.form_item}`}
              name="confirmPass"
              label="Confirm New Password"
              dependencies={["newPass"]}
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
                    if (getFieldValue("newPass") === value) {
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
                placeholder="Enter your confirm new password"
                className={styles.input_field}
              />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }}>
              <Button primary type="submit" className={styles.btn_change_password}>
                Change
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}

export default NewPassword;
