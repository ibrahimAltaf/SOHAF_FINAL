import React, {useState} from "react";
import {StyleSheet, View, Text, ScrollView, TouchableOpacity, Image} from "react-native";
import {theme} from "../constants/styles";
import Header from "../component/Header/header";
import CustomStatusBar from "../component/StatusBar/customStatusBar";

const BookingDetail = (props) => {
    const {bookingDetail} = props.route.params;
    const [activeTab, setActiveTab] = useState(1);
    return (
        <View style={styles.container}>
            <CustomStatusBar
                barStyle={"light-content"}
                backgroundColor={"#044F86"}
            />
            <Header
                title={"Booking Detail"}
            />
            <ScrollView style={{paddingTop:12}}>
                <View style={{flexDirection:"row",marginHorizontal:20}}>
                    <TouchableOpacity
                        activeOpacity={.7}
                        onPress={() => setActiveTab(1)}
                        style={[styles.tabStyle,{borderBottomColor:activeTab===1?theme.color.primaryColor:"#CCC"}]}>
                        <Text style={[styles.tabTextStyle,{color:activeTab===1?theme.color.primaryColor:"gray"}]}>
                            Booking Details
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={.7}
                        onPress={() => setActiveTab(2)}
                        style={[styles.tabStyle,{borderBottomColor:activeTab===2?theme.color.primaryColor:"#CCC"}]}>
                        <Text style={[styles.tabTextStyle,{color:activeTab===2?theme.color.primaryColor:"gray"}]}>
                            Status
                        </Text>
                    </TouchableOpacity>
                </View>
                {activeTab===1?
                    <>
                        <View style={styles.boxStyle}>
                            <View style={{flexDirection:"row"}}>
                                <View style={{flex:1,justifyContent:"center"}}>
                                    <Text style={styles.headingStyle}>
                                        {bookingDetail?.bookingId}
                                    </Text>
                                </View>
                                <View style={{justifyContent:"center"}}>
                                    <TouchableOpacity
                                        activeOpacity={.7}
                                        onPress={() => {}}
                                        style={bookingDetail?.status!=="Completed"?
                                        styles.pendingStyle:styles.completedStyle}>
                                        <Text style={bookingDetail?.status!=="Completed"?
                                            styles.pendingTextStyle:styles.completedTextStyle}>
                                            {bookingDetail?.status}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{flexDirection:"row",marginTop:4}}>
                                <View style={{justifyContent:"center"}}>
                                    <Image
                                        source={require('../assets/images/calendar.png')}
                                        style={{height:16,width:16,tintColor:theme.color.primaryColor}}
                                    />
                                </View>
                                <View style={{flex:1,justifyContent:"center",marginLeft:8}}>
                                    <Text style={styles.dateStyle}>
                                        Booking Date: 12 Jan, 2024 13:04
                                    </Text>
                                </View>
                            </View>
                            <View style={{flexDirection:"row",marginTop:6}}>
                                <View style={{justifyContent:"center"}}>
                                    <Image
                                        source={require('../assets/images/calendar.png')}
                                        style={{height:16,width:16,tintColor:theme.color.primaryColor}}
                                    />
                                </View>
                                <View style={{flex:1,justifyContent:"center",marginLeft:8}}>
                                    <Text style={styles.dateStyle}>
                                        Booking Date: 12 Jan, 2024 13:04
                                    </Text>
                                </View>
                            </View>
                            <View style={{flexDirection:"row",marginTop:6}}>
                                <View style={{justifyContent:"center"}}>
                                    <Image
                                        source={require('../assets/images/map-pin.png')}
                                        style={{height:16,width:16,tintColor:theme.color.primaryColor}}
                                    />
                                </View>
                                <View style={{flex:1,justifyContent:"center",marginLeft:8}}>
                                    <Text style={styles.dateStyle}>
                                        Address: Plot ZC7, Jinnah Housing Society
                                    </Text>
                                </View>
                            </View>
                            <View style={{flexDirection:"row",alignSelf:"center",padding:20}}>
                                <View style={{justifyContent:"center"}}>
                                    <Text style={styles.downloadStyle}>
                                        Download
                                    </Text>
                                </View>
                                <View style={{justifyContent:"center",marginLeft:8}}>
                                    <Image
                                        source={require('../assets/images/download.png')}
                                        style={{height:20,width:28,tintColor:theme.color.primaryColor}}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.boxStyle}>
                            <View style={{flexDirection:"row"}}>
                                <View style={{flex:1,justifyContent:"center"}}>
                                    <Text style={styles.headingStyle}>
                                        Payment Method
                                    </Text>
                                </View>
                                <View style={{justifyContent:"center"}}>
                                    <Text style={[styles.headingStyle,{color:"red"}]}>
                                        Unpaid
                                    </Text>
                                </View>
                            </View>
                            <View style={{marginTop:12}}>
                                <Text style={styles.dateStyle}>
                                    Cash after service
                                </Text>
                            </View>
                            <View style={{flexDirection:"row",marginTop:6}}>
                                <View style={{flex:1,justifyContent:"center"}}>
                                    <Text style={styles.dateStyle}>
                                        Transaction ID: cash-payment
                                    </Text>
                                </View>
                                <View style={{justifyContent:"center",marginLeft:8}}>
                                    <Text style={styles.priceStyle}>
                                        7,600.00$
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.boxStyle,{padding:0}]}>
                            <View style={{padding:12}}>
                                <Text style={styles.headingStyle}>
                                    Booking Summary
                                </Text>
                            </View>
                            <View style={{flexDirection:"row",backgroundColor:theme.color.secondaryColor,padding:12}}>
                                <View style={{flex:1,justifyContent:"center"}}>
                                    <Text style={[styles.headingStyle,{fontSize:14}]}>
                                        Service Info
                                    </Text>
                                </View>
                                <View style={{justifyContent:"center"}}>
                                    <Text style={[styles.headingStyle,{fontSize:14}]}>
                                        Price
                                    </Text>
                                </View>
                            </View>
                            <View style={{padding:12}}>
                                <View style={{flexDirection:"row"}}>
                                    <View style={{flex:1}}>
                                        <Text style={styles.subHeadingStyle}>
                                            Sofa Cleaning
                                        </Text>
                                        <Text style={[styles.dateStyle,{marginTop:4}]}>
                                            10-seat-sofa-cleaning
                                        </Text>
                                        <Text style={[styles.dateStyle,{marginTop:4}]}>
                                            <Text>Quantity: </Text>
                                            <Text>1</Text>
                                        </Text>
                                        <Text style={styles.dateStyle}>
                                            <Text>Campaign: </Text>
                                            <Text>100.00$</Text>
                                        </Text>
                                    </View>
                                    <View style={{marginLeft:8}}>
                                        <Text style={styles.priceStyle}>
                                            2,400.00$
                                        </Text>
                                    </View>
                                </View>
                                <View style={{flexDirection:"row",marginTop:8}}>
                                    <View style={{flex:1}}>
                                        <Text style={styles.subHeadingStyle}>
                                            Sofa Cleaning
                                        </Text>
                                        <Text style={[styles.dateStyle,{marginTop:4}]}>
                                            10-seat-sofa-cleaning
                                        </Text>
                                        <Text style={[styles.dateStyle,{marginTop:4}]}>
                                            <Text>Quantity: </Text>
                                            <Text>1</Text>
                                        </Text>
                                        <Text style={styles.dateStyle}>
                                            <Text>Campaign: </Text>
                                            <Text>100.00$</Text>
                                        </Text>
                                    </View>
                                    <View style={{marginLeft:8}}>
                                        <Text style={styles.priceStyle}>
                                            2,400.00$
                                        </Text>
                                    </View>
                                </View>
                                <View style={{flexDirection:"row",marginTop:8}}>
                                    <View style={{flex:1}}>
                                        <Text style={styles.subHeadingStyle}>
                                            Sofa Cleaning
                                        </Text>
                                        <Text style={[styles.dateStyle,{marginTop:4}]}>
                                            10-seat-sofa-cleaning
                                        </Text>
                                        <Text style={[styles.dateStyle,{marginTop:4}]}>
                                            <Text>Quantity: </Text>
                                            <Text>1</Text>
                                        </Text>
                                        <Text style={styles.dateStyle}>
                                            <Text>Campaign: </Text>
                                            <Text>100.00$</Text>
                                        </Text>
                                    </View>
                                    <View style={{marginLeft:8}}>
                                        <Text style={styles.priceStyle}>
                                            2,400.00$
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </>
                :activeTab===2?
                    <View style={{marginTop:12}}>
                        <View style={{flexDirection:"row",marginTop:6,alignSelf:"center"}}>
                            <View style={{justifyContent:"center"}}>
                                <Text style={[styles.headingStyle,{fontSize:14}]}>
                                    Booking Place:
                                </Text>
                            </View>
                            <View style={{justifyContent:"center",marginLeft:4}}>
                                <Text style={styles.subHeadingStyle}>
                                    29 Feb, 2024 19:13
                                </Text>
                            </View>
                        </View>
                        <View style={{flexDirection:"row",marginTop:6,alignSelf:"center"}}>
                            <View style={{justifyContent:"center"}}>
                                <Text style={[styles.headingStyle,{fontSize:14}]}>
                                    Service Scheduled Date:
                                </Text>
                            </View>
                            <View style={{justifyContent:"center",marginLeft:4}}>
                                <Text style={styles.subHeadingStyle}>
                                    29 Feb, 2024 22:11
                                </Text>
                            </View>
                        </View>
                        <View style={{flexDirection:"row",marginTop:6,alignSelf:"center"}}>
                            <View style={{justifyContent:"center"}}>
                                <Text style={[styles.headingStyle,{fontSize:14}]}>
                                    Payment Status:
                                </Text>
                            </View>
                            <View style={{justifyContent:"center",marginLeft:4}}>
                                <Text style={[styles.subHeadingStyle,{color:"red",fontWeight:"bold"}]}>
                                    Unpaid
                                </Text>
                            </View>
                        </View>
                        <View style={{flexDirection:"row",marginTop:6,alignSelf:"center"}}>
                            <View style={{justifyContent:"center"}}>
                                <Text style={[styles.headingStyle,{fontSize:14}]}>
                                    Booking Status:
                                </Text>
                            </View>
                            <View style={{justifyContent:"center",marginLeft:4}}>
                                <Text style={[styles.subHeadingStyle,
                                {color:theme.color.primaryColor,fontWeight:"bold"}]}>
                                    Pending
                                </Text>
                            </View>
                        </View>
                        <View style={{flexDirection:"row",padding:12,marginTop:20}}>
                            <View style={{marginRight:12}}>
                                <Image
                                    source={require('../assets/images/check.png')}
                                    style={{height:22,width:22,tintColor:theme.color.primaryColor}}
                                />
                            </View>
                            <View style={{flex:1}}>
                                <Text style={[styles.subHeadingStyle,{fontSize:16,marginBottom:4}]}>
                                    Service Booked by Customer Ayaz Awan
                                </Text>
                                <Text style={styles.dateStyle}>
                                    29 Feb, 2024 19:13
                                </Text>
                            </View>
                        </View>
                    </View>
                :null}
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
        flex: 1,
        paddingBottom: 12,
        borderBottomWidth: 2,
        justifyContent: "center",
    },
    tabTextStyle: {
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
    },
    boxStyle: {
        padding: 12,
        elevation: 5,
        marginTop: 12,
        marginBottom: 6,
        borderRadius: 6,
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
    subHeadingStyle: {
        fontSize: 14,
        color: "#000",
    },
    dateStyle: {
        fontSize: 12,
        color: "gray",
    },
    downloadStyle: {
        fontSize: 16,
        color: theme.color.primaryColor,
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

export default BookingDetail;
