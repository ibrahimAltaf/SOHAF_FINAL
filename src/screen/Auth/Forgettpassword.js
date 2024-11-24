import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../constants/styles";
import { TextInput } from "react-native-paper";
import CustomButton from "../../component/Buttons/customButton";
import { ImageBackground } from "react-native";

export default function ForgetPassword() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loader, setLoader] = useState(false);
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Verify OTP, 3: Reset Password

  const validateEmail = () => {
    const cleanedEmail = email.trim();
    const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,7})+$/;
    if (!email) {
      ToastAndroid.show("Email Address Required*", ToastAndroid.SHORT);
      return false;
    } else if (!emailValidation.test(cleanedEmail)) {
      ToastAndroid.show("Enter Valid Email Address", ToastAndroid.SHORT);
      return false;
    }
    return true;
  };

  const handleRequestOTP = async () => {
    if (!validateEmail()) return;
    setLoader(true);
    try {
      const response = await fetch("https://dodgerblue-chinchilla-339711.hostingersite.com/api/forgot/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      setLoader(false);
      if (result) {
        ToastAndroid.show(result.message, ToastAndroid.SHORT);
        // Step update only after successful response
        setTimeout(() => setStep(2), 500); // Delayed state update
      } else {
        ToastAndroid.show(result.message, ToastAndroid.SHORT);
      }
    } catch (error) {
      setLoader(false);
      ToastAndroid.show("Failed to send OTP", ToastAndroid.SHORT);
    }
  };
  

  const handleVerifyOTP = async () => {
    setLoader(true);
    try {
      const response = await fetch(`https://dodgerblue-chinchilla-339711.hostingersite.com/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const result = await response.json();
      setLoader(false);
      if (result) {
        ToastAndroid.show(result, ToastAndroid.SHORT);
        // Step update only after successful response
        setTimeout(() => setStep(3), 500); // Delayed state update
      } else {
        ToastAndroid.show(result, ToastAndroid.SHORT);
      }
    } catch (error) {
      setLoader(false);
      ToastAndroid.show("Failed to verify OTP", ToastAndroid.SHORT);
    }
  };
  

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      ToastAndroid.show("Passwords do not match", ToastAndroid.SHORT);
      return;
    }
    setLoader(true);
    try {
      const response = await fetch("https://dodgerblue-chinchilla-339711.hostingersite.com/api/reset/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: newPassword, password_confirmation: confirmPassword }),
      });
      const result = await response.json();
      setLoader(false);
      if (result.success) {
        ToastAndroid.show(result.message, ToastAndroid.SHORT);
        navigation.navigate("Login");
      } else {
        ToastAndroid.show(result.message, ToastAndroid.SHORT);
      }
    } catch (error) {
      setLoader(false);
      ToastAndroid.show("Failed to reset password", ToastAndroid.SHORT);
    }
  };

  return (
<ImageBackground
  source={{
    uri: "https://t3.ftcdn.net/jpg/03/55/60/70/360_F_355607062_zYMS8jaz4SfoykpWz5oViRVKL32IabTP.jpg",
  }}
  style={styles.backgroundImage}
  resizeMode="cover"
>
  <View style={styles.container}>
    {step === 1 && (
      <>
        <Text style={styles.heading}>نسيت كلمة المرور</Text>
        <Text style={styles.subText}>أدخل بريدك الإلكتروني لتلقي رمز التحقق لإعادة تعيين كلمة المرور.</Text>
        <TextInput
          style={styles.input}
          placeholder="أدخل بريدك الإلكتروني"
          placeholderTextColor="#999999"
          keyboardType="email-address"
          value={email}
          textColor={theme.color.black}
          activeOutlineColor="black"
          theme={{
            colors: {
              text: theme.color.black,
              primary: "black",
            },
          }}
          onChangeText={setEmail}
        />
        <CustomButton
          loading={loader}
          title={"إرسال الرمز"}
          onPress={handleRequestOTP}
          customButtonStyle={styles.customButton}
        />
      </>
    )}

    {step === 2 && (
      <>
        <Text style={styles.heading}>تأكيد رمز التحقق</Text>
        <Text style={styles.subText}>أدخل رمز التحقق المرسل إلى بريدك الإلكتروني.</Text>
        <TextInput
          style={styles.input}
          placeholder="أدخل رمز التحقق"
          placeholderTextColor="#999999"
          keyboardType="numeric"
          value={code}
          onChangeText={setCode}
          textColor={theme.color.black}
          activeOutlineColor="black"
          theme={{
            colors: {
              text: theme.color.black,
              primary: "black",
            },
          }}

        />
        <CustomButton
          loading={loader}
          title={"تأكيد رمز التحقق"}
          onPress={handleVerifyOTP}
          customButtonStyle={styles.customButton}
        />
      </>
    )}

    {step === 3 && (
      <>
        <Text style={styles.heading}>إعادة تعيين كلمة المرور</Text>
        <Text style={styles.subText}>أدخل كلمة المرور الجديدة.</Text>
        <TextInput
          style={styles.input}
          placeholder="كلمة المرور الجديدة"
          placeholderTextColor="#999999"
          secureTextEntry={true}
          textColor={theme.color.black}
          value={newPassword}
          onChangeText={setNewPassword}
          activeOutlineColor="black"
          theme={{
            colors: {
              text: theme.color.black,
              primary: "black",
            },
          }}

        />
        <TextInput
          style={styles.input}
          placeholder="تأكيد كلمة المرور الجديدة"
          placeholderTextColor="#999999"
          secureTextEntry={true}
          value={confirmPassword}
          textColor={theme.color.black}
          activeOutlineColor="black"
          theme={{
            colors: {
              text: theme.color.black,
              primary: "black",
            },
          }}

          onChangeText={setConfirmPassword}
        />
        <CustomButton
          loading={loader}
          title={"إعادة تعيين كلمة المرور"}
          onPress={handleResetPassword}
          customButtonStyle={styles.customButton}
        />
      </>
    )}
  </View>
</ImageBackground>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
  },
  heading: {
    fontSize: 28,
    fontWeight: "900",
    color: theme.color.black,
    textAlign: "left",
    marginBottom: 10,
  },
  subText: {
    fontSize: 15,
    color: theme.color.black,
    textAlign: "left",
    marginBottom: 20,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#fff",
    marginBottom: 20,
    width: "100%",
  },
  customButton: {
    width: "100%",
    height: 50,
    backgroundColor: theme.color.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
});
