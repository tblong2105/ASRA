import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { COLORS, FONTS } from "../../constants";

function InputField({
  label,
  icon,
  inputType,
  keyboardType,
  fieldButtonLabel,
  fieldButtonFunction,
  value,
  onChangeText,
  onSubmitEditing,
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        paddingBottom: 8,
        marginBottom: 25,
      }}
    >
      {icon}
      {inputType == "password" ? (
        <TextInput
          placeholder={label}
          keyboardType={keyboardType}
          style={{ flex: 1, paddingVertical: 0 }}
          secureTextEntry={true}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
        />
      ) : (
        <TextInput
          placeholder={label}
          keyboardType={keyboardType}
          style={{ flex: 1, paddingVertical: 0 }}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
        />
      )}
      <TouchableOpacity onPress={fieldButtonFunction}>
        <Text style={{ color: COLORS.primary, fontFamily: FONTS.regular }}>
          {fieldButtonLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default InputField;
