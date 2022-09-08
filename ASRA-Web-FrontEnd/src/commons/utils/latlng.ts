import axios from "axios";
export async function getLatLongData(data: any){
    const address = data.streetName + ", " + data.ward + ", " + data.district + ", " + data.city
    let result;
    const options = {
      method: 'GET',
      url: 'https://google-maps-geocoding.p.rapidapi.com/geocode/json',
      params: { address: address, language: 'vi' },
      headers: {
        'X-RapidAPI-Key': 'ee24687714msh0be6dafcc87000fp13f6bejsn03f0e9ca88a5',
        'X-RapidAPI-Host': 'google-maps-geocoding.p.rapidapi.com'
      }
    };
  
   await axios.request(options).then(function (response) {
    result = response.data.results[0].geometry.location
    }).catch(function (error) {
      console.error(error);
    });
    
    return result
}