import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../permission/AuthProvider";
import { COLORS, FONTS } from "../../constants";
import BackgroundProfile from "./BackgroundProfile";
function CustomDrawer(props) {
  const { logout } = useContext(AuthContext);

  const [userInfo, setUserInfo] = useState(null);

  const userInfoFromAsyncStorage = async () => {
    console.log(JSON.parse(await AsyncStorage.getItem("userInfo")))
    setUserInfo(JSON.parse(await AsyncStorage.getItem("userInfo")));
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     userInfoFromAsyncStorage();
  //   }, [userInfo])
  // );
  useEffect(() => {
    userInfoFromAsyncStorage();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: "#57e2de" }}
      >
        <BackgroundProfile>
          <ImageBackground style={{ padding: 20 }}>
            <Image
              style={{
                height: 80,
                width: 80,
                borderRadius: 40,
                marginBottom: 10,
              }}
              source={{
                uri: userInfo?.image,
              }}
            />
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                marginBottom: 5,
                fontFamily: FONTS.medium,
              }}
            >
              {userInfo?.fullname}
            </Text>
            <View>
              <Text
                style={{
                  color: "#fff",
                  marginRight: 5,
                  fontFamily: FONTS.regular,
                }}
              >
                {userInfo?.email}
              </Text>
            </View>
          </ImageBackground>
        </BackgroundProfile>
        <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: "#ccc" }}>
        <TouchableOpacity onPress={() => {}} style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="share-social-outline"
              size={22}
              color={COLORS.iconDefault}
            />
            <Text
              style={{
                fontSize: 15,
                marginLeft: 5,
                fontFamily: FONTS.regular,
              }}
            >
              Tell a Friend
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            logout();
          }}
          style={{ paddingVertical: 15 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="exit-outline"
              size={22}
              color={COLORS.iconDefault}
            />
            <Text
              style={{
                fontSize: 15,
                marginLeft: 5,
                fontFamily: FONTS.regular,
              }}
            >
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default CustomDrawer;
