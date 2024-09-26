import React, {useState, useRef, useEffect} from "react";
import {StyleSheet, View, Image, Text, ScrollView, TouchableOpacity, Modal, Button, TextInput, Switch, FlatList, Dimensions} from "react-native";
import {theme} from "../constants/styles";
import {Colors, Fonts} from "../utils/IMAGES";
import {FontFamily} from "../constants/fonts";
import {useDispatch, useSelector} from "react-redux";
import {useNavigation} from "@react-navigation/native";
import {SetOrderDetail} from "../Redux/actions/actions";
import {ToastMessage, helpers} from "../utils/helpers";
import {launchImageLibrary, launchCamera} from "react-native-image-picker";
import moment from "moment";
import Loader from "../component/Loader/loader";
import Header from "../component/Header/header";
import RBSheet from "react-native-raw-bottom-sheet";
import StepIndicator from "react-native-step-indicator";
import CustomButton from "../component/Buttons/customButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomStatusBar from "../component/StatusBar/customStatusBar";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const labels = ["Booking Details", "Payment", "Completed"];
const customStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 40,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: "#fe7013",
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: "#fe7013",
  stepStrokeUnFinishedColor: "#aaaaaa",
  separatorFinishedColor: "#fe7013",
  separatorUnFinishedColor: "#fe7013",
  stepIndicatorFinishedColor: "#fe7013",
  stepIndicatorUnFinishedColor: "#ffffff",
  stepIndicatorCurrentColor: "#ffffff",
  stepIndicatorLabelFontSize: 15,
  currentStepIndicatorLabelFontSize: 15,
  stepIndicatorLabelCurrentColor: "#fe7013",
  stepIndicatorLabelFinishedColor: "#ffffff",
  stepIndicatorLabelUnFinishedColor: "#aaaaaa",
  labelColor: "#999999",
  labelSize: 13,
  currentStepLabelColor: "#fe7013",
};

const {height} = Dimensions.get('window');
const CustomBackdrop = () => <View style={styles.backdrop}></View>;

