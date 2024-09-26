import React, {useState, useRef, useEffect} from "react";
import {StyleSheet, View, Image, Text, ScrollView, TouchableOpacity, Modal, Button, Alert, FlatList} from "react-native";
import {theme} from "../constants/styles";
import {FontFamily} from "../constants/fonts";
import {Colors, Fonts} from "../utils/IMAGES";
import {useDispatch, useSelector} from "react-redux";
import {useStripe} from '@stripe/stripe-react-native';
import {SetCouponData} from "../Redux/actions/actions";
import {useNavigation} from "@react-navigation/native";
import {ToastMessage, helpers} from "../utils/helpers";
import moment from "moment";
import CheckBox from "react-native-check-box";
import Loader from "../component/Loader/loader";
import Header from "../component/Header/header";
import RBSheet from "react-native-raw-bottom-sheet";
import StepIndicator from "react-native-step-indicator";
import CustomButton from "../component/Buttons/customButton";
import CustomStatusBar from "../component/StatusBar/customStatusBar";

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

const FinalCheckout = () => {
  const dispatch = useDispatch();
  const refCouponRBSheet = useRef();
  const navigation = useNavigation();
  const refPaymentRBSheet = useRef();
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const {user_location, order_detail, access_token, coupon_detail} = useSelector((state) => state.userReducer);
  const {coupon_code, coupon_id, coupon_discount} = coupon_detail;
  const {formData, serviceId, categoryId, selectedDateTime, subCategoryDetail} = order_detail;
  const [loader, setLoader] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [currentStep, setCurrentStep] = useState(2);
  const [activeCoupon, setActiveCoupon] = useState([]);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState("");
  const [privacyCheckBox, setPrivacyCheckBox] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userLocation, setUserLocation] = useState(user_location);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("CASH");
  const [couponCode, setCouponCode] = useState(coupon_code===undefined?"":coupon_code);
  const [activeCouponId, setActiveCouponId] = useState(coupon_id===undefined?null:coupon_id);
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(coupon_discount===undefined?0:coupon_discount);
  
  useEffect(() => {
    const calculatePrice = () => {
      let totalPrice = 0;
      let displayedPrice = 0;
  
      if (formData?.services?.calculator==="HOUR") {
        totalPrice = parseFloat(formData?.services?.total)*parseFloat(formData?.services?.minimum_charges || 1);
      } else if (formData?.services?.calculator==="FIXED") {
        totalPrice = parseFloat(formData?.services?.total);
      };
      displayedPrice = totalPrice - (parseFloat(couponDiscountAmount) || 0);
  
      // Update state for displayed price (what user sees)
      setCalculatedPrice(displayedPrice.toFixed(2));
    };
  
    calculatePrice();
  }, [formData, couponDiscountAmount]);
  useEffect(() => {
    setButtonLoader(false);
    getCouponHandle();
  }, []);
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
  const isValidUri = (uri) => {
    return (
      typeof uri==="string"&&
      (uri.startsWith("http")||uri.startsWith("file://"))
    );
  };
  const applyCouponHandle = (promo_code, couponId) => {
    try {
      setLoader(true);
      refCouponRBSheet.current.close();
      const myHeaders = new Headers();
      myHeaders.append("X-Requested-With", "XMLHttpRequest");
  
      const formdata = new FormData();
      formdata.append("promo_code", promo_code);
      formdata.append("total_amount", formData?.services?.total_price?.toString());
  
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
          setActiveCouponId(couponId);
          const couponData = {
            coupon_id: couponId,
            coupon_code: promo_code,
            coupon_discount: result?.discount_amount,
          };
          dispatch(SetCouponData(couponData));
          ToastMessage(result?.msg);
        } else {
          ToastMessage(result?.msg || "Failed to apply coupon.");
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
  const checkOutHandle = () => {
    if (!privacyCheckBox) {
      Alert.alert(
        "Terms and Conditions",
        "Please read and accept the terms and conditions to proceed.",
        [{text:"OK"}]
      );
    } else {
      if (access_token===null||access_token===""||access_token===undefined) {
        Alert.alert(
          'Login Required',
          'You must be logged in to proceed with this action. Please log in to continue.',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate("Login", {
                  routeName: "finalcheckout",
                });
              },
            },
          ],
          {cancelable:true}
        );
      } else {
        refPaymentRBSheet.current.open();
      };
    };
  };
  const payWithCardHandle = () => {
    try {
      setLoader(true);
      const myHeaders = new Headers();
      myHeaders.append("X-Requested-With", "XMLHttpRequest");
      myHeaders.append("Authorization", `Bearer ${access_token}`);
      
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      
      fetch(`${helpers.api.baseUrl}details`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result?.message==="Unauthenticated.") {
          setButtonLoader(false);
          alert("Login Session Expired!");
          navigation.navigate("Login", {
            routeName: "finalcheckout",
          });
        } else {
          if (result?.first_name!==undefined) {
            fetchPaymentSheetParams(result);
          };
        };
      }).catch((error) => {
        setButtonLoader(false);
        alert(error?.message);
      });
    } catch (error) {
      setButtonLoader(false);
      alert(error?.message);
    };
  };
  const fetchPaymentSheetParams = async (user_detail) => {
    try {
      setButtonLoader(true);
      const myHeaders = new Headers();
      myHeaders.append("X-Requested-With", "XMLHttpRequest");
      myHeaders.append("Authorization", `Bearer ${access_token}`);

      const formdata = new FormData();
      formdata.append("amount", calculatedPrice);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };

      fetch(`${helpers.api.baseUrl}stripepayment`, requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        if (result?.error===undefined) {
          if (result?.paymentIntent!==""||
            result?.paymentIntent!==null||
            result?.paymentIntent!==undefined) {
            const {error} = await initPaymentSheet({
              customerId: result?.customer,
              allowsDelayedPaymentMethods: true,
              merchantDisplayName: helpers.api.merchantName,
              paymentIntentClientSecret: result?.paymentIntent,
              customerEphemeralKeySecret: result?.ephemeralKey,
              defaultBillingDetails: {
                name: `${user_detail?.first_name} ${user_detail?.last_name}`,
              },
            });
            if (!error) {
              openPaymentSheet();
            } else {
              Alert.alert(error?.message);
              setButtonLoader(false);
            };
          };
        } else if (result?.error==="token_invalid"||
        result?.error==="token_expired") {
          setButtonLoader(false);
          alert("Login Session Expired!");
          navigation.navigate("Login", {
            routeName: "finalcheckout",
          });
        };
      }).catch((error) => {
        setButtonLoader(false);
        Alert.alert(error?.message);
      });
    } catch (error) {
      setButtonLoader(false);
      Alert.alert(error?.message);
    };
  };
  const openPaymentSheet = async () => {
    const {error} = await presentPaymentSheet();
    if (error) {
      setButtonLoader(false);
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      jobPostHandle();
    };
  };
  const jobPostHandle = () => {
    try {
      setButtonLoader(true);
      const myHeaders = new Headers();
      myHeaders.append("X-Requested-With", "XMLHttpRequest");
      myHeaders.append("Authorization", `Bearer ${access_token}`);

      let services_array = [];
      if (formData?.options?.length>0) {
        services_array = formData?.options?.map((item) => item.options).flat();
      };
      let images_array = [];
      if (formData?.imagesArray?.length>0) {
        images_array = formData?.imagesArray;
      };

      const formDataToSend = new FormData();
      formDataToSend.append("current_longitude", userLocation?.longitude);
      formDataToSend.append("current_latitude", userLocation?.latitude);
      formDataToSend.append("location_long", userLocation?.longitude);
      formDataToSend.append("location_lat", userLocation?.latitude);
      formDataToSend.append("location", userLocation?.address);
      formDataToSend.append("estimated_fare", formData?.services.total);
      formDataToSend.append("payment_mode", selectedPaymentMethod);
      formDataToSend.append("service_id", serviceId);
      formDataToSend.append("description", formData?.description);
      formDataToSend.append("promocode_id", activeCouponId===null?0:activeCouponId);
      formDataToSend.append("scheduled_at", moment(selectedDateTime).format("YYYY-MM-DD HH:mm:ss"));
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
        setButtonLoader(false);
        if (result?.message==="New request created!") {
          ToastMessage("Request submitted successfully.");
          navigation.navigate("BookingSuccess");
        } else if (result?.message==="Unauthenticated.") {
          alert("Login Session Expired!");
          navigation.navigate("Login", {
            routeName: "finalcheckout",
          });
        } else {
          alert(result?.message);
          console.log("job post api message ===>" + result?.message)
        };
      }).catch((error) => {
        setButtonLoader(false);
        alert(error?.message);
        console.log("job post api message ===>" + error?.message)
      });
    } catch (error) {
      setButtonLoader(false);
      alert("An error occurred. Please try again.");
    };
  };
  const renderItem = ({item, index}) => {
    return (
      <View key={index}
        style={{flexDirection:"row",marginRight:6,
        justifyContent:"center",width:"49%",marginBottom:14}}>
        <Image
          style={styles.imageStyle}
          source={isValidUri(item?.uri)?
          {uri:item?.uri}:require("../assets/images/placeholder.webp")}
        />
      </View>
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
        <View style={{marginTop:10}}>
          <View style={{paddingVertical:10,alignItems:"flex-start"}}>
            <Text style={styles.headingStyle}>
              Service Schedule
            </Text>
          </View>
          <View style={styles.boxStyle}>
            <View style={{flexDirection:"row",gap:6,marginBottom:10}}>
              <View style={{justifyContent:"center"}}>
                <Text style={{fontWeight:"600",fontSize:14,color:"#000"}}>
                  Booking status:
                </Text>
              </View>
              <View style={{justifyContent:"center"}}>
                <Text style={{fontSize:14,color:theme.color.primaryColor,fontWeight:"bold"}}>
                  Pending
                </Text>
              </View>
            </View>
            <View style={{flexDirection:"row",marginTop:4}}>
              <View style={{justifyContent:"center"}}>
                <Image
                  source={require("../../assets/images/calendar.png")}
                  style={{height:16,width:16,tintColor:theme.color.primaryColor}}
                />
              </View>
              <View style={{flex:1,justifyContent:"center",marginLeft:8}}>
                <Text style={styles.dateStyle}>
                  {moment(selectedDateTime).format("Do MMM, YYYY")}
                </Text>
              </View>
            </View>
            <View style={{flexDirection:"row",marginTop:6}}>
              <View style={{justifyContent:"center"}}>
                <Image
                  source={require("../../assets/images/calendar.png")}
                  style={{height:16,width:16,tintColor:theme.color.primaryColor}}
                />
              </View>
              <View style={{flex:1,justifyContent:"center",marginLeft:8}}>
                <Text style={styles.dateStyle}>
                  {moment(selectedDateTime).format("dddd h:mm a")}
                </Text>
              </View>
            </View>
            <View style={{flexDirection:"row",marginTop:6}}>
              <View style={{justifyContent:"center"}}>
                <Image
                  source={require("../../assets/images/map-pin.png")}
                  style={{height:16,width:16,tintColor:theme.color.primaryColor}}
                />
              </View>
              <View style={{flex:1,justifyContent:"center",marginLeft:8}}>
                <Text style={styles.dateStyle}>
                  {userLocation?.address}
                </Text>
              </View>
            </View>
            <View style={{flexDirection:"row",marginTop:10}}>
              <View style={{flex:1,justifyContent:"center"}}>
                <Text style={styles.headingStyle}>
                  Payment Method
                </Text>
              </View>
            </View>
            <View style={{flexDirection:"row",marginTop:6}}></View>
            <View style={{flex:1,justifyContent:"center"}}>
              <Text style={styles.dateStyle}>
                Payment Status: Un Paid
              </Text>
            </View>
            <View style={{flex:1,justifyContent:"center"}}>
              <Text style={styles.dateStyle}>
                Payment Method: {selectedPaymentMethod}
              </Text>
            </View>
          </View>
        </View>
        <View style={{paddingTop:20,paddingBottom:10}}>
          <Text style={styles.headingStyle}>
            Job Information
          </Text>
        </View>
        <View style={styles.boxStyle}>
          <View style={styles.formContainer}>
          <View>
                    <Text style={{color:theme.color.black,fontWeight:theme.color.textColor,fontSize:14,paddingRight:12,
                      paddingBottom:8,
                    }}>
                      {formData?.services?.name}
                    </Text>
                   
                  </View>
            <View style={styles.section}>
              {formData.options.map((option) =>
                option.options.map((item, index) => (
                  <View key={index} style={styles.optionRow}>
                    <Image
                      style={styles.optionIcon}
                      source={require("../assets/images/checkIcon01.png")}
                    />
                    <Text style={{fontSize:14,color:theme.color.textColor,fontWeight:"600"}}>
                      {item}
                    </Text>
                  </View>
                ))
              )}
            </View>
            <View style={styles.sectionIMAGES}>
              <FlatList
                numColumns={2}
                renderItem={renderItem}
                data={formData?.imagesArray}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
              />
            </View>
            <Text style={[styles.headingStyle]}>
              Job Description
            </Text>
            <Text style={styles.textContainer}>
              {formData?.description}
            </Text>
          </View>
        </View>
        <View style={{paddingTop:20,paddingBottom:10}}>
          <Text style={styles.headingStyle}>
            Cart Summary
          </Text>
        </View>
        <View style={[styles.boxStyle,{marginBottom:20}]}>
          {formData?.services?.calculator==="HOUR"?
            <View style={{borderBottomWidth:1,paddingBottom:12,borderBottomColor:"#CCC"}}>
              <View style={{flexDirection:"row"}}>
                <View style={{flex:1,flexDirection:"row",gap:10}}>
                  <View>
                    <Text style={{color:theme.color.black,fontWeight:"800",fontSize:14,paddingRight:12}}>
                      {formData?.services?.name}
                    </Text>
                    <Text style={{color:theme.color.black,fontSize:13,marginTop:4}}>
                      Minimum {formData?.services?.minimum_charges} hour Charges
                    </Text>
                  </View>
               
                  <View style={{flex:1,alignItems:"flex-end"}}>
                    <Text style={{color:theme.color.black,fontWeight:"700",fontSize:15}}>
                      {`${helpers.constant.currencyName} ${formData?.services?.total_price*formData?.services?.minimum_charges}`}
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
                    {formData?.services?.name}
                  </Text>
                </View>
                <View style={{justifyContent:"center"}}>
                  <Text style={{color:theme.color.black,fontWeight:"700",fontSize:15}}>
                    {`${helpers.constant.currencyName} ${formData?.services?.price}`}
                  </Text>
                </View>
              </View>
            </View>
          }
          {formData?.services?.calculator==="HOUR"?
            <>
              <View style={{flexDirection:"row",marginTop:8}}>
                <View style={{flex:1,justifyContent:"center"}}>
                  <Text style={[styles.mainTextStyle,{fontWeight:"bold"}]}>
                    Sub Total
                  </Text>
                </View>
                <View style={{flex:1,alignItems:"flex-end",justifyContent:"center"}}>
                  <Text style={[styles.mainTextStyle,{fontWeight:"bold"}]}>
                    (+) {`${helpers.constant.currencyName} ${formData?.services?.total_price*formData?.services?.minimum_charges}`}
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
                    {formData?.services?.price}
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
                    {formData?.services?.calculator}
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
                    (+) {helpers.constant.currencyName} {(parseFloat(formData?.services?.tax)*parseFloat(formData?.services?.minimum_charges)).toFixed(2)}
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
                    (+) {`${helpers.constant.currencyName} ${formData?.services?.total_price}`}
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
                    {formData?.services?.price}
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
                    {formData?.services?.calculator}
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
                    (+) {helpers.constant.currencyName} {(parseFloat(formData?.services?.tax)).toFixed(2)}
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
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => refCouponRBSheet.current.open()}
          style={{flexDirection:"row",paddingVertical:12,borderTopWidth:1,
          borderBottomColor:"#CCC",borderBottomWidth:1,borderTopColor:"#CCC"}}>
          <View style={{justifyContent:"center",marginRight:12}}>
            <Image
              source={theme.images.couponIcon}
              style={{height:30,width:30,tintColor:theme.color.primaryColor}}
            />
          </View>
          <View style={{flex:1,justifyContent:"center"}}>
            <Text style={{fontSize:14,color:theme.color.primaryColor,fontWeight:"bold"}}>
              Apply a coupon
            </Text>
          </View>
        </TouchableOpacity>
        <View style={{paddingVertical:20,borderBottomColor:"#CCC",borderBottomWidth:1}}>
          <View style={{flexDirection:"row"}}>
            <View style={{flex:1}}>
              <Text style={{fontSize:16,color:theme.color.primaryColor,fontWeight:"600"}}>
                Grand Total
              </Text>
            </View>
            <View style={{flex:1,alignItems:"flex-end"}}>
              <Text style={styles.priceStyle}>
                {helpers.constant.currencyName} {calculatedPrice}
              </Text>
            </View>
          </View>
        </View>
        <View style={{flexDirection:"row",marginTop:12,marginBottom:30}}>
          <View style={{justifyContent:"center"}}>
            <CheckBox
              style={{height:20}}
              checkBoxColor={"#7D7C7C"}
              isChecked={privacyCheckBox}
              onValueChange={setPrivacyCheckBox}
              rightTextStyle={styles.checkBoxText}
              checkedCheckBoxColor={theme.color.primaryColor}
              onClick={() => setPrivacyCheckBox(!privacyCheckBox)}
            />
          </View>
          <View style={{flex:1,justifyContent:"center",marginLeft:6}}>
            <Text style={styles.checkBoxText}>
              <Text style={{color:"#000"}}>{"I agree with the "}</Text>
              <Text style={{textDecorationLine:"underline"}}
              onPress={() => navigation.navigate("PrivacyPolicy")}>
                Terms & Conditions
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomBox}>
        <Text style={styles.priceLabelStyle}>
          <Text style={[styles.mainTextStyle,{fontSize:16,fontWeight:"bold"}]}>
            {"Total Price: "}
          </Text>
          <Text style={styles.priceStyle}>
            {helpers.constant.currencyName} {calculatedPrice}
          </Text>
        </Text>
        <CustomButton
          activeOpacity={0.7}
          loading={buttonLoader}
          onPress={checkOutHandle}
          title={"Proceed to checkout"}
          customButtonStyle={{marginTop:12,marginBottom:0}}
        />
      </View>
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
            style={[styles.tabStyle,{borderBottomColor:activeTab===1?theme.color.primaryColor:"#CCC"}]}>
            <Text style={[styles.tabTextStyle,{color:activeTab===1?theme.color.primaryColor:"gray"}]}>
              Current Coupon
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveTab(2)}
            style={[styles.tabStyle,{borderBottomColor:activeTab===2?theme.color.primaryColor:"#CCC"}]}>
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
                    customButtonStyle={{marginHorizontal:0,borderRadius:6,
                    paddingHorizontal:20,marginTop:0,marginBottom:0,height:34}}
                    onPress={() => applyCouponHandle(val?.promo_code, val?.id)}
                  />
                </View>
              </View>
            );
          })
          :null}
        </ScrollView>
      </RBSheet>
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
        ref={refPaymentRBSheet}
        height={700}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper:styles.bottomSheetOverlay,
          container:styles.bottomSheetStyle,
          draggableIcon:styles.bottomSheetIcon,
        }}>
        <StepIndicator
          stepCount={3}
          labels={labels}
          customStyles={customStyles}
          currentPosition={currentStep}
          onPress={(position) => setCurrentStep(position)}
        />
        <View style={{marginTop:20}}>
          <View style={{flexDirection:"row",alignItems:"center",gap:5}}>
            <Text style={{color:theme.color.black,fontSize:14,fontWeight:"600"}}>
              Choose Payment Method
            </Text>
            <Text style={{color:"gray",fontWeight:"700",fontSize:11}}>
              (Click one of the options below)
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{...styles.paymentOption,backgroundColor:
            selectedPaymentMethod==="CASH"?"#ddd":"white",
            borderColor:selectedPaymentMethod==="CASH"?"#000":"#ccc"}}
            onPress={() => setSelectedPaymentMethod("CASH")}>
            <Image
              source={require("../assets/images/icons8-cash-in-hand-48.png")}
              style={{width:30,height:30,marginRight:10,resizeMode:"contain"}}
            />
            <Text style={{...styles.paymentOptionText,
            color:selectedPaymentMethod==="CASH"?"#000":"#333"}}>
              Pay After Service
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setSelectedPaymentMethod("CARD")}
            style={{...styles.paymentOption,backgroundColor:
            selectedPaymentMethod==="CARD"?"#ddd":"white",
            borderColor:selectedPaymentMethod==="CARD"?"#000":"#ccc"}}>
            <Image
              source={require("../assets/images/atm-card.png")}
              style={{width:26,height:26,marginRight:10,resizeMode:"contain"}}
            />
            <Text style={{...styles.paymentOptionText,
            color:selectedPaymentMethod==="CARD"?"#000":"#333"}}>
              Pay with Card
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{position:"absolute",bottom:0,left:20,right:20}}>
          <CustomButton
            activeOpacity={0.7}
            loading={buttonLoader}
            title={"Proceed to checkout"}
            customButtonStyle={{marginTop:12,
            marginHorizontal:0,borderRadius:6}}
            onPress={() => {
              if (selectedPaymentMethod==="CARD") {
                payWithCardHandle();
              } else {
                jobPostHandle();
              };
            }}
          />
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
  dateStyle: {
    fontSize: 14,
    color: theme.color.textColor,
    fontWeight: "600",
  },
  mainTextStyle: {
    fontSize: 14,
    color: theme.color.textColor,
    textTransform: "capitalize",
  },
  subTextStyle2: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
    color: theme.color.primaryColor,
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
    fontSize: 18,
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
    fontWeight: "bold",
    marginBottom: 10,
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
    paddingHorizontal: 10,
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
  paymentRow: {
    gap: 8,
    flex: 1,
    marginTop: 15,
    marginBottom: 20,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  paymentOptionIcon: {
    marginRight: 11,
    marginBottom: 5,
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
    marginTop: 10,
    flexWrap: "wrap",
    flexDirection: "row",
  },
  imageContainer: {
    width: "48%",
    marginBottom: 10,
    marginRight: "2%",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
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
  image: {
    height: 100,
    width: "97%",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: theme.color.primaryColor,
  },
  imageActions: {
    gap: 5,
    right: 14,
    bottom: 18,
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
    flexDirection: "row",
    flex: 1,
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
    alignItems: "center",
    flexDirection: "row",
  },
  toggleLabel: {
    fontSize: 16,
    marginLeft: 10,
  },
  termsContainer: {
    marginBottom: 20,
    marginTop: "12%",
    alignSelf: "center",
    textAlign: "center",
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
    fontSize: 18,
    color: "#fff",
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
    padding: 8,
    marginTop: 8,
    color: "#000",
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "#ddd",
    backgroundColor: "#FFF",
  },
  descriptionText: {
    fontSize: 16,
    color: "#333",
  },
  paymentOption: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    marginVertical: 5,
    borderColor: "gray",
    alignItems: "center",
    flexDirection: "row",
  },
  selectedPaymentOption: {
    borderColor: "blue",
    backgroundColor: "lightgray",
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
    bottom: 0,
    zIndex: 1,
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
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
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
  imageStyle: {
    height: 100,
    width: "97%",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: theme.color.primaryColor,
  },
});

export default FinalCheckout;
