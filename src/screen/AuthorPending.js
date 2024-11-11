import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { theme } from '../constants/styles';
import Header from '../component/Header/header';
import { useNavigation } from '@react-navigation/native';


export default function AuthorPending(props) {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true); // Loader state
  const navigation = useNavigation();
  const { access_token ,user_detail } = useSelector((state) => state.userReducer);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('https://dodgerblue-chinchilla-339711.hostingersite.com/api/admin/blogs');
        setBlogs(response.data);
        setFilteredBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchBlogs();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter(blog =>
        blog.title.toLowerCase().includes(query.toLowerCase()) ||
        blog.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredBlogs(filtered);
    }
  };

  const navigateToBlogDetail = (blog) => {
    navigation.navigate('BlogDetails', { blog });
  };

  const renderBlogItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToBlogDetail(item)}>
      <View style={styles.blogCard}>
        <View style={{ width: "38%", height: 70 }}>
          <Image source={{ uri: item.image }} style={styles.blogImage} />
        </View>
        <View style={{ width: "60%", height: "auto" }}>
          <Text style={styles.blogTitle}>{item.title}</Text>
          <Text numberOfLines={2} style={styles.blogDescription}>{item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    // Show loader while data is being fetched
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={theme.color.primaryColor} />
      </View>
    );
  }

  return (
    <>
      <Header title={"Blogs"} backArrow backPage={() => props.navigation.goBack()} />

      <View style={styles.container}>
        <Text style={{ fontSize: 20, color: theme.color.black, fontWeight: "900",marginLeft:10 }}>Blogs</Text>

        {/* Search Bar */}
        <TextInput
          style={styles.searchBar}
          placeholder="Search Blogs..."
          placeholderTextColor="black"
          value={searchQuery}
          onChangeText={handleSearch}
        />

        <FlatList
          data={filteredBlogs}
          renderItem={renderBlogItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      </View>


    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  searchBar: {
    backgroundColor: '#ffffff',
    color: theme.color.black,
    borderColor: '#dcdcdc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    marginVertical: 10,
    fontSize:12
  },
  listContainer: {
    paddingBottom: 20,
  },
  blogCard: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: '#fff',
    gap: 20,
    borderRadius: 10,
    marginVertical: 10,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  blogImage: {
    width: '100%',
    height: "100%",
    borderRadius: 10,
    marginBottom: 10,
    objectFit: "contain"
  },
  blogTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,

    color: theme.color.black,
  },
  blogDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    paddingRight: 10,
    marginRight: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderTopColor: '#d3d3d3',
    borderTopWidth: 1,
  },
  navButton: {
    alignItems: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
    tintColor: theme.color.black,
  },
  navText: {
    fontSize: 12,
    color: theme.color.black,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
});
