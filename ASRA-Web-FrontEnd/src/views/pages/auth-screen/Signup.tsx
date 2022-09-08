import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Form, Input, Row, Col, Select } from "antd";
import Button from "components/Layout/components/Button";
import { useAppDispatch } from "app/hooks";
import { Register } from "store/feature/auth/authSlice";
import { SUCCESS } from "commons/constants/Notification";
import { openNotification } from "components/helper/Notification";
import { validateMessages } from "helpers/ValidateMessage";

import {
  getCities,
  getDistricts,
  getWards,
} from "commons/utils/location-ultis";
import { checkUserExited, createNewUser } from "api/socket";

import LoadingIcon from "components/Layout/components/Loading";

import styles from "./Signup.module.scss";
import "./Sigup.scss";

function SignUp() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { Option } = Select;

  const [city, setCity] = useState<any[]>();
  const [district, setDistrict] = useState<any[]>();
  const [ward, setWards] = useState<any[]>();
  const [cityName, setCityName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const handleRegister = (data: any) => {
    setLoading(true);
    dispatch(Register(data)).then((res) => {
      if (!res.payload.code) {
        openNotification(SUCCESS, res.payload.message.messageDetail);
        setLoading(false);
        if (res?.payload?.message?.messageId === "MSI006") {
          checkUserExited(data?.username).then((res) => {
            if (!res?.data?.isExited) {
              let dataCreateReq = {
                username: data?.username,
                thumbnail: data?.image ? data?.image : null,
              };
              createNewUser(dataCreateReq)
                .then((res) => {})
                .catch((err) => {});
            }
          });
        }
        navigate("/login");
      } else {
        setLoading(false);
      }
    });
  };

  const onFinishFailed = (errorInfo: any) => {};

  useEffect(() => {
    setCity(getCities());
  }, []);

  // Get all districts by city id
  const getCity = (cityName: any) => {
    setCityName(cityName);
    form.setFieldsValue({
      district: null,
      ward: null,
    });
    setDistrict([]);
    setWards([]);
    setDistrict(getDistricts(cityName));
  };

  // Get all wards by district id
  const getDistrict = (districtName: any) => {
    form.setFieldsValue({
      ward: null,
    });
    setWards([]);
    setWards(getWards(cityName, districtName));
  };

  return (
    <>
      <Row className={styles.content}>
        <Col span={13} className={styles.left_side}>
          <div className="big-icon"></div>
        </Col>
        <Col span={11} className={styles.right_side}>
          <Form
            className={styles.form_data}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 24 }}
            initialValues={{ remember: true }}
            onFinish={handleRegister}
            onFinishFailed={onFinishFailed}
            validateMessages={validateMessages}
            autoComplete="off"
            layout="vertical"
            form={form}
          >
            <Form.Item
              label="Fullname"
              name="fullname"
              rules={[{ required: true }]}
              className={`required-no-icon ${styles.form_item}`}
            >
              <Input placeholder="Fullname" className={styles.input_field} />
            </Form.Item>

            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                },
                {
                  min: 6,
                },
                {
                  max: 50,
                },
              ]}
              className={`required-no-icon ${styles.form_item}`}
            >
              <Input placeholder="Username" className={styles.input_field} />
            </Form.Item>

            <Form.Item
              label="E-mail"
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
              className={`required-no-icon ${styles.form_item}`}
            >
              <Input placeholder="Email" className={styles.input_field} />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[
                {
                  required: true,
                },
                {
                  pattern: /^((0)[3|5|7|8|9])+([0-9]{8})$\b/,
                  message: "Phone Number incorrect format!",
                },
              ]}
              className={`required-no-icon ${styles.form_item}`}
            >
              <Input
                placeholder="Phone Number"
                className={styles.input_field}
              />
            </Form.Item>

            <Row gutter={28} className={`address-row-register`}>
              <Col className="gutter-row" span={12}>
                <Form.Item
                  className={`form-item-address`}
                  label="City"
                  name="city"
                  rules={[{ required: true }]}
                >
                  <Select
                    onChange={(e: any) => getCity(e)}
                    className={`input`}
                    placeholder="Select City"
                  >
                    {city?.map((type: any, index: number) => (
                      <Option key={index} value={type.name}>
                        {type.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={12}>
                <Form.Item
                  className={`form-item-address`}
                  label="District"
                  name="district"
                  rules={[{ required: true }]}
                >
                  <Select
                    onChange={(e: any) => getDistrict(e)}
                    className={`input`}
                    placeholder="Select District"
                  >
                    {district?.map((type: any, index: number) => (
                      <Option key={index} value={type.name}>
                        <p className={`district-name`} style={{ margin: "0" }}>
                          {type.name}
                        </p>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={28} className={`address-row-register`}>
              <Col className="gutter-row" span={12}>
                <Form.Item
                  className={`form-item-address`}
                  label="Ward"
                  name="ward"
                  rules={[{ required: true }]}
                >
                  <Select className={`input`} placeholder="Select Ward">
                    {ward?.map((type: any, index: number) => (
                      <Option key={index} value={type.name}>
                        <p className={`ward-name`} style={{ margin: "0" }}>
                          {type.name}
                        </p>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={12}>
                <Form.Item
                  label="Street Name"
                  name="streetName"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  className={`form-item-address`}
                >
                  <Input placeholder="Street Name" className={`input`} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                },
                {
                  min: 6,
                },
                {
                  max: 50,
                },
              ]}
              className={`required-no-icon ${styles.form_item}`}
            >
              <Input.Password
                placeholder="Password"
                className={styles.input_field_password}
              />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      "The two passwords that you entered do not match!"
                    );
                  },
                }),
              ]}
              className={`custom-label required-no-icon ${styles.form_item}`}
            >
              <Input.Password
                placeholder="Confirm Password"
                className={styles.input_field_password}
              />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }}>
              <Button primary type="submit" className={styles.btn_register}>
                {loading && (
                  <LoadingIcon customStyles={{ fontSize: 14, color: "#fff" }} />
                )}
                &nbsp;Register
              </Button>
            </Form.Item>

            <div className={styles.txt_already_registered}>
              <span>
                Already registered? <Link to="/login">Login</Link>
              </span>
            </div>
          </Form>
        </Col>
      </Row>
    </>
  );
}

export default SignUp;
