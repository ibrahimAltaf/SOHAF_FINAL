import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, SafeAreaView, Modal } from 'react-native';
import { theme } from '../constants/styles';
import { useNavigation } from '@react-navigation/native';

const channels = [
  {
    id: '1',
    name: 'Saudi News',
    logo: 'https://iconape.com/wp-content/png_logo_vector/%D8%B4%D8%B9%D8%A7%D8%B1-%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1-%D8%A7%D9%84%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9.png',
  },
  {
    id: '2',
    name: 'Saudi 24 News',
    logo: 'https://iconape.com/wp-content/png_logo_vector/%D8%B4%D8%B9%D8%A7%D8%B1-%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1-%D8%A7%D9%84%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9.png',
  },
  // Add more channels here
];

export default function Live() {
    const navigation = useNavigation()
  const [modalVisible, setModalVisible] = useState(false);
  const [subscribedChannel, setSubscribedChannel] = useState('');

  const handleSubscribe = (channelName) => {
    setSubscribedChannel(channelName);
    setModalVisible(true);
  };

  const renderChannel = ({ item }) => (
    <View style={styles.channelContainer}>
      <Image source={{ uri: item.logo }} style={styles.logo} />
      <View style={styles.infoContainer}>
        <Text style={styles.channelName}>{item.name}</Text>
        <TouchableOpacity style={styles.subscribeButton} onPress={() => handleSubscribe(item.name)}>
          <Text style={styles.subscribeText}>Subscribe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Live News Channels</Text>
        <FlatList
          data={channels}
          keyExtractor={(item) => item.id}
          renderItem={renderChannel}
          contentContainerStyle={styles.listContainer}
        />

        {/* Modal for Subscription Confirmation */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Subscription Successful!</Text>
              <Text style={styles.modalText}>You have successfully subscribed to {subscribedChannel}.</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.bottomNav}>
        {/* Home */}
        <TouchableOpacity onPress={()=>navigation.navigate("AdminScreen")} style={styles.navButton}>
          <Image
            source={require("../assets/images/home.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        {/* Live */}
        <TouchableOpacity onPress={()=>navigation.navigate("Live")} style={styles.navButton}>
          <Image
            source={require("../assets/images/icons8-live-24.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>LIVE</Text>
        </TouchableOpacity>

        {/* Floating Add Button */}
        <TouchableOpacity style={styles.addPostButton}>
          <Text style={styles.addPostText}>+</Text>
        </TouchableOpacity>

        {/* Posts */}
        <TouchableOpacity onPress={()=>navigation.navigate("ShowPost")} style={styles.navButton}>
          <Image
            source={require("../assets/images/icons8-edit-property-24.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Posts</Text>
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity style={styles.navButton}>
          <Image
            source={require("../assets/images/icons8-admin-settings-male-24.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f7f7f7',

  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7', // Light background for better contrast
  },
  headerText: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.color.black, // Yellow for the header text
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  channelContainer: {
    flexDirection: 'row',
    backgroundColor: '#2C3E50', // Dark background for each channel
    padding: 15,
    marginVertical: 10,
    borderRadius: 15, // Rounded corners for modern design
    alignItems: 'center',
    elevation: 3, // Shadow effect
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25, // Circular logo
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  channelName: {
    fontSize: 18,
    color: '#fff', // White text on black background
    fontWeight: '600',
  },
  subscribeButton: {
    backgroundColor: '#F1C40F', // Yellow subscribe button
    paddingVertical: 6,
    paddingHorizontal: 16, // Sleek and modern button size
    borderRadius: 20,
    elevation: 2,
  },
  subscribeText: {
    fontSize: 14,
    color: '#2C3E50', // Black text inside the yellow button
    fontWeight: '600',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Transparent background for modal
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#F1C40F',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  modalButtonText: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.color.white, // White background for nav bar
    paddingVertical: 10,
    position:"absolute",
    bottom:0,
    width:"100%",
    paddingHorizontal: 20,
    borderTopLeftRadius: 25, // Rounded corners for modern look
    borderTopRightRadius: 25,
    elevation: 10, // Shadow effect for elevation
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  navButton: {
    alignItems: 'center',
    width: 60,
  },
  navIcon: {
    width: 28,
    height: 28,
    marginBottom: 5,
  },
  navText: {
    fontSize: 12,
    color: '#333', // Darker text for nav items
    fontWeight: '600',
  },
  addPostButton: {
    backgroundColor: theme.color.primaryColor, // Teal color for the floating button
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 40,
    left: '45%', // Center align
    elevation: 10, // Floating effect with shadow
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
  },
  addPostText: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: -5, // Fine-tune for perfect centering of "+"
  },
});
