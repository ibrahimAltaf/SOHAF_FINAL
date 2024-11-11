import {Dimensions} from 'react-native';
import {showMessage} from "react-native-flash-message";

const LATITUDE_DELTA = 0.0922;
const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width/screen.height;
const LONGITUDE_DELTA = LATITUDE_DELTA*ASPECT_RATIO;

const api = {
    clientId: '2',
    merchantName: 'Movit inc ',
    webUrl: 'https://My Denzen.com/',
    baseUrl: 'https://My Denzen.com/api/user/',
    secretKey: 'sk_test_fKA8fpC5eiLSUxbDnoSj7fJH',
    mapKey: 'AIzaSyA0C1LPhGrh_jgCTNU0blCVCFfeJmRZCbo',
    publishableKey: 'pk_test_rsDVDj4AUNXV5ruetnRAtTPD',
    clientSecret: 'aHpZuETbDFAknxDkhEh9UUqHc3Sxz3ohajuJC0E0',
};
const constant = {
    vatTax: 50,
    currencyName: "$",
    defaultLatitude: 25.1921465,
    defaultLongitude: 66.5949785,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
    appStoreLink: 'itms-apps://apps.apple.com/US/app/id123',
    playStoreLink: 'https://play.google.com/store/apps/details?id=com.sohaf',
};
const ToastMessage = (message) => {
    showMessage({
        duration: 3000,
        floating: true,
        message: message,
        position: "bottom",
        backgroundColor: "#383d41",
    });
};

const helpers = {api, constant};
export {helpers, ToastMessage};



