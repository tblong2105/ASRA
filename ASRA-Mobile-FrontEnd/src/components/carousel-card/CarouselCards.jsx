import React from "react";
import { View } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import CarouselCardItem from "./CarouselCardItem";

import {
  SLIDER_WIDTH,
  ITEM_WIDTH_HOME,
  HEIGHT_HOME,
  ITEM_WIDTH_DETAIL,
  HEIGHT_DETAIL,
} from "../../constants";

const CarouselCards = (props) => {
  const { route, setVisibleImagesGalleryFromComponentChild, images } = props;
  const [index, setIndex] = React.useState(0);
  const isCarousel = React.useRef(null);

  return (
    <View>
      <Carousel
        ref={isCarousel}
        data={images}
        renderItem={({ item, index }) => (
          <CarouselCardItem
            route={route}
            setVisibleImagesGalleryFromComponentChild={
              setVisibleImagesGalleryFromComponentChild
            }
            itemWidth={
              route?.name === "RoomDetail" ? ITEM_WIDTH_DETAIL : ITEM_WIDTH_HOME
            }
            height={route?.name === "RoomDetail" ? HEIGHT_DETAIL : HEIGHT_HOME}
            item={item}
            index={index}
          />
        )}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={
          route?.name === "RoomDetail" ? ITEM_WIDTH_DETAIL : ITEM_WIDTH_HOME
        }
        onSnapToItem={(index) => setIndex(index)}
        useScrollView={false}
        autoplay={true}
        enableMomentum={false}
        lockScrollWhileSnapping={true}
        enableSnap={true}
        loop={true}
        autoplayDelay={3000}
        autoplayInterval={5000}
      />
      {route?.name === "Home" && (
        <Pagination
          carouselRef={isCarousel}
          dotsLength={images.length}
          activeDotIndex={index}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          tappableDots={true}
          dotStyle={{
            width: 8,
            height: 8,
            backgroundColor: "#fff",
          }}
          dotContainerStyle={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: "#aaa",
          }}
          containerStyle={{
            position: "absolute",
            top: route?.name === "RoomDetail" ? "76%" : "70%",
            left: "39%",
          }}
        />
      )}
    </View>
  );
};

export default CarouselCards;
