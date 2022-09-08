import React from "react";
import { Image, SafeAreaView, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";

import Ionicons from "react-native-vector-icons/Ionicons";

import { FONTS, COLORS } from "../../../constants";
import { formatCurrencyOnCard } from "../../../utils/currency-util";
import { DOMAIN } from "../../../constants";

import CustomButton from "../../../components/custom/Button";

export default function RoomCard(props) {
  const { navigation } = props;
  const currentRoom = props.currentRoom;

  const paymentMonthly = async () => {
    await WebBrowser.openBrowserAsync(
      `${DOMAIN.ONLINE}/payment/bill/native/${currentRoom.billId}`
    );
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View
        style={{
          height: 112,
          flexDirection: "row",
          alignItems: "center",
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 4,
        }}
      >
        <View
          style={{
            width: 90,
            height: 98,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginStart: 4,
            borderRadius: 4,
          }}
        >
          <Image
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "stretch",
              borderRadius: 4,
            }}
            source={{
              uri: currentRoom?.thubnailImage,
            }}
          />
        </View>
        <View
          style={{
            marginStart: 8,
            marginTop: 4,
            width: 240,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              marginTop: 2,
              fontSize: 13,
              fontFamily: FONTS?.bold,
            }}
          >
            {currentRoom?.title}
          </Text>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <View
              style={{
                width: 187,
              }}
            >
              <Text
                numberOfLines={2}
                style={{
                  fontSize: 12,
                  marginTop: 4,
                  lineHeight: 16,
                }}
              >
                {currentRoom?.address}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 6,
                }}
              >
                <View
                  style={{
                    width: 98,
                    maxWidth: 96,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Ionicons
                      size={16}
                      color={COLORS.primary}
                      name="home-outline"
                    ></Ionicons>
                    <Text style={{ fontSize: 12, marginTop: 2, marginLeft: 2 }}>
                      {currentRoom?.roomType}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", marginTop: 6 }}>
                    <Ionicons
                      size={16}
                      color={COLORS.primary}
                      name="expand-outline"
                    ></Ionicons>
                    <Text style={{ fontSize: 12, marginTop: 2, marginLeft: 2 }}>
                      {currentRoom?.roomArea}m²
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    marginRight: 20,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Ionicons
                      size={16}
                      color={COLORS.primary}
                      name="calendar-outline"
                    ></Ionicons>
                    <Text style={{ fontSize: 12, marginTop: 2, marginLeft: 2 }}>
                      {currentRoom?.paymentDate}-{new Date().getMonth() - 1}-
                      {new Date().getFullYear()}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", marginTop: 6 }}>
                    <Ionicons
                      size={16}
                      color={COLORS.primary}
                      name="clipboard-outline"
                    ></Ionicons>
                    <Text style={{ fontSize: 12, marginTop: 2, marginLeft: 2 }}>
                      {currentRoom?.paymentStatus === "WAITING_CREATE_BILL"
                        ? "Not created"
                        : currentRoom?.paymentStatus}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                width: 66,
                display: "flex",
                alignItems: "center",
                marginLeft: 10,
              }}
            >
              <Text
                style={{
                  color: COLORS.primary,
                  fontSize: 32,
                  fontWeight: "bold",
                  lineHeight: 42,
                }}
              >
                {formatCurrencyOnCard(currentRoom?.rentalPrice)}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: COLORS.primary,
                  lineHeight: 12,
                  marginTop: -6,
                  marginBottom: 2,
                }}
              >
                Milions
              </Text>
              <CustomButton
                disabled={currentRoom?.paymentStatus !== "NOT_YET"}
                label={"Payment"}
                fontSize={11}
                paddingVertical={8}
                paddingHorizontal={8}
                onPress={paymentMonthly}
              ></CustomButton>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
