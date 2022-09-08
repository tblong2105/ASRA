import { createRef, useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Form, FormInstance } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Button from "components/Layout/components/Button";
import classnames from "classnames/bind";
import { v4 } from "uuid";

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "commons/utils/firebase";

import { useAppDispatch, useAppSelector } from "app/hooks";
import { roomSelector } from "store/selectors";
import { dataRoom, resetDataRoom } from "store/feature/room/roomSlice";
import { getBase64 } from "commons/utils/files";
import { IMAGE_RESOURCE, IMAGE_TYPE } from "commons/constants";
import { openNotification } from "components/helper/Notification";
import { SUCCESS } from "commons/constants/Notification";
import { createRoom, getRoomDetail, editRoom } from "api/room";
import { deleteImage } from "api/image";
import { utilities } from "commons/constants/room-screen";
import { Room } from "models/Room";
import { validateMessages } from "helpers/ValidateMessage";
import { LocationProps } from "models/User";

import Process from "./Process";
import Information from "./Information";
import Address from "./Address";
import Utilities from "./Utilities";
import Confirmation from "./Confirmation";
import LoadingIcon from "components/Layout/components/Loading";
import ModalConfirm from "components/helper/ModalConfirm";

import "./index.scss";
import styles from "./index.module.scss";
const cx = classnames.bind(styles);

