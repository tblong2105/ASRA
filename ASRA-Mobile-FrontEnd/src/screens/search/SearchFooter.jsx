import { View } from "react-native";
import CustomButton from "../../components/custom/Button";
import { COLORS } from "../../constants";

function SearchFooter(props) {
  const { searchFilterRoom, resetFilterSearchRoom } = props;
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <CustomButton
        flex={1}
        label="Reset"
        color={COLORS.textDefault}
        backgroundColor="#fff"
        borderColor="#333"
        borderWidth={1}
        fontSize={14}
        paddingVertical={8}
        onPress={resetFilterSearchRoom}
      />
      <View style={{ flex: 0.1 }}></View>
      <CustomButton
        flex={1}
        label="Apply"
        onPress={searchFilterRoom}
        borderColor={COLORS.primary}
        borderWidth={1}
        fontSize={14}
        paddingVertical={8}
      />
    </View>
  );
}

export default SearchFooter;
