import React, { useState } from "react";
import {Image, Linking, StyleSheet, Text, View} from "react-native";
import {theme} from "../constants/styles";
import {useNavigation} from '@react-navigation/native';
import Header from "../component/Header/header";
import CustomButton from "../component/Buttons/customButton";
import CustomStatusBar from "../component/StatusBar/customStatusBar";

const ContactUs = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("info@arbitech.com");
    const [number, setNumber] = useState("0000000000");
    return (
        <View style={styles.container}>
            <CustomStatusBar
                barStyle={"light-content"}
                backgroundColor={"#044F86"}
            />
            <Header
                backArrow={true}
                title={"Help & Support"}
                backPage={() => navigation.goBack()}
            />
            <View style={{padding:20}}>
                <Image
                    source={require('../assets/images/contact-us.png')}
                    style={{height:150,width:220,resizeMode:"contain",alignSelf:"center"}}
                />
                <View style={{marginTop:30}}>
                    <Text style={styles.headingStyle}>
                        Conatct us through email
                    </Text>
                </View>
                <View style={{marginTop:12}}>
                    <Text style={styles.detailStyle}>
                        You can send us email through
                    </Text>
                    <Text style={[styles.headingStyle,{fontSize:16}]}>
                        {email}
                    </Text>
                </View>
                <View style={{marginTop:30}}>
                    <Text style={styles.headingStyle}>
                        Conatct us through phone
                    </Text>
                </View>
                <View style={{marginTop:12}}>
                    <Text style={styles.detailStyle}>
                        Conatct us through our customer care number
                    </Text>
                    <Text style={[styles.headingStyle,{fontSize:16}]}>
                        {number}
                    </Text>
                </View>
                <View style={{flexDirection:"row",marginTop:20}}>
                    <View style={{flex:1,justifyContent:"center",marginRight:8}}>
                        <CustomButton
                            title={"Email"}
                            activeOpacity={.7}
                            customButtonStyle={{marginHorizontal:0}}
                            onPress={() => Linking.openURL(`mailto:${email}`)}
                        />
                    </View>
                    <View style={{flex:1,justifyContent:"center",marginLeft:8}}>
                        <CustomButton
                            title={"Call"}
                            activeOpacity={.7}
                            customButtonStyle={{marginHorizontal:0}}
                            onPress={() => Linking.openURL(`tel:${number}`)}
                        />
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.color.secondaryColor,
    },
    headingStyle: {
        fontSize: 18,
        color: "#000",
        fontWeight: "bold",
    },
    detailStyle: {
        fontSize: 16,
        color: "gray",
        paddingTop: 4,
    },
    areaBoxStyle: {
        height: 80,
        marginTop: 6,
        width: "100%",
        borderWidth: 2,
        borderRadius: 12,
        alignItems: "center",
        borderColor: "#b8daff",
        justifyContent: "center",
        backgroundColor: "#cce5ff",
    }
});

export default ContactUs;
