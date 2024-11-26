import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';
import Header from '../component/Header/header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useThemeContext } from '../../ThemeContext';
import { theme } from '../constants/styles';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const navigation = useNavigation();
  const { isDarkMode } = useThemeContext();
  const { user_detail } = useSelector((state) => state.userReducer);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
  });

  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const themeStyles = {
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    cardColor: isDarkMode ? '#333333' : '#FFFFFF',
    textColor: isDarkMode ? '#FFFFFF' : '#000000',
    placeholderColor: isDarkMode ? '#AAAAAA' : '#666666',
    borderColor: isDarkMode ? '#555555' : '#DCDCDC',
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user_detail?.id) return;
      try {
        setLoading(true);
        const apiUrl = `https://dodgerblue-chinchilla-339711.hostingersite.com/api/profile/${user_detail.id}/${user_detail.type}`;
        const response = await axios.get(apiUrl);
        setProfile(response.data.profile);
      } catch (error) {
        ToastAndroid.show('Failed to fetch profile.', ToastAndroid.LONG);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user_detail]);

  const handleSaveChanges = async () => {
    const formData = new FormData();
    formData.append('name', profile.name);
    formData.append('phone', profile.phone);

    if (profile.avatar) {
      formData.append('avatar', {
        uri: profile.avatar,
        name: 'avatar.jpg',
        type: 'image/jpeg',
      });
    }

    try {
      setLoading(true);
      const apiUrl = `https://dodgerblue-chinchilla-339711.hostingersite.com/api/profile/update/${user_detail.id}/${user_detail.type}`;
      const response = await axios.post(apiUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data?.success) {
        ToastAndroid.show('Profile updated successfully!', ToastAndroid.SHORT);
      } else {
        ToastAndroid.show('Failed to update profile.', ToastAndroid.LONG);
      }
    } catch (error) {
      ToastAndroid.show('Failed to update profile.', ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmNewPassword) {
      ToastAndroid.show('Passwords do not match.', ToastAndroid.SHORT);
      return;
    }

    try {
      setLoading(true);
      const apiUrl = `https://dodgerblue-chinchilla-339711.hostingersite.com/api/password/change`;
      const response = await axios.post(apiUrl, {
        currentPassword,
        newPassword,
      });

      if (response.data?.success) {
        ToastAndroid.show('Password changed successfully!', ToastAndroid.SHORT);
      } else {
        ToastAndroid.show('Failed to change password.', ToastAndroid.LONG);
      }
    } catch (error) {
      ToastAndroid.show('Error changing password.', ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets?.length) {
        setProfile({ ...profile, avatar: response.assets[0].uri });
      }
    });
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      ToastAndroid.show('Logged out successfully!', ToastAndroid.SHORT);
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch {
      ToastAndroid.show('Failed to log out.', ToastAndroid.LONG);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <Header title="الملف الشخصي" backArrow backPage={() => navigation.goBack()} />
      {loading ? (
        <ActivityIndicator size="large" color="#FFD700" style={styles.loader} />
      ) : (
        <>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'profile' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('profile')}
            >
              <Text style={{ color: themeStyles.textColor }}>الملف الشخصي</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'changePassword' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('changePassword')}
            >
              <Text style={{ color: themeStyles.textColor }}>تغيير كلمة المرور</Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'profile' ? (
            <ScrollView contentContainerStyle={styles.profileContent}>
              <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
                {profile.avatar ? (
                  <Image source={{ uri: profile.avatar }} style={styles.avatar} />
                ) : (
                  <Text style={[styles.imagePlaceholder, { color: themeStyles.placeholderColor }]}>
                    اختر صورة
                  </Text>
                )}
              </TouchableOpacity>

              <View style={styles.field}>
                <Text style={[styles.label, { color: themeStyles.textColor }]}>الاسم</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: themeStyles.cardColor,
                      color: themeStyles.textColor,
                      borderColor: themeStyles.borderColor,
                    },
                  ]}
                  value={profile.name}
                  placeholder="Enter your name"
                  placeholderTextColor={themeStyles.placeholderColor}
                  onChangeText={(text) => setProfile({ ...profile, name: text })}
                />
              </View>

              <View style={styles.field}>
                <Text style={[styles.label, { color: themeStyles.textColor }]}>البريد الإلكتروني</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: themeStyles.cardColor,
                      color: themeStyles.textColor,
                      borderColor: themeStyles.borderColor,
                    },
                  ]}
                  value={profile.email}
                  editable={false}
                />
              </View>

              <View style={styles.field}>
                <Text style={[styles.label, { color: themeStyles.textColor }]}>الهاتف</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: themeStyles.cardColor,
                      color: themeStyles.textColor,
                      borderColor: themeStyles.borderColor,
                    },
                  ]}
                  value={profile.phone}
                  placeholder="رقم الهاتف"
                  placeholderTextColor={themeStyles.placeholderColor}
                  onChangeText={(text) => setProfile({ ...profile, phone: text })}
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                <Text style={styles.saveButtonText}>حفظ التغييرات</Text>
              </TouchableOpacity>
            </ScrollView>
          ) : (
            <ScrollView contentContainerStyle={styles.passwordContent}>
              <View style={styles.field}>
                <Text style={[styles.label, { color: themeStyles.textColor }]}>
                  كلمة المرور الحالية
                </Text>
                <TextInput
                  secureTextEntry={!showPassword.current}
                  style={[
                    styles.input,
                    {
                      backgroundColor: themeStyles.cardColor,
                      color: themeStyles.textColor,
                      borderColor: themeStyles.borderColor,
                    },
                  ]}
                  value={currentPassword}
                  placeholder="كلمة المرور الحالية"
                  placeholderTextColor={themeStyles.placeholderColor}
                  onChangeText={setCurrentPassword}
                />
              </View>

              <View style={styles.field}>
                <Text style={[styles.label, { color: themeStyles.textColor }]}>
                  كلمة المرور الجديدة
                </Text>
                <TextInput
                  secureTextEntry={!showPassword.new}
                  style={[
                    styles.input,
                    {
                      backgroundColor: themeStyles.cardColor,
                      color: themeStyles.textColor,
                      borderColor: themeStyles.borderColor,
                    },
                  ]}
                  value={newPassword}
                  placeholder="كلمة المرور الجديدة"
                  placeholderTextColor={themeStyles.placeholderColor}
                  onChangeText={setNewPassword}
                />
              </View>

              <View style={styles.field}>
                <Text style={[styles.label, { color: themeStyles.textColor }]}>
                  تأكيد كلمة المرور
                </Text>
                <TextInput
                  secureTextEntry={!showPassword.confirm}
                  style={[
                    styles.input,
                    {
                      backgroundColor: themeStyles.cardColor,
                      color: themeStyles.textColor,
                      borderColor: themeStyles.borderColor,
                    },
                  ]}
                  value={confirmNewPassword}
                  placeholder="تأكيد كلمة المرور"
                  placeholderTextColor={themeStyles.placeholderColor}
                  onChangeText={setConfirmNewPassword}
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handlePasswordChange}>
                <Text style={styles.saveButtonText}>تغيير كلمة المرور</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>تسجيل الخروج</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ddd' },
  tabButton: { flex: 1, padding: 10, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#FFD700' },
  profileContent: { padding: 20 },
  passwordContent: { padding: 20 },
  field: { marginBottom: 15 },
  label: { fontSize: 14, marginBottom: 5 },
  input: { height: 45, borderWidth: 1, borderRadius: 5, paddingHorizontal: 10 },
  avatarContainer: { alignItems: 'center', marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  imagePlaceholder: { fontSize: 14 },
  saveButton: { backgroundColor: '#FFD700', padding: 15, alignItems: 'center', borderRadius: 8 },
  saveButtonText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
  logoutButton: {
    backgroundColor: theme.color.black,
    padding: 15,
    alignItems: 'center',
    margin: 20,
    borderRadius: 8,
  },
  logoutButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});
