import React, {useEffect, useState} from "react";
import {StyleSheet, View, Image, Text, ScrollView, TouchableOpacity, TextInput} from "react-native";
import {theme} from "../constants/styles";
import {SetCartData} from "../Redux/actions/actions";
import {useDispatch, useSelector} from "react-redux";
import {useNavigation} from '@react-navigation/native';
import {ToastMessage, helpers} from "../utils/helpers";
import Header from "../component/Header/header";
import CustomButton from "../component/Buttons/customButton";
import CustomStatusBar from "../component/StatusBar/customStatusBar";

const Cart = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const {cart_data, access_token} = useSelector(state => state.userReducer);
    const [cartList, setCartList] = useState(cart_data);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        setCartList(cart_data);
    }, []);
    useEffect(() => {
        setCartList(cart_data);
        totalAmountHandle();
    }, [cart_data]);
    const updateCartHandle = (value, status) => {
        try {
            let updatedServices = [];
            const itemIdToUpdate = value?.id;
            if (status==="delete") {
                cartList?.map(service => {
                    if (service?.id!==itemIdToUpdate) {
                        updatedServices.push(service);
                    };
                });
            } else if (status==="minus") {
                updatedServices = cartList?.map(service => {
                    if (service?.id===itemIdToUpdate) {
                        return {...service, quantity: service?.quantity-1};
                    };
                    return service;
                });
            } else if (status==="plus") {
                updatedServices = cartList?.map(service => {
                    if (service?.id===itemIdToUpdate) {
                        return {...service, quantity: service?.quantity+1};
                    };
                    return service;
                });
            };
            dispatch(SetCartData(updatedServices));
            setCartList(updatedServices);
        } catch (error) {
            ToastMessage(error?.message);
        };
    };
    const totalAmountHandle = async () => {
        let priceArray = [];
        let totalPrice;
        const data = cart_data;
        if (data !== undefined && data !== null && data?.length !== 0) {
            data.filter(item => 
                item.quantity !== 0).map(item => (
                    priceArray.push({"price": item?.min_price * item?.quantity}),
                    totalPrice = priceArray.reduce((previous, current) => previous + current.price, 0),
                    setTotalAmount(totalPrice)
            ))
        } else {
            setTotalAmount(0);
        };
    };

    return (
        <View style={styles.container}>
            <CustomStatusBar
                barStyle={"light-content"}
                backgroundColor={"#044F86"}
            />
            <Header
                title={"Cart"}
                backArrow={true}
                backPage={() => navigation.goBack()}
            />
            <View style={styles.topBox}>
                <Text style={styles.priceLabelStyle}>
                    {cart_data?.length} services in cart
                </Text>
            </View>
            <ScrollView style={{paddingTop:12}}>
                {cartList?.map((val, key) => {
                    const lastItem = cartList?.length - 1;
                    return (
                        <View key={key} style={[styles.tileStyle,{marginBottom:lastItem===key?24:12}]}>
                            <View style={{justifyContent:"center",borderRadius:8,backgroundColor:theme.color.secondaryColor}}>
                                <Image
                                    source={{uri:val?.cover_image}}
                                    style={{height:100,width:100,borderRadius:8,resizeMode:"contain"}}
                                />
                            </View>
                            <View style={{flex:1,justifyContent:"center",marginLeft:12}}>
                                <Text style={styles.titleStyle}>
                                    {val?.name}
                                </Text>
                                <Text style={styles.descStyle}>
                                    {`${val?.min_price}${helpers.constant.currencyName}`}
                                </Text>
                            </View>
                            <View style={{justifyContent:"flex-end"}}>
                                <View style={{flexDirection:"row"}}>
                                    <View style={{justifyContent:'center'}}>
                                        {val?.quantity===1?
                                            <TouchableOpacity
                                                activeOpacity={.7}
                                                onPress={() => updateCartHandle(val, "delete")}>
                                                <Image
                                                    style={{height:30,width:30,resizeMode:"cover"}}
                                                    source={require('../assets/images/trash-bin.png')}
                                                />
                                            </TouchableOpacity>
                                        :
                                            <TouchableOpacity
                                                activeOpacity={.7}
                                                style={styles.buttonMain}
                                                onPress={() => updateCartHandle(val, "minus")}>
                                                <Image
                                                    source={require('../assets/images/minus.png')}
                                                    style={{height:16,width:16,tintColor:theme.color.white,resizeMode:"cover"}}
                                                />
                                            </TouchableOpacity>
                                        }
                                    </View>
                                    <View style={{justifyContent:'center',paddingHorizontal:6}}>
                                        <TextInput
                                            editable={false}
                                            style={styles.inputStyle}
                                            value={val?.quantity.toString()}
                                        />
                                    </View>
                                    <View style={{justifyContent:'center'}}>
                                        <TouchableOpacity
                                            activeOpacity={.7}
                                            style={styles.buttonMain}
                                            onPress={() => updateCartHandle(val, "plus")}>
                                            <Image
                                                source={require('../assets/images/plus.png')}
                                                style={{height:12,width:12,tintColor:theme.color.white,resizeMode:"cover"}}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )
                })}
            </ScrollView>
            {cartList?.length!==0?
                <View style={styles.bottomBox}>
                    <Text style={styles.priceLabelStyle}>
                        <Text>Total Price</Text>
                        <Text style={styles.priceStyle}>
                            {` ${totalAmount}${helpers.constant.currencyName}`}
                        </Text>
                    </Text>
                    <CustomButton
                        activeOpacity={.7}
                        title={"Proceed to checkout"}
                        customButtonStyle={{marginTop:12,marginBottom:0}}
                        onPress={() => {
                            if (access_token===null) {
                                navigation.navigate("Login",{
                                    routeName: "cart",
                                });
                            } else {
                                navigation.navigate("CheckOut");
                            };
                        }}
                    />
                </View>
            :null}
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
        textTransform: "capitalize",
    },
    descStyle: {
        fontSize: 18,
        marginTop: 12,
        fontWeight: "bold",
        color: theme.color.primaryColor,
    },
    bottomBox: {
        borderTopWidth: 1,
        paddingBottom: 80,
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
    buttonMain: {
        width: 30,
        height: 30,
        elevation: 18,
        borderRadius: 50,
        shadowColor: "#CCC",
        shadowRadius: 11.95,
        shadowOpacity: 0.48,
        alignItems: "center",
        justifyContent: "center",
        shadowOffset: {width:0,height:9},
        backgroundColor: theme.color.primaryColor,
    },
    inputStyle: {
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        justifyContent: "center",
        color: theme.color.primaryColor,
    },
});

export default Cart;
