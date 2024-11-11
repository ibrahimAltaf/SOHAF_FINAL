import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";
import Header from "../component/Header/header";
import { theme } from "../constants/styles";
import { useNavigation } from "@react-navigation/native";

export default function VisitorBlogs(props) {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("https://dodgerblue-chinchilla-339711.hostingersite.com/api/admin/blogs");
      setBlogs(response.data);
      setFilteredBlogs(response.data); // Initialize filtered blogs with all blogs
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (text === "") {
      setFilteredBlogs(blogs);
    } else {
      const filteredData = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredBlogs(filteredData);
    }
  };

  const navigateToBlogDetail = (blog) => {
    navigation.navigate('BlogDetails', { blog }); // Passing the selected blog item to BlogDetails
  };

  const renderBlog = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToBlogDetail(item)} style={styles.blogCard}>
      <Image source={{ uri: item.image || "https://via.placeholder.com/60" }} style={styles.blogImage} />
      <View style={styles.blogInfo}>
        <Text style={styles.blogTitle}>{item.title}</Text>
        <Text numberOfLines={2} style={styles.blogDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Header title={"Blogs"} backArrow backPage={() => props.navigation.goBack()} />
      <View style={styles.container}>
        <Text style={styles.headerText}>Blogs</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Search blogs..."
          value={search}
          onChangeText={handleSearch}
        />

        {/* Blog List */}
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
        ) : (
          <FlatList
            data={filteredBlogs}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderBlog}
            ListEmptyComponent={<Text style={styles.noResults}>No blogs found.</Text>}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 15,
  },
  headerText: {
    color: theme.color.black,
    fontSize: 24,
    marginVertical: 15,
    fontWeight: "900",
  },
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginVertical: 10,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  blogCard: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
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
    color: "#333",
  },
  blogDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  loader: {
    marginTop: 20,
  },
  noResults: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
});
