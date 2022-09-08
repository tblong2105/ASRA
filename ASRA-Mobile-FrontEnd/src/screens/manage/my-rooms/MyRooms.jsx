import React, { useState, useCallback } from "react";
import { SafeAreaView, View, TouchableOpacity, FlatList } from "react-native";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";

import { getMyRoomsTenant } from "../../../api/room";
import { COLORS, TABS } from "../../../constants";

import NoDataSVG from "../../../assets/svg/no-data/no-data.svg";

import FocusedStatusBar from "../../../components/layout/focused-status-bar/FocusedStatusBar";
import RoomCard from "./RoomCard";
import Header from "../../../components/layout/header/Header";
import Loading from "../../../components/loading/Loading";

function MyRooms(props) {
  const { navigation } = props;
  const [myRoomsTenant, setMyRoomsTenant] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let dataReq = {
        id: "0",
        page: 1,
      };
      setLoading(true);
      getMyRoomsTenant(dataReq).then((res) => {
        let numArr = [];
        let originData = res?.rooms.reverse();
        res?.rooms
          .map((room) => room?.title)
          .filter((title, i, rooms) => {
            if (rooms.indexOf(title) !== i) {
              numArr.push(i);
            }
            return rooms.indexOf(title) !== i;
          });
        numArr?.map((i) => {
          if (i > -1) {
            originData.splice(i, 1);
          }
        });
        setMyRoomsTenant(originData);
        setLoading(false);
      });
    }, [])
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      <FocusedStatusBar backgroundColor={COLORS.primary} />
      <Header title={TABS.myRooms} navigation={navigation} />
      {loading ? (
        <Loading />
      ) : (
        <FlatList
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          data={myRoomsTenant}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("RoomDetail", {
                  roomId: item?.id,
                  roomDetailId: item?.roomDetailId,
                  roomStatus: true,
                })
              }
              style={{
                marginBottom: 6,
              }}
            >
              <RoomCard navigation={navigation} currentRoom={item}></RoomCard>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View
              style={{
                paddingVertical: 260,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <NoDataSVG height={80} width={80} />
            </View>
          }
          style={{ backgroundColor: COLORS.background, padding: 10 }}
        />
      )}
    </SafeAreaView>
  );
}

export default MyRooms;
