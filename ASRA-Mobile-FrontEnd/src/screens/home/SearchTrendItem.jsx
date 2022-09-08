import React, { memo } from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { FONTS } from "../../constants";

function SearchTrendItem(props) {
  const { navigation, item } = props;
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("HomeSearch", {
          homeSearch: true,
          address: item?.address,
        })
      }
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 8,
      }}
      key={item?.id}
    >
      <ImageBackground
        style={{
          height: 105,
          width: 105,
          borderRadius: 6,
        }}
        source={{ uri: item?.imgUrl }}
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0, 0.8)"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 50,
          }}
        />
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 76,
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.medium,
              fontSize: 12,
              color: "#fff",
            }}
          >
            {item?.title}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

export default memo(SearchTrendItem);
