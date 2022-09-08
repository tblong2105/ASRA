import classNames from "classnames/bind";
import { useEffect, useState, useRef, memo } from "react";
import {
  Col,
  Row,
  Avatar,
  Input,
  Form,
  Select,
  InputNumber,
  Modal,
  Spin,
  Alert,
} from "antd";
import { UserOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "commons/utils/firebase";
import { v4 } from "uuid";

import Button from "components/Layout/components/Button";

import { openNotification } from "components/helper/Notification";
import { SUCCESS } from "commons/constants/Notification";
import { IMAGE_TYPE } from "commons/constants";
import { getBase64 } from "commons/utils/files";
import { authActions } from "store/feature/auth/authSlice";
import { useAppDispatch } from "app/hooks";
import { updateProfile } from "api/account";
import {
  getCities,
  getDistricts,
  getWards,
} from "commons/utils/location-ultis";
import { getUserInformation } from "api/account";
import { Profile } from "models/User";

import LoadingIcon from "components/Layout/components/Loading";
import ModalConfirm from "components/helper/ModalConfirm";

import styles from "./EditProfile.module.scss";
import { validateMessages } from "helpers/ValidateMessage";
import "./EditProfile.scss";

const cx = classNames.bind(styles);

function EditProfile() {
  const { Option } = Select;
  const dispatch = useAppDispatch();
  const [cityConst, setCity] = useState<any[]>([]);
  const [districtConst, setDistrict] = useState<any[]>([]);
  const [wardConst, setWards] = useState<any[]>([]);
  const [cityName, setCityName] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [resResponse, setResResponse] = useState<any>({});
  const [imageUpload, setImageUpload] = useState<any>({});
  const [imageDisplay, setImageDisplay] = useState<any>(null);
  const [loadingEditRoom, setLoadingEditRoom] = useState<boolean>(false);
  const [loadingFormData, setLoadingFormData] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile | any>({} as Profile);
  const [errorMessageImage, setErrorMessageImage] = useState("");
  const [form] = Form.useForm();
  const fileInputRef = useRef<any>(null);
  const genderOption = [
    {
      id: "0",
      name: "Other",
    },
    {
      id: "1",
      name: "Male",
    },
    {
      id: "2",
      name: "Female",
    },
  ];

  useEffect(() => {
    setLoadingFormData(true);
    getUserInformation().then((res: Profile) => {
      setProfile(res);
      form.setFieldsValue({
        ...res,
        fullName: res.fullName ? res.fullName : null,
        age: res.age !== 0 ? res.age : null,
        gender: res.gender !== "-1" ? res.gender : null,
        phoneNumber: res.phoneNumber ? res.phoneNumber : null,
        profession: res.profession ? res.profession : null,
        city: res.city ? res.city : null,
        district: res.district ? res.district : null,
        ward: res.ward ? res.ward : null,
      });
      setLoadingFormData(false);

      if (form.getFieldValue("district")) {
        setDistrict(getDistricts(form.getFieldValue("city")));
      }

      if (form.getFieldValue("ward")) {
        setWards(
          getWards(form.getFieldValue("city"), form.getFieldValue("district"))
        );
      }
    });
  }, []);

  useEffect(() => {
    // Get all cities
    setCity(getCities());
  }, []);

  const handleConfirmDataBeforeSave = (data: any) => {
    setResResponse(data);
    setIsModalVisible(true);
  };

  const handleConfirmDataBeforeSaveFailed = (errorInfo: any) => {
    let firstField = errorInfo?.errorFields[0]?.name[0];
    form.scrollToField(firstField);
    switch (firstField) {
      case "fullName":
        window.scrollTo(0, window.scrollY - 140);
        break;
      default:
        break;
    }
  };
  const handleUpdateProfile = () => {
    setLoadingEditRoom(true);
    handleUploadFileFirebase().then((image) => {
      let userInfor = JSON.parse(localStorage.getItem("userInfor") || "{}");
      if (!image) {
        resResponse["image"] = userInfor["image"];
      } else {
        resResponse["image"] = image;
      }

      updateProfile(resResponse).then((res: any) => {
        openNotification(SUCCESS, res.message.messageDetail);

        dispatch(authActions.getInfo(image));

        // Set avatar updated
        if (image) {
          userInfor["image"] = image;
        }

        localStorage.setItem("userInfor", JSON.stringify(userInfor));
        setIsModalVisible(false);
        setLoadingEditRoom(false);
      });
    });
  };

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

  const handleClickToChangeFile = () => {
    fileInputRef?.current?.click();
  };

  const handleChangeFile = (event: any) => {
    let files: any = Array.from(event.target.files);
    if (
      !(files[0].type === IMAGE_TYPE.PNG || files[0].type === IMAGE_TYPE.JPEG)
    ) {
      setErrorMessageImage("You can only upload JPEG/PNG files");
      return;
    } else if (files[0].size / 1024 / 1024 > 1) {
      setErrorMessageImage("Image must smaller than 1MB");
      return;
    } else if (
      (files[0].type === IMAGE_TYPE.PNG || files[0].type === IMAGE_TYPE.JPEG) &&
      files[0].size / 1024 / 1024 <= 1
    ) {
      setErrorMessageImage("");
    }
    setImageUpload(files[0]);
    getBase64(files[0]).then((imageBase64: any) => {
      setImageDisplay(imageBase64);
    });
  };

  const handleUploadFileFirebase = () => {
    let metadata = {
      contentType: ["image/jpeg", "image/png"],
    };
    let imageRef = ref(storage, `avatar/avatar_${v4()}`);
    let uploadTask = uploadBytesResumable(imageRef, imageUpload);
    if (Object.getPrototypeOf(imageUpload) === Object.prototype) {
      return Promise.resolve(null);
    }
    // Listen for state changes, errors, and completion of the upload.
    let imageUploadPromise = new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          switch (snapshot.state) {
            case "paused":
              break;
            case "running":
              break;
          }
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;
            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        async () => {
          // Get images uploaded from firebase
          await getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              resolve(downloadURL);
              return downloadURL;
            })
            .catch((err) => reject(err))
            .finally(() => {});
        }
      );
    });

    return imageUploadPromise;
  };

  return (
    <>
      {loadingFormData ? (
        <div className={cx("spin")}>
          <Spin size="large" />
        </div>
      ) : (
        <Row className={`${cx("edit-profile-screen")} edit-profile-screen`}>
          <Col span={16}>
            <Form
              form={form}
              name="profile"
              initialValues={{ remember: true }}
              scrollToFirstError
              onFinish={handleConfirmDataBeforeSave}
              onFinishFailed={handleConfirmDataBeforeSaveFailed}
              validateMessages={validateMessages}
              autoComplete="off"
              layout="vertical"
            >
              <Row>
                <Col span={20}>
                  <p className={cx("edit-profile-header")}>Edit Profile</p>
                </Col>
                <Col span={20}>
                  <p className={cx("edit-profile-text")}>
                    Setup your general profile details.
                  </p>
                </Col>
                <Col span={20}>
                  <Form.Item
                    name="fullName"
                    label="Full Name"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={20}>
                  <Form.Item name="email" label="Email">
                    <Input disabled />
                  </Form.Item>
                </Col>

                <Col style={{ marginRight: "10px" }} span={10}>
                  <Form.Item
                    name="age"
                    label="Age"
                    rules={[
                      {
                        required: true,
                        type: "number",
                        min: 1,
                        max: 100,
                        message: "Age must be between 1 and 100",
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="Enter your age"
                      controls={false}
                    />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item
                    name="gender"
                    label="Gender"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select
                      placeholder={"Select gender"}
                      onChange={(e: any) => e}
                    >
                      {genderOption?.map((gender: any, index: number) => (
                        <Option key={index} value={gender.id}>
                          {gender.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={20}>
                  <Form.Item
                    name="profession"
                    label="Profession"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input placeholder="Enter your profession" />
                  </Form.Item>
                </Col>
                <Col span={20}>
                  <Form.Item
                    name="phoneNumber"
                    label="Phone Number"
                    rules={[
                      {
                        required: true,
                      },
                      {
                        pattern: /^((0)[3|5|7|8|9])+([0-9]{8})$\b/,
                        message: "Phone Number incorrect format!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your phone number" />
                  </Form.Item>
                </Col>
                <Col style={{ marginRight: "10px" }} span={10}>
                  <Form.Item
                    name="city"
                    label="City"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select
                      placeholder={"Select city"}
                      onChange={(e: any) => getCity(e)}
                    >
                      {cityConst?.map((type: any, index: number) => (
                        <Option key={index} value={type.name}>
                          {type.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item
                    name="district"
                    label="District"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select
                      placeholder={"Select District"}
                      onChange={(e: any) => getDistrict(e)}
                    >
                      {districtConst?.map((type: any, index: number) => (
                        <Option key={index} value={type.name}>
                          {type.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col style={{ marginRight: "10px" }} span={10}>
                  <Form.Item
                    name="ward"
                    label="Ward"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select placeholder={"Select ward"}>
                      {wardConst?.map((type: any, index: number) => (
                        <Option key={index} value={type.name}>
                          {type.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item
                    name="streetName"
                    label="Street Name"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input placeholder="Enter your house number and street" />
                  </Form.Item>
                </Col>
              </Row>
              <Col span={24}>
                <Button primary type="submit" className={cx("edit-button")}>
                  Update
                </Button>
              </Col>
            </Form>
          </Col>
          <Col span={8} className={cx("avatar")}>
            <Row>
              <Col span={24}>
                <p className={cx("edit-profile-avatar-title")}>
                  Profile Picture
                </p>
              </Col>
              <Col span={24} className={cx("edit-profile-avatar-image")}>
                <Avatar
                  style={{ backgroundColor: "#c3c3c3" }}
                  src={imageDisplay || profile.image}
                  icon={<UserOutlined />}
                  size={164}
                />
              </Col>
              <Col span={24} className={cx("edit-profile-avatar-button")}>
                <Button primary onClick={handleClickToChangeFile}>
                  Select Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={(event) => handleChangeFile(event)}
                  style={{ display: "none" }}
                />
              </Col>
              {errorMessageImage ? (
                <Col span={24} className="error">
                  <Alert message={errorMessageImage} type="error" showIcon />
                </Col>
              ) : (
                <Col span={24} className={cx("edit-profile-image-validate")}>
                  <span>Maximum file size 1 MB Format: .JPEG, .PNG</span>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      )}

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
          <Button key={2} id={2} submit small onClick={handleUpdateProfile}>
            {loadingEditRoom && (
              <LoadingIcon customStyles={{ fontSize: 14, color: "#fff" }} />
            )}
            &nbsp; OK
          </Button>,
        ]}
        children={
          <div style={{ display: "flex", paddingLeft: "16px" }}>
            <ExclamationCircleOutlined
              style={{ fontSize: "22px", color: "#faad14" }}
            />
            <p style={{ paddingLeft: "16px", fontSize: "16px" }}>
              Do you want to update your profile?
            </p>
          </div>
        }
      />
    </>
  );
}

export default memo(EditProfile);
