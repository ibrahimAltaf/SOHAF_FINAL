import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../constants/styles";

export default function VisitorBottom() {
  const navigation = useNavigation();
  const { routes, index } = navigation.getState();
  const currentRouteName = routes[index]?.name || "AdminScreen"; // Default to "AdminScreen" if no route is active

  const isActive = (routeName) => currentRouteName === routeName;

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        onPress={() => navigation.navigate("VisitorScreen")}
        style={styles.navButton}
      >
        <Image
          source={require("../assets/images/homesohaf.png")}
          style={[styles.navIcon, isActive("VisitorScreen") && styles.activeIcon]}
        />
        <Text style={[styles.navText, isActive("VisitorScreen") && styles.activeText]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("AllNews")}
        style={styles.navButton}
      >
        <Image
          source={require("../assets/images/NewChannel.png")}
          style={[styles.navIcon, isActive("AllNews") && styles.activeIcon]}
        />
        <Text style={[styles.navText, isActive("AllNews") && styles.activeText]}>Channels</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("VisitorBlog")}
        style={styles.navButton}
      >
        <Image
          source={require("../assets/images/blogsohaf.png")}
          style={[styles.navIcon, isActive("VisitorBlog") && styles.activeIcon]}
        />
        <Text style={[styles.navText, isActive("VisitorBlog") && styles.activeText]}>Blogs</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("LiveNews")}
        style={styles.navButton}
      >
        <Image
          source={require("../assets/images/subscribe.png")}
          style={[styles.navIcon, isActive("Subscribe") && styles.activeIcon]}
        />
        <Text style={[styles.navText, isActive("Subscribe") && styles.activeText]}>Subscribe</Text>
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
