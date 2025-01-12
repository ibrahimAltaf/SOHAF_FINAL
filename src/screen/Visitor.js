import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
  ImageBackground, // Import ImageBackground
} from "react-native";
import { theme } from "../constants/styles";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import VisitorBottom from "./VisitorBottom";
import { useThemeContext } from "../../ThemeContext";
import Header from "../component/Header/header";

export default function Visitor() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [newsBlogs, setNewsBlogs] = useState([]);
  const { access_token } = useSelector((state) => state.userReducer);
  const colorScheme = useColorScheme();
  const { isDarkMode, toggleTheme } = useThemeContext();

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [channels, blogsData, newsBlogsData] = await Promise.all([
          fetchSubscribedChannels(),
          fetchBlogs(),
          fetchNewsBlogs(),
        ]);
        setSubscribedChannels(channels);
        setBlogs(blogsData);
        setNewsBlogs(newsBlogsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch subscribed channels
  const fetchSubscribedChannels = async () => {
    try {
      const response = await axios.get(
        "https://dodgerblue-chinchilla-339711.hostingersite.com/api/admin/channels"
      );
      return response.data || [];
    } catch (error) {
      console.error("Error fetching channels:", error);
      return [];
    }
  };

  // Fetch approved blogs
  const fetchBlogs = async () => {
    try {
      const response = await axios.get(
        "https://dodgerblue-chinchilla-339711.hostingersite.com/api/admin/blogs/approved"
      );
      return response.data || [];
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return [];
    }
  };

  // Fetch news blogs
// Fetch news blogs
const fetchNewsBlogs = async () => {
  try {
    const response = await axios.get(
      "https://dodgerblue-chinchilla-339711.hostingersite.com/api/visitor/blogs-url/1"
    );
    // Map the response to extract necessary fields
    return response.data.map((blog) => ({
      id: blog.id,
      name: blog.name.trim(),
      image: blog.image || "https://default-image-url.com", // Use a default image if missing
      url: blog.url,
      createdAt: blog.created_at,
      updatedAt: blog.updated_at,
    }));
  } catch (error) {
    console.error("Error fetching news blogs:", error);
    return [];
  }
};

  

  // Styles based on dark mode
  const styles = getStyles(isDarkMode);

  // Handle channel click
  const handleChannelPress = (channel) => {
    navigation.navigate("ChannelVideoScreen", { channel });
  };

  return (
    // Background Image wrapped around the entire view
    <ImageBackground
    source={require("../assets/images/arabicnewsbg.jpg")} 

    style={styles.container}
  >
      <Header title="صُحف " />

      {/* Loading State */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* Live News Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الأخبار المباشرة</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {subscribedChannels.length > 0 ? (
                subscribedChannels.map((channel, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleChannelPress(channel)}
                  >
                    <View style={styles.channelItem}>
                      <Image
                        source={{
                          uri: channel.image || "https://default-image-url.com",
                        }}
                        style={styles.channelLogo}
                      />
                      <Text style={styles.channelText}>{channel.title}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptyMessage}>لا توجد قنوات أخبار مباشرة.</Text>
              )}
            </ScrollView>
          </View>

          {/* News Blogs Section */}
          <View style={styles.section}>
  <Text style={styles.sectionTitle}>مدونات الأخبار</Text>
  <ScrollView showsHorizontalScrollIndicator={false}>
    {newsBlogs.length > 0 ? (
      newsBlogs.map((article, index) => (
        <TouchableOpacity
          key={index} // Use index as the key
          style={styles.blogCard}
          onPress={() => navigation.navigate("NewsBlogPage", { url: article.url })}
        >
          {/* Image Section */}
          <View style={{ width: "30%", height: "100%" }}>
            <Image
              source={{
                uri: article.image || "https://default-image-url.com", // Updated to use 'image' field from API
              }}
              style={styles.blogImage}
            />
          </View>
          {/* Text Section */}
          <View style={{ width: "70%", height: "100%" }}>
            <Text numberOfLines={2} style={styles.blogTitle}>{article.name}</Text>
          
          </View>
        </TouchableOpacity>
      ))
    ) : (
      <Text style={styles.emptyMessage}>لا توجد مدونات أخبار متاحة.</Text>
    )}
  </ScrollView>
</View>



          {/* Latest Blogs Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>أحدث المدونات</Text>
            <ScrollView  showsHorizontalScrollIndicator={false}>
              {blogs.length > 0 ? (
                blogs.map((blog, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.blogCard}
                    onPress={() => navigation.navigate("BlogDetails", { blog })}
                  >
                  <View style={{ width: "30%", height: "100%" }}>
                    <Image
                      source={{ uri: blog.image }}
                      style={styles.blogImage}
                    />
                    </View>
                    <View style={{ width: "70%", height: "100%" }}>
                    <Text style={styles.blogTitle}>{blog.title}</Text>
                    <Text numberOfLines={2} style={styles.blogDescription}>
                      {blog.description}
                    </Text>
                    </View>
                   
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptyMessage}>لا توجد مدونات متاحة.</Text>
              )}
            </ScrollView>
          </View>
        </ScrollView>
      )}

      {/* Footer Section */}
      <VisitorBottom />
    </ImageBackground>
  );
}

// Styles based on dark mode
const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? theme.color.black : theme.color.white,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isDarkMode ? theme.color.black : theme.color.white,
    },
    contentContainer: {
      paddingHorizontal: 10,
    },
    section: {
      paddingVertical: 15,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: isDarkMode ? "#fff" : theme.color.white,
      marginBottom: 10,
 
    },
    channelItem: {
      alignItems: "center",
      marginHorizontal: 10,
      backgroundColor: isDarkMode ? "#333" : theme.color.primaryColor,
      borderRadius: 8,
      padding: 10,
      width: 80,
      height: 100,
    },
    channelLogo: {
      width: 60,
      height: 60,
      borderRadius: 30,
    },
    channelText: {
      marginTop: 5,
      fontSize: 6,
      color: isDarkMode ? "#fff" : "#000",
      textAlign: "center",
      fontWeight: "900",
    },
    blogCard: {
      gap:10,
      marginRight: 10,
      flexDirection:"row",
      backgroundColor: isDarkMode ? "#333" : theme.color.white,
      marginBottom: 10,
      padding: 10,
      shadowColor: "#000", // Dark shadow color for a clean, strong look
      shadowOffset: { width: 0, height: 10 }, // Larger vertical offset for more elevation
      shadowOpacity: 0.2, // Slightly lower opacity for a soft but noticeable shadow
      shadowRadius: 15, // Larger blur radius for a smoother, more diffused shadow
      borderRadius: 10,
      elevation: 8, // Ensures shadow appears on Android with a decent level of elevation
    },
    blogImage: {
      width: "100%",
      height: 50,
      borderRadius: 10,

      objectFit:"cover"
    },
    blogTitle: {
      fontSize: 14,
      padding:10,
      fontWeight: "bold",
      color: isDarkMode ? "#fff" : theme.color.black,
    },
    blogDescription: {
      fontSize: 12,
      color: isDarkMode ? "#aaa" : theme.color.black,
      marginTop: 5,
    },
    emptyMessage: {
      fontSize: 14,
      color: isDarkMode ? "#bbb" : "#555",
      textAlign: "center",
    },
  });
