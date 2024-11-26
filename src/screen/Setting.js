import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Switch,
  Image,
  ScrollView,
  TouchableOpacity,
  Share,
  ToastAndroid,
} from "react-native";
import { useSelector } from "react-redux"; // Redux imports
import { useNavigation } from "@react-navigation/native"; // For navigation
import { theme } from "../constants/styles";
import Header from "../component/Header/header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useThemeContext } from "../../ThemeContext";

export default function Setting() {
  const { access_token, user_detail } = useSelector((state) => state.userReducer); // Redux state
  const navigation = useNavigation();
  const { isDarkMode, toggleTheme } = useThemeContext(); // Access dark mode from context
  console.log(user_detail)
  const handleToggleTheme = () => {
    toggleTheme(); // Toggle the theme using the context
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      ToastAndroid.show("تم تسجيل الخروج بنجاح!", ToastAndroid.SHORT);
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
      ToastAndroid.show("فشل تسجيل الخروج. يرجى المحاولة مرة أخرى.", ToastAndroid.LONG);
    }
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `مرحبًا! تحقق من هذا التطبيق الرائع: ${user_detail?.name || "MyApp"} https://example.com`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared with activity type: ", result.activityType);
        } else {
          console.log("Shared successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error) {
      console.error("Error sharing: ", error.message);
    }
  };

  return (
    <>
      <Header title={"الإعدادات"} backArrow backPage={() => navigation.goBack()} />

      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
        {/* User Profile Section */}
        <View style={[styles.userRow, isDarkMode && styles.darkUserRow]}>
          <View>
            {access_token ? (
              <View style={styles.userDetails}>
                <Image
                  source={{ uri: user_detail?.avatar }}
                  style={styles.userImage}
                />
                <Text
                  style={[styles.userName, { color: isDarkMode ? "#FFF" : "#000" }]}
                >
                  {user_detail?.name || "اسم المستخدم"}
                </Text>
                <Text
                  style={[{ fontSize: 12 }, { color: isDarkMode ? "#FFF" : "#555" }]}
                >
                  {user_detail?.email || "user@example.com"}
                </Text>
              </View>
            ) : (
              <View style={styles.userDetails}>
                <Image
                  source={isDarkMode ? require("../../assets/images/icons8-male-user-50.png") : require("../assets/images/user_1077012.png")}
                  style={styles.userImage}
                />
                <TouchableOpacity
                  style={styles.loginButtonContainer}
                  onPress={() => navigation.navigate("Login")}
                >
                  <Text
                    style={[
                      styles.loginButton,
                      { color: isDarkMode ? "#FFF" : "#000" },
                    ]}
                  >
                    تسجيل الدخول
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Dark Mode Toggle */}
          <View style={styles.toggleRow}>
          <Switch
          value={isDarkMode}
          onValueChange={handleToggleTheme} // Toggle the theme using context
          thumbColor={isDarkMode ?theme.color.white : theme.color.primaryColor}
          trackColor={{ false: theme.color.black, true: theme.color.primaryColor }}
        />
            <Text
              style={[
                styles.sectionHeader,
                { color: isDarkMode ? "#FFD700" : "#333" },
              ]}
            >
              وضع الظلام
            </Text>
          </View>
        </View>

        {/* Options Section */}
        <ScrollView style={styles.scrollView}>
          {[
            {
              label: "الحساب",
              image: require("../assets/images/user_1077012.png"),
              screen: "Profile",
            },
            // {
            //   label: "الإشعارات",
            //   image: require("../assets/images/NotiBG.png"),
            //   screen: "Notification",
            // },
         
            {
              label: "مشاركة",
              image: require("../assets/images/share.png"),
              onPress: handleShare, // Call share function
            },
            {
              label: "تسجيل الخروج",
              image: require("../assets/images/logout.png"),
              onPress: handleLogout, // Call logout function
            },
          ].map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.option, isDarkMode && styles.darkOption]}
              onPress={
                option.onPress
                  ? option.onPress // Use custom function for share/logout
                  : () => navigation.navigate(option.screen)
              }
            >
              <Image source={option.image} style={styles.optionIcon} />
              <Text style={[styles.optionText, isDarkMode && styles.darkText]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  userRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  darkUserRow: {
    backgroundColor: "#222",
  },
  userDetails: {
    flexDirection: "column",
    alignItems: "center",
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  loginButtonContainer: {
    width: 90,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "#FFD700",
  },
  loginButton: {
    fontSize: 14,
    fontWeight: "bold",
  },
  toggleRow: {
    alignItems: "center",
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
  scrollView: {
    marginTop: 10,
  },
  option: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  darkOption: {
    backgroundColor: "#333",
  },
  optionIcon: {
    width: 24,
    height: 24,
    marginLeft: 15,
  },
  optionText: {
    fontSize: 16,
    color: "#000",
    textAlign: "right",
  },
  darkText: {
    color: "#ccc",
  },
});
