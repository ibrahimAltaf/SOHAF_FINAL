import React, {useEffect} from 'react';
import {View, Image, StyleSheet, Text, Animated} from 'react-native';
import {useDispatch} from 'react-redux';
import {theme} from '../constants/styles';
import {useNavigation} from '@react-navigation/native';
import {SetCartData, SetUserDetail, SetUserLocation, SetUserToken} from '../Redux/actions/actions';
import listeners from '../constants/listeners';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Splash = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const opacity = new Animated.Value(0);

  useEffect(() => {
    listeners();
    hideSplashScreen();
    fadeInAnimationHanle();
  }, []);
  const fadeInAnimationHanle = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };
  const hideSplashScreen = async () => {
    const access_token = await AsyncStorage.getItem("access_token");
    const cart_data = JSON.parse(await AsyncStorage.getItem("cart_data"));
    const user_detail = JSON.parse(await AsyncStorage.getItem("user_detail"));
    const user_location = JSON.parse(await AsyncStorage.getItem("user_location"));
    dispatch(SetCartData(cart_data === null ? [] : cart_data));
    dispatch(SetUserLocation(user_location === null ? {} : user_location));
    if (access_token !== null) {
      setTimeout(() => {
        dispatch(SetUserToken(access_token));
        dispatch(SetUserDetail(user_detail === null ? {} : user_detail));
        navigation.replace("BottomTabNavigator");
      }, 7000);
    } else {
      navigation.replace("BottomTabNavigator");
    };
  };

  return (
    <Animated.View style={[styles.mainView,{opacity}]}>
      <View style={styles.mainStyle}>
        <Image
          style={styles.logo}
          source={require("../assets/images/newlogo.png")}
        />
        <Text style={styles.titleStyle}>
          Customer App
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mainStyle: {
    width: "100%",
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: "column",
  },
  logo: {
    width: 300,
    height: 150,
    objectFit:"cover",
  },
  titleStyle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.color.primaryColor,
  },
});

export default Splash;
