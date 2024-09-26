import React, {useState, useEffect, useRef} from "react";
import {StyleSheet, View, Image, Text, SafeAreaView, ScrollView, TouchableOpacity, Dimensions} from "react-native";
import {Colors} from "../utils/IMAGES";
import {theme} from "../constants/styles";
import {helpers} from "../utils/helpers";
import {useDispatch, useSelector} from "react-redux";
import {useNavigation} from "@react-navigation/native";
import {SetOrderDetail} from "../Redux/actions/actions";
import Loader from "../component/Loader/loader";
import Header from "../component/Header/header";
import * as Animatable from 'react-native-animatable';
import CustomStatusBar from "../component/StatusBar/customStatusBar";
import ServicesPagination from "../component/Pagination/ServicesPagination";

const {height} = Dimensions.get('window');

const EditServiceDetail = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const animatedButtonRef = useRef(null);
  const [loader, setLoader] = useState(true);
  const [headings, setHeadings] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [activeFaq, setActiveFaq] = useState(false);
  const {order_detail} = useSelector(state => state.userReducer);
  const {serviceId, categoryId, subCategoryDetail} = route.params;
  
  useEffect(() => {
    getServiceInfo();
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getServiceInfo();
    });

    return unsubscribe;
  }, [navigation]);
  const getServiceInfo = async () => {
    try {
      setLoader(true);
      const requestOptions = {
        method: "POST",
        redirect: "follow",
      };

      fetch(`${helpers.api.baseUrl}service_info/${serviceId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setLoader(false);
        if (result?.headings!==undefined) {
          const updatedHeadings = result?.headings.map((heading) => ({
            ...heading,
            options: JSON.parse(heading?.options).map((option) => ({
              value: option,
              checked: false,
            })),
          }));

          const updatedArrayA = updatedHeadings?.map(itemA => {
            const itemB = order_detail?.formData?.options?.find(item => item.id === itemA.id);
            if (itemB) {
              itemA.options = itemA.options.map(optionA => {
                if (itemB.options.includes(optionA.value)) {
                  return { ...optionA, checked: true };
                } else {
                  return { ...optionA, checked: false };
                };
              });
            }
            return itemA;
          });
          setLoader(false);
          setHeadings(updatedArrayA);
        };
      }).catch((error) => {
        setLoader(false);
        console.log(error?.message);
      });
    } catch (error) {
      setLoader(false);
      console.log(error?.message);
    };
  };
  const handleScrollToEnd = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated:true});
      if (animatedButtonRef.current) {
        animatedButtonRef.current.shake(800);
      };
    };
  };
  const handleCheckboxChange = (headingId, optionValue) => {
    setHeadings((prevHeadings) =>
      prevHeadings.map((heading) =>
        heading.id === headingId
          ? {
              ...heading,
              options: heading.options.map((opt) =>
                opt.value === optionValue
                  ? { ...opt, checked: !opt.checked }
                  : { ...opt, checked: false }
              ),
            }
          : heading
      )
    );
  };
  const proceedToNextStep = () => {
    const selectedOptions = headings.map((heading) => ({
      id: heading.id,
      name: heading.tagline,
      options: heading.options.filter((option) => option.checked).map((option) => option.value),
    }));
    const formData = {
      options: selectedOptions,
      services: order_detail.formData?.services,
      description: order_detail.formData?.description,
      imagesArray: order_detail.formData?.imagesArray,
    };
    const orderDetail = {
      formData: formData,
      serviceId: order_detail?.serviceId,
      categoryId: order_detail?.categoryId,
      selectedDateTime: order_detail?.selectedDateTime,
      subCategoryDetail: order_detail?.subCategoryDetail,
    };
    dispatch(SetOrderDetail(orderDetail));
    navigation.navigate('CheckOut');
  };

  return (
    <SafeAreaView style={styles.container}>
      {loader?<Loader />:null}
      <CustomStatusBar
        barStyle={"light-content"}
        backgroundColor={"#044F86"}
      />
      <Header
        backArrow
        title={"Service Details"}
        backPage={() => navigation.goBack()}
        cartPress={() => navigation.navigate("Cart")}
      />
        {/*
      <View style={styles.imageContainer}>
        <Image
          style={styles.backgroundImage}
          source={{uri:subCategoryDetail?.image}}
        />
        <View style={styles.overlay}>
          <View style={styles.titleContainer}>
           <Text style={styles.headingStyle}>
              {subCategoryDetail?.name}
            </Text> 
          </View>
        </View>
      </View>
      */}
      <View style={styles.serviceInfoBox}>
        <View style={{flexDirection:"row"}}>
          <View style={{justifyContent:"center"}}>
            <Image
              style={styles.serviceImage}
              source={{uri:subCategoryDetail?.image}}
            />
          </View>
          <View style={{flex:1,justifyContent:"center"}}>
            <Text style={styles.priceStyle}>
              {subCategoryDetail?.name}
            </Text>
            <Text numberOfLines={4} style={styles.descStyle}>
              {subCategoryDetail?.description===null?"No Description Found!":subCategoryDetail?.description}
            </Text>
          </View>
        </View>
        <View style={styles.ratingRow}>
          <View style={styles.rating}>
            <Image
              style={styles.starImage}
              source={require("../assets/images/star.png")}
            />
            <Text style={styles.ratingText}>
              0.00<Text style={styles.ratingCount}>(0)</Text>
            </Text>
          </View>
          <View style={{alignItems:"flex-end",justifyContent:"center"}}>
          <Text style={{fontSize:20,fontWeight:"900",color:theme.color.primaryColor}}>
            {`${helpers.constant.currencyName} ${subCategoryDetail?.price}`} {subCategoryDetail?.calculator}
          </Text>
        </View>
        </View>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab(1)}
          style={[styles.tabStyle,activeTab===1&& styles.activeTab]}>
          <Text style={[styles.tabTextStyle,activeTab===1&&styles.activeTabText]}>
            Service Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab(2)}
          style={[styles.tabStyle,activeTab===2&&styles.activeTab]}>
          <Text style={[styles.tabTextStyle,activeTab===2&&styles.activeTabText]}>
            FAQs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab(3)}
          style={[styles.tabStyle,activeTab===3&&styles.activeTab]}>
          <Text style={[styles.tabTextStyle,activeTab===3&&styles.activeTabText]}>
            Reviews
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView ref={scrollViewRef}>
        <View style={styles.tabContent}>
          {activeTab===1&&
            <View style={styles.tabPadding}>
              {headings?.length===0?null:
                <ServicesPagination
                  headings={headings}
                  endButtonHandle={proceedToNextStep}
                  handleCheckboxChange={handleCheckboxChange}
                />
              }
            </View>
          }
          {activeTab===2&&
            <View style={styles.tabPadding}>
              <TouchableOpacity
                activeOpacity={.7}
                style={styles.faqContainer}
                onPress={() => setActiveFaq(!activeFaq)}>
                <Text style={styles.faqQuestion}>
                  What services do you provide?
                </Text>
              </TouchableOpacity>
              {activeFaq&&
                <View style={styles.faqAnswerContainer}>
                  <Text>
                    We provide a wide range of cleaning services, including carpet cleaning, window cleaning, and more.
                  </Text>
                </View>
              }
            </View>
          }
          {activeTab===3&&
            <View style={styles.tabPadding}>
              <Text>
                No reviews available.
              </Text>
            </View>
          }
        </View>
      </ScrollView>
      {/* <Animatable.View ref={animatedButtonRef}>
        <TouchableOpacity
          activeOpacity={.7}
          style={styles.roundButton}
          onPress={handleScrollToEnd}>
          <Image
            style={styles.buttonImage}
            source={require('../assets/images/arrow.png')}
          />
        </TouchableOpacity>
      </Animatable.View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  imageContainer: {
    width: "100%",
    position: "relative",
    
    height: 150,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  overlay: {
    alignItems: "center",
    justifyContent: "center",
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  titleContainer: {
    paddingHorizontal: 20,
  },
  headingStyle: {
    fontSize: 24,
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  serviceInfoBox: {
    marginVertical: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#F7F7F7",
  },
  serviceInfoRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  serviceImage: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 10,
  },
  serviceDetails: {
    flex: 1,
  },
  priceStyle: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
  },
  descStyle: {
    marginTop: 5,
    fontSize: 14,
    color: "#666",
  },
  ratingRow: {
    marginTop: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rating: {
    alignItems: "center",
    flexDirection: "row",
  },
  starImage: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
  },
  ratingCount: {
    fontWeight: "bold",
  },
  addButton: {
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#4CAF50",
  },
  tabContainer: {
    
    elevation: 2,
    shadowColor: "#000",
    shadowRadius: 2,
    marginBottom: 10,
    shadowOpacity: 0.2,
    flexDirection: "row",
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
    shadowOffset: {width:0,height:2},
  },
  tabStyle: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 15,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.Primary,
  },
  tabTextStyle: {
    color: "#666",
    fontSize: 12,
  },
  activeTabText: {
    color: Colors.Primary,
  },
  tabContent: {
    backgroundColor: "#FFF",
    padding: 20,
  },
  tabPadding: {
    paddingBottom: 20,
  },
  headingContainer: {
    marginBottom: 15,
  },
  headingTextStyle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  nextButtonContainer: {
    backgroundColor: Colors.Primary,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  faqContainer: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  faqQuestion: {
    fontSize: 16,
    color: "#333",
  },
  faqAnswerContainer: {
    paddingVertical: 15,
  },
  sheetContainer: {
    paddingTop: 10,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top", // For multiline text alignment
  },
  imageUploadContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    width: "48%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageSelected: {
    borderColor: Colors.Primary,
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
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: 'blue', 
    borderColor: 'blue', // Change this to match the background color or any other desired effect
  },
  unchecked: {
    backgroundColor: 'white', // Change this to your desired color for unchecked state
    borderColor: 'gray', // Change this to match the background color or any other desired effect
  },
  animatedButtonContainer: {
    position: 'absolute',
    bottom: height * 0.05,
    alignSelf: 'center',
  },
  roundButton: {
    position: 'absolute',
    bottom: height * 0.05,
    right:20,
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.Primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonImage: {
    width: 30,
    height: 30,
    tintColor: '#fff', // Optional: if you want to change the image color
  },
});

export default EditServiceDetail;
