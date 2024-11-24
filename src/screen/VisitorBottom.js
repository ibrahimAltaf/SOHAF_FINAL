import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../constants/styles";
import { useThemeContext } from "../../ThemeContext";  // Import the ThemeContext

export default function VisitorBottom() {
  const navigation = useNavigation();
  const { routes, index } = navigation.getState();
  const currentRouteName = routes[index]?.name || "AdminScreen"; // Default to "AdminScreen" if no route is active
  const { isDarkMode, toggleTheme } = useThemeContext(); // Access dark mode from context

  const isActive = (routeName) => currentRouteName === routeName;

  return (
    <View style={[styles.bottomNav, isDarkMode && styles.bottomNavDark]}>
      <TouchableOpacity
        onPress={() => navigation.navigate("VisitorScreen")}
        style={styles.navButton}
      >
        <Image
          source={require("../assets/images/homesohaf.png")}
          style={[
            styles.navIcon,
            isActive("VisitorScreen") && styles.activeIcon,
            isDarkMode && styles.navIconDark,
          ]}
        />
        <Text
          style={[
            styles.navText,
            isActive("VisitorScreen") && styles.activeText,
            isDarkMode && styles.navTextDark,
          ]}
        >
          الصفحة الرئيسية
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("AllNews")}
        style={styles.navButton}
      >
        <Image
          source={require("../assets/images/NewChannel.png")}
          style={[
            styles.navIcon,
            isActive("AllNews") && styles.activeIcon,
            isDarkMode && styles.navIconDark,
          ]}
        />
        <Text
          style={[
            styles.navText,
            isActive("AllNews") && styles.activeText,
            isDarkMode && styles.navTextDark,
          ]}
        >
          القنوات
        </Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
        onPress={() => navigation.navigate("VisitorBlog")}
        style={styles.navButton}
      >
        <Image
          source={require("../assets/images/blogsohaf.png")}
          style={[
            styles.navIcon,
            isActive("VisitorBlog") && styles.activeIcon,
            isDarkMode && styles.navIconDark,
          ]}
        />
        <Text
          style={[
            styles.navText,
            isActive("VisitorBlog") && styles.activeText,
            isDarkMode && styles.navTextDark,
          ]}
        >
          المدونات
        </Text>
      </TouchableOpacity> */}

      <TouchableOpacity
        onPress={() => navigation.navigate("Live")}
        style={styles.navButton}
      >
        <Image
          source={require("../assets/images/subscribe.png")}
          style={[
            styles.navIcon,
            isActive("Live") && styles.activeIcon,
            isDarkMode && styles.navIconDark,
          ]}
        />
        <Text
          style={[
            styles.navText,
            isActive("Live") && styles.activeText,
            isDarkMode && styles.navTextDark,
          ]}
        >
          مدونات الأخبار
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Setting")}
        style={styles.navButton}
      >
        <Image
          source={require("../assets/images/settingnew.png")}
          style={[
            styles.navIcon,
            isActive("Setting") && styles.activeIcon,
            isDarkMode && styles.navIconDark,
          ]}
        />
        <Text
          style={[
            styles.navText,
            isActive("Setting") && styles.activeText,
            isDarkMode && styles.navTextDark,
          ]}
        >
  الإعدادات </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderTopColor: '#d3d3d3',
    borderTopWidth: 1,
  },
  bottomNavDark: {
    backgroundColor: '#121212', // Dark background for dark mode
    borderTopColor: '#333', // Dark border for dark mode
  },
  navButton: {
    alignItems: 'center',
  },
  navIcon: {
    width: 18,
    height: 18,
    tintColor: theme.color.black,
    marginBottom:3,
  },
  navIconDark: {
    tintColor: '#fff', // White icon color for dark mode
  },
  navText: {
    fontSize: 12,
    color: theme.color.black,
  },
  navTextDark: {
    color: '#fff', // White text color for dark mode
  },
  activeIcon: {
    tintColor: theme.color.primaryColor, // Primary color for active icon
  },
  activeText: {
    color: theme.color.primaryColor, // Primary color for active text
    fontWeight: 'bold',
  },
});
