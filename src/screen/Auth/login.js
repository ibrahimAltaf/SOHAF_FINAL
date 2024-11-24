import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Animated,
  ScrollView,
  Modal,
  ImageBackground,  // Import ImageBackground
  Image,
} from "react-native";
import { useDispatch } from "react-redux";
import { TextInput } from "react-native-paper";
import { theme } from "../../constants/styles";
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { FontFamily } from "../../constants/fonts";
import { useNavigation } from "@react-navigation/native";
import { SetUserDetail, SetUserToken } from "../../Redux/actions/actions";
import { ToastMessage } from "../../utils/helpers";
import DeviceInfo from "react-native-device-info";
import messaging from "@react-native-firebase/messaging";
import CustomButton from "../../component/Buttons/customButton";
import CustomStatusBar from "../../component/StatusBar/customStatusBar";
import LinearGradient from 'react-native-linear-gradient'; 

const Login = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [loader, setLoader] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [passwordToggle, setPasswordToggle] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([ 
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
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
      offlineAccess: true,
      webClientId: '142037914632-fhe2j3362nmmnpek7mnbmseo3pv99hbe.apps.googleusercontent.com',
    });
  }, []);

  const validateField = () => {
    const cleanedEmail = userEmail.trim();
    const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userName) {
  ;
    } else if (!cleanedEmail) {
      ToastMessage("User Email Required*");
      return false;
    } else if (!emailValidation.test(cleanedEmail)) {
      ToastMessage("Enter Valid Email Address");
      return false;
    } else if (!userPassword) {
      ToastMessage("Password Required*");
      return false;
    } else if (userPassword?.length <= 5) {
      ToastMessage("Password should be at least 6 characters");
      return false;
    }
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
        }
  
        const formdata = new FormData();
        formdata.append("email", userEmail);
        formdata.append("password", userPassword);
        formdata.append("device_id", deviceId);
        formdata.append("device_type", Platform.OS);
        formdata.append("device_token", fcmToken);
  
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: formdata,
          redirect: "follow",
        };
  
        fetch(`https://dodgerblue-chinchilla-339711.hostingersite.com/api/login`, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            if (result?.success === "Login Successfully") {
              setLoader(false);
              const accessToken = result?.user?.device_token;
              const userRole = result?.user?.type; // Assuming the role is in `result.user.role`
              dispatch(SetUserToken(accessToken));
              dispatch(SetUserDetail(result.user));

              console.log("login API====>" +  JSON.stringify(result))
              // Navigate based on role
              if (userRole === "admin") {
                navigation.navigate("AdminScreen");
              } else if (userRole === "user") {
                navigation.navigate("VisitorScreen");
              } else if (userRole === "author") {
                navigation.navigate("AuthorScreen");
              } else {
                ToastMessage("Role not recognized.");
              }
            } else {
              setLoader(false);
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
  
  // const loginHandle = async () => {
  //   try {
  //     if (validateField()) {
  //       setLoader(true);
  //       const myHeaders = new Headers();
  //       let fcmToken = "";
  //       const deviceId = await DeviceInfo.getUniqueId();
  //       await messaging().registerDeviceForRemoteMessages();

  //       const authStatus = await messaging().requestPermission();
  //       const enabled =
  //         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //         authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //       if (enabled) {
  //         fcmToken = await messaging().getToken();
  //       }

  //       const formdata = new FormData();
  //       formdata.append("email", userEmail);
  //       formdata.append("password", userPassword);
  //       formdata.append("device_id", deviceId);
  //       formdata.append("device_type", Platform.OS);
  //       formdata.append("device_token", fcmToken);

  //       const requestOptions = {
  //         method: "POST",
  //         headers: myHeaders,
  //         body: formdata,
  //         redirect: "follow",
  //       };

  //       fetch(`https://dodgerblue-chinchilla-339711.hostingersite.com/api/login`, requestOptions)
  //         .then((response) => response.json())
  //         .then((result) => {
  //           if (result?.success === "Login Successfully") {
  //             setLoader(false);
  //             const accessToken = result?.user?.device_token;
  //             dispatch(SetUserToken(accessToken));
  //             console.log("loogin api ====>" +JSON.stringify(result))
  //             navigation.navigate("AdminScreen");
  //           } else {
  //             setLoader(false);
  //             ToastMessage(result?.message);
  //           }
  //         })
  //         .catch((error) => {
  //           setLoader(false);
  //           ToastMessage(error?.message);
  //         });
  //     }
  //   } catch (error) {
  //     setLoader(false);
  //     ToastMessage(error?.message);
  //   }
  // };


  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === "ios" ? "padding" : null}
  >
    {/* Wrap LinearGradient inside ImageBackground */}
    <ImageBackground 
      source={{ uri: "https://t3.ftcdn.net/jpg/03/55/60/70/360_F_355607062_zYMS8jaz4SfoykpWz5oViRVKL32IabTP.jpg" }}
      style={styles.backgroundImage} 
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.heading}>تسجيل الدخول</Text>
          <Text style={styles.subText}>
            مرحبًا بعودتك! الرجاء إدخال بريدك الإلكتروني وكلمة المرور للمتابعة.
          </Text>
  
          <TextInput
            label={"البريد الإلكتروني"}
            value={userEmail}
            style={{ backgroundColor: theme.color.white, fontSize: 13, marginBottom: 8 }}
            outlineColor="black"
            textColor={theme.color.black}

            activeOutlineColor="black"
            theme={{
              colors: {
                text: theme.color.black,
                primary: "black",
              },
            }}
            onChangeText={(text) => setUserEmail(text)}
          />
  
          {/* Password Input */}
          <View style={styles.passwordContainer}>
            <TextInput
              label={"كلمة المرور"}
              value={userPassword}
              secureTextEntry={passwordToggle}
              style={{ backgroundColor: theme.color.white, fontSize: 13, marginBottom: 8 }}
              outlineColor="black"
              textColor={theme.color.black}

              activeOutlineColor="black"
              theme={{
                colors: {
                  text: theme.color.black,
                  primary: "black",
                },
              }}
              onChangeText={(text) => setUserPassword(text)}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.togglePassword}
              onPress={() => setPasswordToggle(!passwordToggle)}
            >
              <Image
                style={styles.icon}
                source={passwordToggle ? require("../../assets/images/view.png") : require("../../assets/images/hide.png")}
              />
            </TouchableOpacity>
          </View>
  
          <View style={styles.forgotPasswordContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate("ForgetPassword")}
            >
              <Text style={styles.forgotPasswordText}>نسيت كلمة المرور؟</Text>
            </TouchableOpacity>
          </View>
        </View>
  
        {/* Sign In Button */}
        <CustomButton
          loading={loader}
          title={"تسجيل الدخول"}
          activeOpacity={0.7}
          onPress={loginHandle}
          customButtonStyle={styles.customButton}
        />
  
        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerTextContainer}>
            <Text style={styles.footerText}>ليس لديك حساب؟</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate("SignUp")}
            >
              <Text style={styles.signUpText}> قم بالتسجيل هنا</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  </KeyboardAvoidingView>
  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
  },
  scrollViewContainer: {
    paddingBottom: 50,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  formContainer: {
    marginTop: 50,
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
  },
  passwordContainer: {
    position: "relative",
  },
  togglePassword: {
    position: "absolute",
    right: 10,
    top: 20,
  },
  icon: {
    height: 20,
    width: 20,
    tintColor: "#000",
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: theme.color.black,
    fontSize: 12,
    fontWeight:"500"
  },
  customButton: {
    marginTop: 30,
  },
  footer: {
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  footerTextContainer: {
    flexDirection: "row",
  },
  footerText: {
    color: theme.color.black,
    fontSize: 14,
  },
  signUpText: {
    color: theme.color.black,
    fontSize: 14,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    paddingVertical: 10,
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: theme.color.primaryColor,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default Login;
