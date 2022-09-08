import { useState, useCallback } from "react";
import { SafeAreaView, View, FlatList, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { getWaitingContract } from "../../../api/contract";
import { COLORS, TABS } from "../../../constants";
import NoDataSVG from "../../../assets/svg/no-data/no-data.svg";

import FocusedStatusBar from "../../../components/layout/focused-status-bar/FocusedStatusBar";
import Header from "../../../components/layout/header/Header";
import Loading from "../../../components/loading/Loading";
import Contract from "./Contract";

export default function MyWaitingContract(props) {
  const { navigation, route } = props;
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getWaitingContract(1).then((res) => {
        setContracts(res.contractVOs);
        setLoading(false);
      });
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <FocusedStatusBar backgroundColor={COLORS.primary} />

      <Header title={TABS.myWaitingContract} navigation={navigation} />
      {loading ? (
        <Loading />
      ) : (
        <FlatList
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          data={contracts}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("PreviewContract", { contractId: item.id })
              }
              style={{
                marginBottom: 6,
              }}
            >
              <Contract contract={item}></Contract>
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
          style={{
            backgroundColor: COLORS.background,
            paddingTop: 10,
            paddingHorizontal: 16,
          }}
        />
      )}
    </SafeAreaView>
  );
}
