import { useEffect, useState, memo } from "react";
import { Col, Form, Input, Progress, Row, Select, Spin } from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import Button from "../Button";
import { IMAGE_CITIZEN_IDENTITY } from "commons/constants";
import { INNKEEPER_STATUS } from "commons/constants/LocalstorageConstant";

import ModalConfirm from "components/helper/ModalConfirm";
import { paymentTypes } from "commons/masterData/PaymentType";

function BecomeAnInnkeeper({
  handleConfirmInnkeeper,
  handleChangeFile,
  handleDeleteFile,
  handleCancel,
  frontUrl,
  backsizeUrl,
  visible,
  progress,
  uploading,
  loading,
}: any) {
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  let spinLoading = false;
  const [form] = Form.useForm();
  const { Option } = Select;
  /**
   * Show image detail
   * @param file
   */
  const handlePreviewImage = (url: any) => {
    if (url) {
      setPreviewImage(url);
      setPreviewVisible(true);
    }
  };

  useEffect(() => {
    if (loading === false) {
      spinLoading = false;
    }
  }, [loading]);


  useEffect(() => {
    if(visible){
      form.resetFields();
    }
  }, [visible]);

  /**
   * Close popup preview image detail
   * @returns
   */
  const handleCloseImage = () => {
    setPreviewVisible(false);
  };
  const handleOnFinish = (data: any) => {
    spinLoading = true;
    handleConfirmInnkeeper(data);
    // 
  };
  return (
    <>
      <ModalConfirm
        title="Become An Innkeeper"
        isModalVisible={visible}
        close={handleCancel}
        footer={null}
        width={600}
        zIndex={3}
        children={
          <Spin spinning={loading || spinLoading} delay={0}>
            {/* login => response status of that user: (an innkeeper, requested to approved, not an innkeeper) */}
            {localStorage.getItem(INNKEEPER_STATUS) === "1" ? (
              <p>
                Your request is being reviewed to become an innkeeper, the
                review time is a day.
              </p>
            ) : (
              <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={handleOnFinish}
                autoComplete="off"
                layout="vertical"
                form={form}
              >
                <p>To register as an innkeeper, please provide credentials</p>
                
              <Row>
                <Col span={12}>
                  <Form.Item
                    className="col_right"
                    label="Payment Type"
                    name="paymentType"
                    rules={[
                      {
                        required: true,
                        message: "Please select payment type!",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select payment type"
                      className="input"
                      allowClear
                    >
                      {paymentTypes.map((item, index) => (
                        <Option key={index} value={item.value}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Bank Account"
                    name="gmailPaypal"
                    rules={[
                      {
                        required: true,
                        message: "Please input Bank Account!",
                      },
                    ]}
                  >
                    <Input className="input" placeholder="Enter Bank Account" />
                  </Form.Item>
                </Col>
              </Row>
                <p className="citizen-note">Upload citizen identity</p>
                <div className="upload-citizen-image">
                  <div className="select-picture-card">
                    <span>
                      {frontUrl ? (
                        <div className="image_border">
                          <div className="image_area">
                            <EyeOutlined
                              onClick={() => handlePreviewImage(frontUrl)}
                              className="eye_icon"
                            />
                            <DeleteOutlined
                              onClick={() =>
                                handleDeleteFile(
                                  frontUrl,
                                  IMAGE_CITIZEN_IDENTITY.FRONT
                                )
                              }
                              className="draff_icon"
                            />
                            <img src={frontUrl} alt="Preview" />
                            {uploading && (
                              <Progress
                                className="progress"
                                type="circle"
                                percent={progress}
                                width={30}
                              />
                            )}
                          </div>
                        </div>
                      ) : (
                        <>
                          <UserOutlined className="user-icon" />
                          <input
                            type="file"
                            onChange={(event) =>
                              handleChangeFile(
                                event,
                                IMAGE_CITIZEN_IDENTITY.FRONT
                              )
                            }
                          />
                        </>
                      )}
                    </span>
                    <p className="front-text">Front</p>
                  </div>
                  <div className="select-picture-card">
                    <span>
                      {backsizeUrl ? (
                        <div className="image_border">
                          <div className="image_area">
                            <EyeOutlined
                              onClick={() => handlePreviewImage(backsizeUrl)}
                              className="eye_icon"
                            />
                            <DeleteOutlined
                              onClick={() =>
                                handleDeleteFile(
                                  backsizeUrl,
                                  IMAGE_CITIZEN_IDENTITY.BACKSIZE
                                )
                              }
                              className="draff_icon"
                            />
                            <img src={backsizeUrl} alt="Preview" />
                            {uploading && (
                              <Progress
                                className="progress"
                                type="circle"
                                percent={progress}
                                width={30}
                              />
                            )}
                          </div>
                        </div>
                      ) : (
                        <>
                          <UserOutlined className="user-icon" />
                          <input
                            type="file"
                            onChange={(event) =>
                              handleChangeFile(
                                event,
                                IMAGE_CITIZEN_IDENTITY.BACKSIZE
                              )
                            }
                          />
                        </>
                      )}
                    </span>
                    <p className="backside-text">Backside</p>
                  </div>
                </div>
                <p className="size-note">
                  Upload a .JPEG or .PNG file and should not weigh more than 5M
                </p>
                <div className="btn-submit">
                  <Button primary type="submit">
                    Submit
                  </Button>
                </div>
                <div className="identity-verification-note">
                  <SafetyCertificateOutlined />
                  <p>
                    This information is for identity verification only, and will
                    be kept safe by ASRA
                  </p>
                </div>
              </Form>
            )}
          </Spin>
        }
      />
      <ModalConfirm
        title={null}
        isModalVisible={previewVisible}
        footer={null}
        close={handleCloseImage}
        zIndex={4}
        children={
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        }
      />
    </>
  );
}

export default memo(BecomeAnInnkeeper);
