import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../component/Header/header';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { theme } from '../constants/styles';
import { TextInput } from 'react-native-paper';
import AdminBottom from './AdminBottom';
import { useThemeContext } from '../../ThemeContext';

export default function ApprovalView(props) {
  const route = useRoute();
  const { userId } = route.params || {};
  const navigation = useNavigation();
  const { isDarkMode } = useThemeContext(); // Dark mode from context

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from the API
  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `https://dodgerblue-chinchilla-339711.hostingersite.com/api/profile/${userId}/author`
          );
          setUser(response.data.profile);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);  // Set loading to false when the data is fetched
        }
      };
      fetchUserData();
    }
  }, [userId]);

  const handleApprove = async () => {
    try {
      await axios.post(
        `https://dodgerblue-chinchilla-339711.hostingersite.com/api/admin/authors/status/${userId}`,
        { status: 'approved' }
      );

      setTimeout(() => {
        navigation.goBack();
      }, 3000);
    } catch (error) {
      console.error('Error approving user:', error);
      alert('فشل الموافقة على المستخدم. يرجى المحاولة مرة أخرى.');
    }
  };

  // Loader state: Show loader until data is fetched
  return (
    <>
      <Header title="الموافقات" backArrow backPage={() => props.navigation.goBack()} />
      {loading ? (
        <View style={[styles.loadingContainer, { backgroundColor: isDarkMode ? '#1E1E1E' : '#fff' }]} >
          <ActivityIndicator size="large" color={theme.color.primaryColor} />
        </View>
      ) : (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
          <View style={[styles.userCard, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
            <Image source={{ uri: user.avatar }} style={styles.userImage} />
            <View style={styles.userDetails}>
              <TextInput
                label="الاسم"
                value={user.name}
                mode="outlined"
                outlineColor={isDarkMode ? '#777' : '#000'}
                activeOutlineColor={isDarkMode ? '#fff' : '#000'}
                style={[styles.input, { backgroundColor: isDarkMode ? '#444' : '#fff' }]}
                labelStyle={{ color: isDarkMode ? '#fff' : '#000' }}
                theme={{ colors: { text: isDarkMode ? '#fff' : '#000' }}} 
                editable={false}
                placeholderTextColor={isDarkMode ? "#bbb" : "#000"}
              />

              <TextInput
                label="البريد الإلكتروني"
                value={user.email}
                mode="outlined"
                outlineColor={isDarkMode ? '#777' : '#000'}
                activeOutlineColor={isDarkMode ? '#fff' : '#000'}
                style={[styles.input, { backgroundColor: isDarkMode ? '#444' : '#fff' }]}
                labelStyle={{ color: isDarkMode ? '#fff' : '#000' }}
                theme={{ colors: { text: isDarkMode ? '#fff' : '#000' }}} 
                editable={false}
                placeholderTextColor={isDarkMode ? theme.color.white : "#000"}
              />

              <TextInput
                label="الهاتف"
                value={user.phone || 'غير متوفر'}
                mode="outlined"
                outlineColor={isDarkMode ? '#777' : '#000'}
                activeOutlineColor={isDarkMode ? '#fff' : '#000'}
                style={[styles.input, { backgroundColor: isDarkMode ? '#444' : '#fff' }]}
                labelStyle={{ color: isDarkMode ? '#fff' : '#000' }}
                theme={{ colors: { text: isDarkMode ? '#fff' : '#000' }}} 
                editable={false}
                placeholderTextColor={isDarkMode ? "#bbb" : "#000"}
              />

              <TextInput
                label="الحالة"
                value={user.status}
                mode="outlined"
                outlineColor={isDarkMode ? '#777' : '#000'}
                activeOutlineColor={isDarkMode ? '#fff' : '#000'}
                style={[styles.input, { backgroundColor: isDarkMode ? '#444' : '#fff' }]}
                labelStyle={{ color: isDarkMode ? '#fff' : '#000' }}
                theme={{ colors: { text: isDarkMode ? '#fff' : '#000' }}} 
                editable={false}
                placeholderTextColor={isDarkMode ? "#bbb" : "#000"}
              />
            </View>
          </View>

          {user.status === 'pending' && (
            <TouchableOpacity style={[styles.approveButton, { backgroundColor: isDarkMode ? '#ff9800' : '#000' }]} onPress={handleApprove}>
              <Text style={styles.buttonText}>موافقة</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      <AdminBottom />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userCard: {
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
  },
  userImage: {
    width: 130,
    height: 130,
    borderRadius: 100,
    alignSelf: 'center',
    marginBottom: 15,
  },
  userDetails: {
    marginTop: 10,
  },
  input: {
    borderRadius: 10,
    marginVertical: 10,
    fontSize: 14,
  },
  approveButton: {
    borderRadius: 5,
    padding: 12,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
    maxWidth: 400,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

