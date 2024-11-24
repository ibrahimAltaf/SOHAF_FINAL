import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../constants/styles";
import { useThemeContext } from "../../ThemeContext";

export default function AuthorBottom() {
  const navigation = useNavigation();
  const { routes, index } = navigation.getState();
  const currentRouteName = routes[index]?.name || "AdminScreen"; // Default to "AdminScreen" if no route is active
  const colorScheme = useColorScheme();
  const { isDarkMode, toggleTheme } = useThemeContext(); // Access dark mode from context

  const isActive = (routeName) => currentRouteName === routeName;

  const backgroundColor = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const borderColor = isDarkMode ? '#333333' : '#D3D3D3';
  const iconColor = isDarkMode ? '#AAAAAA' : theme.color.black;
  const activeIconColor = theme.color.primaryColor;
  const textColor = isDarkMode ? '#AAAAAA' : theme.color.black;
  const activeTextColor = theme.color.primaryColor;

  return (
    <View style={[styles.bottomNav, { backgroundColor, borderTopColor: borderColor }]}>
      <TouchableOpacity
        onPress={() => navigation.navigate("AuthorScreen")}
        style={styles.navButton}
      >
        <Image
          source={require("../assets/images/homesohaf.png")}
          style={[styles.navIcon, { tintColor: isActive("AuthorScreen") ? activeIconColor : iconColor }]}
        />
        <Text style={[styles.navText, { color: isActive("AuthorScreen") ? activeTextColor : textColor }]}>
          الصفحة الرئيسية
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("AddBlog")}
        style={styles.navButton}
      >
        <Image
          source={require("../assets/images/blog.png")}
          style={[styles.navIcon, { tintColor: isActive("AddBlog") ? activeIconColor : iconColor }]}
        />
        <Text style={[styles.navText, { color: isActive("AddBlog") ? activeTextColor : textColor }]}>
          مدونة جديدة
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Setting")}
        style={styles.navButton}
      >
        <Image
          source={require("../assets/images/settingnew.png")}
          style={[styles.navIcon, { tintColor: isActive("AuthoProfile") ? activeIconColor : iconColor }]}
        />
        <Text style={[styles.navText, { color: isActive("AuthoProfile") ? activeTextColor : textColor }]}>
        الإعدادات</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderTopWidth: 1,
    paddingHorizontal: 25,
  },
  navButton: {
    alignItems: 'center',
  },
  navIcon: {
    width: 20,
    height: 20,
  },
  navText: {
    fontSize: 12,
  },
});
