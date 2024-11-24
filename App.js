import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {Provider} from 'react-redux';
import {helpers} from './src/utils/helpers';
import {Store} from './src/Redux/store/store';
import {Linking, Platform} from 'react-native';
import {StripeProvider} from '@stripe/stripe-react-native';
import MainNavigation from './src/Routes/MainNavigation';
import VersionCheck from 'react-native-version-check';
import FlashMessage from "react-native-flash-message";
import { ThemeProvider } from './ThemeContext';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(null);

  useEffect(() => {
    checkAppVersion();
  }, []);
  const checkAppVersion = () => {
    VersionCheck.needUpdate({depth:2}).then(res => {
      console.log("VERSION CHECK RESPONSE =====> ", res);
      if (res?.currentVersion!==res?.latestVersion) {
        setCurrentVersion(res?.currentVersion);
        setModalVisible(true);
      } else {
        setModalVisible(false);
      };
    });
  };
  const redirectToStore = () => {
    if (Platform.OS==="android") {
      Linking.openURL(helpers.constant.playStoreLink);
    } else {
      Linking.openURL(helpers.constant.appStoreLink);
    };
  };

  return (
    <Provider store={Store}>
    <ThemeProvider>
      <PaperProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <MainNavigation />
        </GestureHandlerRootView >
        <FlashMessage style={{ marginBottom: 20 }} />
      </PaperProvider>
    </ThemeProvider>
  </Provider>

  );
}
