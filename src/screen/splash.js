import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { theme } from '../constants/styles';
import { useNavigation } from '@react-navigation/native';
import { SetCartData, SetUserDetail, SetUserLocation, SetUserToken } from '../Redux/actions/actions';
import listeners from '../constants/listeners';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomStatusBar from '../component/StatusBar/customStatusBar';

const Splash = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    listeners();
    hideSplashScreen();
  }, []);

  const hideSplashScreen = async () => {
    const access_token = await AsyncStorage.getItem("access_token");
    const cart_data = JSON.parse(await AsyncStorage.getItem("cart_data"));
    const user_detail = JSON.parse(await AsyncStorage.getItem("user_detail"));
    const user_location = JSON.parse(await AsyncStorage.getItem("user_location"));
  
    dispatch(SetCartData(cart_data === null ? [] : cart_data));
    dispatch(SetUserLocation(user_location === null ? {} : user_location));
  
    // Set timeout for 5 seconds before navigating
    setTimeout(() => {
      if (access_token !== null) {
        dispatch(SetUserToken(access_token));
        dispatch(SetUserDetail(user_detail === null ? {} : user_detail));
  
        const userRole = user_detail?.type; // Assuming role is in `user_detail.type`
  
        // Navigate based on role
        if (userRole === "admin") {
          navigation.replace("AdminScreen");
        } else if (userRole === "user") {
          navigation.replace("VisitorScreen");
        } else if (userRole === "author") {
          navigation.replace("AuthorScreen");
        } else {
          ToastMessage("Role not recognized.");
          navigation.replace("Login");
        }
      } else {
        navigation.replace("Login");
      }
    }, 5000); // Display splash for 5 seconds
  };
  

  return (
<>


<View style={styles.mainView}>
  <View style={styles.mainStyle}>
    <Image
      style={{
        width: 300,
        height: 200,
        objectFit: "cover"
      }}
      source={require("../assets/images/Sohaf.png")}
    />

  </View>
</View>
</>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.color.primaryColor,
  },
  mainStyle: {
    width: "100%",
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: "column",
  },
  titleStyle: {
    fontSize: 30, // Adjust font size for the title
    fontWeight: '900',
    textAlign: 'center',
    color: "#000", // Black text color
    marginTop: 10, // Added margin for spacing
  },
});

export default Splash;
