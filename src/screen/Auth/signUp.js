import React, {useEffect, useState, useRef} from "react";
import {StyleSheet, View, Image, Text, ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView, Animated} from "react-native";
import {useDispatch} from "react-redux";
import {theme} from "../../constants/styles";
import {TextInput} from 'react-native-paper';
import {FontFamily} from "../../constants/fonts";
import {useNavigation} from '@react-navigation/native';
import {ToastMessage, helpers} from "../../utils/helpers";
import {CountryPicker} from 'react-native-country-codes-picker';
import {SetUserDetail, SetUserToken} from "../../Redux/actions/actions";
import CheckBox from 'react-native-check-box';
import DeviceInfo from 'react-native-device-info';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import CustomButton from "../../component/Buttons/customButton";
import CustomStatusBar from "../../component/StatusBar/customStatusBar";

const SignUp = (props) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const {routeName} = props.route.params;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const [show, setShow] = useState(false);
    const [loader, setLoader] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("")
    const [userEmail, setUserEmail] = useState("");
    const [countryCode, setCountryCode] = useState("+1");
    const [countryFlag, setCountryFlag] = useState("🇺🇸");
    const [userNumber, setUserNumber] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [referralCode, setReferralCode] = useState("");
    const [passwordToggle, setPasswordToggle] = useState(true);
    const [privacyCheckBox, setPrivacyCheckBox] = useState(false);

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
        const cleanedEmail = userEmail.replace(/\s/g, '');
        const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,7})+$/;
        if (firstName==="") {
            ToastMessage("First Name Required*");
            return false;
        } else if (lastName==="") {
            ToastMessage("Last Name Required*");
            return false;
        } else if (cleanedEmail==="") {
            ToastMessage("User Email Required*");
            return false;
        } else if (emailValidation.test(cleanedEmail)===false) {
            ToastMessage("Enter Valid Email Address");
            return false;
        } else if (userNumber==="") {
            ToastMessage("Phone Number Required*");
            return false;
        } else if (userPassword==="") {
            ToastMessage("Password Required*");
            return false;
        } else if (userPassword.length<=5) {
            ToastMessage("Password should be 6 characters");
            return false;
        } else if (confirmPassword==="") {
            ToastMessage("Password Required*");
            return false;
        } else if (confirmPassword.length<=5) {
            ToastMessage("Password should be 6 characters");
            return false;
        } else if (userPassword!==confirmPassword) {
            ToastMessage("Password and Confirm Password does not match");
            return false;
        } else if (!privacyCheckBox) {
            ToastMessage("Select Privacy Policy!");
            return false;
        };
        return true;
    };
    const createAccountHandle = async () => {
        try {
            if (validateField()) {
                setLoader(true);
                const myHeaders = new Headers();
                myHeaders.append("X-Requested-With", "XMLHttpRequest");

                let fcmToken = "";
                const deviceId = await DeviceInfo?.getUniqueId();
                await messaging().registerDeviceForRemoteMessages();
                const authStatus = await messaging().requestPermission();
                const enabled =
                    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

                if (enabled) {
                    fcmToken = await messaging().getToken();
                };

                const formdata = new FormData();
                formdata.append("first_name", firstName);
                formdata.append("last_name", lastName);
                formdata.append("email", userEmail);
                formdata.append("password", userPassword);
                formdata.append("password_confirmation", confirmPassword);
                formdata.append("country_code", countryCode);
                formdata.append("country_flag", countryFlag);
                formdata.append("mobile", userNumber);
                formdata.append("device_id", deviceId);
                formdata.append("device_token", fcmToken);
                formdata.append("device_type", Platform.OS);
                formdata.append("login_by", "manual");
                formdata.append("firebase_id", "");

                const requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body: formdata,
                    redirect: "follow"
                };

                fetch(`${helpers.api.baseUrl}signup`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    if (result?.access_token!==undefined) {
                        setLoader(false);
                        dispatch(SetUserToken(result?.access_token));
                        dispatch(SetUserDetail(result));
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
    const addDataInFirebase = async (data) => {
        try {
            const firestoreRef = firestore()
            .collection('Users').doc(data?.userId);
            await firestoreRef.set({
                email: data?.email,
                name: data?.fullName,
                userProfile: null,
                fcmToken: data?.fcmToken,
            });
        } catch (error) {
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
            case "inbox":
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

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS==="ios"?"padding":null}>
            <CustomStatusBar
                barStyle={"dark-content"}
                backgroundColor={theme.color.secondaryColor}
            />
            <ScrollView>
                {/* <View style={{paddingHorizontal:27}}>
                    <Image
                        style={styles.logoStyle}
                        source={require("../../assets/images/logo.png")}
                    />
                </View> */}
                <View style={styles.logo}>
                    <View>
                        <Animated.View style={{transform:[{scale:pulseAnim}]}}>
                        <Image style={{
                            width:200,
                            height:70,
                            objectFit:"cover"
                        }} source={require("../../assets/images/newlogo.png")} />
                        </Animated.View>
                    </View>
                  
                </View>
                <View style={{paddingHorizontal:27,marginTop:15}}>
                    <View>
                        <TextInput
                            value={firstName}
                            label={"First Name"}
                            style={{backgroundColor:"transparent"}}
                            onChangeText={(text) => setFirstName(text)}
                        />
                    </View>
                    <View style={{marginTop:12}}>
                        <TextInput
                            value={lastName}
                            label={"Last Name"}
                            style={{backgroundColor:"transparent"}}
                            onChangeText={(text) => setLastName(text)}
                        />
                    </View>
                    <View style={{marginTop:12}}>
                        <TextInput
                            value={userEmail}
                            label={"Email Address"}
                            style={{backgroundColor:"transparent"}}
                            onChangeText={(text) => setUserEmail(text)}
                        />
                    </View>
                    <View style={{flexDirection:"row",marginTop:12}}>
                        <View style={{justifyContent:"center"}}>
                            <TouchableOpacity
                                activeOpacity={.7}
                                onPress={() => setShow(true)}
                                style={styles.countryCodeStyle}>
                                <Text style={{color:'#000',fontSize:16}}>
                                    {`${countryFlag}  ${countryCode}`}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex:1,justifyContent:"center"}}>
                            <TextInput
                                value={userNumber}
                                label={"Phone Number"}
                                keyboardType={"number-pad"}
                                style={{backgroundColor:"transparent"}}
                                onChangeText={(text) => setUserNumber(text)}
                            />
                        </View>
                    </View>
                    <View style={{position:"relative",marginTop:12}}>
                        <TextInput
                            label={"Password"}
                            value={userPassword}
                            secureTextEntry={passwordToggle}
                            style={{backgroundColor:"transparent"}}
                            onChangeText={(text) => setUserPassword(text)}
                        />
                        <View style={{position:"absolute",
                        top:0,bottom:0,right:0,justifyContent:"center"}}>
                            <TouchableOpacity
                                activeOpacity={.7}
                                style={{paddingVertical:10,paddingHorizontal:20}}
                                onPress={() => setPasswordToggle(!passwordToggle)}>
                                {passwordToggle?
                                    <Image
                                        style={{height:20,width:20,resizeMode:"cover"}}
                                        source={require('../../assets/images/view.png')}
                                    />
                                :
                                    <Image
                                        style={{height:20,width:20,resizeMode:"cover"}}
                                        source={require('../../assets/images/hide.png')}
                                    />
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{marginTop:12}}>
                        <TextInput
                            value={confirmPassword}
                            label={"Confirm Password"}
                            style={{backgroundColor:"transparent"}}
                            onChangeText={(text) => setConfirmPassword(text)}
                        />
                    </View>
                    <View style={{marginTop:12}}>
                        <TextInput
                            value={referralCode}
                            label={"Referral Code"}
                            style={{backgroundColor:"transparent"}}
                            onChangeText={(text) => setReferralCode(text)}
                        />
                    </View>
                    <View style={{marginTop:6}}>
                        <CheckBox
                            checkBoxColor={"#7D7C7C"}
                            isChecked={privacyCheckBox}
                            rightTextStyle={styles.checkBoxText}
                            checkedCheckBoxColor={theme.color.primaryColor}
                            rightText={"I agree with the Terms & Conditions"}
                            onClick={() => setPrivacyCheckBox(!privacyCheckBox)}
                        />
                    </View>
                </View>
                <CustomButton
                    loading={loader}
                    title={"Sign Up"}
                    activeOpacity={.7}
                    onPress={createAccountHandle}
                    customButtonStyle={{marginTop:25}}
                />
                <View style={{paddingHorizontal:27}}>
                    <View style={{flexDirection:"row",alignSelf:"center",marginBottom:20}}>
                        <View style={{justifyContent:"center"}}>
                            <Text style={[styles.signInWithText,{textAlign:"right",paddingVertical:0}]}>
                                Already have an account?
                            </Text>
                        </View>
                        <TouchableOpacity
                            activeOpacity={.8}
                            style={{justifyContent:"center"}}
                            onPress={() => navigation.navigate("Login",{
                                routeName: "signup",
                            })}>
                            <Text style={[styles.signUpText,{paddingVertical:0}]}>  Sign In Here</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <CountryPicker
                show={show}
                style={{modal:{height:500}}}
                onBackdropPress={() => setShow(false)}
                pickerButtonOnPress={(item) => {
                    console.log(item);
                    setCountryFlag(item?.flag);
                    setCountryCode(item?.dial_code);
                    setShow(false);
                }}
            />
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.color.secondaryColor,
    },
    logo: {
        gap: 10,
        width: "100%",
        height: "auto",
        display: "flex",
        paddingBottom: 20,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 100,
    },
    LogoText: {
        fontSize: 26,
        color: theme.color.primaryColor,
        fontWeight: "600",
    },
    logoStyle: {
        width: 40,
        height: 40,
        marginTop: 93,
        alignSelf: "center",
        marginBottom: 23.55,
        resizeMode: "contain",
    },
    signInHeading: {
        fontSize: 24,
        textTransform: "uppercase",
        color: theme.color.headingColor,
        fontFamily: FontFamily.boldFont,
    },
    signInDetail: {
        fontSize: 14,
        color: theme.color.textColor,
        fontFamily: FontFamily.regularFont,
    },
    labelStyle: {
        fontSize: 12,
        paddingBottom: 4,
        textTransform: "capitalize",
        color: theme.color.textColor,
        fontFamily: FontFamily.boldFont,
    },
    toggleIcon: {
        right: 12,
        height: "100%",
        position: "absolute",
        justifyContent: "center",
    },
    checkBoxText: {
        fontSize: 12,
        color: theme.color.textColor,
        fontFamily: FontFamily.lightFont,
    },
    forgotPassText: {
        fontSize: 12,
        color: theme.color.errorColor,
        fontFamily: FontFamily.lightFont,
    },
    signInWithText: {
        fontSize: 12,
        textAlign: "center",
        paddingVertical: 21,
        color: theme.color.textColor,
        fontFamily: FontFamily.lightFont,
    },
    signUpText: {
        fontSize: 12,
        paddingBottom: 0,
        textAlign: "left",
        paddingVertical: 21,
        color: theme.color.primaryColor,
        fontFamily: FontFamily.boldFont,
    },
    socialBox: {
        padding: 8,
        width: "auto",
        elevation: 10,
        borderRadius: 5,
        shadowRadius: 6.27,
        shadowOpacity: 0.34,
        alignSelf:"flex-end",
        backgroundColor: "#FFF",
        shadowOffset: {width: 0,height:5},
        shadowColor: "rgba(0, 0, 0, 0.05)",
    },
    socialImageStyle: {
        width: 24,
        height: 24,
        resizeMode: "contain",
    },
    countryCodeStyle: {
        marginTop: 19.5,
        paddingRight: 12,
        paddingBottom: 14,
        borderBottomWidth: .8,
        borderBottomColor: "gray",
        backgroundColor: 'transparent',
    }
});

export default SignUp;
