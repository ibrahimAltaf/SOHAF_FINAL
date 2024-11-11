import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import Home from '../screen/home';


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




export {
    HomeStackNavigator,

};