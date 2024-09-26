import React, { Component } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SideBar } from './SideBar';
import BottomTabNavigator from './RootNavigation'; // Assuming this is the BottomTabNavigator file you provided
import { theme } from '../Constants/styles';

const Drawer = createDrawerNavigator();

class DrawerNavigator extends Component {
  render() {
    return (
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: 240,
            paddingVertical: 36,
            backgroundColor: theme.color.bgColor,
          },
        }}
        drawerContent={() => <SideBar />} // Your custom SideBar
      >
        {/* This is where you load your BottomTabNavigator inside the Drawer */}
        <Drawer.Screen name="Home" component={BottomTabNavigator} />
      </Drawer.Navigator>
    );
  }
}

export default DrawerNavigator;
