import React from "react";
import { SafeAreaView, View, Text } from "react-native";
import FocusedStatusBar from "../../components/layout/focused-status-bar/FocusedStatusBar";
import { COLORS, TABS } from "../../constants";

import Header from "../../components/layout/header/Header";
import Test from "./Test";
function Profile(props) {
  const { navigation } = props;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <FocusedStatusBar backgroundColor={COLORS.primary} />
      <Header title={TABS.profile} />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        {/* <Test navigation={navigation} /> */}
        <Text>Profile Page</Text>
      </View>
    </SafeAreaView>
  );
}

export default Profile;
