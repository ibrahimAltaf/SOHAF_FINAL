import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ToastAndroid, Image, TouchableOpacity, useColorScheme } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { TextInput } from 'react-native-paper';
import RBSheet from 'react-native-raw-bottom-sheet';
import CustomButton from '../component/Buttons/customButton';
import Header from '../component/Header/header';
import { theme } from '../constants/styles';
import { useThemeContext } from '../../ThemeContext';

export default function CreateBlog(props) {
  const { user_detail } = useSelector((state) => state.userReducer);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const bottomSheetRef = useRef(null);

  const colorScheme = useColorScheme();
  const { isDarkMode, toggleTheme } = useThemeContext(); // Access dark mode and toggleTheme from context

  const backgroundColor = isDarkMode ? '#1E1E1E' : '#f5f5f5';
  const textColor = isDarkMode ? '#FFFFFF' : theme.color.black;
  const inputBackgroundColor = isDarkMode ? '#333333' : '#FFFFFF';
  const buttonBackgroundColor = isDarkMode ? '#3A3A3A' : '#007BFF';
  const placeholderTextColor = isDarkMode ? '#AAAAAA' : '#888888';
  const borderColor = isDarkMode ? '#555555' : theme.color.black;
  const placeholderColor = isDarkMode ? '#AAAAAA' : '#888888';
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

  const submitBlog = async () => {
    if (!title || !description || !imageUri) {
      ToastAndroid.show("من فضلك أكمل جميع الحقول", ToastAndroid.SHORT);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('user_ki_id_i', user_detail.id);
    formData.append('image', {
      uri: imageUri,
      name: 'image.jpg',
      type: 'image/jpeg',
    });

    setLoading(true);

    try {
      const response = await axios.post(
        `https://dodgerblue-chinchilla-339711.hostingersite.com/api/author/blogs/${user_detail.id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);

      bottomSheetRef.current.open();

      setTitle('');
      setDescription('');
      setImageUri(null);
    } catch (error) {
      console.error(error);
      ToastAndroid.show("حدث خطأ أثناء إنشاء المدونة", ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title={"أضف مدونة"} backArrow backPage={() => props.navigation.goBack()} />
      <View style={[styles.container, { backgroundColor }]}>
        {/* <Text style={[styles.heading, { color: textColor }]}>إنشاء مدونة جديدة</Text> */}

        <TouchableOpacity style={[styles.imagePicker, { borderColor: textColor }]} onPress={pickImage}>
          <Text style={[styles.uploadText, { color: textColor }]}>رفع صورة</Text>
          {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}
        </TouchableOpacity>

        <TextInput
          label="العنوان"
          value={title}
          onChangeText={setTitle}
          style={[styles.input, { backgroundColor: inputBackgroundColor }]}
          outlineColor={borderColor}
          activeOutlineColor={borderColor}
          textColor={isDarkMode ? theme.color.white :theme.color.black}
          theme={{
            colors: {
              text: isDarkMode ? theme.color.white :theme.color.black,
              primary: borderColor,
              placeholder: placeholderColor,
              background: inputBackgroundColor,
            },
          }}
        />
        
        <TextInput
          label="الوصف"
          style={[styles.input, { height: 150, textAlignVertical: 'top', backgroundColor: inputBackgroundColor }]}
          outlineColor={borderColor}
          activeOutlineColor={borderColor}
          textColor={isDarkMode ? theme.color.white :theme.color.black}

          theme={{
            colors: {
              text: textColor,
              primary: borderColor,
              placeholder: placeholderColor,
              background: inputBackgroundColor,
            },
          }}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <CustomButton
          loading={loading}
          title="إرسال المدونة"
          onPress={submitBlog}
          customButtonStyle={[styles.customButton, { backgroundColor: theme.color.primaryColor }]}
          textColor={textColor}
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
              backgroundColor,
            },
          }}
        >
          <Image
            source={{ uri: "https://cdni.iconscout.com/illustration/premium/thumb/entrepreneur-getting-business-approval-illustration-download-in-svg-png-gif-file-formats--like-logo-successful-idea-pack-people-illustrations-4010293.png?f=webp" }} 
            style={styles.sheetImage}
          />
          <Text style={[styles.sheetText, { color: textColor }]}>تم إرسال مدونتك بنجاح!</Text>
          <Text style={[styles.sheetText, { color: textColor }]}>سيتم مراجعتها من قبل المسؤول للموافقة عليها.</Text>
          <CustomButton
            title="إغلاق"
            onPress={() => bottomSheetRef.current.close()}
            customButtonStyle={[styles.closeButton, { backgroundColor: theme.color.primaryColor }]}
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
    borderRadius: 8,

    marginBottom: 10,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: "600",
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
    fontWeight: "900",
  },
  closeButton: {
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    width: "100%",
  },
});
