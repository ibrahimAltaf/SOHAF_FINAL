import React, {useEffect, useState} from "react";
import {View, Image, ScrollView, StyleSheet, Text, TouchableOpacity, Dimensions, Alert, Linking, ToastAndroid, PermissionsAndroid, Platform, ActivityIndicator} from "react-native";
import {helpers} from "../utils/helpers";
import {theme} from "../constants/styles";
import {useDispatch, useSelector} from "react-redux";
import {useNavigation} from "@react-navigation/native";
import {SetUserLocation} from "../Redux/actions/actions";
import Geocoder from 'react-native-geocoding';
import Loader from "../component/Loader/loader";
import Carousel from "react-native-banner-carousel";
import ImageLoad from "react-native-image-placeholder";
import Geolocation from '@react-native-community/geolocation';
import CustomStatusBar from "../component/StatusBar/customStatusBar";

const Home = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {width} = Dimensions.get("window");
  const {user_location} = useSelector((state) => state.userReducer);
  const [loader, setLoader] = useState(true);
  const [sliderList, setSliderList]  = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [userLocation, setUserLocation] = useState(user_location);

  useEffect(() => {
    getSlidersHandle();
    getLocationHandle();
    getCategoriesHandle();
  }, []);
  useEffect(() => {
    setUserLocation(user_location);
  }, [user_location]);
  const getCategoriesHandle = () => {
    try {
      setLoader(true);
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch(`${helpers.api.baseUrl}categories`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setLoader(false);
        setCategoriesList(result);
      }).catch((error) => {
        setLoader(false);
        console.log(error?.message);
      });
    } catch (error) {
      setLoader(false);
      console.log(error?.message);
    };
  };
  const getSlidersHandle = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch(`${helpers.api.baseUrl}get_slider`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result?.status === 200) {
          setSliderList(result.data);
        };
      }).catch((error) => {
        console.error(error?.message);
      });
    } catch (error) {
      console.error(error?.message);
    };
  };
  const getLocationHandle = async () => {
    setLoader(true);
    const hasLocationPermission = await hasLocationPermissions();
    if (!hasLocationPermission) {
      setLoader(false);
      return;
    };
    Geolocation.getCurrentPosition(
      (position) => {
        const currentLatitude = position?.coords?.latitude;
        const currentLongitude = position?.coords?.longitude;
        getLocationName(currentLatitude, currentLongitude);
      },
      (error) => {
        setLoader(false);
        const { message } = error;
        console.log("LOCATION ERROR =====> ", message);
      },
      {
        accuracy: {
          ios: 'best',
          android: 'high',
        },
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        showLocationDialog: true,
        enableHighAccuracy: true,
        forceRequestLocation: true,
      }
    );
  };
  const getLocationName = async (lat, lng) => {
    try {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      Geocoder.init(helpers.api.mapKey);
      Geocoder.from(latitude, longitude)
      .then((response) => {
        const formatted_address = response?.results[0]?.formatted_address;
        const location = {
          latitude: latitude,
          longitude: longitude,
          address: formatted_address,
          location_type: "Current Location",
        };
        setLoader(false);
        dispatch(SetUserLocation(location));
      }).catch((error) => {
        setLoader(false);
        console.log(error?.message);
      });
    } catch (error) {
      setLoader(false);
      console.log(error?.message);
    };
  };
  const hasLocationPermissions = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasLocationPermissionIOS();
      return hasPermission;
    }
  
    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }
  
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
  
    if (hasPermission) {
      return true;
    }
  
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
  
    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
  
    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG
      );
    }
    return false;
  };
  const hasLocationPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');
  
    if (status === 'granted') {
      return true;
    }
  
    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }
  
    if (status === 'disabled') {
      Alert.alert(
        `Turn on Location Services to allow Bakery App to determine your location.`,
        '',
        [
          { text: 'Go to Settings', onPress: openSetting },
          { text: "Don't Use Location", onPress: () => { } },
        ]
      );
    }
    return false;
  };
  
  return (
    <View style={styles.container}>
      {loader?<Loader />:null}
      <CustomStatusBar
        barStyle={"light-content"}
        backgroundColor={"#044F86"}
      />
      <View style={styles.headerMain}>
        <View style={{flex:1,justifyContent:"center",marginRight:12}}>
          <Text style={styles.addressStyle}>
            {userLocation?.location_type===undefined||userLocation?.location_type===""||
            userLocation?.location_type===null?"Current Address":userLocation?.location_type}
          </Text>
          <Text numberOfLines={1} style={[styles.addressStyle,{fontSize:14,paddingTop:4}]}>
            {userLocation?.address===undefined||userLocation?.address===""||
            userLocation?.address===null?"Current Address":userLocation?.address}
          </Text>
        </View>
        <View style={{justifyContent:"center"}}>
          <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
            <Image
              source={theme.images.bellIcon}
              style={{height:30,width:30,tintColor:"#FFF"}}
            />
          </TouchableOpacity>
        </View>
        {loader&&<ActivityIndicator size="large" color="#0000ff" />}
      </View>
      <View style={{marginBottom:30,marginHorizontal:10,marginTop:12,
      alignSelf:"center",shadowColor:'#000',shadowOffset:{width:0,height:2},elevation:5,
      shadowOpacity:0.8,shadowRadius:4,backgroundColor:'#FFF',borderRadius:10,width:width-40}}>
        <Carousel
          index={0}
          loop={false}
          autoplay={false}
          pageSize={width-40}>
          {sliderList?.map((val, key) => {
            return (
              <ImageLoad
                key={key}
                blurRadius={1}
                resizeMode={"cover"}
                source={{uri:val?.photo}}
                style={{height:150,width:'100%',
                borderRadius:10,overflow:'hidden'}}
              />
            );
          })}
        </Carousel>
      </View>
      <View style={{flexDirection:"row",marginHorizontal:14}}>
        <View style={{flex:1,justifyContent:"center"}}>
          <Text style={{fontSize:16,fontWeight:"bold",position:'relative',paddingBottom:5}}>
            Categories
          </Text>
          <View style={{height:2,backgroundColor:"#007BFF",
          position:'absolute',bottom:0,width:50,left:0,right:0}} />
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          style={{justifyContent:"center"}}
          onPress={() => {
            navigation.navigate("AllCategories",{
              category_id: 0,
              route_name: "see all",
            });
          }}>
          <Text style={{color:"#007BFF",fontSize:16}}>
            See All
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={{flex:1}}>
          <View style={styles.subBoxStyle}>
            {categoriesList?.map((val, key) => {
              return (
                <TouchableOpacity
                  key={key}
                  activeOpacity={0.7}
                  style={[styles.columnStyle,
                  key%3===2?{marginRight:0}:null]}
                  onPress={() => {
                    navigation.navigate("AllCategories",{
                      category_id: val?.id,
                      route_name: "see all",
                    })
                  }}>
                <Image
  source={{uri: val?.image}}
  style={{
    height: 70,
    width: 100,
    marginBottom: 6,
    resizeMode: "cover",
    borderRadius: 12,
    // Shadow for iOS
    shadowColor: "gray",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    // Shadow for Android
    elevation: 8,
    backgroundColor: "#fff", // Ensure background is white for proper shadow display
  }}
/>

                  <Text style={styles.categoryStyle}>
                    {val?.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View style={{height:80}}></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  headerMain: {
    elevation: 6,
    paddingTop: 30,
    paddingBottom: 15,
    shadowRadius: 4.65,
    shadowColor: "#000",
    shadowOpacity: 0.27,
    flexDirection: "row",
    paddingHorizontal: 24,
    shadowOffset: {width:0,height:3},
    backgroundColor: theme.color.primaryColor,
  },
  addressStyle: {
    fontSize: 12,
    color: "#FFF",
  },
  searchBarMain: {
    elevation: 9,
    marginTop: 12,
    borderRadius: 100,
    shadowRadius: 5.46,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.32,
    flexDirection: "row",
    marginHorizontal: 14,
    paddingHorizontal: 12,
    shadowOffset: {width:0,height:3},
    backgroundColor: theme.color.secondaryColor,
  },
  circleStyle: {
    width: 40,
    height: 40,
    elevation: 9,
    borderRadius: 100,
    shadowRadius: 5.46,
    shadowColor: "#CCC",
    shadowOpacity: 0.32,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: {width:0,height:3},
    backgroundColor: theme.color.primaryColor,
  },
  headingStyle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  seeAllStyle: {
    fontSize: 14,
    color: theme.color.primaryColor,
    textDecorationLine: "underline",
  },
  subBoxStyle: {
    flex: 1,
    marginTop: 6,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 6,
    alignItems:"center",
    alignSelf:"center",
  },
  columnStyle: {

    width: "30%",
    height: 130,

  

   
    borderColor: "#ddd",

   
    alignItems: "center",

    backgroundColor: "#fff",
    alignSelf:"center",
    justifyContent: "center",
 
  },
  categoryStyle: {
    fontSize: 11,
    color: "#000",
    fontWeight: "500",
    textAlign: "center",
    textTransform: "capitalize",
  },
});

export default Home;
