import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ActivityIndicator, ToastAndroid, useColorScheme } from 'react-native';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';
import Header from '../component/Header/header';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';
import AdminBottom from './AdminBottom';
import { FontFamily } from '../constants/fonts';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { SetUserDetail, SetUserToken } from "../Redux/actions/actions";
import { theme } from '../constants/styles';
import { useThemeContext } from '../../ThemeContext';

export default function Profile(props) {
  const [activeTab, setActiveTab] = useState('profile');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isDarkMode, toggleTheme } = useThemeContext(); 

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
  });
  const [loading, setLoading] = useState(true);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user_detail,access_token } = useSelector((state) => state.userReducer);

  const backgroundColor = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const cardColor = isDarkMode ? '#333333' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#000000';
  const buttonTextColor = isDarkMode ? '#000000' : '#FFFFFF';
  const placeholderColor = isDarkMode ? '#AAAAAA' : theme.color.black;
  const borderColor = isDarkMode ? '#555555' : '#DCDCDC';
  const userId = user_detail?.id;
  const userRole = user_detail?.type;
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Dynamically create the API URL based on user role and ID
        let apiUrl = '';
        if (userRole === 'admin') {
          apiUrl = `https://dodgerblue-chinchilla-339711.hostingersite.com/api/profile/${userId}/admin`;
        } else if (userRole === 'user') {
          apiUrl = `https://dodgerblue-chinchilla-339711.hostingersite.com/api/profile/${userId}/user`;
        } else if (userRole === 'author') {
          apiUrl = `https://dodgerblue-chinchilla-339711.hostingersite.com/api/profile/${userId}/author`;
        }

        const response = await axios.get(apiUrl);  // Make the API call with the dynamic URL
        const { profile } = response.data;
        setProfile({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          avatar: profile.avatar,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        ToastAndroid.show('Failed to fetch profile.', ToastAndroid.LONG);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId, userRole]); 

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
      // Dynamically create the API URL for saving changes based on user role and ID
      let apiUrl = '';
      if (userRole === 'admin') {
        apiUrl = `https://dodgerblue-chinchilla-339711.hostingersite.com/api/profile/update/${userId}/admin`;
      } else if (userRole === 'user') {
        apiUrl = `https://dodgerblue-chinchilla-339711.hostingersite.com/api/profile/update/${userId}/user`;
      } else if (userRole === 'author') {
        apiUrl = `https://dodgerblue-chinchilla-339711.hostingersite.com/api/profile/update/${userId}/author`;
      }

      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      if (response.data && response.data.success) {
        setUpdateSuccess(true);
        ToastAndroid.show('Profile updated successfully!', ToastAndroid.SHORT);
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
      ToastAndroid.show('Logged out successfully!', ToastAndroid.SHORT);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
      ToastAndroid.show('Failed to log out. Please try again.', ToastAndroid.LONG);
    }
  };


