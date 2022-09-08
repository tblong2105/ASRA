export const maskCurrency = (value:any, maxLength = 12, radix = ",") => {
    const currencyRegExp = new RegExp(
      `(\\d{1,${maxLength - 3}})(,)?(\\d{2})`,
      "g"
    );
    return value.replace(currencyRegExp, (match:any, p1:any, p2:any, p3:any) =>
      [p1, p3].join(radix)
    );
  };
  
export const currencyViCode = (value: number) => {

  let currency = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
  
  return currency.replace(/.$/, "VND");
}

export const currencyViCodeForPriceSlider = (value: number) => {
  let currency = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

  return currency;
};


export const formatCurrencyOnCard = (value: any) => {

  let rentalPrice = (value / 1000000).toFixed(1);
  if (parseInt(rentalPrice.charAt(2)) === 0) {
    rentalPrice = rentalPrice.slice(0, 1);
  }

  if(rentalPrice.length === 1){
    rentalPrice += ".0"
  }

  return rentalPrice;
}