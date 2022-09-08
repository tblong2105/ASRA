import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";

export const SLIDER_WIDTH = Dimensions.get("window").width + 80;

const CarouselCardItem = (props) => {
  const {
    route,
    setVisibleImagesGalleryFromComponentChild,
    itemWidth,
    height,
    item,
    index,
  } = props;

  const showImagesGallery = (imageSelectedIndex) => {
    setVisibleImagesGalleryFromComponentChild(imageSelectedIndex);
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
      borderRadius: 8,
      width: itemWidth,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.29,
      shadowRadius: 4.65,
      elevation: 7,
    },
    image: {
      width: itemWidth,
      height: height,
    },
  });

  return (
    <>
      {route?.name === "RoomDetail" ? (
        <TouchableOpacity onPress={() => showImagesGallery(index)}>
          <View style={styles.container} key={index}>
            <Image source={{ uri: item.uri }} style={styles.image} />
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.container} key={index}>
          <Image source={{ uri: item.uri }} style={styles.image} />
        </View>
      )}
    </>
  );
};

export default CarouselCardItem;
