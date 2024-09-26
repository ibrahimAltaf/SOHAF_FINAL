import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import Home from '../screen/home';

import Cart from '../screen/cart';
import Offers from '../screen/offers';
import More from '../screen/more';
import Booking from '../screen/Booking/Booking';

const Stack = createStackNavigator();

const HomeStackNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName={Home} 
            screenOptions={{
                gestureEnabled: true,
                ...TransitionPresets.SlideFromRightIOS,
            }}>
            <Stack.Screen
                component={Home}
                name={"HomeBottom"}
                options={{headerShown:false}}
            />
        </Stack.Navigator>
    )
};
const BookingStackNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName={Booking}
            screenOptions={{
                gestureEnabled: true,
                ...TransitionPresets.SlideFromRightIOS,
            }}>
            <Stack.Screen
                component={Booking}
                name={"Booking"}
                options={{headerShown:false}}
            />
        </Stack.Navigator>
    )
};
const CartStackNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName={Cart} 
            screenOptions={{
                gestureEnabled: true,
                ...TransitionPresets.SlideFromRightIOS,
            }}>
            <Stack.Screen
                component={Cart}
                name={"CartBottom"}
                options={{headerShown:false}}
            />
        </Stack.Navigator>
    )
};
const OffersStackNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName={Offers}
            screenOptions={{
                gestureEnabled: true,
                ...TransitionPresets.SlideFromRightIOS,
            }}>
            <Stack.Screen
                component={Offers}
                name={"OffersBottom"}
                options={{headerShown:false}}
            />
        </Stack.Navigator>
    )
};
const MoreStackNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName={More} 
            screenOptions={{
                gestureEnabled: true,
                ...TransitionPresets.SlideFromRightIOS,
            }}>
            <Stack.Screen
                component={More}
                name={"MoreBottom"}
                options={{headerShown:false}}
            />
        </Stack.Navigator>
    )
};

export {
    HomeStackNavigator,
    BookingStackNavigator,
    CartStackNavigator,
    OffersStackNavigator,
    MoreStackNavigator,
};