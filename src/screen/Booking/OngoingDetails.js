import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  Alert 
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {theme} from '../../utils/styles';
import Header from '../../component/Header/header';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Fonts} from '../../utils/IMAGES';
import {useNavigation} from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
const {width} = Dimensions.get('window');
const screenWidth = Dimensions.get('window').width;
const CompletedDetails  = props => {
  const navigation = useNavigation();
  const {bookingDetail} = props.route.params;
  const [activeTab, setActiveTab] = useState(1);
  const [selectedValue, setSelectedValue] = useState('option1');
  const [isBookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('accepted');
  const [customerImage1, setCustomerImage1] = useState(null);
  const [customerImage2, setCustomerImage2] = useState(null);
  const [workStartImage1, setWorkStartImage1] = useState(null);
  const [workStartImage2, setWorkStartImage2] = useState(null);
  const [jobCompletedImage1, setJobCompletedImage1] = useState(null);
  const [jobCompletedImage2, setJobCompletedImage2] = useState(null);

  const handleImagePress = (setImage) => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: () => openCamera(setImage),
        },
        {
          text: 'Choose from Gallery',
          onPress: () => selectImage(setImage),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const selectImage = (setImage) => {
    launchImageLibrary({}, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setImage(response.assets[0].uri);
      }
    });
  };

  const openCamera = (setImage) => {
    launchCamera({}, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera picker');
      } else if (response.error) {
        console.log('CameraPicker Error: ', response.error);
      } else {
        setImage(response.assets[0].uri);
      }
    });
  };

  const handleChange = () => {
    navigation.navigate('Booking Period');
  };
  const handleAccept = () => {
    setBookingModalVisible(false);
  };

  const handleDecline = () => {
    setBookingModalVisible(false);
  };

  const [expanded, setExpanded] = useState([]);

  const toggleExpand = index => {
    setExpanded(prevState => {
      const newExpanded = [...prevState];
      newExpanded[index] = !newExpanded[index];
      return newExpanded;
    });
  };
  const refRBSheet = useRef();
  const data = [
    {
      question: 'How many rooms are included?',
      answer: 'Our services include cleaning for up to 4 rooms.',
    },
    {
      question: 'How many bathrooms are included?',
      answer: 'Our services include cleaning for up to 2 bathrooms.',
    },
    {
      question: 'What specific areas are covered?',
      answer:
        'Our services cover common areas such as living rooms, bedrooms, bathrooms, and kitchens.',
    },
    {
      question: 'Is there an additional charge for extra rooms or bathrooms?',
      answer:
        'Yes, there may be an additional charge for cleaning extra rooms or bathrooms. Please contact us for more details.',
    },
  ];
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
        style={[
          styles.employeeCard,
          {backgroundColor: isPressed ? theme.color.primaryColor : '#fff'},
        ]}
        onPressIn={onPressIn}
        onPressOut={onPressOut}>
        <View>
          <Image
            source={avatar}
            style={[
              styles.avatar,
              {
                color: isPressed
                  ? '#fff'.primaryColor
                  : theme.color.primaryColor,
              },
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
  const [isPressedArray, setIsPressedArray] = useState([
    false,
    false,
    false,
    false,
  ]);

  const handlePressIn = index => {
    const updatedPressedArray = [...isPressedArray];
    updatedPressedArray[index] = true;
    setIsPressedArray(updatedPressedArray);
  };

  const handlePressOut = index => {
    const updatedPressedArray = [...isPressedArray];
    updatedPressedArray[index] = false;
    setIsPressedArray(updatedPressedArray);
  };
  return (
    <View style={styles.container}>
      <Header  />

      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 20,
          marginVertical: 15,
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab(1)}
          style={[
            styles.tabStyle,
            {
              borderBottomColor:
                activeTab === 1 ? theme.color.primaryColor : '#CCC',
            },
          ]}>
          <Text
            style={[
              styles.tabTextStyle,
              {color: activeTab === 1 ? theme.color.primaryColor : 'gray'},
            ]}>
            Booking Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab(2)}
          style={[
            styles.tabStyle,
            {
              borderBottomColor:
                activeTab === 2 ? theme.color.primaryColor : '#CCC',
            },
          ]}>
          <Text
            style={[
              styles.tabTextStyle,
              {color: activeTab === 2 ? theme.color.primaryColor : 'gray'},
            ]}>
            Status
          </Text>
        </TouchableOpacity>
      </View>
      {activeTab === 1 ? (
        <>
          <ScrollView>
          <View style={{ flex:1,flexDirection: 'row' , gap:10 ,marginHorizontal:20,}}>
               
               <TouchableOpacity
                 style={{
                   width: "47%",
                   height: 35,
                   justifyContent: 'center',
                   alignItems: 'center',
                   backgroundColor: theme.color.primaryColor,
                   marginVertical: 15,
                   borderRadius: 20,
                   elevation:5,
                 
                 }}
                 onPress={()=>navigation.navigate("Edit Booking")}
                 >
                 <Text
                   style={{
                     fontSize: 14,
                     color: "#ffff",
                     fontWeight: '600',
                   }}>
                   Edit Booking
                 </Text>
               </TouchableOpacity>
               <TouchableOpacity
                 style={{
                   width: "47%",
                   height: 35,
                   justifyContent: 'center',
                   alignItems: 'center',
                   backgroundColor: '#ededed',
                   marginVertical: 15,
                   borderRadius: 20,
                   elevation:5
                 }}>
                 <Text
                   style={{
                     fontSize: 14,
                     color: '#7cb2f3',
                     fontWeight: '600',
                   }}>
                 Invoice
                 </Text>
               </TouchableOpacity>
             <View style={{justifyContent: 'center'}}></View>
           </View>
            <View style={styles.boxStyle}>
            <View style={{flexDirection: 'row' , gap:10}}>
               
                  <TouchableOpacity
                    style={{
                      width: "47%",
                      height: 35,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: theme.color.primaryColor,
                      marginVertical: 15,
                      borderRadius: 20,
                      elevation:5
                    }}
                    onPress={()=>navigation.navigate("Edit Booking")}
                    >
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#ffff",
                        fontWeight: '600',
                      }}>
                      Edit Booking
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: "47%",
                      height: 35,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#ededed',
                      marginVertical: 15,
                      borderRadius: 20,
                      elevation:5
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: '#7cb2f3',
                        fontWeight: '600',
                      }}>
                    Invoice
                    </Text>
                  </TouchableOpacity>
                <View style={{justifyContent: 'center'}}></View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <View>
                    <Text style={styles.headingStyle}>
                      {bookingDetail?.bookingId}
                    </Text>
                  </View>
                  {/* <TouchableOpacity
                    style={{
                      width: 120,
                      height: 35,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#ededed',
                      marginVertical: 15,
                      borderRadius: 50,
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: '#7cb2f3',
                        fontWeight: '600',
                      }}>
                      View on Map
                    </Text>
                  </TouchableOpacity> */}
                </View>
                <View style={{justifyContent: 'center'}}></View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  marginBottom: 10,
                }}>
                <View>
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 16,
                      color: '#000',
                      alignItems: 'center',
                    }}>
                    Booking status:
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      color: theme.color.primaryColor,
                      fontSize: 14,
                      fontFamily: Fonts.Bold,
                    }}>
                    Accept
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', marginTop: 4}}>
                <View style={{justifyContent: 'center'}}>
                  <Image
                    source={require('../../assets/images/calendar.png')}
                    style={{
                      height: 16,
                      width: 16,
                      tintColor: theme.color.primaryColor,
                    }}
                  />
                </View>
                <View
                  style={{flex: 1, justifyContent: 'center', marginLeft: 8}}>
                  <Text style={styles.dateStyle}>
                    Booking Date: 12 Jan, 2024 13:04
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', marginTop: 6}}>
                <View style={{justifyContent: 'center'}}>
                  <Image
                    source={require('../../assets/images/calendar.png')}
                    style={{
                      height: 16,
                      width: 16,
                      tintColor: theme.color.primaryColor,
                    }}
                  />
                </View>
                <View
                  style={{flex: 1, justifyContent: 'center', marginLeft: 8}}>
                  <Text style={styles.dateStyle}>
                    Scedule Date: 12 Jan, 2024 13:04
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', marginTop: 6}}>
                <View style={{justifyContent: 'center'}}>
                  <Image
                    source={require('../../assets/images/map-pin.png')}
                    style={{
                      height: 16,
                      width: 16,
                      tintColor: theme.color.primaryColor,
                    }}
                  />
                </View>
                <View
                  style={{flex: 1, justifyContent: 'center', marginLeft: 8}}>
                  <Text style={styles.dateStyle}>
                    Service Address: Plot ZC7, Jinnah Housing Society
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <Text style={styles.headingStyle}>Payment Method</Text>
                </View>
              </View>

              <View style={{flexDirection: 'row', marginTop: 6}}></View>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <Text style={[styles.dateStyle, {fontWeight: 'bold'}]}>
                  Payment Status: Paid
                </Text>
              </View>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <Text style={[styles.dateStyle, {fontWeight: 'bold'}]}>
                  Payment Method: Stripe
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{justifyContent: 'center', marginTop: 10}}>
                  <Text style={styles.priceStyle}>
                    Total Amount : 7,600.00$
                  </Text>
                </View>
              </View>
            </View>

            <View style={[styles.boxStyle, {padding: 0}]}>
              <View style={{padding: 12}}>
                <Text style={styles.headingStyle}>Job Description</Text>
              </View>

              <ScrollView>
                <View style={{padding: 12}}>
                  {/* <Text style={{
                fontFamily:Fonts.Bold,
                fontWeight:"900",
              color: theme.color.primaryColor,
                fontSize:16,
                paddingBottom:10
              }}>Job Details</Text> */}
                  {data.map((item, index) => (
                    <View key={index} style={styles.faqContainer}>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => toggleExpand(index)}
                        style={styles.questionContainer}>
                        <Text style={styles.questionText}>{item.question}</Text>
                        <Text style={styles.toggleIcon}>
                          {expanded[index] ? '-' : '+'}
                        </Text>
                      </TouchableOpacity>
                      {expanded[index] && (
                        <Text style={styles.answerText}>{item.answer}</Text>
                      )}
                    </View>
                  ))}
                </View>
                <Text
                  style={{
                    fontFamily: Fonts.Bold,
                    color: theme.color.primaryColor,
                    paddingHorizontal: 12,
                    paddingBottom: 10,
                    fontSize: 16,
                    textDecorationColor: '#000',
                    textDecorationLine: 'underline',
                  }}>
                  Booking Summary
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 12,
                  }}>
                  <View>
                    <Text
                      style={{
                        fontFamily: Fonts.Bold,
                        color: theme.color.primaryColor,
                      }}>
                      Service Info
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontFamily: Fonts.Bold,
                        color: '#000',
                      }}>
                      70.00 $
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    color: 'black',
                    padding: 12,
                    fontSize: 16,
                    fontWeight: '900',
                    marginTop: -10,
                  }}>
                  Cleaning
                </Text>
                <View style={{paddingLeft: 20}}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.subHeadingStyle}>
                        ✓ Sofa Cleaning
                      </Text>
                    </View>
                    {/* <View style={{ marginLeft: 8 }}>
                      <Text style={styles.priceStyle}>2,400.00$</Text>
                    </View> */}
                  </View>
                </View>
              </ScrollView>

              <View style={styles.subTotal}>
                <View style={styles.subPrice}>
                  <View>
                    <Text
                      style={[
                        styles.headingStyle,
                        {fontSize: 14, color: '#000'},
                      ]}>
                      Job Type
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.priceStyle}>Hourly</Text>
                  </View>
                </View>
                <View style={styles.subPrice}>
                  <View>
                    <Text
                      style={[
                        styles.headingStyle,
                        {fontSize: 14, color: '#000'},
                      ]}>
                     Total Job Time
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.priceStyle}>1:00:00</Text>
                  </View>
                </View>
                <View style={styles.subPrice}>
                  <View>
                    <Text style={[styles.headingStyle, {fontSize: 14}]}>
                      Coupon discount
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.priceStyle}>09.00 $</Text>
                  </View>
                </View>

                <View style={styles.subPrice}>
                  <View>
                    <Text style={[styles.headingStyle, {fontSize: 14}]}>
                      Base Fare
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.priceStyle}>09.00 $</Text>
                  </View>
                </View>
                <View style={styles.subPrice}>
                  <View>
                    <Text style={[styles.headingStyle, {fontSize: 14}]}>
                      Services Tax
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.priceStyle}>09.00 $</Text>
                  </View>
                </View>
                <View style={styles.subPrice}>
                  <View>
                    <Text style={[styles.headingStyle, {fontSize: 14}]}>
                      Wallet Detection
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.priceStyle}>09.00 $</Text>
                  </View>
                </View>
                <View style={styles.subPrice}>
                  <View>
                    <Text style={[styles.headingStyle, {fontSize: 14}]}>
                      Card Detection
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.priceStyle}>09.00 $</Text>
                  </View>
                </View>
                <View style={styles.subPrice}>
                  <View></View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <View>
                    <Text
                      style={{
                        color: '#004085',
                        fontSize: 16,
                        fontFamily: Fonts.Bold,
                      }}>
                      Grand total
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        color: '#000',
                        fontSize: 16,
                        fontFamily: Fonts.Bold,
                      }}>
                      8290 $
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {/* <TouchableOpacity
                style={{
                  flex: 1,
                  height: 40,
                  backgroundColor: '#4cb050',
                  marginVertical: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  elevation: 5,
                  borderRadius: 10,
                  width:"95%",
                  alignSelf:"center"
                }}
                onPress={() => {
                  
                        refRBSheet.current.open();
                      }}
             >
                <Text
                  style={{
                    fontFamily: Fonts.Bold,
                    color: '#fff',
                  }}>
                 Assigned to Serviceman
                </Text>
              </TouchableOpacity> */}
            <View
              style={{
                paddingHorizontal: 10,
                marginVertical: 10,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.Bold,
                  marginVertical: 10,
                  fontSize: 18,
                  color: theme.color.primaryColor,
                }}>
                Serviceman Info
              </Text>
              <View style={styles.container1}>
                <Image
                  source={{
                    uri: 'https://media.istockphoto.com/id/1476170969/photo/portrait-of-young-man-ready-for-job-business-concept.webp?b=1&s=170667a&w=0&k=20&c=FycdXoKn5StpYCKJ7PdkyJo9G5wfNgmSLBWk3dI35Zw=',
                  }}
                  style={styles.avatar}
                />
                <Text style={styles.name}>Ibrahim Altaf</Text>
                <Text style={styles.number}>+92 3200000</Text>
                <View
                  style={{
                    width: '100%',
                    height: 'auto',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 6,
                    gap: 20,
                  }}>
                  <TouchableOpacity
                    style={{
                      width: 40,
                      height: 40,
                    }}>
                    <Image
                      style={{
                        width: 40,
                        height: 40,
                      }}
                      source={require('../../assets/images/call.png')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: 40,
                      height: 40,
                    }}>
                    <Image
                      style={{
                        width: 40,
                        height: 40,
                      }}
                      source={require('../../assets/images/icons8-message-48.png')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: 40,
                      height: 40,
                    }}>
                    <Image
                      style={{
                        width: 40,
                        height: 40,
                      }}
                      source={require('../../assets/images/icons8-help-48.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <Text
                style={{
                  fontFamily: Fonts.Bold,
                  marginVertical: 10,
                  fontSize: 18,
                  color: theme.color.primaryColor,
                }}>
                Serviceman Info
              </Text>
              <View style={styles.container1}>
                <Image
                  source={{
                    uri: 'https://media.istockphoto.com/id/1476170969/photo/portrait-of-young-man-ready-for-job-business-concept.webp?b=1&s=170667a&w=0&k=20&c=FycdXoKn5StpYCKJ7PdkyJo9G5wfNgmSLBWk3dI35Zw=',
                  }}
                  style={styles.avatar}
                />
                <Text style={styles.name}>Ibrahim Altaf</Text>
                <Text style={styles.number}>+92 3200000</Text>
                <View
                  style={{
                    width: '100%',
                    height: 'auto',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 6,
                    gap: 20,
                  }}>
                  <TouchableOpacity
                    style={{
                      width: 40,
                      height: 40,
                    }}>
                    <Image
                      style={{
                        width: 40,
                        height: 40,
                      }}
                      source={require('../../assets/images/call.png')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: 40,
                      height: 40,
                    }}>
                    <Image
                      style={{
                        width: 40,
                        height: 40,
                      }}
                      source={require('../../assets/images/icons8-message-48.png')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: 40,
                      height: 40,
                    }}>
                    <Image
                      style={{
                        width: 40,
                        height: 40,
                      }}
                      source={require('../../assets/images/icons8-help-48.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
<View>
    
</View>
            </View>

         
            <RBSheet
              ref={refRBSheet}
              closeOnDragDown={true}
              height={300}
              customStyles={{
                wrapper: {
                  backgroundColor: theme.color.primaryColor,
                },
                container: {
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  backgroundColor: '#fff',
                  elevation: 10,
                },
                draggableIcon: {
                  backgroundColor: '#000',
                },
              }}>
              <Text
                style={{
                  fontFamily: Fonts.Bold,
                  color: theme.color.primaryColor,
                  padding: 20,
                  fontSize: 18,
                  paddingHorizontal:25
                }}>
                Select Serviceman
              </Text>
              <ScrollView
             
               >
                <View style={styles.employeeContainer}>
                  <EmployeeCard
                    avatar={require('../Assets/serviceman.webp')}
                    name="Ibrahim Altaf"
                    designation="Plumber"
                    isPressed={isPressedArray[0]}
                    onPressIn={() => handlePressIn(0)}
                    onPressOut={() => handlePressOut(0)}
                  />
                  <EmployeeCard
                    avatar={require('../Assets/serviceman.webp')}
                    name="Abbas"
                    designation="Electrician"
                    isPressed={isPressedArray[1]}
                    onPressIn={() => handlePressIn(1)}
                    onPressOut={() => handlePressOut(1)}
                  />
                  <EmployeeCard
                    avatar={require('../Assets/serviceman.webp')}
                    name="Haris"
                    designation="Plumber"
                    isPressed={isPressedArray[2]}
                    onPressIn={() => handlePressIn(2)}
                    onPressOut={() => handlePressOut(2)}
                  />
                  <EmployeeCard
                    avatar={require('../Assets/serviceman.webp')}
                    name="shahzar"
                    designation="Electrician"
                    isPressed={isPressedArray[3]}
                    onPressIn={() => handlePressIn(3)}
                    onPressOut={() => handlePressOut(3)}
                  />
                </View>
              </ScrollView>

              
            </RBSheet>

            

            <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Images</Text>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={() => handleImagePress(setCustomerImage1)}>
            <Image
              source={customerImage1 ? { uri: customerImage1 } : require('../Assets/placeholder.webp')}
              style={styles.image}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleImagePress(setCustomerImage2)}>
            <Image
              source={customerImage2 ? { uri: customerImage2 } : require('../Assets/placeholder.webp')}
              style={styles.image}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Work Start Images</Text>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={() => handleImagePress(setWorkStartImage1)}>
            <Image
              source={workStartImage1 ? { uri: workStartImage1 } : require('../Assets/placeholder.webp')}
              style={styles.image}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleImagePress(setWorkStartImage2)}>
            <Image
              source={workStartImage2 ? { uri: workStartImage2 } : require('../Assets/placeholder.webp')}
              style={styles.image}
            />
          </TouchableOpacity>
        </View>
      </View>

  

     
    </View>
           
            {/* <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20,marginVertical:40, }}>

      <Picker
        selectedValue={selectedOption}
        style={{ height: 50, width: "47%", backgroundColor: 'white' }}
        onValueChange={(itemValue, itemIndex) => setSelectedOption(itemValue)}>
        <Picker.Item label="Accepted" value="accepted" />
        <Picker.Item label="Ongoing" value="ongoing" />
        <Picker.Item label="Completed" value="completed" />
        <Picker.Item label="Canceled" value="canceled" />
      </Picker>


      <TouchableOpacity style={{ width:"47%", backgroundColor: theme.color.primaryColor, padding: 10, borderRadius: 5,alignItems:"center",justifyContent:"center" }}>
        <Text style={{
            color:"#fff",
            fontFamily:Fonts.Bold,
        }}>Change</Text>
      </TouchableOpacity>
    </View> */}
          </ScrollView>
        </>
      ) : activeTab === 2 ? (
        <View style={{marginTop: 12}}>
          <View
            style={{flexDirection: 'row', marginTop: 6, alignSelf: 'center'}}>
            <View style={{justifyContent: 'center'}}>
              <Text style={[styles.headingStyle, {fontSize: 14}]}>
                Booking Place:
              </Text>
            </View>
            <View style={{justifyContent: 'center', marginLeft: 4}}>
              <Text style={styles.subHeadingStyle}>29 Feb, 2024 19:13</Text>
            </View>
          </View>
          <View
            style={{flexDirection: 'row', marginTop: 6, alignSelf: 'center'}}>
            <View style={{justifyContent: 'center'}}>
              <Text style={[styles.headingStyle, {fontSize: 14}]}>
                Service Scheduled Date:
              </Text>
            </View>
            <View style={{justifyContent: 'center', marginLeft: 4}}>
              <Text style={styles.subHeadingStyle}>29 Feb, 2024 22:11</Text>
            </View>
          </View>
          <View
            style={{flexDirection: 'row', marginTop: 6, alignSelf: 'center'}}>
            <View style={{justifyContent: 'center'}}>
              <Text style={[styles.headingStyle, {fontSize: 14}]}>
                Payment Status:
              </Text>
            </View>
            <View style={{justifyContent: 'center', marginLeft: 4}}>
              <Text
                style={[
                  styles.subHeadingStyle,
                  {color: 'red', fontWeight: 'bold'},
                ]}>
                Unpaid
              </Text>
            </View>
          </View>
          <View
            style={{flexDirection: 'row', marginTop: 6, alignSelf: 'center'}}>
            <View style={{justifyContent: 'center'}}>
              <Text style={[styles.headingStyle, {fontSize: 14}]}>
                Booking Status:
              </Text>
            </View>
            <View style={{justifyContent: 'center', marginLeft: 4}}>
              <Text
                style={[
                  styles.subHeadingStyle,
                  {color: theme.color.primaryColor, fontWeight: 'bold'},
                ]}>
                Pending
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              padding: 12,
              marginTop: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 20,
                marginLeft: 20,
              }}>
              <View
                style={{
                  position: 'absolute',
                  left: 10,
                  top: 10,
                  bottom: -30,
                  width: 1,
                  backgroundColor: 'gray',
                  zIndex: -1,
                }}
              />
              <View style={{marginRight: 12, alignItems: 'center'}}>
                <Image
                  source={require('../../assets/images/check.png')}
                  style={{
                    height: 22,
                    width: 22,
                    tintColor: theme.color.primaryColor,
                  }}
                />
              </View>
              <View style={{flex: 1}}>
                <Text style={[styles.subHeadingStyle, {fontSize: 16}]}>
                  Service Booked by Customer Ayaz Awan
                </Text>
                <Text style={styles.dateStyle}>29 Feb, 2024 19:13</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 20,
                marginLeft: 20,
              }}>
              <View
                style={{
                  position: 'absolute',
                  left: 10,
                  top: 10,
                  bottom: -30,
                  width: 1,
                  backgroundColor: 'gray',
                  zIndex: -1,
                }}
              />
              <View style={{marginRight: 12, alignItems: 'center'}}>
                <Image
                  source={require('../../assets/images/check.png')}
                  style={{
                    height: 22,
                    width: 22,
                    tintColor: theme.color.primaryColor,
                  }}
                />
              </View>
              <View style={{flex: 1}}>
                <Text style={[styles.subHeadingStyle, {fontSize: 16}]}>
                  Service Accepted by Fleet Ayaz Awan
                </Text>
                <Text style={styles.dateStyle}>29 Feb, 2024 19:13</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 20,
                marginLeft: 20,
              }}>
              <View style={{marginRight: 12, alignItems: 'center'}}>
                <Image
                  source={require('../../assets/images/check.png')}
                  style={{
                    height: 22,
                    width: 22,
                    tintColor: theme.color.primaryColor,
                  }}
                />
              </View>
              <View style={{flex: 1}}>
                <Text style={[styles.subHeadingStyle, {fontSize: 16}]}>
                  Service Assigned To Serviceman Ayaz Awan
                </Text>
                <Text style={styles.dateStyle}>29 Feb, 2024 19:13</Text>
              </View>
            </View>
          
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 20,
                marginLeft: 20,
              }}>
              <View style={{marginRight: 12, alignItems: 'center'}}>
                <Image
                  source={require('../../assets/images/check.png')}
                  style={{
                    height: 22,
                    width: 22,
                    tintColor: theme.color.primaryColor,
                  }}
                />
              </View>
              <View style={{flex: 1}}>
                <Text style={[styles.subHeadingStyle, {fontSize: 16}]}>
                  Service Ongoing by Ayaz Awan
                </Text>
                <Text style={styles.dateStyle}>29 Feb, 2024 19:13</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 20,
                marginLeft: 20,
              }}>
              <View style={{marginRight: 12, alignItems: 'center'}}>
                <Image
                  source={require('../../assets/images/check.png')}
                  style={{
                    height: 22,
                    width: 22,
                    tintColor: theme.color.primaryColor,
                  }}
                />
              </View>
              <View style={{flex: 1}}>
                <Text style={[styles.subHeadingStyle, {fontSize: 16}]}>
                  Service Completed by Ayaz Awan
                </Text>
                <Text style={styles.dateStyle}>29 Feb, 2024 19:13</Text>
              </View>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.secondaryColor,
  },
  tabStyle: {
    flex: 1,
    paddingBottom: 12,
    borderBottomWidth: 2,
    justifyContent: 'center',
  },
  tabTextStyle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  boxStyle: {
    padding: 12,
    elevation: 5,
    marginTop: 12,
    marginBottom: 6,
    borderRadius: 6,
    shadowColor: 'gray',
    shadowOpacity: 0.25,
    marginHorizontal: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    shadowOffset: {width: 0, height: 2},
  },
  headingStyle: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  priceStyle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.color.primaryColor,
  },
  subHeadingStyle: {
    fontSize: 14,
    color: '#000',
  },
  dateStyle: {
    fontSize: 12,
    color: 'gray',
  },
  downloadStyle: {
    fontSize: 16,
    color: theme.color.primaryColor,
  },
  pendingStyle: {
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
    backgroundColor: '#cce5ff',
  },
  pendingTextStyle: {
    fontSize: 14,
    color: '#004085',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rebookStyle: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    alignSelf: 'flex-end',
    paddingHorizontal: 24,
    borderColor: theme.color.primaryColor,
  },
  rebookTextStyle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.color.primaryColor,
  },
  completedStyle: {
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
    backgroundColor: '#d4edda',
  },
  completedTextStyle: {
    fontSize: 14,
    color: '#155724',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subTotal: {
    padding: 12,
    elevation: 5,
    marginTop: 10,
    marginBottom: 6,
    borderRadius: 6,
    shadowColor: 'gray',
    shadowOpacity: 0.25,

    backgroundColor: '#fff',
    justifyContent: 'center',
    shadowOffset: {width: 0, height: 2},
  },
  subPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ChangeView: {
    width: '100%',
    height: 60,
    overflow: 'hidden',

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,

    marginBottom: 20,
  },
  ChangeBTn: {
    width: 120,
    height: 40,
    backgroundColor: theme.color.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  container1: {
    width: '100%',
    height: 170,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  number: {
    fontSize: 14,
  },
  faqContainer: {
    marginBottom: 16,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: {
    color: '#000',
    fontFamily: 'Arial', // Change to your desired font family
    fontWeight: '900',
    marginBottom: 8,
    flex: 1,
  },
  toggleIcon: {
    color: '#000',
    fontSize: 20,
  },
  answerText: {
    color: '#333333',
    fontFamily: 'Arial', // Change to your desired font family
    lineHeight: 18,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.color.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  
    
 
  },
  modalContent: {
    width:"90%",
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: 'gray',
    fontFamily: Fonts.Bold,
  },
  modalButtonContainer: {
    flexDirection: 'row',
  },
  modalButton: {
    flex: 1,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  modalButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  employeeCard: {
    width: "40%",
    height: 140,
    backgroundColor: '#fff',
    marginTop: width * 0.05,
    borderRadius: 8,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,

    marginLeft: width * 0.05,
  },
  avatar: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: (width * 0.15) / 2,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  designation: {
    fontSize: width * 0.035,
    color: '#666',
  },
  employeeContainer: {
    flexDirection: 'row',
    flexWrap:"wrap",
    alignSelf:"center",
    justifyContent:"center",
    alignItems:"center"
    
  },
  Status: {
    backgroundColor: '#bad1e3',
    color: Colors.Primary,
    paddingHorizontal: 22,
    paddingVertical: 5,
    borderRadius: 25,
    fontFamily: Fonts.Regular,
  },

  imageContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    alignItems:"center",
    justifyContent:"center"
  },
  image: {
    width: 170,
    height: 100,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sectionTitle:{
    paddingHorizontal:20,
    marginVertical:10,
    fontFamily:Fonts.Bold,
    fontSize:16,
    color:"#000"
  }
});

export default CompletedDetails;
