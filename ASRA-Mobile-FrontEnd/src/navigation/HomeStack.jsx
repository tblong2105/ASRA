import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Search from "../screens/search/Search";
import RoomDetail from "../screens/room-detail/RoomDetail";

const Stack = createStackNavigator();

import TabNavigator from "./TabNavigator";
import TabNoticeNavigator from "./TabNoticeNavigator";
import PreviewContract from "../screens/contract/Preview-Contract";

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home1" component={TabNavigator} />
      <Stack.Screen name="HomeSearch" component={Search} />
      <Stack.Screen name="RoomDetail" component={RoomDetail} />
      <Stack.Screen name="Notification" component={TabNoticeNavigator} />
      <Stack.Screen name="PreviewContract" component={PreviewContract} />
    </Stack.Navigator>
  );
};

export default HomeStack;
