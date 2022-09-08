import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Ionicons from "react-native-vector-icons/Ionicons";

import CustomDrawer from "../components/custom/Drawer";
import MyRoomsForRent from "../screens/manage/my-rooms-for-rent/MyRoomsForRent";
import MyDepositedRooms from "../screens/manage/my-rooms-for-rent/MyRoomsForRent";
import HomeStack from "./HomeStack";

import { COLORS } from "../constants";
import ManagementStack from "./ManagementStack";
import MyRoomsStack from "./MyRoomsStack";

const Drawer = createDrawerNavigator();

const AppStack = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home1"
      useLegacyImplementation={true}
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: COLORS.primary,
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#333",
        drawerLabelStyle: {
          marginLeft: -25,
          fontSize: 15,
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeStack}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="My Rooms"
        component={MyRoomsStack}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="My Rooms For rent"
        component={MyRoomsForRent}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="My Deposited Room"
        component={MyDepositedRooms}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="send-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="My Waiting Contract"
        component={ManagementStack}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="document-text-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default AppStack;
