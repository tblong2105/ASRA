import React, { useState, useEffect, useRef, memo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Keyboard,
  VirtualizedList,
  TouchableOpacity,
  Animated,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CheckboxCustom from "../../components/custom/Checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Slider } from "@miblanchard/react-native-slider";
import * as Location from "expo-location";

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
} from "../../assets";

import NoDataSVG from "../../assets/svg/no-data/no-data.svg";

import {
  FONTS,
  COLORS,
  LOCATION,
  TAB_STATUS,
  TAB_NAME,
  PRICE_TYPE_SORT,
} from "../../constants";
import { formatMillionUnitCurrency } from "../../utils/currency-util";
import {
  roomAreasDataDefault,
  roomTypesDataDefault,
  priceTypeDataDefault,
} from "../../dummy/data";
import { replaceStringShortcutAddress } from "../../utils/string-util";
import { searchRooms } from "../../api/room";

import LogoSVG from "../../assets/svg/logo/asra-logo.svg";
import FocusedStatusBar from "../../components/layout/focused-status-bar/FocusedStatusBar";
import SearchItem from "../../components/search/SearchItem";
import UtilityItem from "../../components/utilitiy-svg/UtilityItem";
import SearchFooter from "./SearchFooter";
import RoomCardOneCol from "../../components/room-card/RoomCardOneCol";
import Loading from "../../components/loading/Loading";

