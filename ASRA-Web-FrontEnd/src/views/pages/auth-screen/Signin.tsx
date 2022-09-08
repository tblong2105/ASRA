import { useState, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Form, Input, Row, Col, Divider } from "antd";
import Button from "components/Layout/components/Button";

import { useAppDispatch } from "app/hooks";
import { Login } from "store/feature/auth/authSlice";
import { LocationProps } from "models/User";
import { INNKEEPER_STATUS } from "commons/constants/LocalstorageConstant";
import { ROLE_ADMIN } from "commons/constants/Role";
import { SocketContext } from "app/socket";
import { becomeInnkeeperStatus } from "api/account";
// import { checkUserExited, createNewUser } from "api/socket";

import LoadingIcon from "components/Layout/components/Loading";

import styles from "./Signin.module.scss";

function SignIn() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const location = useLocation() as LocationProps;
  let from = location.state?.from?.pathname || "/";

  const [loading, setLoading] = useState<boolean>(false);

  const onFinishFailed = (errorInfo: any) => {};

  const handleLogin = async (user: any) => {
    setLoading(true);
    dispatch(Login(user)).then((res: any) => {
      if (res.payload.status !== 200) {
        setLoading(false);
      }
      if (!res.payload.code) {
        let userInfoData = res?.payload;
        if (userInfoData?.username) {
          // checkUserExited(userInfoData?.username).then((res) => {
          //   if (!res?.data?.isExited) {
          //     let dataCreateReq = {
          //       username: userInfoData?.username,
          //       thumbnail: userInfoData?.image && userInfoData?.image,
          //     };
          //     createNewUser(dataCreateReq)
          //       .then((res) => {})
          //       .catch((err) => {});
          //   }
          // });
          socket.emit("addNewUser", userInfoData?.username);
        }
        becomeInnkeeperStatus().then((res: any) => {
          localStorage.setItem(INNKEEPER_STATUS, res.statusInnkeeper);
          if (userInfoData?.roles?.includes(ROLE_ADMIN)) {
            window.location.href = "/admin/dashboard";
            // navigate("/admin/dashboard", { replace: true });
          } else {
            navigate(from, { replace: true });
          }
          setLoading(false);
        });
      }
    });
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
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 24 }}
            initialValues={{ remember: true }}
            onFinish={handleLogin}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
            className={styles.form_data}
          >
            <Form.Item
              className={`required-no-icon ${styles.form_item}`}
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input placeholder="Username" className={styles.input_field} />
            </Form.Item>

            <Form.Item
              className={`required-no-icon ${styles.form_item}`}
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                placeholder="Password"
                className={styles.input_field}
              />
            </Form.Item>
            <Link to="/forgot-password" className={styles.txt_forgot_pass}>
              Forgot password?
            </Link>

            <Form.Item wrapperCol={{ span: 24 }}>
              <Button primary type="submit" className={styles.btn_login}>
                {loading && (
                  <LoadingIcon customStyles={{ fontSize: 14, color: "#fff" }} />
                )}
                &nbsp;Login
              </Button>
            </Form.Item>

            <Divider className={styles.divider}>or</Divider>

            <div className={styles.other_login_section}>
              <a className="btn-face"></a>
              <a className="btn-google"></a>
            </div>

            <div className={styles.txt_not_registered}>
              <span>
                Not registered? <Link to="/register">Register</Link>
              </span>
            </div>
          </Form>
        </Col>
      </Row>
    </>
  );
}

export default SignIn;
