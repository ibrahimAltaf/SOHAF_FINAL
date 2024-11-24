import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Animated,
  Image,
  ImageBackground,
} from "react-native";
import { useDispatch } from "react-redux";
import { theme } from "../../constants/styles";
import { TextInput, Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { ToastMessage } from "../../utils/helpers";
import { SetUserDetail, SetUserToken } from "../../Redux/actions/actions";
import CustomButton from "../../component/Buttons/customButton";
import CustomStatusBar from "../../component/StatusBar/customStatusBar";
import { RadioButton } from "react-native-paper";
import * as ImagePicker from "react-native-image-picker";
import DeviceInfo from "react-native-device-info";
import messaging from "@react-native-firebase/messaging";
import CountryPicker from 'react-native-country-picker-modal';

const SignUp = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [loader, setLoader] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userNumber, setUserNumber] = useState("");
  const [countryCode, setCountryCode] = useState('US');
  const [callingCode, setCallingCode] = useState('1');
  const [userPassword, setUserPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [avatar, setAvatar] = useState(null);
  const [passwordToggle, setPasswordToggle] = useState(true);

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

  const validateField = () => {
    const cleanedEmail = userEmail.replace(/\s/g, "");
    const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,7})+$/;
    if (firstName === "") {
      ToastMessage("First Name Required*");
      return false;
    } else if (lastName === "") {
      ToastMessage("Last Name Required*");
      return false;
    } else if (cleanedEmail === "") {
      ToastMessage("User Email Required*");
      return false;
    } else if (emailValidation.test(cleanedEmail) === false) {
      ToastMessage("Enter Valid Email Address");
      return false;
    } else if (userNumber === "") {
      ToastMessage("Phone Number Required*");
      return false;
    } else if (userPassword === "") {
      ToastMessage("Password Required*");
      return false;
    } else if (userPassword.length <= 5) {
      ToastMessage("Password should be 6 characters");
      return false;
    } else if (confirmPassword === "") {
      ToastMessage("Confirm Password Required*");
      return false;
    } else if (confirmPassword.length <= 5) {
      ToastMessage("Confirm Password should be 6 characters");
      return false;
    } else if (userPassword !== confirmPassword) {
      ToastMessage("Password and Confirm Password do not match");
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: "photo",
      quality: 1,
    });

    if (!result.didCancel && result.assets) {
      setAvatar(result.assets[0]);
    }
  };

  const createAccountHandle = async () => {
    try {
      if (validateField()) {
        setLoader(true);
        const deviceId = await DeviceInfo.getUniqueId();
        await messaging().registerDeviceForRemoteMessages();
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        let fcmToken = enabled ? await messaging().getToken() : "";

        const formdata = new FormData();
        formdata.append("name", firstName);
        formdata.append("email", userEmail);
        formdata.append("password", userPassword);
        formdata.append("password_confirmation", confirmPassword);
        formdata.append("phone", userNumber);

        if (avatar) {
          formdata.append("avatar", {
            uri: avatar.uri,
            type: avatar.type || "image/jpeg",
            name: avatar.fileName || "avatar.jpg",
          });
        }

        formdata.append("type", role);
        formdata.append("device_id", deviceId);
        formdata.append("device_token", fcmToken);
        formdata.append("device_type", Platform.OS);

        fetch("https://dodgerblue-chinchilla-339711.hostingersite.com/api/signup", {
          method: "POST",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
          body: formdata,
        })
          .then((response) => response.json())
          .then((result) => {
            setLoader(false);
            if (result?.access_token) {
              dispatch(SetUserToken(result.access_token));
              dispatch(SetUserDetail(result));
              
              console.log(result)
            } else {
              ToastMessage(result?.message);
              console.log(result)
              navigation.navigate("Login");
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

  return (
    <ImageBackground 
    source={{ uri: "https://t3.ftcdn.net/jpg/03/55/60/70/360_F_355607062_zYMS8jaz4SfoykpWz5oViRVKL32IabTP.jpg" }}
    style={styles.backgroundImage} 
    resizeMode="cover"
  >
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <Text style={{
        fontSize: 28,
        fontWeight: "900",
        color: theme.color.black,
        textAlign: "left",
        marginHorizontal: 20,
        marginVertical: 10,
      }}>
        إنشاء حساب
      </Text>
      <Text style={{
        fontSize: 15,
        color: theme.color.black,
        textAlign: "left",
        fontWeight: "500",
        marginHorizontal: 20,
      }}>
        قم بإنشاء حساب لتتمكن من استكشاف جميع الأخبار الحالية
      </Text>
      <ScrollView>
        <View style={styles.logo}>
          <View>
            <View style={styles.avatarWrapper}>
              <Avatar.Image
                size={90}
                source={
                  avatar
                    ? { uri: avatar.uri }
                    : require("../../assets/images/Profile_avatar_placeholder_large.png")
                }
                style={styles.avatar}
              />
            </View>
          </View>
          <View>
            <TouchableOpacity style={{
              backgroundColor: theme.color.black,
              justifyContent: "center",
              alignItems: "center",
              width: 140,
              height: 40,
              borderRadius: 20,
            }} onPress={pickImage}>
              <Text style={styles.changeAvatarText}>تحميل الصورة الشخصية</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ paddingHorizontal: 27, marginTop: 15 }}>
          
          <TextInput
            value={firstName}
            label="الاسم الأول"
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
            onChangeText={(text) => setFirstName(text)}
          />
  
          <TextInput
            value={lastName}
            textColor={theme.color.black}

            label="الاسم الأخير"
            style={{ backgroundColor: theme.color.white, fontSize: 13, marginBottom: 8 }}
            outlineColor="black"
            activeOutlineColor="black"
            theme={{
              colors: {
                text: theme.color.black,
                primary: "black",
              },
            }}
            onChangeText={(text) => setLastName(text)}
          />
  
          <TextInput
            value={userEmail}
            label="البريد الإلكتروني"
            style={{ backgroundColor: theme.color.white, fontSize: 13, marginBottom: 8 }}
            outlineColor="black"
            activeOutlineColor="black"
            textColor={theme.color.black}
            theme={{
              colors: {
                text: theme.color.black,
                primary: "black",
              },
            }}
            onChangeText={(text) => setUserEmail(text)}
          />
  
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
            <CountryPicker
              countryCode={countryCode}
              withFilter
              withFlag
              withCallingCode
              withCallingCodeButton
              withEmoji
              onSelect={(country) => {
                setCountryCode(country.cca2);
                setCallingCode(country.callingCode[0]);
              }}
              containerButtonStyle={{
                marginRight: 10,
              }}
            />
  
            <TextInput
              value={userNumber}
              keyboardType="number-pad"
              label="رقم الهاتف"
              textColor={theme.color.black}

              style={{
                flex: 1,
                backgroundColor: theme.color.white,
                marginBottom: 8
              }}
              outlineColor="black"
              activeOutlineColor="black"
              theme={{
                colors: {
                  text: theme.color.black,
                  primary: "black",
                },
              }}
              onChangeText={(text) => setUserNumber(text)}
            />
          </View>
  
          <View style={styles.passwordContainer}>
            <TextInput
              label="كلمة المرور"
              textColor={theme.color.black}

              value={userPassword}
              secureTextEntry={passwordToggle}
              style={{
                flex: 1,
                backgroundColor: theme.color.white,
                marginBottom: 8
              }}
              outlineColor="black"
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
  
          <View style={styles.passwordContainer}>
            <TextInput
              label="تأكيد كلمة المرور"
              value={confirmPassword}
              secureTextEntry={passwordToggle}
              style={{
                flex: 1,
                backgroundColor: theme.color.white,
                marginBottom: 8
              }}
              outlineColor="black"
              activeOutlineColor="black"
              theme={{
                colors: {
                  text: theme.color.black,
                  primary: "black",
                },
              }}
              onChangeText={(text) => setConfirmPassword(text)}
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
  
          <Text style={styles.iAmText}>أنا</Text>
          <RadioButton.Group onValueChange={(value) => setRole(value)} value={role}>
            <View style={styles.radioButtonRow}>
              <View style={styles.radioButtonContainer}>
                <RadioButton value="user" />
                <Text style={styles.radioLabel}>زائر</Text>
              </View>
              <View style={styles.radioButtonContainer}>
                <RadioButton value="author" />
                <Text style={styles.radioLabel}>مؤلف</Text>
              </View>
            </View>
          </RadioButton.Group>
  
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginText}>هل لديك حساب؟ تسجيل الدخول</Text>
          </TouchableOpacity>
          
          <CustomButton
            loading={loader}
            title="تسجيل"
            customButtonStyle={{ marginTop: 25, backgroundColor: theme.color.primaryColor }}
            onPress={createAccountHandle}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </ImageBackground>
  
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.backgroundColor,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
  },
  logo: {
    alignSelf: "flex-start",
    marginTop: 10,
    flexDirection:"row",
    marginHorizontal:20,
    gap:20,
    alignItems:"center",
    justifyContent:"center"
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: "lightgrey",



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
  avatarWrapper: {
    alignSelf: "center", // Centers the avatar horizontally
    backgroundColor: "lightgrey", // Background color for the avatar wrapper
    borderRadius: 60, // Make the border circular (half of size 120)
    borderColor: theme.color.primaryColor, // Border color
    borderWidth: 2, // Border thickness
    borderStyle: "solid", // Solid border style
    overflow: "hidden", // Ensures the image doesn't overflow the border
  },
  changeAvatarText: {
    textAlign: "center",
    color: theme.color.white,
  },
  iAmText: {
    fontWeight: "bold",
    color: theme.color.black,
    fontSize: 16,
    marginTop: 20,
    textAlign:"center"
  },
  radioButtonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap:10,
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioLabel: {
    color: theme.color.black,
  },
  loginText: {
    marginTop: 15,
    color: theme.color.black,
    fontWeight: "bold",
    textAlign: "center",
  },
});
