import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import * as Location from "expo-location";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import { COLORS, FONTS } from "../../constants";
import { AuthContext } from "../../components/permission/AuthProvider";

import LogoSVG from "../../assets/svg/logo/asra-logo.svg";
import GoogleSVG from "../../assets/svg/social/google.svg";
import FacebookSVG from "../../assets/svg/social/facebook.svg";
import TwitterSVG from "../../assets/svg/social/twitter.svg";

import CustomButton from "../../components/custom/Button";
import InputField from "../../components/custom/InputField";

const Login = ({ navigation }) => {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const login = () => {
    let dataReq = {
      username: email,
      password: password,
    };
    signIn(dataReq);
  };

  useEffect(() => {}, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: COLORS.background,
      }}
    >
      <View style={{ paddingHorizontal: 24 }}>
        <View style={{ padding: 48, alignItems: "center" }}>
          <LogoSVG height={200} width={200} />
        </View>

        <InputField
          label={"Email ID"}
          icon={
            <MaterialIcons
              name="alternate-email"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          keyboardType="email-address"
          value={email}
          onChangeText={(email) => setEmail(email)}
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
          fieldButtonLabel={"Forgot?"}
          fieldButtonFunction={() => {}}
          value={password}
          onChangeText={(password) => setPassword(password)}
        />

        <CustomButton label="Login" onPress={login} />

        <Text
          style={{
            textAlign: "center",
            color: "#666",
            marginVertical: 30,
            fontFamily: FONTS.light,
          }}
        >
          Or, login with ...
        </Text>

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

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 30,
          }}
        >
          <Text style={{ fontFamily: FONTS.regular }}>New to the app?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={{ color: COLORS.primary, fontFamily: FONTS.medium }}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
