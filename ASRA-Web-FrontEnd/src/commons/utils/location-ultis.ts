import location from "../../helpers/location/location.json";

export function getCities() {
  let cities = location.map((city: any) => {
    return city;
  });

  return cities;
}

export function getDistricts(cityName: any) {
  if(!cityName){
    return []
  }
  let city = location.filter((city: any) => {
    return city.name === cityName;
  });
  let districts = city[0].districts;
  return districts;
}

export function getWards(cityName: any, districtName: any) {

  if(!cityName || !districtName){
    return []
  }

  let cities = location.filter((city: any) => city.name === cityName);

  let districts = cities[0].districts.filter(
    (district: any) => district.name === districtName
  );

  let wards = districts[0].wards;

  return wards;
}
