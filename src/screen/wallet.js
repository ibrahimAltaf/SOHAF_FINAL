import React, {useState, useEffect} from "react";
import {ScrollView, StyleSheet, View, Text, TouchableOpacity} from "react-native";
import {useSelector} from "react-redux";
import {theme} from "../constants/styles";
import {useNavigation} from '@react-navigation/native';
import {ToastMessage, helpers} from "../utils/helpers";
import moment from "moment";
import Loader from "../component/Loader/loader";
import Header from "../component/Header/header";
import CustomButton from "../component/Buttons/customButton";
import CustomStatusBar from "../component/StatusBar/customStatusBar";

const Wallet = () => {
    const navigation = useNavigation();
    const [loader, setLoader] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const {userInfo} = useSelector(state => state.userReducer);

    useEffect(() => {
        // getCahsOutHistoryHandle();
    },[]);
    const getCahsOutHistoryHandle = () => {
        try {
            setLoader(true);
            const accessToken = userInfo?.access_token;
            
            var myHeaders = new Headers();
            myHeaders.append("X-Requested-With", "XMLHttpRequest");
            myHeaders.append("Authorization", `Bearer ${accessToken}`);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow',
            };

            fetch(`${helpers.api.baseUrl}wallettransaction`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setLoader(false);
                console.log("result ======> ", result);
                return
                setDataSource(result);
            }).catch((error) => {
                setLoader(false);
                ToastMessage(error?.message);
            });
        } catch (error) {
            setLoader(false);
            ToastMessage(error?.message);
        };
    };

    return (
        <View style={styles.container}>
            <CustomStatusBar
                barStyle={"light-content"}
                backgroundColor={"#044F86"}
            />
            <Header
                backArrow={true}
                title={"Wallet"}
                backPage={() => navigation.goBack()}
            />
            {loader?
                <Loader />
            :
                <>
                    <ScrollView>
                        <View style={styles.cardMain}>
                            <Text style={styles.balance}>
                                {"Your Balance"}
                            </Text>
                            <Text style={styles.cardDetail}>
                                {`${helpers.constant.currencyName} ${dataSource?.wallet_balance
                                ===undefined?(0.00).toFixed(2):dataSource?.wallet_balance?.toFixed(2)}`}
                            </Text>
                        </View>
                        <View style={styles.tableMain}>
                            <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                                <Text style={styles.tableHeading}>
                                    transaction id
                                </Text>
                            </View>
                            <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                                <Text style={styles.tableHeading}>
                                    date
                                </Text>
                            </View>
                            <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                                <Text style={styles.tableHeading}>
                                    Amount
                                </Text>
                            </View>
                        </View>
                        {dataSource===undefined||dataSource===null||
                        dataSource?.length===0||dataSource?.wallet_transation.length===0?
                            <View style={{flex:1,alignItems:"center",justifyContent:"center",marginTop:30}}>
                                <Text>
                                    No Item Found!
                                </Text>
                            </View>
                        :dataSource?.wallet_transation?.map((val, key) => {
                            return (
                                <TouchableOpacity
                                    key={key} 
                                    activeOpacity={.7}
                                    onPress={() => navigation.navigate("WalletDetail", {
                                        transactionDetail: val?.transactions,
                                        transactionId: val?.transaction_alias,
                                    })}
                                    style={[styles.tableDataMain,
                                    {backgroundColor:key%2===0?"#FFF":"rgba(0,0,0,.05)"}]}>
                                    <View style={{flex:1,justifyContent:"center"}}>
                                        <Text style={styles.tableText}>
                                            {val?.transaction_alias}
                                        </Text>
                                    </View>
                                    <View style={{flex:1,justifyContent:"center"}}>
                                        <Text style={styles.tableText}>
                                            {moment(val?.created_at).format('D MMM YY')}
                                        </Text>
                                    </View>
                                    <View style={{flex:1,justifyContent:"center"}}>
                                        <Text style={[styles.tableText,{color:val?.amount>0?"#28a745":"#dc3545"}]}>
                                            {`${helpers.constant.currencyName} ${val?.amount === null ? 0 : val?.amount.toFixed(2)}`}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                    <View style={styles.bottomSection}>
                        <CustomButton
                            title={"Cashout"}
                            activeOpacity={.7}
                            onPress={() => navigation.navigate("CashOut",{
                                remainingAmount: dataSource?.wallet_balance,
                            })}
                            customButtonStyle={{marginTop:20,marginHorizontal:0}}
                        />
                    </View>
                </>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.color.white,
    },
    cardMain: {
        marginTop: 20,
        borderRadius: 4,
        paddingVertical: 60,
        alignItems: "center",
        marginHorizontal: 24,
        backgroundColor: theme.color.primaryColor,
    },
    balance: {
        fontSize: 20,
        textAlign: "center",
        color: theme.color.white,
    },
    cardDetail: {
        fontSize: 40,
        fontWeight: "700",
        textAlign: "center",
        color: theme.color.white,
    },
    heading: {
        fontSize: 18,
        marginTop: 36,
        fontWeight: "700",
        textTransform: "capitalize",
        color: theme.color.headingColor,
    },
    divider: {
        marginTop: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#D6D6D6",
    },
    detail: {
        fontSize: 14,
        textTransform: "capitalize",
        color: theme.color.headingColor,
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
    bottomSection: {
        paddingBottom: 10, 
        borderTopWidth: 1,
        paddingHorizontal: 24,
        borderColor: "#dee2e6",
    },
})

export default Wallet;