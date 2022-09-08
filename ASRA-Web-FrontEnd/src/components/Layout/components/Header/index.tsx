import { useEffect, useState, useContext, memo } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Row, Col } from "antd";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "commons/utils/firebase";
import { v4 } from "uuid";

import { useAppDispatch, useAppSelector } from "app/hooks";
import { authActions } from "store/feature/auth/authSlice";
import {
  IMAGE_TYPE,
  IMAGE_CITIZEN_IDENTITY,
  IDRECOGNITION_API_KEY,
  NOTIFICATION_TYPE,
} from "commons/constants";

import { SUCCESS, ERROR } from "commons/constants/Notification";
import {
  INNKEEPER_STATUS,
  USERNAME,
  USER_INFOR,
} from "commons/constants/LocalstorageConstant";
import { manageItems } from "commons/masterData/MenuManage";
import { getBase64 } from "commons/utils/files";
import { openNotification } from "components/helper/Notification";
import { getToken } from "commons/utils/js-cookie";

import Search from "../Search";
import BecomeAnInnkeeper from "./BecomeAnInnkeeper";
import AccountMenu from "./AccountMenu";
import { SocketContext } from "app/socket";
import { becomeInnkeeper } from "api/account";
import {
  getNotifications,
  resetNumberOfNewNotification,
  readNotification,
  findNotificationsUnread,
} from "api/socket";
import { citySearchSelector } from "store/selectors";
import { citySearch } from "../../../../store/feature/search/searchSlice";
import "./index.scss";

