import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,

  TouchableOpacity,
  Image,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ToastMessage, helpers } from '../../utils/helpers';
import { theme } from '../../constants/styles';
import { TextInput } from 'react-native-paper';
import CustomButton from '../../component/Buttons/customButton';
import { ImageBackground } from 'react-native';

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
 <>
 <ImageBackground 
        source={{uri:"https://t3.ftcdn.net/jpg/03/55/60/70/360_F_355607062_zYMS8jaz4SfoykpWz5oViRVKL32IabTP.jpg"}}  // Add your background image path here
        style={styles.backgroundImage} 
        resizeMode="cover"
      >
    <View style={styles.container}>
    <Text style={styles.heading}>Forgot Password</Text>
    <Text style={styles.subText}>
  Enter your email to receive password reset OTP.
</Text>

 

      {/* Input Field for Email */}
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#999999"
        keyboardType="email-address"
        value={email}
        mode="outlined" 
        outlineColor="#ffff"
        activeOutlineColor="#0000"
        onChangeText={setEmail}
      />

      {/* Submit Button */}
      <CustomButton
            loading={loader}
            title={"Send Code"}
            activeOpacity={0.7}
            onPress={handleSubmitCode}
            customButtonStyle={styles.customButton}
          />

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
    </ImageBackground>
 </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:50,
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
  },
  logoContainer: {
    marginBottom: 30,
    height: 100,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: "900",
    color: theme.color.black,
    textAlign: "left",
  },
  subText: {
    fontSize: 15,
    color: theme.color.black,
    textAlign: "left",
    marginBottom: 30,
    fontWeight:"500"
  },
  input: {
    backgroundColor: "#fff",
    marginBottom: 20,
    width:"100%"
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: theme.color.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: theme.color.black,
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
  circle: {
    width: 70,
    height: 70,
    backgroundColor: theme.color.primaryColor,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dcText: {
    fontSize: 16,
    fontWeight: '900',
    color: 'black',
    textAlign: 'center',
    lineHeight: 75,
  },
});
