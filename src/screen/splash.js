import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Platform, ToastAndroid, Animated, Easing } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { SetCartData, SetUserDetail, SetUserLocation, SetUserToken } from '../Redux/actions/actions';
import listeners from '../constants/listeners';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions';
import { WebView } from 'react-native-webview'; // Import WebView

const Splash = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const fadeAnim = new Animated.Value(0); // For fade animation
  const scaleAnim = new Animated.Value(0.5); // For scaling animation
  const translateYAnim = new Animated.Value(50); // For upward animation
  const bottomFadeAnim = new Animated.Value(0); // For bottom animation fade
  const bottomTranslateAnim = new Animated.Value(50); // For bottom translate animation

  useEffect(() => {
    listeners();
    handlePermissions();
    startAnimations();
    hideSplashScreen();
  }, []);

  const handlePermissions = async () => {
    const permissionsRequested = await AsyncStorage.getItem('permissions_requested');

    if (!permissionsRequested) {
      await requestPermissions();
      await AsyncStorage.setItem('permissions_requested', 'true');
    }
  };

  const requestPermissions = async () => {
    await requestPermission(
      Platform.OS === 'ios' ? PERMISSIONS.IOS.NOTIFICATIONS : PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
      'Notification permission is required to stay updated!'
    );
    await requestPermission(
      Platform.OS === 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      'Gallery permission is needed to upload photos.'
    );
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

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(bottomFadeAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(bottomTranslateAnim, {
        toValue: 0,
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideSplashScreen = async () => {
    const access_token = await AsyncStorage.getItem("access_token");
    const cart_data = JSON.parse(await AsyncStorage.getItem("cart_data"));
    const user_detail = JSON.parse(await AsyncStorage.getItem("user_detail"));
    const user_location = JSON.parse(await AsyncStorage.getItem("user_location"));

    dispatch(SetCartData(cart_data === null ? [] : cart_data));
    dispatch(SetUserLocation(user_location === null ? {} : user_location));

    setTimeout(() => {
      if (access_token !== null) {
        dispatch(SetUserToken(access_token));
        dispatch(SetUserDetail(user_detail === null ? {} : user_detail));

        const userRole = user_detail?.type;

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

  // HTML content to display video
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Splash Video</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #000;
          }
          video {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        </style>
      </head>
      <body>
        <video autoplay muted loop>
          <source src="https://res.cloudinary.com/dpz0exww7/video/upload/v1734968766/rtzhrgfmejzwbmwzqety.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
    {/* WebView for displaying the HTML content with the video */}
    <WebView
      originWhitelist={['*']}
      source={{ html: htmlContent }}
      style={styles.webView}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      mediaPlaybackRequiresUserAction={false}
    />
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webView: {
    flex: 1,
  },
});

export default Splash;
