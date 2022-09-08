import { View, ActivityIndicator } from "react-native";
import { COLORS } from "../../constants";
function Loading() {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size={24} color={COLORS.iconDefault} />
    </View>
  );
}

export default Loading;
