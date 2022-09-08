import React, { useContext } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { AuthContext } from "../components/permission/AuthProvider";

import AuthStack from "./AuthStack";
import AppStack from "./AppStack";
import Notification from "../components/notification/Notification";
function AppNav() {
  const { token, isLoading } = useContext(AuthContext);
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "transparent",
    },
  };

  const [loaded] = useFonts({
    InterBold: require("../assets/fonts/Inter-Bold.ttf"),
    InterSemiBold: require("../assets/fonts/Inter-SemiBold.ttf"),
    InterMedium: require("../assets/fonts/Inter-Medium.ttf"),
    InterRegular: require("../assets/fonts/Inter-Regular.ttf"),
    InterLight: require("../assets/fonts/Inter-Light.ttf"),
  });

  if (!loaded) return null;

  if (isLoading) {
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>;
  }

  return (
    <NavigationContainer theme={theme}>
      {token ? (
        <>
          <Notification />
          <AppStack />
        </>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}

export default AppNav;
