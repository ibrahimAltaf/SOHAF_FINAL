import React, { useState, useRef } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Image, ActivityIndicator, Keyboard } from "react-native";
import { ToastMessage } from "../../utils/helpers";
import { useNavigation } from "@react-navigation/native";
import { Colors, Fonts, IMAGES } from "../../utils/IMAGES";
import axios from "axios";
import CustomStatusBar from "../../component/StatusBar/customStatusBar";

const VerifyOtp = (props) => {
  const routeData = props.route.params;
  const ref_input1 = useRef();
  const ref_input2 = useRef();
  const ref_input3 = useRef();
  const ref_input4 = useRef();
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const [codeOne, setCodeOne] = useState("");
  const [codeTwo, setCodeTwo] = useState("");
  const [codeThree, setCodeThree] = useState("");
  const [codeFour, setCodeFour] = useState("");

  const verifyOTPHandle = async (code) => {
    try {
      Keyboard.dismiss();
      const otpCode = `${codeOne}${codeTwo}${codeThree}${code}`;
      setLoader(true);
      
      const response = await axios.post("https://arbeittech.com/api/user/sentotp", {
        userId: routeData?.userId,
        otp: otpCode,
      });

      setLoader(false);

      if (response.data.success) {
        ToastMessage("Your OTP is verified");
        navigation.navigate("ResetPassword", {
          userId: routeData?.userId,
        });
      } else {
        ToastMessage("Your OTP is incorrect");
      }
    } catch (error) {
      setLoader(false);
      ToastMessage(error?.message || "Something went wrong");
    }
  };

  const onChangeText = (value, code) => {
    switch (value) {
      case "One":
        setCodeOne(code);
        if (code.length === 1) ref_input2.current.focus();
        break;
      case "Two":
        setCodeTwo(code);
        if (code.length === 1) ref_input3.current.focus();
        break;
      case "Three":
        setCodeThree(code);
        if (code.length === 1) ref_input4.current.focus();
        break;
      case "Four":
        setCodeFour(code);
        if (code.length === 1) verifyOTPHandle(code);
        break;
      default:
        ToastMessage("Invalid input");
    }
  };

  const onKeyPress = (value) => {
    switch (value) {
      case "One":
        setCodeOne("");
        ref_input1.current.focus();
        break;
      case "Two":
        setCodeTwo("");
        ref_input1.current.focus();
        break;
      case "Three":
        setCodeThree("");
        ref_input2.current.focus();
        break;
      case "Four":
        setCodeFour("");
        ref_input3.current.focus();
        break;
      default:
        ToastMessage("Invalid input");
    }
  };

  return (
    <View style={styles.container}>
      <CustomStatusBar barStyle={"light-content"} backgroundColor={Colors.Primary} />
      <View style={styles.Main}>
        <View style={styles.logo}>
          <Image style={{
            width:200,
            height:100,
            objectFit:"cover"
          }} source={require("../../assets/images/newlogo.png")} />
      
        </View>
        <View style={{ flexDirection: "row", marginHorizontal: 30 }}>
          <TextInput
            value={codeOne}
            ref={ref_input1}
            keyboardType={"phone-pad"}
            style={[styles.customInputStyle, { marginLeft: 0 }]}
            onChangeText={(code) => onChangeText("One", code)}
          />
          <TextInput
            value={codeTwo}
            ref={ref_input2}
            keyboardType={"phone-pad"}
            style={styles.customInputStyle}
            onChangeText={(code) => onChangeText("Two", code)}
          />
          <TextInput
            value={codeThree}
            ref={ref_input3}
            keyboardType={"phone-pad"}
            style={styles.customInputStyle}
            onChangeText={(code) => onChangeText("Three", code)}
          />
          <TextInput
            value={codeFour}
            ref={ref_input4}
            keyboardType={"phone-pad"}
            style={styles.customInputStyle}
            onChangeText={(code) => onChangeText("Four", code)}
          />
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={() => verifyOTPHandle(codeFour)} style={styles.loginButton}>
          {loader ? (
            <ActivityIndicator color={"#FFF"} />
          ) : (
            <Text style={styles.buttonText}>Verify OTP</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.Primary,
  },
  customInputStyle: {
    flex: 1,
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 6,
    textAlign: "center",
    paddingVertical: 20,
    borderColor: "#c3c3c3",
    borderWidth: 1,
    color: "#000",
    borderRadius: 6,
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  Main: {
    width: "100%",
    height: "70%",
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    position: "absolute",
    gap: 15,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 10,
  },
  logo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

   
  },
  loginButton: {
    width: "80%",
    height: 50,
    backgroundColor: Colors.Primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    elevation: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: Fonts.Regular,
  },
  LogoText: {
    fontFamily: Fonts.Bold,
    fontSize: 26,
    color: Colors.Primary,
  },
});

export default VerifyOtp;
