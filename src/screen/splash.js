import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Platform, ToastAndroid } from 'react-native';
import { useDispatch } from 'react-redux';
import { theme } from '../constants/styles';
import { useNavigation } from '@react-navigation/native';
import { SetCartData, SetUserDetail, SetUserLocation, SetUserToken } from '../Redux/actions/actions';
import listeners from '../constants/listeners';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions';

const Splash = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    listeners();
    handlePermissions();
    hideSplashScreen();
  }, []);

  // Function to handle permission requests only once
  const handlePermissions = async () => {
    const permissionsRequested = await AsyncStorage.getItem('permissions_requested');

    if (!permissionsRequested) {
      await requestPermissions();
      await AsyncStorage.setItem('permissions_requested', 'true');
    }
  };

  // Function to request required permissions
  const requestPermissions = async () => {
    // Request notification permission
    await requestPermission(
      Platform.OS === 'ios' ? PERMISSIONS.IOS.NOTIFICATIONS : PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
      'Notification permission is required to stay updated!'
    );
    
    // Request gallery (photo library) permission
    await requestPermission(
      Platform.OS === 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      'Gallery permission is needed to upload photos.'
    );

    // Request camera permission
    await requestPermission(
      Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA,
      'Camera permission is required to take photos.'
    );
  };

  const requestPermission = async (permissionType, message) => {
    try {
      const result = await check(permissionType);
      if (result === RESULTS.DENIED) {
        const requestResult = await request(permissionType);
        if (requestResult !== RESULTS.GRANTED) {
          ToastAndroid.show(message, ToastAndroid.LONG);
        }
      }
    } catch (error) {
      console.warn('Permission error:', error);
    }
  };

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
          ToastAndroid.show("Role not recognized.", ToastAndroid.SHORT);
          navigation.replace("VisitorHomeScreen");
        }
      } else {
        navigation.replace("VisitorHomeScreen");
      }
    }, 5000); // Display splash for 5 seconds
  };

  return (
    <View style={styles.mainView}>
      <View style={styles.mainStyle}>
        <Image
          style={{
            width: 300,
            height: 200,
            resizeMode: "cover",
          }}
          source={require("../assets/images/Sohaf.png")}
        />
      </View>
    </View>
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
});

export default Splash;
