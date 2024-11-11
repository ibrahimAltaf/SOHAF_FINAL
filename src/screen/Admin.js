import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { theme } from "../constants/styles";
import AdminBottom from "./AdminBottom";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import axios from "axios";
import Header from "../component/Header/header";

const Admin = () => {
  const navigation = useNavigation();
  const [authors, setAuthors] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const { access_token } = useSelector((state) => state.userReducer);

  const handleApprovalPress = (user) => {
    navigation.navigate("ApprovelView", { userId: user.id });
  };

  const handleChannelPress = (channel) => {
    navigation.navigate("ChannelVideoScreen", { channel });
  };

  const navigateToBlogDetail = (blog) => {
    navigation.navigate('BlogDetails', { blog });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([GETPENDINGAUTHORS(), GETBLOGS(), FETCHCHANNELS()]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      const response = await axios.get("https://dodgerblue-chinchilla-339711.hostingersite.com/api/admin/blogs");
      setBlogs(response.data);
    } catch (error) {
      console.error("Error in GETBLOGS API:", error);
    }
  };

  const FETCHCHANNELS = async () => {
    try {
      const response = await axios.get("https://dodgerblue-chinchilla-339711.hostingersite.com/api/admin/channels");
      setChannels(response.data);
    } catch (error) {
      console.error("Error in FETCHCHANNELS API:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={theme.color.primaryColor} />
      </View>
    );
  }

  return (
    <>
               <Header title="Sohaf Admin"  backPage={() => navigation.goBack()} />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.liveHeader}>
            <Text style={styles.liveText}>Our New Channels</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.liveNewsContainer}>
            {channels.length > 0 ? (
              channels.map((channel, index) => (
                <TouchableOpacity key={index} onPress={() => handleChannelPress(channel)}>
                  <View style={styles.logoWrapper}>
                    <Image source={{ uri: channel.image || "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/24/a7/72/24a77254-9002-9999-c101-081f662035e8/AppIcon-0-0-1x_U007emarketing-0-8-0-P3-85-220.png/1200x630wa.png" }} style={styles.logo} />
                    <Text style={styles.logoText}>{channel.title}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noDataText}>No channels available</Text>
            )}
          </ScrollView>
          
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Blog</Text>
            <TouchableOpacity onPress={() => navigation.navigate("BlogList")}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.blogContainer}>
            {blogs.length > 0 ? (
              blogs.map((blog, index) => (
                <TouchableOpacity key={index} style={styles.blogCard} onPress={() => navigateToBlogDetail(blog)}>
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
            <Text style={styles.sectionTitle}>Waiting for Approvals</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Approvals")}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.approvalsContainer}>
            {authors.length > 0 ? (
              authors.map((user, index) => (
                <TouchableOpacity key={index} style={styles.approvalCard} onPress={() => handleApprovalPress(user)}>
                  <Image source={{ uri: user.avatar }} style={styles.approvalImage} />
                  <Text style={styles.approvalName}>{user.name}</Text>
                  <Text style={styles.approvalRole}>View details</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noDataText}>No pending authors</Text>
            )}
          </ScrollView>
        </View>
      </ScrollView>
      <AdminBottom />
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
    backgroundColor: '#fff',
  },
  liveHeader: {
 
    paddingVertical: 15,
    paddingHorizontal: 10,
  
  },
  liveText: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.color.black,
  },
  liveNewsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    height: "auto",
  },
  logoWrapper: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  logoText: {
    color: "#ffff",
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
    backgroundColor: "red",
    paddingHorizontal: 10,
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
    color: theme.color.black,
  },
  viewAll: {
    color: theme.color.primaryColor,
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
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    padding: 10,
    height: "auto",
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
    color: theme.color.black,
    fontWeight: "600",
  },
  blogDescription: {
    fontSize: 12,
    color: theme.color.textColor,
    marginVertical: 5,
  },
  approvalsContainer: {
    marginTop: 10,
    paddingLeft: 10,
  },
  approvalCard: {
    width: 120,
    marginRight: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    height: 150,
  },
  approvalImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  approvalName: {
    fontSize: 12,
    color: theme.color.black,
    marginTop: 5,
    fontWeight: "600",
  },
  approvalRole: {
    fontSize: 12,
    color: theme.color.textColor,
    marginTop: 5,
  },
  noDataText: {
    fontSize: 14,
    color: theme.color.textColor,
    fontStyle: 'italic',
    margin: 10,
  },
});

export default Admin;
