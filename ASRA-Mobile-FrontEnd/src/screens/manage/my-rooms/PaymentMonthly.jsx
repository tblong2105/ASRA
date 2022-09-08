import { SafeAreaView } from "react-native";
import WebView from "react-native-webview";
import { DOMAIN } from "../../../constants";

export default function PaymentMonthly(props) {
  const { navigation } = props;
  const navigatePaymentMonthly = (event) => {
    if (event.nativeEvent.data) {
      navigation.navigate("MyRooms", {
        paymentMonthly: true,
      });
      alert("PAYMENT SUCCESSFULLY!");
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <WebView
        source={{
          uri: `${DOMAIN.ONLINE}/payment/bill/native/${props.route.params.billId}`,
        }}
        scrollEnabled={false}
        onMessage={navigatePaymentMonthly}
      />
    </SafeAreaView>
  );
}
