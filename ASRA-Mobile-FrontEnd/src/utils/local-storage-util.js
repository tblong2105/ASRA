import AsyncStorage from "@react-native-async-storage/async-storage";
import locationJSON from "../dummy/location.json";
import { LOCATION } from "../constants";

export const initLocation = async () => {
  let location = [];
  let locationData = await AsyncStorage.getItem(LOCATION);
  if (!locationData) {
    locationJSON.map((city) => {
      city.districts.map((district) => {
        district.wards.map((ward) => {
          if (!location.includes(city.name)) {
            location.push(city.name);
          }
          if (!location.includes(district.name + ", " + city.name)) {
            location.push(district.name + ", " + city.name);
          }
          location.push(ward.name + ", " + district.name + ", " + city.name);
        });
      });
    });
    await AsyncStorage.setItem(LOCATION, JSON.stringify(location));
  }
};
