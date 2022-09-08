import { View, Text, TouchableOpacity } from "react-native";
import { COLORS, FONTS } from "../../constants";
function UtilityItem(props) {
  const { activeUtility, label, utility, iconActive, iconDefault, time } = props;
  return (
    <TouchableOpacity
      onPress={activeUtility}
      style={{
        width: "25%",
        marginVertical: 10,
        marginHorizontal: 2,
        paddingEnd: time && 4
      }}
    >
      <View style={{ alignItems: "center" }}>
        {utility ? iconActive : iconDefault}
      </View>
      <Text
        style={{
          textAlign: "center",
          fontSize: 11,
          fontFamily: FONTS.regular,
          color: utility ? COLORS.primary : COLORS.textDefault,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default UtilityItem;
