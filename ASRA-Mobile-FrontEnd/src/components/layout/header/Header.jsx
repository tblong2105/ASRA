import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS, FONTS, TABS, HEADER } from "../../../constants";

import LogoSVG from "../../../assets/svg/logo/asra-logo.svg";
import NotificationSVG from "../../../assets/svg/notification/notification.svg";

function Header(props) {
  const { title, navigation } = props;
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 12,
          backgroundColor: COLORS.background,
          height: HEADER.headerHeight,
          borderBottomWidth: 0.2,
          borderBottomColor: "#999",
        }}
      >
        {title === TABS.home || title === TABS.search ? (
          <LogoSVG height={28} width={28} />
        ) : title === TABS.profile ? (
          <View style={{ paddingStart: 14 }} />
        ) : title === TABS.contract ||
          title === TABS.notification ||
          title === TABS.myRooms ||
          title === TABS.myRoomsForRent ||
          title === TABS.myWaitingContract ? (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="chevron-back-outline"
              size={26}
              color={COLORS.iconDefault}
            />
          </TouchableOpacity>
        ) : (
          <View />
        )}
        {title === TABS.home || title === TABS.search ? (
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
        ) : (
          <Text
            style={{
              color: COLORS.primary,
              fontSize: 16,
              fontFamily: FONTS.regular,
            }}
          >
            {title}
          </Text>
        )}
        {title === TABS.home || title === TABS.search ? (
          <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
            <NotificationSVG height={24} width={24} />
          </TouchableOpacity>
        ) : title === TABS.profile ? (
          <Ionicons
            name="alert-circle-outline"
            size={22}
            color={COLORS.iconDefault}
          />
        ) : (
          <>
            {title === TABS.contract ||
            title === TABS.notification ||
            title === TABS.myRooms ||
            title === TABS.myRoomsForRent ||
            title === TABS.myWaitingContract ? (
              <View style={{ paddingEnd: 16 }} />
            ) : (
              <View />
            )}
          </>
        )}
      </View>
    </>
  );
}

export default Header;
