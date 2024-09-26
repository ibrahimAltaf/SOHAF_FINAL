import React, { useState } from "react";
import {StyleSheet, View, TouchableOpacity, Image, Text} from "react-native";
import {theme} from "../constants/styles";
import {useNavigation} from '@react-navigation/native';
import Header from "../component/Header/header";
import ToggleSwitch from 'toggle-switch-react-native';
import CustomStatusBar from "../component/StatusBar/customStatusBar";

const Settings = () => {
    const navigation = useNavigation();
    const [darkModeToggle, setDarkModeToggle] = useState(false);
    const [notificationToggle, setNotificationToggle] = useState(false);

    return (
        <View style={styles.container}>
            <CustomStatusBar
                barStyle={"light-content"}
                backgroundColor={"#044F86"}
            />
            <Header
                backArrow={true}
                title={"Settings"}
                backPage={() => navigation.goBack()}
            />
            <View style={{flexDirection:"row",marginTop:20}}>
                <View style={[styles.cardStyle,{marginRight:12,marginLeft:12}]}>
                    <ToggleSwitch
                        size={"medium"}
                        offColor={"#EEE"}
                        onColor={"green"}
                        isOn={darkModeToggle}
                        onToggle={isOn => setDarkModeToggle(isOn)}
                    />
                    <Text style={styles.headingStyle}>
                        Dark Mode
                    </Text>
                </View>
                <View style={[styles.cardStyle,{marginRight:12}]}>
                    <ToggleSwitch
                        size={"medium"}
                        offColor={"#EEE"}
                        onColor={"green"}
                        isOn={notificationToggle}
                        onToggle={isOn => setNotificationToggle(isOn)}
                    />
                    <Text style={styles.headingStyle}>
                        Notification Sound
                    </Text>
                </View>
            </View>
            {/* <View style={{flexDirection:"row",marginTop:0}}>
                <TouchableOpacity
                    activeOpacity={.7}
                    onPress={() => {}}
                    style={[styles.cardStyle,{marginRight:12,marginLeft:12}]}>
                    <Image
                        style={styles.iconStyle}
                        source={require('../assets/images/translate.png')}
                    />
                    <Text style={styles.headingStyle}>
                        Language
                    </Text>
                </TouchableOpacity>
                <View style={{flex:1,marginLeft:12}}></View>
            </View> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.color.secondaryColor,
    },
    topBox: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        backgroundColor: "#FFF",
        borderBottomColor: "#EEE",
    },
    tileStyle: {
        elevation: 9,
        borderRadius: 8,
        marginBottom: 12,
        shadowRadius: 5.46,
        shadowColor: "#CCC",
        shadowOpacity: 0.32,
        paddingVertical: 12,
        flexDirection: "row",
        marginHorizontal: 12,
        paddingHorizontal: 12,
        backgroundColor: "#FFF",
        shadowOffset: {width:0,height:3},
    },
    titleStyle: {
        fontSize: 14,
        color: "#000",
        fontWeight: "bold",
    },
    descStyle: {
        fontSize: 12,
        marginTop: 6,
        color: "#000",
    },
    bottomBox: {
        borderTopWidth: 1,
        paddingVertical: 12,
        borderTopColor: "#EEE",
        backgroundColor: "#FFF",
    },
    priceLabelStyle: {
        fontSize: 16,
        color: "#000",
        paddingVertical: 6,
        textAlign: "center",
    },
    priceStyle: {
        color: "red",
        fontSize: 18,
        fontWeight: "bold",
    },
    cardStyle: {
        flex: 1,
        padding: 6,
        height: 140,
        elevation: 4,
        marginBottom: 16,
        borderRadius: 12,
        shadowRadius: 2.62,
        shadowColor: "#000",
        shadowOpacity: 0.23,
        alignItems: "center",
        backgroundColor: "#FFF",
        justifyContent: "center",
        shadowOffset: {width:0,height:2},
    },
    iconStyle: {
        width: 40,
        height: 40,
        alignSelf: "center",
    },
    headingStyle: {
        fontSize: 14,
        color: "#000",
        paddingTop: 12,
        fontWeight: "bold",
        textAlign: "center",
        textTransform: "capitalize",
    },
});

export default Settings;
