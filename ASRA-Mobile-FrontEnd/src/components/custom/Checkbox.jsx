import { TouchableOpacity, View, Text } from "react-native";
import Checkbox from "expo-checkbox";
import { COLORS, FONTS } from "../../constants";
function CheckboxCustom(props) {
  const { onValueChange, label, value, m2, roomType, isActiveText } = props;

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: (roomType || m2) && "46%",
        marginEnd: (roomType || m2) && 20,
      }}
      onPress={onValueChange}
    >
      {m2 ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontFamily: FONTS.regular,
              color: isActiveText ? COLORS.primary : COLORS.textDefault,
            }}
          >
            {label}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: FONTS.regular,
              color: isActiveText ? COLORS.primary : COLORS.textDefault,
            }}
          >
            {" m"}
          </Text>
          <Text
            style={{
              position: "absolute",
              top: -1,
              right: -5,
              fontSize: 9,
              fontFamily: FONTS.regular,
              color: isActiveText ? COLORS.primary : COLORS.textDefault,
            }}
          >
            {"2"}
          </Text>
        </View>
      ) : (
        <Text
          style={{
            fontSize: 12,
            fontFamily: FONTS.regular,
            color: isActiveText ? COLORS.primary : COLORS.textDefault,
          }}
        >
          {label}
        </Text>
      )}
      <Checkbox
        style={{
          marginVertical: 8,
          marginStart: m2 ? 52 : 32,
          width: 16,
          height: 16,
        }}
        color={COLORS.primary}
        value={value}
        onValueChange={onValueChange}
      />
    </TouchableOpacity>
  );
}

export default CheckboxCustom;
