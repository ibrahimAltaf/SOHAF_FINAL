import React, {useEffect, useState} from "react";
import {StyleSheet, View, Platform, KeyboardAvoidingView} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {ToastMessage, helpers} from "../utils/helpers";
import {useNavigation} from '@react-navigation/native';
import {SetUserLocation} from "../Redux/actions/actions";
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Header from "../component/Header/header";
import CustomButton from "../component/Buttons/customButton";
import CustomStatusBar from "../component/StatusBar/customStatusBar";

const SelectLocation = (props) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const {routeName} = props.route.params;
    const {user_location} = useSelector((state) => state.userReducer);
    const [address, setAddress] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");

    useEffect(() => {
        if (routeName==="update") {
            setAddress(user_location?.address);
            setLatitude(user_location?.latitude);
            setLongitude(user_location?.longitude);
        } else {
            setAddress("");
            setLatitude("");
            setLongitude("");
        };
    }, []);
    const setUserAddressHandle = (data, details) => {
        const formatted_address = data.description;
        const lat = details.geometry.location.lat;
        const lng = details.geometry.location.lng;
        setLatitude(lat);
        setLongitude(lng);
        setAddress(formatted_address);
        const location = {
            latitude: lat,
            longitude: lng,
            address: formatted_address,
            location_type: "Current Address",
        };
        dispatch(SetUserLocation(location));
    };
    const confirmLocationHandle = () => {
        if (latitude===""||longitude===""||address==="") {
            ToastMessage("Please Enter your Locatoin");
        } else {
            if (routeName==="update") {
                navigation.navigate("CheckOut");
            } else {
                navigation.navigate("SelectDateTime");
            };
        };
    };

    return (
        <KeyboardAvoidingView style={styles.container}
            behavior={Platform.OS==="ios"?"padding":null}>
            <CustomStatusBar
                barStyle={"light-content"}
                backgroundColor={"#044F86"}
            />
            <Header
                backArrow={true}
                title={"Set Location"}
                backPage={() => navigation.goBack()}
            />
            <View style={{flex:1}}>
                <GooglePlacesAutocomplete
                    value={address}
                    autoFocus={true}
                    fetchDetails={true}
                    returnKeyType={'default'}
                    placeholder={'Enter Location'}
                    placeholderTextColor={"#A8A8A8"}
                    onPress={(data, details = null) => {
                        setUserAddressHandle(data, details);
                    }}
                    query={{
                        language: 'en',
                        key: helpers.api.mapKey,
                    }}
                    styles={{
                        container: {
                            zIndex: 1,
                            width: '100%',
                            alignSelf: "center",
                            position: 'absolute',
                        },
                        textInputContainer: {
                            height: 60,
                            width: '95%',
                            elevation: 5,
                            marginVertical: 10,
                            alignSelf: "center",
                        },
                        textInput: {
                            height: 40,
                            padding: 0,
                            fontSize: 16,
                            borderWidth: 1,
                            color: "#333333",
                            borderColor: "#C4C4C4",
                        },
                    }}
                />
            </View>
            <CustomButton
                activeOpacity={.7}
                title={"Confirm Location"}
                onPress={confirmLocationHandle}
            />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default SelectLocation;
