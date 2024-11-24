import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux'; // Removed useDispatch since it's not used here
import { useThemeContext } from '../../../ThemeContext'; // Import the ThemeContext
import BannerCarousel from 'react-native-banner-carousel';
import CustomButton from '../../component/Buttons/customButton';
import VisitorBottom from '../VisitorBottom';
import { theme } from '../../constants/styles';
import CustomStatusBar from '../../component/StatusBar/customStatusBar';

const { width } = Dimensions.get('window');

export default function VisitorHomeScreen({ navigation }) {
  const { access_token, user_detail } = useSelector((state) => state.userReducer); // User details from Redux
  const { isDarkMode, toggleTheme } = useThemeContext(); // Access dark mode from context

  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // Simulate data fetching or loading state (e.g., API call or async operation)
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000); // Example: Loading for 2 seconds
  }, []);

  const banners = [
    { uri: 'https://cdn.prod.website-files.com/63894f0e251e567f6e443bfa/6686df5700df429facc40ebb_6520341ceac0a97331b6f45a_20231006T0419-d446ca77-a6af-498e-8722-3949d32a2055.webp', title: 'أخبار عاجلة: الاقتصاد' },
    { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdxbiWVQRJ_-0oPYeZjA55jQIEqVBkpTZ0HA&s', title: 'تحديثات رياضية' },
    { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdxbiWVQRJ_-0oPYeZjA55jQIEqVBkpTZ0HA&s', title: 'السياسة العالمية' },
  ];

  const handleToggleTheme = () => {
    toggleTheme(); // Toggle the theme using the context
  };

  return (
    <>
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f2f2f2' }]}>
        <View style={styles.userRow}>
         
          <View>
            {access_token ? (
              <View style={styles.userDetails}>
                <Image source={{ uri: user_detail.avatar }} style={styles.userImage} />
                <Text style={[styles.userName, { color: isDarkMode ? theme.color.white : theme.color.black }]}>
                  {user_detail.name}
                </Text>
                <Text style={[{ fontSize: 12 }, { color: isDarkMode ? theme.color.white : theme.color.black }]}>
                  {user_detail.email}
                </Text>
              </View>
            ) : (
              <View style={styles.userDetails}>
                <TouchableOpacity
                  style={{
                    width: 90,
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 7,
                    backgroundColor: theme.color.primaryColor
                  }}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={[styles.loginButton, { color: isDarkMode ? theme.color.white : theme.color.black }]}>Login</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
           <View style={styles.toggleRow}>
            <Text style={[styles.appName, { color: isDarkMode ? '#FFD700' : '#000' }]}>صُحُف</Text>
          </View>
        </View>

        {/* Content: Show loader if loading */}
        {isLoading ? (
          <ActivityIndicator size="large" color={theme.color.primaryColor} style={styles.loader} />
        ) : (
          <>
            {/* Section Header for Carousel */}
            <Text style={[styles.sectionHeader, { color: isDarkMode ? '#FFD700' : '#333' }]}>أهم المدونات</Text>

            {/* Carousel */}
            <BannerCarousel
              autoplay
              autoplayTimeout={4000}
              loop
              index={0}
              pageSize={width * 0.9}
              showsPageIndicator={false}
            >
              {banners.map((banner, index) => (
                <View key={index} style={styles.carouselItem}>
                  <Image source={{ uri: banner.uri }} style={styles.carouselImage} />
                </View>
              ))}
            </BannerCarousel>

            {/* Section Header for Navigation */}
            <Text style={[styles.sectionHeader, { color: isDarkMode ? '#FFD700' : '#333' }]}>استكشاف الخيارات</Text>

            {/* Navigation Cards */}
            <View style={styles.cardsRow}>
              {/* Live News Card */}
              <TouchableOpacity
                style={[styles.card, { backgroundColor: isDarkMode ? '#333' : '#FFF', borderColor: isDarkMode ? '#FFD700' : '#333' }]}
                onPress={() => navigation.navigate('Live')}
              >
                <Image source={require("../../assets/images/livelivelive.png")} style={styles.cardIcon} />
                <Text style={[styles.cardText, { color: isDarkMode ? theme.color.white : '#000' }]}>البث المباشر</Text>
              </TouchableOpacity>

              {/* Blogs Card */}
              <TouchableOpacity
                style={[styles.card, { backgroundColor: isDarkMode ? '#333' : '#FFF', borderColor: isDarkMode ? '#FFD700' : '#333' }]}
                onPress={() => navigation.navigate('AllNews')}
              >
                <Image source={require("../../assets/images/blogsnewnew.png")} style={styles.cardIcon} />
                <Text style={[styles.cardText, { color: isDarkMode ? theme.color.white : '#000' }]}>المدونات</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      <VisitorBottom />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  appName: {
    fontSize: 30,
    fontWeight: '900',
    textAlign: "left",
    color: theme.color.black,
  },
  userDetails: {
    flexDirection: 'column',
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 100,
    marginRight: 10,
    borderColor: theme.color.primaryColor,
    borderWidth: 2,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    fontSize: 12,
    fontWeight: '600',
    padding: 10,
  },
  toggleRow: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: 20,
    marginTop:10,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  carouselItem: {
    width: '100%',
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  card: {
    width: '48%',
    height: 150,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  cardIcon: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});
