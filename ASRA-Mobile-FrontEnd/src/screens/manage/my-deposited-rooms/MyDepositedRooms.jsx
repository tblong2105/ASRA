import React from "react";
import { SafeAreaView, View, Text } from "react-native";
import FocusedStatusBar from "../../../components/layout/focused-status-bar/FocusedStatusBar";
import { COLORS } from "../../../constants";

function MyDepositedRooms() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <FocusedStatusBar backgroundColor={COLORS.primary} />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text>My Deposited RoomsÏ Page</Text>
      </View>
    </SafeAreaView>
  );
}

export default MyDepositedRooms;
