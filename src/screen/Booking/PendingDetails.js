import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Linking,
  RefreshControl,
  Modal,
  Platform,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";
import { theme } from "../../utils/styles";
import { Colors, Fonts } from "../../utils/IMAGES";
import { useNavigation } from "@react-navigation/native";
import { ToastMessage, helpers } from "../../utils/helpers";
import moment from "moment";
import Header from "../../component/Header/header";
import RBSheet from "react-native-raw-bottom-sheet";
import ImagePicker from "react-native-image-crop-picker";

import CustomStatusBar from "../../component/StatusBar/customStatusBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../../component/Loader/loader";

const placeholderImages = [
  "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
  "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
];
const { width } = Dimensions.get("window");

const PendingDetails = (props) => {
  const refRBSheet = useRef();
  const refPaymentRBSheet = useRef();
  const navigation = useNavigation();
  const { detail } = props.route.params;
  const { access_token } = useSelector((state) => state.userReducer);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(1);
  const [imagesArray, setImagesArray] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [bookingDetail, setBookingDetail] = useState({});
  const [buttonLoader, setButtonLoader] = useState(false);
  const [serviceDetails, setServiceDetails] = useState([]);
  const [serviceCategory, setserviceCategory] = useState([]);
  const [customerImages, setCustomerImages] = useState([]);
  const [beforeDescription, setBeforeDescription] = useState("");
  const [beforeImagesArray, setBeforeImagesArray] = useState([]);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [isPressedArray, setIsPressedArray] = useState([
    false,
    false,
    false,
    false,
  ]);

  useEffect(() => {
    getBookingDetailHandle("home");
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getBookingDetailHandle("home");
    });

    return unsubscribe;
  }, [navigation]);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getBookingDetailHandle("home");
  }, []);

  const getBookingDetailHandle = (value) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("X-Requested-With", "XMLHttpRequest");
      myHeaders.append("Authorization", `Bearer ${access_token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      setLoading(true);
      fetch(
        `${helpers.api.baseUrl}requests/history/details?request_id=${detail?.id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setLoading(false);
          setRefreshing(false);
          console.log(result);
          if (result?.error === undefined) {
            const userImages = result?.job_images[0]?.user_images===null?[]:result?.job_images[0]?.user_images;
            const beforeImages = result?.job_images[0]?.before_images===null?[]:result?.job_images[0]?.before_images;
            const afterImages = result?.job_images[0]?.after_images===null?[]:result?.job_images[0]?.after_images;
            if (userImages===undefined||userImages?.length===0) {
              setCustomerImages(placeholderImages);
            } else {
              setCustomerImages(userImages);
            };
            if (afterImages===undefined||afterImages?.length===0) {
              setImagesArray(placeholderImages);
            } else {
              setImagesArray(afterImages);
            };
            if (beforeImages===undefined||beforeImages?.length===0) {
              setBeforeImagesArray(placeholderImages);
            } else {
              setBeforeImagesArray(beforeImages);
            };
            setBookingDetail(result);
            const service_details =
              result?.service_details?.length === 0
                ? result?.service_details
                : JSON.parse(result?.service_details);
            setServiceDetails(service_details);
            const service_type =
              result?.service_type?.length === 0
                ? result?.service_type
                : JSON.parse(result?.service_type);
            setserviceCategory(service_type);
            if (value === "redirect") {
              setButtonLoader(false);
              navigation.navigate("Booking Period", {
                booking_detail: result,
              });
            }
          } else if (
            result?.error === "token_invalid" ||
            result?.error === "token_expired"
          ) {
            AsyncStorage.removeItem("access_token");
            AsyncStorage.removeItem("user_detail");
            AsyncStorage.removeItem("user_location");
            navigation.replace("Login");
            alert("Session Expired!");
          }
        })
        .catch((error) => {
          setLoading(false);
          setRefreshing(false);
        });
    } catch (error) {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const handleImagePress = (type, value, key) => {
    Alert.alert(
      "Select Image",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: () => openCameraHandle(type, value, key),
        },
        {
          text: "Choose from Gallery",
          onPress: () => openGalleryHandle(type, value, key),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };
  const openGalleryHandle = (type, value, key) => {
    try {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      })
        .then((response) => {
          const randomNumber = Math.random();
          var imageObject = {
            id: randomNumber,
            type: response?.mime,
            name: `img-${randomNumber}.jpg`,
            uri:
              Platform.OS === "ios"
                ? response?.path.replace("file://", "")
                : response?.path,
          };
          if (value === "add") {
            if (type === "after") {
              const newArray = imagesArray;
              newArray.push(imageObject);
              setImagesArray(newArray);
            } else if (type === "before") {
              const beforeNewArray = beforeImagesArray;
              beforeNewArray.push(imageObject);
              setBeforeImagesArray(beforeNewArray);
            }
          } else if (value === "edit") {
            if (type === "after") {
              const updatedImages = imagesArray.map((image, i) => {
                if (i === key) {
                  return { ...image, uri: response?.path };
                }
                return image;
              });
              setImagesArray(updatedImages);
            } else if (type === "before") {
              const updatedBeforeImages = beforeImagesArray.map((image, i) => {
                if (i === key) {
                  return { ...image, uri: response?.path };
                }
                return image;
              });
              setBeforeImagesArray(updatedBeforeImages);
            }
          }
          const a = count + 1;
          setCount(a);
        })
        .catch((error) => {
          ToastMessage(error?.message);
        });
    } catch (error) {
      ToastMessage(error?.message);
    }
  };
  const openCameraHandle = (type, value, key) => {
    try {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
      }).then((response) => {
          const randomNumber = Math.random();
          var imageObject = {
            id: randomNumber,
            type: response?.mime,
            name: `img-${randomNumber}.jpg`,
            uri:
              Platform.OS === "ios"
                ? response?.path.replace("file://", "")
                : response?.path,
          };
          if (value === "add") {
            if (type === "after") {
              const newArray = imagesArray;
              newArray.push(imageObject);
              setImagesArray(newArray);
            } else if (type === "before") {
              const beforeNewArray = beforeImagesArray;
              beforeNewArray.push(imageObject);
              setBeforeImagesArray(beforeNewArray);
            }
          } else if (value === "edit") {
            if (type === "after") {
              const updatedImages = imagesArray.map((image, i) => {
                if (i === key) {
                  return { ...image, uri: response?.path };
                }
                return image;
              });
              setImagesArray(updatedImages);
            } else if (type === "before") {
              const updatedBeforeImages = beforeImagesArray.map((image, i) => {
                if (i === key) {
                  return { ...image, uri: response?.path };
                }
                return image;
              });
              setBeforeImagesArray(updatedBeforeImages);
            }
          }
          const a = count + 1;
          setCount(a);
        })
        .catch((error) => {
          ToastMessage(error?.message);
        });
    } catch (error) {
      ToastMessage(error?.message);
    }
  };
  const removeImageHandle = (type, key) => {
    if (type === "after") {
      const updatedImages = imagesArray.filter((_, i) => i !== key);
      setImagesArray(updatedImages);
    } else if (type === "before") {
      const updatedBeforeImages = beforeImagesArray.filter((_, i) => i !== key);
      setBeforeImagesArray(updatedBeforeImages);
    }
  };
  const handlePressIn = (index) => {
    const updatedPressedArray = [...isPressedArray];
    updatedPressedArray[index] = true;
    setIsPressedArray(updatedPressedArray);
  };
  const handlePressOut = (index) => {
    const updatedPressedArray = [...isPressedArray];
    updatedPressedArray[index] = false;
    setIsPressedArray(updatedPressedArray);
  };
  const jobAcceptHandle = () => {
    try {
      setLoading(true);
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${access_token}`);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(`${helpers.api.baseUrl}trip/${bookingDetail?.id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log("JOB ACCEPT RESPONSE =====> ", result);
          if (result?.error === undefined) {
            getBookingDetailHandle("home");
          } else if (
            result?.error === "token_invalid" ||
            result?.error === "token_expired"
          ) {
            AsyncStorage.removeItem("access_token");
            AsyncStorage.removeItem("user_detail");
            AsyncStorage.removeItem("user_location");
            navigation.replace("Login");
            alert("Session Expired!");
          }
        })
        .catch((error) => {
          console.log(error?.message);
        });
    } catch (error) {
      console.log(error?.message);
    }
  };
  const statusUpdatedHandle = (status) => {
    try {
      setLoading(true);
      const myHeaders = new Headers();
      myHeaders.append("X-Requested-With", "XMLHttpRequest");
      myHeaders.append("Authorization", `Bearer ${access_token}`);

      const formdata = new FormData();
      formdata.append("status", status);
      formdata.append("_method", "PATCH");

      console.log("status ====> ", status);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };

      fetch(`${helpers.api.baseUrl}trip/${bookingDetail?.id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log("UPDATE STATUS RESPONSE =====> ", result);
          if (result?.error === undefined) {
            getBookingDetailHandle("home");
          } else if (
            result?.error === "token_invalid" ||
            result?.error === "token_expired"
          ) {
            AsyncStorage.removeItem("access_token");
            AsyncStorage.removeItem("user_detail");
            AsyncStorage.removeItem("user_location");
            navigation.replace("Login");
            alert("Session Expired!");
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log(error?.message);
        });
    } catch (error) {
      setLoading(false);
      console.log(error?.message);
    }
  };
  const submitBeforeDetailHandle = () => {
    try {
      if (beforeImagesArray?.length === 0) {
        alert("Please upload atleast one image");
      } else if (beforeDescription === "") {
        alert("Please enter job description");
      } else {
        uploadBeforeImagesHandle();
      }
    } catch (error) {
      console.log(error?.message);
    }
  };
  const uploadBeforeImagesHandle = () => {
    try {
      setButtonLoader(true);
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${access_token}`);

      const formdata = new FormData();
      formdata.append("type", "before");
      formdata.append("request_id", detail?.id);
      formdata.append("before_description", beforeDescription);
      beforeImagesArray?.map((image) => {
        formdata.append("before_image[]", image);
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };

      fetch(`${helpers.api.baseUrl}ride/detail`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result?.status) {
            setBeforeImagesArray([]);
            setBeforeDescription("");
            ToastMessage(result?.msg);
            setOptionsModalVisible(false);
            scheduleJobHandle();
            getBookingDetailHandle("redirect");
          } else {
            alert(result?.msg);
            setButtonLoader(false);
          }
          console.log(result);
        })
        .catch((error) => {
          alert(error?.message);
          setButtonLoader(false);
        });
    } catch (error) {
      alert(error?.message);
      setButtonLoader(false);
    }
  };
  const scheduleJobHandle = () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${access_token}`);

      const formdata = new FormData();
      formdata.append("request_id", detail?.id);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };

      fetch(`${helpers.api.baseUrl}start-schedule`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log("result =====> ", result);
        })
        .catch((error) => {
          console.log("error =====> ", error?.message);
        });
    } catch (error) {
      console.log("error =====> ", error?.message);
    }
  };
  const viewOnMapHandle = () => {
    var coordinates;
    if (
      bookingDetail?.d_latitude[0] === null ||
      bookingDetail?.d_longitude[0] === null
    ) {
      coordinates = `${bookingDetail?.s_latitude},${bookingDetail?.s_longitude}`;
    } else {
      coordinates = `${bookingDetail?.d_latitude[0]},${bookingDetail?.d_longitude[0]}`;
    }
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates}&travelmode=driving`;
    Linking.openURL(url);
  };
  const customerImagesRenderItem = ({ item, index }) => {
    return (
      <View
        key={index}
        style={{
          flexDirection: "row",
          position: "relative",
          justifyContent: "center",
          width: "49%",
          marginRight: 6,
          marginBottom: 12,
        }}
      >
        <Image
          source={{ uri: item }}
          style={{
            width: "100%",
            height: 100,
            borderWidth: 1,
            borderColor: "#CCC",
            borderRadius: 6,
            resizeMode: "cover",
          }}
        />
      </View>
    );
  };
  const afterImagesRenderItem = ({ item, index }) => {
    return (
      <View
        key={index}
        style={{
          flexDirection: "row",
          position: "relative",
          justifyContent: "center",
          width: "49%",
          marginRight: 6,
          marginBottom: 12,
        }}
      >
        <Image
          source={{ uri: item?.uri === undefined ? item : item?.uri }}
          style={{
            width: "100%",
            height: 100,
            borderWidth: 1,
            borderColor: "#CCC",
            borderRadius: 6,
            resizeMode: "cover",
          }}
        />
        {item?.uri !== undefined && (
          <>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{ position: "absolute", bottom: 8, right: 8 }}
              onPress={() => handleImagePress("after", "edit", index)}
            >
              <Image
                style={{ height: 30, width: 30, resizeMode: "cover" }}
                source={require("../../assets/images/pen-circle.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{ position: "absolute", bottom: 8, right: 42 }}
              onPress={() => removeImageHandle("after", index)}
            >
              <Image
                style={{ height: 30, width: 30, resizeMode: "cover" }}
                source={require("../../assets/images/trash-circle.png")}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  };
  const beforeImagesRenderItem = ({ item, index }) => {
    return (
      <View
        key={index}
        style={{
          flexDirection: "row",
          position: "relative",
          justifyContent: "center",
          width: "49%",
          marginRight: 6,
          marginBottom: 12,
        }}
      >
        <Image
          source={{ uri: item?.uri === undefined ? item : item?.uri }}
          style={{
            width: "100%",
            height: 100,
            borderWidth: 1,
            borderColor: "#CCC",
            borderRadius: 6,
            resizeMode: "cover",
          }}
        />
        {item?.uri !== undefined && (
          <>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{ position: "absolute", bottom: 8, right: 8 }}
              onPress={() => handleImagePress("before", "edit", index)}
            >
              <Image
                style={{ height: 30, width: 30, resizeMode: "cover" }}
                source={require("../../assets/images/pen-circle.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{ position: "absolute", bottom: 8, right: 42 }}
              onPress={() => removeImageHandle("before", index)}
            >
              <Image
                style={{ height: 30, width: 30, resizeMode: "cover" }}
                source={require("../../assets/images/trash-circle.png")}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  };
  const EmployeeCard = ({
    avatar,
    name,
    designation,
    isPressed,
    onPressIn,
    onPressOut,
  }) => {
    return (
      <TouchableOpacity
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[
          styles.employeeCard,
          { backgroundColor: isPressed ? Colors.Primary : "#FFF" },
        ]}
      >
        <View>
          <Image
            source={avatar}
            style={[
              styles.avatar,
              { color: isPressed ? "#FFF".primaryColor : Colors.Primary },
            ]}
          />
          <View style={styles.textContainer}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.designation}>{designation}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading?<Loader />:null}
      <CustomStatusBar
        barStyle={"light-content"}
        backgroundColor={Colors.Primary}
      />
      <Header
        backArrow={true}
        title={"Booking Detail"}
        backPage={() => navigation.goBack()}
      />
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 20,
          marginVertical: 15,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab(1)}
          style={[
            styles.tabStyle,
            {
              borderBottomColor: activeTab === 1 ? Colors.Primary : "#CCC",
            },
          ]}
        >
          <Text
            style={[
              styles.tabTextStyle,
              { color: activeTab === 1 ? Colors.Primary : "gray" },
            ]}
          >
            Booking Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab(2)}
          style={[
            styles.tabStyle,
            {
              borderBottomColor: activeTab === 2 ? Colors.Primary : "#CCC",
            },
          ]}
        >
          <Text
            style={[
              styles.tabTextStyle,
              { color: activeTab === 2 ? Colors.Primary : "gray" },
            ]}
          >
            Status
          </Text>
        </TouchableOpacity>
      </View>
      {activeTab === 1 ? (
        <ScrollView
          refreshControl={
            <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
          }
        >
          {/* <View style={{flexDirection:'row',marginHorizontal:12}}>
        {bookingDetail?.paid!==0&&
        bookingDetail?.status?.toLowerCase()==='pending'||
        bookingDetail?.status?.toLowerCase()==='cancelled'?
          <View style={{flex:1}}></View>
        :
          <TouchableOpacity
            activeOpacity={.7}
            onPress={() => navigation.navigate("Edit Booking", {
              bookingDetail: bookingDetail
            })}
            style={{flex:1,justifyContent:'center',alignItems:'center',paddingVertical:12,
            backgroundColor:Colors.Primary,borderRadius:6,elevation:5,marginRight:6}}>
            <Text style={{fontSize:16,color:"#ffff",fontWeight:"bold"}}>
              Edit Booking
            </Text>
          </TouchableOpacity>
        }
        {bookingDetail?.status?.toLowerCase()==='in_progress'||
        bookingDetail?.status?.toLowerCase()==='resume'||
        bookingDetail?.status?.toLowerCase()==='completed'?
          <TouchableOpacity
            activeOpacity={.7}
            onPress={() => navigation.navigate("Invoice", {
              bookingDetail: bookingDetail,
            })}
            style={{flex:1,justifyContent:'center',alignItems:'center',elevation:5,
            paddingVertical:12,backgroundColor:'#ededed',borderRadius:6,marginLeft:6}}>
            <Text style={{fontSize:16,color:Colors.Primary,fontWeight:"bold"}}>
              View Invoice
            </Text>
          </TouchableOpacity>
        :
          <View style={{flex:1}}></View>
        }
      </View> */}
          <View style={styles.boxStyle}>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Text style={styles.headingStyle}>
                  {bookingDetail?.booking_id}
                </Text>
              </View>
              {bookingDetail?.status?.toLowerCase() === "ontheway" ||
              bookingDetail?.status?.toLowerCase() === "arrived" ||
              bookingDetail?.status?.toLowerCase() === "in_progress" ||
              bookingDetail?.status?.toLowerCase() === "pause" ||
              bookingDetail?.status?.toLowerCase() === "pauseed" ||
              bookingDetail?.status?.toLowerCase() === "resume" ? (
                <View style={{ justifyContent: "center" }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={viewOnMapHandle}
                    style={{
                      backgroundColor: "#cce5ff",
                      borderRadius: 20,
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: Colors.Primary,
                        fontWeight: "600",
                      }}
                    >
                      View on Map
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
            <View style={{ flexDirection: "row", marginVertical: 6 }}>
              <View style={{ justifyContent: "center" }}>
                <Text
                  style={{ fontWeight: "600", fontSize: 16, color: "#000" }}
                >
                  Booking status:
                </Text>
              </View>
              <View style={{ justifyContent: "center", paddingLeft: 6 }}>
                <Text
                  style={{
                    color: Colors.Primary,
                    fontSize: 14,
                    fontWeight:"bold",
                    textTransform: "uppercase",
                  }}
                >
                  {bookingDetail?.status}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", marginTop: 4 }}>
              <View style={{ justifyContent: "center" }}>
                <Image
                  source={require("../../assets/images/calendar.png")}
                  style={{
                    height: 16,
                    width: 16,
                    tintColor: Colors.Primary,
                  }}
                />
              </View>
              <View
                style={{ flex: 1, justifyContent: "center", marginLeft: 8 }}
              >
                <Text style={styles.dateStyle}>
                  Booking Date:{" "}
                  {moment(bookingDetail?.assigned_at).format(
                    "D MMMM, YYYY h:mm"
                  )}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", marginTop: 6 }}>
              <View style={{ justifyContent: "center" }}>
                <Image
                  source={require("../../assets/images/calendar.png")}
                  style={{
                    height: 16,
                    width: 16,
                    tintColor: Colors.Primary,
                  }}
                />
              </View>
              <View
                style={{ flex: 1, justifyContent: "center", marginLeft: 8 }}
              >
                <Text style={styles.dateStyle}>
                  Schedule Date:{" "}
                  {moment(bookingDetail?.schedule_at).format(
                    "D MMMM, YYYY h:mm"
                  )}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", marginTop: 6 }}>
              <View style={{ justifyContent: "center" }}>
                <Image
                  source={require("../../assets/images/map-pin.png")}
                  style={{
                    height: 16,
                    width: 16,
                    tintColor: Colors.Primary,
                  }}
                />
              </View>
              <View
                style={{ flex: 1, justifyContent: "center", marginLeft: 8 }}
              >
                <Text style={styles.dateStyle}>
                  {bookingDetail?.s_address}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Text style={styles.headingStyle}>
                  Payment Method
                </Text>
              </View>
              <View style={{ flex: 1, justifyContent: "center" }}>
                {/* <TouchableOpacity
                  style={{
                    backgroundColor: theme.color.primaryColor,
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 20,
                    elevation: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: theme.color.white,
                    }}
                  >
                    Change Payment Method
                  </Text>
                </TouchableOpacity> */}
              </View>
            </View>
            <View style={{flexDirection:"row",marginTop:6}}></View>
            <View style={{flex:1,justifyContent:"center"}}>
              <Text style={[styles.dateStyle,{fontWeight:"bold"}]}>
                Payment Status: {bookingDetail?.paid===0?"Unpaid":"Paid"}
              </Text>
            </View>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text style={[styles.dateStyle, { fontWeight: "bold" }]}>
                Payment Method: {bookingDetail?.payment_mode}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "flex-start",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.priceStyle}>Total Amount:</Text>
                <Text style={styles.priceStyle}>
                  {helpers.constant.currencyName}{" "}
                  {bookingDetail?.payment === null
                    ? 0
                    : bookingDetail?.payment?.payable}
                </Text>
              </View>
            </View>
          </View>
          <View style={[styles.boxStyle, { padding: 0 }]}>
            <View style={{ paddingHorizontal: 12, paddingVertical: 6 }}>
              {serviceDetails?.map((item, index) => (
                <View key={index} style={styles.questionContainer}>
                  <Text style={styles.questionText}>{item}</Text>
                </View>
              ))}
            </View>
            <Text
              style={{
                fontWeight:"bold",
                color: Colors.Primary,
                paddingHorizontal: 12,
                paddingBottom: 10,
                fontSize: 16,
                textDecorationColor: "#000",
                textDecorationLine: "underline",
              }}
            >
              Booking Summary
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 12,
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
            {bookingDetail?.service_type?.length!==undefined&&
            bookingDetail?.service_type?.map((val, key) => {
              const jobDetail = val?.edit_jobs[0];
              let service_details = [];
              if (jobDetail?.service_details!==undefined) {
                service_details = JSON.parse(jobDetail?.service_details)
              };
              return (
                <View key={key} style={{paddingHorizontal:12}}>
                  <View style={{flexDirection:"row",marginTop:12}}>
                    <View style={{flex:1,justifyContent:"center"}}>
                      <Text style={{fontWeight:"bold",color:"#000",fontSize:15}}>
                        {val?.name}
                      </Text>
                    </View>
                    <View style={{justifyContent:"center"}}>
                      {val?.calculator==="FIXED"?
                        <Text style={{fontWeight:"bold",color:"#004085",fontSize:16}}>
                          {`${helpers.constant.currencyName} ${val?.price}`}
                        </Text>
                      :
                        <Text style={{fontWeight:"bold",color:"#004085",fontSize:16}}>
                          {`${helpers.constant.currencyName} ${(val?.price).toFixed(2)}`}
                        </Text>
                      }
                    </View>
                  </View>
                  <View style={{flexDirection:'row'}}>
                    <View style={{flex:1,justifyContent:"center"}}>
                      {val?.calculator==="FIXED"?
                        <>
                          <Text style={styles.subHeadingStyle}>
                            Unit Price: {`${helpers.constant.currencyName} ${val?.price.toFixed(2)}`}
                          </Text>
                          <Text style={styles.subHeadingStyle}>
                            Unit: {val?.calculator}
                          </Text>
                        </>
                      :
                        <>
                          <Text style={styles.subHeadingStyle}>
                            Unit Price: {val?.price?.toFixed(2)}
                          </Text>
                          <Text style={styles.subHeadingStyle}>
                            Unit: {val?.calculator}
                          </Text>
                          <Text style={styles.subHeadingStyle}>
                            Quantity: Minimum {val?.minimum_charges} hour Charges
                          </Text>
                        </>
                      }
                    </View>
                    {key===0?
                      <View style={{flex:.8,justifyContent:"flex-end"}}>
                        {bookingDetail?.status?.toLowerCase()==="arrived"||
                        bookingDetail?.status?.toLowerCase()==="in_progress"||
                        bookingDetail?.status?.toLowerCase()==="resume"||
                        bookingDetail?.status?.toLowerCase()==="pause"||
                        bookingDetail?.status?.toLowerCase()==="paused"?
                          <TouchableOpacity
                            activeOpacity={0.7}
                            style={{borderRadius:100,
                            backgroundColor:Colors.Primary,padding:8}}
                            onPress={() => {
                              if (bookingDetail?.status==="IN_PROGRESS"||bookingDetail?.status==="RESUME"||
                                bookingDetail?.status==="PAUSE"||bookingDetail?.status==="PAUSED") {
                                navigation.navigate("Booking Period",{
                                  booking_detail: bookingDetail,
                                });
                              } else {
                                setServiceTypeID(bookingDetail?.id);
                                setOptionsModalVisible(true);
                              };
                            }}>
                            <Text style={[styles.assignedTextStyle,{fontSize:12}]}>
                              {bookingDetail?.status==="IN_PROGRESS"||bookingDetail?.status==="RESUME"||
                              bookingDetail?.status==="PAUSE"||bookingDetail?.status==="PAUSED"?"View Job Timer":"Mark as Start"}
                            </Text>
                          </TouchableOpacity>
                        :null}
                      </View>
                    :
                      <View style={{flex:.8,justifyContent:"flex-end"}}>
                        {jobDetail?.status?.toLowerCase()==="in_progress"||
                        jobDetail?.status?.toLowerCase()==="resume"||
                        jobDetail?.status?.toLowerCase()==="pause"||
                        jobDetail?.status?.toLowerCase()==="paused"?
                          <TouchableOpacity
                            activeOpacity={0.7}
                            style={{backgroundColor:Colors.Primary,borderRadius:100,padding:8}}
                            onPress={() => {
                              if (jobDetail?.status==="IN_PROGRESS"||jobDetail?.status==="RESUME"||
                                jobDetail?.status==="PAUSE"||jobDetail?.status==="PAUSED") {
                                navigation.navigate("Booking Period",{
                                  booking_detail: jobDetail,
                                });
                              };
                            }}>
                            <Text style={[styles.assignedTextStyle,{fontSize:12}]}>
                              View Job Timer
                            </Text>
                          </TouchableOpacity>
                        :null}
                      </View>
                    }
                  </View>
                  {key===0?
                    bookingDetail?.service_details?.map((item, index) => {
                      return (
                        <View key={index} style={{marginTop:index===0?8:4}}>
                          <View style={{flexDirection:"row"}}>
                            <Image
                              source={require('../../assets/images/checkIcon01.png')}
                              style={{height:16,width:16,resizeMode:"cover",marginRight:8}}
                            />
                            <Text style={{fontSize:14,color:"#000"}}>
                              {item?.option}
                            </Text>
                          </View>
                        </View>
                      )
                    })
                  :
                    service_details!==undefined&&
                    service_details?.map((item, index) => {
                      return (
                        <View key={index} style={{marginTop:index===0?8:4}}>
                          <View style={{flexDirection:"row"}}>
                            <Image
                              source={require('../../assets/images/tick.png')}
                              style={{height:16,width:16,resizeMode:"cover",marginRight:8}}
                            />
                            <Text style={{fontSize:14,color:"#000"}}>
                              {item}
                            </Text>
                          </View>
                        </View>
                      )
                    })
                  }
                </View>
              )
            })}
            <View style={styles.subTotal}>
              <View style={styles.subPrice}>
                <View style={{justifyContent:"center"}}>
                  <Text style={[styles.headingStyle,{fontSize:14}]}>
                    Sub Total
                  </Text>
                </View>
                <View style={{justifyContent:"center"}}>
                  <Text style={styles.priceStyle}>
                    {helpers.constant.currencyName} {bookingDetail?.payment===null?0:bookingDetail?.payment?.fixed?.toFixed(2)}
                  </Text>
                </View>
              </View>
              <View style={styles.subPrice}>
                <View style={{justifyContent:"center"}}>
                  <Text style={[styles.headingStyle,{fontSize:14}]}>
                    Services Tax
                  </Text>
                </View>
                <View style={{justifyContent:"center"}}>
                  <Text style={styles.priceStyle}>
                    {helpers.constant.currencyName} {bookingDetail?.payment===null?0:bookingDetail?.payment?.tax?.toFixed(2)}
                  </Text>
                </View>
              </View>
              <View style={styles.subPrice}>
                <View style={{justifyContent:"center"}}>
                  <Text style={[styles.headingStyle,{fontSize:14}]}>
                    Coupon discount
                  </Text>
                </View>
                <View style={{justifyContent:"center"}}>
                  <Text style={styles.priceStyle}>
                    (-) {helpers.constant.currencyName} {bookingDetail?.payment?.discount?.toFixed(2)}
                  </Text>
                </View>
              </View>
              <View style={styles.subPrice}>
                <View style={{justifyContent:"center"}}>
                  <Text style={[styles.headingStyle,{fontSize:14}]}>
                    Wallet Detection
                  </Text>
                </View>
                <View style={{justifyContent:"center"}}>
                  <Text style={styles.priceStyle}>
                    {helpers.constant.currencyName} {bookingDetail?.use_wallet?.toFixed(2)}
                  </Text>
                </View>
              </View>
              <View style={styles.subPrice}>
                <View style={{justifyContent:"center"}}>
                  <Text style={[styles.headingStyle,{fontSize:14}]}>
                    Card Detection
                  </Text>
                </View>
                <View style={{justifyContent:"center"}}>
                  <Text style={styles.priceStyle}>
                    {helpers.constant.currencyName} {bookingDetail?.payment===null?0:bookingDetail?.payment?.card}
                  </Text>
                </View>
              </View>
              <View style={styles.subPrice}>
                <View style={{justifyContent:"center"}}></View>
              </View>
              <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
                <View style={{justifyContent:"center"}}>
                  <Text style={{color:'#004085',fontSize:20,fontWeight:"bold"}}>
                    Grand total
                  </Text>
                </View>
                <View style={{justifyContent:"center"}}>
                  <Text style={{color:'#004085',fontSize:20,fontWeight:"bold"}}>
                    {helpers.constant.currencyName} {bookingDetail?.payment===null?0:bookingDetail?.payment?.payable?.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {bookingDetail?.status?.toLowerCase()!=="pending"&&
            <>
              <View style={{paddingHorizontal:10,paddingVertical:10}}>
                <Text style={{fontWeight:"bold",fontSize:18,color:Colors.Primary,marginVertical:10}}>
                  Serviceman Info
                </Text>
                <View style={styles.container1}>
                  <Image
                    style={[styles.avatar,{resizeMode:"contain"}]}
                    source={
                      bookingDetail?.user?.picture === null ||
                      bookingDetail?.user?.picture === "" ||
                      bookingDetail?.user?.picture === undefined
                        ? require("../../assets/images/placeholder.webp"):{uri:bookingDetail?.user?.picture}}
                  />
                  <View style={{ marginTop: 4 }}>
                    <Text style={styles.name}>
                      {bookingDetail?.user?.first_name}{" "}
                      {bookingDetail?.user?.last_name}
                    </Text>
                    <Text style={styles.number}>
                      {bookingDetail?.user?.mobile}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 6,
                      justifyContent: "center",
                      width: "100%",
                      height: "auto",
                      gap: 20,
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={{ width: 40, height: 40 }}
                      onPress={() =>
                        Linking.openURL(`tel:${bookingDetail?.user?.mobile}`)
                      }
                    >
                      <Image
                        style={{ width: "100%", height: "100%" }}
                        source={require("../../assets/images/call.png")}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={{ width: 40, height: 40 }}
                      onPress={() =>
                        navigation.navigate("chat", {
                          receiverId: bookingDetail?.user?.id,
                          receiverName: `${bookingDetail?.user?.first_name} ${bookingDetail?.user?.last_name}`,
                        })
                      }
                    >
                      <Image
                        style={{ width: "100%", height: "100%" }}
                        source={require("../../assets/images/icons8-message-48.png")}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={{ width: 40, height: 40 }}
                      onPress={() => navigation.navigate("Help")}
                    >
                      <Image
                        style={{ width: "100%", height: "100%" }}
                        source={require("../../assets/images/icons8-help-48.png")}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={{paddingHorizontal:10,paddingVertical:10}}>
                <Text style={{fontWeight:"bold",fontSize:18,color:Colors.Primary,marginVertical:10}}>
                  Fleet Info
                </Text>
                <View style={styles.container1}>
                  <Image
                    style={[styles.avatar, { resizeMode: "contain" }]}
                    source={
                      bookingDetail?.user?.picture === null ||
                      bookingDetail?.user?.picture === "" ||
                      bookingDetail?.user?.picture === undefined
                        ? require("../../assets/images/placeholder.webp")
                        : { uri: bookingDetail?.user?.picture }
                    }
                  />
                  <View style={{ marginTop: 4 }}>
                    <Text style={styles.name}>
                      {bookingDetail?.user?.first_name}{" "}
                      {bookingDetail?.user?.last_name}
                    </Text>
                    <Text style={styles.number}>
                      {bookingDetail?.user?.mobile}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      width: "100%",
                      height: "auto",
                      marginTop: 6,
                      gap: 20,
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={{ width: 40, height: 40 }}
                      onPress={() =>
                        Linking.openURL(`tel:${bookingDetail?.user?.mobile}`)
                      }
                    >
                      <Image
                        style={{ width: "100%", height: "100%" }}
                        source={require("../../assets/images/call.png")}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={{ width: 40, height: 40 }}
                      onPress={() =>
                        navigation.navigate("chat", {
                          receiverId: bookingDetail?.user?.id,
                          receiverName: `${bookingDetail?.user?.first_name} ${bookingDetail?.user?.last_name}`,
                        })
                      }
                    >
                      <Image
                        style={{ width: "100%", height: "100%" }}
                        source={require("../../assets/images/icons8-message-48.png")}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={{ width: 40, height: 40 }}
                      onPress={() => navigation.navigate("Help")}
                    >
                      <Image
                        style={{ width: "100%", height: "100%" }}
                        source={require("../../assets/images/icons8-help-48.png")}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </>
          }
          <View style={styles.container}>
            <Text
              style={{
                fontWeight:"bold",
                fontSize: 18,
                color: Colors.Primary,
                margin: 12,
              }}
            >
              Customer Images
            </Text>
            <FlatList
              numColumns={2}
              data={customerImages}
              style={{ marginHorizontal: 12 }}
              renderItem={customerImagesRenderItem}
              keyExtractor={(item, index) => index}
            />
            {customerImages?.length === 0 && (
              <View style={styles.imageContainer}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    marginRight: 4,
                  }}
                >
                  <Image
                    style={[styles.image, { resizeMode: "contain" }]}
                    source={require("../../assets/images/placeholder.webp")}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    marginLeft: 4,
                  }}
                >
                  <Image
                    style={[styles.image, { resizeMode: "contain" }]}
                    source={require("../../assets/images/placeholder.webp")}
                  />
                </View>
              </View>
            )}
            <View style={{ marginHorizontal: 12 }}>
              <Text
                style={[
                  styles.headingStyle,
                  { color: Colors.Primary, fontSize: 18 },
                ]}
              >
                Customer Description
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "gray",
                  marginTop: 6,
                  marginBottom: 20,
                  textTransform: "capitalize",
                }}
              >
                {bookingDetail?.description}
              </Text>
            </View>
          </View>
          {/* {bookingDetail?.status?.toLowerCase()==='pending'&&
        <View style={{flexDirection:'row',marginHorizontal:12,marginBottom:20}}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={jobAcceptHandle}
            style={styles.assignedStyle}>
            <Text style={styles.assignedTextStyle}>
              Mark as Accepted
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.viewDetailsStyle}
            onPress={() => statusUpdatedHandle("CANCELLED")}>
            <Text style={styles.viewDetailsTextStyle}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      } */}
          {bookingDetail?.status?.toLowerCase() === "in_progress" ||
          bookingDetail?.status?.toLowerCase() === "completed" ? (
            <View style={styles.container}>
              <Text
                style={{
                  fontWeight:"bold",
                  fontSize: 18,
                  color: Colors.Primary,
                  margin: 12,
                  marginTop: 0,
                }}
              >
                Work Start Images
              </Text>
              <FlatList
                numColumns={2}
                data={beforeImagesArray}
                style={{ marginHorizontal: 12 }}
                renderItem={beforeImagesRenderItem}
                keyExtractor={(item, index) => index}
              />
              {beforeImagesArray?.length === 0 && (
                <View style={styles.imageContainer}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      marginRight: 4,
                    }}
                  >
                    <Image
                      style={[styles.image, { resizeMode: "contain" }]}
                      source={require("../../assets/images/placeholder.webp")}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      marginLeft: 4,
                    }}
                  >
                    <Image
                      style={[styles.image, { resizeMode: "contain" }]}
                      source={require("../../assets/images/placeholder.webp")}
                    />
                  </View>
                </View>
              )}
              <View style={{ marginHorizontal: 12 }}>
                <Text
                  style={[
                    styles.headingStyle,
                    { color: Colors.Primary, fontSize: 18 },
                  ]}
                >
                  Work Start Description
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: "gray",
                    marginTop: 6,
                    marginBottom: 20,
                    textTransform: "capitalize",
                  }}
                >
                  {bookingDetail?.before_description}
                </Text>
              </View>
            </View>
          ) : null}
          {bookingDetail?.status?.toLowerCase() === "scheduled" && (
            <View style={{ marginHorizontal: 12, marginBottom: 20 }}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.assignedStyle, { marginRight: 0 }]}
                onPress={() => statusUpdatedHandle("ONTHEWAY")}
              >
                <Text style={styles.assignedTextStyle}>
                  Mark as On The Way
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {bookingDetail?.status?.toLowerCase() === "ontheway" && (
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: 12,
                marginBottom: 20,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={viewOnMapHandle}
                style={[
                  styles.viewDetailsStyle,
                  { flexDirection: "row", gap: 5 },
                ]}
              >
                <Image
                  style={{ width: 20, height: 25, resizeMode: "cover" }}
                  source={require("../../assets/images/security-pin_6125244.png")}
                />
                <Text style={{ fontWeight:"bold", color: "#000" }}>
                  Track Serviceman
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {
            // bookingDetail?.status?.toLowerCase()==='in_progress'||
            bookingDetail?.status?.toLowerCase() === "completed" ? (
              <View style={styles.container}>
                <View
                  style={{ flexDirection: "row", margin: 12, marginTop: 0 }}
                >
                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text
                      style={{
                        fontWeight:"bold",
                        fontSize: 18,
                        color: Colors.Primary,
                      }}
                    >
                      Work End Images
                    </Text>
                  </View>
                  {/* <View style={{justifyContent:"center"}}>
              <TouchableOpacity
                activeOpacity={.7}
                // onPress={handleEditImages}
                style={{backgroundColor:Colors.Primary,paddingHorizontal:20,
                height:35,justifyContent:"center",alignItems:"center",borderRadius:6}}>
                <Text style={{color:"#FFF",fontWeight:"bold",fontSize:14,fontWeight:"bold",textAlign:"center"}}>
                  Edit images
                </Text>
              </TouchableOpacity>
            </View> */}
                </View>
                {/* {bookingDetail?.status?.toLowerCase()==="resume"||
          bookingDetail?.status?.toLowerCase()==="in_progress"?
            <TouchableOpacity
              activeOpacity={.7}
              onPress={() => handleImagePress("after", "add", 0)}
              style={{flexDirection:"row",paddingBottom:12,marginHorizontal:12}}>
              <View style={{justifyContent:"center",marginRight:8}}>
                <Image
                  source={require('../../../assets/images/plus-circle.png')}
                  style={{height:20,width:20,resizeMode:"cover",tintColor:Colors.Primary}}
                />
              </View>
              <View style={{flex:1,justifyContent:"center"}}>
                <Text style={{fontSize:14,color:"#000",fontWeight:"bold"}}>
                  Add Images
                </Text>
              </View>
            </TouchableOpacity>
          :null} */}
                <FlatList
                  numColumns={2}
                  data={imagesArray}
                  style={{ marginHorizontal: 12 }}
                  keyExtractor={(item) => item.id}
                  renderItem={afterImagesRenderItem}
                />
                {imagesArray?.length === 0 && (
                  <View style={styles.imageContainer}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        marginRight: 4,
                      }}
                    >
                      <Image
                        style={[styles.image, { resizeMode: "contain" }]}
                        source={require("../../assets/images/placeholder.webp")}
                      />
                    </View>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        marginLeft: 4,
                      }}
                    >
                      <Image
                        style={[styles.image, { resizeMode: "contain" }]}
                        source={require("../../assets/images/placeholder.webp")}
                      />
                    </View>
                  </View>
                )}
                <View style={{ paddingHorizontal: 12 }}>
                  <Text
                    style={{
                      fontWeight:"bold",
                      fontSize: 18,
                      color: Colors.Primary,
                    }}
                  >
                    Signature
                  </Text>
                  <Image
                    style={[
                      styles.image,
                      {
                        resizeMode: "cover",
                        marginVertical: 12,
                        height: 140,
                      },
                    ]}
                    source={
                      bookingDetail?.signature_image === "" ||
                      bookingDetail?.signature_image === null ||
                      bookingDetail?.signature_image === undefined
                        ? require("../../assets/images/placeholder.webp")
                        : { uri: bookingDetail?.signature_image }
                    }
                  />
                </View>
              </View>
            ) : null
          }
          {bookingDetail?.status?.toLowerCase() === "arrived" ||
          bookingDetail?.status?.toLowerCase() === "in_progress" ||
          bookingDetail?.status?.toLowerCase() === "resume" ||
          bookingDetail?.status?.toLowerCase() === "pause" ||
          bookingDetail?.status?.toLowerCase() === "paused" ? (
            <View style={{ marginHorizontal: 12, marginBottom: 20 }}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.assignedStyle, { marginRight: 0 }]}
                onPress={() => {
                  if (
                    bookingDetail?.status === "IN_PROGRESS" ||
                    bookingDetail?.status === "RESUME" ||
                    bookingDetail?.status === "PAUSE" ||
                    bookingDetail?.status === "PAUSED"
                  ) {
                    navigation.navigate("Booking Period", {
                      booking_detail: bookingDetail,
                    });
                  } else {
                    setOptionsModalVisible(true);
                  }
                }}
              >
                <Text style={styles.assignedTextStyle}>
                  {bookingDetail?.status === "IN_PROGRESS" ||
                  bookingDetail?.status === "RESUME" ||
                  bookingDetail?.status === "PAUSE" ||
                  bookingDetail?.status === "PAUSED"
                    ? "View Job Timer"
                    : "Mark as Start"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
          {bookingDetail?.status?.toLowerCase() === "resume" &&
          bookingDetail?.status?.toLowerCase() === "in_progress" &&
          bookingDetail?.paid === 0 &&
          bookingDetail?.payment_mode?.toLowerCase() === "cash" ? (
            <View style={{ marginHorizontal: 12 }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => refPaymentRBSheet.current.open()}
                style={{
                  backgroundColor: Colors.Primary,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 40,
                  width: "100%",
                  borderRadius: 6,
                  elevation: 5,
                  alignSelf: "center",
                  margin: 18,
                }}
              >
                <Text style={{ color: "#FFF", fontWeight:"bold" }}>
                  Payment Recieved
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </ScrollView>
      ) : activeTab === 2 ? (
        <ScrollView style={{ marginTop: 12 }}>
          <View
            style={{
              flexDirection: "row",
              marginTop: 6,
              alignSelf: "center",
            }}
          >
            <View style={{ justifyContent: "center" }}>
              <Text style={[styles.headingStyle, { fontSize: 14 }]}>
                Booking Place:
              </Text>
            </View>
            <View style={{ justifyContent: "center", marginLeft: 4 }}>
              <Text style={styles.subHeadingStyle}>
                {moment(bookingDetail?.assigned_at).format(
                  "D MMMM, YYYY h:mm"
                )}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: 6,
              alignSelf: "center",
            }}
          >
            <View style={{ justifyContent: "center" }}>
              <Text style={[styles.headingStyle, { fontSize: 14 }]}>
                Service Scheduled Date:
              </Text>
            </View>
            <View style={{ justifyContent: "center", marginLeft: 4 }}>
              <Text style={styles.subHeadingStyle}>
                {moment(bookingDetail?.schedule_at).format(
                  "D MMMM, YYYY h:mm"
                )}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: 6,
              alignSelf: "center",
            }}
          >
            <View style={{ justifyContent: "center" }}>
              <Text style={[styles.headingStyle, { fontSize: 14 }]}>
                Payment Status:
              </Text>
            </View>
            <View style={{ justifyContent: "center", marginLeft: 4 }}>
              <Text
                style={[
                  styles.subHeadingStyle,
                  {
                    color: bookingDetail?.paid === 0 ? "red" : "green",
                    fontWeight: "bold",
                  },
                ]}
              >
                {bookingDetail?.paid === 0 ? "Unpaid" : "Paid"}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: 6,
              alignSelf: "center",
            }}
          >
            <View style={{ justifyContent: "center" }}>
              <Text style={[styles.headingStyle, { fontSize: 14 }]}>
                Booking Status:
              </Text>
            </View>
            <View style={{ justifyContent: "center", marginLeft: 4 }}>
              <Text
                style={[
                  styles.subHeadingStyle,
                  { color: Colors.Primary, fontWeight: "bold" },
                ]}
              >
                {bookingDetail?.status}
              </Text>
            </View>
          </View>
          {/* <View style={{flexDirection:'column',alignItems:'center',padding:12,marginTop:20}}>
        <View style={{flexDirection:'row',alignItems:'center',marginBottom:20,marginLeft:20}}>
          {bookingDetail?.accepted_by?.length===0||bookingDetail?.accepted_by===null?null:
          <View style={{position:'absolute',left:10,top:10,bottom:-30,width:1,backgroundColor:'gray',zIndex:-1}} />}
          <View style={{marginRight:12,alignItems:'center'}}>
            <Image
              source={require('../../assets/images/check.png')}
              style={{height:22,width:22,tintColor:Colors.Primary}}
            />
          </View>
          <View style={{flex:1}}>
            <Text style={[styles.subHeadingStyle,{fontSize:16}]}>
              Service Booked by Customer {bookingDetail?.booked_by[0]}
            </Text>
            <Text style={styles.dateStyle}>
              {bookingDetail?.booked_by[1]===undefined||bookingDetail?.booked_by[1]===""?null:
              moment(bookingDetail?.booked_by[1]).format("D MMMM, YYYY h:mm")}
            </Text>
          </View>
        </View>
        <View style={{flexDirection:'row',alignItems:'center',marginBottom:20,marginLeft:20}}>
          {bookingDetail?.assigned_by?.length===0||bookingDetail?.assigned_by===null?null:
          <View style={{position:'absolute',left:10,top:10,bottom:-30,width:1,backgroundColor:'gray',zIndex:-1}} />}
          <View style={{marginRight:12,alignItems:'center'}}>
            <Image
              source={require('../../assets/images/check.png')}
              style={{height:22,width:22,tintColor:Colors.Primary}}
            />
          </View>
          <View style={{flex: 1}}>
            <Text style={[styles.subHeadingStyle,{fontSize:16}]}>
              Service Accepted by Fleet {bookingDetail?.accepted_by[0]}
            </Text>
            <Text style={styles.dateStyle}>
              {bookingDetail?.accepted_by[1]===undefined||bookingDetail?.accepted_by[1]===""?null:
              moment(bookingDetail?.accepted_by[1]).format("D MMMM, YYYY h:mm")}
            </Text>
          </View>
        </View>
        <View style={{flexDirection:'row',alignItems:'center',marginBottom:20,marginLeft:20}}>
          {bookingDetail?.ongoing_by?.length===0||bookingDetail?.ongoing_by===null?null:
          <View style={{position:'absolute',left:10,top:10,bottom:-30,width:1,backgroundColor:'gray',zIndex:-1}} />}
          <View style={{marginRight:12,alignItems:'center'}}>
            <Image
              source={require('../../assets/images/check.png')}
              style={{height:22,width:22,tintColor:Colors.Primary}}
            />
          </View>
          <View style={{flex:1}}>
            <Text style={[styles.subHeadingStyle,{fontSize:16}]}>
              Service Assigned To Serviceman {bookingDetail?.assigned_by[0]}
            </Text>
            <Text style={styles.dateStyle}>
              {bookingDetail?.assigned_by[1]===undefined||bookingDetail?.assigned_by[1]===""?null:
              moment(bookingDetail?.assigned_by[1]).format("D MMMM, YYYY h:mm")}
            </Text>
          </View>
        </View>
        <View style={{flexDirection:'row',alignItems:'center',marginBottom:20,marginLeft:20}}>
          {bookingDetail?.started_by?.length===0||bookingDetail?.started_by===null?null:
          <View style={{position:'absolute',left:10,top:10,bottom:-30,width:1,backgroundColor:'gray',zIndex:-1}} />}
          <View style={{marginRight:12,alignItems:'center'}}>
            <Image
              source={require('../../assets/images/check.png')}
              style={{height:22,width:22,tintColor:Colors.Primary}}
            />
          </View>
          <View style={{flex: 1}}>
            <Text style={[styles.subHeadingStyle,{fontSize:16}]}>
              Service Ongoing by {bookingDetail?.ongoing_by[0]}
            </Text>
            <Text style={styles.dateStyle}>
              {bookingDetail?.ongoing_by[1]===undefined||bookingDetail?.ongoing_by[1]===""?null:
              moment(bookingDetail?.ongoing_by[1]).format("D MMMM, YYYY h:mm")}
            </Text>
          </View>
        </View>
        <View style={{flexDirection:'row',alignItems:'center',marginBottom:20,marginLeft:20}}>
          {bookingDetail?.completed_by?.length===0||bookingDetail?.completed_by===null?null:
          <View style={{position:'absolute',left:10,top:10,bottom:-30,width:1,backgroundColor:'gray',zIndex:-1}} />}
          <View style={{marginRight:12,alignItems:'center'}}>
            <Image
              source={require('../../assets/images/check.png')}
              style={{height:22,width:22,tintColor:Colors.Primary}}
            />
          </View>
          <View style={{flex:1}}>
            <Text style={[styles.subHeadingStyle,{fontSize:16}]}>
              Service Started by {bookingDetail?.started_by[0]}
            </Text>
            <Text style={styles.dateStyle}>
              {bookingDetail?.started_by[1]===undefined||bookingDetail?.started_by[1]===""?null:
              moment(bookingDetail?.started_by[1]).format("D MMMM, YYYY h:mm")}
            </Text>
          </View>
        </View>
        <View style={{flexDirection:'row',alignItems:'center',marginBottom:20,marginLeft:20}}>
          <View style={{marginRight:12,alignItems:'center'}}>
            <Image
              source={require('../../assets/images/check.png')}
              style={{height:22,width:22,tintColor:Colors.Primary}}
            />
          </View>
          <View style={{flex:1}}>
            <Text style={[styles.subHeadingStyle,{fontSize:16}]}>
              Service Completed by {bookingDetail?.completed_by[0]}
            </Text>
            <Text style={styles.dateStyle}>
              {bookingDetail?.completed_by[1]===undefined||bookingDetail?.completed_by[1]===""?null:
              moment(bookingDetail?.completed_by[1]).format("D MMMM, YYYY h:mm")}
            </Text>
          </View>
        </View>
      </View> */}
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              padding: 12,
              marginTop: 20,
            }}
          >
            {[
              {
                label: "Service Booked by Customer",
                detail: bookingDetail?.booked_by,
              },
              {
                label: "Service Accepted by Fleet",
                detail: bookingDetail?.accepted_by,
              },
              {
                label: "Service Assigned To Serviceman",
                detail: bookingDetail?.assigned_by,
              },
              {
                label: "Service Ongoing by",
                detail: bookingDetail?.ongoing_by,
              },
              {
                label: "Service Started by",
                detail: bookingDetail?.started_by,
              },
              {
                label: "Service Completed by",
                detail: bookingDetail?.completed_by,
              },
            ].map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 20,
                  marginLeft: 20,
                }}
              >
                {item.detail?.length === 0 ||
                item.detail === null ? null : (
                  <View
                    style={{
                      position: "absolute",
                      left: 10,
                      top: 10,
                      bottom: -30,
                      width: 1,
                      backgroundColor: "gray",
                      zIndex: -1,
                    }}
                  />
                )}
                <View style={{ marginRight: 12, alignItems: "center" }}>
                  <Image
                    source={require("../../assets/images/check.png")}
                    style={{
                      height: 22,
                      width: 22,
                      tintColor: item.detail?.[1] ? Colors.Primary : "gray",
                    }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.subHeadingStyle, { fontSize: 16 }]}>
                    {item.label} {item.detail?.[0]}
                  </Text>
                  <Text style={styles.dateStyle}>
                    {item.detail?.[1] === undefined ||
                    item.detail?.[1] === ""
                      ? null
                      : moment(item.detail?.[1]).format(
                          "D MMMM, YYYY h:mm"
                        )}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : null}
      <RBSheet
        height={300}
        ref={refRBSheet}
        closeOnDragDown={true}
        customStyles={{
          draggableIcon: { backgroundColor: "#000" },
          wrapper: { backgroundColor: Colors.Primary },
          container: {
            elevation: 10,
            backgroundColor: "#FFF",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight:"bold",
            color: Colors.Primary,
            paddingHorizontal: 25,
            padding: 20,
          }}
        >
          Select Serviceman
        </Text>
        <ScrollView>
          <View style={styles.employeeContainer}>
            <EmployeeCard
              name={"Ibrahim Altaf"}
              designation={"Plumber"}
              isPressed={isPressedArray[0]}
              onPressIn={() => handlePressIn(0)}
              onPressOut={() => handlePressOut(0)}
              avatar={require("../../assets/images/serviceman.webp")}
            />
            <EmployeeCard
              name={"Abbas"}
              designation={"Electrician"}
              isPressed={isPressedArray[1]}
              onPressIn={() => handlePressIn(1)}
              onPressOut={() => handlePressOut(1)}
              avatar={require("../../assets/images/serviceman.webp")}
            />
            <EmployeeCard
              name={"Haris"}
              designation={"Plumber"}
              isPressed={isPressedArray[2]}
              onPressIn={() => handlePressIn(2)}
              onPressOut={() => handlePressOut(2)}
              avatar={require("../../assets/images/serviceman.webp")}
            />
            <EmployeeCard
              name={"Shahzar"}
              designation={"Electrician"}
              isPressed={isPressedArray[3]}
              onPressIn={() => handlePressIn(3)}
              onPressOut={() => handlePressOut(3)}
              avatar={require("../../assets/images/serviceman.webp")}
            />
          </View>
        </ScrollView>
      </RBSheet>
      {/* BEFORE IMAGES MODAL */}
      <Modal
        transparent={true}
        statusBarTranslucent
        animationType={"fade"}
        visible={optionsModalVisible}
        onRequestClose={() => setOptionsModalVisible(false)}
      >
        <View style={[styles.modalContainer, { paddingHorizontal: 26 }]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "padding"}
            style={{
              flex: 1,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={styles.optionsContainer}>
              <View style={{ flexDirection: "row", marginBottom: 12 }}>
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Text style={styles.sectionTitle}>Upload Images</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setBeforeImagesArray([]);
                    setBeforeDescription("");
                    setOptionsModalVisible(false);
                  }}
                  style={{
                    justifyContent: "center",
                    height: 30,
                    width: 30,
                    borderRadius: 6,
                    alignItems: "center",
                    backgroundColor: Colors.Primary,
                  }}
                >
                  <Image
                    source={require("../../assets/images/close.png")}
                    style={{
                      height: 12,
                      width: 12,
                      resizeMode: "contain",
                      tintColor: "#FFF",
                    }}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{ flexDirection: "row", paddingBottom: 12 }}
                onPress={() => handleImagePress("before", "add", 0)}
              >
                <View style={{ justifyContent: "center", marginRight: 8 }}>
                  <Image
                    source={require("../../assets/images/close.png")}
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: "cover",
                      tintColor: Colors.Primary,
                    }}
                  />
                </View>
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#000",
                      fontWeight:"bold",
                    }}
                  >
                    Add Images
                  </Text>
                </View>
              </TouchableOpacity>
              <FlatList
                numColumns={2}
                data={beforeImagesArray}
                keyExtractor={(item) => item.id}
                renderItem={beforeImagesRenderItem}
              />
              {beforeImagesArray?.length === 0 && (
                <View style={{ flexDirection: "row", marginBottom: 20 }}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      marginRight: 6,
                    }}
                  >
                    <Image
                      source={require("../../assets/images/placeholder.webp")}
                      style={{
                        height: 100,
                        width: "100%",
                        resizeMode: "contain",
                        borderRadius: 6,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      marginLeft: 6,
                    }}
                  >
                    <Image
                      source={require("../../assets/images/placeholder.webp")}
                      style={{
                        height: 100,
                        width: "100%",
                        resizeMode: "contain",
                        borderRadius: 8,
                      }}
                    />
                  </View>
                </View>
              )}
              <Text style={styles.sectionTitle}>Enter Job Description</Text>
              <TextInput
                multiline
                style={styles.textArea}
                value={beforeDescription}
                onChangeText={setBeforeDescription}
                placeholder={"Enter Job Description"}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={submitBeforeDetailHandle}
                style={{
                  paddingVertical: 16,
                  borderRadius: 6,
                  marginTop: 16,
                  backgroundColor: Colors.Primary,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {buttonLoader ? (
                  <ActivityIndicator color="#FFF" size={"small"} />
                ) : (
                  <Text style={{ fontWeight:"bold", color: "#ffff" }}>
                    Submit
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
      {/* payment received bottom sheet */}
      <RBSheet
        height={310}
        closeOnDragDown={true}
        ref={refPaymentRBSheet}
        customStyles={{
          wrapper: { backgroundColor: "#2632384f" },
          draggableIcon: { backgroundColor: "#000" },
          container: {
            backgroundColor: "#FFF",
            paddingVertical: 20,
            paddingHorizontal: 16,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          style={{ alignSelf: "flex-end", paddingLeft: 20 }}
          onPress={() => refPaymentRBSheet.current.close()}
        >
          <Image
            style={{ height: 20, width: 20, resizeMode: "cover" }}
            source={require("../../assets/images/close.png")}
          />
        </TouchableOpacity>
        <Text
          style={{
            color: "#000",
            fontWeight:"bold",
            fontSize: 24,
            textAlign: "center",
          }}
        >
          Confirm Payment
        </Text>
        <View style={{ width: "80%", alignSelf: "center", marginTop: 4 }}>
          <Text
            style={{ color: "gray", fontSize: 14, textAlign: "center" }}
          >
            Res of this transaction and hit Confirm to proceed
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "#cce5ff",
            borderRadius: 6,
            padding: 12,
            marginTop: 20,
            borderColor: "#b8daff",
            borderWidth: 1,
          }}
        >
          <View style={{ flexDirection: "row", marginBottom: 10 }}>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text
                style={{
                  color: "#000",
                  fontSize: 12,
                  fontWeight:"bold",
                  textAlign: "left",
                }}
              >
                M.R.P
              </Text>
            </View>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text
                style={{
                  color: "#000",
                  fontSize: 12,
                  fontWeight:"bold",
                  textAlign: "right",
                }}
              >
                $ 45.98
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 10 }}>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text
                style={{
                  color: "#000",
                  fontSize: 12,
                  fontWeight:"bold",
                  textAlign: "left",
                }}
              >
                Charges
              </Text>
            </View>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text
                style={{
                  color: "#000",
                  fontSize: 12,
                  fontWeight:"bold",
                  textAlign: "right",
                }}
              >
                + $ 4.02
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text
                style={{
                  color: "#004085",
                  fontSize: 16,
                  fontWeight:"bold",
                  textAlign: "left",
                }}
              >
                Total Amount
              </Text>
            </View>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text
                style={{
                  color: "#004085",
                  fontSize: 16,
                  fontWeight:"bold",
                  textAlign: "right",
                }}
              >
                $ 50.00
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            refPaymentRBSheet.current.open();
            alert("Payment Recevied Successfully");
          }}
          style={{
            backgroundColor: Colors.Primary,
            justifyContent: "center",
            alignItems: "center",
            height: 40,
            width: "100%",
            borderRadius: 6,
            elevation: 5,
            alignSelf: "center",
            margin: 18,
          }}
        >
          <Text style={{ color: "#fff", fontWeight:"bold" }}>
            Confirm
          </Text>
        </TouchableOpacity>
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.secondaryColor,
  },
  loaderStyle: {
    width: 100,
    height: 100,
  },
  loadingText: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: "bold",
    color: Colors.Primary,
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
    justifyContent: "center",
    shadowOffset: {width:0,height:2},
  },
  headingStyle: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  priceStyle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.Primary,
  },
  subHeadingStyle: {
    fontSize: 13,
    color: '#000',
    textTransform: "capitalize",
  },
  dateStyle: {
    fontSize: 12,
    color: 'gray',
    textTransform: "capitalize",
  },
  downloadStyle: {
    fontSize: 16,
    color: Colors.Primary,
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
    borderColor: Colors.Primary,
  },
  rebookTextStyle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.Primary,
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
  subTotal: {
    marginBottom: 6,
    borderRadius: 6,
    paddingBottom: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  subPrice: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ChangeView: {
    height: 60,
    width: "100%",
    display: "flex",
    marginBottom: 20,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  ChangeBTn: {
    width: 120,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.Primary,
  },
  container1: {
    height: 170,
    padding: 10,
    elevation: 5,
    width: "100%",
    borderRadius: 10,
    shadowRadius: 3.84,
    shadowOpacity: 0.25,
    shadowColor: "#000",
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "center",
    shadowOffset: {width:0,height:2},
  },
  avatar: {
    width: 50,
    height: 50,
    marginBottom: 5,
    borderRadius: 25,
  },
  faqContainer: {
    marginBottom: 0,
  },
  questionContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  questionText: {
    flex: 1,
    color: "#000",
    marginBottom: 8,
    fontWeight: "900",
    fontFamily: "Arial",
    textTransform: "capitalize",
  },
  toggleIcon: {
    fontSize: 20,
    color: "#000",
  },
  answerText: {
    lineHeight: 18,
    color: "#333333",
    fontFamily: "Arial",
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  optionsContainer: {
    width: "100%",
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "white",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 14,
    color: "gray",
    marginBottom: 20,
    textAlign: "center",
    fontWeight:"bold",
  },
  modalButtonContainer: {
    flexDirection: "row",
  },
  modalButton: {
    flex: 1,
    height: 38,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  employeeCard: {
    width: "40%",
    height: 140,
    padding: 10,
    elevation: 3,
    shadowRadius: 3,
    borderRadius: 8,
    shadowOpacity: 0.2,
    shadowColor: "#000",
    alignItems: "center",
    marginTop: width*0.05,
    marginLeft: width*0.05,
    flexDirection: "column",
    backgroundColor: "#FFF",
    shadowOffset: {width:0,height:2},
  },
  avatar: {
    marginRight: 10,
    width: width*0.15,
    height: width*0.15,
    borderRadius: (width*0.15)/2,
  },
  textContainer: {
    flex: 1,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    color: "#333",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: width*0.035,
    textTransform: "capitalize",
  },
  number: {
    fontSize: 14,
    textAlign: "center",
  },
  designation: {
    color: "#666",
    fontSize: width*0.035,
  },
  employeeContainer: {
    flexWrap: "wrap",
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  Status: {
    borderRadius: 25,
    paddingVertical: 5,
    color: Colors.Primary,
    paddingHorizontal: 22,
    fontFamily: Fonts.Regular,
    backgroundColor: "#bad1e3",
  },
  imageContainer: {
    marginBottom: 20,
    flexDirection: "row",
    paddingHorizontal: 12,
  },
  image: {
    height: 100,
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  textArea: {
    marginTop: 6,
    borderWidth: 1,
    borderRadius: 6,
    paddingBottom: 80,
    borderColor: "#CCC",
    paddingHorizontal: 10,
  },
  assignedStyle: {
    flex: 1,
    marginRight: 4,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: "center",
    backgroundColor: Colors.Primary,
  },
  assignedTextStyle: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  viewDetailsStyle: {
    flex: 1,
    marginLeft: 4,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: "center",
    borderColor: Colors.Primary,
  },
  viewDetailsTextStyle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.Primary,
  },
});

export default PendingDetails;
