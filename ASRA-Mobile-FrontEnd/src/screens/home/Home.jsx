import React, { useState, useCallback, memo } from "react";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  FlatList,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { COLORS, TABS, FONTS } from "../../constants";
import { replaceStringShortcutAddress } from "../../utils/string-util";
import { daNangData } from "../../dummy/data";
import { suggestionRooms } from "../../api/room";

import FocusedStatusBar from "../../components/layout/focused-status-bar/FocusedStatusBar";
import Header from "../../components/layout/header/Header";
import RoomCardTwoCol from "../../components/room-card/RoomCardTwoCol";
import CarouselCards from "../../components/carousel-card/CarouselCards";
import SearchTrendItem from "./SearchTrendItem";
import Loading from "../../components/loading/Loading";
const images = [
  {
    uri: "https://tromoi.com/uploads/members/hiephoang/thang%208/24_08/giao-dien-tro-moi.png",
  },
  {
    uri: "https://tromoi.com/uploads/members/bibeobot/10%20luu%20y%20cho%20tan%20sinh%20vien%20khi%20di%20thue%20tro/10%20LUU%20Y%20CHO%20TAN%20SINH%20VIEN%20KHI%20THUE%20TR%E1%BB%8C.png",
  },
  {
    uri: "https://tromoi.com/uploads/static/C%E1%BA%A9m%20Ly/thang%2011/Tr%E1%BB%8D%20m%E1%BB%9Bi%20(1200628).png",
  },
];

function Home(props) {
  const { navigation, route } = props;
  const [rooms, setRooms] = useState(null);
  const [searchTrendData, setSearchTrendData] = useState(daNangData);
  const [searchTrendLoading, setSearchTrendLoading] = useState(false);
  const [suggestionRoomLoading, setSuggestionRoomLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setSuggestionRoomLoading(true);
      suggestionRooms().then((res) => {
        let originRoomData = res?.rooms.map((room) => {
          return {
            ...room,
            address: replaceStringShortcutAddress(room?.address),
          };
        });
        setRooms(originRoomData);
        setSuggestionRoomLoading(false);
      });
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <FocusedStatusBar backgroundColor={COLORS.primary} />

      {!searchTrendLoading && !suggestionRoomLoading ? (
        <>
          <Header title={TABS.home} navigation={navigation} />
          <FlatList
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
            numColumns={2}
            data={rooms}
            renderItem={({ item }) => (
              <RoomCardTwoCol room={item} navigation={navigation} />
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            bounces={false}
            scrollEventThrottle={16}
            ListHeaderComponent={
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CarouselCards route={route} images={images} />
                </View>
                <View
                  style={{
                    marginTop: 16,
                    height: 260,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      padding: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        flexDirection: "column",
                        alignSelf: "flex-end",
                        fontFamily: FONTS.medium,
                        color: COLORS.textDefault,
                      }}
                    >
                      Search trends
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FlatList
                      maxToRenderPerBatch={10}
                      updateCellsBatchingPeriod={50}
                      numColumns={3}
                      data={searchTrendData}
                      renderItem={({ item }) => (
                        <SearchTrendItem navigation={navigation} item={item} />
                      )}
                      keyExtractor={(item) => item.id}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 16,
                    paddingHorizontal: 4,
                    paddingBottom: 2,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      flexDirection: "column",
                      alignSelf: "flex-end",
                      fontFamily: FONTS.medium,
                      color: COLORS.textDefault,
                    }}
                  >
                    Suggestions
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("HomeSearch", {
                        homeSearch: true,
                        address: "",
                      })
                    }
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontFamily: FONTS.regular,
                        color: "#1890ff",
                      }}
                    >
                      Find and filter
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            }
            ListHeaderComponentStyle={{
              marginTop: 2,
            }}
            style={{
              paddingHorizontal: 16,
            }}
          />
        </>
      ) : (
        <Loading />
      )}
    </SafeAreaView>
  );
}

export default memo(Home);
