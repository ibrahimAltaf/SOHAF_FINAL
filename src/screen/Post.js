import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ToastAndroid, Keyboard, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import Header from '../component/Header/header';
import { theme } from '../constants/styles';
import { TextInput, useTheme, RadioButton } from 'react-native-paper';
import AdminBottom from './AdminBottom';
import { FontFamily } from '../constants/fonts';

export default function Post(props) {
  const navigation = useNavigation();
  const { colors, dark } = useTheme();
  const [heading, setHeading] = useState('');
  const [description, setDescription] = useState('');
  const [role, setRole] = useState('author'); // Default type is "author"
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handlePost = async () => {
    if (!heading || !description) {
      Alert.alert("Required", "Please fill in all required fields.");
      return;
    }
    
    try {
      const response = await fetch("https://dodgerblue-chinchilla-339711.hostingersite.com/api/admin/send-notifictaion", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: role, // Notification type based on selected radio button
          user_id: 7, // Replace with dynamic user_id if needed
          message: description,
        }),
      });

      const result = await response.json();
      if (result.success) {
        ToastAndroid.show("Notification created successfully!", ToastAndroid.SHORT);
        navigation.navigate("AdminScreen");
      } else {
        ToastAndroid.show("Error", result.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Error posting data: ', error);
      ToastAndroid.show('Error', 'An error occurred while sending the notification');
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Header title="Notification" backArrow backPage={() => props.navigation.goBack()} />
        <Text style={styles.heading}>Create Notification</Text>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <TextInput
              label="Add Heading"
              value={heading}
              onChangeText={setHeading}
              style={styles.input}
              outlineColor="black"
              activeOutlineColor="black"
              theme={{
                colors: {
                  text: theme.color.black,
                  primary: "black",
                },
              }}
              placeholderTextColor={dark ? "#fff" : "#000"}
            />

            <TextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
              outlineColor="black"
              activeOutlineColor="black"
              theme={{
                colors: {
                  text: theme.color.black,
                  primary: "black",
                },
              }}
              placeholderTextColor={dark ? "#fff" : "#000"}
              multiline
              numberOfLines={4}
            />

            {/* Label for RadioButton group */}
            <Text style={styles.radioGroupLabel}>Choose the group to receive this notification:</Text>
            
            {/* Radio buttons for selecting notification type */}
            <RadioButton.Group onValueChange={(value) => setRole(value)} value={role}>
              <View style={styles.radioButtonRow}>
                <View style={styles.radioButtonContainer}>
                  <RadioButton value="user" />
                  <Text style={styles.radioLabel}>Visitor</Text>
                </View>
                <View style={styles.radioButtonContainer}>
                  <RadioButton value="author" />
                  <Text style={styles.radioLabel}>Author</Text>
                </View>
                <View style={styles.radioButtonContainer}>
                  <RadioButton value="all" />
                  <Text style={styles.radioLabel}>All</Text>
                </View>
              </View>
            </RadioButton.Group>
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Text style={styles.buttonText}>Create Notification</Text>
        </TouchableOpacity>

        {!isKeyboardVisible && <AdminBottom />}
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  container: {
    alignItems: 'center',
    justifyContent:"center"
  },
  input: {
    backgroundColor: theme.color.white,
    fontSize: 13,
    marginBottom: 8,
    width: "100%",
  },
  radioGroupLabel: {
    fontSize: 15, // Slightly larger font size for readability
    fontWeight: '500',
    marginTop: 15,
    marginBottom: 5,
    color: theme.color.black,
  },
  radioButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 10,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    marginLeft: 5,
    fontSize: 14,
  },
  postButton: {
    height: 50,
    elevation: 23,
    borderWidth: 1,
    borderRadius: 10,
    margin: 20, // Added margin to position the button at the bottom
    shadowRadius: 15.19,
    shadowOpacity: 0.57,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 11 },
    shadowColor: "rgba(0, 0, 0, 0.05)",
    borderColor: theme.color.primaryColor,
    backgroundColor: theme.color.primaryColor,
    width: "90%", // Slightly reduced width for aesthetic alignment
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    color: theme.color.black, // Updated to white for better contrast
    fontFamily: FontFamily.boldFont,
  },
  heading: {
    fontSize: 28,
    fontWeight: "900",
    color: theme.color.black,
    textAlign: "left",
    margin:20,
  },
});
