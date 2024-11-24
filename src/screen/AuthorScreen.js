import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import AuthorBottom from './AuthorBottom';
import { useThemeContext } from '../../ThemeContext';
import { theme } from '../constants/styles';

export default function AuthorScreen() {
  const navigation = useNavigation();
  const [channels, setChannels] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user_detail } = useSelector((state) => state.userReducer);
  const { isDarkMode, toggleTheme } = useThemeContext(); // الوصول إلى الوضع المظلم و toggleTheme من السياق

  const navigateToBlogDetail = (blog) => {
    navigation.navigate('AuthorBlogView', { blog });
  };

  const fetchChannels = async () => {
    try {
      const response = await axios.get('https://dodgerblue-chinchilla-339711.hostingersite.com/api/admin/channels');
      setChannels(response.data);
    } catch (error) {
      console.error("خطأ في جلب القنوات:", error);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('https://dodgerblue-chinchilla-339711.hostingersite.com/api/admin/blogs/approved');
      const reversedData = response.data.reverse();
    setBlogs(reversedData);
    } catch (error) {
      console.error("خطأ في جلب المدونات:", error);
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

  const handleChannelPress = (channel) => {
    navigation.navigate("ChannelVideoScreen", { channel });
  };

  return (
    <>
      {/* رأس الصفحة مع تفاصيل المستخدم */}
      <View style={styles(isDarkMode).headerContainer}>
      {
  user_detail.avatar ? (
    <Image source={{ uri: user_detail.avatar }} style={styles(isDarkMode).userAvatar} />
  ) : (
    <View style={styles(isDarkMode).placeholderAvatar}>
      {/* Placeholder Image */}
      <Image
        source={require('../assets/images/user.png')} // Path to your placeholder image
        style={styles(isDarkMode).userAvatar}
      />
    </View>
  )
}

        <View style={styles(isDarkMode).userInfo}>
          <Text style={styles(isDarkMode).userName}>{user_detail.name || 'اسم المستخدم'}</Text>
          <Text style={styles(isDarkMode).userType}>{user_detail.type || 'نوع المستخدم'}</Text>
        </View>
        {/* <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
          <Image
            style={styles(isDarkMode).notificationIcon}
            source={require("../assets/images/Notificatio_icon.png")}
          />
        </TouchableOpacity> */}
      </View>
      {loading ? (
        <View style={styles(isDarkMode).loaderContainer}>
          <ActivityIndicator size="large" color={isDarkMode ? '#FFF' : '#000'} />
        </View>
      ) : (
        <ScrollView style={styles(isDarkMode).container}>
          <View style={styles(isDarkMode).sectionHeader}>
            <Text style={styles(isDarkMode).sectionTitle}>قنواتنا الجديدة</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles(isDarkMode).channelContainer}>
            {channels.length > 0 ? (
              channels.map((channel, index) => (
                <TouchableOpacity key={index} style={styles(isDarkMode).channelWrapper} onPress={() => handleChannelPress(channel)}>
                  <Image
                    source={{ uri: channel.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVNVhyEwYufQjhE49rjKod_J23Cxw5IJgdtQ&s" }}
                    style={styles(isDarkMode).channelImage}
                  />
                  <Text style={styles(isDarkMode).channelText}>{channel.title}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles(isDarkMode).noDataText}>لا توجد قنوات متاحة</Text>
            )}
          </ScrollView>

          <View style={styles(isDarkMode).sectionHeader}>
            <Text style={styles(isDarkMode).sectionTitle}>آخر المدونات</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles(isDarkMode).blogContainer}>
            {blogs.length > 0 ? (
              blogs.map((blog, index) => (
                <TouchableOpacity onPress={() => navigation.navigate("BlogDetails", { blog })} key={index} style={styles(isDarkMode).blogCard}>
                  <Image source={{ uri: blog.image }} style={styles(isDarkMode).blogImage} />
                  <Text style={styles(isDarkMode).blogTitle}>{blog.title}</Text>
                  <Text numberOfLines={2} style={styles(isDarkMode).blogDescription}>{blog.description}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles(isDarkMode).noDataText}>لا توجد مدونات متاحة</Text>
            )}
          </ScrollView>

          <View style={styles(isDarkMode).sectionHeader}>
            <Text style={styles(isDarkMode).sectionTitle}>مدونتي</Text>
          </View>
          <View style={styles(isDarkMode).myBlogContainer}>
            <Text style={styles(isDarkMode).noDataText}>لم تقم بنشر أي مدونات بعد.</Text>
          </View>
        </ScrollView>
      )}

      <AuthorBottom />
    </>
  );
}

const styles = (isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#121212' : '#FFF',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDarkMode ? '#121212' : '#FFF',
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: isDarkMode ? '#333' : '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#555' : '#EEE',
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
    backgroundColor: isDarkMode ? '#666' : '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: isDarkMode ? '#FFF' : '#000',
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
    color: isDarkMode ? '#FFF' : '#000',
  },
  userType: {
    fontSize: 12,
    color: isDarkMode ? '#AAA' : '#666',
  },
  notificationIcon: {
    width: 24,
    height: 24,
    tintColor: isDarkMode ? '#FFF' : '#000',
  },
  sectionHeader: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFF' : '#000',
  },
  channelContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 20,
},
  channelWrapper: {
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: isDarkMode ? '#333' : theme.color.primaryColor,
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
    color: isDarkMode ? '#FFF' : '#000',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: isDarkMode ? '#444' : '#EEE',
    textAlign: 'center',
  },
  blogContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical:20,
  },
  blogCard: {
    width: 200,
    marginRight: 15,
    backgroundColor: isDarkMode ? '#333' : '#FFF',
    borderRadius: 10,
    overflow: 'hidden',
    // Box shadow for iOS
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow direction
    shadowOpacity: 0.25, // Opacity of shadow
    shadowRadius: 3.84, // Blur radius
    // Box shadow for Android
    elevation: 5,
    marginBottom:10,
  },
  
  blogImage: {
    width: '100%',
    height: 120,
  },
  blogTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: isDarkMode ? '#FFF' : '#000',
    padding: 10,
  },
  blogDescription: {
    fontSize: 12,
    color: isDarkMode ? '#AAA' : '#555',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  myBlogContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  noDataText: {
    fontSize: 14,
    color: isDarkMode ? '#AAA' : '#666',
    textAlign: 'center',
  },
});
