import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Header from "../component/Header/header";
import { theme } from "../constants/styles";

export default function Allnews() {
  const { user_detail } = useSelector((state) => state.userReducer);
  const navigation = useNavigation();
  const [channels, setChannels] = useState([]);
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

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
    navigation.navigate("ChannelVideoScreen", { channel }); // Pass the selected channel
  };

  const renderChannel = (channel) => {
    const isSubscribed = subscribedChannels.some((sub) => sub.id === channel.id);

    return (
      <TouchableOpacity key={channel.id} onPress={() => handleChannelPress(channel)} style={styles.channelCard}>
        <Image
          source={{ uri: channel.image || "https://via.placeholder.com/60" }}
          style={styles.channelImage}
        />
        <View style={styles.channelInfo}>
          <Text style={styles.channelTitle}>{channel.title || "Untitled Channel"}</Text>
          {!isSubscribed ? (
            <TouchableOpacity onPress={() => handleSubscribe(channel.id)} style={styles.subscribeButton}>
              <Text style={styles.subscribeText}>Subscribe</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.subscribedText}>Subscribed</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
       <Header title={"Live"} backArrow backPage={() => navigation.goBack()} />

      <View style={styles.container}>
        {/* Tabs for switching between All and Subscribed */}
        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => setActiveTab("all")} style={[styles.tab, activeTab === "all" && styles.activeTab]}>
            <Text style={[styles.tabText, activeTab === "all" && styles.activeTabText]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("subscribed")} style={[styles.tab, activeTab === "subscribed" && styles.activeTab]}>
            <Text style={[styles.tabText, activeTab === "subscribed" && styles.activeTabText]}>My Subscriptions</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={theme.color.primaryColor} style={styles.loader} />
        ) : (
          <ScrollView>
            {activeTab === "all"
              ? channels.map((channel) => renderChannel(channel))
              : subscribedChannels.map((channel) => renderChannel(channel))}
          </ScrollView>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 8,
    margin: 4,
  },
  activeTab: {
    backgroundColor: theme.color.black,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 3,
  },
  tabText: {
    fontSize: 12,
    color: "#555",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  channelCard: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  channelImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: "#e1e1e1",
  },
  channelInfo: {
    flex: 1,
  },
  channelTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  subscribeButton: {
    backgroundColor: theme.color.primaryColor,
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 5,
    alignSelf: "flex-start",
  },
  subscribeText: {
    color: theme.color.black,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  subscribedText: {
    color: theme.color.black,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 5,
  },
  loader: {
    marginTop: 20,
  },
});
