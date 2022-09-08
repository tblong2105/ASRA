import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

import PreviewContract from "../screens/contract/Preview-Contract";
import MyWaitingContract from "../screens/manage/my-waiting-contracts/My-Waiting-Contract";
import BillContract from "../screens/contract/Bill-Contract";

const ManagementStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MyWaitingContract" component={MyWaitingContract} />
        <Stack.Screen name="PreviewContract" component={PreviewContract} />
        <Stack.Screen name="BillContract" component={BillContract} />
    </Stack.Navigator>
  );
};

export default ManagementStack;