const CheckOut = () => {
  const {user_location, order_detail} = useSelector((state) => state.userReducer);
  const refRBSheet = useRef();
  const imageRBSheet = useRef();
  const dispatch = useDispatch();
  const debitsheet = useRef(null);
  const refCouponRBSheet = useRef();
  const refPaymentRBSheet = useRef();
  const navigation = useNavigation();
  const descriptionRef = useRef(null);
  const refCardDetailsRBSheet = useRef();
  const [count, setCount] = useState(0);
  const [loader, setLoader] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [saveInfo, setSaveInfo] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [imageValue, setImageValue] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [currentStep, setCurrentStep] = useState(2);
  const [activeCoupon, setActiveCoupon] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [orderDetail, setOrderDetail] = useState(order_detail);
  const [userLocation, setUserLocation] = useState(user_location);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [cardModalVisible, setCardModalVisible] = useState(false);
  const [openDateTimeModal, setOpenDateTimeModal] = useState(false);
  const [descriptionEnable, setDescriptionEnable] = useState(false);
  const [serviceDateTime, setServiceDateTime] = useState(new Date());
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0);
  const [description, setDescription] = useState(orderDetail?.formData?.description);
  const [imagesArray, setImagesArray] = useState(orderDetail?.formData?.imagesArray);
  const [newCard, setNewCard] = useState({bank:"", cardNumber:"", expiry:"", cardHolder:""});
  const [debitCards, setDebitCards] = useState([
    {
      id: 1,
      bank: "Bank A",
      cardNumber: "**** **** **** 8901",
      expiry: "12/24",
      cardHolder: "John Doe",
    },
    {
      id: 2,
      bank: "Bank B",
      cardNumber: "**** **** **** 1112",
      expiry: "11/25",
      cardHolder: "Jane Smith",
    },
    {
      id: 3,
      bank: "Bank C",
      cardNumber: "**** **** **** 5553",
      expiry: "10/23",
      cardHolder: "Alice Johnson",
    },
  ]);

  useEffect(() => {
    getCouponHandle();
    setImagesArray(orderDetail?.formData?.imagesArray);
  }, []);
  useEffect(() => {
    if (imagesArray?.length==0) {
      const placeholderImages = [
        {
          id: 1,
          type: 'jpg',
          name: `img-placeholder.jpg`,
          uri: require('../assets/images/placeholder.webp'),
        },
        {
          id: 2,
          type: 'jpg',
          name: `img-placeholder.jpg`,
          uri: require('../assets/images/placeholder.webp'),
        },
      ];
      setImagesArray(placeholderImages);
    };
  }, [imagesArray]);
  useEffect(() => {
    setOrderDetail(order_detail);
  }, [order_detail]);
  useEffect(() => {
    setUserLocation(user_location);
  }, [user_location]);
  const getCouponHandle = () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch(`${helpers.api.baseUrl}get_coupon`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setActiveCoupon(result?.coupons || []);
      }).catch((error) => {
        ToastMessage("Failed to fetch coupons. Please try again.");
      });
    } catch (error) {
      ToastMessage("An error occurred while fetching coupons.");
    };
  };
  const applyCouponHandle = (promo_code) => {
    try {
      setLoader(true);
      refCouponRBSheet.current.close();
      const myHeaders = new Headers();
      myHeaders.append("X-Requested-With", "XMLHttpRequest");

      const formdata = new FormData();
      formdata.append("promo_code", promo_code);
      formdata.append("total_amount", orderDetail?.formData?.services?.total_price?.toString());

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };

      fetch(`${helpers.api.baseUrl}apply-coupon`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setLoader(false);
        if (result?.discount_amount!==undefined) {
          setCouponCode(promo_code);
          setCouponDiscountAmount(result?.discount_amount);
          ToastMessage(result?.msg);
        } else {
          ToastMessage(result?.msg||"Failed to apply coupon.");
        };
      }).catch((error) => {
        setLoader(false);
        ToastMessage("An error occurred. Please try again.");
      });
    } catch (error) {
      setLoader(false);
      ToastMessage("An error occurred. Please try again.");
    };
  };
  const cardRemoveHandle = (id) => {
    setDebitCards(debitCards.filter((val) => val?.id !== id));
    setSelectedCard(null);
  };
  const addCardHandle = () => {
    setCardModalVisible(false);
    setDebitCards([...debitCards, {...newCard, id:debitCards?.length+1}]);
    setNewCard({bank: "", cardNumber: "", expiry: "", cardHolder: ""});
  };
  const handleConfirm = (date) => {
    setOpenDateTimeModal(false);
    setServiceDateTime(date);
  };
  const PostNewJob = async () => {
    try {
      const access_token = await AsyncStorage.getItem("access_token");
      if (!orderDetail?.formData || !orderDetail?.serviceId || !orderDetail?.categoryId) {
        console.error("Required parameters are undefined!");
        return;
      };

      if (!access_token) {
        navigation.replace("Login", {
          routeName: "CheckOut",
        });
      } else {
        setButtonLoader(true);
        const myHeaders = new Headers();
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        let services_array = [];
        if (orderDetail?.formData?.options?.length > 0) {
          services_array = orderDetail?.formData?.options?.map((item) => item.options).flat();
        };
        let images_array = [];
        if (orderDetail?.formData?.imagesArray?.length > 0) {
          images_array = orderDetail?.formData?.imagesArray;
        };

        const formDataToSend = new FormData();
        formDataToSend.append("payment_mode", "CASH");
        formDataToSend.append("service_id", orderDetail?.serviceId);
        formDataToSend.append("location", userLocation?.address);
        formDataToSend.append("description", orderDetail?.formData?.description);
        formDataToSend.append("location_lat", userLocation?.latitude);
        formDataToSend.append("location_long", userLocation?.longitude);
        formDataToSend.append("current_latitude", userLocation?.latitude);
        formDataToSend.append("estimated_fare", orderDetail?.formData?.services?.total);
        formDataToSend.append("current_longitude", userLocation?.longitude);
        formDataToSend.append("scheduled_at", moment(orderDetail?.selectedDateTime).format("YYYY-MM-DD HH:mm:ss"));
        services_array?.forEach((val) => {
          formDataToSend.append("services[]", val);
        });
        images_array?.forEach((image) => {
          if (image?.id!==1&&image?.id!==2) {
            formDataToSend.append("user_ride_image[]", image);
          }
        });

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: formDataToSend,
          redirect: "follow",
        };

        fetch(`${helpers.api.baseUrl}send/request`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result?.message==="New request created!") {
            ToastMessage("Request submitted successfully.");
            refCardDetailsRBSheet.current.close();
            navigation.navigate("BookingSuccess");
          } else if (result?.message==="Unauthenticated.") {
            alert("Login Session Expired!");
            updateDataHandle();
            setTimeout(() => {
              navigation.navigate("Login", {
                routeName: "CheckOut",
              });
            }, 500);
          } else {
            ToastMessage(result?.message);
          };
        }).catch((error) => {
          setButtonLoader(false);
          ToastMessage(error?.message);
        });
      };
    } catch (error) {
      setButtonLoader(false);
      ToastMessage("An error occurred. Please try again.");
    };
  };
  const handlePayNow = () => {
    PostNewJob();
    refPaymentRBSheet.current.close();
    setTimeout(() => {
      navigation.navigate("BookingSuccess");
    }, 4000);
  };
  const handleImagePress = (value, index) => {
    setImageValue(value);
    setImageIndex(index);
    imageRBSheet.current.open();
  };
  const openGalleryHandle = (value, index) => {
    try {
      launchImageLibrary(
        {
          quality: 1,
          maxWidth: 300,
          maxHeight: 300,
          mediaType: "photo",
        },
        (response) => {
          if (response.didCancel) {
            console.log("User cancelled image picker");
          } else if (response.errorCode) {
            console.log("ImagePicker Error: ", response.errorMessage);
          } else if (response.assets && response.assets.length > 0) {
            const randomNumber = Math.random();
            var imageObject = {
              id: randomNumber,
              type: response?.assets[0]?.type,
              name: `img-${randomNumber}.jpg`,
              uri: Platform.OS==='ios'?response?.assets[0]?.uri.replace('file://',''):response?.assets[0]?.uri,
            };
            if (value==="add") {
              if (imagesArray?.length==2) {
                if (imagesArray[0].id===1) {
                  const updatedImages = imagesArray.map((image, i) => {
                    if (i===0) {
                      return {...image, 
                        id: imageObject?.id,
                        type: imageObject?.type,
                        name: imageObject?.name,
                        uri: imageObject?.uri,
                      };
                    };
                    return image;
                  });
                  setImagesArray(updatedImages);
                } else if (imagesArray[1].id===2) {
                  const updatedImages = imagesArray.map((image, i) => {
                    if (i===1) {
                      return {...image, 
                        id: imageObject?.id,
                        type: imageObject?.type,
                        name: imageObject?.name,
                        uri: imageObject?.uri,
                      };
                    };
                    return image;
                  });
                  setImagesArray(updatedImages);
                } else {
                  const newArray = imagesArray;
                  newArray.push(imageObject);
                  setImagesArray(newArray);
                };
              } else {
                const newArray = imagesArray;
                newArray.push(imageObject);
                setImagesArray(newArray);
              };
            } else if (value==="edit") {
              const updatedImages = imagesArray.map((image, i) => {
                if (i===index) {
                  return {...image, uri: response?.assets[0]?.uri};
                };
                return image;
              });
              setImagesArray(updatedImages);
            };
            const a = count+1;
            setCount(a);
            imageRBSheet.current.close();
          };
        }
      );
    } catch (error) {
      ToastMessage(error?.message);
    };
  };
  const openCameraHandle = (value, index) => {
    try {
      launchCamera(
        {
          quality: 1,
          maxWidth: 300,
          maxHeight: 300,
          mediaType: "photo",
        },
        (response) => {
          console.log("Camera response:", response);
          if (response.didCancel) {
            console.log("User cancelled camera picker");
          } else if (response.errorCode) {
            console.log("CameraPicker Error: ", response.errorMessage);
          } else if (response.assets&&response.assets.length>0) {
            const randomNumber = Math.random();
            const imageObject = {
              id: randomNumber,
              type: response.assets[0].type,
              name: `img-${randomNumber}.jpg`,
              uri: Platform.OS==='ios'?response.assets[0].uri.replace('file://',''):response.assets[0].uri,
            };
            if (value==="add") {
              if (imagesArray?.length===2) {
                if (imagesArray[0]?.id===1) {
                  const updatedImages = imagesArray.map((image, i) => {
                    if (i===0) {
                      return {...image, ...imageObject};
                    };
                    return image;
                  });
                  setImagesArray(updatedImages);
                } else if (imagesArray[1].id===2) {
                  const updatedImages = imagesArray?.map((image, i) => {
                    if (i===1) {
                      return {...image, ...imageObject};
                    };
                    return image;
                  });
                  setImagesArray(updatedImages);
                } else {
                  setImagesArray([...imagesArray, imageObject]);
                };
              } else {
                setImagesArray([...imagesArray, imageObject]);
              };
            } else if (value==="edit") {
              const updatedImages = imagesArray.map((image, i) => {
                if (i===index) {
                  return {...image, uri:response?.assets[0]?.uri};
                };
                return image;
              });
              setImagesArray(updatedImages);
            };
            setCount(count+1);
            imageRBSheet.current.close();
          };
        }
      );
    } catch (error) {
      ToastMessage(error.message);
    };
  };
  const removeImageHandle = (index) => {
    const updatedImages = imagesArray.filter((_, i) => i !== index);
    setImagesArray(updatedImages);
  };
  const updateDataHandle = () => {
    const updatedData = {...order_detail, formData: {...order_detail?.formData, description: description, imagesArray: imagesArray}};
    dispatch(SetOrderDetail(updatedData));
  };
  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={.7}
        onPress={() => {
          if (imagesArray[index]?.id===1) {
            handleImagePress("add", 0);
          } else if (imagesArray[index]?.id===2) {
            handleImagePress("add", 0);
          };
        }}
        style={{flexDirection:"row",position:"relative",
        justifyContent:"center",width:"49%",marginRight:6,marginTop:10}}>
        {item?.id===1||item?.id===2?
          <>
            <Image
              source={item?.uri}
              style={styles.imageStyle}
            />
            <View style={{position:"absolute",bottom:12,right:12}}>
              <Image
                source={require('../assets/images/plus-circle.png')}
                style={{height:26,width:26,resizeMode:"cover",tintColor:Colors.Primary}}
              />
            </View>
          </>
        :
          <Image
            source={{uri:item?.uri}}
            style={styles.imageStyle}
          />
        }
        {item?.id===1||item?.id===2?null:
          <>
            <TouchableOpacity
              activeOpacity={.7}
              style={{position:"absolute",bottom:8,right:8}}
              onPress={() => handleImagePress("edit", index)}>
              <Image
                style={{height:30,width:30,resizeMode:"cover"}}
                source={require('../assets/images/pen-circle.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={.7}
              onPress={() => removeImageHandle(index)}
              style={{position:"absolute",bottom:8,right:42}}>
              <Image
                style={{height:30,width:30,resizeMode:"cover"}}
                source={require('../assets/images/trash-circle.png')}
              />
            </TouchableOpacity>
          </>
        }
      </TouchableOpacity>
    )
  };

  return (
    <View style={styles.container}>
      {loader?<Loader />:null}
      <CustomStatusBar
        barStyle={"light-content"}
        backgroundColor={"#044F86"}
      />
      <Header
        backArrow={true}
        title={"Checkout"}
        backPage={() => navigation.goBack()}
      />
      <ScrollView style={{paddingHorizontal:20}}>
        <View style={{paddingVertical:10}}>
          <Text style={styles.headingStyle}>
            Service Schedule
          </Text>
        </View>
        <View style={styles.boxStyle}>
          <View style={{flexDirection:"row"}}>
            <View style={{justifyContent:"center"}}>
              <Text style={{fontSize:22,color:theme.color.primaryColor,fontWeight:"bold"}}>
                {moment(orderDetail?.selectedDateTime).format("Do")}
              </Text>
              <Text style={{fontSize:16,color:theme.color.primaryColor}}>
                {moment(orderDetail?.selectedDateTime).format("MMM, YYYY")}
              </Text>
            </View>
            <View style={{flex:1,borderLeftColor:theme.color.primaryColor,
            borderLeftWidth:1,paddingLeft:14,marginLeft:14,justifyContent:"center"}}>
              <Text style={{fontSize:14,color:"#000",fontWeight:"bold"}}>
                {moment(orderDetail?.selectedDateTime).format("dddd")}
              </Text>
              <Text style={{fontSize:12,color:"#000",marginTop:4}}>
                {moment(orderDetail?.selectedDateTime).format("h:mm a")}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{justifyContent:"center"}}
              onPress={() => {
                updateDataHandle();
                setTimeout(() => {
                  navigation.navigate("SelectDateTime");
                }, 500);
              }}>
              <Image
                source={theme.images.editIcon}
                style={{height:22,width:22,tintColor:theme.color.primaryColor}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{paddingVertical:10,marginTop:8}}>
          <Text style={styles.headingStyle}>
            Service Address
          </Text>
        </View>
        <View style={styles.boxStyle}>
          <View style={{flexDirection:"row"}}>
            <View style={{flex:1,justifyContent:"center"}}>
              <Text style={{fontSize:14,color:theme.color.textColor,fontWeight:"bold"}}>
                {userLocation?.address}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{justifyContent:"center"}}
              onPress={() => {
                updateDataHandle();
                setTimeout(() => {
                  navigation.navigate("SelectLocation",{
                    routeName: "update",
                  });
                }, 500);
              }}>
              <Image
                source={theme.images.editIcon}
                style={{height:22,width:22,tintColor:theme.color.primaryColor}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{paddingTop:20,paddingBottom:10}}>
          <Text style={styles.headingStyle}>
            Cart Summary
          </Text>
        </View>
        <View style={[styles.boxStyle,{marginBottom:20}]}>
          {orderDetail?.formData?.services?.calculator==="HOUR"?
            <View style={{borderBottomWidth:1,paddingBottom:12,borderBottomColor:"#CCC"}}>
              <View style={{flexDirection:"row"}}>
                <View style={{flex:1,flexDirection:"row",gap:10}}>
                  <View>
                    <Text style={{color:theme.color.black,fontWeight:"800",fontSize:14,paddingRight:12}}>
                      {orderDetail?.formData?.services?.name}
                    </Text>
                    <Text style={{color: theme.color.black,fontSize:13,marginTop:4}}>
                      Minimum {orderDetail?.formData?.services?.minimum_charges} hour Charges
                    </Text>
                  </View>
                  {/* <View style={{}}>
                    <Text style={{color:theme.color.black,fontWeight:"700",fontSize:15}}>
                      x {orderDetail?.formData?.services?.minimum_charges}   {`${helpers.constant.currencyName} ${orderDetail?.formData?.services?.price}`}
                    </Text>
                  </View> */}
                  <View style={{flex:1,alignItems:"flex-end"}}>
                    <Text style={{color:theme.color.black,fontWeight:"700",fontSize:15}}>
                      {`${helpers.constant.currencyName} ${orderDetail?.formData?.services?.total_price*orderDetail?.formData?.services?.minimum_charges}`}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          :
            <View style={{borderBottomWidth:1,paddingBottom:12,borderBottomColor:"#CCC"}}>
              <View style={{flexDirection:"row"}}>
                <View style={{flex:1,justifyContent:"center"}}>
                  <Text style={{color:theme.color.black,fontWeight:"800",fontSize:14,paddingRight:12}}>
                    {orderDetail?.formData?.services?.name}
                  </Text>
                </View>
                <View style={{justifyContent:"center"}}>
                  <Text style={{color:theme.color.black,fontWeight:"700",fontSize:15}}>
                    {`${helpers.constant.currencyName} ${orderDetail?.formData?.services?.price}`}
                  </Text>
                </View>
              </View>
            </View>
          }
          {orderDetail?.formData?.services?.calculator==="HOUR"?
            <>
              <View style={{flexDirection:"row",marginTop:8}}>
                <View style={{flex:1,justifyContent:"center"}}>
                  <Text style={[styles.mainTextStyle,{fontWeight:"bold"}]}>
                    Sub Total
                  </Text>
                </View>
                <View style={{flex:1,alignItems:"flex-end",justifyContent:"center"}}>
                  <Text style={[styles.mainTextStyle,{fontWeight:"bold"}]}>
                    (+) {`${helpers.constant.currencyName} ${orderDetail?.formData?.services?.total_price*orderDetail?.formData?.services?.minimum_charges}`}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection:"row",marginTop:4}}>
                <View style={{flex:1,justifyContent:"center"}}>
                  <Text style={[styles.mainTextStyle,{fontWeight:"bold"}]}>
                    Unit Price
                  </Text>
                </View>
                <View style={{flex:1,alignItems:"flex-end",justifyContent:"center"}}>
                  <Text style={[styles.mainTextStyle,{fontWeight:"bold"}]}>
                    {orderDetail?.formData?.services?.price}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection:"row",marginTop:4}}>
                <View style={{flex:1,justifyContent:"center"}}>
                  <Text style={[styles.mainTextStyle,{fontWeight:"bold"}]}>
                    Unit
                  </Text>
                </View>
                <View style={{flex:1,alignItems:"flex-end",justifyContent:"center"}}>
                  <Text style={[styles.mainTextStyle,{fontWeight:"bold"}]}>
                    {orderDetail?.formData?.services?.calculator}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection:"row",marginTop:4}}>
                <View style={{flex:1,justifyContent:"center"}}>
                  <Text style={[styles.mainTextStyle,{fontWeight:"bold"}]}>
                    Coupon Discount{" "}
                    {couponCode!==""&&
                      <Text style={{color:"green",textTransform:"uppercase"}}>
                        ({couponCode})
                      </Text>
                    }
                  </Text>
                </View>
                <View style={{flex:1,alignItems:"flex-end",justifyContent:"center"}}>
                  <Text style={[styles.mainTextStyle,{fontWeight:"bold"}]}>
                    (-) {`${helpers.constant.currencyName} ${couponDiscountAmount}`}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection:"row",marginTop:4}}>
                <View style={{flex:1,justifyContent:"center"}}>
                  <Text style={[styles.mainTextStyle,{fontWeight:"bold"}]}>
                    Service Fees
                  </Text>
                </View>
                <View style={{flex:1,alignItems:"flex-end",justifyContent:"center"}}>
                  <Text style={[styles.mainTextStyle,{fontWeight:"bold"}]}>
                    (+) {helpers.constant.currencyName} {(parseFloat(orderDetail?.formData?.services?.tax)*parseFloat(orderDetail?.formData?.services?.minimum_charges)).toFixed(2)}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection:"row",marginTop:4}}>
                <View style={{flex:1,justifyContent:"center"}}>
                  <Text style={[styles.mainTextStyle,{fontWeight:"bold"}]}>
                    Wallet Deduction
                  </Text>
                </View>
                <View style={{flex:1,alignItems:"flex-end",justifyContent:"center"}}>
                  <Text style={[styles.mainTextStyle,{fontWeight:"bold"}]}>
                    (+) {helpers.constant.currencyName} 0
                  </Text>
                </View>
              </View>
            </>
          :
            <>
              <View style={{flexDirection:"row",marginTop:8}}>
                <View style={{flex:1,justifyContent:"center"}}>
                  <Text style={[styles.mainTextStyle,{fontWeight:"bold"}]}>
                    Sub Total
                  </Text>
                </View>
                <View style={{flex:1,alignItems:"flex-end",justifyContent:"center"}}>
                  <Text style={[styles.mainTextStyle,{fontWeight:"bold"}]}>
                    (+) {`${helpers.constant.currencyName} ${orderDetail?.formData?.services?.total_price}`}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection:"row",marginTop:4}}>
                <View style={{flex:1,justifyContent:"center"}}>
                  <Text style={[styles.mainTextStyle,{fontWeight:"bold"}]}>
                    Unit Price
                  </Text>
                </View>
                <View style={{flex:1,alignItems:"flex-end",justifyContent:"center"}}>
                  <Text style={[styles.mainTextStyle,{fontWeight:"bold"}]}>
                    {orderDetail?.formData?.services?.price}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection:"row",marginTop:4}}>
                <View style={{flex:1,justifyContent:"center"}}>
                  <Text style={[styles.mainTextStyle,{fontWeight:"bold"}]}>
                    Unit
                  </Text>
                </View>
                <View style={{flex:1,alignItems:"flex-end",justifyContent:"center"}}>
                  <Text style={[styles.mainTextStyle,{fontWeight:"bold"}]}>
                    {orderDetail?.formData?.services?.calculator}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection:"row",marginTop:4}}>
                <View style={{flex:1,justifyContent:"center"}}>
                  <Text style={[styles.mainTextStyle,{fontWeight:"bold"}]}>
                    Coupon Discount{" "}
                    {couponCode!==""&&
                      <Text style={{color:"green",textTransform:"uppercase"}}>
                        ({couponCode})
                      </Text>
                    }
                  </Text>
                </View>
                <View style={{flex:1,alignItems:"flex-end",justifyContent:"center"}}>
                  <Text style={[styles.mainTextStyle,{fontWeight:"bold"}]}>
                    (-) {`${helpers.constant.currencyName} ${couponDiscountAmount}`}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection:"row",marginTop:4}}>
                <View style={{flex:1,justifyContent:"center"}}>
                  <Text style={[styles.mainTextStyle,{fontWeight:"bold"}]}>
                    Service Fees
                  </Text>
                </View>
                <View style={{flex:1,alignItems:"flex-end",justifyContent:"center"}}>
                  <Text style={[styles.mainTextStyle,{fontWeight:"bold"}]}>
                    (+) {helpers.constant.currencyName} {(parseFloat(orderDetail?.formData?.services?.tax)).toFixed(2)}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection:"row",marginTop:4}}>
                <View style={{flex:1,justifyContent:"center"}}>
                  <Text style={[styles.mainTextStyle,{fontWeight:"bold"}]}>
                    Wallet Deduction
                  </Text>
                </View>
                <View style={{flex:1,alignItems:"flex-end",justifyContent:"center"}}>
                  <Text style={[styles.mainTextStyle,{fontWeight:"bold"}]}>
                    (+) {helpers.constant.currencyName} 0
                  </Text>
                </View>
              </View>
            </>
          }
        </View>
        <View style={{paddingTop:20,paddingBottom:10}}>
          <Text style={styles.headingStyle}>
            Booking Summary
          </Text>
        </View>
        <View style={styles.boxStyle}>
        <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: 2,
                backgroundColor:"#f2f7fa",
                height:40,
              }}>
              <View style={{ justifyContent: "center" }}>
                <Text
                  style={{
                    fontWeight:"bold",
                    color: "#000",
                    fontSize: 14,
                    fontWeight: "700",
                  }}
                >
                  Service Info
                </Text>
              </View>
              <View style={{ justifyContent: "center" }}>
                <Text
                  style={{
                    fontWeight:"bold",
                    color: "#000",
                    fontSize: 14,
                    fontWeight: "700",
                  }}
                >
                  Price
                </Text>
              </View>
            </View>
          <View style={{flexDirection:"row"}}>
            <View style={{flex:1,justifyContent:"center"}}>
              <Text style={[styles.mainTextStyle,{fontSize:14,fontWeight:"bold"}]}>
                {orderDetail?.formData?.services?.name}
              </Text>
            </View>
            <View style={{justifyContent:"center"}}>
              <Text style={[styles.mainTextStyle,{fontSize:14,fontWeight:"bold"}]}>
                {`${helpers.constant.currencyName} ${orderDetail?.formData?.services?.price}`}
              </Text>
            </View>
          </View>
          <View style={{flexDirection:"row",marginTop:20,marginBottom:8}}>
            <View style={{flex:1,justifyContent:"center"}}>
              <Text style={styles.headingStyle}>
                Job Details
              </Text>
            </View>
            <View style={{justifyContent:"center"}}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.editIconContainer}
                onPress={() => {
                  updateDataHandle();
                  setTimeout(() => {
                    navigation.navigate("EditServiceDetail",{
                      serviceId: order_detail?.serviceId,
                      categoryId: order_detail?.categoryId,
                      subCategoryDetail: order_detail?.subCategoryDetail,
                    });
                  }, 500);
                }}>
                <Image
                  source={theme.images.editIcon}
                  style={{height:22,width:22,tintColor:theme.color.primaryColor}}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.section}>
              {orderDetail?.formData?.options.map((option) =>
                option.options.map((item, index) => (
                  <View key={index} style={styles.optionRow}>
                    <Image
                      style={styles.optionIcon}
                      source={require("../assets/images/checkIcon01.png")}
                    />
                    <Text style={{fontSize:14,color:"#000"}}>
                      {item}
                    </Text>
                  </View>
                ))
              )}
            </View>
            <View style={{flexDirection:"row",marginTop:20}}>
              <View style={{flex:1,justifyContent:"center"}}>
                <Text style={styles.headingStyle}>
                  Job Images
                </Text>
              </View>
            </View>
            <FlatList
              numColumns={2}
              data={imagesArray}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity
              activeOpacity={.7}
              onPress={() => handleImagePress("add", 0)}
              style={{flexDirection:"row",paddingVertical:12}}>
              <View style={{justifyContent:"center",marginRight:8}}>
                <Image
                  source={require('../assets/images/plus-circle.png')}
                  style={{height:20,width:20,resizeMode:"cover",tintColor:Colors.Primary}}
                />
              </View>
              <View style={{flex:1,justifyContent:"center"}}>
                <Text style={{fontSize:16,color:"#000",fontFamily:Fonts.Bold}}>
                  Add Images
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.section}>
              <View style={{flexDirection:"row",marginTop:12}}>
                <View style={{flex:1,justifyContent:"center"}}>
                  <Text style={styles.headingStyle}>
                    Job Description
                  </Text>
                </View>
                <View style={{justifyContent:"center"}}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setDescriptionEnable(true)}>
                    <Image
                      source={theme.images.editIcon}
                      style={{height:22,width:22,tintColor:theme.color.primaryColor}}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <TextInput
                value={description}
                ref={descriptionRef}
                editable={descriptionEnable}
                style={styles.textContainer}
                onChangeText={setDescription}
              />
            </View>
          </View>
        </View>
        
      </ScrollView>
      {orderDetail?.formData?.services?.calculator==="HOUR"?
        <View style={styles.bottomBox}>
          <Text style={styles.priceLabelStyle}>
            <Text style={[styles.mainTextStyle,{fontSize:16,fontWeight:"bold"}]}>
              {"Total Price: "}
            </Text>
            <Text style={styles.priceStyle}>
              {helpers.constant.currencyName} {(orderDetail?.formData?.services?.total_price*orderDetail?.formData?.services?.minimum_charges-
              couponDiscountAmount+orderDetail?.formData?.services?.tax*orderDetail?.formData?.services?.minimum_charges).toFixed(2)}
            </Text>
          </Text>
        </View>
      :
        <View style={styles.bottomBox}>
          <Text style={styles.priceLabelStyle}>
            <Text style={[styles.mainTextStyle,{fontSize:16,fontWeight:"bold"}]}>
              {"Total Price: "}
            </Text>
            <Text style={styles.priceStyle}>
              {`${helpers.constant.currencyName} ${(orderDetail?.formData?.services?.total).toFixed(2)}`}
            </Text>
          </Text>
        </View>
      }
      <CustomButton
        activeOpacity={0.7}
        loading={buttonLoader}
        title={"Review & Confirmation"}
        onPress={() => {
          updateDataHandle();
          setTimeout(() => {
            navigation.navigate("FinalCheckout");
          }, 500);
        }}
      />
      {/* COUPON BOTTOM SHEET */}
      <RBSheet
        height={600}
        ref={refCouponRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper:styles.bottomSheetOverlay,
          container:styles.bottomSheetStyle,
          draggableIcon:styles.bottomSheetIcon,
        }}>
        <View style={{flexDirection:"row",marginTop:12}}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveTab(1)}
            style={[styles.tabStyle,{borderBottomColor:
            activeTab===1?theme.color.primaryColor:"#CCC"}]}>
            <Text style={[styles.tabTextStyle,{color:activeTab===1?theme.color.primaryColor:"gray"}]}>
              Current Coupon
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveTab(2)}
            style={[styles.tabStyle,{borderBottomColor:
            activeTab===2?theme.color.primaryColor:"#CCC"}]}>
            <Text style={[styles.tabTextStyle,{color:activeTab===2?theme.color.primaryColor:"gray"}]}>
              Expired Coupon
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {activeTab===1?
            activeCoupon?.map((val, key) => {
              return (
                <View key={key} style={[styles.tileStyle,{marginTop:key===0?12:0}]}>
                  <View style={{justifyContent:"center"}}>
                    <Image
                      source={theme.images.couponBg}
                      style={{height:100,width:100,resizeMode:"contain",borderRadius:8}}
                    />
                  </View>
                  <View style={{flex:1,justifyContent:"center",marginLeft:12}}>
                    <Text style={styles.titleStyle}>
                      {val?.promo_code}
                    </Text>
                    <Text numberOfLines={2} style={styles.descStyle}>
                      {val?.promo_description}
                    </Text>
                    <Text style={styles.validTill}>
                      Valid Till
                    </Text>
                    <Text style={styles.validTillDate}>
                      {val?.expiration}
                    </Text>
                  </View>
                  <View style={{justifyContent:"flex-end"}}>
                    <CustomButton
                      title={"Use"}
                      activeOpacity={0.7}
                      onPress={() => applyCouponHandle(val?.promo_code)}
                      customButtonStyle={{marginHorizontal:0,borderRadius:6,
                      paddingHorizontal:20,marginTop:0,marginBottom:0,height:34}}
                    />
                  </View>
                </View>
              );
            })
          :null}
        </ScrollView>
      </RBSheet>
      {/* DATE/TIME PICKER */}
      <DateTimePickerModal
        mode={"datetime"}
        date={serviceDateTime}
        onConfirm={handleConfirm}
        isVisible={openDateTimeModal}
        backdropComponent={CustomBackdrop}
        onCancel={() => setOpenDateTimeModal(false)}
        customStyles={{
          dateText:{color:"red"},
          dateInput:{borderColor:"red"},
          cancelButton:{textColor:"red"},
          confirmButton:{textColor:"red"},
          datePicker:{backgroundColor:"red"},
        }}
      />
      {/* REQUEST SUBMIT MODAL */}
      <Modal
        transparent
        statusBarTranslucent
        animationType={"fade"}
        visible={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Request submitted successfully!
            </Text>
            <Button
              title="Close"
              onPress={() => {
                setShowSuccessModal(false);
                navigation.navigate("Bookings");
              }}
            />
          </View>
        </View>
      </Modal>
      {/* PAYMENT BOTTOM SHEET */}
      <RBSheet
        height={700}
        closeOnDragDown={true}
        closeOnPressMask={true}
        ref={refPaymentRBSheet}
        customStyles={{
          wrapper:styles.bottomSheetOverlay,
          container:styles.bottomSheetStyle,
          draggableIcon:styles.bottomSheetIcon,
        }}>
        <View style={styles.stepperContainer}>
          <StepIndicator
            stepCount={3}
            labels={labels}
            customStyles={customStyles}
            currentPosition={currentStep}
            onPress={(position) => setCurrentStep(position)}
          />
        </View>
        <View style={styles.paymentOptionsContainer}>
          <View style={{flexDirection:"row",alignItems:"center",gap:5}}>
            <View>
              <Text style={{color:theme.color.black,fontWeight:"600",fontSize:14}}>
                Choose Payment Method
              </Text>
            </View>
            <View>
              <Text style={{color:"gray",fontWeight:"700",fontSize:11}}>
                (Click one of the option below)
              </Text>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.paymentOption}
            onPress={() => debitsheet.current.open()}>
            <Image
              style={styles.paymentOptionIcon}
              source={require("../assets/images/icons8-cash-in-hand-48.png")}
            />
            <Text style={styles.paymentOptionText}>
              Pay with Card
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.paymentOption}>
            <Image
              style={styles.paymentOptionIcon}
              source={require("../assets/images/icons8-cash-in-hand-48.png")}
            />
            <Text style={styles.paymentOptionText}>
              Pay After Service
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{marginTop:"23%"}}>
          <View style={{flexDirection:"row"}}>
            <View style={{flex:1}}>
              <Text style={[styles.mainTextStyle,{fontSize:16}]}>
                Grand Total
              </Text>
            </View>
            <View style={{flex:1,alignItems:"flex-end"}}>
              <Text style={styles.priceStyle}>
                {`${helpers.constant.currencyName} ${(orderDetail?.formData?.services?.total).toFixed(2)}`}
              </Text>
            </View>
          </View>
          <CustomButton
            activeOpacity={0.7}
            onPress={PostNewJob}
            loading={buttonLoader}
            title={"Proceed to checkout"}
            customButtonStyle={{marginTop:12,marginBottom:0,
            width:"100%",alignItems:"center",alignSelf:"center"}}
          />
        </View>
      </RBSheet>
      {/* CARD DETAILS MODAL */}
      <RBSheet
        height={800}
        closeOnDragDown={true}
        closeOnPressMask={true}
        ref={refCardDetailsRBSheet}
        customStyles={{
          wrapper:styles.bottomSheetOverlay,
          container:styles.bottomSheetStyle,
          draggableIcon:styles.bottomSheetIcon,
        }}>
        <View style={styles.paymentFormContainer}>
          <Text style={styles.paymentFormTitle}>
            Arbeittech
          </Text>
          <Text style={styles.priceLabelStyle}>
            <Text style={[styles.mainTextStyle,{fontSize:16}]}>
              Grand Total
            </Text>
            <Text style={styles.priceStyle}>
              {`${helpers.constant.currencyName} ${(orderDetail?.formData?.services?.total).toFixed(2)}`}
            </Text>
          </Text>
          <TextInput
            autoCapitalize={"none"}
            style={styles.inputField}
            placeholder={"Email Address"}
            keyboardType={"email-address"}
          />
          <View style={styles.cardInfoContainer}>
            <TextInput
              maxLength={19}
              keyboardType={"numeric"}
              placeholder={"Card Number"}
              style={[styles.inputField, styles.cardInput]}
            />
          </View>
          <View style={styles.countryZipContainer}>
            <TextInput
              placeholder={"MM/YY"}
              style={[styles.inputField, styles.countryInput]}
            />
            <TextInput
              maxLength={6}
              keyboardType={"numeric"}
              placeholder={"Expire date"}
              style={[styles.inputField, styles.zipInput]}
            />
          </View>
          <TextInput
            style={styles.inputField}
            placeholder={"Cardholder Name"}
          />
          <View style={styles.countryZipContainer}>
            <TextInput
              placeholder={"Country/Region"}
              style={[styles.inputField, styles.countryInput]}
            />
            <TextInput
              maxLength={6}
              placeholder={"ZIP Code"}
              keyboardType={"numeric"}
              style={[styles.inputField, styles.zipInput]}
            />
          </View>
          <View style={styles.toggleContainer}>
            <Switch
              value={saveInfo}
              trackColor={{true:"#4CAF50",false:"#ccc"}}
              onValueChange={(value) => setSaveInfo(value)}
            />
            <Text style={styles.toggleLabel}>
              Save this info
            </Text>
          </View>
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By clicking Pay Now, you agree to the
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handlePayNow}
            style={styles.payNowButton}>
            <Text style={styles.payNowButtonText}>
              Pay Now
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
      {/* SELECT CARD MODAL */}
      <RBSheet
        height={700}
        ref={debitsheet}
        openDuration={250}
        customStyles={{container:styles.rbsheetContainer}}>
        <View style={styles.rbsheetContent}>
          <Text style={styles.rbsheetHeading}>
            Select Debit Card
          </Text>
          <ScrollView>
            {debitCards.map((val, key) => (
              <View key={key} style={styles.cardRow}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setSelectedCard(val?.id)}
                  style={[styles.cardOption,selectedCard===val?.id&&styles.activeCard]}>
                  <Image
                    style={styles.cardIcon}
                    source={require("../assets/images/icons8-cash-in-hand-48.png")}
                  />
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardBank}>
                      {val?.bank}
                    </Text>
                    <Text style={styles.cardNumber}>
                      {val?.cardNumber}
                    </Text>
                    <Text style={styles.cardExpiry}>
                      Expiry: {val?.expiry}
                    </Text>
                    <Text style={styles.cardHolder}>
                      Card Holder: {val?.cardHolder}
                    </Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.moreOptions}>
                    <Text style={styles.moreOptionsText}>...</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
                {selectedCard===val?.id&&
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.removeButton}
                    onPress={() => cardRemoveHandle(val?.id)}>
                    <Text style={styles.removeButtonText}>
                      Remove
                    </Text>
                  </TouchableOpacity>
                }
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.addButton}
            onPress={() => setCardModalVisible(true)}>
            <Text style={styles.addButtonText}>
              Add Debit Card
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
      {/* Card Modal */}
      <Modal
        transparent={true}
        statusBarTranslucent
        animationType={"fade"}
        visible={cardModalVisible}
        onRequestClose={() => setCardModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Add New Debit Card
            </Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Bank Name
              </Text>
              <TextInput
                value={newCard.bank}
                style={styles.inputStyle}
                placeholder={"Enter bank name"}
                onChangeText={(text) => setNewCard({...newCard, bank:text})}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Card Number
              </Text>
              <TextInput
                keyboardType={"numeric"}
                style={styles.inputStyle}
                value={newCard.cardNumber}
                placeholder={"Enter card number"}
                onChangeText={(text) => setNewCard({...newCard, cardNumber:text})}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Expiry Date
              </Text>
              <TextInput
                placeholder={"MM/YY"}
                value={newCard.expiry}
                style={styles.inputStyle}
                onChangeText={(text) => setNewCard({...newCard, expiry:text})}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Card Holder
              </Text>
              <TextInput
                style={styles.inputStyle}
                value={newCard.cardHolder}
                placeholder={"Enter card holder name"}
                onChangeText={(text) => setNewCard({...newCard, cardHolder:text})}
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={addCardHandle}
              style={styles.submitButton}>
              <Text style={styles.submitButtonText}>
                Submit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.closeButton}
              onPress={() => setCardModalVisible(false)}>
              <Text style={styles.closeButtonText}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* ADD IMAGES BOTTOM SHEET */}
      <RBSheet
        ref={refRBSheet}
        openDuration={250}
        height={height/1.2}
        closeOnPressBack={false}
        customStyles={{
          container: {
            paddingHorizontal:20,
            borderTopLeftRadius:20,
            borderTopRightRadius:20,
          },
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.sheetContainer}>
            <Text style={styles.sheetTitle}>
              Update Images
            </Text>
            <FlatList
              numColumns={2}
              data={imagesArray}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity
              activeOpacity={.7}
              onPress={() => handleImagePress("add", 0)}
              style={{flexDirection:"row",paddingBottom:12}}>
              <View style={{justifyContent:"center",marginRight:8}}>
                <Image
                  source={require('../assets/images/plus-circle.png')}
                  style={{height:20,width:20,resizeMode:"cover",tintColor:Colors.Primary}}
                />
              </View>
              <View style={{flex:1,justifyContent:"center"}}>
                <Text style={{fontSize:16,color:"#000",fontFamily:Fonts.Bold}}>
                  Add Images
                </Text>
              </View>
            </TouchableOpacity>
            <CustomButton
              title={"Update"}
              customButtonStyle={styles.proceedButton}
              onPress={() => refRBSheet.current.close()}
            />
          </View>
        </ScrollView>
      </RBSheet>
      {/* IMAGES OPTION BOTTOM SHEET */}
      <RBSheet
        height={260}
        ref={imageRBSheet}
        openDuration={250}
        customStyles={{
          container: {
            paddingHorizontal: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        <View style={styles.sheetContainer}>
          <Text style={{fontSize:22,fontFamily:Fonts.Bold,color:"#000",textAlign:"center"}}>
            Uplaod Images
          </Text>
          <Text style={{fontSize:16,color:"gray",textAlign:"center",marginTop:12}}>
            Upload or Take a photo of services
          </Text>
          <View style={{flexDirection:"row",marginTop:20}}>
            <View style={{flex:1,justifyContent:"center",marginRight:6}}>
              <TouchableOpacity
                activeOpacity={.7}
                onPress={() => openGalleryHandle(imageValue, imageIndex)}
                style={{backgroundColor:"#cce5ff",alignItems:"center",
                justifyContent:"center",paddingVertical:30,borderRadius:8}}>
                <Image
                  source={require('../assets/images/upload.png')}
                  style={{height:60,width:60,resizeMode:"contain",tintColor:theme.color.primaryColor}}
                />
              </TouchableOpacity>
            </View>
            <View style={{flex:1,justifyContent:"center",marginLeft:6}}>
              <TouchableOpacity
                activeOpacity={.7}
                onPress={() => openCameraHandle(imageValue, imageIndex)}
                style={{backgroundColor:"#cce5ff",alignItems:"center",
                justifyContent:"center",paddingVertical:30,borderRadius:8}}>
                <Image
                  source={require('../assets/images/camera.png')}
                  style={{height:60,width:60,resizeMode:"contain",tintColor:theme.color.primaryColor}}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.white,
  },
  boxStyle: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: theme.color.white,
    borderRadius: 6, // Smooth, rounded corners
    shadowColor: "#000", // Shadow color
    shadowOffset: {
      width: 0, 
      height: 4, // Stronger shadow offset
    },
    shadowOpacity: 0.3, // Slightly deeper shadow
    shadowRadius: 5, // More blur for a softer shadow
    elevation: 4, // Higher elevation for Android
    borderColor: theme.color.secondaryColor, // Optional light border
    borderWidth: 1, // Subtle border
  },
  
  headingStyle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.color.primaryColor,
  },
  mainTextStyle: {
    fontSize: 13,
    color: theme.color.textColor,
    textTransform: "capitalize",
  },
  subTextStyle: {
    marginTop: 2,
    fontSize: 12,
    color: "#CCC",
    fontWeight: "bold",
  },
  checkBoxText: {
    fontSize: 13,
    color: theme.color.primaryColor,
    fontFamily: FontFamily.lightFont,
  },
  bottomBox: {
    borderTopWidth: 1,
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
    fontSize: 16,
    fontWeight: "bold",
    color: theme.color.primaryColor,
  },
  bottomSheetStyle: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: theme.color.secondaryColor,
  },
  bottomSheetOverlay: {
    backgroundColor: "#2632384f",
  },
  bottomSheetIcon: {
    width: 50,
    backgroundColor: "#D6D8E0",
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
    textTransform: "capitalize",
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
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  descStyle: {
    fontSize: 12,
    marginTop: 6,
    color: "#000",
  },
  validTill: {
    fontSize: 12,
    color: "gray",
    marginTop: 12,
  },
  validTillDate: {
    fontSize: 12,
    color: "#000",
    fontWeight: "bold",
  },

  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  checkbox: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    color: Colors.Primary,
  },
  bottomSheetStyle: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#FFFFFF",
  },
  bottomSheetOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  bottomSheetIcon: {
    backgroundColor: "#000",
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 10,
    borderColor: "gray",
    paddingHorizontal: 10,
  },
  stepperContainer: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: "row",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  stepperStep: {
    flex: 1,
    height: 30,
    elevation: 5,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.Primary,
  },
  activeStep: {
    backgroundColor: Colors.Accent,
  },
  stepperText: {
    fontSize: 12,
    color: "#ffffff",
    fontFamily: Fonts.Bold,
  },
  bottomSheetStyle: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#FFFFFF",
  },
  bottomSheetOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  bottomSheetIcon: {
    backgroundColor: "#000",
  },
  stepperContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  paymentOptionsContainer: {
    marginTop: 10,
  },
  paymentRow: {
    gap: 8,
    flex: 1,
    marginTop: 15,
    marginBottom: 20,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  paymentOption: {
    gap: 8,
    flex: 1,
    margin: 2,
    height: 60,
    padding: 10,
    elevation: 2,
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "start",
    backgroundColor: "#ffff",
  },
  paymentOptionIcon: {
    marginBottom: 5,
    marginRight: 11,
    objectFit: "cover",
  },
  paymentOptionText: {
    fontSize: 10,
    color: "#333",
    fontWeight: "700",
  },
  subHeading: {
    fontSize: 18,
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  subpara: {
    fontSize: 12,
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  checkbox: {
    marginVertical: 10,
  },
  formContainer: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  serviceImage: {
    height: 200,
    width: "100%",
    marginBottom: 10,
    resizeMode: "cover",
  },

  sectionIMAGES: {
    flexWrap: "wrap",
    flexDirection: "row",
  },
  imageContainer: {
    width: "48%",
    marginBottom: 10,
    marginRight: "2%",
    alignItems: "center",
  },
  optionRow: {
    gap: 10,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
  optionIcon: {
    width: 25,
    height: 25,
    objectFit: "cover",
  },
  imageContainer: {
    gap: 8,
    flex: 1,
    marginBottom: 12,
    position: "relative",
  },
  imageStyle: {
    height: 100,
    width: "97%",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: theme.color.primaryColor,
  },
  imageActions: {
    gap: 5,
    right: 14,
    bottom: 8,
    position: "absolute",
    flexDirection: "row",
  },
  iconStyle: {
    width: 25,
    height: 25,
  },
  descriptionText: {
    fontSize: 12,
    fontWeight: "600",
  },
  paymentRow: {
    marginBottom: 20,
    alignItems: "center",
    flexDirection: "row",
  },
  paymentOptionIcon: {
    width: 30,
    height: 30,
    marginLeft: 10,
    resizeMode: "contain",
  },
  paymentOptionText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 10,
    fontWeight: "700",
  },
  inputField: {
    height: 50,
    fontSize: 16,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#f2f2f2",
  },
  cardInfoContainer: {
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardInput: {
    flex: 2,
    marginRight: 10,
  },
  expiryCVCContainer: {
    flex: 1,
    flexDirection: "row",
  },
  expiryInput: {
    flex: 1,
    marginRight: 10,
  },
  cvcInput: {
    flex: 1,
  },
  countryZipContainer: {
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  countryInput: {
    flex: 1,
    marginRight: 10,
  },
  zipInput: {
    flex: 1,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggleLabel: {
    fontSize: 16,
    marginLeft: 10,
  },
  termsContainer: {
    marginBottom: 20,
    marginTop: "12%",
    textAlign: "center",
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 15,
  },
  termsText: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.color.black,
  },
  termsLink: {
    fontSize: 16,
    marginLeft: 5,
    marginRight: 5,
    color: "#007bff",
    marginVertical: 5,
    textAlign: "center",
  },
  payNowButton: {
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#4CAF50",
  },
  payNowButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  paymentFormTitle: {
    fontSize: 32,
    fontWeight: "900",
    marginVertical: 12,
    textAlign: "center",
    color: theme.color.primaryColor,
  },
  textContainer: {
    marginTop: 6,
    paddingTop: 0,
    borderWidth: 1,
    borderRadius: 6,
    paddingBottom: 60,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    backgroundColor: "#FFF",
  },
  descriptionText: {
    fontSize: 16,
    color: "#333",
  },
  paymentOptionsContainer: {
    marginVertical: 20,
    alignItems: "center",
    flexDirection: "column",
  },
  paymentOption: {
    padding: 10,
    width: "90%",
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    borderColor: "gray",
    alignItems: "center",
    flexDirection: "row",
  },
  selectedPaymentOption: {
    borderColor: "blue",
    backgroundColor: "lightgray",
  },
  paymentOptionIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  paymentOptionText: {
    fontSize: 12,
    color: "gray",
    fontWeight: "600",
  },
  selectedPaymentOptionText: {
    color: "blue",
  },
  backdrop: {
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    bottom: 0,
    position: "absolute",
    backgroundColor: "#fff",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#20232a73",
  },
  modalView: {
    margin: 20,
    padding: 35,
    elevation: 5,
    shadowRadius: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    alignItems: "center",
    backgroundColor: "#FFF",
    shadowOffset: {width:0,height:2},
  },
  modalText: {
    fontSize: 22,
    color: "#000",
    marginTop: 10,
    textAlign: "center",
    fontFamily: Fonts.Bold,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    elevation: 3,
    borderRadius: 6,
    shadowRadius: 2.22,
    shadowOpacity: 0.22,
    shadowColor: "gray",
    justifyContent: "center",
    shadowOffset: {width:0,height:1},
  },
  shadowStyle: {
    elevation: 3,
    shadowRadius: 2.22,
    shadowOpacity: 0.22,
    shadowColor: "gray",
    shadowOffset: {width:0,height:1},
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    padding: 20,
    width: "80%",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  closeButton: {
    padding: 10,
    borderRadius: 5,
    alignSelf: "flex-end",
    backgroundColor: "#1e90ff",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  modalOption: {
    flex: 1,
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 8,
    justifyContent: "center",
    backgroundColor: Colors.Primary,
  },
  modalOptionText: {
    fontSize: 12,
    textAlign: "center",
    color: Colors.White,
    fontFamily: Fonts.Bold,
  },
  inputLabel: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: "500",
    color: theme.color.black,
  },
  inputStyle: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    borderColor: "gray",
    paddingVertical: 10,
    borderStyle: "solid",
    paddingHorizontal: 10,
  },
  rbsheetContent: {
    padding: 20,
  },
  rbsheetHeading: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 20,
    color: theme.color.primaryColor,
  },
  bankRow: {
    marginBottom: 10,
  },
  bankOption: {
    padding: 15,
    alignItems: "center",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  bankIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  bankInfo: {
    flex: 1,
  },
  bankName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bankAccount: {
    fontSize: 14,
    color: "#555",
  },
  moreOptions: {
    padding: 5,
  },
  moreOptionsText: {
    fontSize: 26,
    fontWeight: "900",
  },
  activeBank: {
    backgroundColor: "#e0e0e0",
  },
  removeButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: theme.color.primaryColor,
  },
  removeButtonText: {
    fontSize: 16,
    color: theme.color.white,
  },
  submitButton: {
    padding: 15,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: "#007BFF",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  closeButton: {
    padding: 15,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: "#ff4d4d",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  moreOptions: {
    marginLeft: 10,
  },
  moreOptionsText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  removeButton: {
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: "#ff4d4d",
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  addButton: {
    height: 50,
    width: "100%",
    borderRadius: 10,
    marginVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007BFF",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  withdrawalButton: {
    height: 50,
    elevation: 5,
    width: "100%",
    borderRadius: 10,
    marginVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#28a745",
  },
  withdrawalButtonText: {
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  rbsheetContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cardRow: {
    marginBottom: 10,
  },
  cardOption: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
  },
  activeCard: {
    backgroundColor: "#e0e0e0",
  },
  cardIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  cardInfo: {
    flex: 1,
  },
  cardBank: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardNumber: {
    fontSize: 14,
    color: "#888",
  },
  cardExpiry: {
    fontSize: 12,
    color: "#888",
  },
  cardHolder: {
    fontSize: 12,
    color: "#888",
  },
  sheetContainer: {
    paddingTop: 10,
  },
  sheetTitle: {
    fontSize: 20,
    color: "#000",
    paddingTop: 10,
    paddingBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  descriptionInput: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    borderColor: "#CCC",
    textAlignVertical: "top",
  },
  imageUploadContainer: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imagePicker: {
    width: "48%",
    aspectRatio: 1,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#CCC",
    alignItems: "center",
    justifyContent: "center",
  },
  imageSelected: {
    borderColor: "#3498DB",
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },
  uploadText: {
    color: "#666",
    fontSize: 16,
  },
  proceedButton: {
    marginTop: 20,
    borderRadius: 5,
    paddingVertical: 12,
    marginHorizontal: 0,
    backgroundColor: Colors.Primary,
  },
});

export default CheckOut;
