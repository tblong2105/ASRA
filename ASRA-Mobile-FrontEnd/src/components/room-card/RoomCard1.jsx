import React from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { COLORS, FONTS } from "../../constants";
import { splitString } from "../../utils/string-util";
import { formatCurrencyOnCard } from "../../utils/currency-util";

function RoomCard(props) {
  let { room, navigation } = props;
  return (
    <>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("RoomDetail", {
            roomId: room?.id,
          })
        }
        style={{
          flex: 1,
          flexWrap: "wrap",
          paddingVertical: 12,
        }}
        key={room?.id}
      >
        <View style={{ height: 120 }}>
          <View style={{ paddingHorizontal: 6 }}>
            <Image
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "stretch",
                borderRadius: 4,
              }}
              source={{
                uri: room?.thubnailImage,
              }}
            />
            <TouchableOpacity
              style={{ position: "absolute", top: 6, right: 12 }}
            >
              <FontAwesome5 name="heart" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            paddingStart: 10,
          }}
        >
          <Text
            numberOfLines={2}
            style={{
              fontSize: 13,
              fontFamily: FONTS.medium,
              color: COLORS.textDefault,
            }}
          >
            {room?.title}
          </Text>
          <Text
            style={{
              paddingVertical: 7,
              fontSize: 14,
              fontFamily: FONTS.bold,
              color: COLORS.primary,
            }}
          >
            {formatCurrencyOnCard(room?.rentalPrice)} tr/tháng -{" "}
            {room?.roomArea}
            <View style={{ position: "relative" }}>
              <Text
                style={{
                  position: "absolute",
                  top: -6.4,
                  right: -16,
                  fontSize: 14,
                  fontFamily: FONTS.bold,
                  color: COLORS.primary,
                }}
              >
                m
              </Text>
              <Text
                style={{
                  position: "absolute",
                  top: -8,
                  right: -23,
                  fontSize: 10,
                  fontFamily: FONTS.bold,
                  color: COLORS.primary,
                }}
              >
                2
              </Text>
            </View>
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 12,
              color: "#666",
              fontFamily: FONTS.light,
              color: COLORS.textDefault,
            }}
          >
            {splitString(room?.address, ",")[0]},
            {splitString(room?.address, ",")[1]},
            {splitString(room?.address, ",")[2]}
          </Text>
          <Text
            style={{
              paddingTop: 3,
              fontSize: 12,
              color: "#666",
              fontFamily: FONTS.light,
              color: COLORS.textDefault,
            }}
          >
            {splitString(room?.address, ",")[3].substring(2)}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              paddingTop: 8,
            }}
          >
            <Text
              style={{
                padding: 5,
                overflow: "hidden",
                fontSize: 10,
                backgroundColor: "#eaeaed",
                borderRadius: 4,
                fontFamily: FONTS.regular,
                color: COLORS.textDefault,
              }}
            >
              {room?.roomType}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
}

export default RoomCard;
