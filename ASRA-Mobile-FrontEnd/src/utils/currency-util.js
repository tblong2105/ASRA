export const formatCurrencyOnCard = (value) => {
  let rentalPrice = (value / 1000000).toFixed(1);
  if (parseInt(rentalPrice.charAt(2)) === 0) {
    rentalPrice = rentalPrice.slice(0, 1);
  }

  return rentalPrice;
};

export const currencyViCode = (value) => {
  let currency = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

  return currency;
};

export const currencyViCodeNoIcon = (value) => {
  let currency = new Intl.NumberFormat("vi-VN").format(value);
  return currency;
};

export const formatMillionUnitCurrency = (num) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(1).replace(rx, "$1") + item.symbol
    : "0";
};
