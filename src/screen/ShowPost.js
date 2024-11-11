import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import React from 'react';
import Header from '../component/Header/header';
import { useNavigation } from '@react-navigation/native';

export default function ShowPost(props) {
const navigation = useNavigation()
  const postsData = [
    {
      id: '1',
      title: "Amazing Sunset",
      category: "Nature",
      videoLink: "https://example.com/video1",
      description: "This photo captures the stunning beauty of a sunset over the mountains, showcasing vibrant colors and serene landscapes.",
      imageUri: "https://plus.unsplash.com/premium_photo-1672115680958-54438df0ab82?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bW91bnRhaW5zfGVufDB8fDB8fHww",
    },
    {
      id: '2',
      title: "City Lights",
      category: "Urban",
      videoLink: "https://example.com/video2",
      description: "An enchanting view of the city skyline at night, illuminated by thousands of lights.",
      imageUri: "https://img.freepik.com/free-photo/beautiful-mountains-landscape_23-2150787850.jpg",
    },
    {
      id: '3',
      title: "Mountain Adventure",
      category: "Adventure",
      videoLink: "https://example.com/video3",
      description: "Exploring the majestic mountains and enjoying the breathtaking views from the top.",
      imageUri: "https://img.freepik.com/free-photo/beautiful-mountains-landscape_23-2150787850.jpg",
    },
    {
      id: '4',
      title: "Calm Ocean",
      category: "Nature",
      videoLink: "https://example.com/video4",
      description: "A serene view of the ocean with waves gently crashing on the shore during sunset.",
      imageUri: "https://img.freepik.com/free-photo/beautiful-mountains-landscape_23-2150787850.jpg",
    },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.postContainer}>
      <Image source={{ uri: item.imageUri }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.category}>
        Category: <Text style={styles.categoryText}>{item.category}</Text>
      </Text>
      <Text style={styles.videoLink}>
        Video Link: <Text style={styles.linkText}>{item.videoLink}</Text>
      </Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
<>
<Header title={"Post"} backArrow backPage={() => props.navigation.goBack()} />

<FlatList
  data={postsData}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  contentContainerStyle={styles.container}
/>
</>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  postContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginBottom: 20,
    padding: 15,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  category: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  categoryText: {
    fontWeight: 'bold',
    color: '#007BFF',
  },
  videoLink: {
    fontSize: 16,
    color: '#007BFF',
    marginBottom: 5,
  },
  linkText: {
    textDecorationLine: 'underline',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
  },
});