function HeaderLayout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  let citySearchValue = useAppSelector(citySearchSelector);
  const socket = useContext(SocketContext);
  const userInfor = JSON.parse(localStorage.getItem("userInfor") || "{}");

  const [frontImage, setFrontImage] = useState<any>(null);
  const [backsideImage, setBackSideImage] = useState<any>(null);

  const [frontUrl, setFrontUrl] = useState<string>("");
  const [backsizeUrl, setBacksizeUrl] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [checkingFront, setCheckingFront] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);

  // NOTIFICATION
  const [notificationList, setNotificationList] = useState<any[]>([]);
  const [numberOfNewNotification, setNumberOfNewNotification] =
    useState<number>(0);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationComponentRef, setNotificationComponentRef] =
    useState<any>(null);
  const [bellIconComponentRef, setBellIconComponentRef] = useState<any>(null);
  const [notificationLoading, setNotificationLoading] =
    useState<boolean>(false);

  let resRequest: {
    frontImage: string;
    backImage: string;
    id: string;
    name: string;
    dob: string;
    address: string;
    issue_date: string;
    issue_loc: string;
    gmailPaypal: string;
  };
  let imageUrlTemp: any[] = [];

  let token = Boolean(getToken());

  const handleNavigateManage = () => {
    manageItems.forEach((element) => {
      element.className = "";
    });
    manageItems[0].className = "active";
    navigate("/manage");
  };

  const handleConfirmInnkeeper = (data: any) => {
    setLoading(true);
    let imagesUpload = [frontImage, backsideImage];
    let promises: any = [];
    if (!frontImage || !backsideImage) {
      openNotification(
        ERROR,
        "You must upload the front and back sides of the citizen identify!"
      );
      setLoading(false);
      return;
    }
    imagesUpload.map((image, index) => {
      if (image) {
        let imageRef = ref(storage, `citizen/${v4()}`);
        let uploadTask = uploadBytesResumable(imageRef, image);
        promises.push(uploadTask);
        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            let progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploading(true);
            setProgress(progress);
            if (progress === 100) {
              setUploading(false);
            }
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
            if (index === 0) {
              await checkRecognition(data.gmailPaypal);
            }
            // Get images uploaded from firebase

            await getDownloadURL(uploadTask.snapshot.ref).then(
              (downloadURL) => {
                imageUrlTemp.push(downloadURL);
                return downloadURL;
              }
            );
          }
        );
      }
    });
    Promise.all(promises)
      .then(() => {})
      .catch((err) => err);
  };

  const checkRecognition = (gmailPaypal: string) => {
    idRecognition(frontImage, IMAGE_CITIZEN_IDENTITY.FRONT, gmailPaypal);
  };

  const idRecognition = (data: any, type: string, gmailPaypal: string) => {
    let body = new FormData();
    body.append("image", data);
    fetch("https://api.fpt.ai/vision/idr/vnm", {
      method: "POST",
      headers: {
        "api-key": IDRECOGNITION_API_KEY,
      },
      body,
    })
      .then((res) => res.json())
      .then((resFront) => {
        if (resFront.errorCode !== 0) {
          setCheckingFront(false);
          openNotification(
            ERROR,
            "Front: " + resFront.errorMessage || resFront.message
          );
          setLoading(false);
          return;
        } else {
          if (resFront.data[0].id === undefined) {
            openNotification(
              ERROR,
              "Can't recognize the front of the ID card!"
            );
            setLoading(false);
            return;
          }
          setCheckingFront(true);
        }

        let body = new FormData();
        body.append("image", backsideImage);
        fetch("https://api.fpt.ai/vision/idr/vnm", {
          method: "POST",
          headers: {
            "api-key": IDRECOGNITION_API_KEY,
          },
          body,
        })
          .then((res) => res.json())
          .then((resBack) => {
            if (resBack.errorCode !== 0) {
              openNotification(
                ERROR,
                "Backside: " + resBack.errorMessage || resBack.message
              );
              setLoading(false);
              return;
            } else {
              if (resBack.data[0].features === undefined) {
                openNotification(
                  ERROR,
                  "Can't recognize the backside of the ID card!"
                );
                setLoading(false);
                return;
              }

              if (checkingFront) {
                mappingResData(resFront.data[0], resBack.data[0], gmailPaypal);
                //call api save data here
                becomeInnkeeper(resRequest)
                  .then((res: any) => {
                    openNotification(SUCCESS, res.message.messageDetail);
                    setVisible(false);
                    localStorage.setItem(INNKEEPER_STATUS, "1");
                    socket.emit("sendNotification", {
                      roomId: null,
                      senderId: userInfor?.id,
                      contractId: null,
                      senderName: userInfor?.username,
                      receiverName: "admin1",
                      message: "has sent a request to become an innkeeper.",
                      type: NOTIFICATION_TYPE.BECOME_INNKEEPER,
                      thumbnail: userInfor?.image && userInfor?.image,
                    });
                  })
                  .catch((err: any) => {});
              }
            }
            setLoading(false);
          })
          .catch((err) => {});
      })
      .catch((err) => {});
  };

  const mappingResData = (resFront: any, resBack: any, gmailPaypal: string) => {
    resRequest = {
      frontImage: imageUrlTemp[0],
      backImage: imageUrlTemp[1],
      id: resFront.id,
      name: resFront.name,
      dob: resFront.dob,
      address: resFront.address,
      issue_date: resBack.issue_date,
      issue_loc: resBack.issue_loc,
      gmailPaypal: gmailPaypal,
    };
  };

  /**
   * Select files and upload images to firebase
   * @param event
   * @returns
   */
  const handleChangeFile = (event: any, imageType: string) => {
    let file = event.target.files[0];
    let isCheckImageType =
      file.type === IMAGE_TYPE.PNG || file.type === IMAGE_TYPE.JPEG;
    let isCheckSizeImage = file.size / 1024 / 1024 > 5;

    if (!isCheckImageType) {
      openNotification(ERROR, "You can only upload JPG/PNG files!");
      return;
    }
    if (isCheckSizeImage) {
      openNotification(ERROR, "Image must smaller than 5MB!");
      return;
    }
    if (imageType === IMAGE_CITIZEN_IDENTITY.FRONT) {
      getBase64(file).then((data: any) => {
        setFrontUrl(data);
        setFrontImage(file);
      });
    }
    if (imageType === IMAGE_CITIZEN_IDENTITY.BACKSIZE) {
      getBase64(file).then((data: any) => {
        setBacksizeUrl(data);
        setBackSideImage(file);
      });
    }
  };

  const handleDeleteFile = (url: any, imageType: string) => {
    if (imageType === IMAGE_CITIZEN_IDENTITY.FRONT) {
      setFrontUrl("");
      setFrontImage(null);
    }
    if (imageType === IMAGE_CITIZEN_IDENTITY.BACKSIZE) {
      setBacksizeUrl("");
      setBackSideImage(null);
    }
  };

  const handleShowModal = () => {
    setVisible(true);
    setFrontUrl("");
    setFrontImage(null);
    setBacksizeUrl("");
    setBackSideImage(null);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleLogout = () => {
    dispatch(authActions.logout());
    dispatch(authActions.resetUserData());
    localStorage.removeItem(INNKEEPER_STATUS);
    localStorage.removeItem(USER_INFOR);
    localStorage.removeItem(USERNAME);
    socket?.emit("removeUser")
    navigate("/login");
  };

  const handlePostNewRoom = () => {
    window.location.href = "/room/new";
  };

  const handleResetNumberOfNewNotification = () => {
    resetNumberOfNewNotification(userInfor?.username).then((res) =>
      setNumberOfNewNotification(res?.data?.numberOfNewNotification)
    );
  };

  const setNotificationComponentParentRef = (notificationRef: any) => {
    setNotificationComponentRef(notificationRef);
  };

  const setBellIconomponentParentRef = (bellIconRef: any) => {
    setBellIconComponentRef(bellIconRef);
  };

  const handleReadNotification = (notificationId: string) => {
    let dataReq = {
      notificationId: notificationId,
    };
    let notificationsNewData = notificationList.map((notification) => {
      if (notification?.id === notificationId) {
        notification.isRead = true;
        readNotification(dataReq)
          .then((res) => {})
          .catch((err) => {});
      }
      return notification;
    });

    setNotificationList(notificationsNewData);
  };

  const setNotificationStatusAtComponentChild = (status: string) => {
    setNotificationLoading(true);
    if (status === "Unread") {
      findNotificationsUnread(userInfor?.username).then((res) => {
        setNotificationList(res?.data?.notificationList);
        setNotificationLoading(false);
      });
    } else {
      getNotifications(userInfor?.username).then((res) => {
        let data = res.data;
        setNotificationList(data?.notificationList);
        setNotificationLoading(false);
      });
    }
  };

  useEffect(() => {
    socket.emit("addNewUser", userInfor?.username);
    socket?.on("getNotification", (data: any) => {
      let notification = {
        roomId: data?.roomId,
        senderId: data?.senderId,
        contractId: data?.contractId,
        id: data?.id,
        sender: data?.senderName,
        message: data?.message,
        isRead: data?.isRead,
        type: data?.type,
        thumbnail: data?.thumbnail,
        createdAt: data?.createdAt,
      };
      if (data?.message) {
        setNumberOfNewNotification(data?.numberOfNewNotification);
        setNotificationList((prev) => [notification, ...prev]);
      }
    });
  }, [socket]);

  useEffect(() => {
    if (token) {
      getNotifications(userInfor?.username).then((res) => {
        let data = res.data;
        setNotificationList(data?.notificationList);
        setNumberOfNewNotification(data?.numberOfNewNotification);
      });
    }
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        notificationComponentRef?.current &&
        !notificationComponentRef?.current.contains(event.target) &&
        bellIconComponentRef?.current &&
        !bellIconComponentRef?.current.contains(event.target)
      ) {
        setShowNotification(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [notificationComponentRef]);

  useEffect(() => {
    let bellIcon = document.getElementsByClassName("bell-icon")[0];
    const handleClickInside = (event: any) => {
      let notification = document.getElementsByClassName("show-notification");
      if (
        bellIconComponentRef?.current &&
        bellIconComponentRef?.current.contains(event.target)
      ) {
        setShowNotification(notification?.length !== 0 ? false : true);
      }
    };

    bellIconComponentRef?.current?.addEventListener("click", handleClickInside);
    return () => {
      bellIcon?.removeEventListener("click", handleClickInside);
    };
  }, [bellIconComponentRef]);

  return (
    <>
      <header className="header-user-wrapper">
        <div className="header-top"></div>
        <Row className="sticky">
          {/* LOGO */}
          <Col className="display-center" span={2}>
            <Link to="/">
              <div className="small-icon"> </div>
            </Link>
          </Col>
          {/* PAGES ON NAVBAR */}
          <Col className="display-center" span={!token ? 10 : 8}>
            <ul>
              <li onClick={() => dispatch(citySearch(true))}>
                <Link to="/search/Thành phố Đà Nẵng">Da Nang</Link> &nbsp;
              </li>
              <li onClick={() => dispatch(citySearch(true))}>
                <Link to="/search/Thành phố Hà Nội">Ha Noi</Link> &nbsp;
              </li>
              <li onClick={() => dispatch(citySearch(true))}>
                <Link to="/search/Thành phố Hồ Chí Minh">Ho Chi Minh</Link>{" "}
                &nbsp;
              </li>
              <li>
                <Link to="/about-us">About Us</Link> &nbsp;
              </li>
            </ul>
          </Col>
          {/* SEARCH BAR */}
          <Search />
          {/* MENU SETTING FOR ACCOUNT */}
          {!token && (
            <Col className="account-menu" span={5}>
              <ul>
                <li>
                  <Link to="/login">Signin</Link>
                </li>{" "}
                |
                <li>
                  <Link to="/register">Signup</Link>
                </li>
              </ul>
            </Col>
          )}
          {token && (
            <Col className="account-menu" span={7}>
              <div className="btn-action">
                {localStorage.getItem(INNKEEPER_STATUS) === "0" && (
                  <button
                    onClick={handleShowModal}
                    className="btn-become-an-innkeeper"
                  >
                    Become An Innkeeper
                  </button>
                )}

                {localStorage.getItem(INNKEEPER_STATUS) === "1" && (
                  <button
                    onClick={handleShowModal}
                    className="btn-pending-approval"
                  >
                    Pending Approval
                  </button>
                )}

                {localStorage.getItem(INNKEEPER_STATUS) === "2" && (
                  <button className="btn-post-room" onClick={handlePostNewRoom}>
                    Post Room
                  </button>
                )}
                {/* BECOME AN INNKEEPER MODAL */}
                <BecomeAnInnkeeper
                  handleConfirmInnkeeper={(data: any) =>
                    handleConfirmInnkeeper(data)
                  }
                  handleChangeFile={handleChangeFile}
                  handleDeleteFile={handleDeleteFile}
                  handleCancel={handleCancel}
                  frontUrl={frontUrl}
                  backsizeUrl={backsizeUrl}
                  progress={progress}
                  uploading={uploading}
                  visible={visible}
                  loading={loading}
                />
              </div>
              {/* ACCOUNT MENU */}
              <AccountMenu
                handleLogout={handleLogout}
                handleResetNumberOfNewNotification={
                  handleResetNumberOfNewNotification
                }
                handleReadNotification={handleReadNotification}
                setNotificationComponentParentRef={
                  setNotificationComponentParentRef
                }
                setBellIconRef={setBellIconomponentParentRef}
                setNotificationStatusAtComponentChild={
                  setNotificationStatusAtComponentChild
                }
                showNotification={showNotification}
                numberOfNewNotification={numberOfNewNotification}
                notificationList={notificationList}
                notificationLoading={notificationLoading}
              />
            </Col>
          )}
          <Outlet />
        </Row>
      </header>
    </>
  );
}

export default memo(HeaderLayout);
