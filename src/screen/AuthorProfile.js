import React from 'react';
import { View, Text, Image, StyleSheet, ToastAndroid, useColorScheme } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SetUserDetail, SetUserToken } from "../Redux/actions/actions";
import Header from '../component/Header/header';
import CustomButton from '../component/Buttons/customButton';
import { theme } from '../constants/styles';

export default function AuthorProfile({ navigation }) {
  const dispatch = useDispatch();
  const { user_detail } = useSelector((state) => state.userReducer); // Get user details from Redux
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const backgroundColor = isDarkMode ? '#1E1E1E' : '#f5f5f5';
  const textColor = isDarkMode ? '#FFFFFF' : '#000000';
  const infoBackgroundColor = isDarkMode ? '#333333' : '#FFFFFF';
  const secondaryTextColor = isDarkMode ? '#AAAAAA' : '#888888';
  const buttonBackgroundColor = isDarkMode ? '#3A3A3A' : '#007BFF';

  const logoutHandle = async () => {
    try {
      const access_token = await AsyncStorage.getItem("access_token");

      if (!access_token) {
        navigation.navigate("Login");
      } else {
        await AsyncStorage.removeItem("access_token");
        await AsyncStorage.removeItem("user_detail");

        dispatch(SetUserDetail({}));
        dispatch(SetUserToken(null));

        ToastAndroid.show('Logged out successfully!', ToastAndroid.SHORT);

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
            source={user_detail.avatar ? { uri: user_detail.avatar } : { uri: "https://pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png" }}
            style={styles.profileImage}
          />
          <Text style={[styles.name, { color: textColor }]}>{user_detail.name || 'N/A'}</Text>
          <Text style={[styles.role, { color: secondaryTextColor }]}>
            {user_detail.type === 'admin' ? 'Administrator' : 'Author'}
          </Text>
        </View>

        <View style={[styles.infoContainer, { backgroundColor: infoBackgroundColor }]}>
          <Text style={[styles.label, { color: textColor }]}>Email</Text>
          <Text style={[styles.value, { color: secondaryTextColor }]}>{user_detail.email || 'N/A'}</Text>

          <Text style={[styles.label, { color: textColor }]}>Phone Number</Text>
          <Text style={[styles.value, { color: secondaryTextColor }]}>{user_detail.phone || 'N/A'}</Text>

          <Text style={[styles.label, { color: textColor }]}>Role</Text>
          <Text style={[styles.value, { color: secondaryTextColor }]}>{user_detail.type || 'N/A'}</Text>

          <Text style={[styles.label, { color: textColor }]}>Password</Text>
          <Text style={[styles.value, { color: secondaryTextColor }]}>********</Text>
        </View>

        <CustomButton
          title="Logout"
          onPress={logoutHandle}
          customButtonStyle={[styles.logoutButton, { backgroundColor: theme.color.primaryColor }]}
          textColor={textColor}
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
  },
  infoContainer: {
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
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
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor:theme.color.primaryColor
  },
});