function Search(props) {
  const { navigation, route } = props;
  const insets = useSafeAreaInsets();

  // SEARCH BAR
  const [searchText, setSearchText] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [roomsData, setRoomsData] = useState([]);
  const [addressList, setAddressList] = useState([]);
  const [isShowClearIcon, setIsShowClearIcon] = useState(false);
  const [searchRoomLoading, setSearchRoomLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  // ANIMATION MODAL
  const [showModal, setShowModal] = useState(false);
  const [modalAnimation] = useState(new Animated.Value(0));

  // MODAL SEARCH TYPE TAB
  const [showRoomTypeModal, setShowRoomTypeModal] = useState(false);
  const [showUtilityModal, setShowUtilityModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showAreaModal, setShowAreaModal] = useState(false);

  // CHECKING COUNT SEARCH TYPE ON TAB
  const [roomTypeStatus, setRoomTypeStatus] = useState(TAB_STATUS.up);
  const [utilityStatus, setUtilityStatus] = useState(TAB_STATUS.up);
  const [priceStatus, setPriceStatus] = useState(TAB_STATUS.up);
  const [areaStatus, setAreaStatus] = useState(TAB_STATUS.up);

  // COUNT SEARCH FILTER ON TAB
  const [roomTypeCount, setRoomTypeCount] = useState(0);
  const [utilitiesCount, setUtilitiesCount] = useState(0);
  const [roomAreaCount, setRoomAreaCount] = useState(0);
  const [priceCount, setPriceCount] = useState(0);

  // PRICE TAB
  const [priceSlider, setPriceSlider] = useState([0, 20000000]);
  const [priceTypeData, setPriceTypeData] = useState(priceTypeDataDefault);
  const [priceTypeSort, setPriceTypeSort] = useState({
    latest: PRICE_TYPE_SORT.latest,
    lowToHigh: "",
    highToLow: "",
  });

  // ROOM TYPE TAB
  const [roomTypesData, setRoomTypesData] = useState(roomTypesDataDefault);
  const [dormitory, setDormitory] = useState(false);
  const [roomForRent, setRoomForRent] = useState(false);
  const [apartment, setApartment] = useState(false);
  const [wholeHouse, setWholeHouse] = useState(false);
  const [sharedRoom, setSharedRoom] = useState(false);

  // UTILITIES
  const [bed, setBed] = useState(false);
  const [time, setTime] = useState(false);
  const [wmc, setWmc] = useState(false);
  const [ac, setAc] = useState(false);
  const [television, setTelevision] = useState(false);
  const [refrigerator, setRefrigerator] = useState(false);
  const [wifi, setWifi] = useState(false);
  const [parking, setParking] = useState(false);
  const [toilet, setToilet] = useState(false);
  const [kitchen, setKitchen] = useState(false);

  // ROOM AREA
  const [roomsAreaData, setRoomsAreaData] = useState(roomAreasDataDefault);
  const [roomAreaMin, setRoomAreaMin] = useState(0);
  const [roomAreaMax, setRoomAreaMax] = useState(0);

  // CHECKING FIND AROUND HERE
  const [isFindAroundHere, setIsFindAroundHere] = useState(false);

  const searchInputRef = useRef();
  const locationJSONData = async () => await AsyncStorage.getItem(LOCATION);

  const searchAddressFilter = (text) => {
    setIsSearch(false);
    closeModal();
    modalAnimation.setValue(0);
    let isMounted = true;
    locationJSONData().then((data) => {
      if (isMounted) {
        let locationData = JSON.parse(data);
        let addressListTemp = [];
        if (!text) {
          setIsSearch(true);
          setIsShowClearIcon(false);
          addressListTemp = [];
          setAddressList([]);
          setSearchText(text);
        } else {
          setIsShowClearIcon(true);
          setSearchText(text);
          let tempValue = removeAccents(text.toLowerCase()).trim();
          locationData.map((item) => {
            let originItem = item;
            originItem = originItem.replace(/,/g, "");
            originItem = removeAccents(originItem.toLowerCase()).trim();

            let tempItem = item;
            tempItem = tempItem.replace(/,/g, "");
            tempItem = tempItem.replace(/Thành phố /g, "");
            tempItem = tempItem.replace(/Quận /g, "");
            tempItem = tempItem.replace(/Huyện /g, "");
            tempItem = removeAccents(tempItem.toLowerCase()).trim();

            if (
              tempItem.includes(tempValue) ||
              originItem.includes(tempValue)
            ) {
              if (!addressListTemp.includes(item)) {
                addressListTemp.push(item);
              }
            } else {
              return [];
            }
          });
        }
        setAddressList(addressListTemp);
      }
    });
    return () => {
      isMounted = false;
    };
  };

  const removeAccents = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  const clearDataSearch = () => {
    setIsSearch(true);
    setIsShowClearIcon(false);
    setSearchText("");
    setAddressList([]);
    Keyboard.dismiss();
  };

  const toggleModal = (tabName, status) => {
    if (showModal) {
      if (status === TAB_STATUS.down) {
        Animated.spring(modalAnimation, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
        setShowModal(false);
        switch (true) {
          case tabName === TAB_NAME.roomType:
            setShowRoomTypeModal(false);
            setRoomTypeStatus(TAB_STATUS.up);
            break;
          case tabName === TAB_NAME.utility:
            setShowUtilityModal(false);
            setUtilityStatus(TAB_STATUS.up);
            break;
          case tabName === TAB_NAME.price:
            setShowPriceModal(false);
            setPriceStatus(TAB_STATUS.up);
            break;
          case tabName === TAB_NAME.area:
            setShowAreaModal(false);
            setAreaStatus(TAB_STATUS.up);
            break;
          default:
            break;
        }
      } else {
        Animated.spring(modalAnimation, {
          toValue: 1,
          useNativeDriver: false,
        }).start();
        setShowModal(true);
        switch (true) {
          case tabName === TAB_NAME.roomType:
            setShowRoomTypeModal(true);
            setShowUtilityModal(false);
            setShowPriceModal(false);
            setShowAreaModal(false);
            setRoomTypeStatus(TAB_STATUS.down);
            setUtilityStatus(TAB_STATUS.up);
            setPriceStatus(TAB_STATUS.up);
            setAreaStatus(TAB_STATUS.up);
            break;
          case tabName === TAB_NAME.utility:
            setShowUtilityModal(true);
            setShowRoomTypeModal(false);
            setShowPriceModal(false);
            setShowAreaModal(false);
            setUtilityStatus(TAB_STATUS.down);
            setRoomTypeStatus(TAB_STATUS.up);
            setPriceStatus(TAB_STATUS.up);
            setAreaStatus(TAB_STATUS.up);
            break;
          case tabName === TAB_NAME.price:
            setShowPriceModal(true);
            setShowRoomTypeModal(false);
            setShowUtilityModal(false);
            setShowAreaModal(false);
            setPriceStatus(TAB_STATUS.down);
            setRoomTypeStatus(TAB_STATUS.up);
            setUtilityStatus(TAB_STATUS.up);
            setAreaStatus(TAB_STATUS.up);
            break;
          case tabName === TAB_NAME.area:
            setShowAreaModal(true);
            setShowPriceModal(false);
            setShowRoomTypeModal(false);
            setShowUtilityModal(false);
            setAreaStatus(TAB_STATUS.down);
            setRoomTypeStatus(TAB_STATUS.up);
            setPriceStatus(TAB_STATUS.up);
            setUtilityStatus(TAB_STATUS.up);
            break;
          default:
            break;
        }
      }
    } else {
      if (status === TAB_STATUS.up) {
        Animated.spring(modalAnimation, {
          toValue: 1,
          useNativeDriver: false,
        }).start();
        setShowModal(true);
        switch (true) {
          case tabName === TAB_NAME.roomType:
            setShowRoomTypeModal(true);
            setRoomTypeStatus(TAB_STATUS.down);
            break;
          case tabName === TAB_NAME.utility:
            setShowUtilityModal(true);
            setUtilityStatus(TAB_STATUS.down);
            break;
          case tabName === TAB_NAME.price:
            setShowPriceModal(true);
            setPriceStatus(TAB_STATUS.down);
            break;
          case tabName === TAB_NAME.area:
            setShowAreaModal(true);
            setAreaStatus(TAB_STATUS.down);
            break;
          default:
            break;
        }
      }
    }
  };

  const closeModal = () => {
    Animated.spring(modalAnimation, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
    setShowModal(false);
    setShowRoomTypeModal(false);
    setRoomTypeStatus(TAB_STATUS.up);

    setShowUtilityModal(false);
    setUtilityStatus(TAB_STATUS.up);

    setShowPriceModal(false);
    setPriceStatus(TAB_STATUS.up);

    setShowAreaModal(false);
    setAreaStatus(TAB_STATUS.up);
  };

  const changeRoomTypeCheckbox = (item) => {
    let originDataTemp = roomTypesData.map((roomType) => {
      if (item?.name === "All") {
        if (item?.isChecked) {
          setDormitory(false);
          setRoomForRent(false);
          setApartment(false);
          setWholeHouse(false);
          setSharedRoom(false);
          return { ...roomType, isChecked: false };
        } else {
          setDormitory(true);
          setRoomForRent(true);
          setApartment(true);
          setWholeHouse(true);
          setSharedRoom(true);
          return { ...roomType, isChecked: true };
        }
      } else {
        if (item?.name === roomType?.name) {
          switch (true) {
            case item?.name === "Dormitory":
              item?.isChecked ? setDormitory(false) : setDormitory(true);
              break;
            case item?.name === "Room For Rent":
              item?.isChecked ? setRoomForRent(false) : setRoomForRent(true);
              break;
            case item?.name === "Apartment":
              item?.isChecked ? setApartment(false) : setApartment(true);
              break;
            case item?.name === "Whole House":
              item?.isChecked ? setWholeHouse(false) : setWholeHouse(true);
              break;
            case item?.name === "Shared Room":
              item?.isChecked
                ? setSharedRoom(false)
                : item?.isChecked
                ? setSharedRoom(false)
                : setDormitory(true);
              true;
              break;
            default:
              break;
          }
          return { ...roomType, isChecked: !roomType?.isChecked };
        }
        if (roomType?.name === "All") {
          return { ...roomType, isChecked: false };
        }
        return roomType;
      }
    });
    setRoomTypesData(originDataTemp);
    if (
      originDataTemp[1]?.isChecked &&
      originDataTemp[2]?.isChecked &&
      originDataTemp[3]?.isChecked &&
      originDataTemp[4]?.isChecked &&
      originDataTemp[5]?.isChecked
    ) {
      setRoomTypesData(
        originDataTemp?.map((roomType) => {
          if (roomType?.name === "All") {
            return { ...roomType, isChecked: true };
          }
          return roomType;
        })
      );
    }
  };

  const changeRoomAreaCheckbox = (item) => {
    let checkSearchFilterRoomArea = false;
    let originDataRoomAreaToActive = roomsAreaData.map((roomArea) => {
      if (item?.area === roomArea?.area) {
        if (roomArea?.isChecked) {
          checkSearchFilterRoomArea = false;
        } else {
          checkSearchFilterRoomArea = true;
        }
        setRoomAreaMin(item?.min);
        setRoomAreaMax(item?.max);
        return { ...roomArea, isChecked: !roomArea?.isChecked };
      } else {
        return { ...roomArea, isChecked: false };
      }
    });
    setRoomsAreaData(originDataRoomAreaToActive);
    if (!checkSearchFilterRoomArea) {
      setRoomAreaMin(0);
      setRoomAreaMax(0);
    }
  };

  const changePriceTypeCheckbox = (item) => {
    let originDataPriceTypeToActive = priceTypeData.map((priceType) => {
      if (item?.name === priceType?.name) {
        if (item?.sortType === PRICE_TYPE_SORT.latest) {
          setPriceTypeSort({
            latest: "latest",
            lowToHigh: "",
            highToLow: "",
          });
        } else if (item?.sortType === PRICE_TYPE_SORT.lowToHigh) {
          setPriceTypeSort({
            latest: "",
            lowToHigh: "lowToHigh",
            highToLow: "",
          });
        } else if (item?.sortType === PRICE_TYPE_SORT.highToLow) {
          setPriceTypeSort({
            latest: "",
            lowToHigh: "",
            highToLow: "highToLow",
          });
        }
        return { ...priceType, isChecked: true };
      } else {
        return { ...priceType, isChecked: false };
      }
    });
    setPriceTypeData(originDataPriceTypeToActive);
  };

  const searchFilterRoom = async (address) => {
    closeModal();
    setIsSearch(true);

    let dataReq = {
      city: null,
      district: null,
      ward: null,
      streetName: null,
      minPrice: priceSlider[0],
      maxPrice: priceSlider[1],
      utilities_ac: ac,
      utilities_bed: bed,
      utilities_kitchen: kitchen,
      utilities_parking: parking,
      utilities_refrigerator: refrigerator,
      utilities_television: television,
      utilities_time: time,
      utilities_toilet: toilet,
      utilities_wifi: wifi,
      utilities_wm: wmc,
      apartment: apartment,
      roomForRent: roomForRent,
      sharedRoom: sharedRoom,
      wholeHouse: wholeHouse,
      dormitory: dormitory,
      roomAreaMin: roomAreaMin,
      roomAreaMax: roomAreaMax,
      lat: "",
      lng: "",
      radius: "",
      sortBy: priceTypeSort?.latest
        ? priceTypeSort?.latest
        : priceTypeSort?.lowToHigh
        ? priceTypeSort?.lowToHigh
        : priceTypeSort?.highToLow && priceTypeSort?.highToLow,
      page: 1,
    };
    let originAddressData = [];
    switch (true) {
      case address && address !== "Find around here":
        setIsFindAroundHere(false);
        setSearchText(address);
        originAddressData = address.split(", ").reverse();
        dataReq["city"] = originAddressData[0];
        dataReq["district"] = [originAddressData[1]];
        dataReq["ward"] = originAddressData[2];
        dataReq["streetName"] = originAddressData[3];
        break;
      case address === "Find around here":
        setIsFindAroundHere(!isFindAroundHere);
        setSearchText("");
        searchInputRef?.current && searchInputRef?.current.blur();
        // let { status } = await Location.requestForegroundPermissionsAsync();
        // if (status !== "granted") {
        //   return;
        // }

        // let location = await Location.getCurrentPositionAsync({});

        // dataReq["lat"] = location?.coords?.latitude
        //   ? location?.coords?.latitude
        //   : "15.96848447426403";
        // dataReq["lng"] = location?.coords?.longitude
        //   ? location?.coords?.longitude
        //   : "108.26055764809624";
        // dataReq["radius"] = "10";

        dataReq["lat"] = "15.96848447426403";
        dataReq["lng"] = "108.26055764809624";
        dataReq["radius"] = "10";
        break;
      default:
        break;
    }

    // Count search filter
    countSearchFilter();
    setSearchRoomLoading(true);
    searchRooms(dataReq)
      .then((res) => {
        let originRoomData = res?.rooms.map((room) => {
          return {
            ...room,
            address: replaceStringShortcutAddress(room?.address),
          };
        });
        setRoomsData(originRoomData);
        setSearchRoomLoading(false);
      })
      .catch((err) => {});
  };

  const countSearchFilter = () => {
    // Count room type tab
    let countRoomType = roomTypesData.filter((roomType) => roomType?.isChecked);
    setRoomTypeCount(countRoomType?.length);

    // Count utility tab
    let countUtilities = 0;
    if (bed) {
      countUtilities += 1;
    }
    if (television) {
      countUtilities += 1;
    }
    if (ac) {
      countUtilities += 1;
    }
    if (kitchen) {
      countUtilities += 1;
    }
    if (time) {
      countUtilities += 1;
    }
    if (toilet) {
      countUtilities += 1;
    }
    if (refrigerator) {
      countUtilities += 1;
    }
    if (wifi) {
      countUtilities += 1;
    }
    if (wmc) {
      countUtilities += 1;
    }
    if (parking) {
      countUtilities += 1;
    }
    setUtilitiesCount(countUtilities);

    // Count room area tab
    let countRoomArea = roomsAreaData.filter((roomArea) => roomArea?.isChecked);
    setRoomAreaCount(countRoomArea?.length);

    // Count price tab
    let countPriceTemp = 0;
    if (priceSlider[0] !== 0 || priceSlider[1] !== 20000000) {
      countPriceTemp += 1;
    }
    let countPriceType = priceTypeData?.filter(
      (priceType) => priceType?.isChecked
    );
    if (countPriceType?.length > 0) {
      countPriceTemp += countPriceType?.length;
    }
    setPriceCount(countPriceTemp);
  };

  const resetRoomTypeTab = () => {
    setDormitory(false);
    setRoomForRent(false);
    setApartment(false);
    setWholeHouse(false);
    setSharedRoom(false);
    let resetRoomTypeData = roomTypesData?.map((roomType) => ({
      ...roomType,
      isChecked: false,
    }));
    setRoomTypesData(resetRoomTypeData);
  };

  const resetUtilityTab = () => {
    setBed(false);
    setTime(false);
    setWmc(false);
    setAc(false);
    setTelevision(false);
    setRefrigerator(false);
    setWifi(false);
    setParking(false);
    setToilet(false);
    setKitchen(false);
  };

  const resetPriceTypeSortTab = () => {
    setPriceSlider([0, 20000000]);
    setPriceTypeSort({
      latest: PRICE_TYPE_SORT.latest,
      lowToHigh: "",
      highToLow: "",
    });
    let resetPriceTypeSort = priceTypeData?.map((priceType) => {
      if (priceType?.sortType !== PRICE_TYPE_SORT.latest) {
        return { ...priceType, isChecked: false };
      }
      return { ...priceType, isChecked: true };
    });
    setPriceTypeData(resetPriceTypeSort);
  };

  const resetRoomAreaTab = () => {
    setRoomAreaMin(0);
    setRoomAreaMax(0);
    let resetRoomAreaData = roomsAreaData?.map((roomArea) => ({
      ...roomArea,
      isChecked: false,
    }));
    setRoomsAreaData(resetRoomAreaData);
  };

  const focusInputSearch = () => {
    setIsSearch(false);
  };

  useEffect(() => {
    // Count price tab
    let countPriceTemp = 0;
    let countPriceType = priceTypeData?.filter(
      (priceType) => priceType?.isChecked
    );
    if (countPriceType?.length > 0) {
      countPriceTemp += countPriceType?.length;
    }
    setPriceCount(countPriceTemp);
    let address = route?.params?.address;
    switch (true) {
      case address && address !== "Find around here":
        searchFilterRoom(address);
        break;
      case address === "Find around here":
        searchFilterRoom(address);
        break;
      case !address:
        searchFilterRoom(void 0);
        break;
      default:
        break;
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <FocusedStatusBar backgroundColor={COLORS.primary} />
      {!route?.params?.homeSearch && (
        <View>
          <Text
            style={{
              marginTop: 20,
              paddingHorizontal: 14,
              fontFamily: FONTS.medium,
              fontSize: 26,
              color: COLORS.primary,
            }}
          >
            Search Rooms
          </Text>
        </View>
      )}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 12,
          height: 60,
        }}
      >
        {route?.params?.homeSearch ? (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="chevron-back-outline"
              size={26}
              color={COLORS.iconDefault}
            />
          </TouchableOpacity>
        ) : (
          <LogoSVG height={24} width={24} />
        )}
        {route?.params?.homeSearch ? (
          <>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                paddingHorizontal: 11,
                paddingVertical: 13,
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  paddingVertical: 6,
                  paddingStart: 7,
                  paddingEnd: 30,
                  backgroundColor: "#F0F2F6",
                  borderRadius: 4,
                }}
              >
                <Ionicons name="search" size={15} color="#555" />
                <TextInput
                  ref={searchInputRef}
                  style={{
                    marginLeft: 6,
                    lineHeight: 15,
                    color: "#555",
                    fontFamily: FONTS.regular,
                    fontSize: 12,
                  }}
                  placeholder="Search by location..."
                  placeholderTextColor="#555"
                  keyboardType="default"
                  value={searchText}
                  returnKeyType="search"
                  blurOnSubmit={false}
                  onChangeText={(text) => searchAddressFilter(text)}
                  onSubmitEditing={(value) =>
                    searchFilterRoom(value.nativeEvent.text)
                  }
                  onFocus={focusInputSearch}
                />
                {isShowClearIcon && (
                  <TouchableOpacity
                    onPress={clearDataSearch}
                    style={{ position: "absolute", right: 10 }}
                  >
                    <Ionicons
                      name="close-circle-outline"
                      size={16}
                      color="#555"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <Ionicons
              name="navigate-circle-outline"
              size={24}
              color={COLORS.iconDefault}
            />
          </>
        ) : (
          <>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 12,
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  padding: 6,
                  backgroundColor: "#F0F2F6",
                  borderRadius: 4,
                }}
                onPress={() =>
                  navigation.navigate("HomeSearch", {
                    homeSearch: true,
                    address: "",
                  })
                }
              >
                <Ionicons name="search" size={15} color="#555" />
                <Text
                  style={{
                    color: "#555",
                    fontFamily: FONTS.regular,
                    fontSize: 12,
                    lineHeight: 22,
                    marginLeft: 6,
                  }}
                >
                  Search by location...
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      {route?.params?.homeSearch && (
        <>
          {/* FILTER SEARCH */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 6,
              paddingBottom: 16,
              paddingHorizontal: 18,
              borderBottomWidth: 0.6,
              borderColor: "#999",
            }}
          >
            <TouchableOpacity
              onPress={() => toggleModal(TAB_NAME.roomType, roomTypeStatus)}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    paddingEnd: 4,
                    fontFamily: FONTS.regular,
                    fontSize: 13,
                    color:
                      roomTypeCount > 0
                        ? COLORS.primary
                        : roomTypeStatus === TAB_STATUS.up
                        ? COLORS.textDefault
                        : COLORS.primary,
                  }}
                >
                  Room Type
                </Text>
                <Ionicons
                  name={`chevron-${
                    roomTypeStatus === TAB_STATUS.up ? "down" : "up"
                  }-outline`}
                  size={15}
                  color={
                    roomTypeStatus === TAB_STATUS.up
                      ? COLORS.textDefault
                      : COLORS.primary
                  }
                />
              </View>
              {roomTypeCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    alignItems: "center",
                    top: -8,
                    right: -16,
                    height: 14,
                    width: 14,
                    backgroundColor: COLORS.secondary,
                    borderRadius: 7,
                  }}
                >
                  <Text
                    style={{
                      paddingStart: 1,
                      fontSize: 10,
                      fontFamily: FONTS.semiBold,
                      color: "#fff",
                    }}
                  >
                    {roomTypeCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toggleModal(TAB_NAME.utility, utilityStatus)}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    paddingEnd: 4,
                    fontFamily: FONTS.regular,
                    fontSize: 13,
                    color:
                      utilitiesCount > 0
                        ? COLORS.primary
                        : utilityStatus === TAB_STATUS.up
                        ? COLORS.textDefault
                        : COLORS.primary,
                  }}
                >
                  Utility
                </Text>
                <Ionicons
                  name={`chevron-${
                    utilityStatus === TAB_STATUS.up ? "down" : "up"
                  }-outline`}
                  size={15}
                  color={
                    utilityStatus === TAB_STATUS.up
                      ? COLORS.textDefault
                      : COLORS.primary
                  }
                />
              </View>
              {utilitiesCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    alignItems: "center",
                    top: -8,
                    right: -16,
                    height: 14,
                    width: 14,
                    backgroundColor: COLORS.secondary,
                    borderRadius: 7,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: FONTS.semiBold,
                      color: "#fff",
                    }}
                  >
                    {utilitiesCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toggleModal(TAB_NAME.price, priceStatus)}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    paddingEnd: 4,
                    fontFamily: FONTS.regular,
                    fontSize: 13,
                    color:
                      priceCount > 0
                        ? COLORS.primary
                        : priceStatus === TAB_STATUS.up
                        ? COLORS.textDefault
                        : COLORS.primary,
                  }}
                >
                  Price
                </Text>
                <Ionicons
                  name={`chevron-${
                    priceStatus === TAB_STATUS.up ? "down" : "up"
                  }-outline`}
                  size={15}
                  color={
                    priceStatus === TAB_STATUS.up
                      ? COLORS.textDefault
                      : COLORS.primary
                  }
                />
              </View>
              {priceCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    alignItems: "center",
                    top: -8,
                    right: -16,
                    height: 14,
                    width: 14,
                    backgroundColor: COLORS.secondary,
                    borderRadius: 7,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: FONTS.semiBold,
                      color: "#fff",
                    }}
                  >
                    {priceCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toggleModal(TAB_NAME.area, areaStatus)}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    paddingEnd: 4,
                    fontFamily: FONTS.regular,
                    fontSize: 13,
                    color:
                      roomAreaCount > 0
                        ? COLORS.primary
                        : areaStatus === TAB_STATUS.up
                        ? COLORS.textDefault
                        : COLORS.primary,
                  }}
                >
                  Area
                </Text>
                <Ionicons
                  name={`chevron-${
                    areaStatus === TAB_STATUS.up ? "down" : "up"
                  }-outline`}
                  size={15}
                  color={
                    areaStatus === TAB_STATUS.up
                      ? COLORS.textDefault
                      : COLORS.primary
                  }
                />
              </View>
              {roomAreaCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    alignItems: "center",
                    top: -8,
                    right: -16,
                    height: 14,
                    width: 14,
                    backgroundColor: COLORS.secondary,
                    borderRadius: 7,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: FONTS.semiBold,
                      color: "#fff",
                    }}
                  >
                    {roomAreaCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <Animated.View
            style={{
              position: "absolute",
              top: 100 + insets.top,
              left: 0,
              right: 0,
              width: "100%",
              height: modalAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
              zIndex: 10,
            }}
          >
            {showRoomTypeModal && (
              <View
                style={{
                  flex: 2,
                  backgroundColor: "#fafafa",
                  paddingHorizontal: 16,
                  paddingVertical: 18,
                }}
              >
                <View style={{ marginBottom: 10 }}>
                  <Text style={{ fontFamily: FONTS.medium }}>Room Type</Text>
                </View>
                <View
                  style={{
                    flex: 7,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    paddingHorizontal: 16,
                  }}
                >
                  <FlatList
                    maxToRenderPerBatch={10}
                    updateCellsBatchingPeriod={50}
                    numColumns={2}
                    data={roomTypesData}
                    renderItem={({ item }) => (
                      <CheckboxCustom
                        label={item?.name}
                        value={item?.isChecked}
                        onValueChange={() => changeRoomTypeCheckbox(item)}
                        isActiveText={item?.isChecked}
                        roomType
                      />
                    )}
                    keyExtractor={(item) => item?.id}
                    bounces={false}
                    style={{ flex: 1 }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <SearchFooter
                    searchFilterRoom={() => searchFilterRoom(searchText)}
                    resetFilterSearchRoom={resetRoomTypeTab}
                  />
                </View>
              </View>
            )}
            {showUtilityModal && (
              <View
                style={{
                  flex: 2,
                  backgroundColor: "#fafafa",
                  paddingHorizontal: 16,
                  paddingVertical: 18,
                }}
              >
                <View style={{ marginBottom: 10 }}>
                  <Text style={{ fontFamily: FONTS.medium }}>Utility</Text>
                </View>
                <View style={{ flex: 7, paddingEnd: 20 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <UtilityItem
                          label="Double Bed"
                          utility={bed}
                          activeUtility={() => setBed(!bed)}
                          iconActive={<BedSVG width={28} height={28} />}
                          iconDefault={<BedDefaultSVG width={28} height={28} />}
                        />
                        <UtilityItem
                          label="Television"
                          utility={television}
                          activeUtility={() => setTelevision(!television)}
                          iconActive={<TelevisionSVG width={28} height={28} />}
                          iconDefault={
                            <TelevisionDefaultSVG width={28} height={28} />
                          }
                        />
                        <UtilityItem
                          label="Air Condition"
                          utility={ac}
                          activeUtility={() => setAc(!ac)}
                          iconActive={
                            <AirConditionSVG width={28} height={28} />
                          }
                          iconDefault={
                            <AirConditionDefaultSVG width={28} height={28} />
                          }
                        />
                        <UtilityItem
                          label="Kitchen"
                          utility={kitchen}
                          activeUtility={() => setKitchen(!kitchen)}
                          iconActive={<KitchenSVG width={28} height={28} />}
                          iconDefault={
                            <KitchenDefaultSVG width={28} height={28} />
                          }
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <UtilityItem
                          label="Time"
                          utility={time}
                          activeUtility={() => setTime(!time)}
                          iconActive={<ClockSVG width={28} height={28} />}
                          iconDefault={
                            <ClockDefaultSVG width={28} height={28} />
                          }
                          time
                        />
                        <UtilityItem
                          label="Toilet"
                          utility={toilet}
                          activeUtility={() => setToilet(!toilet)}
                          iconActive={<ToiletSVG width={28} height={28} />}
                          iconDefault={
                            <ToiletDefaultSVG width={28} height={28} />
                          }
                        />
                        <UtilityItem
                          label="Refrigerator"
                          utility={refrigerator}
                          activeUtility={() => setRefrigerator(!refrigerator)}
                          iconActive={
                            <RefrigeratorSVG width={28} height={28} />
                          }
                          iconDefault={
                            <RefrigeratorDefaultSVG width={28} height={28} />
                          }
                        />
                        <UtilityItem
                          label="Wifi"
                          utility={wifi}
                          activeUtility={() => setWifi(!wifi)}
                          iconActive={<WifiSVG width={28} height={28} />}
                          iconDefault={
                            <WifiDefaultSVG width={28} height={28} />
                          }
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <UtilityItem
                          label="Washer"
                          utility={wmc}
                          activeUtility={() => setWmc(!wmc)}
                          iconActive={
                            <WashingMachineSVG width={28} height={28} />
                          }
                          iconDefault={
                            <WashingMachineDefaultSVG width={28} height={28} />
                          }
                        />
                        <UtilityItem
                          label="Parking"
                          utility={parking}
                          activeUtility={() => setParking(!parking)}
                          iconActive={<ParkingSVG width={28} height={28} />}
                          iconDefault={
                            <ParkingDefaultSVG width={28} height={28} />
                          }
                        />
                        <View
                          style={{
                            width: "25%",
                            marginVertical: 10,
                          }}
                        />
                        <View
                          style={{
                            width: "25%",
                            marginVertical: 10,
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <SearchFooter
                    searchFilterRoom={() => searchFilterRoom(searchText)}
                    resetFilterSearchRoom={resetUtilityTab}
                  />
                </View>
              </View>
            )}
            {showPriceModal && (
              <View
                style={{
                  flex: 2,
                  backgroundColor: "#fafafa",
                  paddingHorizontal: 16,
                  paddingVertical: 18,
                }}
              >
                <View style={{ marginBottom: 10 }}>
                  <Text style={{ fontFamily: FONTS.medium }}>Price</Text>
                </View>
                <View style={{ flex: 7, paddingHorizontal: 16 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontFamily: FONTS.regular, fontSize: 12 }}>
                      Price from {formatMillionUnitCurrency(priceSlider[0])}
                    </Text>
                    <Text style={{ fontFamily: FONTS.regular, fontSize: 12 }}>
                      {` to ${formatMillionUnitCurrency(priceSlider[1])}`}
                    </Text>
                  </View>
                  <Slider
                    value={priceSlider}
                    animateTransitions
                    thumbStyle
                    maximumValue={20000000}
                    minimumValue={0}
                    step={1000000}
                    maximumTrackTintColor="#fff"
                    minimumTrackTintColor={COLORS.primary}
                    thumbTintColor={COLORS.primary}
                    onValueChange={(value) => {
                      setPriceSlider(value);
                    }}
                  />
                  <FlatList
                    maxToRenderPerBatch={10}
                    updateCellsBatchingPeriod={50}
                    data={priceTypeData}
                    renderItem={({ item }) => (
                      <CheckboxCustom
                        label={item?.name}
                        value={item?.isChecked}
                        onValueChange={() => changePriceTypeCheckbox(item)}
                        isActiveText={item?.isChecked}
                      />
                    )}
                    keyExtractor={(item) => item?.id}
                    style={{ flex: 1 }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <SearchFooter
                    searchFilterRoom={() => searchFilterRoom(searchText)}
                    resetFilterSearchRoom={resetPriceTypeSortTab}
                  />
                </View>
              </View>
            )}
            {showAreaModal && (
              <View
                style={{
                  flex: 2.6,
                  backgroundColor: "#fafafa",
                  paddingHorizontal: 16,
                  paddingVertical: 18,
                }}
              >
                <View style={{ flex: 7, marginBottom: 10 }}>
                  <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontFamily: FONTS.medium }}>Room Area</Text>
                  </View>
                  <View style={{ marginVertical: 10 }}>
                    <Text style={{ fontFamily: FONTS.medium }}>Utilities</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      paddingHorizontal: 16,
                    }}
                  >
                    <FlatList
                      maxToRenderPerBatch={10}
                      updateCellsBatchingPeriod={50}
                      numColumns={2}
                      data={roomsAreaData}
                      renderItem={({ item }) => (
                        <CheckboxCustom
                          label={item?.area}
                          value={item?.isChecked}
                          onValueChange={() => changeRoomAreaCheckbox(item)}
                          isActiveText={item?.isChecked}
                          m2
                        />
                      )}
                      keyExtractor={(item) => item?.id}
                      style={{ flex: 1 }}
                    />
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <SearchFooter
                    searchFilterRoom={() => searchFilterRoom(searchText)}
                    resetFilterSearchRoom={resetRoomAreaTab}
                  />
                </View>
              </View>
            )}
            <TouchableOpacity
              style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
              onPress={closeModal}
            />
          </Animated.View>
        </>
      )}
      {isSearch && (
        <TouchableOpacity
          onPress={() => {
            setIsFindAroundHere(!isFindAroundHere);
            route?.params?.homeSearch
              ? !isFindAroundHere
                ? searchFilterRoom("Find around here")
                : searchFilterRoom(void 0)
              : navigation.navigate("HomeSearch", {
                  homeSearch: true,
                  address: "Find around here",
                });
          }}
          style={{
            flexDirection: "row",
            paddingTop: route?.params?.homeSearch && 12,
            paddingHorizontal: 16,
            paddingBottom: 12,
          }}
        >
          <Ionicons
            name="navigate-outline"
            size={15}
            color={
              route?.params?.homeSearch && isFindAroundHere
                ? COLORS.primary
                : COLORS.iconDefault
            }
          />
          <Text
            style={{
              paddingStart: 6,
              fontFamily: FONTS.medium,
              color:
                route?.params?.homeSearch && isFindAroundHere
                  ? COLORS.primary
                  : COLORS.textDefault,
            }}
          >
            Find around here
          </Text>
        </TouchableOpacity>
      )}
      {isSearch && route?.params?.homeSearch ? (
        <>
          <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
            <Text style={{ fontFamily: FONTS.medium }}>Result </Text>
          </View>
          {!searchRoomLoading ? (
            <VirtualizedList
              data={roomsData?.length > 0 && roomsData}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={50}
              renderItem={({ item }) => (
                <RoomCardOneCol room={item} navigation={navigation} />
              )}
              keyExtractor={(room) => room?.id}
              getItemCount={(roomsData) => roomsData?.length}
              getItem={(room, index) => room[index]}
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
              ListEmptyComponent={
                <View
                  style={{
                    paddingVertical: 240,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <NoDataSVG height={80} width={80} />
                </View>
              }
              style={{ paddingHorizontal: 16 }}
            />
          ) : (
            <Loading />
          )}
        </>
      ) : (
        <VirtualizedList
          data={addressList}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          renderItem={({ item, index }) => (
            <SearchItem
              id={index}
              item={item}
              searchRoomsByAddress={() => searchFilterRoom(item)}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          getItemCount={(addressList) => addressList?.length}
          getItem={(address, index) => address[index]}
          showsVerticalScrollIndicator={false}
          bounces={false}
          scrollEventThrottle={16}
          ListHeaderComponent={
            <View>
              {addressList?.length !== 0 && (
                <View style={{ paddingHorizontal: 10, paddingBottom: 2 }}>
                  <Text style={{ fontFamily: FONTS.medium }}>Suggestions</Text>
                </View>
              )}
            </View>
          }
          ListHeaderComponentStyle={{
            marginTop: addressList?.length !== 0 && 16,
          }}
          ListEmptyComponent={
            <View
              style={{
                paddingVertical: 240,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <NoDataSVG height={80} width={80} />
            </View>
          }
          style={{ paddingHorizontal: 4 }}
        />
      )}
    </SafeAreaView>
  );
}

export default memo(Search);
