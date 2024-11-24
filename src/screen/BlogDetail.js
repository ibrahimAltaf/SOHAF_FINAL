import { StyleSheet, Text, View, Image, TouchableOpacity, ToastAndroid, ScrollView, useColorScheme } from 'react-native';
import React, { useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Header from '../component/Header/header';
import { useThemeContext } from '../../ThemeContext';

export default function BlogDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const { blog } = route.params;
  const [isApproved, setIsApproved] = useState(false); // State to handle button visibility
  const { user_detail } = useSelector((state) => state.userReducer);
  const { isDarkMode, toggleTheme } = useThemeContext(); // Access dark mode from context

  const colors = {
    background: isDarkMode ? '#121212' : '#fff',
    textPrimary: isDarkMode ? '#FFD700' : '#333',
    textSecondary: isDarkMode ? '#bbb' : '#666',
    buttonBackground: isDarkMode ? '#FFD700' : '#333',
    buttonText: isDarkMode ? '#000' : '#fff',
  };

  // Function to handle blog approval
  const approveBlog = async () => {
    try {
      const response = await axios.post(
        `https://dodgerblue-chinchilla-339711.hostingersite.com/api/admin/blogs/approve/${blog.id}`,
        {
          status: 'approved',
        }
      );
      console.log('Blog approved:', response.data);
      ToastAndroid.show('تمت الموافقة على المدونة بنجاح!', ToastAndroid.SHORT);
      setIsApproved(true); // Hide the approve button
    } catch (error) {
      console.error('Error approving blog:', error);
      ToastAndroid.show('فشل في الموافقة على المدونة.', ToastAndroid.SHORT);
    }
  };

  return (
    <>
      {/* Header Component */}
      <Header title={"المدونة"} backArrow backPage={() => navigation.goBack()} />

      {/* Blog Details */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollViewContent,
          { backgroundColor: colors.background },
        ]}
      >
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          {/* Blog Image */}
          <Image source={{ uri: blog.image }} style={styles.blogImage} />

          {/* Blog Title */}
          <Text style={[styles.blogTitle, { color: colors.textPrimary }]}>
            {blog.title}
          </Text>

          {/* Blog Description */}
          <Text style={[styles.blogDescription, { color: colors.textSecondary }]}>
            {blog.description}
          </Text>

          {/* Approve Blog Button (only for admin users and if not yet approved) */}
          {user_detail.type === 'admin' && !isApproved && (
            <TouchableOpacity
              onPress={approveBlog}
              style={[
                styles.approveButton,
                { backgroundColor: colors.buttonBackground },
              ]}
            >
              <Text style={[styles.buttonText, { color: colors.buttonText }]}>
                الموافقة على المدونة
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  blogImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  blogTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'right', // Arabic alignment
  },
  blogDescription: {
    fontSize: 14,
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'right', // Arabic alignment
  },
  approveButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
