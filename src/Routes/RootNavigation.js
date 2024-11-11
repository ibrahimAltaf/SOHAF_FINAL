import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import Profile from '../screen/profile';

import { theme } from '../constants/styles';

import Login from '../screen/Auth/login';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SetUserDetail, SetUserToken } from '../Redux/actions/actions';
import { Colors } from '../utils/IMAGES';
import Admin from '../screen/Admin';
// Drawer Navigator
const Drawer = createDrawerNavigator();

// Bottom Tab Navigator
const Tab = createBottomTabNavigator();

const MoreDrawerContent = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { access_token } = useSelector((state) => state.userReducer);

  const logoutHandle = async () => {
    try {
      if (access_token === null) {
        navigation.navigate("Login", { routeName: "home" });
      } else {
        await AsyncStorage.removeItem("access_token");
        await AsyncStorage.removeItem("user_detail");
        await AsyncStorage.removeItem("user_location");
        dispatch(SetUserDetail({}));
        dispatch(SetUserToken(null));
        navigation.navigate("Home");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.color.primaryColor }}>

      <View style={{ paddingVertical: 30, paddingHorizontal: 20,
        marginTop:40,
       }}>
        <Text style={{ fontSize: 36, fontWeight: '900', color: '#fff', textAlign: 'center' }}>
          MY DENZEN
        </Text>
      </View>


      <View style={{ flex: 1, padding: 20 }}>
      <TouchableOpacity onPress={() => access_token === null ? navigation.navigate("Login", { routeName: "profile" }) : navigation.navigate("Profile")}>
        <Text style={{ marginVertical: 10,fontWeight:"600",color:Colors.White }}>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => access_token === null ? navigation.navigate("Login", { routeName: "chat" }) : navigation.navigate("Inbox")}>
        <Text style={{ marginVertical: 10,fontWeight:"600",color:Colors.White }}>Inbox</Text>
      </TouchableOpacity>


      {/* <TouchableOpacity onPress={() => navigation.navigate('Langauges')}>
        <Text style={{ marginVertical: 10,fontWeight:"600",color:Colors.White }}>Language</Text>
      </TouchableOpacity> */}


    
      <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
        <Text style={{ marginVertical: 10,fontWeight:"600",color:Colors.White }}>Privacy and Policy</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('RefundPolicy')}>
        <Text style={{ marginVertical: 10,fontWeight:"600",color:Colors.White }}>Refund Policy</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Help&Support')}>
        <Text style={{ marginVertical: 10,fontWeight:"600",color:Colors.White }}>Help & Support</Text>
      </TouchableOpacity>
{/* 
      <TouchableOpacity onPress={() => navigation.navigate('ServiceAreas')}>
        <Text style={{ marginVertical: 10,fontWeight:"600",color:Colors.White }}>Service Area</Text>
      </TouchableOpacity> */}

      <TouchableOpacity onPress={() => navigation.navigate('CancellationPolicy')}>
        <Text style={{ marginVertical: 10,fontWeight:"600",color:Colors.White }}>Cancellation Policy</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('TermCondiotions')}>
        <Text style={{ marginVertical: 10,fontWeight:"600",color:Colors.White }}>Terms & Conditions</Text>
      </TouchableOpacity>

        {/* Add more buttons as necessary */}

      </View>

      {/* Logout/Login Button at the bottom */}
      <View style={{ paddingVertical: 20, alignItems: 'center' }}>
        <TouchableOpacity onPress={logoutHandle} style={{ backgroundColor: '#fff', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, width:"90%" ,justifyContent:"center",alignItems:"center"}}>
          <Text style={{ color: theme.color.primaryColor }}>
            {access_token === null ? "Login" : "Logout"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <MoreDrawerContent {...props} />} // Drawer Content included here
      screenOptions={{
        drawerStyle: {
          backgroundColor: theme.color.primaryColor,
          width: 250,
        },
      }}
    >
      <Drawer.Screen name="Login" component={Login} options={{ headerShown: false }} />
    </Drawer.Navigator>
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
  
});

export default DrawerNavigator;
