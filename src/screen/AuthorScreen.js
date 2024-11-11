import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../constants/styles';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import AuthorBottom from './AuthorBottom';

export default function AuthorScreen() {
  const navigation = useNavigation();
  const [channels, setChannels] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user_detail } = useSelector((state) => state.userReducer);

  const navigateToBlogDetail = (blog) => {
    navigation.navigate('AuthorBlogView', { blog });
  };

  const fetchChannels = async () => {
    try {
      const response = await axios.get('https://dodgerblue-chinchilla-339711.hostingersite.com/api/admin/channels');
      setChannels(response.data);
    } catch (error) {
      console.error("Error fetching channels:", error);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('https://dodgerblue-chinchilla-339711.hostingersite.com/api/admin/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchChannels(), fetchBlogs()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={theme.color.primaryColor} />
      </View>
    );
  }

  const handleChannelPress = (channel) => {
    navigation.navigate("ChannelVideoScreen", { channel });
  };

  return (
    <>
      {/* Header with User Details */}
      <View style={styles.headerContainer}>
        {user_detail.avatar ? (
          <Image source={{ uri: user_detail.avatar }} style={styles.userAvatar} />
        ) : (
          <View style={styles.placeholderAvatar}>
            <Text style={styles.placeholderText}>{user_detail.name}</Text> 
          </View>
        )}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user_detail.name || 'User Name'}</Text>
          <Text style={styles.userType}>{user_detail.type || 'User Type'}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
          <Image
            style={styles.notificationIcon}
            source={require("../assets/images/Notificatio_icon.png")}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Our New Channels</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.channelContainer}>
          {channels.length > 0 ? (
            channels.map((channel, index) => (
              <TouchableOpacity key={index} style={styles.channelWrapper} onPress={() => handleChannelPress(channel)}>
                <Image
                  source={{ uri: channel.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVNVhyEwYufQjhE49rjKod_J23Cxw5IJgdtQ&s" }}
                  style={styles.channelImage}
                />
                <Text style={styles.channelText}>{channel.title}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noDataText}>No channels available</Text>
          )}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Latest Blogs</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.blogContainer}>
          {blogs.length > 0 ? (
            blogs.map((blog, index) => (
              <TouchableOpacity key={index} style={styles.blogCard}>
                <Image source={{ uri: blog.image }} style={styles.blogImage} />
                <Text style={styles.blogTitle}>{blog.title}</Text>
                <Text numberOfLines={2} style={styles.blogDescription}>{blog.description}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noDataText}>No blogs available</Text>
          )}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Blog</Text>
        </View>
        <View style={styles.myBlogContainer}>
          <Text style={styles.noDataText}>You haven't posted any blogs yet.</Text>
        </View>
      </ScrollView>

      <AuthorBottom />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.white,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.color.white,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  placeholderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.color.black,
  },
  userType: {
    fontSize: 12,
    color: '#666',
  },
  notificationIcon: {
    width: 24,
    height: 24,
    tintColor: theme.color.black,
  },
  sectionHeader: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  channelContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  channelWrapper: {
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  channelImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  channelText: {
    color: theme.color.white,
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: theme.color.black,
    textAlign: 'center',
  },
  blogContainer: {
    paddingLeft: 15,
    marginBottom: 20,
  },
  blogCard: {
    width: 200,
    marginRight: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  blogImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  blogTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginVertical: 5,
    color: '#000',
  },
  blogDescription: {
    fontSize: 12,
    color: '#333',
  },
  myBlogContainer: {
    padding: 15,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});
