import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import DatePicker from "react-native-date-picker";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import { COLORS, FONTS } from "../../constants";

import LogoSVG from "../../assets/svg/logo/asra-logo.svg";
import GoogleSVG from "../../assets/svg/social/google.svg";
import FacebookSVG from "../../assets/svg/social/facebook.svg";
import TwitterSVG from "../../assets/svg/social/twitter.svg";
import CustomButton from "../../components/custom/Button";
import InputField from "../../components/custom/InputField";

const RegisterScreen = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [dobLabel, setDobLabel] = useState("Date of Birth");

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: COLORS.background,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 25 }}
      >
        <View style={{ padding: 48, alignItems: "center" }}>
          <LogoSVG height={200} width={200} />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => {}}
            style={{
              borderColor: "#ddd",
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}
          >
            <GoogleSVG height={24} width={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              borderColor: "#ddd",
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}
          >
            <FacebookSVG height={24} width={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              borderColor: "#ddd",
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}
          >
            <TwitterSVG height={24} width={24} />
          </TouchableOpacity>
        </View>

        <Text
          style={{
            textAlign: "center",
            color: "#666",
            marginVertical: 30,
            fontFamily: FONTS.light,
          }}
        >
          Or, register with email ...
        </Text>

        <InputField
          label={"Full Name"}
          icon={
            <Ionicons
              name="person-outline"
              size={20}
              color={COLORS.iconDefault}
              style={{ marginRight: 5 }}
            />
          }
        />

        <InputField
          label={"Email ID"}
          icon={
            <MaterialIcons
              name="alternate-email"
              size={20}
              color={COLORS.iconDefault}
              style={{ marginRight: 5 }}
            />
          }
          keyboardType="email-address"
        />

        <InputField
          label={"Password"}
          icon={
            <Ionicons
              name="ios-lock-closed-outline"
              size={20}
              color={COLORS.iconDefault}
              style={{ marginRight: 5 }}
            />
          }
          inputType="password"
        />

        <InputField
          label={"Confirm Password"}
          icon={
            <Ionicons
              name="ios-lock-closed-outline"
              size={20}
              color={COLORS.iconDefault}
              style={{ marginRight: 5 }}
            />
          }
          inputType="password"
        />

        <View
          style={{
            flexDirection: "row",
            borderBottomColor: "#ccc",
            borderBottomWidth: 1,
            paddingBottom: 8,
            marginBottom: 30,
          }}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color="#666"
            style={{ marginRight: 5 }}
          />
          <TouchableOpacity onPress={() => setOpen(true)}>
            <Text
              style={{
                color: "#666",
                marginLeft: 5,
                marginTop: 5,
                fontFamily: FONTS.regular,
              }}
            >
              {dobLabel}
            </Text>
          </TouchableOpacity>
        </View>

        <DatePicker
          modal
          open={open}
          date={date}
          mode={"date"}
          maximumDate={new Date("2005-01-01")}
          minimumDate={new Date("1980-01-01")}
          onConfirm={(date) => {
            setOpen(false);
            setDate(date);
            setDobLabel(date.toDateString());
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />

        <CustomButton label={"Register"} onPress={() => {}} />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 30,
          }}
        >
          <Text style={{ fontFamily: FONTS.regular }}>Already registered?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: COLORS.primary, fontFamily: FONTS.medium }}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
