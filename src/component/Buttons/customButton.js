import React from "react";
import {TouchableOpacity, Text, StyleSheet, ActivityIndicator} from "react-native";
import {theme} from "../../constants/styles";
import {FontFamily} from "../../constants/fonts";

const CustomButton = (props) => {
    const {onPress, loading, disabled, activeOpacity,
    customButtonStyle, color, customButtonTextStyle, title} = props;
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={activeOpacity}
            disabled={loading===false?disabled:loading}
            style={[styles.buttonMain,customButtonStyle]}>
            {loading?
                <ActivityIndicator color={color!==undefined?color:"#FFF"} />
            :
                <Text style={[styles.buttonText,customButtonTextStyle]}>
                    {title}
                </Text>
            }
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
        justifyContent: "center",
        shadowOffset: {width:0,height:11},
        shadowColor: "rgba(0, 0, 0, 0.05)",
        borderColor: theme.color.primaryColor,
        backgroundColor: theme.color.primaryColor,
    },
    buttonText: {
        fontSize: 12,
        fontWeight: "700",
        textAlign: "center",
        color: theme.color.black,
        fontFamily: FontFamily.boldFont,
    },
})

export default CustomButton;
