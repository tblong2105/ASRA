import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { COLORS, FONTS } from "../../constants";
function CustomButton({
  onPress,
  flex,
  label,
  color,
  backgroundColor,
  borderColor,
  borderWidth,
  icon,
  fontSize,
  paddingHorizontal,
  paddingVertical,
  marginLeft,
  marginRight,
  disabled = false,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: flex ? flex : "",
        backgroundColor: backgroundColor ? backgroundColor : COLORS.primary,
        paddingHorizontal: paddingHorizontal ? paddingHorizontal : 16,
        paddingVertical: paddingVertical ? paddingVertical : 14,
        borderRadius: 4,
        borderColor: borderColor ? borderColor : "",
        borderWidth: borderWidth ? borderWidth : "",
        marginLeft: marginLeft ? marginLeft : 0,
        marginRight: marginRight ? marginRight : 0,
        opacity: disabled ? 0.6 : 1
      }}
      disabled={disabled}
    >
      <Text
        style={{
          textAlign: "center",
          fontFamily: FONTS.bold,
          fontSize: fontSize ? fontSize : 16,
          color: color ? color : "#fff",
        }}
      >
        {icon} {label}
      </Text>
    </TouchableOpacity>
  );
}

export default CustomButton;
