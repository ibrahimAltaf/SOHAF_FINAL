import AsyncStorage from "@react-native-async-storage/async-storage";

export const SET_USER_TOKEN = 'SET_USER_TOKEN';
export const SET_USER_DETAIL = 'SET_USER_DETAIL';
export const SET_USER_LOCATION = 'SET_USER_LOCATION';
export const SET_ORDER_DETAIL = 'SET_ORDER_DETAIL';
export const SET_CART_DATA = 'SET_CART_DATA';
export const SET_COUPON_DATA = 'SET_COUPON_DATA';
export const TOGGLE_THEME = 'TOGGLE_THEME';

export const toggleTheme = () => {
  return {
    type: TOGGLE_THEME,
  };
};
export const SetUserToken = (token) => {
  if (token===null) {
    AsyncStorage.removeItem("access_token");
  } else {
    AsyncStorage.setItem("access_token", token);
  };
  return async dispatch => {
    dispatch({
      type: SET_USER_TOKEN,
      payload: token,
    });
  };
};
export const SetUserDetail = (data) => {
  AsyncStorage.setItem("user_detail", JSON.stringify(data));
  return async dispatch => {
    dispatch({
      type: SET_USER_DETAIL,
      payload: data,
    });
  };
};
export const SetUserLocation = (data) => {
  AsyncStorage.setItem("user_location", JSON.stringify(data));
  return async dispatch => {
    dispatch({
      type: SET_USER_LOCATION,
      payload: data,
    });
  };
};
export const SetOrderDetail = (data) => {
  return async dispatch => {
    dispatch({
      type: SET_ORDER_DETAIL,
      payload: data,
    });
  };
};
export const SetCartData = (data, cartValue) => {
  return async dispatch => {
    dispatch({
      type: SET_CART_DATA,
      payload: data,
      cartValue: cartValue,
    });
  };
};
export const SetCouponData = (data) => {
  return async dispatch => {
    dispatch({
      type: SET_COUPON_DATA,
      payload: data,
    });
  };
};