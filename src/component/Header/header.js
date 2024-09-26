import React, {useEffect, useState} from "react";
import {StyleSheet, View, Text, TouchableOpacity, StatusBar, Image} from "react-native";
import {useSelector} from "react-redux";
import {theme} from "../../constants/styles";

const Header = (props) => {
    const {cart_data} = useSelector(state => state.userReducer);
    const [cartCounter, setCartCounter] = useState(cart_data?.length);
    const {customHeaderStyle, statusBarColor, backArrow, backPage, title, cartShow, cartPress} = props;

    useEffect(() => {
        setCartCounter(cart_data?.length);
    }, [cart_data]);
    
    return (
        <View style={[styles.headerMain,customHeaderStyle]}>
            <View style={{flexDirection:"row"}}>
                {backArrow?
                    <TouchableOpacity
                        activeOpacity={.7}
                        onPress={backPage}
                        style={styles.backIconMain}>
                        <Image
                            source={theme.images.leftArrow}
                            style={{height:25,width:25,tintColor:"#FFF"}}
                        />
                    </TouchableOpacity>
                :<View style={{flex:.5}}></View>}
                <View style={{flex:4,alignItems:"center",justifyContent:"center"}}>
                    <Text style={styles.headerHeading}>
                        {title}
                    </Text>
                </View>
                {cartShow?
                    <TouchableOpacity
                        activeOpacity={.7}
                        onPress={cartPress}
                        style={[styles.backIconMain,{position:"relative"}]}>
                        <Image
                            style={{height:25,width:25,tintColor:"#FFF"}}
                            source={require('../../assets/images/cart.png')}
                        />
                        <View style={styles.cartCircle}>
                            <Text style={{fontSize:8,color:"#FFF"}}>
                                {cartCounter}
                            </Text>
                        </View>
                    </TouchableOpacity>
                :<View style={{flex:.5}}></View>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    backIconMain: {
        alignItems: "center",
        justifyContent: "center",
    },
    headerMain: {
        elevation: 6,
        paddingTop: 40,
        paddingBottom: 20,
        shadowRadius: 4.65,
        shadowColor: "#000",
        shadowOpacity: 0.27,
        paddingHorizontal: 24,
        shadowOffset: {width:0,height:3},
        backgroundColor: theme.color.primaryColor,
    },
    headerHeading: {
        fontSize: 20,
        textAlign: "center",
        color: theme.color.white,
        textTransform: "capitalize",
    },
    cartCircle: {
        top: -8,
        right: -8,
        width: 16,
        height: 16,
        borderRadius: 100,
        position: "absolute",
        alignItems: "center",
        backgroundColor: "red",
        justifyContent: "center",
    }
})

export default Header;