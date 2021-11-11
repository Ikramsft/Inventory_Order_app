import { Platform, Alert } from "react-native";
import { Dimensions } from "react-native";

export const getDeviceWidth = () => {
  return Math.round(Dimensions.get("window").width);
};
export const getDeviceHeight = () => {
  return Math.round(Dimensions.get("window").height);
};

export const getPageLimit = () => {
  return 10;
};

export const isFieldEmpty = text => {
  if (text == "") {
    return true;
  }
  return false;
};

export const isValidEmail = email => {
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (reg.test(email) === true) {
    return true;
  }
  return false;
};

export const isValidPhoneNumber = phoneNo => {
  if (phoneNo.length < 8) {
    return false;
  }
  return true;
};

export const isValidComparedPassword = (password, confirmPassword) => {
  if (password == confirmPassword) {
    return true;
  }
  return false;
};

export const getOS = () => {
  if (Platform.OS === "ios") {
    return "ios";
  }
  return "android";
};



export const showAlertWithCallBack = (msg, onOkClick) => {
  Alert.alert(
    "",
    msg,
    [
      {
        text: "OK",
        onPress: () => {
          console.log(" CLICK CALLED ");
          onOkClick();
        }
      }
    ],
    {
      cancelable: false
    }
  );
};

export const objectLength = (obj) => {
  var result = 0;
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {

      result++;
    }
  }
  return result;
}

export const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}