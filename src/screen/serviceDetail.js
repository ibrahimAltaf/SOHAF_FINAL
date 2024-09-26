import React, {useState, useEffect, useRef} from "react";
import {StyleSheet, View, Image, Text, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, TextInput, FlatList, Platform} from "react-native";
import {useDispatch} from "react-redux";
import {theme} from "../constants/styles";
import {Colors, Fonts} from "../utils/IMAGES";
import {useNavigation} from "@react-navigation/native";
import {SetOrderDetail} from "../Redux/actions/actions";
import {ToastMessage, helpers} from "../utils/helpers";
import {launchImageLibrary, launchCamera} from "react-native-image-picker";
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Loader from "../component/Loader/loader";
import Header from "../component/Header/header";
import RBSheet from "react-native-raw-bottom-sheet";
import * as Animatable from 'react-native-animatable';
import CustomButton from "../component/Buttons/customButton";
import CustomStatusBar from "../component/StatusBar/customStatusBar";
import ServicesPagination from "../component/Pagination/ServicesPagination";

const {height} = Dimensions.get('window');

const ServiceDetail = ({route}) => {
  const refRBSheet = useRef();
  const imageRBSheet = useRef();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const animatedButtonRef = useRef(null);
  const {serviceId, categoryId, subCategoryDetail} = route.params;
  const [count, setCount] = useState(0);
  const [loader, setLoader] = useState(true);
  const [headings, setHeadings] = useState([]);
  const [services, setServices] = useState({});
  const [activeTab, setActiveTab] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [imageValue, setImageValue] = useState("");
  const [activeFaq, setActiveFaq] = useState(false);
  const [imagesArray, setImagesArray] = useState([]);
  const [description, setDescription] = useState("");

  useEffect(() => {
    getServiceInfo();
    checkPermissions();
    refRBSheet.current.close();
    const placeholderImages = [
      {
        id: 1,
        type: 'jpg',
        name: `img-placeholder.jpg`,
        uri: require('../assets/images/uploadplaceholder.png'),
      },
      {
        id: 2,
        type: 'jpg',
        name: `img-placeholder.jpg`,
        uri: require('../assets/images/uploadplaceholder.png'),
      },
    ];
    setImagesArray(placeholderImages);
  }, []);
  useEffect(() => {
    if (imagesArray?.length==0) {
      const placeholderImages = [
        {
          id: 1,
          type: 'jpg',
          name: `img-placeholder.jpg`,
          uri: require('../assets/images/upload.png'),
        },
        {
          id: 2,
          type: 'jpg',
          name: `img-placeholder.jpg`,
          uri: require('../assets/images/camera.png'),
        },
      ];
      setImagesArray(placeholderImages);
    };
  }, [imagesArray]);
  const isAnyOptionSelected = () => {
    return headings.some(heading => heading.options.some(option => option.checked));
  };
  const checkPermissions = async () => {
    try {
      const result = await check(PERMISSIONS.ANDROID.CAMERA);
      if (result===RESULTS.DENIED) {
        const requestResult = await request(PERMISSIONS.ANDROID.CAMERA);
        if (requestResult===RESULTS.GRANTED) {
          console.log('Camera permission granted');
        } else {
          console.log('Camera permission denied');
        };
      } else if (result===RESULTS.GRANTED) {
        console.log('Camera permission already granted');
      };
    } catch (error) {
      console.error('Permission error:', error);
    };
  };
  const getServiceInfo = async () => {
    try {
      setLoader(true);
      const response = await fetch(`${helpers.api.baseUrl}service_info/${serviceId}`, {
        method: "POST",
      });
      const result = await response.json();
      if (result?.services!==undefined) {
        setServices(result?.services);
      };

      const updatedHeadings = result.headings.map((heading) => ({
        ...heading,
        options: JSON.parse(heading.options).map((option) => ({
          value: option,
          checked: false,
        })),
      }));
      setLoader(false);
      setHeadings(updatedHeadings);
    } catch (error) {
      setLoader(false);
      console.error("Error fetching service info:", error.message);
    };
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
  const handleScrollToEnd = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated:true});
      if (animatedButtonRef.current) {
        animatedButtonRef.current.shake(800);
      };
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
  const endButtonHandle = () => {
    if (isAnyOptionSelected()) {
      refRBSheet.current.open();
    } else {
      ToastMessage('Please select at least one service');
    };
  };
  const proceedToNextStep = () => {
    const realImages = imagesArray.filter(
      (image) => image?.id!==1&&image?.id!==2
    );
    if (realImages?.length===0) {
      alert("Please upload at least one image.");
      return;
    };
    if (description.trim()==='') {
      alert("Please describe the issue.");
      return;
    } else {
      const selectedOptions = headings.map((heading) => ({
        id: heading?.id,
        name: heading?.tagline,
        options: heading?.options.filter((option) => option.checked).map((option) => option.value),
      }));
      const formData = {
        services: services,
        options: selectedOptions,
        description: description,
        imagesArray: imagesArray,
      };
      refRBSheet.current.close();
      const orderDetail = {
        formData: formData,
        serviceId: serviceId,
        categoryId: categoryId,
        selectedDateTime: "",
        subCategoryDetail: subCategoryDetail,
      };
      dispatch(SetOrderDetail(orderDetail));
      navigation.navigate("SelectLocation",{
        routeName: "add",
      });
    };
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
        justifyContent:"center",width:"49%",marginRight:6,marginBottom:30}}>
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
                  endButtonHandle={endButtonHandle}
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
      {/* ADD IMAGES BOTTOM SHEET */}
      <RBSheet
        ref={refRBSheet}
        openDuration={250}
        height={height*0.9}
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
              Add Images
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
            <Text style={[styles.sheetTitle,{marginTop:12}]}>
              Describe the issue
            </Text>
            <TextInput
              multiline
              numberOfLines={5}
              value={description}
              onChangeText={setDescription}
              style={styles.descriptionInput}
              placeholder={"Describe the issue here..."}
            />
            <CustomButton
              title={"Next"}
              onPress={proceedToNextStep}
              customButtonStyle={styles.proceedButton}
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
    padding: 20,
    backgroundColor: "#FFF",
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
    textAlignVertical: "top",
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
    backgroundColor: '#2196F3',
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
    tintColor: '#fff',
  },
  imageStyle: {
    height: 100,
    width: "100%",
    objectFit:"contain",
    borderWidth: 1,

    borderRadius: 10,
    borderColor: theme.color.primaryColor,
  },
});

export default ServiceDetail;
