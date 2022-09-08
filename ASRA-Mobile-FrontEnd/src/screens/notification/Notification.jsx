import React, { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import {
  VirtualizedList,
  View,
  ImageBackground,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";

import { COLORS, FONTS } from "../../constants";
import { diffBetweenDate } from "../../utils/date-util";
import { getNotifications, readNotification } from "../../api/socket";

import NoDataSVG from "../../assets/svg/no-data/no-data.svg";
import Loading from "../../components/loading/Loading";
function Notification(props) {
  const { navigation, route } = props;
  const [notificationList, setNotificationList] = useState([]);
  const [loading, setLoading] = useState(false);

  const getNotificationList = async () => {
    let isMounted = true;
    await AsyncStorage.getItem("userInfo").then((userInfoData) => {
      if (isMounted) {
        let userInfo = JSON.parse(userInfoData);
        setLoading(true);
        getNotifications(userInfo?.username).then((res) => {
          setNotificationList(res?.data?.notificationList);
          setLoading(false);
        });
      }
    });
    return () => {
      isMounted = false;
    };
  };

  const pressNotificationDetail = (notificationId) => {
    let dataReq = {
      notificationId: notificationId,
    };
    let originNotificationData = notificationList.map((notification) => {
      if (notificationId === notification?.id) {
        readNotification(dataReq)
          .then((res) => {})
          .catch((err) => {});
        return { ...notification, isRead: true };
      }
      return notification;
    });
    setNotificationList(originNotificationData);
  };

  useFocusEffect(
    useCallback(() => {
      getNotificationList();
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* {loading ? (
        <Loading />
      ) : ( */}
      <VirtualizedList
        data={notificationList}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item?.id}
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 8,
              paddingVertical: 8,
              borderBottomWidth: 0.4,
              borderBottomColor: "#999",
              backgroundColor: !item?.isRead ? "#f1f1f1" : COLORS.background,
            }}
            onPress={() => !item?.isRead && pressNotificationDetail(item?.id)}
          >
            <ImageBackground
              style={{
                flex: 0.8,
              }}
            >
              <Image
                source={{ uri: item?.thumbnail }}
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 25,
                }}
              />
            </ImageBackground>
            <View style={{ flex: 4, paddingStart: 4, paddingEnd: 6 }}>
              <Text
                style={{
                  fontFamily: FONTS.regular,
                  fontSize: 13,
                  flexWrap: "wrap",
                }}
              >
                <Text style={{ fontFamily: FONTS.medium, fontSize: 13 }}>
                  {item?.sender}
                </Text>
                {` ${item?.message}`}
              </Text>
              <Text
                style={{
                  paddingTop: 4,
                  fontFamily: FONTS.regular,
                  color: COLORS.primary,
                  fontSize: 12,
                }}
              >
                {diffBetweenDate(item?.createdAt)}
              </Text>
            </View>
            {!item?.isRead && (
              <View
                style={{
                  flex: 0.14,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: COLORS.primary,
                }}
              />
            )}
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => item?.id}
        getItemCount={(notificationList) => notificationList?.length}
        getItem={(notification, index) => notification[index]}
        showsVerticalScrollIndicator={false}
        bounces={false}
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
      />
      {/* )} */}
    </View>
  );
}

export default Notification;
