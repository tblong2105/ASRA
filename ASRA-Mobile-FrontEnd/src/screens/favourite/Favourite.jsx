import React from "react";
import { SafeAreaView, View, Text } from "react-native";
import { COLORS, TABS } from "../../constants";

import FocusedStatusBar from "../../components/layout/focused-status-bar/FocusedStatusBar";
import Header from "../../components/layout/header/Header";

function Favourite() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <FocusedStatusBar backgroundColor={COLORS.primary} />
      <Header title={TABS.favourite} />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text>Favourite Page</Text>
      </View>
    </SafeAreaView>
  );
}

export default Favourite;
