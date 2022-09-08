
export function getCityList() {
  return fetch("https://provinces.open-api.vn/api/?depth=3").then((obj) => obj.json());
}

export function getDistrictList(cityId: any) {
  return fetch(`https://provinces.open-api.vn/api/p/${cityId}?depth=2`).then(
    (obj) => obj.json()
  );
}

export function getWardList(districtId: any) {
  return fetch(
    `https://provinces.open-api.vn/api/d/${districtId}?depth=2`
  ).then((obj) => obj.json());
}