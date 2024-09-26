import React from "react";
import {View, StyleSheet, ActivityIndicator} from "react-native";
import {theme } from "../../constants/styles";

const Loader = () => {
    return (
        <View style={styles.loaderOverlay}>
            <ActivityIndicator
                size={"large"}
                color={theme.color.primaryColor}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    loaderOverlay: {
        zIndex: 99999,
        width: "100%",
        height: "100%",
        alignItems: "center", 
        justifyContent: "center",
        backgroundColor: theme.color.secondaryColor,
    },
})

export default Loader;
