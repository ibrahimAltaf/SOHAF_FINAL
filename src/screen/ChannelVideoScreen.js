import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { theme } from '../constants/styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../component/Header/header';
import CustomStatusBar from '../component/StatusBar/customStatusBar';

const ChannelVideoScreen = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { channel } = route.params;
  console.log(JSON.stringify(channel) + "api");

  // Function to extract the video ID from iframe link
  const extractYouTubeId = (iframe) => {
    const match = iframe.match(/embed\/([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  // Extract YouTube video ID from the iframe string
  const videoId = extractYouTubeId(channel.link);

  return (
<>

<Header title={"Live News"} backArrow backPage={() => props.navigation.goBack()} />
<View style={styles.container}>
      {videoId ? (
        <YoutubePlayer
          height={210}
          play={true}
          videoId={videoId}
          width="100%"
        />
      ) : (
        <Text style={styles.errorText}>Video ID not found.</Text>
      )}

      <View style={styles.channelInfo}>
        <Image source={{ uri: channel.image || 'https://via.placeholder.com/60' }} style={styles.logo} />
        <Text style={styles.title}>{channel.title}</Text>
      </View>
{/* 
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity> */}
    </View>
</>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f5',
  },
  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding:15,

  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.color.black,
    marginLeft: 10,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: theme.color.primaryColor,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChannelVideoScreen;
