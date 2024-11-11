import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions, BackHandler } from "react-native";
import { theme } from "../constants/styles";
import axios from "axios";
import CustomStatusBar from "../component/StatusBar/customStatusBar";
import AdminBottom from "./AdminBottom";
import YoutubePlayer from "react-native-youtube-iframe";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import VisitorBottom from "./VisitorBottom";

export default function Visitor() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [channels, setChannels] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const { access_token, user_detail } = useSelector((state) => state.userReducer);

  const handleChannelPress = (channel) => {
    navigation.navigate("ChannelVideoScreen", { channel });
  };

  const navigateToBlogDetail = (blog) => {
    navigation.navigate('BlogDetails', { blog });
  };

  useEffect(() => {
    fetchData();
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to exit?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([FETCHCHANNELS(), GETBLOGS()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const FETCHCHANNELS = async () => {
    const response = await axios.get("https://dodgerblue-chinchilla-339711.hostingersite.com/api/admin/channels");
    setChannels(response.data);
  };

  const GETBLOGS = async () => {
    const response = await axios.get("https://dodgerblue-chinchilla-339711.hostingersite.com/api/admin/blogs");
    setBlogs(response.data);
  };

  const extractVideoId = (iframeLink) => {
    const match = iframeLink.match(/embed\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  if (loading) {
    return <ActivityIndicator size="large" color={theme.color.primaryColor} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
  }

  return (
    <>
      {/* Header with User Image, Name, and Notification Icon */}
      <View style={styles.headerContainer}>
        {user_detail.avatar ? (
          <Image source={{ uri: user_detail.avatar }} style={styles.userAvatar} />
        ) : (
          <View style={styles.placeholderAvatar} />
        )}
        <Text style={styles.userName}>{user_detail.name}</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
          <Image style={{
            width:25,
            height:25,
            objectFit:"contain",
            tintColor:theme.color.black
          }} source={require("../assets/images/Notificatio_icon.png")} />
        </TouchableOpacity>
      </View>

      <View style={styles.liveHeader}>
        <Text style={styles.liveText}>My Subscribe</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.liveNewsContainer}>
        {channels.map((channel, index) => (
          <TouchableOpacity key={index} onPress={() => handleChannelPress(channel)}>
            <View style={styles.logoWrapper}>
              <Image source={{ uri: channel.image || "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/24/a7/72/24a77254-9002-9999-c101-081f662035e8/AppIcon-0-0-1x_U007emarketing-0-8-0-P3-85-220.png/1200x630wa.png" }} style={styles.logo} />
              <Text style={styles.logoText}>{channel.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView>
        <View style={styles.container}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Live News</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {channels.map((channel) => {
              const videoId = extractVideoId(channel.link);
              return (
                <View key={channel.id} style={styles.videoWrapper}>
                  <YoutubePlayer
                    height={200}
                    width={Dimensions.get("window").width * 0.8}
                    videoId={videoId}
                  />
                </View>
              );
            })}
          </ScrollView>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Blogs</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.blogContainer}>
            {blogs.map((blog, index) => (
              <TouchableOpacity key={index} style={styles.blogCard} onPress={() => navigateToBlogDetail(blog)}> 
                <Image source={{ uri: blog.image }} style={styles.blogImage} />
                <Text style={styles.blogTitle}>{blog.title}</Text>
                <Text numberOfLines={2} style={styles.blogDescription}>{blog.description}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <VisitorBottom />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f5',
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
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
    backgroundColor: "#ccc",
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.color.black,
    flex: 1,
    marginLeft: 10,
  },
  sectionHeader: {
    marginHorizontal: 20,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.color.black,
  },
  horizontalScroll: {
    paddingLeft: 10,
    paddingVertical: 10,
  },
  videoWrapper: {
    width: Dimensions.get("window").width * 0.8,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    alignItems: 'center',
  },
  itemText: {
    marginTop: 5,
    fontSize: 12,
    color: theme.color.black,
    fontWeight: "600",
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
  loaderWrapper: {
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
});
