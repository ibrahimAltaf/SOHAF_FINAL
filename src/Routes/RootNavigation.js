import React from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { useNavigation } from '@react-navigation/native';
import { BookingStackNavigator, HomeStackNavigator, OffersStackNavigator } from './StackNavigation';
import Profile from '../screen/profile';
import { theme } from '../constants/styles';
import More from '../screen/more';

// Bottom Tab Navigator
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {


  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{ tabBarShowLabel: false, tabBarStyle: styles.mainTabBar }}>

      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabContainer}>
              {focused && <View style={styles.topBorder} />}
              <View style={styles.tabTextMain}>
                <Image
                  source={require('../assets/images/home.png')}
                  style={{ height: 20, width: 20, tintColor: focused ? theme.color.white : "#CCC" }}
                />
                <Text style={[styles.tabText, { color: focused ? theme.color.white : "#CCC" }]}>
                  Home
                </Text>
              </View>
            </View>
          )
        }}
      />

      <Tab.Screen
        name="Bookings"
        component={BookingStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabContainer}>
              {focused && <View style={styles.topBorder} />}
              <View style={styles.tabTextMain}>
                <Image
                  source={require('../assets/images/to-do-list.png')}
                  style={{ height: 20, width: 20, tintColor: focused ? theme.color.white : "#CCC" }}
                />
                <Text style={[styles.tabText, { color: focused ? theme.color.white : "#CCC" }]}>
                  Bookings
                </Text>
              </View>
            </View>
          )
        }}
      />

      <Tab.Screen
        name="Offers"
        component={OffersStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabContainer}>
              {focused && <View style={styles.topBorder} />}
              <View style={styles.tabTextMain}>
                <Image
                  source={require('../assets/images/discount.png')}
                  style={{ height: 20, width: 20, tintColor: focused ? theme.color.white : "#CCC" }}
                />
                <Text style={[styles.tabText, { color: focused ? theme.color.white : "#CCC" }]}>
                  Offers
                </Text>
              </View>
            </View>
          )
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabContainer}>
              {focused && <View style={styles.topBorder} />}
              <View style={styles.tabTextMain}>
                <Image
                  source={require('../assets/images/icons8-male-user-50.png')}
                  style={{ height: 20, width: 20, tintColor: focused ? theme.color.white : "#CCC" }}
                />
                <Text style={[styles.tabText, { color: focused ? theme.color.white : "#CCC" }]}>
                  Profile
                </Text>
              </View>
            </View>
          )
        }}
      />

      <Tab.Screen
        name="More"
        component={More}  
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
      
            
              <View style={styles.tabTextMain}>
                <Image
                  source={require('../assets/images/more.png')}
                  style={{ height: 20, width: 20, tintColor: focused ? theme.color.white : "#CCC" }}
                />
                <Text style={[styles.tabText, { color: focused ? theme.color.white : "#CCC" }]}>
                  More
                </Text>
              </View>

          )
        }}
      />

    </Tab.Navigator>
  );
};


// Styles
const styles = StyleSheet.create({
  mainTabBar: {
    flex: 1,
    left: 0,
    right: 0,
    zIndex: 1,
    bottom: 0,
    borderWidth: 0,
    position: 'absolute',
    height: Platform.OS === 'ios' ? 90 : 60,
    backgroundColor: theme.color.primaryColor,
  },
  tabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabTextMain: {
    top: 3,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    marginTop: 4,
    fontSize: 10,
    textTransform: 'capitalize',
  },
  topBorder: {
    width: '100%',
    height: 4,
    backgroundColor: theme.color.white,
    position: 'absolute',
    top: 0,
  },
  drawerHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#000',
  },
});

export default BottomTabNavigator;
