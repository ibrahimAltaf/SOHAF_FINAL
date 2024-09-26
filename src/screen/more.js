import React, { useEffect, useRef } from "react";
import { StyleSheet, View, FlatList, ScrollView, TouchableOpacity, Text, Image } from "react-native";
import { theme } from "../constants/styles";
import { useNavigation } from '@react-navigation/native';
import Header from "../component/Header/header";
import RBSheet from "react-native-raw-bottom-sheet";
import CustomStatusBar from "../component/StatusBar/customStatusBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { SetUserDetail, SetUserToken } from "../Redux/actions/actions";

const More = () => {
    const refRBSheet = useRef();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const {access_token} = useSelector((state) => state.userReducer);

    useEffect(() => {
        refRBSheet.current.open();
    }, []);
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            refRBSheet.current.open();
        });

        return unsubscribe;
    }, [navigation]);
    const logoutHandle = async () => {
        try {
            if (access_token===null) {
                navigation.navigate("Login", {
                    routeName: "home",
                });
            } else {
                await AsyncStorage.removeItem("access_token");
                await AsyncStorage.removeItem("user_detail");
                await AsyncStorage.removeItem("user_location");
                dispatch(SetUserDetail({}));
                dispatch(SetUserToken(null));
                navigation.navigate("Home");
            };
        } catch (error) {
            console.error("Error during logout:", error);
        };
    };
    const renderItem = ({ item, index }) => {
        const { title, onPress, icon } = item;
        return (
            <TouchableOpacity
                key={index}
                onPress={() => {
                    refRBSheet.current.close();
                    onPress();
                }}
                activeOpacity={.7}
                style={{ flex: 1, marginRight: 6, marginLeft: 6 }}>
                <View style={styles.cardStyle}>
                    <Image
                        source={icon}
                        style={styles.iconStyle}
                    />
                </View>
                <Text style={styles.cardTextStyle}>
                    {title}
                </Text>
            </TouchableOpacity>
        );
    };

    const data = [
        {id: 1, title: "Profile", onPress: () => access_token===null?navigation.navigate("Login",{routeName:"profile"}):navigation.navigate("Profile"), icon: require('../assets/images/user.png')},
        {id: 2, title: "Inbox", onPress: () => access_token===null?navigation.navigate("Login",{routeName:"chat"}):navigation.navigate("Inbox"), icon: require('../assets/images/email.png')},
        {id: 3, title: "Language", onPress: () => navigation.navigate("Langauges"), icon: require('../assets/images/translate.png')},
        {id: 4, title: "Cancellation Policy", onPress: () => navigation.navigate("CancellationPolicy"), icon: require('../assets/images/cancellationpooo.png')},
        {id: 5, title: "Bookings", onPress: () => access_token===null?navigation.navigate("Login",{routeName:"booking"}):navigation.navigate("Bookings"), icon: require('../assets/images/book.png')},
        {id: 6, title: "Coupons", onPress: () => access_token===null?navigation.navigate("Login",{routeName:"coupons"}):navigation.navigate("Coupons"), icon: require('../assets/images/coupon-new.png')},
        {id: 7, title: "About Us", onPress: () => navigation.navigate("AboutUs"), icon: require('../assets/images/team.png')},
        {id: 8, title: "Privacy and Policy", onPress: () => navigation.navigate("PrivacyPolicy"), icon: require('../assets/images/insurance.png')},
        {id: 9, title: "Refund Policy", onPress: () => navigation.navigate("RefundPolicy"), icon: require('../assets/images/cashback.png')},
        {id: 10, title: "Help & Support", onPress: () => navigation.navigate("Help&Support"), icon: require('../assets/images/help-desk.png')},
        {id: 11, title: "Service Area", onPress: () => navigation.navigate("ServiceAreas"), icon: require('../assets/images/car-service.png')},
        {id: 12, title: "Terms & Condiotions", onPress: () => navigation.navigate("TermCondiotions"), icon: require('../assets/images/TERMSSS.png')},
        {id: 13, title: access_token===null?"Login":"Logout", onPress: () => logoutHandle(), icon: require('../assets/images/logout.png')},
    ];

    return (
        <View style={styles.container}>
            <CustomStatusBar
                barStyle={"light-content"}
                backgroundColor={"#044F86"}
            />
            <Header
                title={"More"}
            />
            <ScrollView>
                <View style={{height:80}}></View>
            </ScrollView>
            <RBSheet
                height={450}
                ref={refRBSheet}
                // draggable={false}
                // closeOnPressMask={false}
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                    container: styles.bottomSheetStyle,
                    wrapper: styles.bottomSheetOverlay,
                    draggableIcon: styles.bottomSheetIcon,
                }}>
                <FlatList
                    data={data}
                    numColumns={4}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    ListFooterComponent={() => {
                        return (
                            <Text style={styles.versionStyle}>
                                App Version: 1.0
                            </Text>
                        )
                    }}
                />
            </RBSheet>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.color.secondaryColor,
    },
    cardStyle: {
        height: 70,
        width: 70,
        alignSelf:"center",
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#cce5ff",
    },
    iconStyle: {
        width: 40,
        height: 40,
    },
    cardTextStyle: {
        fontSize: 12,
        marginTop: 4,
        color: "#000",
        marginBottom: 12,
        fontWeight: "bold",
        textAlign: "center",
    },
    versionStyle: {
        fontSize: 14,
        color: "gray",
        marginVertical: 12,
        fontWeight: "bold",
        textAlign: "center",
    },
    // Bottom sheet styles...
    bottomSheetStyle: {
        backgroundColor: "#FFF",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    bottomSheetOverlay: {
        backgroundColor: "#2632384f",
    },
    bottomSheetIcon: {
        width: 50,
        backgroundColor: "#D6D8E0",
    },
});

export default More;
