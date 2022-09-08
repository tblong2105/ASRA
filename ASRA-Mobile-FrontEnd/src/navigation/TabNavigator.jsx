import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { COLORS } from "../constants";

import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Home from "../screens/home/Home";
import Search from "../screens/search/Search";
import Favourite from "../screens/favourite/Favourite";
import Profile from "../screens/profile/Profile";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: { backgroundColor: "#fff" },
        tabBarInactiveTintColor: "#666",
        tabBarActiveTintColor: COLORS.primary,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={({ route }) => ({
          tabBarStyle: {
            display: getTabBarVisibility(route),
            backgroundColor: "#fff",
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        })}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarBadgeStyle: { backgroundColor: "red" },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Saved"
        component={Favourite}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="heart" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" color={color} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const getTabBarVisibility = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Feed";

  if (routeName == "GameDetails") {
    return "none";
  }
  return "flex";
};

export default TabNavigator;
