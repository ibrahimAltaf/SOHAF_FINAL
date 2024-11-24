import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../constants/styles";
import { useThemeContext } from "../../ThemeContext";

export default function AdminBottom() {
  const navigation = useNavigation();
  const { routes, index } = navigation.getState();
  const currentRouteName = routes[index]?.name || "AdminScreen"; // Default to "AdminScreen" if no route is active
  const colorScheme = useColorScheme();
  const { isDarkMode, toggleTheme } = useThemeContext(); // Dark mode from context

  const backgroundColor = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : theme.color.black;
  const activeTintColor = theme.color.primaryColor;
  const inactiveTintColor = isDarkMode ? '#AAAAAA' : theme.color.black;

  const isActive = (routeName) => currentRouteName === routeName;

  return (
    <View style={[styles.bottomNav, { backgroundColor }]}>
      <TouchableOpacity
        onPress={() => navigation.navigate("AdminScreen")}
        style={styles.navButton}
      >
        <Image
          source={require("../assets/images/homesohaf.png")}
          style={[styles.navIcon, { tintColor: isActive("AdminScreen") ? activeTintColor : inactiveTintColor }]}
        />
        <Text style={[styles.navText, { color: isActive("AdminScreen") ? activeTintColor : textColor }]}>الرئيسية</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Aprrvoles")}
        style={styles.navButton}
      >
        <Image
          source={require("../assets/images/approvesohaf.png")}
          style={[styles.navIcon, { tintColor: isActive("Aprrvoles") ? activeTintColor : inactiveTintColor }]}
        />
        <Text style={[styles.navText, { color: isActive("Aprrvoles") ? activeTintColor : textColor }]}>الموافقات</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Post")}
        style={styles.navButton}
      >
        <Image
          source={require("../assets/images/timesohaf.png")}
          style={[styles.navIcon, { tintColor: isActive("Post") ? activeTintColor : inactiveTintColor }]}
        />
        <Text style={[styles.navText, { color: isActive("Post") ? activeTintColor : textColor }]}>الإشعارات</Text>
      </TouchableOpacity>
{/* 
      <TouchableOpacity
        onPress={() => navigation.navigate("BlogList")}
        style={styles.navButton}
      >
        <Image
          source={require("../assets/images/blogsohaf.png")}
          style={[styles.navIcon, { tintColor: isActive("BlogList") ? activeTintColor : inactiveTintColor }]}
        />
        <Text style={[styles.navText, { color: isActive("BlogList") ? activeTintColor : textColor }]}>المدونات</Text>
      </TouchableOpacity> */}

      <TouchableOpacity
        onPress={() => navigation.navigate("Setting")}
        style={styles.navButton}
      >
        <Image
          source={require("../assets/images/settingnew.png")}
          style={[styles.navIcon, { tintColor: isActive("Setting") ? activeTintColor : inactiveTintColor }]}
        />
        <Text style={[styles.navText, { color: isActive("Setting") ? activeTintColor : textColor }]}>الإعدادات</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderTopColor: '#d3d3d3',
    borderTopWidth: 1,
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
    writingDirection: 'rtl',  // This ensures the text is aligned right for Arabic.
  },
});
