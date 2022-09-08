import React from "react";
import { Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedHeader = (props) => {
  const { isBackgroundHeader, animatedValue, children } = props;
  const insets = useSafeAreaInsets();
  const backgroundHeader = animatedValue.interpolate({
    inputRange: [0, 140],
    outputRange: ["transparent", "#fff"],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={{
        position: "absolute",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: insets.top,
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        elevation: 1000,
        height: 100,
        backgroundColor: "#fafafa",
        borderBottomColor: isBackgroundHeader && "#ddd",
        borderBottomWidth: isBackgroundHeader && 1,
        backgroundColor: backgroundHeader,
      }}
    >
      {children}
    </Animated.View>
  );
};

export default AnimatedHeader;
