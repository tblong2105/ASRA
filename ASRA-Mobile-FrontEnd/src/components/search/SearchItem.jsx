import React, { memo } from "react";
import { TouchableOpacity, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { FONTS } from "../../constants";

function SearchItem(props) {
  const { searchRoomsByAddress, id, item } = props;
  return (
    <TouchableOpacity
      onPress={searchRoomsByAddress}
      style={{
        padding: 8,
      }}
      key={id}
    >
      <Text style={{ fontFamily: FONTS.regular }} numberOfLines={1}>
        <Ionicons name="location-outline" size={20} color="#555" /> {` ${item}`}
      </Text>
    </TouchableOpacity>
  );
}

export default memo(SearchItem);
