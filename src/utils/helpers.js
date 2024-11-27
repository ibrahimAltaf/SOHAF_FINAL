import {Dimensions} from 'react-native';
import {showMessage} from "react-native-flash-message";



const api = {
    clientId: '2',
    baseUrl: 'https://dodgerblue-chinchilla-339711.hostingersite.com/api',

    
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

const helpers = {api};
export {helpers, ToastMessage};



