import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator, ToastAndroid } from 'react-native';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';
import { theme } from '../constants/styles';
import Header from '../component/Header/header';
import { useNavigation } from '@react-navigation/native';
import { TextInput, useTheme } from 'react-native-paper';
import AdminBottom from './AdminBottom';
import { FontFamily } from '../constants/fonts';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { SetUserDetail, SetUserToken } from "../Redux/actions/actions";
export default function Profile(props) {
  const { colors, dark } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
  });

  const [loading, setLoading] = useState(true);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // State for password fields and visibility toggles
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { access_token ,user_detail } = useSelector((state) => state.userReducer);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://dodgerblue-chinchilla-339711.hostingersite.com/api/profile/1/admin');
        const { profile } = response.data;
        setProfile({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          avatar: profile.avatar,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveChanges = async () => {
    const formData = new FormData();
    formData.append('name', profile.name);
    formData.append('phone', profile.phone);
  
    if (profile.avatar) {
      const file = {
        uri: profile.avatar,
        name: 'avatar.jpg',
        type: 'image/jpeg',
      };
      formData.append('avatar', file);
    }
  
    try {
      setLoading(true);
      const response = await axios.post('https://dodgerblue-chinchilla-339711.hostingersite.com/api/profile/update/1/admin', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
  
      if (response.data && response.data.success) {
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
      } else {
        ToastAndroid.show('Failed to update profile. Please try again.', ToastAndroid.LONG);
      }
    } catch (error) {
      console.error('Error updating profile:', error.message);
      ToastAndroid.show('Failed to update profile. Please try again.', ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };
  
  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setProfile({ ...profile, avatar: response.assets[0].uri });
      }
    });
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('Success', 'Logged out successfully!');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={theme.color.primaryColor} />
      </View>
    );
  }
  const logoutHandle = async () => {
    try {
      if (!access_token) {
        navigation.navigate("Login");
      } else {
        await AsyncStorage.removeItem("access_token");
        await AsyncStorage.removeItem("user_detail");
  
        // Dispatch actions to clear Redux state
        dispatch(SetUserDetail({}));
        dispatch(SetUserToken(null));
  
        // Redirect to Login page and reset navigation stack
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };
  
  return (
    <>
      <Header title="Profile" backArrow backPage={() => props.navigation.goBack()} />
      <View style={styles.container}>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'profile' && styles.activeTab]}
            onPress={() => setActiveTab('profile')}
          >
            <Text style={styles.tabText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'changePassword' && styles.activeTab]}
            onPress={() => setActiveTab('changePassword')}
          >
            <Text style={styles.tabText}>Change Password</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'profile' ? (
          <ScrollView contentContainerStyle={styles.profileContent}>
            <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
              {profile.avatar ? (
                <Image source={{ uri: profile.avatar }} style={styles.avatar} />
              ) : (
                <Text style={styles.imagePlaceholder}>Pick an Image</Text>
              )}
              {updateSuccess && (
                <Image source={require("../assets/images/editing.png")} />
              )}
            </TouchableOpacity>
            <TextInput
              label="Name"
              value={profile.name}
              style={{ backgroundColor: theme.color.white ,fontSize:13,marginBottom:8,
             width:"100%"
               }}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
              outlineColor="black"           // Set the outline color to black
              activeOutlineColor="black"      // Set the active outline color to black
              theme={{
                colors: {
                  text: theme.color.black,    // Set the input text color to black
                  primary: "black", 
                            // Set the label color to black
                },
              }}
              placeholderTextColor={dark ? "#fff" : "#000"}
            />
            <TextInput
              label="Email"
              value={profile.email}
              style={{ backgroundColor: theme.color.white ,fontSize:13,marginBottom:8,
                width:"100%"
                  }}
              outlineColor="black"           // Set the outline color to black
              activeOutlineColor="black"      // Set the active outline color to black
              theme={{
                colors: {
                  text: theme.color.black,    // Set the input text color to black
                  primary: "black", 
                            // Set the label color to black
                },
              }}
              editable={false}
              placeholderTextColor={dark ? "#fff" : "#000"}
            />
            <TextInput
              label="Phone"
              style={{ backgroundColor: theme.color.white ,fontSize:13,marginBottom:8,
                width:"100%"
                  }}
              value={profile.phone}
              onChangeText={(text) => setProfile({ ...profile, phone: text })}
              outlineColor="black"           // Set the outline color to black
              activeOutlineColor="black"      // Set the active outline color to black
              theme={{
                colors: {
                  text: theme.color.black,    // Set the input text color to black
                  primary: "black", 
                            // Set the label color to black
                },
              }}
              placeholderTextColor={dark ? "#fff" : "#000"}
            />
          </ScrollView>
        ) : (
          <ScrollView contentContainerStyle={styles.changePasswordContent}>
            {/* Current Password */}
            <View style={styles.passwordContainer}>
              <TextInput
                label="Current Password"
                style={{ backgroundColor: theme.color.white ,fontSize:13,marginBottom:8,
                  width:"100%"
                    }}
                value={currentPassword}
                secureTextEntry={!showCurrentPassword}
                outlineColor="black"           // Set the outline color to black
                activeOutlineColor="black"      // Set the active outline color to black
                theme={{
                  colors: {
                    text: theme.color.black,    // Set the input text color to black
                    primary: "black", 
                              // Set the label color to black
                  },
                  
                }}
                placeholderTextColor={dark ? "#fff" : "#000"}
                onChangeText={setCurrentPassword}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.togglePassword}
                onPress={() => setShowCurrentPassword(!showCurrentPassword)} >
                <Image
                  style={styles.icon}
                  source={showCurrentPassword ? require("../assets/images/hide.png") : require("../assets/images/view.png")}
                />
              </TouchableOpacity>
            </View>

            {/* New Password */}
            <View style={styles.passwordContainer}>
              <TextInput
                label="New Password"
                value={newPassword}
                secureTextEntry={!showNewPassword}
                style={{ backgroundColor: theme.color.white ,fontSize:13,marginBottom:8,
                  width:"100%"
                    }}
                outlineColor="black"           // Set the outline color to black
                activeOutlineColor="black"      // Set the active outline color to black
                theme={{
                  colors: {
                    text: theme.color.black,    // Set the input text color to black
                    primary: "black", 
                              // Set the label color to black
                  },
                }}
                placeholderTextColor={dark ? "#fff" : "#000"}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.togglePassword}
                onPress={() => setShowNewPassword(!showNewPassword)} >
                <Image
                  style={styles.icon}
                  source={showNewPassword ? require("../assets/images/hide.png") : require("../assets/images/view.png")}
                />
              </TouchableOpacity>
            </View>

            {/* Confirm New Password */}
            <View style={styles.passwordContainer}>
              <TextInput
                label="Confirm New Password"
                value={confirmNewPassword}
                style={{ backgroundColor: theme.color.white ,fontSize:13,marginBottom:8,
                  width:"100%"
                    }}
                secureTextEntry={!showConfirmPassword}
                outlineColor="black"           // Set the outline color to black
                activeOutlineColor="black"      // Set the active outline color to black
                theme={{
                  colors: {
                    text: theme.color.black,    // Set the input text color to black
                    primary: "black", 
                              // Set the label color to black
                  },
                }}
                placeholderTextColor={dark ? "#fff" : "#000"}
                onChangeText={setConfirmNewPassword}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.togglePassword}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)} >
                <Image
                  style={styles.icon}
                  source={showConfirmPassword ? require("../assets/images/hide.png") : require("../assets/images/view.png")}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
            <Text style={styles.LOGINTEXT}>Save Changes</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logoutHandle} style={styles.logoutButton}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
      <AdminBottom/>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.white,
    paddingHorizontal: 15,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
  },
  activeTab: {
    borderBottomColor: theme.color.black,
  },
  tabText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.color.black,
  },
  profileContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonContainer: {
 
    paddingBottom: 20,
  },
  saveButton: {
    backgroundColor: theme.color.primaryColor,
    height: 50,
    elevation: 23,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    shadowRadius: 15.19,
    shadowOpacity: 0.57,
    justifyContent: "center",
    shadowOffset: {width:0,height:11},
    shadowColor: "rgba(0, 0, 0, 0.05)",
    borderColor: theme.color.primaryColor,
    alignItems:"center"

  },
  logoutButton: {
    backgroundColor: theme.color.black,
    height: 50,
    elevation: 23,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    shadowRadius: 15.19,
    shadowOpacity: 0.57,
    justifyContent: "center",
    shadowOffset: {width:0,height:11},
    shadowColor: "rgba(0, 0, 0, 0.05)",
    borderColor: theme.color.primaryColor,
    alignItems:"center"
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    color: theme.color.white,
    fontFamily: FontFamily.boldFont,
 
  },
  LOGINTEXT: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    color: theme.color.black,
    fontFamily: FontFamily.boldFont,
 
  },
  imagePlaceholder: {
    color: '#999',
    marginBottom: 20,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: "#000",
  },
  passwordContainer: {
    position: "relative",

  },
  togglePassword: {
    position: "absolute",
    right: 10,
    top: 30,
  },
});
