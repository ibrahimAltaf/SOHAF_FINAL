import React, {useState} from "react";
import {StyleSheet, View, Text, ScrollView, TouchableOpacity} from "react-native";
import {theme} from "../constants/styles";
import {useNavigation} from '@react-navigation/native';
import Header from "../component/Header/header";
import CustomStatusBar from "../component/StatusBar/customStatusBar";

const data = [
    {id: 1, bookingId: "Booking# 10001", status: "Pending"},
    {id: 2, bookingId: "Booking# 10002", status: "Completed"},
    {id: 3, bookingId: "Booking# 10003", status: "Pending"},
    {id: 4, bookingId: "Booking# 10004", status: "Accepted"},
    {id: 5, bookingId: "Booking# 10005", status: "Ongoing"},
    {id: 6, bookingId: "Booking# 10006", status: "Completed"},
    {id: 7, bookingId: "Booking# 10007", status: "Cancelled"},
    {id: 8, bookingId: "Booking# 10008", status: "Pending"},
];

const MyBookings = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState("all");
    return (
        <View style={styles.container}>
            <CustomStatusBar
                barStyle={"light-content"}
                backgroundColor={"#044F86"}
            />
            <Header
                title={"My Bookings"}
            />
            <ScrollView style={{paddingTop:12}}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity
                        activeOpacity={.7}
                        style={styles.tabStyle}
                        onPress={() => setActiveTab("all")}>
                        <Text style={styles.tabTextStyle}>
                            All
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={.7}
                        style={styles.tabStyle}
                        onPress={() => setActiveTab("pending")}>
                        <Text style={styles.tabTextStyle}>
                            Pending
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={.7}
                        style={styles.tabStyle}
                        onPress={() => setActiveTab("accepted")}>
                        <Text style={styles.tabTextStyle}>
                            Accepted
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={.7}
                        style={styles.tabStyle}
                        onPress={() => setActiveTab("ongoing")}>
                        <Text style={styles.tabTextStyle}>
                            Ongoing
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={.7}
                        style={styles.tabStyle}
                        onPress={() => setActiveTab("completed")}>
                        <Text style={styles.tabTextStyle}>
                            Completed
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={.7}
                        style={[styles.tabStyle,{marginRight:12}]}
                        onPress={() => setActiveTab("cancelled")}>
                        <Text style={styles.tabTextStyle}>
                            Cancelled
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
                {data?.map((val, key) => {
                    if (val?.status?.toLowerCase()===activeTab) {
                        return (
                            <TouchableOpacity
                                key={key}
                                activeOpacity={.7}
                                style={styles.boxStyle}
                                onPress={() => navigation.navigate("BookingDetail",{
                                    bookingDetail: val,
                                })}>
                                <View style={{flexDirection:"row"}}>
                                    <View style={{flex:1,justifyContent:"center"}}>
                                        <Text style={styles.headingStyle}>
                                            {val?.bookingId}
                                        </Text>
                                    </View>
                                    <View style={{justifyContent:"center"}}>
                                        <Text style={styles.priceStyle}>
                                            $110.00
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.dateStyle}>
                                    Booking Date: 12 Jan, 2024 13:04
                                </Text>
                                <Text style={styles.dateStyle}>
                                    Service Date: 12 Jan, 2024 13:04
                                </Text>
                                <View style={{flexDirection:"row",marginTop:12}}>
                                    <View style={{flex:1,justifyContent:"center"}}>
                                        <TouchableOpacity
                                            activeOpacity={.7}
                                            onPress={() => {}}
                                            style={val?.status!=="Completed"?
                                            styles.pendingStyle:styles.completedStyle}>
                                            <Text style={val?.status!=="Completed"?
                                                styles.pendingTextStyle:styles.completedTextStyle}>
                                                {val?.status}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    {val?.status?.toLowerCase==="completed"&&
                                        <View style={{flex:1,justifyContent:"center"}}>
                                            <TouchableOpacity
                                                activeOpacity={.7}
                                                onPress={() => {}}
                                                style={styles.rebookStyle}>
                                                <Text style={styles.rebookTextStyle}>
                                                    Rebook
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    }
                                </View>
                            </TouchableOpacity>
                        )
                    } if (activeTab==="all") {
                        return (
                            <TouchableOpacity
                                key={key}
                                activeOpacity={.7}
                                style={styles.boxStyle}
                                onPress={() => navigation.navigate("BookingDetail",{
                                    bookingDetail: val,
                                })}>
                                <View style={{flexDirection:"row"}}>
                                    <View style={{flex:1,justifyContent:"center"}}>
                                        <Text style={styles.headingStyle}>
                                            {val?.bookingId}
                                        </Text>
                                    </View>
                                    <View style={{justifyContent:"center"}}>
                                        <Text style={styles.priceStyle}>
                                            $110.00
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.dateStyle}>
                                    Booking Date: 12 Jan, 2024 13:04
                                </Text>
                                <Text style={styles.dateStyle}>
                                    Service Date: 12 Jan, 2024 13:04
                                </Text>
                                <View style={{flexDirection:"row",marginTop:12}}>
                                    <View style={{flex:1,justifyContent:"center"}}>
                                        <TouchableOpacity
                                            activeOpacity={.7}
                                            onPress={() => {}}
                                            style={val?.status!=="Completed"?
                                            styles.pendingStyle:styles.completedStyle}>
                                            <Text style={val?.status!=="Completed"?
                                                styles.pendingTextStyle:styles.completedTextStyle}>
                                                {val?.status}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    {val?.status?.toLowerCase==="completed"&&
                                        <View style={{flex:1,justifyContent:"center"}}>
                                            <TouchableOpacity
                                                activeOpacity={.7}
                                                onPress={() => {}}
                                                style={styles.rebookStyle}>
                                                <Text style={styles.rebookTextStyle}>
                                                    Rebook
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    }
                                </View>
                            </TouchableOpacity>
                        )
                    }
                })}
                <View style={{height:80}}></View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.color.secondaryColor,
    },
    tabStyle: {
        marginTop: 6,
        elevation: 5,
        marginLeft: 12,
        marginBottom: 12,
        borderRadius: 50,
        shadowRadius: 3.84,
        paddingVertical: 8,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        alignItems: 'center',
        paddingHorizontal: 36,
        backgroundColor: "#EEE",
        justifyContent: 'center',
        shadowOffset: {width:0,height:2},
    },
    tabTextStyle: {
        fontSize: 12,
        color: "#000",
        fontWeight: "bold",
        textAlign: "center",
    },
    boxStyle: {
        flex: 1,
        padding: 12,
        elevation: 5,
        borderRadius: 6,
        marginVertical: 6,
        shadowColor: "gray",
        shadowOpacity: 0.25,
        marginHorizontal: 12,
        backgroundColor: "#FFF",
        justifyContent: 'center',
        shadowOffset: {width:0,height:2},
    },
    headingStyle: {
        fontSize: 16,
        color: "#000",
        fontWeight: "bold",
    },
    priceStyle: {
        fontSize: 14,
        fontWeight: "bold",
        color: theme.color.primaryColor,
    },
    dateStyle: {
        marginTop: 6,
        fontSize: 12,
        color: "gray",
    },
    pendingStyle: {
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 24,
        alignSelf: "flex-start",
        backgroundColor: "#cce5ff",
    },
    pendingTextStyle: {
        fontSize: 14,
        color: "#004085",
        fontWeight: "bold",
        textAlign: "center",
    },
    rebookStyle: {
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 8,
        alignSelf: "flex-end",
        paddingHorizontal: 24,
        borderColor: theme.color.primaryColor,
    },
    rebookTextStyle: {
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        color: theme.color.primaryColor,
    },
    completedStyle: {
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 24,
        alignSelf: "flex-start",
        backgroundColor: "#d4edda",
    },
    completedTextStyle: {
        fontSize: 14,
        color: "#155724",
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default MyBookings;
