import React, { createContext, useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../../api/auth";
import { SocketContext } from "../../app/socket";
export const AuthContext = createContext();

function AuthProvider({ children }) {
  const socket = useContext(SocketContext);
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const signIn = (data) => {
    setIsLoading(true);
    login(data)
      .then((res) => {
        let userInfo = res;
        setUserInfo(userInfo);
        setToken(userInfo?.token);
        AsyncStorage.setItem("ASRA", userInfo?.token);
        AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
        socket.emit("addNewUser", userInfo?.username);
      })
      .catch(() => {});
    setIsLoading(false);
  };

  const logout = () => {
    setIsLoading(true);
    setToken(null);
    AsyncStorage.removeItem("ASRA");
    AsyncStorage.removeItem("userInfo");
    socket?.emit("removeUser")
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userInfo = await AsyncStorage.getItem("userInfo");
      let token = await AsyncStorage.getItem("ASRA");
      userInfo = JSON.parse(userInfo);

      if (userInfo) {
        setUserInfo(userInfo);
        setToken(token);
      }
    

      setIsLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{ signIn, logout, userInfo, token, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
