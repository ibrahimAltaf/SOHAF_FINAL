import React, {useEffect, useState, useRef} from "react";
import {StyleSheet, View, Image, Text, TouchableOpacity, Platform, KeyboardAvoidingView, Animated} from "react-native";
import {useDispatch} from "react-redux";
import {TextInput} from "react-native-paper";
import {theme} from "../../constants/styles";
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

import {FontFamily} from "../../constants/fonts";
import {useNavigation} from "@react-navigation/native";
import {SetUserToken} from "../../Redux/actions/actions";
import {ToastMessage, helpers} from "../../utils/helpers";
import DeviceInfo from "react-native-device-info";
import messaging from "@react-native-firebase/messaging";
import CustomButton from "../../component/Buttons/customButton";
import CustomStatusBar from "../../component/StatusBar/customStatusBar";

const Login = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {routeName} = props.route.params;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [loader, setLoader] = useState(false);

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [passwordToggle, setPasswordToggle] = useState(true);

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim,{
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim,{
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();
  }, [pulseAnim]);
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: 'http://142037914632-1ald0c5p2kvlj20uvepjmmpf1to5tkij.apps.googleusercontent.com', // Replace this with your actual client ID
    });
  }, []);
  const validateField = () => {
    const cleanedEmail = userEmail.trim();
    const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanedEmail) {
      ToastMessage("User Email Required*");
      return false;
    } else if (!emailValidation.test(cleanedEmail)) {
      ToastMessage("Enter Valid Email Address");
      return false;
    } else if (!userPassword) {
      ToastMessage("Password Required*");
      return false;
    } else if (userPassword?.length<=5) {
      ToastMessage("Password should be at least 6 characters");
      return false;
    };
    return true;
  };
  const loginHandle = async () => {
    try {
      if (validateField()) {
        setLoader(true);
        const myHeaders = new Headers();
        let fcmToken = "";
        const deviceId = await DeviceInfo.getUniqueId();
        await messaging().registerDeviceForRemoteMessages();

        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          fcmToken = await messaging().getToken();
        };

        const formdata = new FormData();
        formdata.append("username", userEmail);
        formdata.append("password", userPassword);
        formdata.append("device_id", deviceId);
        formdata.append("device_type", Platform.OS);
        formdata.append("device_token", fcmToken);
        formdata.append("client_id", helpers.api.clientId);
        formdata.append("client_secret", helpers.api.clientSecret);

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: formdata,
          redirect: "follow",
        };

        fetch(`${helpers.api.baseUrl}oauth/token`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result?.access_token!==undefined) {
            setLoader(false);
            dispatch(SetUserToken(result?.access_token));
            handleNavigation(routeName);
          } else {
            setLoader(false);
            ToastMessage(result?.message);
          };
        }).catch((error) => {
          setLoader(false);
          ToastMessage(error?.message);
        });
      };
    } catch (error) {
      setLoader(false);
      ToastMessage(error?.message);
    };
  };
  const handleNavigation = (routeName) => {
    switch (routeName) {
      case "booking":
        navigation.replace("Bookings");
        break;
      case "cart":
        navigation.replace("CheckOut");
        break;
      case "more":
      case "profile":
        navigation.replace("Profile");
        break;
      case "chat":
        navigation.replace("Profile");
        break;
      case "coupons":
        navigation.replace("Bookings");
        break;
      case "checkout":
        navigation.replace("CheckOut");
        break;
      case "finalcheckout":
        navigation.replace("FinalCheckout");
        break;
      default:
        navigation.replace("BottomTabNavigator");
        break;
    };
  };
  const googleLoginHandle = async () => {
    try {
      // Ensure Play Services are available
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  
      // Sign in user
      const userInfo = await GoogleSignin.signIn();
      const token = await GoogleSignin.getTokens();
  
      const fcmToken = await messaging().getToken(); // Get FCM token
      const deviceId = await DeviceInfo.getUniqueId(); // Get unique device ID
  
      // Prepare form data
      const formData = new FormData();
      formData.append('device_type', Platform.OS); // iOS or Android
      formData.append('device_token', fcmToken);
      formData.append('access_token', token.accessToken);
      formData.append('device_id', deviceId);
      formData.append('login_by', 'google');
  
      const requestOptions = {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      };
  
      // Make API call
      fetch('https://arbeittech.com/api/user/auth/google', requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result?.access_token) {
            dispatch(SetUserToken(result.access_token)); // Dispatch token to Redux
            navigation.replace('BottomTabNavigator'); // Navigate to home or dashboard
          } else {
            ToastMessage(result?.message); 
            console.log("developer error" + result.message)
          }
        })
        .catch((error) => {
          ToastMessage(error.message); // Handle API errors
        });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        ToastMessage('User cancelled the login process');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        ToastMessage('Sign in is in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        ToastMessage('Play services not available or outdated');
      } else {
        ToastMessage(error.message);
      }
    }
  };
  
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS==="ios"?"padding":null}>
      <CustomStatusBar
        barStyle={"dark-content"}
        backgroundColor={theme.color.secondaryColor}
      />
      <View style={styles.formContainer}>
        <View style={styles.logo}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Image
              style={styles.logoImage}
              source={require("../../assets/images/newlogo.png")}
            />
          </Animated.View>
        </View>
        <View>
          <TextInput
            label={"Email"}
            value={userEmail}
            style={styles.input}
            onChangeText={(text) => setUserEmail(text)}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              label={"Password"}
              value={userPassword}
              secureTextEntry={passwordToggle}
              style={styles.input}
              onChangeText={(text) => setUserPassword(text)}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.togglePassword}
              onPress={() => setPasswordToggle(!passwordToggle)}>
              <Image
                style={styles.icon}
                source={passwordToggle?require("../../assets/images/view.png"):require("../../assets/images/hide.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <CustomButton
        loading={loader}
        title={"Sign In"}
        activeOpacity={0.7}
        onPress={loginHandle}
        customButtonStyle={styles.customButton}
      />

       <View style={{justifyContent:"center",
       alignItems:"center",alignSelf:"center",marginTop:-10}}>
        <TouchableOpacity
          activeOpacity={.7}
          onPress={() => navigation.navigate("ForgetPassword")}>
          <Text style={{fontWeight:"600",fontSize:14,textAlign:"center",color:"#d1001f"}}>
           Forget Password?
          </Text>
        </TouchableOpacity>
       </View>


       {/* Social Login Buttons */}
      <View style={styles.socialLoginContainer}>
      <TouchableOpacity onPress={googleLoginHandle} style={styles.socialButton}>
  <Image style={styles.socialIcon} source={require("../../assets/images/GoogleIcon2.png")} />
</TouchableOpacity>

        <TouchableOpacity  style={styles.socialButton}>
          <Image
            style={styles.socialIcon}
            source={require("../../assets/images/facebook..png")}
          />
        </TouchableOpacity>
        <TouchableOpacity  style={styles.socialButton}>
          <Image
            style={styles.socialIcon}
            source={require("../../assets/images/applee.png")}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerTextContainer}>
          <Text>
            Don’t have an account?
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("SignUp",{
              routeName: routeName,
            })}>
            <Text style={styles.signUpText}> Sign Up Here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.secondaryColor,
  },
  formContainer: {
    gap: 40,
    marginTop: 100,
    paddingHorizontal: 27,
  },
  passwordContainer: {
    position: "relative",
  },
  togglePassword: {
    top: 0,
    right: 0,
    bottom: 0,
    padding: 10,
    position: "absolute",
    justifyContent: "center",
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: "cover",
  },
  checkBoxContainer: {
    marginTop: 4,
    flexDirection: "row",
  },
  forgotPassword: {
    flex: 1,
    marginTop: 2,
    alignItems: "flex-end",
  },
  forgotPassText: {
    fontSize: 12,
    color: theme.color.errorColor,
    fontFamily: FontFamily.lightFont,
  },
  customButton: {
    marginTop: 25,
  },
  footer: {
    marginBottom: 20,
    alignItems: "center",
    paddingHorizontal: 27,
  },
  footerTextContainer: {
    marginBottom: 20,
    alignSelf: "center",
    flexDirection: "row",
  },
  footerText: {
    fontSize: 12,
    color: theme.color.black,
    fontFamily: FontFamily.lightFont,
  },
  signUpText: {
    fontSize: 12,
    color: theme.color.primaryColor,
    fontFamily: FontFamily.boldFont,
  },
  logo: {
    width: '100%',
    marginTop: 100,
    paddingBottom: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoImage: {
    width: 220,
    height: 100,
    marginRight: 10,
  },
  logoText: {
    fontSize: 26,
    fontWeight: '600',
    color: theme.color.primaryColor,
  },
  input: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: "#ccc",
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    color: theme.color.black,
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  socialButton: {
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#fff',
    elevation: 5, // For shadow on Android
  },
  socialIcon: {
    width: 40,
    height: 40,
  },
});

export default Login;
