import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, useColorScheme } from "react-native";
import { useSelector } from "react-redux";
import { theme } from "../../constants/styles";
import { useThemeContext } from '../../../ThemeContext'; // Import the ThemeContext

const Header = (props) => {
    const { cart_data } = useSelector(state => state.userReducer);
    const [cartCounter, setCartCounter] = useState(cart_data?.length);
    const { customHeaderStyle, backArrow, backPage, title, cartShow, cartPress } = props;

    const colorScheme = useColorScheme();
    const { isDarkMode, toggleTheme } = useThemeContext(); // Access dark mode from context
    
    useEffect(() => {
        setCartCounter(cart_data?.length);
    }, [cart_data]);
    
    return (
        <View style={[
            styles.headerMain,
            customHeaderStyle,
            { backgroundColor: isDarkMode ? theme.color.black : theme.color.white }
        ]}>
            <View style={{ flexDirection: "row" }}>
                {backArrow ? (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={backPage}
                        style={styles.backIconMain}>
                        <Image
                            source={theme.images.leftArrow}
                            style={{
                                height: 20,
                                width: 20,
                                tintColor: isDarkMode ? theme.color.white : theme.color.black
                            }}
                        />
                    </TouchableOpacity>
                ) : <View style={{ flex: 0.5 }} />}
                
                <View style={{ flex: 4, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[
                        styles.headerHeading,
                        { color: isDarkMode ? theme.color.white : theme.color.black }
                    ]}>
                        {title}
                    </Text>
                </View>
                
                {cartShow ? (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={cartPress}
                        style={[styles.backIconMain, { position: "relative" }]}>
                        <Image
                            style={{
                                height: 25,
                                width: 25,
                                tintColor: isDarkMode ? theme.color.white : theme.color.black
                            }}
                            source={require('../../assets/images/cart.png')}
                        />
                        <View style={styles.cartCircle}>
                            <Text style={{ fontSize: 8, color: "#FFF" }}>
                                {cartCounter}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ) : <View style={{ flex: 0.5 }} />}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    backIconMain: {
        alignItems: "center",
        justifyContent: "center",
    },
    headerMain: {
        shadowRadius: 4.65,
        shadowColor: "#000",
        shadowOpacity: 0.27,
        paddingHorizontal: 24,
        shadowOffset: { width: 0, height: 3 },
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        height: 50,
        padding: 15
    },
    headerHeading: {
        fontSize: 14,
        textAlign: "center",
        textTransform: "capitalize",
        fontWeight: "900"
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
});

export default Header;
