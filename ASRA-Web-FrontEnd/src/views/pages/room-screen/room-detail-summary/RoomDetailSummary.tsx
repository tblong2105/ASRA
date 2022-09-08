import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Tabs, Row, Col, Spin } from "antd";
import classnames from "classnames/bind";

import ImageGallery from "./ImageGallery";
import DepositRequests from "./DepositRequests";
import RoomDetailHeader from "./RoomDetailHeader";
import RoomDetail from "./RoomDetail";

import { getRoomDetail } from "api/room";
import { getRoomDetailWithContract } from "api/room-detail";
import { ROLE_INNKEEPER } from "commons/constants/Role";
import { ROOM_PATH } from "commons/constants";
import { currencyViCode } from "commons/utils/mask";
import NotFound from "views/errors/404-page";

import styles from "./index.module.scss";
import "./index.scss";
import TurnoverChart from "./chart/TurnoverChart";
import ContractChart from "./chart/ContractChart";
import RoomContracts from "./RoomContracts";
const cx = classnames.bind(styles);
const { TabPane } = Tabs;

function RoomDetailSummary() {
  const params = useParams<{ roomId: string; roomDetailId: string }>();
  const location: any = useLocation();
  let pathName = location.pathname;

  // IMAGE GALLERY INFORMATION
  const [linkImages, setLinkImages] = useState<any[]>([]);
  const [thumbnailImage, setThumbnailImage] = useState<any>();

  // ROOM TITLE INFORMATION
  const [title, setTitle] = useState<string>("");

  // ROOM INFORMATION
  const [createDateSubmitted, setCreateDateSubmitted] = useState<Date>(
    new Date()
  );
  const [rentalPrice, setRentalPrice] = useState<string>("");
  const [roomArea, setRoomArea] = useState<number>(0);
  const [deposit, setDeposit] = useState<string>("");
  const [capacity, setCapacity] = useState<number>(0);
  const [electricityCost, setElectricityCost] = useState<string>("");
  const [waterCost, setWaterCost] = useState<string>("");
  const [internetCost, setInternetCost] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [totalRoomEmpty, setTotalRoomEmpty] = useState<number>(0);
  const [totalRoom, setTotalRoom] = useState<number>(0);
  const [depositRequestCount, setDepositRequestCount] = useState<number>(0);
  const [paymentStatusWaitingCreateCount, setPaymentStatusWaitingCreateCount] =
    useState<number>(0);
  const [roomDetailRentedList, setRoomDetailRentedList] = useState<any[]>([]);
  const [roomNo, setRoomNo] = useState<string>("");
  const [roomRented, setRoomRented] = useState<boolean>(false);

  // UTILITIES INFORMATION
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

  // INNKEEPER INFORMATION
  const [innkeeperFullName, setInnkeeperFullName] = useState<string>("");
  const [innkeeperImage, setInnkeeperImage] = useState<string>("");
  const [innkeeperPhoneNumber, setInnkeeperPhoneNumber] = useState<string>("");
  const [innkeeperRoom, setInnkeeperRoom] = useState<boolean>(false);
  const [innkeeperId, setInnkeeperId] = useState<number>(0);
  const [innkeeperUserName, setInnkeeperUserName] = useState<string>("");
  const [innkeeperAddress, setInnkeeperAddress] = useState<string>("");

  // DESCRIPTION INFORMATION
  const [description, setDescription] = useState<string>("");

  // CONTRACT INFORMATION
  const [contract, setContract] = useState<any>({});

  // DEPOSIT INFORMATION
  const [depositedTab, setDepositedTab] = useState<string>("1");

  // COMMON ROOM DETAIL SCREEN
  const [tab, setTab] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [flag, setFlag] = useState<boolean>(false);

  const [dataDetailForDeposit, setDataDetailForDeposit] = useState<any>({});
  const [depositStatusChange, setDepositStatusChange] =
    useState<boolean>(false);
  let userInfor = JSON.parse(localStorage.getItem("userInfor") || "{}");
  let roleInnkeeper = userInfor?.roles?.includes(ROLE_INNKEEPER);
  let userId = userInfor?.id;

  const RoomDetailProp = {
    rentalPrice,
    roomArea,
    deposit,
    capacity,
    electricityCost,
    waterCost,
    internetCost,
    address,
    totalRoomEmpty,
    totalRoom,
    bed,
    time,
    wmc,
    ac,
    television,
    refrigerator,
    wifi,
    parking,
    toilet,
    kitchen,
    innkeeperFullName,
    innkeeperImage,
    innkeeperPhoneNumber,
    innkeeperId,
    innkeeperUserName,
    innkeeperAddress,
    description,
    roleInnkeeper,
    roomNo,
    roomRented,
    pathName,
    contract,
    createDateSubmitted,
    userInfor,
    cx,
  };

  const loadDataRoomDetailTab = (reRender: boolean = false) => {
    let accessPath: boolean = false;

    if (pathName.includes(ROOM_PATH.FROM_MY_ROOMS_FOR_RENT)) {
      accessPath = true;
    } else {
      accessPath = false;
    }

    let dataReq = {
      accountId: userInfor.id,
      roomId: Number(params.roomId),
      accessPath,
    };
    if (!reRender) {
      setLoading(true);
    }
    getRoomDetail(dataReq).then((data: any) => {
      setDataDetailForDeposit(data);

      // GALLERY INFORMATION
      setLinkImages(data.imageList);
      setThumbnailImage(data.thumbnail);

      // TITLE INFORMATION
      setTitle(data.title);

      // ROOM INFORMATION
      setCreateDateSubmitted(data.createDate);
      setRoomArea(data.roomArea);
      setDeposit(currencyViCode(data.deposit));
      setCapacity(data.capacity);
      if (!pathName.includes(ROOM_PATH.FROM_MY_ROOMS)) {
        setRentalPrice(currencyViCode(data.rentalPrice));
        setElectricityCost(
          data.electricityCost !== 0
            ? currencyViCode(data.electricityCost) + " / kwh"
            : "Free"
        );
        setInternetCost(
          data.internetCost !== 0
            ? currencyViCode(data.internetCost) + " / month"
            : "Free"
        );
        setWaterCost(
          data.waterCost !== 0
            ? currencyViCode(data.waterCost) + " / per"
            : "Free"
        );
      }
      setAddress(
        data.streetName +
          ", " +
          data.ward +
          ", " +
          data.district +
          ", " +
          data.city
      );
      setDepositRequestCount(data.depositRequestCount);
      setPaymentStatusWaitingCreateCount(data.paymentStatusWaitingCreateCount);
      setTotalRoomEmpty(data.totalRoomEmpty);
      setTotalRoom(data.totalRoom);

      //INNKEEPER INFORMATION
      setInnkeeperFullName(data.innkeeperFullName);
      setInnkeeperImage(data.innkeeperImage);
      setInnkeeperPhoneNumber(data.innkeeperPhoneNumber);
      setInnkeeperId(data.innkeeperId);
      setInnkeeperUserName(data.innkeeperUserName);
      setInnkeeperAddress(data.innkeeperAddress);
      // DESCRIPTION INFORMATION
      setDescription(data.description);

      // UTILITIES INFORMATION
      setAc(data.utilities_ac);
      setBed(data.utilities_bed);
      setKitchen(data.utilities_kitchen);
      setParking(data.utilities_parking);
      setRefrigerator(data.utilities_refrigerator);
      setTime(data.utilities_time);
      setToilet(data.utilities_toilet);
      setWifi(data.utilities_wifi);
      setWmc(data.utilities_wm);
      setTelevision(data.utilities_television);

      let innkeeperId = data.innkeeperId;
      // Check innkeeper room
      if (userId === innkeeperId) {
        setInnkeeperRoom(true);
      } else {
        // Check rented room
        if (data.roomDetailRentedList.length <= 0) {
          setRoomRented(false);
        } else {
          setRoomRented(true);
          setRoomNo(
            data.roomDetailRentedList?.find(
              (x: any) => +x.roomDetailId === Number(params.roomDetailId)
            )?.roomNo
          );
          let roomDetailRentedListSort = data.roomDetailRentedList.sort(
            (a: any, b: any) => a.valueText - b.valueText
          );
          setRoomDetailRentedList(roomDetailRentedListSort);
          if (!pathName.includes(ROOM_PATH.FROM_HOME)) {
            getRoomDetailWithContract(String(params.roomDetailId)).then(
              (res: any) => {
                setContract(res);
                setRentalPrice(currencyViCode(res.rentalPrice));
                setElectricityCost(
                  res.electronicPrice !== 0
                    ? currencyViCode(res.electronicPrice) + " / kwh"
                    : "Free"
                );
                setInternetCost(
                  res.internetPrice !== 0
                    ? currencyViCode(res.internetPrice) + " / month"
                    : "Free"
                );
                setWaterCost(
                  res.waterPrice !== 0
                    ? currencyViCode(res.waterPrice) + " / per"
                    : "Free"
                );
              }
            );
          }
        }
      }
      setLoading(false);
      setTimeout(() => {
        setFlag(true);
      }, 200);
    });
  };

  const handleTabChange = (tab: any) => {
    setDepositedTab(tab);
  };

  const changeRoomNoDropdown = (roomName: any) => {
    roomDetailRentedList?.map((roomDetail: any) => {
      if (roomDetail?.roomNo === roomName) {
        let roomDetailId = roomDetail?.roomDetailId;
        getRoomDetailWithContract(roomDetailId).then((res: any) => {
          setRentalPrice(currencyViCode(res.rentalPrice));
          setElectricityCost(
            res.electronicPrice !== 0
              ? currencyViCode(res.electronicPrice) + " / kwh"
              : "Free"
          );
          setInternetCost(
            res.internetPrice !== 0
              ? currencyViCode(res.internetPrice) + " / month"
              : "Free"
          );
          setWaterCost(
            res.waterPrice !== 0
              ? currencyViCode(res.waterPrice) + " / per"
              : "Free"
          );
        });
      }
    });
    //
    setRoomNo(roomName);
  };

  const styleImageGallery = () => {
    setTimeout(() => {
      let antImageMark: any = document.getElementsByClassName("ant-image-mask");
      let antImageMarkInfo: any = document.getElementsByClassName(
        "ant-image-mask-info"
      );

      let counterImage = antImageMark.length - 5;
      let imageVisible = document.createElement("span");
      let countImageVisible = document.createTextNode(`${counterImage}+`);

      if (counterImage && antImageMark[4]) {
        antImageMark[4].style.opacity = "1";
        antImageMarkInfo[4].remove();

        imageVisible.appendChild(countImageVisible);
        imageVisible.style.fontSize = "48px";
        imageVisible.style.fontWeight = "bold";

        antImageMark[4].appendChild(imageVisible);
      }
    }, 2000);
  };

  useEffect(() => {
    loadDataRoomDetailTab();
    styleImageGallery();
    if (location?.state?.sender !== undefined) {
      setDepositedTab("3");
    }
    if(location?.state?.contractCancel === true){
      setDepositedTab("3");
    }
  }, []);

  const StatusChangeCallBackFunc = () => {
    loadDataRoomDetailTab(true);
  };
  return (
    <>
      <div className="room-detail-wrapper">
        <div
          className={cx(
            "room-detail-wrapper",
            ((!roomRented && pathName.includes(ROOM_PATH.FROM_MY_ROOMS)) ||
              (!innkeeperRoom &&
                pathName.includes(ROOM_PATH.FROM_MY_ROOMS_FOR_RENT))) &&
              "hidden"
          )}
        >
          {/* TAB COMPONENT */}
          {loading ? (
            <div className="spin">
              <Spin size="large" />
            </div>
          ) : pathName.includes(ROOM_PATH.FROM_MY_ROOMS_FOR_RENT) ? (
            <>
              {/* IMAGES GALLERY COMPONENT */}
              <ImageGallery
                linkImages={linkImages}
                thumbnailImage={thumbnailImage}
                cx={cx}
              />

              {/*ROOM DETAIL HEADER COMPONENT */}
              <RoomDetailHeader
                changeRoomNoDropdown={changeRoomNoDropdown}
                totalRoomEmpty={totalRoomEmpty}
                roomDetailRentedList={roomDetailRentedList}
                title={title}
                innkeeperRoom={innkeeperRoom}
                userInfor={userInfor}
                roomRented={roomRented}
                pathName={pathName}
                roomDetailProp={RoomDetailProp}
                cx={cx}
              />

              {/* TAB COMPONENT */}
              <div className={cx("summary-tab")}>
                <Tabs
                  type="card"
                  tabPosition="left"
                  onChange={(data) => handleTabChange(data)}
                  activeKey={depositedTab}
                >
                  {/* TAB 1: DASHBOARD TAB */}
                  <TabPane tab="Dashboard" key="1">
                    <Row className={cx("chart-container")}>
                      <Col style={{ padding: "32px" }} span={24}>
                        <TurnoverChart></TurnoverChart>
                      </Col>
                      <Col
                        span={24}
                        style={{ marginTop: "100px", padding: "32px" }}
                      >
                        <ContractChart></ContractChart>
                      </Col>
                    </Row>
                  </TabPane>

                  {/* TAB 2: ROOM DETAIL TAB */}
                  <TabPane tab="Room Detail" key="2">
                    <RoomDetail {...RoomDetailProp} />
                  </TabPane>

                  {/* TAB 3: DEPOSIT REQUESTS TAB */}
                  <TabPane
                    tab={
                      <>
                        <span>Deposit Requests</span>&nbsp;
                        <span style={{ color: "#000" }}>(</span>
                        <span className={cx("deposit-request-count")}>
                          {depositRequestCount}
                        </span>
                        <span style={{ color: "#000" }}>)</span>
                      </>
                    }
                    key="3"
                  >
                    <DepositRequests
                      cx={cx}
                      address={RoomDetailProp.address}
                      innkeeperId={RoomDetailProp.innkeeperId}
                      dataDetailForDeposit={dataDetailForDeposit}
                      depositStatusChangeCallBackFunc={StatusChangeCallBackFunc}
                    />

                    {/* TAB 4: CONTRACTS TAB */}
                  </TabPane>
                  <TabPane
                    tab={
                      <>
                        <span>Contracts</span>&nbsp;
                        <span style={{ color: "#000" }}>(</span>
                        <span className={cx("deposit-request-count")}>
                          {paymentStatusWaitingCreateCount}
                        </span>
                        <span style={{ color: "#000" }}>)</span>
                      </>
                    }
                    key="4"
                  >
                    <RoomContracts
                      cx={cx}
                      contractStatusChangeCallBackFunc={
                        StatusChangeCallBackFunc
                      }
                    ></RoomContracts>
                  </TabPane>
                </Tabs>
              </div>
            </>
          ) : (
            <>
              {/* IMAGES GALLERY COMPONENT */}
              <ImageGallery
                linkImages={linkImages}
                thumbnailImage={thumbnailImage}
                cx={cx}
              />

              {/*ROOM DETAIL HEADER COMPONENT */}
              <RoomDetailHeader
                changeRoomNoDropdown={changeRoomNoDropdown}
                totalRoomEmpty={totalRoomEmpty}
                roomDetailRentedList={roomDetailRentedList}
                title={title}
                innkeeperRoom={innkeeperRoom}
                roomRented={roomRented}
                userInfor={userInfor}
                pathName={pathName}
                roomDetailProp={RoomDetailProp}
                cx={cx}
              />
              <RoomDetail {...RoomDetailProp} />
            </>
          )}
        </div>
      </div>
      {flag &&
        !loading &&
        ((!roomRented && pathName.includes(ROOM_PATH.FROM_MY_ROOMS)) ||
          (!innkeeperRoom &&
            pathName.includes(ROOM_PATH.FROM_MY_ROOMS_FOR_RENT))) && (
          <NotFound />
        )}
    </>
  );
}

export default RoomDetailSummary;
