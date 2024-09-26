import React, {useEffect, useState} from "react";
import {StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView} from "react-native";
import {theme} from "../constants/styles";
import {TextInput} from 'react-native-paper';
import {FontFamily} from "../constants/fonts";
import {useDispatch, useSelector} from "react-redux";
import {useNavigation} from '@react-navigation/native';
import {ToastMessage, helpers} from "../utils/helpers";
import {CountryPicker} from 'react-native-country-codes-picker';
import {SetUserDetail, SetUserToken} from "../Redux/actions/actions";
import Loader from "../component/Loader/loader";
import Header from "../component/Header/header";
import CustomButton from "../component/Buttons/customButton";
import CustomStatusBar from "../component/StatusBar/customStatusBar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const {access_token} = useSelector((state) => state.userReducer);
    const [loader, setLoader] = useState(true)
    const [lastName, setLastName] = useState("")
    const [firstName, setFirstName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userNumber, setUserNumber] = useState("");
    const [showPicker, setShowPicker] = useState(false);
    const [countryCode, setCountryCode] = useState("+1");
    const [countryFlag, setCountryFlag] = useState("🇺🇸");
    const [buttonLoader, setButtonLoader] = useState(false);

    useEffect(() => {
        checkLoginStatus();
    }, []);
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          checkLoginStatus();
        });
    
        return unsubscribe;
      }, [navigation]);
    const checkLoginStatus = () => {
        if (access_token===null) {
          navigation.navigate("Login", {
            routeName: "profile"
          });
        } else {
            getProfileHandle();
        };
    };
    const getProfileHandle = () => {
        try {
            setLoader(true);
            const myHeaders = new Headers();
            myHeaders.append("X-Requested-With", "XMLHttpRequest");
            myHeaders.append("Authorization", `Bearer ${access_token}`);
            
            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow",
            };
            
            fetch(`${helpers.api.baseUrl}details`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setLoader(false);
                if (result?.message==="Unauthenticated.") {
                    logoutHandle();
                } else {
                    if (result?.first_name!==undefined) {
                        setFirstName(result?.first_name);
                        setLastName(result?.last_name);
                        setUserEmail(result?.email);
                        const number = removeCountryCode(result?.mobile);
                        setUserNumber(number);
                        setCountryCode(result?.country_code);
                        setCountryFlag(result?.country_flag);
                    };
                };
            }).catch((error) => {
                setLoader(false);
                console.log(error?.message);
            });
        } catch (error) {
            setLoader(false);
            console.log(error?.message);
        };
    };
    const removeCountryCode = (phoneNumber) => {
        const countryCodePattern = /^\+?\d{1,4}/;
        const strippedNumber = phoneNumber.replace(countryCodePattern, '');
        return strippedNumber.trim();
    };
    const logoutHandle = () => {
        try {
            AsyncStorage.removeItem("access_token");
            AsyncStorage.removeItem("user_location");
            dispatch(SetUserDetail({}));
            dispatch(SetUserToken(null));
            alert("Session Expired!");
            navigation.navigate("Login", {
                routeName: "profile",
            });
        } catch (error) {
            console.error("Error during logout:", error);
        };
    };
    const profileUpdateHandle = () => {
        try {
            setButtonLoader(true);
            const myHeaders = new Headers();
            myHeaders.append("X-Requested-With", "XMLHttpRequest");
            myHeaders.append("Authorization", `Bearer ${access_token}`);
        
            const formdata = new FormData();
            formdata.append("email", userEmail);
            formdata.append("mobile", userNumber);
            formdata.append("last_name", lastName);
            formdata.append("first_name", firstName);
            formdata.append("country_code", countryCode);
            formdata.append("country_flag", countryFlag);

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: formdata,
                redirect: "follow",
            };

            fetch(`${helpers.api.baseUrl}update/profile`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setButtonLoader(false);
                if (result?.id!==undefined) {
                    getProfileHandle();
                    ToastMessage("Profile Updated Successfully!");
                } else {
                    ToastMessage("Profile Updated Failed!");
                };
                console.log("result =====> ", result);
            }).catch((error) => {
                setButtonLoader(false);
                ToastMessage(error?.message);
            });
        } catch (error) {
          setButtonLoader(false);
          ToastMessage(error?.message);
        };
    };
  
    return (
        <KeyboardAvoidingView style={styles.container}
        behavior={Platform.OS==="ios"?"padding":null}>
            {loader?<Loader />:null}
            <CustomStatusBar
                barStyle={"light-content"}
                backgroundColor={"#044F86"}
            />
            <Header
                backArrow={true}
                title={"Profile"}
                backPage={() => navigation.goBack()}
            />
            <ScrollView>
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
                            editable={false}
                            value={userEmail}
                            label={"Email Address"}
                            style={{backgroundColor:"#EEE"}}
                            onChangeText={(text) => setUserEmail(text)}
                        />
                    </View>
                    <View style={{flexDirection:"row",marginTop:12}}>
                        <View style={{justifyContent:"center"}}>
                            <TouchableOpacity
                                activeOpacity={.7}
                                onPress={() => setShowPicker(true)}
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
                </View>
                <CustomButton
                    title={"Update"}
                    activeOpacity={.7}
                    loading={buttonLoader}
                    onPress={profileUpdateHandle}
                    customButtonStyle={{marginTop:20}}
                />
            </ScrollView>
            <CountryPicker
                show={showPicker}
                style={{modal:{height:500}}}
                onBackdropPress={() => setShowPicker(false)}
                pickerButtonOnPress={(item) => {
                    console.log(item);
                    setCountryFlag(item?.flag);
                    setCountryCode(item?.dial_code);
                    setShowPicker(false);
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
    logoStyle: {
        width: 200,
        height: 80,
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

export default Profile;
