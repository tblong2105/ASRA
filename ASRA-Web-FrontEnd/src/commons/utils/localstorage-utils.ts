import { getRoomType } from "api/room";
import locationjson from "../../helpers/location/location.json";
import { LOCALTION } from "../constants/LocalstorageConstant";

export function initLocation() {
  let location:string[] = [];

  if(!localStorage.getItem(LOCALTION || "[]")){
    locationjson.map((city: any) => {
          city.districts.map((district: any) => {
            district.wards.map((ward: any) => {

              if(!location.includes(city.name)){
                location.push(city.name)
              }
              if(!location.includes(district.name + ", " + city.name)){
                location.push(district.name + ", " + city.name)
              }
              location.push(ward.name + ", " + district.name + ", " + city.name)
            });
          });
        });

        localStorage.setItem(LOCALTION, JSON.stringify(location));
  }


  // let cities: any = [];
  // let districts: any = [];
  // let wards: any = [];

  // cities = JSON.parse(localStorage.getItem("cities") || "[]");
  // districts = JSON.parse(localStorage.getItem("districts") || "[]");
  // wards = JSON.parse(localStorage.getItem("wards") || "[]");

  // if (cities.length === 0 || districts.length === 0 || wards.length === 0) {
  //   location.map((city: any) => {
  //     cities.push(city.name);
  //     city.districts.map((district: any) => {
  //       districts.push(district.name);
  //       district.wards.map((ward: any) => {
  //         wards.push(ward.name);
  //       });
  //     });
  //   });
  //   localStorage.setItem("cities", JSON.stringify(cities));
  //   localStorage.setItem("districts", JSON.stringify(districts));
  //   localStorage.setItem("wards", JSON.stringify(wards));
  // }
}


// export function removeLocation(){
//   localStorage.removeItem("cities")
//   localStorage.removeItem("districts")
//   localStorage.removeItem("wards")
// }

export function initLocalStorage(){

  initLocation()
  getRoomType()
}