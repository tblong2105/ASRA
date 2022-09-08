import React, { useEffect, useCallback } from "react";
import { LogBox } from "react-native";
import AppNav from "./src/navigation/AppNav";
import AuthProvider from "./src/components/permission/AuthProvider";
import { NativeBaseProvider, extendTheme } from "native-base";
import { initLocation } from "./src/utils/local-storage-util";
import { COLORS } from "./src/constants";
import { SocketContext, socket } from "./src/app/socket";

//Ignore all log notifications
LogBox.ignoreAllLogs();

function App() {
  const theme = extendTheme({
    colors: {
      primary: {
        900: COLORS.primary,
      },
    },
  });

  useEffect(() => {
    initLocation();
  }, []);

  return (
    <NativeBaseProvider theme={theme}>
      <SocketContext.Provider value={socket}>
        <AuthProvider>
          <AppNav />
        </AuthProvider>
      </SocketContext.Provider>
    </NativeBaseProvider>
  );
}

export default App;
