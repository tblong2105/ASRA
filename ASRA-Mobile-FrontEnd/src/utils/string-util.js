export const splitString = (string, character) => {
  return string.split(character);
};

export const sliceStringLength = (string, length) => {
  if(string.length > length){
    return string.slice(0, length) + "...";
  }else{
    return string
  }
};

export const replaceString = (value) => {
  let result = "";
  switch (true) {
    case value.includes("Tỉnh"):
      result = value.replace(/Tỉnh/g, "");
      break;
    case value.includes("Thành phố"):
      result = value.replace(/Thành phố/g, "");
      break;
    case value.includes("Thành Phố"):
      result = value.replace(/Thành Phố/g, "");
      break;
    case value.includes("Quận"):
      result = value.replace(/Quận/g, "");
      break;
    case value.includes("Huyện"):
      result = value.replace(/Huyện/g, "");
      break;
    case value.includes("Xã"):
      result = value.replace(/Xã/g, "");
      break;
    case value.includes("Phường"):
      result = value.replace(/Phường/g, "");
      break;
    case value.includes("Thị trấn"):
      result = value.replace(/Thị trấn/g, "");
      break;
    case value.includes("Thị xã"):
      result = value.replace(/Thị xã/g, "");
      break;
    default:
      break;
  }
  return result;
};

export const replaceStringShortcutAddress = (value) => {
  let result = "";
  result = value
    .replace(/Tỉnh/g, "")
    .replace(/Thành phố/g, "")
    .replace(/Thành Phố/g, "")
    .replace(/Quận/g, "")
    .replace(/Huyện/g, "")
    .replace(/Xã/g, "")
    .replace(/Phường/g, "")
    .replace(/Thị trấn/g, "")
    .replace(/Thị xã/g, "");
  return result;
};
