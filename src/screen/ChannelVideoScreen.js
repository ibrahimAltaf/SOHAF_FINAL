import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { theme } from '../constants/styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../component/Header/header';

const ChannelVideoScreen = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { channel } = route.params;

  return (
    <>
      <Header title={"الأخبار الحية"} backArrow backPage={() => props.navigation.goBack()} />
      <View style={styles.container}>
        <WebView
          source={{ uri: channel.link }} 
          style={styles.webView}
          startInLoadingState={true} 
        />

        {/* معلومات القناة */}
        <View style={styles.channelInfo}>
          <Image source={{ uri: channel.image || 'https://via.placeholder.com/60' }} style={styles.logo} />
          <Text style={styles.title}>{channel.title}</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f5',
  },
  webView: {
    height: 210,
    width: '100%',
  },
  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: theme.color.primaryColor,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.color.black,
    marginLeft: 15, 
    flexShrink: 1,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc', 
  },
});

export default ChannelVideoScreen;
