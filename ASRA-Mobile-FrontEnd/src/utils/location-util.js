import location from "../dummy/location.json";

export function getCities() {
  let cities = location.map((city) => {
    return city;
  });

  return cities;
}

export function getDistricts(cityName) {
  if (!cityName) {
    return [];
  }
  let city = location.filter((city) => {
    return city.name === cityName;
  });
  let districts = city[0].districts;
  return districts;
}

export function getWards(cityName, districtName) {
  if (!cityName || !districtName) {
    return [];
  }

  let cities = location.filter((city) => city.name === cityName);

  let districts = cities[0].districts.filter(
    (district) => district.name === districtName
  );

  let wards = districts[0].wards;

  return wards;
}
