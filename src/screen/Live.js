import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
  FlatList,
  Image,
  ToastAndroid,
  useColorScheme,
} from "react-native";
import { useSelector } from "react-redux";
import axios from "axios";
import RBSheet from "react-native-raw-bottom-sheet";
import { theme } from "../constants/styles";
import Header from "../component/Header/header";
import { useNavigation } from "@react-navigation/native";
import { useThemeContext } from "../../ThemeContext";
import VisitorBottom from "./VisitorBottom";

export default function Live(props) {
  const { user_detail, access_token } = useSelector((state) => state.userReducer);
  const colorScheme = useColorScheme();
  const { isDarkMode, toggleTheme } = useThemeContext(); // Access dark mode from context

  const [newsBlogs, setNewsBlogs] = useState([]);
  const [otherBlogs, setOtherBlogs] = useState([]);
  const [filteredNewsBlogs, setFilteredNewsBlogs] = useState([]);
  const [filteredOtherBlogs, setFilteredOtherBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("news");
  const [search, setSearch] = useState("");

  const bottomSheetRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      // Resetting the loading state before each API call
      setLoading(true);
  
      // Fetching News Blogs from the first API
      const newsResponse = await axios.get("https://dodgerblue-chinchilla-339711.hostingersite.com/api/visitor/blogs-url/1");
      console.log("News Blogs:", newsResponse.data);
      
      // Checking if newsResponse data exists and is an array
      if (newsResponse.data && Array.isArray(newsResponse.data)) {
        setNewsBlogs(newsResponse.data);
        setFilteredNewsBlogs(newsResponse.data.reverse()); // Reverse to show newest blogs first
      } else {
        console.log("No data returned from the News Blogs API");
      }
  
      // Fetching Other Blogs from the second API
      const otherResponse = await axios.get("https://dodgerblue-chinchilla-339711.hostingersite.com/api/admin/blogs/approved");
      console.log("Other Blogs:", otherResponse.data);
      
      // Checking if otherResponse data exists and is an array
      if (otherResponse.data && Array.isArray(otherResponse.data)) {
        setOtherBlogs(otherResponse.data);
        setFilteredOtherBlogs(otherResponse.data.reverse()); // Reverse to show newest blogs first
      } else {
        console.log("No data returned from the Other Blogs API");
      }
  
      // Set loading to false after both API calls are complete
      setLoading(false);
    } catch (error) {
      console.log("Error fetching blogs:", error);
      ToastAndroid.show("فشل في تحميل المدونات", ToastAndroid.SHORT);
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (activeTab === "news") {
      if (text === "") {
        setFilteredNewsBlogs(newsBlogs.reverse()); // Re-reverse back to original order if search is cleared
      } else {
        const filteredData = newsBlogs.filter((blog) =>
          blog.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredNewsBlogs(filteredData);
      }
    } else {
      if (text === "") {
        setFilteredOtherBlogs(otherBlogs.reverse());
      } else {
        const filteredData = otherBlogs.filter((blog) =>
          blog.title.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredOtherBlogs(filteredData);
      }
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderBlog = ({ item }) => (
    <TouchableOpacity
    onPress={() => {
      if (activeTab === "news") {
        // Agar news tab active hai, toh BlogDetails screen pe navigate karenge
        navigation.navigate("NewsBlogPage", { url: item.url })
            } else {
        // Agar other tab active hai, toh koi doosra screen navigate karenge (Example: OtherBlogDetails)
        navigation.navigate("BlogDetails", { blog: item });
      }
    }}      style={[styles.blogCard, { backgroundColor: isDarkMode ? "#333" : "#fff" }]}
    >
      <Image source={{ uri: item.image || "https://via.placeholder.com/60" }} style={styles.blogImage} />
      <View style={styles.blogInfo}>
        <Text style={[styles.blogTitle, { color: isDarkMode ? "#fff" : "#333" }]}>
          {item.title || item.name}
        </Text>
        <Text numberOfLines={2} style={[styles.blogDescription, { color: isDarkMode ? "#bbb" : "#666" }]}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const styles = getStyles(isDarkMode);

  return (
    <>
      <Header title="المدونات" backArrow backPage={() => props.navigation.goBack()} />
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => handleTabChange("news")}
            style={[styles.tab, activeTab === "news" && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === "news" && styles.activeTabText]}>
              المدونات الجديدة
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleTabChange("other")}
            style={[styles.tab, activeTab === "other" && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === "other" && styles.activeTabText]}>
              مدونات أخرى
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={[styles.searchBar, { backgroundColor: isDarkMode ? "#333" : "#fff" }]}
          placeholder="ابحث في المدونات..."
          placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
          value={search}
          onChangeText={handleSearch}
        />

        {updating && <ActivityIndicator size="small" color="#FFD700" style={styles.updatingLoader} />}

        {/* Loader should only affect the blog content */}
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={theme.color.primaryColor} />
          </View>
        ) : (
          <ScrollView style={styles.scrollContainer}>
            {activeTab === "news" && (
              <FlatList
                showsVerticalScrollIndicator={true}
                data={filteredNewsBlogs}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderBlog}
                ListEmptyComponent={<Text style={styles.noResults}>لا توجد مدونات جديدة.</Text>}
              />
            )}
            {activeTab === "other" && (
              <FlatList
                showsVerticalScrollIndicator={true}
                data={filteredOtherBlogs}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderBlog}
                ListEmptyComponent={<Text style={styles.noResults}>لا توجد مدونات أخرى.</Text>}
              />
            )}
          </ScrollView>
        )}

        <RBSheet
          ref={bottomSheetRef}
          height={200}
          closeOnDragDown={true}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: isDarkMode ? "#333" : "#fff",
            },
          }}
        >
          <Text>يرجى تسجيل الدخول للاشتراك في المدونات</Text>
        </RBSheet>
      </View>
      <VisitorBottom />
    </>
  );
}

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#121212" : "#f0f0f5",
      paddingHorizontal: 10,
    },
    tabContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginVertical: 12,
      backgroundColor: isDarkMode ? "#333" : "#fff",
      borderRadius: 8,
      elevation: 2,
    },
    tab: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 10,
      marginHorizontal: 4,
      borderRadius: 8,
    },
    activeTab: {
      backgroundColor: isDarkMode ? "#FFD700" : theme.color.primaryColor,
    },
    tabText: {
      fontSize: 12,
      color: isDarkMode ? "#bbb" : "#555",
    },
    activeTabText: {
      color: isDarkMode ? "#000" : theme.color.black,
    },
    searchBar: {
      borderRadius: 8,
      paddingHorizontal: 15,
      paddingVertical: 10,
      fontSize: 16,
      elevation: 4,
      color: isDarkMode ? theme.color.white : theme.color.black,
    },
    blogCard: {
      padding: 15,
      marginVertical: 8,
      borderRadius: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    blogImage: {
      width: 60,
      height: 60,
      borderRadius: 8,
      marginRight: 15,
      backgroundColor: "#e1e1e1",
    },
    blogInfo: {
      flex: 1,
    },
    blogTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 5,
    },
    blogDescription: {
      fontSize: 14,
    },
    noResults: {
      textAlign: "center",
      fontSize: 16,
      color: theme.color.primaryColor,
      paddingVertical: 20,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    scrollContainer: {
      paddingBottom: 60,
    },
    updatingLoader: {
      marginTop: 20,
    },
  });
