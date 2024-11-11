import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../component/Header/header';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { theme } from '../constants/styles';
import { TextInput, useTheme } from 'react-native-paper';
import AdminBottom from './AdminBottom';

export default function AuthorBlogView(props) {
  const route = useRoute();
  const { userId } = route.params || {};
  const navigation = useNavigation();
  const { colors, dark } = useTheme();

  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
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
          setLoading(false);
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
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        navigation.goBack();
      }, 3000);
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Failed to approve user. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="xl" color={theme.color.black} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>No user data found.</Text>
      </View>
    );
  }

  return (
    <>
      <Header title="Approvals" backArrow backPage={() => props.navigation.goBack()} />

      <View style={styles.container}>
        <View style={styles.userCard}>
          <Image source={{ uri: user.avatar }} style={styles.userImage} />
          <View style={styles.userDetails}>
            <TextInput
              label="Name"
              value={user.name}
              mode="outlined"
              outlineColor="#000"
              activeOutlineColor="#000"
              style={styles.input}
              editable={false}
              placeholderTextColor={dark ? "#fff" : "#000"}
            />

            <TextInput
              label="Email"
              value={user.email}
              mode="outlined"
              outlineColor="#000"
              activeOutlineColor="#000"
              style={styles.input}
              editable={false}
              placeholderTextColor={dark ? "#fff" : "#000"}
            />

            <TextInput
              label="Phone"
              value={user.phone || 'Not Available'}
              mode="outlined"
              outlineColor="#000"
              activeOutlineColor="#000"
              style={styles.input}
              editable={false}
              placeholderTextColor={dark ? "#fff" : "#000"}
            />

            <TextInput
              label="Status"
              value={user.status}
              mode="outlined"
              outlineColor="#000"
              activeOutlineColor="#000"
              style={styles.input}
              editable={false}
              placeholderTextColor={dark ? "#fff" : "#000"}
            />
          </View>
        </View>

     
      </View>

      <AdminBottom />

   
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#555',
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
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginVertical: 10,
    fontSize:12,
    color:theme.color.black

  },
  approveButton: {
    backgroundColor: theme.color.black,
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
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: 300,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
