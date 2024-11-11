import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ToastAndroid, Image, TouchableOpacity, useColorScheme } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { TextInput } from 'react-native-paper';
import { theme } from '../constants/styles';
import RBSheet from 'react-native-raw-bottom-sheet';
import CustomButton from '../component/Buttons/customButton';
import Header from '../component/Header/header';

export default function CreateBlog(props) {
  const { user_detail } = useSelector((state) => state.userReducer); // Get user details for ID
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const bottomSheetRef = useRef(null); // Reference for RBSheet

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const backgroundColor = isDarkMode ? theme.color.darkBackground : '#f5f5f5';
  const textColor = isDarkMode ? theme.color.white : theme.color.black;

  // Image Picker function
  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const uri = response.assets[0].uri;
        setImageUri(uri);
      }
    });
  };

  // Function to submit blog
  const submitBlog = async () => {
    if (!title || !description || !imageUri) {
      ToastAndroid.show("Please fill all fields", ToastAndroid.SHORT);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('user_ki_id_i', user_detail.id); // User ID from Redux
    formData.append('image', {
      uri: imageUri,
      name: 'image.jpg',
      type: 'image/jpeg',
    });

    setLoading(true); // Show loader

    try {
      const response = await axios.post(
        `https://dodgerblue-chinchilla-339711.hostingersite.com/api/author/blogs/${user_detail.id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);

      // Open the bottom sheet to show approval message
      bottomSheetRef.current.open();

      // Clear all fields
      setTitle('');
      setDescription('');
      setImageUri(null);
    } catch (error) {
      console.error(error);
      ToastAndroid.show("Error creating blog", ToastAndroid.SHORT);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <>
      <Header title={"Add Blog"} backArrow backPage={() => props.navigation.goBack()} />
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.heading, { color: textColor }]}>Create new blog</Text>

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Text style={[styles.uploadText, { color: isDarkMode ? theme.color.black : theme.color.black }]}>Upload Image</Text>
          {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}
        </TouchableOpacity>

        <TextInput
          label={"Title"}
          value={title}
          onChangeText={setTitle}
          style={[styles.input, { backgroundColor: isDarkMode ? theme.color.darkInput : theme.color.white }]}
          outlineColor={textColor}
          activeOutlineColor={textColor}
          theme={{
            colors: {
              text: textColor,
              primary: textColor,
            },
          }}
        />
        
        <TextInput
          label={"Description"}
          style={[
            styles.input,
            { height: 150, textAlignVertical: 'top', backgroundColor: isDarkMode ? theme.color.darkInput : theme.color.white },
          ]}
          outlineColor={textColor}
          activeOutlineColor={textColor}
          theme={{
            colors: {
              text: textColor,
              primary: textColor,
            },
          }}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <CustomButton
          loading={loading}
          title="Submit Blog"
          onPress={submitBlog}
          customButtonStyle={[styles.customButton, { backgroundColor: isDarkMode ? theme.color.darkPrimary : theme.color.primaryColor }]}
        />

        {/* Bottom Sheet for Confirmation */}
        <RBSheet
          ref={bottomSheetRef}
          height={250}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
            },
          }}
        >
          <Image
            source={{ uri: "https://cdni.iconscout.com/illustration/premium/thumb/entrepreneur-getting-business-approval-illustration-download-in-svg-png-gif-file-formats--like-logo-successful-idea-pack-people-illustrations-4010293.png?f=webp" }} 
            style={styles.sheetImage}
          />
          <Text style={[styles.sheetText, { color: textColor }]}>Your blog has been submitted!</Text>
          <Text style={[styles.sheetText, { color: textColor }]}>It will be reviewed by the admin for approval.</Text>
          <CustomButton
            title="Close"
            onPress={() => bottomSheetRef.current.close()}
            customButtonStyle={styles.closeButton}
          />
        </RBSheet>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  heading: {
    fontSize: 28,
    fontWeight: "900",
    textAlign: "left",
    marginBottom: 20,
  },
  input: {
    fontSize: 13,
    marginBottom: 8,
  },
  imagePicker: {
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  uploadText: {
    fontSize: 16,
    color:theme.color.black,
    fontWeight:"600"
},
  imagePreview: {
    width: "100%",
    height: 200,
    marginTop: 10,
    resizeMode: "contain",
  },
  customButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  sheetText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 8,
    fontWeight:"900"
  },

  closeButton: {
    backgroundColor: theme.color.primaryColor,
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    width:"100%",
    color:"#ffff"
  },
});
