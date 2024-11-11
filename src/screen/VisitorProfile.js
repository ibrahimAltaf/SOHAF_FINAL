import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, useColorScheme, Alert, ToastAndroid } from 'react-native';
import { useSelector ,useDispatch} from 'react-redux';
import { theme } from '../constants/styles';
import Header from '../component/Header/header';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SetUserDetail, SetUserToken } from "../Redux/actions/actions";
import CustomButton from '../component/Buttons/customButton';
export default function VisitorProfile({ navigation }) {
    const dispatch = useDispatch();

  const { user_detail } = useSelector((state) => state.userReducer); // Get user details from Redux
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const backgroundColor = isDarkMode ? theme.color.darkBackground : theme.color.lightBackground;
  const textColor = isDarkMode ? theme.color.white : theme.color.black;
  const logoutHandle = async () => {
    try {
      // Retrieve access_token from AsyncStorage if needed
      const access_token = await AsyncStorage.getItem("access_token");
  
      if (!access_token) {
        // If no access_token is found, navigate to Login screen directly
        navigation.navigate("Login");
      } else {
        // Remove access_token and user_detail from AsyncStorage
        await AsyncStorage.removeItem("access_token");
        await AsyncStorage.removeItem("user_detail");
  
        // Dispatch actions to clear Redux state
        dispatch(SetUserDetail({}));
        dispatch(SetUserToken(null));
  
        // Show a toast message for successful logout
        ToastAndroid.show('Logged out successfully!', ToastAndroid.SHORT);
  
        // Reset the navigation stack to Login screen
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    } catch (error) {
      console.error("Error during logout:", error);
      ToastAndroid.show('Failed to log out. Please try again.', ToastAndroid.SHORT);
    }
  };
  
  
  return (
    <>
      <Header title="Profile" backArrow backPage={() => navigation.goBack()} />
      <View style={[styles.container, { backgroundColor }]}>
        <View style={styles.profileHeader}>
          <Image
            source={user_detail.avatar ? { uri: user_detail.avatar } : {uri:"https://pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png"}} // Replace with a default avatar if no avatar is provided
            style={styles.profileImage}
          />
          <Text style={[styles.name, { color: textColor }]}>{user_detail.name || 'N/A'}</Text>
          <Text style={[styles.role, { color: isDarkMode ? theme.color.gray : theme.color.darkGray }]}>
            {user_detail.type === 'admin' ? 'Administrator' : 'Author'}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.label, { color: textColor }]}>Email</Text>
          <Text style={[styles.value, { color: isDarkMode ? theme.color.gray : theme.color.darkGray }]}>
            {user_detail.email || 'N/A'}
          </Text>

          <Text style={[styles.label, { color: textColor }]}>Phone Number</Text>
          <Text style={[styles.value, { color: isDarkMode ? theme.color.gray : theme.color.darkGray }]}>
            {user_detail.phone || 'N/A'}
          </Text>

          <Text style={[styles.label, { color: textColor }]}>Role</Text>
          <Text style={[styles.value, { color: isDarkMode ? theme.color.gray : theme.color.darkGray }]}>
            {user_detail.type || 'N/A'}
          </Text>

          <Text style={[styles.label, { color: textColor }]}>Password</Text>
          <Text style={[styles.value, { color: isDarkMode ? theme.color.gray : theme.color.darkGray }]}>********</Text>
        </View>

        <CustomButton
            title="Logout"
            onPress={logoutHandle}
            customButtonStyle={styles.closeButton}
          />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  role: {
    fontSize: 16,
    color: '#888',
  },
  infoContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 14,
    marginBottom: 5,
  },
  logoutButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: theme.color.primaryColor,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
