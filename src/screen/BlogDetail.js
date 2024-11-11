import { StyleSheet, Text, View, Image, TouchableOpacity, ToastAndroid, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { theme } from '../constants/styles';
import Header from '../component/Header/header';

export default function BlogDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const { blog } = route.params;
  const [isApproved, setIsApproved] = useState(false); // State to handle button visibility
  const { user_detail } = useSelector((state) => state.userReducer); 
  
  // Function to handle blog approval
  const approveBlog = async () => {
    try {
      // API call to approve the blog
      const response = await axios.post(
        `https://dodgerblue-chinchilla-339711.hostingersite.com/api/admin/blogs/approve/${blog.id}`,
        {
          status: 'approved',
        }
      );
      console.log('Blog approved:', response.data);
      ToastAndroid.show('Blog approved successfully!', ToastAndroid.SHORT);
      setIsApproved(true); // Hide the approve button
    } catch (error) {
      console.error('Error approving blog:', error);
      ToastAndroid.show('Failed to approve blog.', ToastAndroid.SHORT);
    }
  };

  return (
    <>
      {/* Header Component */}
      <Header title={"Blog"} backArrow backPage={() => navigation.goBack()} />

      {/* Blog Details */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          {/* Blog Image */}
          <Image source={{ uri: blog.image }} style={styles.blogImage} />

          {/* Blog Title */}
          <Text style={styles.blogTitle}>{blog.title}</Text>

          {/* Blog Description */}
          <Text style={styles.blogDescription}>{blog.description}</Text>

          {/* Approve Blog Button (only for admin users and if not yet approved) */}
          {user_detail.type === 'admin' && !isApproved && (
            <TouchableOpacity onPress={approveBlog} style={styles.approveButton}>
              <Text style={styles.buttonText}>Approve Blog</Text>
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
    backgroundColor: '#fff',
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
    color: theme.color.black,
    textAlign: 'left',
  },
  blogDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'justify',
  },
  approveButton: {
    backgroundColor: theme.color.black,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
