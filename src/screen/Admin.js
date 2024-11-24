import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, ActivityIndicator, useColorScheme } from "react-native";
import { theme } from "../constants/styles";
import AdminBottom from "./AdminBottom";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import axios from "axios";
import Header from "../component/Header/header";
import { useThemeContext } from "../../ThemeContext";

const Admin = () => {
  const navigation = useNavigation();
  const [authors, setAuthors] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);  // Initially loading is true
  const { access_token } = useSelector((state) => state.userReducer);
  const colorScheme = useColorScheme();
  const { isDarkMode, toggleTheme } = useThemeContext(); // Access dark mode from context

  const backgroundColor = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : theme.color.black;
  const secondaryTextColor = isDarkMode ? '#AAAAAA' : theme.color.textColor;
  const cardBackgroundColor = isDarkMode ? theme.color.primaryColor : theme.color.primaryColor;

  const handleApprovalPress = (user) => {
    navigation.navigate("ApprovelView", { userId: user.id });
  };

  const handleChannelPress = (channel) => {
    navigation.navigate("ChannelVideoScreen", { channel });
  };

  const navigateToBlogDetail = (blog) => {
    navigation.navigate("BlogDetails", { blog });
  };

  const fetchData = async () => {
    try {
      await Promise.all([GETPENDINGAUTHORS(), GETBLOGS(), FETCHCHANNELS()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data on initial load
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();  // Fetch data every 2 seconds
    }, 2000);

    // Fetch initial data first
    fetchData();

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures it only runs once when the component mounts

  const GETPENDINGAUTHORS = async () => {
    try {
      const response = await axios.get("https://dodgerblue-chinchilla-339711.hostingersite.com/api/admin/authors/pending", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      setAuthors(response.data);
    } catch (error) {
      console.error("Error in GETPENDINGAUTHORS API:", error);
    }
  };

  const GETBLOGS = async () => {
    try {
      const response = await axios.get("https://dodgerblue-chinchilla-339711.hostingersite.com/api/admin/blogs/pending");
      setBlogs(response.data);
    } catch (error) {
      console.error("Error in GETBLOGS API:", error);
    }
  };

  const FETCHCHANNELS = async () => {
    try {
      const response = await axios.get("https://dodgerblue-chinchilla-339711.hostingersite.com/api/admin/channels");
      setChannels(response.data);
      setLoading(false);  // Set loading to false after data is fetched
    } catch (error) {
      console.error("Error in FETCHCHANNELS API:", error);
      setLoading(false);  // Make sure loading is set to false even if there's an error
    }
  };


  return (
    <>
      <Header title="صُحف المسؤول" backPage={() => navigation.goBack()} />
      {/* Loader will cover only content section */}
      <View style={{ flex: 1, backgroundColor }}>
        {loading ? (
          <View style={[styles.loaderContainer, { backgroundColor }]}>
            <ActivityIndicator size="large" color={theme.color.primaryColor} />
          </View>
        ) : (
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.container}>
              {/* Live Channels Section */}
              <View style={styles.liveHeader}>
                <Text style={[styles.liveText, { color: textColor }]}>قنواتنا الجديدة</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.liveNewsContainer}>
                {channels.length > 0 ? (
                  channels.map((channel, index) => (
                    <TouchableOpacity key={index} onPress={() => handleChannelPress(channel)}>
                      <View style={[styles.logoWrapper, { backgroundColor: cardBackgroundColor }]}>
                        <Image
                          source={{ uri: channel.image || "https://via.placeholder.com/60" }}
                          style={styles.logo}
                        />
                        <Text style={[styles.logoText, { color: textColor }]}>{channel.title}</Text>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={[styles.noDataText, { color: secondaryTextColor }]}>لا توجد قنوات متاحة</Text>
                )}
              </ScrollView>

              {/* Blogs Section */}
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>أحدث المدونات</Text>
                <TouchableOpacity onPress={() => navigation.navigate("BlogList")}>
                  <Text style={[styles.viewAll, { color: theme.color.primaryColor }]}>عرض الكل</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.blogContainer}>
                {blogs.length > 0 ? (
                  blogs.map((blog, index) => (
                    <TouchableOpacity key={index} style={[styles.blogCard, { backgroundColor: cardBackgroundColor }]} onPress={() => navigateToBlogDetail(blog)}>
                      <Image source={{ uri: blog.image || "https://via.placeholder.com/220x90" }} style={styles.blogImage} />
                      <Text style={[styles.blogTitle, { color: textColor }]}>{blog.title}</Text>
                      <Text numberOfLines={2} style={[styles.blogDescription, { color: secondaryTextColor }]}>{blog.description}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={[styles.noDataText, { color: secondaryTextColor }]}>لا توجد مدونات متاحة</Text>
                )}
              </ScrollView>

              {/* Pending Author Approvals Section */}
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>في انتظار الموافقات</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Aprrvoles")}>
                  <Text style={[styles.viewAll, { color: theme.color.primaryColor }]}>عرض الكل</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.approvalsContainer}>
                {authors.length > 0 ? (
                  authors.map((user, index) => (
                    <TouchableOpacity key={index} style={[styles.approvalCard, { backgroundColor: cardBackgroundColor }]} onPress={() => handleApprovalPress(user)}>
                      <Image source={{ uri: user.avatar || "https://via.placeholder.com/70" }} style={styles.approvalImage} />
                      <Text style={[styles.approvalName, { color: textColor }]}>{user.name}</Text>
                      <Text style={[styles.approvalRole, { color: secondaryTextColor }]}>عرض التفاصيل</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={[styles.noDataText, { color: secondaryTextColor }]}>لا يوجد مؤلفون بانتظار الموافقة</Text>
                )}
              </ScrollView>
            </View>
          </ScrollView>
        )}
        <AdminBottom />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveHeader: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  liveText: {
    fontSize: 18,
    fontWeight: '900',
  },
  liveNewsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    height: "auto",
  },
  logoWrapper: {
    alignItems: 'center',
    marginHorizontal: 10,
    padding: 10,
    width:90,
    height:100,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 5,
  
    marginBottom:15,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  logoText: {
    fontSize:9,
    fontWeight: 'bold',
    marginTop: 5,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  viewAll: {
    fontSize: 16,
    fontWeight: "900",
  },
  blogContainer: {
    marginTop: 10,
    paddingLeft: 10,
    height: "auto",
  },
  blogCard: {
    width: 220,
    marginRight: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    padding: 10,
    height: "auto",
    marginBottom:15,
    elevation: 5,
  },
  blogImage: {
    width: '100%',
    height: 90,
    borderRadius: 10,
    objectFit: "contain",
  },
  blogTitle: {
    fontSize: 14,
    marginVertical: 5,
    fontWeight: "bold",
  },
  blogDescription: {
    fontSize: 12,
    color: '#888',
  },
  approvalsContainer: {
    marginTop: 10,
    paddingLeft: 10,
    height: "auto",
  },
  approvalCard: {
    width: 70,
    height: 90,
    marginRight: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    padding: 10,
    elevation: 5,
  },
  approvalImage: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  approvalName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5,
  },
  approvalRole: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 14,
    fontWeight: "900",
    color: '#888',
    textAlign: 'center',
  },
});

export default Admin;
