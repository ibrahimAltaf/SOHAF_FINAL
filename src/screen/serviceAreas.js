import React from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import {theme} from "../constants/styles";
import {useNavigation} from '@react-navigation/native';
import Header from "../component/Header/header";
import CustomButton from "../component/Buttons/customButton";
import CustomStatusBar from "../component/StatusBar/customStatusBar";

const ServiceAreas = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <CustomStatusBar
                barStyle={"light-content"}
                backgroundColor={"#044F86"}
            />
            <Header
                backArrow={true}
                title={"Our Service Areas"}
                backPage={() => navigation.goBack()}
            />
            <View style={{padding:20,alignItems:"center"}}>
                <Image
                    source={require('../assets/images/map.png')}
                    style={{height:120,width:120,resizeMode:"cover"}}
                />
                <Text style={styles.headingStyle}>
                    We are available in these areas
                </Text>
                <Text style={styles.detailStyle}>
                    Get you desired service any time within this location
                </Text>
                <View style={{flexDirection:"row",marginTop:12}}>
                    <View style={{flex:1,justifyContent:"center"}}>
                        <Text style={[styles.detailStyle,
                        {color:theme.color.primaryColor}]}>
                            Your area
                        </Text>
                        <View style={styles.areaBoxStyle}>
                            <Text style={[styles.detailStyle,{color:"#000"}]}>
                                All over the world
                            </Text>
                        </View>
                    </View>
                    <View style={{flex:1,justifyContent:"center"}}></View>
                </View>
            </View>
            <View style={{position:"absolute",bottom:20,left:0,right:0,width:"100%"}}>
                <CustomButton
                    activeOpacity={.7}
                    title={"View on Map"}
                    customButtonStyle={{marginTop:12,marginBottom:0}}
                />
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
        fontSize: 14,
        color: "#000",
        paddingTop: 12,
        fontWeight: "bold",
        textAlign: "center",
    },
    detailStyle: {
        fontSize: 14,
        color: "gray",
        paddingTop: 4,
        textAlign: "center",
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

export default ServiceAreas;
