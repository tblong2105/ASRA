import { useNavigate } from "react-router-dom";
import { Form, Input, Row, Col, Divider } from "antd";
import Button from "components/Layout/components/Button";
import { useAppDispatch } from "../../../app/hooks";
import styles from "./ForgotPassword.module.scss";
import { Link } from "react-router-dom";
import { requestForgotPassword } from "api/account";
import { openNotification } from "components/helper/Notification";
import { SUCCESS } from "commons/constants/Notification";
import { validateMessages } from "helpers/ValidateMessage";

function ForgotPassword() {
  const [form] = Form.useForm();

  const onFinishFailed = (errorInfo: any) => {

  };

  const handleForgotPass = (data: any) => {
    requestForgotPassword(data.email).then((res:any) => {
      form.resetFields()
      openNotification(SUCCESS,res.message.messageDetail)
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
            validateMessages={validateMessages}
            form={form}
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 24 }}
            initialValues={{ remember: true }}
            onFinish={handleForgotPass}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
            className={styles.form_data}
          >
            <div className={styles.txt_forgot_password}>Forgot Password</div>
            <Divider className={styles.first_divider}></Divider>
            <div className={styles.txt_enterEmail}>
              Please, enter your email address. You will receive a link to
              create new password via email.
            </div>
            <Form.Item
              className={`required-no-icon ${styles.form_item}`}
              name="email"
              rules={[
                {
                  required: true,
                },
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
              ]}
            >
              <Input
                placeholder="Enter your email address or username"
                className={styles.input_field}
              />
            </Form.Item>
            <Divider className={styles.second_divider}></Divider>
            <Form.Item className={styles.form_buton} wrapperCol={{ span: 24 }}>
             <Link to="/login">
             <Button primary className={styles.btn_cancel}>
                Cancel
              </Button></Link>
              <Button primary type="submit" className={styles.btn_login}>
                Send
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}

export default ForgotPassword;
