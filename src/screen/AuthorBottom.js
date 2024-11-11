import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../constants/styles";

export default function AuthorBottom() {
  const navigation = useNavigation();
  const { routes, index } = navigation.getState();
  const currentRouteName = routes[index]?.name || "AdminScreen"; // Default to "AdminScreen" if no route is active

  const isActive = (routeName) => currentRouteName === routeName;

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        onPress={() => navigation.navigate("AuthorScreen")}
        style={styles.navButton}
      >
        <Image
          source={require("../assets/images/homesohaf.png")}
          style={[styles.navIcon, isActive("AuthorScreen") && styles.activeIcon]}
        />
        <Text style={[styles.navText, isActive("AuthorScreen") && styles.activeText]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("AddBlog")}
        style={styles.navButton}
      >
        <Image
          source={require("../assets/images/blog.png")}
          style={[styles.navIcon, isActive("AddBlog") && styles.activeIcon]}
        />
        <Text style={[styles.navText, isActive("AddBlog") && styles.activeText]}>New Blog</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("AuthorPending")}
        style={styles.navButton}
      >
        <Image
          source={require("../assets/images/approvesohaf.png")}
          style={[styles.navIcon, isActive("AuthorPending") && styles.activeIcon]}
        />
        <Text style={[styles.navText, isActive("AuthorPending") && styles.activeText]}>Blogs</Text>
      </TouchableOpacity>

    

      <TouchableOpacity
        onPress={() => navigation.navigate("AuthoProfile")}
        style={styles.navButton}
      >
        <Image
          source={require("../assets/images/usersohaf.png")}
          style={[styles.navIcon, isActive("AuthoProfile") && styles.activeIcon]}
        />
        <Text style={[styles.navText, isActive("AuthoProfile") && styles.activeText]}>Profile</Text>
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
    paddingHorizontal:25,
  },
  navButton: {
    alignItems: 'center',
  },
  navIcon: {
    width: 20,
    height: 20,
    tintColor: theme.color.black,
  },
  navText: {
    fontSize: 12,
    color: theme.color.black,
  },
  activeIcon: {
    tintColor: theme.color.primaryColor, // Use a different color to indicate active state
  },
  activeText: {
    color: theme.color.primaryColor, // Use a different color to indicate active state
    fontWeight: 'bold',
  },
});
