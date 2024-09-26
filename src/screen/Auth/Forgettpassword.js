import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ToastMessage, helpers } from '../../utils/helpers';

export default function ForgetPassword() {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [loader, setLoader] = useState(false);

  const validateField = () => {
    const cleanedEmail = email.replace(/\s/g, '');
    const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,7})+$/;
    if (email === '') {
      ToastMessage('Email Address Required*');
      return false;
    } else if (emailValidation.test(cleanedEmail) === false) {
      ToastMessage('Enter Valid Email Address');
      return false;
    }
    return true;
  };
  const resetPasswordHandle = () => {
    try {
      if (validateField()) {
        setLoader(true);
        const formdata = new FormData();
        formdata.append('email', email);
  
        const requestOptions = {
          method: 'POST',
          body: formdata,
          redirect: 'follow',
        };
  
        fetch(`${helpers.api.baseUrl}forgot/password`, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            setLoader(false);
            console.log('API Response:', result); // Log the entire result object
            
            // Check for a successful response
            if (result?.user) {
              ToastMessage(result?.message);
              navigation.navigate("VerifyOtp");
            } else {
              ToastMessage(result?.message);
            }
          })
          .catch((error) => {
            setLoader(false);
            ToastMessage(error?.message);
          });
      }
    } catch (error) {
      setLoader(false);
      ToastMessage(error?.message);
    }
  };
  
  const handleSubmitCode = () => {
    // Handle the entered code submission
    Alert.alert('Code Submitted', `Entered Code: ${code}`);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Placeholder for Logo */}
      <View style={styles.logoContainer}>
      <Image style={{
            width:200,
            height:100,
            objectFit:"cover"
          }} source={require("../../assets/images/newlogo.png")} />
      </View>

      {/* Screen Heading */}
      <Text style={styles.heading}>Forget Password</Text>

      {/* Input Field for Email */}
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#999999"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={resetPasswordHandle}>
        {loader ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Reset Password</Text>
        )}
      </TouchableOpacity>

      {/* Modal for Entering Code */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Enter Verification Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter code"
              placeholderTextColor="#999999"
              value={code}
              onChangeText={(text) => setCode(text)}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmitCode}>
              <Text style={styles.buttonText}>Submit Code</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F8FE',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 30,
    height: 100,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    color: '#000000',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#a7a7a7',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#FFF',
    color: '#7D7C7C',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#0461a5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeading: {
    fontSize: 20,
    color: '#000000',
    marginBottom: 20,
    fontWeight: 'bold',
  },
});
