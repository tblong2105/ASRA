import { EXCHANGE_CURRENCE_API_KEY } from "commons/constants";
import { post, get } from "../commons/utils/axios";

export function getCurrenceConvert() {
  return fetch("https://free.currconv.com/api/v7/convert?q=USD_VND&compact=ultra&apiKey=5ae8c00f1320c9f745c1").then((obj) => obj.json());
}


  export function convertCurrence(){
    var myHeaders = new Headers();
    myHeaders.append("apikey", EXCHANGE_CURRENCE_API_KEY);
    var requestOptions:any = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders
    };
    
    return fetch(`https://api.apilayer.com/exchangerates_data/convert?to=VND&from=USD&amount=5`, requestOptions)
      .then(response => response.json())
    
  }