import React, { useState, useRef, useEffect, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RenderHtml from "react-native-render-html";
import ImageView from "react-native-image-viewing";
import moment from "moment";
import Checkbox from "expo-checkbox";
import { Modal } from "native-base";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { decode as atob, encode as btoa } from "base-64";

import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";

import { COLORS, FONTS, NOTIFICATION_TYPE } from "../../constants";
import { LinearGradient } from "expo-linear-gradient";
import { formatMillionUnitCurrency } from "../../utils/currency-util";
import { diffBetweenDate } from "../../utils/date-util";
import { currencyViCode } from "../../utils/currency-util";
import { DOMAIN } from "../../constants";
import { SocketContext } from "../../app/socket";
import {
  getRoomDetail,
  getRoomDetailWithContract,
} from "../../api/room-detail";
import { createDepositRequest, checkDepositExist } from "../../api/deposit";
import LocationSVG from "../../assets/svg/room-detail/location.svg";
import PhoneSVG from "../../assets/svg/room-detail/phone-call.svg";
import ElectronicSVG from "../../assets/svg/room-detail/electronic.svg";
import WaterSVG from "../../assets/svg/room-detail/water.svg";
import GenderSVG from "../../assets/svg/room-detail/gender.svg";

import {
  ClockSVG,
  BedSVG,
  TelevisionSVG,
  AirConditionSVG,
  KitchenSVG,
  ToiletSVG,
  RefrigeratorSVG,
  WifiSVG,
  WashingMachineSVG,
  ParkingSVG,
  //
  ClockDefaultSVG,
  BedDefaultSVG,
  TelevisionDefaultSVG,
  AirConditionDefaultSVG,
  KitchenDefaultSVG,
  ToiletDefaultSVG,
  RefrigeratorDefaultSVG,
  WifiDefaultSVG,
  WashingMachineDefaultSVG,
  ParkingDefaultSVG,
  RoomDoorSVG,
} from "../../assets";

import AnimatedHeader from "../../components/layout/animated-header/AnimatedHeader";
import FocusedStatusBar from "../../components/layout/focused-status-bar/FocusedStatusBar";
import CarouselCards from "../../components/carousel-card/CarouselCards";
import CustomButton from "../../components/custom/Button";
import Loading from "../../components/loading/Loading";

const depositOptions = [
  {
    id: 1,
    title: " (50% deposit amount)",
    isChecked: false,
  },
  { id: 2, title: "0 VND", isChecked: true },
];

function RoomDetail(props) {
  const { navigation, route } = props;
  const socket = useContext(SocketContext);
  const { width } = useWindowDimensions();
  const [userDepositInfo, setUserDepositInfo] = useState(null);

  // HEADER
  const offset = useRef(new Animated.Value(0)).current;
  const [isBackgroundHeader, setIsBackgroundHeader] = useState(false);

  // CAROUSEL CARDS
  const [isVisibleImagesGallery, setIsVisibleImagesGallery] = useState(false);
  const [imageSelectedIndex, setImageSelectedIndex] = useState(0);

  // SEE MORE/LESS FOR DESCRIPTION
  const [isDescriptionModalVisible, setIsDescriptionModalVisible] =
    useState(false);
  const [descriptionAnimation] = useState(new Animated.Value(0));
  const [offsetDescription, setOffsetDescription] = useState(0);

  // SEE MORE/LESS FOR UTILITIES
  const [isUtilitiesModalVisible, setIsUtilitiesModalVisible] = useState(false);
  const [utilitiesAnimation] = useState(new Animated.Value(0));

  // DEPOSIT HOLDER MODAL
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showDepositHolderModal, setShowDepositHolderModal] = useState(false);

  // ROOM DETAIL INFORMATION
  const [roomDetailData, setRoomDetailData] = useState(null);
  const [roomDetailLoading, setRoomDetailLoading] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [rentalPrice, setRentalPrice] = useState(null);
  const [internetPrice, setInternetPrice] = useState(null);
  const [waterPrice, setWaterPrice] = useState(null);
  const [electronicPrice, setElectronicPrice] = useState(null);
  const [contract, setContract] = useState(null);
  const [innkeeperRoom, setInnkeeperRoom] = useState(false);

  // DEPOSIT OPTION
  const [depositOptionsData, setDepositOptionsData] = useState(depositOptions);
  const [depositAmountVal, setDepositAmountVal] = useState(0);
  // ROOM NO
  const [roomNo, setRoomNo] = useState(null);

  const [result, setResult] = useState(null);

  const [avatar, setAvatar] = useState(null);

  const showImagesGallery = (imageSelectedIndex) => {
    setIsVisibleImagesGallery(true);
    setImageSelectedIndex(imageSelectedIndex - 3);
  };

  const closeImagesGallery = () => {
    setIsVisibleImagesGallery(false);
  };

  const toggleDescriptionModal = () => {
    Animated.spring(descriptionAnimation, {
      toValue: isDescriptionModalVisible ? 0 : 1,
      useNativeDriver: false,
    }).start();
    setIsDescriptionModalVisible(!isDescriptionModalVisible);
  };

  const toggleUtilitiesModal = () => {
    Animated.spring(utilitiesAnimation, {
      toValue: isUtilitiesModalVisible ? 0 : 1,
      useNativeDriver: false,
    }).start();
    setIsUtilitiesModalVisible(!isUtilitiesModalVisible);
  };

  const depositHolder = () => {
    checkDepositExist(route?.params?.roomId).then((isDepositExited) => {
      if (!isDepositExited) {
        setShowNoticeModal(true);
      }
    });
  };

  const triggerCall = () => {
    Linking.openURL(`tel://${roomDetailData?.innkeeperPhoneNumber}`);
  };

  const changeDepositOptionCheckbox = (item) => {
    let originDepositOptionsData = depositOptionsData?.map((depositOption) => {
      if (item?.title === depositOption?.title) {
        if (depositOption?.id === 2) {
          setDepositAmountVal(0);
        } else if (depositOption?.id === 1) {
          setDepositAmountVal(Number(roomDetailData?.deposit) / 2);
        }
        return { ...depositOption, isChecked: true };
      }
      return { ...depositOption, isChecked: false };
    });
    setDepositOptionsData(originDepositOptionsData);
  };

  const depositRoom = async () => {
    if (depositAmountVal === 0) {
      let dataReq = {
        roomId: route?.params?.roomId,
        username: userDepositInfo?.username,
        depositCost: 0,
      };
      createDepositRequest(dataReq)
        .then((res) => {
          setShowDepositHolderModal(false);
          socket?.emit("sendNotification", {
            roomId: route?.params?.roomId,
            senderId: userDepositInfo?.id,
            contractId: null,
            senderName: userDepositInfo?.username,
            receiverName: roomDetailData?.innkeeperUserName,
            message: `has sent a deposit request for the room at ${roomDetailData?.streetName}, ${roomDetailData?.ward}, ${roomDetailData?.district}, ${roomDetailData?.city}.`,
            type: NOTIFICATION_TYPE.DEPOSIT,
            thumbnail: avatar && avatar,
          });
          alert("Request deposit holder successfully");
        })
        .catch((err) => {});
    } else {
      let collectDepositData = {
        roomId: route?.params?.roomId,
        roomAddress: `${roomDetailData?.streetName}, ${roomDetailData?.ward}, ${roomDetailData?.district}, ${roomDetailData?.city}`,
        depositAmount: Number(roomDetailData?.deposit) / 2,
        innkeeperUserName: roomDetailData?.innkeeperUserName,
        innkeeperFullName: roomDetailData?.innkeeperFullName,
        innkeeperAddress: roomDetailData?.innkeeperAddress,
      };
      let result = null;
      try {
        result = await WebBrowser.openBrowserAsync(
          encodeURI(
            `${DOMAIN.ONLINE}/paypal/native/deposit-info/${JSON.stringify(
              collectDepositData
            )}/user-info/${JSON.stringify(userDepositInfo)}`
          )
        );
        setShowDepositHolderModal(false);
      } catch (e) {}
      setResult(result?.type);
    }
  };

  const loadDetailData = async () => {
    let userInfo = JSON.parse(await AsyncStorage.getItem("userInfo"));
    delete userInfo["roles"];
    delete userInfo["token"];
    delete userInfo["tokenType"];
    delete userInfo["type"];
    setAvatar(userInfo["image"]);

    userInfo["image"] = btoa(userInfo["image"]);
    setUserDepositInfo(userInfo);
    let dataReq = {
      accountId: userInfo?.id,
      roomId: route?.params?.roomId,
      accessPath: false,
    };
    setRoomDetailLoading(true);
    getRoomDetail(dataReq).then((res) => {
      // ROOM DETAIL INFORMATION
      setRoomDetailData(res);

      let offsetHeightDescription = res?.description
        .substring(
          res?.description.indexOf('"') + 1,
          res?.description.indexOf(">")
        )
        .slice(0, -1);
      setOffsetDescription(offsetHeightDescription);
      let originImageListData = res?.imageList.map((image) => ({
        id: image?.id,
        uri: image?.imageLink,
      }));
      setImageList(originImageListData);
      if (!route?.params?.roomStatus) {
        setRentalPrice(formatMillionUnitCurrency(res?.rentalPrice));
        setElectronicPrice(
          res?.electricityCost !== 0
            ? formatMillionUnitCurrency(res?.electricityCost) + " VND/kwh"
            : "Free"
        );
        setWaterPrice(
          res?.waterCost !== 0
            ? formatMillionUnitCurrency(res?.waterCost) + " VND/per"
            : "Free"
        );
        setInternetPrice(
          res?.internetCost !== 0
            ? formatMillionUnitCurrency(res?.internetCost) + " VND/month"
            : "Free"
        );
      }

      if (userInfo?.id === res?.innkeeperId) {
        setInnkeeperRoom(true);
      } else {
        let roomDetailRentedListSort = res?.roomDetailRentedList?.sort(
          (a, b) => a.valueText - b.valueText
        );
        if (roomDetailRentedListSort?.length > 0) {
          setRoomNo(
            res?.roomDetailRentedList?.find(
              (room) =>
                +room?.roomDetailId === Number(route?.params?.roomDetailId)
            )?.roomNo
          );
          if (route?.params?.roomStatus) {
            getRoomDetailWithContract(
              roomDetailRentedListSort[0]?.roomDetailId
            ).then((res) => {
              setContract(res);
              setRentalPrice(formatMillionUnitCurrency(res?.rentalPrice));
              setElectronicPrice(
                res?.electricityPrice !== 0
                  ? formatMillionUnitCurrency(res?.electricityPrice) +
                      " kwh/per"
                  : "Free"
              );
              setWaterPrice(
                res?.waterPrice !== 0
                  ? formatMillionUnitCurrency(res?.waterPrice) + " VND/per"
                  : "Free"
              );
              setInternetPrice(
                res?.internetPrice !== 0
                  ? formatMillionUnitCurrency(res?.internetPrice) + " VND/month"
                  : "Free"
              );
            });
          }
        }
      }
      setRoomDetailLoading(false);
    });
  };

  useEffect(() => {
    loadDetailData();
  }, [result]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <FocusedStatusBar backgroundColor={COLORS.primary} />
      {roomDetailLoading ? (
        <Loading />
      ) : (
        <>
          <ImageView
            images={imageList}
            imageIndex={imageSelectedIndex}
            visible={isVisibleImagesGallery}
            onRequestClose={closeImagesGallery}
          />
          <AnimatedHeader
            animatedValue={offset}
            isBackgroundHeader={isBackgroundHeader}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 12,
                zIndex: 2,
              }}
            >
              <View style={{ flex: 3 }}>
                <TouchableOpacity onPress={() => navigation.pop()}>
                  <Ionicons
                    name="chevron-back-outline"
                    size={26}
                    color={isBackgroundHeader ? COLORS.iconDefault : "#fff"}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="heart-outline"
                  size={22}
                  color={isBackgroundHeader ? COLORS.iconDefault : "#fff"}
                />
                <Ionicons
                  name="share-outline"
                  size={22}
                  color={isBackgroundHeader ? COLORS.iconDefault : "#fff"}
                />
              </View>
            </View>
          </AnimatedHeader>
          <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: offset } } }],
              {
                useNativeDriver: false,
                listener: (event) => {
                  const offsetY = event.nativeEvent.contentOffset.y;
                  if (offsetY < 140) {
                    setIsBackgroundHeader(false);
                  } else {
                    setIsBackgroundHeader(true);
                  }
                },
              }
            )}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LinearGradient
                colors={["rgba(0,0,0, 0.8)", "transparent"]}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 50,
                  zIndex: 1,
                }}
              />
              <CarouselCards
                route={route}
                setVisibleImagesGalleryFromComponentChild={showImagesGallery}
                images={imageList}
              />
            </View>
            <View
              style={{
                justifyContent: "center",
                padding: 16,
                backgroundColor: "#fff",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: FONTS.medium,
                  color: COLORS.textDefault,
                  lineHeight: 26,
                }}
              >
                {roomDetailData?.title}
              </Text>
              <Text
                style={{
                  marginTop: 12,
                  fontSize: 20,
                  fontFamily: FONTS.medium,
                  color: COLORS.primary,
                }}
              >
                {rentalPrice}
                {` VND/room`}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                  paddingVertical: 12,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      paddingBottom: 6,
                      fontFamily: FONTS.regular,
                      color: COLORS.textDefault,
                    }}
                  >
                    {route?.params?.roomStatus ? "Status" : "Available"}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: FONTS.medium,
                      color:
                        roomDetailData?.totalRoomEmpty <= 0 &&
                        !route?.params?.roomStatus
                          ? "#e03c31"
                          : COLORS.primary,
                    }}
                  >
                    {route?.params?.roomStatus
                      ? "Renting"
                      : roomDetailData?.totalRoomEmpty > 0
                      ? "Yes"
                      : "Fulled"}
                  </Text>
                </View>
                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      paddingBottom: 6,
                      fontFamily: FONTS.regular,
                      color: COLORS.textDefault,
                    }}
                  >
                    Size
                  </Text>
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: FONTS.medium,
                        color: COLORS.primary,
                      }}
                    >
                      {roomDetailData?.roomArea}m
                    </Text>
                    <Text
                      style={{
                        position: "absolute",
                        top: -2,
                        right: -8,
                        fontSize: 12,
                        fontFamily: FONTS.regular,
                        color: COLORS.primary,
                      }}
                    >
                      2
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      paddingBottom: 6,
                      fontFamily: FONTS.regular,
                      color: COLORS.textDefault,
                    }}
                  >
                    Deposit
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: FONTS.medium,
                      color: COLORS.primary,
                    }}
                  >
                    {formatMillionUnitCurrency(roomDetailData?.deposit)}
                  </Text>
                </View>
              </View>
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    paddingVertical: 6,
                    paddingStart: 4,
                    paddingEnd: 16,
                  }}
                >
                  <View
                    style={{
                      paddingTop: 6,
                      paddingEnd: 2,
                    }}
                  >
                    <LocationSVG width={24} height={24} />
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: FONTS.regular,
                        color: COLORS.textDefault,
                        lineHeight: 22,
                      }}
                    >
                      {`${roomDetailData?.streetName}, ${roomDetailData?.ward},`}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: FONTS.regular,
                        color: COLORS.textDefault,
                        lineHeight: 22,
                      }}
                    >
                      {`${roomDetailData?.district}, ${roomDetailData?.city}`}
                    </Text>
                  </View>
                </View>
                {roomNo && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 6,
                      paddingHorizontal: 4,
                    }}
                  >
                    <View style={{ paddingEnd: 4 }}>
                      <RoomDoorSVG width={22} height={22} />
                    </View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: FONTS.regular,
                        color: COLORS.textDefault,
                      }}
                    >
                      Room {roomNo}
                    </Text>
                  </View>
                )}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 6,
                    paddingHorizontal: 4,
                  }}
                >
                  <View style={{ paddingEnd: 4 }}>
                    <PhoneSVG width={22} height={22} />
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: FONTS.regular,
                      color: COLORS.textDefault,
                    }}
                  >
                    {`${roomDetailData?.innkeeperPhoneNumber} - ${roomDetailData?.innkeeperFullName}`}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 6,
                    paddingHorizontal: 4,
                  }}
                >
                  <View style={{ paddingEnd: 4 }}>
                    <GenderSVG width={24} height={24} />
                  </View>

                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: FONTS.regular,
                      color: COLORS.textDefault,
                    }}
                  >
                    {roomDetailData?.capacity} per/room
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 6,
                    paddingHorizontal: 4,
                  }}
                >
                  <View style={{ paddingEnd: 4 }}>
                    <ElectronicSVG width={24} height={24} />
                  </View>

                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: FONTS.regular,
                      color: COLORS.textDefault,
                    }}
                  >
                    {electronicPrice}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 6,
                    paddingHorizontal: 4,
                  }}
                >
                  <View style={{ paddingEnd: 4 }}>
                    <WaterSVG width={24} height={24} />
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: FONTS.regular,
                      color: COLORS.textDefault,
                    }}
                  >
                    {waterPrice}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 6,
                    paddingHorizontal: 4,
                  }}
                >
                  <View style={{ paddingEnd: 4 }}>
                    <WifiSVG width={24} height={24} />
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: FONTS.regular,
                      color: COLORS.textDefault,
                    }}
                  >
                    {internetPrice}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 6,
                    paddingHorizontal: 3,
                  }}
                >
                  <View style={{ marginEnd: 4 }}>
                    <ClockSVG width={24} height={24} />
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: FONTS.regular,
                      color: COLORS.textDefault,
                    }}
                  >
                    {`${diffBetweenDate(
                      roomDetailData?.createRoomDate
                    )} - ${moment(
                      Date.parse(roomDetailData?.createRoomDate)
                    ).format("MMM DD, YYYY")}`}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "flex-start",
                marginTop: 16,
                paddingTop: 16,
                paddingHorizontal: 16,
                backgroundColor: "#fff",
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: FONTS.medium,
                    color: COLORS.textDefault,
                  }}
                >
                  Description
                </Text>
              </View>
              <Animated.View
                style={{
                  paddingVertical: 16,
                  height: descriptionAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      100,
                      offsetDescription < 100
                        ? offsetDescription * 2
                        : offsetDescription > 100 && offsetDescription < 200
                        ? offsetDescription * 1.4
                        : offsetDescription > 200 && offsetDescription * 1.2,
                    ],
                  }),
                }}
              >
                <RenderHtml
                  automaticallyAdjustContentInsets={false}
                  contentWidth={width}
                  source={{
                    html: `<div style="height: ${descriptionAnimation.interpolate(
                      {
                        inputRange: [0, 1],
                        outputRange: [
                          100,
                          offsetDescription < 100
                            ? offsetDescription * 2
                            : offsetDescription > 100 && offsetDescription < 200
                            ? offsetDescription * 1.4
                            : offsetDescription > 200 &&
                              offsetDescription * 1.2,
                        ],
                      }
                    )}; font-size: 13px; font-family: ${
                      FONTS.regular
                    }; color: ${COLORS.textDefault} ">${
                      roomDetailData?.description
                    }</div>`,
                  }}
                />
              </Animated.View>
              {offsetDescription > 100 && (
                <TouchableOpacity
                  style={styles.modalAnimation}
                  onPress={toggleDescriptionModal}
                >
                  <Text style={{ fontFamily: FONTS.regular, color: "#1890ff" }}>
                    {isDescriptionModalVisible ? "See less" : "See more"}
                  </Text>
                  <Ionicons
                    name={`chevron-${
                      isDescriptionModalVisible ? "up" : "down"
                    }-outline`}
                    size={16}
                    color="#1890ff"
                  />
                </TouchableOpacity>
              )}
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "flex-start",
                marginTop: 16,
                paddingTop: 16,
                paddingHorizontal: 16,
                backgroundColor: "#fff",
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: FONTS.medium,
                    color: COLORS.textDefault,
                  }}
                >
                  Utilities
                </Text>
              </View>
              <Animated.View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 4,
                  height: utilitiesAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [136, 200],
                  }),
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: "25%",
                      paddingVertical: 10,
                    }}
                  >
                    <View style={{ alignItems: "center" }}>
                      {roomDetailData?.utilities_bed ? (
                        <BedSVG width={30} height={30} />
                      ) : (
                        <BedDefaultSVG width={30} height={30} />
                      )}
                    </View>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 12,
                        fontFamily: FONTS.regular,
                        color: roomDetailData?.utilities_bed && COLORS.primary,
                      }}
                    >
                      Double Bed
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "25%",
                      paddingVertical: 10,
                    }}
                  >
                    <View style={{ alignItems: "center" }}>
                      {roomDetailData?.utilities_television ? (
                        <TelevisionSVG width={30} height={30} />
                      ) : (
                        <TelevisionDefaultSVG width={30} height={30} />
                      )}
                    </View>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 12,
                        fontFamily: FONTS.regular,
                        color:
                          roomDetailData?.utilities_television &&
                          COLORS.primary,
                      }}
                    >
                      Television
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "25%",
                      paddingVertical: 10,
                    }}
                  >
                    <View style={{ alignItems: "center" }}>
                      {roomDetailData?.utilities_ac ? (
                        <AirConditionSVG width={30} height={30} />
                      ) : (
                        <AirConditionDefaultSVG width={30} height={30} />
                      )}
                    </View>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 12,
                        fontFamily: FONTS.regular,
                        color: roomDetailData?.utilities_ac && COLORS.primary,
                      }}
                    >
                      Air Condition
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "25%",
                      paddingVertical: 10,
                    }}
                  >
                    <View style={{ alignItems: "center" }}>
                      {roomDetailData?.kitchen ? (
                        <KitchenSVG width={30} height={30} />
                      ) : (
                        <KitchenDefaultSVG width={30} height={30} />
                      )}
                    </View>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 12,
                        fontFamily: FONTS.regular,
                        color: roomDetailData?.kitchen && COLORS.primary,
                      }}
                    >
                      Kitchen
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: "25%",
                      paddingVertical: 10,
                    }}
                  >
                    <View
                      style={{ paddingStart: 28, alignItems: "flex-start" }}
                    >
                      {roomDetailData?.utilities_time ? (
                        <ClockSVG width={30} height={30} />
                      ) : (
                        <ClockDefaultSVG width={30} height={30} />
                      )}
                    </View>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 12,
                        fontFamily: FONTS.regular,
                        color: roomDetailData?.utilities_time && COLORS.primary,
                      }}
                    >
                      Time
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "25%",
                      paddingVertical: 10,
                    }}
                  >
                    <View style={{ alignItems: "center" }}>
                      {roomDetailData?.utilities_toilet ? (
                        <ToiletSVG width={30} height={30} />
                      ) : (
                        <ToiletDefaultSVG width={30} height={30} />
                      )}
                    </View>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 12,
                        fontFamily: FONTS.regular,
                        color:
                          roomDetailData?.utilities_toilet && COLORS.primary,
                      }}
                    >
                      Toilet
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "25%",
                      paddingVertical: 10,
                    }}
                  >
                    <View style={{ alignItems: "center" }}>
                      {roomDetailData?.utilities_refrigerator ? (
                        <RefrigeratorSVG width={30} height={30} />
                      ) : (
                        <RefrigeratorDefaultSVG width={30} height={30} />
                      )}
                    </View>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 12,
                        fontFamily: FONTS.regular,
                        color:
                          roomDetailData?.utilities_refrigerator &&
                          COLORS.primary,
                      }}
                    >
                      Refrigerator
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "25%",
                      paddingVertical: 10,
                    }}
                  >
                    <View style={{ alignItems: "center" }}>
                      {roomDetailData?.utilities_wifi ? (
                        <WifiSVG width={30} height={30} />
                      ) : (
                        <WifiDefaultSVG width={30} height={30} />
                      )}
                    </View>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 12,
                        fontFamily: FONTS.regular,
                        color: roomDetailData?.utilities_wifi && COLORS.primary,
                      }}
                    >
                      Wifi
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: "25%",
                      paddingVertical: 10,
                    }}
                  >
                    <View style={{ paddingStart: 2, alignItems: "center" }}>
                      {roomDetailData?.utilities_wm ? (
                        <WashingMachineSVG width={30} height={30} />
                      ) : (
                        <WashingMachineDefaultSVG width={30} height={30} />
                      )}
                    </View>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 12,
                        fontFamily: FONTS.regular,
                        color: roomDetailData?.utilities_wm && COLORS.primary,
                      }}
                    >
                      Washer
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "25%",
                      paddingVertical: 10,
                    }}
                  >
                    <View style={{ alignItems: "center" }}>
                      {roomDetailData?.utilities_parking ? (
                        <ParkingSVG width={30} height={30} />
                      ) : (
                        <ParkingDefaultSVG width={30} height={30} />
                      )}
                    </View>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 12,
                        fontFamily: FONTS.regular,
                        color:
                          roomDetailData?.utilities_parking && COLORS.primary,
                      }}
                    >
                      Parking
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "25%",
                      paddingVertical: 10,
                    }}
                  />
                  <View
                    style={{
                      width: "25%",
                      paddingVertical: 10,
                    }}
                  />
                </View>
              </Animated.View>
              <TouchableOpacity
                style={styles.modalAnimation}
                onPress={toggleUtilitiesModal}
              >
                <Text style={{ fontFamily: FONTS.regular, color: "#1890ff" }}>
                  {isUtilitiesModalVisible ? "See less" : "See more"}
                </Text>
                <Ionicons
                  name={`chevron-${
                    isUtilitiesModalVisible ? "up" : "down"
                  }-outline`}
                  size={16}
                  color="#1890ff"
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 16,
                  padding: 16,
                  backgroundColor: "#fff",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{
                      uri: roomDetailData?.innkeeperImage,
                    }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,

                      marginEnd: 8,
                    }}
                  />
                  <View>
                    <Text
                      style={{
                        fontFamily: FONTS.regular,
                        fontSize: 15,
                        marginBottom: 4,
                        color: COLORS.textDefault,
                      }}
                    >
                      {roomDetailData?.innkeeperFullName}
                    </Text>
                    <Text
                      style={{
                        fontFamily: FONTS.regular,
                        fontSize: 12,
                        color: COLORS.textDefault,
                      }}
                    >
                      2 room(s)
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward-outline"
                  size={28}
                  color={COLORS.iconDefault}
                />
              </View>
            </TouchableOpacity>
            {route?.params?.roomStatus && (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "flex-start",
                  marginTop: 16,
                  padding: 16,
                  backgroundColor: "#fff",
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: FONTS.medium,
                      color: COLORS.textDefault,
                    }}
                  >
                    Contract
                  </Text>
                </View>
                <View style={{ paddingHorizontal: 12, paddingVertical: 16 }}>
                  <View style={{ marginBottom: 6 }}>
                    <Text
                      style={{
                        fontFamily: FONTS.regular,
                        fontSize: 14,
                        color: COLORS.primary,
                      }}
                    >
                      Start Time:{" "}
                      <Text style={{ color: COLORS.textDefault }}>
                        {moment(Date.parse(contract?.startDate)).format(
                          "MMM DD, YYYY"
                        )}
                      </Text>
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontFamily: FONTS.regular,
                        fontSize: 14,
                        color: COLORS.secondary,
                      }}
                    >
                      End Time:{" "}
                      <Text style={{ color: COLORS.textDefault }}>
                        {moment(Date.parse(contract?.endDate)).format(
                          "MMM DD, YYYY"
                        )}
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
          {/* WARNING NOTICE MODAL */}
          <Modal
            animationPreset="slide"
            isOpen={showNoticeModal}
            onClose={() => setShowNoticeModal(false)}
            size="lg"
          >
            <Modal.Content maxWidth="350">
              <Modal.CloseButton />
              <Modal.Header>
                <Text
                  style={{ fontSize: 15, textAlign: "center", paddingTop: 3 }}
                >
                  Notice
                </Text>
              </Modal.Header>
              <Modal.Body>
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <Ionicons
                    name="warning-outline"
                    size={50}
                    color={"#faad14"}
                  />
                </View>
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 8,
                    fontSize: 14,
                    fontFamily: FONTS.light,
                    lineHeight: 28,
                  }}
                >
                  You are communicating with the broker owner yourself, so be
                  careful in any transaction information.
                </Text>
              </Modal.Body>
              <Modal.Footer>
                <CustomButton
                  flex={1}
                  label="Continue"
                  fontSize={14}
                  onPress={() => {
                    setShowNoticeModal(false);
                    setShowDepositHolderModal(true);
                  }}
                />
              </Modal.Footer>
            </Modal.Content>
          </Modal>
          {/* DEPOSIT HOLDER MODAL */}
          <Modal
            isOpen={showDepositHolderModal}
            onClose={() => setShowDepositHolderModal(false)}
            size="xl"
          >
            <Modal.Content maxWidth="350">
              <Modal.CloseButton />
              <Modal.Header>
                <Text
                  style={{ fontSize: 16, textAlign: "center", paddingTop: 3 }}
                >
                  Deposit Holder
                </Text>
              </Modal.Header>
              <Modal.Body>
                {depositOptionsData.map((depositOption) => {
                  return (
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 16,
                      }}
                      key={depositOption?.id}
                      onPress={() => changeDepositOptionCheckbox(depositOption)}
                    >
                      <Checkbox
                        style={{
                          width: 16,
                          height: 16,
                          marginEnd: 20,
                        }}
                        color={COLORS.primary}
                        value={depositOption?.isChecked}
                        onValueChange={() =>
                          changeDepositOptionCheckbox(depositOption)
                        }
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: FONTS.regular,
                          color: depositOption?.isChecked
                            ? COLORS.primary
                            : COLORS.textDefault,
                        }}
                      >
                        {depositOption?.id === 1
                          ? `${currencyViCode(
                              Number(roomDetailData?.deposit) / 2
                            ).replace(/.$/, "VND")} ${depositOption?.title}`
                          : depositOption?.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </Modal.Body>
              <Modal.Footer>
                <CustomButton
                  flex={1}
                  label="Deposit"
                  fontSize={14}
                  onPress={depositRoom}
                />
              </Modal.Footer>
            </Modal.Content>
          </Modal>
          {/* FOOTER */}
          {!innkeeperRoom && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: `${
                  route?.params?.roomStatus ? `center` : `space-around`
                }`,
                alignItems: "center",
                paddingVertical: 10,
                paddingHorizontal: 8,
              }}
            >
              {route?.params?.roomStatus ? (
                <CustomButton
                  label="View Contract"
                  backgroundColor={COLORS?.primary}
                  onPress={() =>
                    navigation.navigate("PreviewContract", {
                      contractId: contract?.id,
                    })
                  }
                />
              ) : (
                <>
                  <View
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontFamily: FONTS.medium,
                        fontSize: 16,
                        color: "#fafafa",
                      }}
                    >
                      <Feather name="phone-call" size={17} color="#fafafa" />
                      Call
                    </Text>
                  </View>
                  <CustomButton
                    label="Deposit Holder"
                    backgroundColor={COLORS?.primary}
                    onPress={depositHolder}
                  />
                  <CustomButton
                    label="Call"
                    color={COLORS.textDefault}
                    backgroundColor="#fff"
                    borderColor="#333"
                    borderWidth={1}
                    icon={
                      <Feather
                        name="phone-call"
                        size={17}
                        color={COLORS.iconDefault}
                      />
                    }
                    onPress={triggerCall}
                  />
                </>
              )}
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalAnimation: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 16,
    borderTopWidth: 0.6,
    borderColor: "#999",
  },
  wbHead: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    zIndex: 25,
    elevation: 2,
  },
});

export default RoomDetail;
