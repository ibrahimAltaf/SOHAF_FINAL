import React, {useState, useEffect} from "react";
import {ScrollView, StyleSheet, View, Text, TouchableOpacity, Image, KeyboardAvoidingView, Platform} from "react-native";
import {useSelector} from "react-redux";
import {theme} from "../constants/styles";
import {TextInput} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {ToastMessage, helpers} from "../utils/helpers";
import Loader from "../component/Loader/loader";
import Header from "../component/Header/header";
import CustomButton from "../component/Buttons/customButton";
import CustomStatusBar from "../component/StatusBar/customStatusBar";

const CashOut = (props) => {
    const navigation = useNavigation();
    const {remainingAmount} = props.route.params;
    const {userInfo} = useSelector(state => state.userReducer);
    const [loader, setLoader] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [withdrawAmount, setWithdrawAmount] = useState("");

    useEffect(() => {
        // getCahsOutPendingHandle();
    },[]);
    const cashOutRequestHandle = async () => {
        try {
            if (withdrawAmount!=="") {
                if (withdrawAmount > remainingAmount) {
                    ToastMessage(`The amount may not be greater than $${remainingAmount}`);
                } else {
                    setLoader(true);
                    const accessToken = userInfo?.access_token;
                    const data = {
                        accessToken: accessToken,
                        amount: withdrawAmount,
                        type: "provider"
                    };
                    // PostCashOutRequest(data).then((response) => {
                    //     ToastMessage(response?.data?.success);
                    //     getCahsOutPendingHandle();
                    //     setLoader(false);
                    // });
                }
            } else {
                ToastMessage("Please Insert your amount");
            }
        } catch (error) {
            setLoader(false);
            ToastMessage(error?.message);
        }
    };
    const getCahsOutPendingHandle = async () => {
        try {
            setLoader(true);
            const accessToken = userInfo?.access_token;
            // GetCahsOutPending(accessToken).then((response) => {
            //     setDataSource(response?.data);
            //     setLoader(false);
            // });
        } catch (error) {
            setLoader(false);
            ToastMessage(error?.message);
        }
    };
    const cancelCashOutRequestHandle = async (id) => {
        try {
            setLoader(true);
            const accessToken = userInfo?.access_token;
            const data = {
                requestId: id,
                accessToken: accessToken,
            };
            // CancelCashOutRequest(data).then((response) => {
            //     console.log("CANCEL RESPONSE ====> ", response?.data);
            //     ToastMessage(response?.data?.success);
            //     getCahsOutPendingHandle();
            //     setLoader(false);
            // });
        } catch (error) {
            setLoader(false);
            ToastMessage(error?.message);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container}
        behavior={Platform.OS==='ios'?'padding':'height'}>
            <CustomStatusBar
                barStyle={"light-content"}
                backgroundColor={"#044F86"}
            />
            <Header
                backArrow={true}
                title={"CashOut"}
                backPage={() => navigation.goBack()}
            />
            {loader ?
                <Loader />
            :
                <>
                    <ScrollView>
                        <View style={{marginHorizontal:18,marginTop:20}}>
                            <View style={{flexDirection:"row"}}>
                                <View style={{flex:1,justifyContent:"center"}}>
                                    <TextInput
                                        value={withdrawAmount}
                                        label={"Withdraw Amount"}
                                        keyboardType={"phone-pad"}
                                        style={{backgroundColor:"transparent"}}
                                        onChangeText={text => setWithdrawAmount(text)}
                                    />
                                </View>
                                <View style={{flex:.3,justifyContent:"flex-end"}}>
                                    <CustomButton
                                        title={"Submit"}
                                        activeOpacity={.7}
                                        // onPress={cashOutRequestHandle}
                                        customButtonStyle={{marginHorizontal:0,marginBottom:0,borderRadius:6,height:40}}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.tableMain}>
                            <View style={{flex:1,justifyContent:"center",paddingLeft:12}}>
                                <Text style={styles.tableHeading}>
                                    Transaction id
                                </Text>
                            </View>
                            <View style={{flex:1,justifyContent:"center"}}>
                                <Text style={styles.tableHeading}>
                                    Type
                                </Text>
                            </View>
                            <View style={{flex:1,justifyContent:"center"}}>
                                <Text style={styles.tableHeading}>
                                    Amount
                                </Text>
                            </View>
                            <View style={{flex:1,justifyContent:"center"}}>
                                <Text style={styles.tableHeading}>
                                    Cancel
                                </Text>
                            </View>
                        </View>
                        {dataSource===undefined||dataSource===null||
                        dataSource.length===0||dataSource.pendinglist.length===0?
                            <View style={{flex:1,alignItems:"center",justifyContent:"center",marginTop:30}}>
                                <Text>
                                    No Requested History!
                                </Text>
                            </View>
                        :dataSource?.pendinglist.map((val, key) => {
                            return (
                                <View
                                    key={key} 
                                    style={[styles.tableDataMain,
                                    {backgroundColor:key%2===0?"#FFF":"rgba(0,0,0,.05)"}]}>
                                    <View style={{flex:1,justifyContent:"center",paddingLeft:12}}>
                                        <Text style={styles.tableText}>
                                            {val?.alias_id}
                                        </Text>
                                    </View>
                                    <View style={{flex:1,justifyContent:"center"}}>
                                        <Text style={styles.tableText}>
                                            {val?.type==="D"?"Debit":"Credit"}
                                        </Text>
                                    </View>
                                    <View style={{flex:1,justifyContent:"center"}}>
                                        <Text style={[styles.tableText,{color:val?.amount>0?"#28a745":"#dc3545"}]}>
                                            {`${helpers.constant.currencyName} ${val?.amount === null ? 0 : val?.amount.toFixed(2)}`}
                                        </Text>
                                    </View>
                                    <TouchableOpacity 
                                        activeOpacity={.7}
                                        onPress={() => cancelCashOutRequestHandle(val?.id)}
                                        style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                                        <Image 
                                            source={theme.images.trashIcon} 
                                            style={{height:20,width:20,resizeMode:"contain"}}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )
                        })}
                    </ScrollView>
                </>
            }
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.color.bgColor,
    },
    heading: {
        fontSize: 18,
        marginTop: 36,
        fontWeight: "700",
        textTransform: "capitalize",
        color: theme.color.headingColor,
    },
    withdrawInput: {
        marginTop: 12, 
        paddingVertical: 10,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
    },
    cashOutButton: {
        marginTop: 12, 
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
    },
    tableMain: {
        marginTop: 20,
        paddingVertical: 14,
        flexDirection: "row",
        backgroundColor: theme.color.primaryColor,
    },
    tableHeading: {
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        color: theme.color.white,
        textTransform: "capitalize",
    },
    tableDataMain: {
        paddingVertical: 12,
        flexDirection: "row",
        backgroundColor: theme.color.white,
    },
    tableText: {
        fontSize: 13,
        textAlign: "center",
        textTransform: "capitalize",
        color: theme.color.headingColor,
    },
})

export default CashOut;