function CreateRoom() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location: any = useLocation() as LocationProps;
  const params = useParams<{ roomId: string }>();

  const [tab, setTab] = useState<number>(0);
  const [valid, setValid] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [dataRoomRequest, setDataRoomRequest] = useState<Room | any>();

  // INFORMATION
  const [roomNoDropdownData, setRoomNoDropDownData] = useState<any[]>([]);
  const [roomDetailRentedList, setRoomDetailRentedList] = useState<any[]>([]);

  // CONFIRMATION
  const [description, setDescription] = useState<string>("");

  // IMAGES UPLOAD
  const [thumbnailImage, setThumbnailImage] = useState<any>(null);
  const [thumbnailImageUpload, setThumbnailImageUpload] = useState<any>(null);
  const [imageList, setImageList] = useState<any[]>([]);
  const [paths, setPaths] = useState<string[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [deletedImageLoading, setDeletedImageLoading] =
    useState<boolean>(false);
  const [imageId, setImageId] = useState<number>(0);
  const [errorMessageImage, setErrorMessageImage] = useState<string>("");
  const [imageListUpload, setImageListUpload] = useState<any[]>([]);

  // UTILITIES
  const [bed, setBed] = useState<boolean>(false);
  const [time, setTime] = useState<boolean>(false);
  const [wmc, setWmc] = useState<boolean>(false);
  const [ac, setAc] = useState<boolean>(false);
  const [television, setTelevision] = useState<boolean>(false);
  const [refrigerator, setRefrigerator] = useState<boolean>(false);
  const [wifi, setWifi] = useState<boolean>(false);
  const [parking, setParking] = useState<boolean>(false);
  const [toilet, setToilet] = useState<boolean>(false);
  const [kitchen, setKitchen] = useState<boolean>(false);
  const [errorMessageUtility, setErrorMessageUtility] = useState<string>("");

  const [wordCount, setWordCount] = useState<number>(0);
  const [textCount, setTextCount] = useState<number>(0);
  const [roomLoading, setRoomLoading] = useState<boolean>(false);
  const [roomEditLoading, setRoomEditLoading] = useState<boolean>(false);
  let room: any = useAppSelector(roomSelector);
  let userInfor = JSON.parse(localStorage.getItem("userInfor") || "{}");

  const imagesRef = useRef<any>();
  const formRef = createRef<FormInstance>();
  const [form] = Form.useForm();

  /**
   * Handle logic for action tab
   * @param tab
   * @param isNextAction
   * @param isBack
   */
  const handleSetTab = (
    tab: number,
    isNextAction: boolean = false,
    isBack: boolean = false
  ) => {
    if (isBack) {
      setValid(true);
      setTab(tab);
    } else {
      formRef.current
        ?.validateFields()
        .then(() => {
          // If back tab will be collect data because component re-render
          if (!isNextAction) {
            dispatch(dataRoom(formRef.current?.getFieldsValue()));
          }
          // Validate utility tab
          let isValidUtilityTab: boolean = handleValidUtilityTab(tab);
          if (isValidUtilityTab) return;
          setValid(true);
          setTab(tab);
        })
        .catch((err) => {
          let firstField = err?.errorFields[0]?.name[0];
          formRef.current?.scrollToField(firstField);
          window.scrollTo(0, window.scrollY + 30);
          setValid(false);
        });
    }
  };

  /**
   * Validate utility tab
   * @param tab
   * @returns
   */
  const handleValidUtilityTab = (tab: number): boolean => {
    let isValid = false;
    if (tab === 3) {
      let btuUpload: any = document.getElementsByClassName("btn_upload")[0];
      let borderUtility: any = document.getElementsByClassName("utilities")[0];
      let utilitiesActive: any =
        document.getElementsByClassName("utility-active");
      let imageListValid = [];
      if (thumbnailImage) {
        imageListValid = [...imageList, thumbnailImage];
      } else {
        imageListValid = [...imageList];
      }
      if (imageListValid.length >= 5) {
        setErrorMessageImage("");
      }
      if (utilitiesActive.length >= 5) {
        setErrorMessageUtility("");
      }
      // Validate images before move to information tab(tab 3)
      if (imageListValid.length <= 0 || imageListValid.length < 5) {
        setValid(false);
        setErrorMessageImage("Please select at least 5 photos");
        if (btuUpload) {
          btuUpload.style.border = "1px dashed #ff0000";
        }
        isValid = true;
        window.scrollTo(0, 150);
      } else if (utilitiesActive.length === 0 || utilitiesActive.length < 5) {
        setValid(false);
        setErrorMessageUtility("Please select at least 5 utilities");
        if (borderUtility) {
          borderUtility.style.border = "1px dashed #ff0000";
        }
        isValid = true;
        window.scrollTo(0, document.body.scrollHeight);
      } else if (imageList.length > 5 && utilitiesActive.length > 5) {
        setValid(true);
        if (btuUpload && btuUpload) {
          btuUpload.style.border = "1px dashed #d9d9d9;";
          borderUtility.style.border = "1px dashed #d9d9d9";
        }
        setTab(tab);
      }
    }
    return isValid;
  };

  /**
   * Call api to save data
   */
  const handleSaveData = () => {
    let promiseAsync: any = null;
    setRoomLoading(true);
    let imageListExited = imageList.filter(
      (file: any) => file?.resource !== IMAGE_RESOURCE.LOCAL
    );
    let countImageGreatest = Math.max(
      ...imageListExited.map((imageExited: any) => {
        return Number(
          imageExited?.imageName?.slice(0, imageExited?.imageName.indexOf("_"))
        );
      })
    );
    let numberOfImageExited =
      countImageGreatest !== -Infinity
        ? countImageGreatest
        : imageListExited.length;
    handleUploadFileFirebase(numberOfImageExited)
      .then((imageLinks: string[]) => {
        let imageListNew: any[] = [];
        let thumbnailImageNew: any = null;
        imageLinks.map((imageLink: string) => {
          let imageName: RegExpMatchArray | any =
            imageLink.match(/images%2F(.*)alt/);
          let imageType = imageName[1].includes(IMAGE_RESOURCE.THUMBNAIL);
          let file = {
            imageLink: imageLink,
            imageName: imageName[1].slice(0, -1),
            resource: imageType
              ? IMAGE_RESOURCE.THUMBNAIL
              : IMAGE_RESOURCE.FIREBASE,
          };
          if (imageType) {
            thumbnailImageNew = file;
          } else {
            imageListNew.push(file);
          }
          setPaths((prev: string[]) => [...prev, imageName[1].slice(0, -1)]);
        });
        if (params?.roomId && thumbnailImage?.imageLink) {
          dataRoomRequest["imageList"] = [...imageListExited, ...imageListNew];
          dataRoomRequest["thumbnailImage"] = thumbnailImage;
        } else if (params?.roomId && !thumbnailImage?.imageLink) {
          let originImage = [...imageListExited, ...imageListNew];
          originImage.shift();
          dataRoomRequest["imageList"] = originImage;
          dataRoomRequest["thumbnailImage"] = thumbnailImageNew;
        } else if (!params?.roomId) {
          dataRoomRequest["imageList"] = [...imageListExited, ...imageListNew];
          dataRoomRequest["thumbnailImage"] = thumbnailImageNew;
        }
        if (params?.roomId) {
          promiseAsync = new Promise((resolve, reject) => {
            editRoom(dataRoomRequest)
              .then((res: any) => {
                resolve(res);
              })
              .catch((err) => {
                reject(err);
              });
          }).then((res: any) => {
            openNotification(
              SUCCESS,
              `${res.body.message.message.messageDetail}`
            );
            setTimeout(() => {
              setRoomLoading(false);
              setIsModalVisible(false);
              navigate(`/manage/room-for-rent/${res.body.roomId}`);
            }, 1000);
          });
        } else {
          promiseAsync = new Promise((resolve, reject) => {
            createRoom(dataRoomRequest)
              .then((res: any) => {
                resolve(res);
              })
              .catch((err) => {
                reject(err);
              });
          }).then((res: any) => {
            openNotification(SUCCESS, `${res.message.message.messageDetail}`);
            setTimeout(() => {
              setRoomLoading(false);
              setIsModalVisible(false);
              navigate(`/manage/room-for-rent/${res.roomId}`);
            }, 1000);
          });
        }
      })
      .catch((err) => {});
  };

  /**
   * Confirm data before save data
   * @param data
   */
  const handleConfirmDataBeforeSave = (data: any) => {
    if (wordCount <= 500) {
      if (tab !== 3) {
        handleSetTab(tab + 1, true);
        dispatch(dataRoom(data));
      } else {
        // Get utilities
        let utilities = handleUtilities();
        // Data rooms name
        let roomNameList = roomNoDropdownData.map(
          (roomName) => roomName?.valueText
        );
        // Collect data before save data
        let dataReq = {
          ...room,
          roomsName: [...roomNameList, ...room?.roomsName],
          title: data?.title,
          description: description,
          utilities: utilities,
          roomId: params?.roomId,
        };
        setDataRoomRequest(dataReq);
        setIsModalVisible(true);
      }
    }
  };

  const handleConfirmDataBeforeSaveFinishFailed = (errorInfo: any) => {
    let firstField = errorInfo?.errorFields[0]?.name[0];
    formRef.current?.scrollToField(firstField);
    switch (firstField) {
      case "roomType":
        window.scrollTo(0, window.scrollY - 145);
        break;
      case "roomsName":
        window.scrollTo(0, window.scrollY - 145);
        break;
      case "capacity":
        window.scrollTo(0, window.scrollY - 145);
        break;
      case "gender":
        window.scrollTo(0, window.scrollY - 130);
        break;
      case "roomArea":
        window.scrollTo(0, window.scrollY - 130);
        break;
      case "title":
        window.scrollTo(0, window.scrollY - 145);
        break;
      default:
        break;
    }
  };
  /**
   * Reset form data
   */
  const handleResetFormData = () => {
    switch (tab) {
      case 0:
        formRef.current?.setFieldsValue({
          roomType: null,
          roomsName: [],
          capacity: null,
          gender: null,
          roomArea: null,
          rentalPrice: null,
          deposit: null,
          electricityCost: null,
          waterCost: null,
          internetCost: null,
        });
        break;
      case 1:
        formRef.current?.setFieldsValue({
          city: null,
          district: null,
          ward: null,
          streetName: null,
        });
        break;
      case 2:
        setThumbnailImage((prev: any) => ({ ...{ prev }, imageLink: "" }));
        setImageList([]);
        handleResetUtilities();
        break;
      case 3:
        formRef.current?.setFieldsValue({
          title: null,
        });
        setDescription("");
        break;
      default:
        break;
    }
  };

  const handleResetFormAllData = () => {
    formRef.current?.setFieldsValue({
      roomType: null,
      roomsName: [],
      capacity: null,
      gender: null,
      roomArea: null,
      rentalPrice: null,
      deposit: null,
      electricityCost: null,
      waterCost: null,
      internetCost: null,
      city: null,
      district: null,
      ward: null,
      streetName: null,
    });
    setImageList([]);
    handleResetUtilities();
    formRef.current?.setFieldsValue({
      title: null,
    });
    setDescription("");
  };

  /**
   * Handle reset utilities data
   */
  const handleResetUtilities = () => {
    setBed(false);
    setTime(false);
    setWmc(false);
    setAc(false);
    setTelevision(false);
    setRefrigerator(false);
    setParking(false);
    setToilet(false);
    setKitchen(false);
    utilities[0].className = "bed-utility-icon";
    utilities[0].border = "utility-default";
    utilities[1].className = "time-utility-icon";
    utilities[1].border = "utility-default";
    utilities[2].className = "washing-machine-utility-icon";
    utilities[2].border = "utility-default";
    utilities[3].className = "toilet-utility-icon";
    utilities[3].border = "utility-default";
    utilities[4].className = "air-condition-utility-icon";
    utilities[4].border = "utility-default";
    utilities[5].className = "television-utility-icon";
    utilities[5].border = "utility-default";
    utilities[6].className = "parking-utility-icon";
    utilities[6].border = "utility-default";
    utilities[7].className = "kitchen-utility-icon";
    utilities[7].border = "utility-default";
    utilities[8].className = "refrigerator-utility-icon";
    utilities[8].border = "utility-default";
    utilities[9].className = "wifi-utility-icon";
    utilities[9].border = "utility-default";
  };

  /**
   * Handle utilities
   * @returns
   */
  const handleUtilities = () => {
    let utis = new Set();
    if (bed) {
      utis.add("U01");
    }
    if (wmc) {
      utis.add("U02");
    }
    if (time) {
      utis.add("U03");
    }
    if (ac) {
      utis.add("U04");
    }
    if (television) {
      utis.add("U05");
    }
    if (refrigerator) {
      utis.add("U06");
    }
    if (wifi) {
      utis.add("U07");
    }
    if (parking) {
      utis.add("U08");
    }
    if (toilet) {
      utis.add("U09");
    }
    if (kitchen) {
      utis.add("U10");
    }
    return Array.from(utis);
  };

  /**
   * Validate tab before move tab
   */
  const handleCheckValid = () => {
    formRef.current
      ?.validateFields()
      .then(() => {
        setValid(true);
      })
      .catch(() => {
        setValid(false);
      });
  };

  /**
   * Get description value from confirmation tab
   * @param event
   */
  const handleChangeDescription = (event: any, editor: any) => {
    let descriptionValue = event.level.content;
    let clientHeight =
      event.target.iframeElement.contentWindow.document.getElementsByTagName(
        "body"
      )[0].clientHeight;
    setDescription(`<div id="${clientHeight}">${descriptionValue}</div>`);
  };

  const handleOnEditorChange = (event: any, editor: any) => {
    setTextCount(editor.plugins.wordcount.body.getCharacterCount());
    setWordCount(editor.plugins.wordcount.body.getWordCount());
  };

  /**
   * Handle active utilities
   * @param utilityId
   */
  const handleActiveUtility = (utilityId: any) => {
    switch (utilityId) {
      case 1:
        utilities[utilityId - 1].className = !bed
          ? "bed-utility-green-icon"
          : "bed-utility-icon";
        utilities[utilityId - 1].border = !bed
          ? "utility-active"
          : "utility-default";
        setBed(!bed);
        break;
      case 2:
        utilities[utilityId - 1].className = !time
          ? "time-utility-green-icon"
          : "time-utility-icon";
        utilities[utilityId - 1].border = !time
          ? "utility-active"
          : "utility-default";
        setTime(!time);
        break;
      case 3:
        utilities[utilityId - 1].className = !wmc
          ? "washing-machine-utility-green-icon"
          : "washing-machine-utility-icon";
        utilities[utilityId - 1].border = !wmc
          ? "utility-active"
          : "utility-default";
        setWmc(!wmc);
        break;
      case 4:
        utilities[utilityId - 1].className = !toilet
          ? "toilet-utility-green-icon"
          : "toilet-utility-icon";
        utilities[utilityId - 1].border = !toilet
          ? "utility-active"
          : "utility-default";
        setToilet(!toilet);
        break;
      case 5:
        utilities[utilityId - 1].className = !ac
          ? "air-condition-utility-green-icon"
          : "air-condition-utility-icon";
        utilities[utilityId - 1].border = !ac
          ? "utility-active"
          : "utility-default";
        setAc(!ac);
        break;
      case 6:
        utilities[utilityId - 1].className = !television
          ? "television-utility-green-icon"
          : "television-utility-icon";
        utilities[utilityId - 1].border = !television
          ? "utility-active"
          : "utility-default";
        setTelevision(!television);
        break;
      case 7:
        utilities[utilityId - 1].className = !parking
          ? "parking-utility-green-icon"
          : "parking-utility-icon";
        utilities[utilityId - 1].border = !parking
          ? "utility-active"
          : "utility-default";
        setParking(!parking);
        break;
      case 8:
        utilities[utilityId - 1].className = !kitchen
          ? "kitchen-utility-green-icon"
          : "kitchen-utility-icon";
        utilities[utilityId - 1].border = !kitchen
          ? "utility-active"
          : "utility-default";
        setKitchen(!kitchen);
        break;
      case 9:
        utilities[utilityId - 1].className = !refrigerator
          ? "refrigerator-utility-green-icon"
          : "refrigerator-utility-icon";
        utilities[utilityId - 1].border = !refrigerator
          ? "utility-active"
          : "utility-default";
        setRefrigerator(!refrigerator);
        break;
      case 10:
        utilities[utilityId - 1].className = !wifi
          ? "wifi-utility-green-icon"
          : "wifi-utility-icon";
        utilities[utilityId - 1].border = !wifi
          ? "utility-active"
          : "utility-default";
        setWifi(!wifi);
        break;
      default:
        break;
    }
  };

  /**
   * Select files and upload images to firebase
   * @param event
   * @returns
   */
  const handleUploadFile = (event: any) => {
    let files = event.target.files;
    let filesToArr = Array.from(files);
    let btuUpload: any = document.getElementsByClassName("btn_upload")[0];

    if (files.length === 0) return;

    // Style border when validate images
    if (btuUpload) {
      btuUpload.style.removeProperty("border");
      btuUpload.style.border = "1px dashed #d9d9d9";
    }

    if (files.length > 10 || imageList.length + files.length > 10) {
      setErrorMessageImage("You can only upload 10 files");
      return;
    }
    if (params?.roomId) {
      setThumbnailImageUpload(files[0]);
    }
    setImageListUpload((prev) => [...prev, ...filesToArr]);
    for (let i = 0; i < files.length; i++) {
      if (
        !(files[i].type === IMAGE_TYPE.PNG || files[i].type === IMAGE_TYPE.JPEG)
      ) {
        setErrorMessageImage("You can only upload JPEG/PNG files");
        return;
      }
      if (files[i].size / 1024 / 1024 > 1) {
        setErrorMessageImage("Image must smaller than 1MB");
        return;
      }
      getBase64(files[i]).then((data: any) => {
        let file = {
          imageLink: data,
          imageName: files[i].name,
          resource: IMAGE_RESOURCE.LOCAL,
        };
        setImageList((prev) => [...prev, file]);
      });
    }
  };

  /**
   * Upload images to the storage of firebase
   * @returns fileImage
   */
  const handleUploadFileFirebase = (numberOfImageExited: number) => {
    let metadata = {
      contentType: ["image/jpeg", "image/png"],
    };

    let thumbnailImageUploadNewName = null;
    if (thumbnailImageUpload) {
      thumbnailImageUploadNewName = new File(
        [thumbnailImageUpload],
        IMAGE_RESOURCE.THUMBNAIL,
        {
          type: "image/png",
        }
      );
    }
    let filterImageUpdate = [];
    if (params?.roomId) {
      if (thumbnailImage?.imageLink === "") {
        imageListUpload.shift();
      }
      filterImageUpdate = imageListUpload;
    } else {
      filterImageUpdate = imageListUpload;
    }

    let imageListUploadArr = [
      ...Array.from(filterImageUpdate),
      thumbnailImageUploadNewName,
    ].filter((image) => image !== null);

    let imageUploadListPromiseAll: any[] = [];
    imageListUploadArr?.map((file: any) => {
      numberOfImageExited += 1;
      let imageRef = ref(
        storage,
        `images/${
          file?.name === IMAGE_RESOURCE.THUMBNAIL
            ? IMAGE_RESOURCE.THUMBNAIL
            : numberOfImageExited
        }_${v4()}`
      );
      let uploadTask = uploadBytesResumable(imageRef, file);
      // Listen for state changes, errors, and completion of the upload.
      let imageUploadPromise = new Promise((resolve, reject) => {
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
      imageUploadListPromiseAll.push(imageUploadPromise);
    });

    return Promise.all(imageUploadListPromiseAll);
  };

  /**
   * Delete image from firebase
   * @param file
   */
  const handleDeleteFile = (file: any) => {
    let { imageLink, id, resource } = file;
    // Arrange images in ascending order so that they are displayed in default
    let images = [
      thumbnailImage,
      ...[...imageList].sort(
        (a: any, b: any) =>
          a?.imageName?.slice(0, a?.imageName.indexOf("_")) -
          b?.imageName?.slice(0, b?.imageName.indexOf("_"))
      ),
    ];

    // let dataRequestDelete = {
    //   imageId: null,
    // };

    switch (true) {
      case resource === IMAGE_RESOURCE.LOCAL:
        // If update image after remote that image will be set image list upload again
        imageListUpload?.map((imageUpload: any) => {
          setImageListUpload((prev) => [
            ...prev.filter((image) => !imageUpload),
          ]);
        });
        // Set image list to show on ui
        setImageList(
          imageList.filter((image) => {
            return image.imageLink !== imageLink;
          })
        );
        break;
      case resource === IMAGE_RESOURCE.FIREBASE:
        setImageId(id);
        // dataRequestDelete["imageId"] = id;
        // setDeletedImageLoading(true);
        // // Delete image on database
        // deleteImage(dataRequestDelete)
        //   .then(() => {
        //     setDeletedImageLoading(false);
        //   })
        //   .catch((err) => {});
        // paths.map((path) => {
        //   if (imageLink.includes(path)) {
        //     let imagesListRef = ref(storage, `images/${path}`);
        //     // Delete images on firebase
        //     deleteObject(imagesListRef)
        //       .then(() => {
        setImageList(
          imageList.filter((image) => image.imageLink !== imageLink)
        );
        //       })
        //       .catch(() => {});
        //   }
        // });
        break;
      case resource === IMAGE_RESOURCE.THUMBNAIL:
        setImageId(id);
        // let dataReqUpdate = {
        //   roomId: params?.roomId,
        //   deleteImageFlag: true,
        //   thumbnailImage: {
        //     imageLink: images[1]?.imageLink,
        //     imageName: images[1]?.imageName,
        //   },
        // };
        // // The set thumbnail image is an image next
        // editRoom(dataReqUpdate)
        //   .then(() => {
        //     let thumbnail = {
        //       id: images[1].id,
        //       imageLink: images[1]?.imageLink ? images[1]?.imageLink : "",
        //       imageName: images[1]?.imageName ? images[1]?.imageName : "",
        //       resource: IMAGE_RESOURCE.THUMBNAIL,
        //     };
        //     setThumbnailImage(thumbnail);
        setThumbnailImage((prev: any) => ({
          ...prev,
          imageLink: images[1]?.imageLink,
          imageName: images[1]?.imageName,
        }));
        setImageList(
          imageList.filter((image) => {
            return image?.imageLink !== images[1]?.imageLink;
          })
        );
        // })
        // .catch((err) => {});

        // Delete that image next
        // dataRequestDelete["imageId"] = images[1]?.id;
        // setDeletedImageLoading(true);
        // deleteImage(dataRequestDelete)
        //   .then(() => {
        //     setImageList(
        //       imageList.filter((image) => {
        //         return image?.imageLink !== images[1]?.imageLink;
        //       })
        //     );
        //     setDeletedImageLoading(false);
        //   })
        //   .catch((err) => {});
        break;
      default:
        break;
    }
  };

  /**
   * Style for image card
   */
  const handleStyleDisplayImage = () => {
    let imageDisplayLayout: any =
      document.getElementsByClassName("image-display")[0];
    let btuUpload: any = document.getElementsByClassName("btn_upload")[0];
    let uploadIcon: any = document.getElementsByClassName("anticon-inbox")[0];
    let uploadTitle: any = document.getElementsByClassName("upload-title")[0];
    let imagesLength: number = 0;

    if (!thumbnailImage) {
      imagesLength = [...imageList].length;
    } else {
      imagesLength = [...imageList, thumbnailImage].length;
    }
    if (imageDisplayLayout && btuUpload && uploadIcon && uploadTitle) {
      if (imagesLength <= 0) {
        if (params?.roomId) {
          setLoading(true);
        }
        imageDisplayLayout.style.display = "block";
        imageDisplayLayout.style.transition = "0.6s";
        btuUpload.style.width = "100%";
        btuUpload.style.transition = "0.6s";
        uploadIcon.style.fontSize = "38px";
        uploadTitle.style.fontSize = "16px";
        imageDisplayLayout.style.paddingLeft = "8px";
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } else {
        if (params?.roomId) {
          setLoading(false);
        }
        imageDisplayLayout.style.display = "flex";
        imageDisplayLayout.style.transition = "0.6s";
        btuUpload.style.width = "200px";
        btuUpload.style.transition = "0.6s";
        uploadIcon.style.fontSize = "28px";
        uploadTitle.style.fontSize = "15px";
        imageDisplayLayout.style.paddingLeft = "54px";
      }
    }
  };

  const loadDataEditRoom = (roomId: string) => {
    let dataReq = {
      accountId: userInfor?.id,
      roomId: roomId,
      accessPath: true,
    };
    getRoomDetail(dataReq).then((res: any) => {
      setRoomEditLoading(false);
      let roomNoDropdownData: any = res.roomDetailDropdown
        .sort((a: any, b: any) => a?.valueText - b?.valueText)
        .map((roomDetail: any) => roomDetail);
      setRoomNoDropDownData(roomNoDropdownData);
      setRoomDetailRentedList(res.roomDetailRentedList);
      formRef.current?.setFieldsValue({
        roomType: res.roomTypeId,
        capacity: res.capacity,
        gender: res.roomGenderFlg,
        roomArea: res.roomArea,
        rentalPrice: res.rentalPrice,
        deposit: res.deposit,
        electricityCost: res.electricityCost,
        waterCost: res.waterCost,
        internetCost: res.internetCost,
        city: res.city,
        district: res.district,
        ward: res.ward,
        streetName: res.streetName,
        title: res.title,
      });
      setDescription(res.description);
      let images = res.imageList.map((image: any) => {
        let file = {
          id: image.id,
          imageLink: image.imageLink,
          imageName: image.imageName,
          resource: IMAGE_RESOURCE.FIREBASE,
        };

        setPaths((prev: any) => [
          ...prev,
          image.imageName,
          res.thumbnail.imageName,
        ]);
        return file;
      });
      let imageThumbnail = {
        ...res.thumbnail,
        resource: IMAGE_RESOURCE.THUMBNAIL,
      };
      setThumbnailImage(imageThumbnail);
      setImageList(images);
      setAc(res.utilities_ac);
      setBed(res.utilities_bed);
      setKitchen(res.utilities_kitchen);
      setParking(res.utilities_parking);
      setRefrigerator(res.utilities_refrigerator);
      setTime(res.utilities_time);
      setToilet(res.utilities_toilet);
      setWifi(res.utilities_wifi);
      setWmc(res.utilities_wm);
      setTelevision(res.utilities_television);

      utilities[0].className = res.utilities_bed
        ? "bed-utility-green-icon"
        : "bed-utility-icon";
      utilities[0].border = res.utilities_bed
        ? "utility-active"
        : "utility-default";

      utilities[1].className = res.utilities_time
        ? "time-utility-green-icon"
        : "time-utility-icon";
      utilities[1].border = res.utilities_time
        ? "utility-active"
        : "utility-default";

      utilities[2].className = res.utilities_wm
        ? "washing-machine-utility-green-icon"
        : "washing-machine-utility-icon";
      utilities[2].border = res.utilities_wm
        ? "utility-active"
        : "utility-default";

      utilities[3].className = res.utilities_toilet
        ? "toilet-utility-green-icon"
        : "toilet-utility-icon";
      utilities[3].border = res.utilities_toilet
        ? "utility-active"
        : "utility-default";

      utilities[4].className = res.utilities_ac
        ? "air-condition-utility-green-icon"
        : "air-condition-utility-icon";
      utilities[4].border = res.utilities_ac
        ? "utility-active"
        : "utility-default";

      utilities[5].className = res.utilities_television
        ? "television-utility-green-icon"
        : "television-utility-icon";
      utilities[5].border = res.utilities_television
        ? "utility-active"
        : "utility-default";

      utilities[6].className = res.utilities_parking
        ? "parking-utility-green-icon"
        : "parking-utility-icon";
      utilities[6].border = res.utilities_parking
        ? "utility-active"
        : "utility-default";

      utilities[7].className = res.utilities_kitchen
        ? "kitchen-utility-green-icon"
        : "kitchen-utility-icon";
      utilities[7].border = res.utilities_kitchen
        ? "utility-active"
        : "utility-default";

      utilities[8].className = res.utilities_refrigerator
        ? "refrigerator-utility-green-icon"
        : "refrigerator-utility-icon";
      utilities[8].border = res.utilities_refrigerator
        ? "utility-active"
        : "utility-default";

      utilities[9].className = res.utilities_wifi
        ? "wifi-utility-green-icon"
        : "wifi-utility-icon";
      utilities[9].border = res.utilities_wifi
        ? "utility-active"
        : "utility-default";
    });
  };

  const handleSetRoomNameDropdownData = (roomNameDropdownList: any) => {
    let roomNameDropdownListSort = roomNameDropdownList.sort(
      (a: any, b: any) => a?.valueText - b?.valueText
    );
    setRoomNoDropDownData(roomNameDropdownListSort);
  };

  const setImageListAtUtilityComponent = (
    file: any,
    fileImage: any,
    fileUpload: any,
    imagePosition: number
  ) => {
    let newFile = {
      id: fileImage?.id,
      imageLink: file?.imageLink,
      imageName: file?.imageName,
      resource: "",
    };

    switch (true) {
      case fileImage?.resource === IMAGE_RESOURCE.FIREBASE:
        imageList.map((image: any, index: number) => {
          if (image?.imageLink === fileImage.imageLink) {
            newFile["resource"] = IMAGE_RESOURCE.LOCAL;
            imageList[index] = newFile;
            setImageListUpload((prev) => [...prev, fileUpload[0]]);
            return;
          }
        });
        break;
      case fileImage?.resource === IMAGE_RESOURCE.THUMBNAIL:
        newFile["resource"] = IMAGE_RESOURCE.THUMBNAIL;
        setThumbnailImage(newFile);
        setThumbnailImageUpload(fileUpload[0]);
        break;
      case fileImage?.resource === IMAGE_RESOURCE.LOCAL:
        imageList.map((image: any, index: number) => {
          if (image?.imageLink === fileImage.imageLink) {
            newFile["resource"] = IMAGE_RESOURCE.LOCAL;
            imageList[index] = newFile;
            setImageListUpload((prev) => [
              ...prev.filter((image) => image?.name !== fileImage?.imageName),
              fileUpload[0],
            ]);
            return;
          }
        });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    let roomId = params?.roomId;
    if (roomId) {
      loadDataEditRoom(roomId);
    }
  }, []);

  return (
    <>
      <div className="create-room">
        <Process
          current={(e: any, back: boolean) => {
            handleSetTab(e, false, back);
          }}
          tab={tab}
          valid={valid}
          checkValid={handleCheckValid}
        ></Process>

        <Form
          ref={formRef}
          name="basic"
          initialValues={{ remember: true }}
          validateMessages={validateMessages}
          // scrollToFirstError
          onFinish={handleConfirmDataBeforeSave}
          onFinishFailed={handleConfirmDataBeforeSaveFinishFailed}
          autoComplete="off"
          layout="vertical"
          form={form}
        >
          <div className={cx("tab")}>
            {tab === 0 && (
              <Information
                params={params}
                roomNoDropdownData={roomNoDropdownData}
                handleSetRoomNameDropdownData={handleSetRoomNameDropdownData}
                cx={cx}
              />
            )}
            {tab === 1 && <Address formRef={formRef} cx={cx} form={form} />}
            {tab === 2 && (
              <Utilities
                handleUploadFile={handleUploadFile}
                handleDeleteFile={handleDeleteFile}
                handleActiveUtility={handleActiveUtility}
                handleStyleDisplayImage={handleStyleDisplayImage}
                setImageListAtUtilityComponent={setImageListAtUtilityComponent}
                imageList={imageList}
                uploading={uploading}
                loading={loading}
                progress={progress}
                imagesRef={imagesRef}
                utilities={utilities}
                thumbnailImage={thumbnailImage}
                deletedImageLoading={deletedImageLoading}
                imageId={imageId}
                errorMessageImage={errorMessageImage}
                errorMessageUtility={errorMessageUtility}
                cx={cx}
              />
            )}
            {tab === 3 && (
              <Confirmation
                wordCount={wordCount}
                textCount={textCount}
                handleChangeDescription={handleChangeDescription}
                handleOnEditorChange={handleOnEditorChange}
                description={description}
                cx={cx}
              ></Confirmation>
            )}
          </div>
          <div className={cx("btn-action")}>
            <div className={cx("btn-reset")}>
              <Form.Item>
                <Button danger onClick={handleResetFormData}>
                  Reset
                </Button>
              </Form.Item>
            </div>
            {tab !== 3 && (
              <div>
                <Form.Item>
                  <Button primary type="submit">
                    Next
                  </Button>
                </Form.Item>
              </div>
            )}

            {tab === 3 && (
              <div>
                <Form.Item>
                  <Button primary type="submit">
                    {params.roomId ? "Edit" : "Create"}
                  </Button>
                </Form.Item>
              </div>
            )}
          </div>
        </Form>
      </div>
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
          <Button key={2} id={2} submit small onClick={handleSaveData} disabled={roomLoading}>
            {roomLoading && (
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
              {`Do you want to ${params?.roomId ? "edit" : "create"} a room?`}
            </p>
          </div>
        }
      />
    </>
  );
}
export default CreateRoom;
