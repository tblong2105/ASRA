import { SafeAreaView, View } from "react-native";
import WebView from "react-native-webview";
import { DOMAIN } from "../../constants";
export default function BillContract(props) {
  const { navigation, route } = props;

  const navigateContract = (event) => {
    if (event.nativeEvent.data) {
      navigation.navigate("PreviewContract", {
        tenantSignature: true,
      });
      alert("Signature contract successfully");
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        source={{
          uri: `${DOMAIN.ONLINE}/payment/bill/native/${route.params.billId}?tenantSignUrl=${route.params.tenantSignatureUrl}`,
        }}
        scrollEnabled={false}
        onMessage={navigateContract}
      />
    </SafeAreaView>
  );
}
