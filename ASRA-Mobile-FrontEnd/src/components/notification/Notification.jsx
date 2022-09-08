import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { SocketContext } from "../../app/socket";
import { NOTIFICATION_TYPE } from "../../constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const socket = useContext(SocketContext);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const getNotification = useCallback(async (data) => {
    let userInfo = JSON.parse(await AsyncStorage.getItem("userInfo"));
    if (userInfo?.username !== data?.senderName) {
      await schedulePushNotification(data);
    }
  }, []);

  const addNewUserSocketServer = async () => {
    let userInfo = JSON.parse(await AsyncStorage.getItem("userInfo"));
    socket.emit("addNewUser", userInfo?.username);
  };

  useEffect(() => {
    addNewUserSocketServer();
    socket.on("getNotification", getNotification);

    return () => {
      socket.off("getNotification", getNotification);
    };
  }, [socket, getNotification]);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        let notificationData = response?.notification?.request?.content?.data;
        console.log("Data: ", notificationData);
        if (notificationData?.contractId) {
          navigation.navigate("PreviewContract", {
            contractId: notificationData?.contractId,
          });
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return <></>;
}

const notificationType = (data) => {
  let type = "";
  switch (true) {
    case data?.type === NOTIFICATION_TYPE.DEPOSIT:
      type = "Deposit";
      break;
    case data?.type === NOTIFICATION_TYPE.BECOME_INNKEEPER ||
      data?.type === NOTIFICATION_TYPE.ACCEPT_OR_REJECT:
      type = "Become Innkeeper";
      break;
    case data?.type === NOTIFICATION_TYPE.CREATE_CONTRACT:
      type = "Create Contract";
      break;
    case data?.type === NOTIFICATION_TYPE.SIGN_CONTRACT:
      type = "Sign Contract";
      break;
    default:
      break;
  }
  return type;
};

async function schedulePushNotification(data) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `ASRA - ${notificationType()} 📬`,
      body: `${data?.senderName} ${data?.message}`,
      data: { contractId: data?.contractId ? data?.contractId : null },
      sound: "../../assets/sound/notification-sound.wav",
    },
    trigger: { seconds: 2 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}
