import { SafeAreaView } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { TABS, COLORS } from "../constants";

import FocusedStatusBar from "../components/layout/focused-status-bar/FocusedStatusBar";
import Header from "../components/layout/header/Header";
import Notification from "../screens/notification/Notification";
import NotificationUnread from "../screens/notification/NotificationUnread";
const Tab = createMaterialTopTabNavigator();
function TabNoticeNavigator(props) {
  const { navigation } = props;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <FocusedStatusBar backgroundColor={COLORS.primary} />
      <Header title={TABS.notification} navigation={navigation} />
      <Tab.Navigator
        tabBarOptions={{
          style: {
            backgroundColor: COLORS.background,
          },
        }}
      >
        <Tab.Screen name="All" component={Notification} />
        <Tab.Screen name="Unread" component={NotificationUnread} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
export default TabNoticeNavigator;
