import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

import MyRooms from "../screens/manage/my-rooms/MyRooms";
import PaymentMonthly from "../screens/manage/my-rooms/PaymentMonthly";

const MyRoomsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MyRooms" component={MyRooms} />
        <Stack.Screen name="PaymentMonthly" component={PaymentMonthly} />
    </Stack.Navigator>
  );
};

export default MyRoomsStack;
