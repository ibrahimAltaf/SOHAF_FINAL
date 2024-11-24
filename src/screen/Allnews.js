import React, { useEffect, useState, useRef } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, ActivityIndicator, useColorScheme } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Header from "../component/Header/header";
import { theme } from "../constants/styles";
import RBSheet from "react-native-raw-bottom-sheet"; // Import the bottom sheet component
import { useThemeContext } from "../../ThemeContext";
import VisitorBottom from "./VisitorBottom";

export default function Allnews() {
  const { user_detail, access_token } = useSelector((state) => state.userReducer);
  const navigation = useNavigation();
  const [channels, setChannels] = useState([]);
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const bottomSheetRef = useRef(null); // Reference for the bottom sheet
  const colorScheme = useColorScheme();
  const { isDarkMode, toggleTheme } = useThemeContext(); // Access dark mode from context

  useEffect(() => {
    fetchChannels();
    fetchSubscribedChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const response = await axios.get("https://dodgerblue-chinchilla-339711.hostingersite.com/api/admin/channels");
      setChannels(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching channels:", error);
      setLoading(false);
    }
  };

  const fetchSubscribedChannels = async () => {
    try {
      const response = await axios.get(
        `https://dodgerblue-chinchilla-339711.hostingersite.com/api/visitor/subscribed-channels/${user_detail.id}`
      );
      setSubscribedChannels(response.data.subscribed_channels);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching subscribed channels:", error);
      setLoading(false);
    }
  };

  const handleSubscribe = async (channelId) => {
    if (!access_token) {
      bottomSheetRef.current.open();
      return;
    }

    try {
      await axios.post(
        `https://dodgerblue-chinchilla-339711.hostingersite.com/api/visitor/channel/subscribe/${user_detail.id}/${channelId}`
      );
      fetchSubscribedChannels(); // Refresh subscribed channels
    } catch (error) {
      console.error("Error subscribing to channel:", error);
    }
  };

  const handleChannelPress = (channel) => {
    navigation.navigate("ChannelVideoScreen", { channel });
  };

  const renderChannel = (channel) => {
    const isSubscribed = subscribedChannels.some((sub) => sub.id === channel.id);

    return (
      <TouchableOpacity key={channel.id} onPress={() => handleChannelPress(channel)} style={[styles.channelCard, { backgroundColor: isDarkMode ? "#333" : "#fff" }]}>
        <Image
          source={{ uri: channel.image || "https://via.placeholder.com/60" }}
          style={styles.channelImage}
        />
        <View style={styles.channelInfo}>
          <Text style={[styles.channelTitle, { color: isDarkMode ? "#fff" : "#333" }]}>{channel.title || "القناة بدون عنوان"}</Text>
          {!isSubscribed ? (
            <TouchableOpacity onPress={() => handleSubscribe(channel.id)} style={[styles.subscribeButton, { backgroundColor: isDarkMode ? "#FFD700" : theme.color.primaryColor }]}>
              <Text style={[styles.subscribeText, { color: isDarkMode ? "#000" : "#fff" }]}>اشترك</Text>
            </TouchableOpacity>
          ) : (
            <Text style={[styles.subscribedText, { color: isDarkMode ? "#FFD700" : theme.color.primaryColor }]}>مشترك</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const handleTabChange = (tab) => {
    if (tab === "subscribed" && !access_token) {
      bottomSheetRef.current.open();
    } else {
      setActiveTab(tab);
    }
  };

  const styles = getStyles(isDarkMode);

  return (
    <>
      <Header title={"بث مباشر"} backArrow backPage={() => navigation.goBack()} />

      <View style={styles.container}>
        {/* Tabs for switching between All and Subscribed */}
        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => handleTabChange("all")} style={[styles.tab, activeTab === "all" && styles.activeTab]}>
            <Text style={[styles.tabText, activeTab === "all" && styles.activeTabText]}>الكل</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTabChange("subscribed")} style={[styles.tab, activeTab === "subscribed" && styles.activeTab]}>
            <Text style={[styles.tabText, activeTab === "subscribed" && styles.activeTabText]}>اشتراكاتي</Text>
          </TouchableOpacity>
        </View>

        {/* Loader inside the ScrollView */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={isDarkMode ? theme.color.primaryColor : theme.color.primaryColor} />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {activeTab === "all"
              ? channels.map((channel) => renderChannel(channel)) // Display only first 4 channels
              : subscribedChannels.map((channel) => renderChannel(channel))}
          </ScrollView>
        )}

        {/* Bottom Sheet for Login Reminder */}
        <RBSheet
          ref={bottomSheetRef}
          height={250}
          closeOnDragDown={true}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingHorizontal: 20,
              backgroundColor: isDarkMode ? "#333" : "#fff",
            },
          }}
        >
          <View style={styles.modalContent}>
            <Text style={[styles.modalText, { color: isDarkMode ? "#fff" : "#333" }]}>
              إذا كنت ترغب في الاشتراك بالقنوات، يرجى تسجيل الدخول أولاً.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                style={[styles.modalButton, styles.loginButton]}
              >
                <Text style={styles.modalButtonText}>تسجيل الدخول</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => bottomSheetRef.current.close()}
                style={[styles.modalButton, styles.skipButton]}
              >
                <Text style={[styles.modalButtonText, { color: "#333" }]}>تخطي</Text>
              </TouchableOpacity>
            </View>
          </View>
        </RBSheet>
      </View>
      <VisitorBottom/>
    </>
  );
}

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#121212" : "#f0f0f5",
      paddingHorizontal: 15,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isDarkMode ? "#000" : "#fff",
    },
    tabContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginVertical: 12,
      backgroundColor: isDarkMode ? "#333" : "#fff",
      borderRadius: 8,
      elevation: 2,
    },
    tab: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 10,
      marginHorizontal: 4,
      borderRadius: 8,
    },
    activeTab: {
      backgroundColor: isDarkMode ? "#FFD700" : theme.color.primaryColor,
    },
    tabText: {
      fontSize: 14,
      color: isDarkMode ? "#bbb" : "#555",
    },
    activeTabText: {
      color: isDarkMode ? "#000" : theme.color.black,
    },
    channelCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 15,
      marginVertical: 8,
      borderRadius: 10,
      elevation: 2,
    },
    channelImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 15,
    },
    channelInfo: {
      flex: 1,
    },
    channelTitle: {
      fontSize: 16,
      fontWeight: "600",
    },
    subscribeButton: {
      marginTop: 5,
      borderRadius: 5,
      paddingHorizontal: 15,
      paddingVertical: 6,
    },
    subscribeText: {
      fontSize: 14,
      textAlign: "center",
    },
    subscribedText: {
      marginTop: 5,
      fontSize: 14,
      fontWeight: "600",
    },
    modalContent: {
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 20,
    },
    modalText: {
      fontSize: 16,
      marginBottom: 20,
      textAlign: "center",
      lineHeight: 24,
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      paddingHorizontal: 20,
    },
    modalButton: {
      flex: 1,
      paddingVertical: 12,
      marginHorizontal: 5,
      borderRadius: 8,
      alignItems: "center",
    },
    loginButton: {
      backgroundColor: theme.color.primaryColor,
    },
    skipButton: {
      backgroundColor: "#e0e0e0",
    },
    modalButtonText: {
      fontSize: 14,
      fontWeight: "bold",
    },
  })    
