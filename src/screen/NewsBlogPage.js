import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import WebView from 'react-native-webview';
import Header from '../component/Header/header';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../constants/styles';

export default function NewsBlogPage({ route }) {
  const navigation = useNavigation();
  const { url } = route.params;
  const [loading, setLoading] = useState(true);

  // ضبط مؤقت لإخفاء مؤشر التحميل بعد 3-4 ثواني
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3000 مللي ثانية = 3 ثواني

    return () => clearTimeout(timer); // تنظيف المؤقت عند إلغاء تركيب المكون
  }, []);

  return (
    <>
      <Header title={"مدونات أخبار صُحف"} backArrow backPage={() => navigation.goBack()} />

      <View style={styles.container}>
        {loading ? (
          // عرض مؤشر النشاط أثناء التحميل
          <ActivityIndicator size="large" color={theme.color.primaryColor} style={styles.loader} />
        ) : (
          // عرض WebView بعد انتهاء وقت مؤشر التحميل
          <WebView source={{ uri: url }} />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
