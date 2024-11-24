import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ToastAndroid, Keyboard, Alert, useColorScheme } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import Header from '../component/Header/header';
import { TextInput, RadioButton } from 'react-native-paper';
import AdminBottom from './AdminBottom';
import { theme } from '../constants/styles';
import { FontFamily } from '../constants/fonts';
import CustomButton from '../component/Buttons/customButton';
import { useThemeContext } from '../../ThemeContext';
import AuthorBottom from './AuthorBottom';

export default function Post(props) {
  const navigation = useNavigation();
  const [heading, setHeading] = useState('');
  const [description, setDescription] = useState('');
  const [role, setRole] = useState('author');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [loader, setLoader] = useState(false);

  const colorScheme = useColorScheme();
  const { isDarkMode, toggleTheme } = useThemeContext(); 
  
  const backgroundColor = isDarkMode ? '#1E1E1E' : theme.color.white;
  const textColor = isDarkMode ? '#FFFFFF' : theme.color.black;
  const inputBackgroundColor = isDarkMode ? '#333333' : theme.color.white;
  const buttonBackgroundColor = isDarkMode ? '#3A3A3A' : theme.color.primaryColor;
  const borderColor = isDarkMode ? '#555555' : theme.color.black;
  const placeholderColor = isDarkMode ? '#AAAAAA' : '#888888';

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
      ToastAndroid.show("مطلوب", ToastAndroid.SHORT);
      return;
    }
  
    try {
      const requestBody = {
        type: role,
        message: description,
      };
  
      // Add `user_id` only when the role is not 'all'
      if (role !== 'all') {
        requestBody.user_id = 7; // Replace 7 with dynamic ID if needed
      }
  
      const response = await fetch("https://dodgerblue-chinchilla-339711.hostingersite.com/api/admin/send-notifictaion", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      const result = await response.json();
      if (result.success) {
        ToastAndroid.show("تم إنشاء الإشعار بنجاح!", ToastAndroid.SHORT);
        navigation.navigate("AdminScreen");
      } else {
        ToastAndroid.show(result.message || "حدث خطأ", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('خطأ في إرسال البيانات: ', error);
      ToastAndroid.show('حدث خطأ أثناء إرسال الإشعار', ToastAndroid.SHORT);
    }
  };
  

  return (
    <>
      <KeyboardAvoidingView style={{ flex: 1, backgroundColor }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Header title="الإشعار" backArrow backPage={() => props.navigation.goBack()} />
        <Text style={[styles.heading, { color: textColor }]}>إنشاء إشعار</Text>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <TextInput
              label="إضافة عنوان"
              value={heading}
              onChangeText={setHeading}
              style={[styles.input, { backgroundColor: inputBackgroundColor }]}
              outlineColor={borderColor}
              activeOutlineColor={borderColor}
              theme={{
                colors: {
                  text: textColor,
                  primary: borderColor,
                  placeholder: placeholderColor,
                  background: inputBackgroundColor,
                },
              }}
            />

            <TextInput
              label="الوصف"
              value={description}
              onChangeText={setDescription}
              style={[styles.input, { backgroundColor: inputBackgroundColor, height: 100, textAlignVertical: 'top' }]}
              outlineColor={borderColor}
              activeOutlineColor={borderColor}
              theme={{
                colors: {
                  text: textColor,
                  primary: borderColor,
                  placeholder: placeholderColor,
                  background: inputBackgroundColor,
                },
              }}
              multiline
              numberOfLines={4}
            />

            <Text style={[styles.radioGroupLabel, { color: textColor }]}>اختر المجموعة لتلقي هذا الإشعار:</Text>
            
            <RadioButton.Group onValueChange={(value) => setRole(value)} value={role}>
              <View style={styles.radioButtonRow}>
                <View style={styles.radioButtonContainer}>
                  <RadioButton value="user" color={textColor} />
                  <Text style={[styles.radioLabel, { color: textColor }]}>زائر</Text>
                </View>
                <View style={styles.radioButtonContainer}>
                  <RadioButton value="author" color={textColor} />
                  <Text style={[styles.radioLabel, { color: textColor }]}>مؤلف</Text>
                </View>
                <View style={styles.radioButtonContainer}>
                  <RadioButton value="all" color={textColor} />
                  <Text style={[styles.radioLabel, { color: textColor }]}>الجميع</Text>
                </View>
              </View>
            </RadioButton.Group>
               <CustomButton
          loading={loader}
          title={"إنشاء إشعار"}
          activeOpacity={0.7}
          onPress={handlePost}
          customButtonStyle={styles.customButton}
        />
  
          </View>
        </ScrollView>

        
     
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
    justifyContent: "center",
  },
  input: {
    fontSize: 13,
    marginBottom: 8,
    width: "100%",
  },
  radioGroupLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 15,
    marginBottom: 5,
  },
  radioButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 10,
  },
  customButton: {
    marginTop: 30,
    width:"100%"
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
    margin: 20,
    shadowRadius: 15.19,
    shadowOpacity: 0.57,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 11 },
    shadowColor: "rgba(0, 0, 0, 0.05)",
    borderColor: theme.color.primaryColor,
    width: "90%",
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    fontFamily: FontFamily.boldFont,
  },
  heading: {
    fontSize: 28,
    fontWeight: "900",
    textAlign: "right",
    margin: 20,
  },
});
