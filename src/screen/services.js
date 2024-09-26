import React, {useEffect, useState, useRef} from "react";
import {StyleSheet, Image, View, Text, SafeAreaView, FlatList, TouchableOpacity, TextInput, Modal} from "react-native";
import {theme} from "../constants/styles";
import {helpers} from "../utils/helpers";
import {FontFamily} from "../constants/fonts";
import {SetCartData} from "../Redux/actions/actions";
import {useDispatch, useSelector} from "react-redux";
import {useNavigation} from '@react-navigation/native';
import Header from "../component/Header/header";
import Loader from "../component/Loader/loader";
import RBSheet from "react-native-raw-bottom-sheet";
import CustomButton from "../component/Buttons/customButton";
import NoDataFound from "../component/NoDataFound/noDataFound";
import CustomStatusBar from "../component/StatusBar/customStatusBar";

const Services = (props) => {
    const refRBSheet = useRef();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const {serviceId, categoryId} = props.route.params;
    const { cart_data } = useSelector(state => state.userReducer);
    const [loader, setLoader] = useState(true);
    const [cartValue, setCartValue] = useState(0);
    const [cartLoader, setCartLoader] = useState(false);
    const [servicesList, setServicesList] = useState([]);
    const [servicesObject, setServicesObject] = useState({});
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        getServicesHandle();
    }, []);
    const getServicesHandle = () => {
        try {
            setLoader(true);
            setServicesList([
                { id: '1', name: 'Service 1', min_price: '10', thumbnail: 'https://via.placeholder.com/150' },
                { id: '2', name: 'Service 2', min_price: '20', thumbnail: 'https://via.placeholder.com/150' },
                { id: '3', name: 'Service 3', min_price: '30', thumbnail: 'https://via.placeholder.com/150' },
                { id: '4', name: 'Service 4', min_price: '40', thumbnail: 'https://via.placeholder.com/150' },
                { id: '5', name: 'Service 5', min_price: '50', thumbnail: 'https://via.placeholder.com/150' },
                { id: '6', name: 'Service 6', min_price: '60', thumbnail: 'https://via.placeholder.com/150' },
                { id: '7', name: 'Service 7', min_price: '70', thumbnail: 'https://via.placeholder.com/150' },
                { id: '8', name: 'Service 8', min_price: '80', thumbnail: 'https://via.placeholder.com/150' },
                { id: '9', name: 'Service 9', min_price: '90', thumbnail: 'https://via.placeholder.com/150' },
                { id: '10', name: 'Service 10', min_price: '100', thumbnail: 'https://via.placeholder.com/150' },
                { id: '11', name: 'Service 11', min_price: '110', thumbnail: 'https://via.placeholder.com/150' },
                { id: '12', name: 'Service 12', min_price: '120', thumbnail: 'https://via.placeholder.com/150' },
            ]);
            setLoader(false);
        } catch (error) {
            setLoader(false);
            console.log(error?.message);
        };
    };
    const addCartHandle = (services_object) => {
        try {
            dispatch(SetCartData(services_object, cartValue));
            refRBSheet.current.close();
            setCartValue(0);
        } catch (error) {
            setCartLoader(false);
            console.log(error?.message);
        };
    };
    const openCartSheet = (value) => {
        if (cart_data?.length !== 0) {
            if (cart_data[0]?.categoryId === categoryId) {
                setServicesObject(value);
                setTimeout(() => {
                    refRBSheet.current.open();
                }, 500);
            } else {
                setModalVisible(true);
            };
        } else {
            setServicesObject(value);
            setTimeout(() => {
                refRBSheet.current.open();
            }, 500);
        };
    };
    const removeHandle = () => {
        dispatch(SetCartData([]));
        setModalVisible(false);
    };
    const renderItem = ({item, index}) => {
        const even = index%2==0;
        return (
            <TouchableOpacity
                key={index}
                activeOpacity={.7}
                onPress={() => navigation.navigate("ServiceDetail")}
                style={[styles.cardStyle,{marginRight:12,marginLeft:even?12:0}]}>
                <Image
                    source={{uri:item?.thumbnail}}
                    style={{height:140,width:"100%",resizeMode:"contain",borderRadius:12}}
                />
                <Text style={styles.headingStyle}>
                    {item?.name}
                </Text>
                <Text style={styles.detailStyle}>
                    Starts from
                </Text>
                <Text style={styles.priceStyle}>
                    {`${item?.min_price}${helpers.constant.currencyName}`}
                </Text>
                <TouchableOpacity
                    activeOpacity={.7}
                    onPress={() => openCartSheet(item)}
                    style={{alignItems:"flex-end",padding:6}}>
                    <Image
                        source={require('../assets/images/plus.png')}
                        style={{height:16,width:16,tintColor:theme.color.primaryColor}}
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {loader?<Loader />:null}
            <CustomStatusBar
                barStyle={"light-content"}
                backgroundColor={"#044F86"}
            />
            <Header
                cartShow={true}
                backArrow={true}
                title={"Available Service 2"}
                backPage={() => navigation.goBack()}
                cartPress={() => navigation.navigate("Cart")}
            />
            {servicesList?.length===0?
                <NoDataFound title={"No Service Found"} />
            :
                <FlatList
                    numColumns={2}
                    data={servicesList}
                    renderItem={renderItem}
                    keyExtractor={item => item?.id}
                    contentContainerStyle={styles.flatListContainer}
                />
            }
            <RBSheet
                height={400}
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                    container: styles.bottomSheetStyle,
                    wrapper: styles.bottomSheetOverlay,
                    draggableIcon: styles.bottomSheetIcon,
                }}>
                <View style={{alignItems:"center",marginTop:12,position:"relative"}}>
                    <View style={styles.thumbnailStyle}>
                        <Image
                            source={{uri:servicesObject?.thumbnail}}
                            style={{height:"100%",width:"100%",resizeMode:"contain",borderRadius:12}}
                        />
                    </View>
                    <View style={{position:"absolute",top:0,right:20}}>
                        <TouchableOpacity
                            activeOpacity={.7}
                            style={styles.closeCircle}
                            onPress={() => {
                                setCartValue(0);
                                refRBSheet.current.close();
                            }}>
                            <Image
                                source={require('../assets/images/close.png')}
                                style={{height:16,width:16,resizeMode:"contain",tintColor:"#CCC"}}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{marginTop:6}}>
                    <Text style={styles.headingStyle}>
                        {servicesObject?.name}
                    </Text>
                </View>
                <View style={styles.cartBoxStyle}>
                    <View style={{flex:1,justifyContent:"center"}}>
                        <Text style={styles.priceStyle}>
                            {`${helpers.constant.currencyName} ${servicesObject?.min_price}`}
                        </Text>
                    </View>
                    <View style={{justifyContent:"center"}}>
                        <View style={{flexDirection:"row"}}>
                            <View style={{justifyContent:'center'}}>
                                <TouchableOpacity
                                    activeOpacity={.7}
                                    style={styles.buttonMain}
                                    onPress={() => {
                                        if (cartValue!==0) {
                                            setCartValue(cartValue => cartValue - 1);
                                        };
                                    }}>
                                    <Image
                                        source={require('../assets/images/minus.png')}
                                        style={{height:16,width:16,tintColor:theme.color.white,resizeMode:"cover"}}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{justifyContent:'center',paddingHorizontal:6}}>
                                <TextInput
                                    editable={false}
                                    style={styles.inputStyle}
                                    onChangeText={setCartValue}
                                    value={cartValue.toString()}
                                />
                            </View>
                            <View style={{justifyContent:'center'}}>
                                <TouchableOpacity
                                    activeOpacity={.7}
                                    style={styles.buttonMain}
                                    onPress={() => setCartValue(cartValue => cartValue + 1)}>
                                    <Image
                                        source={require('../assets/images/plus.png')}
                                        style={{height:16,width:16,tintColor:theme.color.white,resizeMode:"cover"}}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.cartBoxStyle}>
                    <CustomButton
                        loader={cartLoader}
                        title={"Add to cart"}
                        ButtonPress={() => {
                            if (cartValue===0) {
                                helpers.toastMessage("Please enter quantity", "error");
                                return;
                            };
                            setCartLoader(true);
                            addCartHandle(servicesObject);
                        }}
                    />
                </View>
            </RBSheet>
            <Modal
                transparent={true}
                animationType={"slide"}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>
                            Remove the previous services?
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton,{backgroundColor:theme.color.primaryColor}]}
                                onPress={removeHandle}>
                                <Text style={styles.modalButtonText}>
                                    Yes
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton,{backgroundColor:"#CCC"}]}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.modalButtonText}>
                                    No
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.color.background,
    },
    flatListContainer: {
        paddingVertical: 10,
    },
    cardStyle: {
        flex: 1,
        padding: 10,
        borderRadius: 12,
        marginBottom: 12,
        backgroundColor: theme.color.white,
    },
    headingStyle: {
        fontSize: 16,
        fontWeight:"900",
        color: theme.color.black,
        fontFamily: FontFamily.boldFont,
    },
    detailStyle: {
        fontSize: 14,
        color: theme.color.secondaryText,
        fontFamily: FontFamily.mediumFont,
    },
    priceStyle: {
        fontSize: 16,
        fontFamily: FontFamily.bold,
        color: theme.color.primaryColor,
    },
    bottomSheetStyle: {
        paddingHorizontal: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    bottomSheetOverlay: {
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    bottomSheetIcon: {
        backgroundColor: "#CCC",
        width: 50,
    },
    thumbnailStyle: {
        width: 140,
        height: 140,
        borderRadius: 12,
        backgroundColor: theme.color.lightGray,
    },
    closeCircle: {
        width: 30,
        height: 30,
        elevation: 5,
        shadowRadius: 4,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        alignItems: "center",
        justifyContent: "center",
        shadowOffset: {width:0,height:2},
        backgroundColor: theme.color.white,
    },
    cartBoxStyle: {
        paddingVertical: 20,
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: 10,
        justifyContent: "space-between",
    },
    buttonMain: {
        padding: 8,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.color.primaryColor,
    },
    inputStyle: {
        width: 40,
        fontSize: 16,
        textAlign: "center",
        borderBottomWidth: 1,
        color: theme.color.primaryText,
        borderBottomColor: theme.color.lightGray,
    },
    centeredView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
        margin: 20,
        padding: 35,
        elevation: 5,
        shadowRadius: 4,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        alignItems: "center",
        shadowOffset: {width:0,height:2},
        backgroundColor: theme.color.white,
    },
    modalButtons: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    modalButton: {
        padding: 10,
        elevation: 2,
        borderRadius: 10,
        marginHorizontal: 10,
    },
    modalButtonText: {
        fontWeight: "bold",
        textAlign: "center",
        color: theme.color.white,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 15,
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default Services;
