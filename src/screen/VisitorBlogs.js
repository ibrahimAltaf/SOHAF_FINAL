import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, useColorScheme } from "react-native";
import axios from "axios";
import Header from "../component/Header/header";
import { theme } from "../constants/styles";
import { useNavigation } from "@react-navigation/native";
import { useThemeContext } from "../../ThemeContext";

export default function VisitorBlogs(props) {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const { isDarkMode, toggleTheme } = useThemeContext(); // Access dark mode from context

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("https://dodgerblue-chinchilla-339711.hostingersite.com/api/admin/blogs/approved");
      setBlogs(response.data);
      setFilteredBlogs(response.data.reverse()); // Reverse to show newest blogs first
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (text === "") {
      setFilteredBlogs(blogs.reverse()); // Re-reverse back to original order if search is cleared
    } else {
      const filteredData = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredBlogs(filteredData);
    }
  };

  const navigateToBlogDetail = (blog) => {
    navigation.navigate("BlogDetails", { blog }); // Passing the selected blog item to BlogDetails
  };

  const renderBlog = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToBlogDetail(item)} style={[styles.blogCard, { backgroundColor: isDarkMode ? "#333" : "#fff" }]}>
      <Image source={{ uri: item.image || "https://via.placeholder.com/60" }} style={styles.blogImage} />
      <View style={styles.blogInfo}>
        <Text style={[styles.blogTitle, { color: isDarkMode ? "#fff" : "#333" }]}>{item.title}</Text>
        <Text numberOfLines={2} style={[styles.blogDescription, { color: isDarkMode ? "#bbb" : "#666" }]}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Header
        title={"المدونات"} // Arabic title for Blogs
        backArrow
        backPage={() => props.navigation.goBack()}
      />
      <View style={[styles.container, { backgroundColor: isDarkMode ? "#1a1a1a" : "#f9f9f9" }]}>
        <TextInput
          style={[
            styles.searchBar,
            {
              backgroundColor: isDarkMode ? "#333" : "#fff",
              borderColor: isDarkMode ? "#555" : "#ddd",
              color: isDarkMode ? "#fff" : "#000",
            },
          ]}
          placeholder="ابحث في المدونات..."
          placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
          value={search}
          onChangeText={handleSearch}
        />

        {/* Blog List */}
        {loading ? (
          <ActivityIndicator size="large" color={theme.color.primaryColor} style={styles.loader} />
        ) : (
          <FlatList
          showsHorizontalScrollIndicator={false} // Hides the horizontal scrollbar

          
            data={filteredBlogs}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderBlog}
            ListEmptyComponent={<Text style={[styles.noResults, { color: isDarkMode ? "#bbb" : "#888" }]}>لا توجد مدونات.</Text>}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  headerText: {
    fontSize: 24,
    marginVertical: 15,
    fontWeight: "900",
  },
  searchBar: {
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginVertical: 10,
    borderWidth: 1,
  },
  blogCard: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
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
  },
  blogDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  loader: {
    marginTop: 20,
  },
  noResults: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
});
