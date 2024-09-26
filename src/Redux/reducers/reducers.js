import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    SET_USER_DETAIL,
    SET_USER_TOKEN,
    SET_CART_DATA,
    SET_USER_LOCATION,
    SET_ORDER_DETAIL,
    SET_COUPON_DATA
} from "../actions/actions";
    
const initialState = {
    access_token: null,
    user_detail: {},
    user_location: {},
    cart_data: [],
    order_detail: {},
    coupon_detail: {},
};
    
function userReducer(state = initialState, action) {
    switch (action.type) {
        case SET_USER_TOKEN:
            return {
                ...state,
                access_token: action.payload,
            };
        case SET_USER_DETAIL:
            return {
                ...state,
                user_detail: action.payload,
            };
        case SET_USER_LOCATION:
            return {
                ...state,
                user_location: action.payload,
            };
        case SET_ORDER_DETAIL:
            return {
                ...state,
                order_detail: action.payload,
            };
        case SET_COUPON_DATA:
            return {
                ...state,
                coupon_detail: action.payload,
            };
        case SET_CART_DATA:
            if (action.cartValue!==undefined) {                
                if (action.cartValue===0) {
                    return {...state, cart_data: []};
                } else {
                    const newCartData = [...state.cart_data];
                    const existingItemIndex = newCartData.findIndex(item => item.id===action.payload.id);
                    if (existingItemIndex!==-1) {
                        newCartData[existingItemIndex].quantity = newCartData[existingItemIndex].quantity + action.cartValue;
                    } else {
                        newCartData.push({...action.payload, quantity: action.cartValue});
                    };
                    AsyncStorage.setItem("cart_data", JSON.stringify(newCartData));
                    return {...state, cart_data: newCartData};
                };
            } else {
                AsyncStorage.setItem("cart_data", JSON.stringify(action.payload));
                return {...state, cart_data: action.payload};
            };
        default:
            return state;
    }
}
    
export default userReducer;