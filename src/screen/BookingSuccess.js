import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../utils/styles';

const BookingSuccess = () => {
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
  
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 2,
      tension: 100,
      useNativeDriver: true,
    }).start();

  
   
    // Handle back button press
    const backAction = () => true;
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    // Navigate to Bookings screen after 4 seconds
    const timer = setTimeout(() => {
      navigation.navigate("BottomTabNavigator");
    }, 4000);

    return () => {
      backHandler.remove();
      clearTimeout(timer); // Clean up the timer
    };
  }, [scaleAnim, navigation]);

  const handleGoHome = () => {
    navigation.navigate("BottomTabNavigator");
  };


  return (
    <View style={styles.container}>
<Animated.Text style={[styles.successText, { transform: [{ scale: scaleAnim }] }]}>
        You placed the booking successfully!
      </Animated.Text>
      {/* <Text style={styles.orderNumber}>Booking ID: #123456</Text> */}
      <Image
        source={require("../assets/images/BookingSuccessTick.png")} // Replace with your success image URL
        style={styles.successImage}
      />
      <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
        <Text style={styles.buttonText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BookingSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  successText: {
    fontSize: 28,
    fontWeight: 'bold',
    color:  theme.color.primaryColor,
    marginBottom: 20,
    textAlign:"center"
  },
  successImage: {
    width: 250,
    height: 250,
    marginBottom: 30,
  },
  homeButton: {
    width:"90%",
    backgroundColor: theme.color.primaryColor,
    paddingVertical: 12,
    paddingHorizontal: 30,
    justifyContent:"center",
    alignItems:"center",
    borderRadius:12
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  orderNumber:{
    color:"green",
    fontSize:18,
    fontWeight:"700"
  }
});
