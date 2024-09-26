import React from 'react';
import {Colors, Fonts} from '../utils/IMAGES';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from '../screen/splash';
import Login from '../screen/Auth/login';
import SignUp from '../screen/Auth/signUp';
import SelectLocation from '../screen/selectLocation';
import AllCategories from '../screen/allCategories';
import Services from '../screen/services';
import ServiceDetail from '../screen/serviceDetail';
import CheckOut from '../screen/checkOut';
import BookingDetail from '../screen/bookingDetail';
import BottomTabNavigator from './RootNavigation';
import Settings from '../screen/settings';
import ServiceAreas from '../screen/serviceAreas';
import PrivacyPolicy from '../screen/privacyPolicy';
import AboutUs from '../screen/aboutUs';
import Wallet from '../screen/wallet';
import RefundPolicy from '../screen/refundPolicy';
import CashOut from '../screen/cashOut';
import Profile from '../screen/profile';
import ContactUs from '../screen/contactUs';
import AddToCart from '../screen/AddToCart';
import Booking from '../screen/Booking/Booking';
import AssingedDetails from '../screen/Booking/AssingedDetails';
import AcceptDetails from '../screen/Booking/AcceptDetails';
import EditBooking from '../screen/Booking/EditBooking';
import CompletedDetails from '../screen/Booking/CompletedDetails';
import CheckListScreen from '../screen/Booking/CheckListScreen';
import PendingDetails from '../screen/Booking/PendingDetails';
import BookingTimeCounter from '../screen/Booking/BookingTimeCounter';
import Chat from '../screen/Chat';
import BookingSuccess from '../screen/BookingSuccess';
import DateTime from '../screen/DateTime';
import FinalCheckout from '../screen/FinalCheckout';
import Languages from '../screen/Languages';
import Coupons from '../screen/Coupons';
import HelpSupport from '../screen/HelpSupport';
import Forgettpassword from '../screen/Auth/Forgettpassword';
import Notifiction from '../screen/Notifiction';
import VerifyOtp from '../screen/Auth/VerifyOtp';
import Inbox from '../screen/Inbox';
import CancellationPolicy from '../screen/CancellationPolicy';
import TermConditions from '../screen/TermConditions';
import EditServiceDetail from '../screen/editServiceDetail';

const Stack = createNativeStackNavigator();

const MainNavigation = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator
            initialRouteName="Splash">
            <Stack.Screen
                name="Splash"
                component={Splash}
                options={{headerShown:false}}
            />
            <Stack.Screen
                name="Login"
                component={Login}
                options={{headerShown:false}}
            />
            <Stack.Screen
                name="SignUp"
                component={SignUp}
                options={{headerShown:false}}
            />
            <Stack.Screen
                name="SelectLocation"
                component={SelectLocation}
                options={{headerShown:false}}
            />
            <Stack.Screen
                name="BottomTabNavigator"
                component={BottomTabNavigator}
                options={{headerShown:false}}
            />
            <Stack.Screen
                name="AllCategories"
                component={AllCategories}
                options={{headerShown:false}}
            />
            <Stack.Screen
                name="Services"
                component={Services}
                options={{headerShown:false}}
            />
            <Stack.Screen
              name="ServiceDetail"
              component={ServiceDetail}
              options={{headerShown:false}}
            />
            <Stack.Screen
              name="EditServiceDetail"
              component={EditServiceDetail}
              options={{headerShown:false}}
            />
            <Stack.Screen
                name="CheckOut"
                component={CheckOut}
                options={{headerShown:false}}
            />
            <Stack.Screen
                name="Bookings"
                component={Booking}
                options={{headerShown:false}}
            />
            <Stack.Screen
                name="BookingDetail"
                component={BookingDetail}
                options={{headerShown:false}}
            />
            <Stack.Screen
                name="Settings"
                component={Settings}
                options={{headerShown:false}}
            />
            <Stack.Screen
                name="ServiceAreas"
                component={ServiceAreas}
                options={{headerShown:false}}
            />
            <Stack.Screen
                name="PrivacyPolicy"
                component={PrivacyPolicy}
                options={{headerShown:false}}
            />
            <Stack.Screen
                name="RefundPolicy"
                component={RefundPolicy}
                options={{headerShown:false}}
            />
            <Stack.Screen
                name="AboutUs"
                component={AboutUs}
                options={{headerShown:false}}
            />
            <Stack.Screen
                name="Wallet"
                component={Wallet}
                options={{headerShown:false}}
            />
            <Stack.Screen
                name="CashOut"
                component={CashOut}
                options={{headerShown:false}}
            />
            <Stack.Screen
                name="Profile"
                component={Profile}
                options={{headerShown:false}}
            />
            <Stack.Screen
                name="ContactUs"
                component={ContactUs}
                options={{headerShown:false}}
            />
              <Stack.Screen
                name="addtoCart"
                component={AddToCart}
                options={{headerShown:false}}
            />
            <Stack.Screen
        name="Assigned Details"
        component={AssingedDetails}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
            <Stack.Screen
        name="Accept Booking"
        component={AcceptDetails}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />

      
              <Stack.Screen
        name="Edit Booking"
        component={EditBooking}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
        
                    <Stack.Screen
        name="Complete Details"
        component={CompletedDetails}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
      <Stack.Screen
        name="CheckListScreen"
        component={CheckListScreen}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
              <Stack.Screen
        name="Pending Details"
        component={PendingDetails}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
          <Stack.Screen
        name="Booking Period"
        component={BookingTimeCounter}
        options={{
          headerShown: false,
          headerTintColor: Colors.White,
          headerTitleStyle: {fontFamily:Fonts.Bold},
          headerStyle: {backgroundColor:Colors.Primary},
        }}
      />
          <Stack.Screen
        name="chat"
        component={Chat}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
                <Stack.Screen
        name="BookingSuccess"
        component={BookingSuccess}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
              <Stack.Screen
        name="SelectDateTime"
        component={DateTime}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
          <Stack.Screen
        name="FinalCheckout"
        component={FinalCheckout}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
        <Stack.Screen
        name="Langauges"
        component={Languages}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
        <Stack.Screen
        name="Coupons"
        component={Coupons}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
        <Stack.Screen
        name="Help&Support"
        component={HelpSupport}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
            <Stack.Screen
        name="ForgetPassword"
        component={Forgettpassword}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
                <Stack.Screen
        name="Notification"
        component={Notifiction}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
        <Stack.Screen
        name="VerifyOtp"
        component={VerifyOtp}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
          <Stack.Screen
        name="Inbox"
        component={Inbox}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
            <Stack.Screen
        name="CancellationPolicy"
        component={CancellationPolicy}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
                <Stack.Screen
        name="TermCondiotions"
        component={TermConditions}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
        </Stack.Navigator>
      </NavigationContainer>
    );
};

export default MainNavigation;
