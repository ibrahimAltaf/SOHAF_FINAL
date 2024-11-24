import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput, useColorScheme } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../component/Header/header';
import AdminBottom from './AdminBottom';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../constants/styles';

export default function BlogList(props) {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true); // حالة التحميل
  const [intervalId, setIntervalId] = useState(null); // لتخزين معرف الفاصل الزمني لإزالته

  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const backgroundColor = isDarkMode ? '#1E1E1E' : '#f9f9f9';
  const textColor = isDarkMode ? '#FFFFFF' : theme.color.black;
  const cardBackgroundColor = isDarkMode ? '#333333' : '#FFFFFF';
  const placeholderTextColor = isDarkMode ? '#AAAAAA' : '#888888';
  const borderColor = isDarkMode ? '#555555' : '#DCDCDC';

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('https://dodgerblue-chinchilla-339711.hostingersite.com/api/admin/blogs/pending');
        setBlogs(response.data);
        setFilteredBlogs(response.data);
      } catch (error) {
        console.error('خطأ في جلب المدونات:', error);
      } finally {
        setLoading(false); // إيقاف التحميل بعد الحصول على البيانات
      }
    };

    fetchBlogs(); // جلب البيانات عند تحميل المكون

    // استدعاء الـ API كل 2 ثانية
    const interval = setInterval(fetchBlogs, 2000);
    setIntervalId(interval); // حفظ معرف الفاصل الزمني

    // تنظيف الفاصل الزمني عند تفريغ المكون
    return () => {
      clearInterval(interval); // إيقاف الفاصل الزمني بعد تفريغ المكون
    };
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
      <View style={[styles.blogCard, { backgroundColor: cardBackgroundColor }]}>
        <View style={{ width: "38%", height: 70 }}>
          <Image source={{ uri: item.image }} style={styles.blogImage} />
        </View>
        <View style={{ width: "60%", height: "auto" }}>
          <Text style={[styles.blogTitle, { color: textColor }]}>{item.title}</Text>
          <Text numberOfLines={2} style={[styles.blogDescription, { color: placeholderTextColor }]}>{item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Header title={"المدونات"} backArrow backPage={() => props.navigation.goBack()} />
      {loading ? ( 
         <View style={[styles.loaderContainer, { backgroundColor }]}>
         <ActivityIndicator size="large" color={theme.color.primaryColor} />
       </View>
      ) :(
      <View style={[styles.container, { backgroundColor }]}>

        {/* شريط البحث */}
        <TextInput
          style={[styles.searchBar, { backgroundColor: cardBackgroundColor, color: textColor, borderColor }]}
          placeholder="ابحث في المدونات..."
          placeholderTextColor={placeholderTextColor}
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
      )}
      <AdminBottom />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "900",
    marginLeft: 10,
  },
  searchBar: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    marginVertical: 10,
    fontSize: 12,
  },
  listContainer: {
    paddingBottom: 20,
  },
  blogCard: {
    flex: 1,
    flexDirection: "row",
    gap: 20,
    borderRadius: 10,
    marginVertical: 10,
    padding: 15,
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  blogImage: {
    width: '100%',
    height: "100%",
    borderRadius: 10,
  },
  blogTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  blogDescription: {
    fontSize: 12,
    marginBottom: 5,
    paddingRight: 10,
    marginRight: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
