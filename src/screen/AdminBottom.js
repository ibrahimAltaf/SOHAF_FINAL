import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../constants/styles";

export default function AdminBottom() {
  const navigation = useNavigation();
  const { routes, index } = navigation.getState();
  const currentRouteName = routes[index]?.name || "AdminScreen"; // Default to "AdminScreen" if no route is active

  const isActive = (routeName) => currentRouteName === routeName;

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        onPress={() => navigation.navigate("AdminScreen")}
        style={styles.navButton}
      >
        <Image
          source={require("../assets/images/homesohaf.png")}
          style={[styles.navIcon, isActive("AdminScreen") && styles.activeIcon]}
        />
        <Text style={[styles.navText, isActive("AdminScreen") && styles.activeText]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Aprrvoles")}
        style={styles.navButton}
      >
        <Image
          source={require("../assets/images/approvesohaf.png")}
          style={[styles.navIcon, isActive("Aprrvoles") && styles.activeIcon]}
        />
        <Text style={[styles.navText, isActive("Aprrvoles") && styles.activeText]}>Approvals</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Post")}
        style={styles.navButton}
      >
        <Image
          source={require("../assets/images/timesohaf.png")}
          style={[styles.navIcon, isActive("Post") && styles.activeIcon]}
        />
        <Text style={[styles.navText, isActive("Post") && styles.activeText]}>Notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("BlogList")}
        style={styles.navButton}
      >
        <Image
          source={require("../assets/images/blogsohaf.png")}
          style={[styles.navIcon, isActive("BlogList") && styles.activeIcon]}
        />
        <Text style={[styles.navText, isActive("BlogList") && styles.activeText]}>Blogs</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Profile")}
        style={styles.navButton}
      >
        <Image
          source={require("../assets/images/usersohaf.png")}
          style={[styles.navIcon, isActive("Profile") && styles.activeIcon]}
        />
        <Text style={[styles.navText, isActive("Profile") && styles.activeText]}>Profile</Text>
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