console.log(user_detail.id + "this is user id")
  return (
    <>
          <Header title="الملف الشخصي" backArrow backPage={() => props.navigation.goBack()} />
          {loading ? (

<View style={styles.loaderContainer}>
  <ActivityIndicator size="large" color="#FFD700" />
</View>
) : (
<View style={[styles.container, { backgroundColor }]}>
  <View style={styles.tabs}>
    <TouchableOpacity
      style={[styles.tabButton, activeTab === 'profile' && styles.activeTab]}
      onPress={() => setActiveTab('profile')}
    >
      <Text style={[styles.tabText, { color: textColor }]}>الملف الشخصي</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.tabButton, activeTab === 'changePassword' && styles.activeTab]}
      onPress={() => setActiveTab('changePassword')}
    >
      <Text style={[styles.tabText, { color: textColor }]}>تغيير كلمة المرور</Text>
    </TouchableOpacity>
  </View>

  {activeTab === 'profile' ? (
    <ScrollView contentContainerStyle={styles.profileContent}>
      <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
        {profile.avatar ? (
          <Image source={{ uri: profile.avatar }} style={styles.avatar} />
        ) : (
          <Text style={[styles.imagePlaceholder, { color: placeholderColor }]}>اختر صورة</Text>
        )}
      </TouchableOpacity>
      <TextInput
  label="الاسم"
  value={profile.name}
  activeOutlineColor="black"
  outlineColor="black"

  style={[styles.input, { backgroundColor: cardColor }]}
  
  onChangeText={(text) => setProfile({ ...profile, name: text })}
  textColor={isDarkMode ? theme.color.white : theme.color.black}
  theme={{
    colors: {
      text: isDarkMode ? theme.color.white : theme.color.black,  // Text color based on theme
      placeholder: isDarkMode ? 'white' : 'black',  // Placeholder color dynamically based on theme
      primary: borderColor,  // Border color based on your theme
    },
  }}
/>

      <TextInput
        label="البريد الإلكتروني"
        value={profile.email}
        style={[styles.input, { backgroundColor: cardColor }]}
        textColor={isDarkMode ? theme.color.white : theme.color.black}
  
        editable={false}
        theme={{
          colors: {
            text: textColor,
            placeholder: placeholderColor,
            primary: borderColor,
            label: isDarkMode ? theme.color.white : theme.color.black, // Label color

          },
        }}
      />
      <TextInput
        label="الهاتف"
        value={profile.phone}
        style={[styles.input, { backgroundColor: cardColor }]}
        textColor={isDarkMode ? theme.color.white : theme.color.black}

        onChangeText={(text) => setProfile({ ...profile, phone: text })}
        theme={{
          colors: {
            text: textColor,
            placeholder: placeholderColor,
            primary: borderColor,
            label: isDarkMode ? theme.color.white : theme.color.black, // Label color

          },
        }}
      />
    </ScrollView>
  ) : (
    <ScrollView contentContainerStyle={styles.changePasswordContent}>
      <View style={styles.passwordContainer}>
        <TextInput
          label="كلمة المرور الحالية"
          value={currentPassword}
          secureTextEntry={!showCurrentPassword}
          style={[styles.input, { backgroundColor: cardColor }]}
          textColor={isDarkMode ? theme.color.white : theme.color.black}
      placeholderTextColor={isDarkMode ? theme.color.white : theme.color.black}
          theme={{
            colors: {
              text: textColor,
              placeholder: isDarkMode ? 'white' : 'black',  // Placeholder color dynamically based on theme
              primary: borderColor,
              label: isDarkMode ? theme.color.white : theme.color.black, // Label color

              
            },
          }}
          onChangeText={setCurrentPassword}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.togglePassword}
          onPress={() => setShowCurrentPassword(!showCurrentPassword)}
        >
          <Image
            style={styles.icon}
            source={showCurrentPassword ? require("../assets/images/hide.png") : require("../assets/images/view.png")}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          label="كلمة المرور الجديدة"
          textColor={isDarkMode ? theme.color.white : theme.color.black}

          value={newPassword}
          secureTextEntry={!showNewPassword}
          style={[styles.input, { backgroundColor: cardColor }]}
          theme={{
            colors: {
              text: textColor,
              placeholder: placeholderColor,
              primary: borderColor,
              label: isDarkMode ? theme.color.white : theme.color.black, // Label color

            },
          }}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.togglePassword}
          onPress={() => setShowNewPassword(!showNewPassword)}
        >
          <Image
            style={styles.icon}
            source={showNewPassword ? require("../assets/images/hide.png") : require("../assets/images/view.png")}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          label="تأكيد كلمة المرور الجديدة"
          value={confirmNewPassword}
          textColor={isDarkMode ? theme.color.white : theme.color.black}

          secureTextEntry={!showConfirmPassword}
          style={[styles.input, { backgroundColor: cardColor }]}
          theme={{
            colors: {
              text: textColor,
              placeholder: placeholderColor,
              primary: borderColor,
              label: isDarkMode ? theme.color.white : theme.color.black, // Label color

            },
          }}
          onChangeText={setConfirmNewPassword}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.togglePassword}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Image
            style={styles.icon}
            source={showConfirmPassword ? require("../assets/images/hide.png") : require("../assets/images/view.png")}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  )}
  
  <View style={styles.buttonContainer}>
    <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.color.primaryColor }]} onPress={handleSaveChanges}>
      <Text style={[styles.LOGINTEXT, { color: buttonTextColor }]}>حفظ التغييرات</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={handleLogout} style={[styles.logoutButton, { backgroundColor: textColor }]}>
      <Text style={[styles.buttonText, { color: buttonTextColor }]}>تسجيل الخروج</Text>
    </TouchableOpacity>
  </View>
</View>
)}
    </>
  );
}

// Styles remain the same

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderBottomColor: theme.color.primaryColor,
  },
  tabText: {
    fontSize: 12,
    fontWeight: 'bold',
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
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonContainer: {
    paddingBottom: 20,
  },
  saveButton: {
    height: 50,
    elevation: 23,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logoutButton: {
    height: 50,
    elevation: 23,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: FontFamily.boldFont,
  },
  LOGINTEXT: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: FontFamily.boldFont,
  },
  imagePlaceholder: {
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
