import React from "react";
import {TouchableOpacity, Text, StyleSheet, ActivityIndicator} from "react-native";


import { Colors, Fonts } from "./IMAGES";

const CustomButton = (props) => {

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={activeOpacity}
      
            style={[styles.buttonMain,customButtonStyle]}>
          
                <Text style={[styles.buttonText,customButtonTextStyle]}>
                    {title}
                </Text>
            
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonMain: {
        height: 50,
        elevation: 23,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        shadowRadius: 15.19,
        shadowOpacity: 0.57,
        marginHorizontal: 27,
        justifyContent: "center",
        shadowOffset: {width:0,height:11},
        shadowColor: "rgba(0, 0, 0, 0.05)",
        borderColor: "white",
        backgroundColor: Colors.Primary,
    },
    buttonText: {
        fontSize: 12,
        fontWeight: "700",
        textAlign: "center",
        color: Colors.White,
        fontFamily: Fonts.Regular,
    },
})

export default CustomButton;
