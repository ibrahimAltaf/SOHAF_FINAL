import React, {useState, useEffect, useRef} from "react";
import {StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, Image, ActivityIndicator, ScrollView, Linking, Dimensions} from "react-native";
import {useSelector} from "react-redux";
import {theme} from "../../utils/styles";
import {helpers} from "../../utils/helpers";
import {Colors, Fonts} from "../../utils/IMAGES";
import {useNavigation} from "@react-navigation/native";
import moment from "moment";
import Loader from "../../component/Loader/loader";
import RBSheet from "react-native-raw-bottom-sheet";
import CustomStatusBar from "../../component/StatusBar/customStatusBar";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function BookingTimeCounter(props) {
  const refRBSheet = useRef();
  const navigation = useNavigation();
  const {booking_detail} = props.route.params;
  const {access_token} = useSelector(state => state.userReducer);
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(1);
  const [timer, setTimer] = useState("00:00:00");
  const [showModal, setShowModal] = useState(false);
  const [contactType, setContactType] = useState("");
  const [bookingDetail, setBookingDetail] = useState({});
  const [buttonLoader, setButtonLoader] = useState(false);
  const [checkListItems, setCheckListItems] = useState([]);
  const [bookingStatus, setBookingStatus] = useState(booking_detail?.status);

  useEffect(() => {
    getCheckListHandle();
    getBookingTimeHandle();
    getBookingDetailHandle();
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getCheckListHandle();
      getBookingTimeHandle();
      getBookingDetailHandle();
    });

    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    let interval;
    setTimeout(() => {
      if (bookingStatus==="IN_PROGRESS"||bookingStatus==="RESUME") {
        interval = setInterval(() => {
          setTimer(prevTime => {
            const [hours, minutes, seconds] = prevTime.split(':').map(Number);
            let newSeconds = seconds + 1;
            let newMinutes = minutes;
            let newHours = hours;

            if (newSeconds === 60) {
              newSeconds = 0;
              newMinutes += 1;
            }

            if (newMinutes === 60) {
              newMinutes = 0;
              newHours += 1;
            }

            const formattedTime = [
              String(newHours).padStart(2, '0'),
              String(newMinutes).padStart(2, '0'),
              String(newSeconds).padStart(2, '0')
            ].join(':');

            return formattedTime;
          });
        }, 1000);
      };
      return () => clearInterval(interval);
    }, 3000);
  }, [bookingStatus]);
  const getBookingDetailHandle = () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("X-Requested-With", "XMLHttpRequest");
      myHeaders.append("Authorization", `Bearer ${access_token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(`${helpers.api.baseUrl}requests/history/details?request_id=${booking_detail?.id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result?.error===undefined) {
          setBookingDetail(result);
          setBookingStatus(result?.status);
        } else if (result?.error==="token_invalid"||
          result?.error==="token_expired") {
          AsyncStorage.removeItem('access_token');
          AsyncStorage.removeItem('user_detail');
          AsyncStorage.removeItem('user_location');
          navigation.replace('Login');
          alert("Session Expired!");
        };
      }).catch((error) => {
        console.log(error?.message);
      });
    } catch (error) {
      console.log(error?.message);
    };
  };
  const getBookingTimeHandle = () => {
    try {
      setLoading(true);
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
  
      fetch(`${helpers.api.baseUrl}get_timer?request_id=${booking_detail?.id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setLoading(false);
        if (result?.duration!==undefined) {
          setTimer(result?.duration);
        };
      }).catch((error) => {
        setLoading(false);
        console.log(error?.message);
      });
    } catch (error) {
      setLoading(false);
      console.log(error?.message);
    };
  };
  const getCheckListHandle = () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("X-Requested-With", "XMLHttpRequest");
      myHeaders.append("Authorization", `Bearer ${access_token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(`${helpers.api.baseUrl}requests/checklist?request_id=${booking_detail?.id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setLoading(false);
        setShowModal(false);
        if (result?.error===undefined) {
          if (result?.success) {
            setCheckListItems(result?.data);
          } else {
            setCheckListItems([]);
          };
        } else if (result?.error==="token_invalid"||
        result?.error==="token_expired") {
          AsyncStorage.removeItem('access_token');
          AsyncStorage.removeItem('user_detail');
          AsyncStorage.removeItem('user_location');
          navigation.replace('Login');
          alert("Session Expired!");
        };
      }).catch((error) => {
        setLoading(false);
        setShowModal(false);
        console.error(error?.message);
      });
    } catch (error) {
      setLoading(false);
      setShowModal(false);
      console.error(error?.message);
    };
  };
  const contactHandle = (value) => {
    if (contactType==="call") {
      const number = value==="serviceman"?booking_detail?.user?.mobile:booking_detail?.fleet?.mobile;
      Linking.openURL(`tel:${number}`)
    } else if (contactType==="email") {
      if (value==="serviceman") {
        const {user} = bookingDetail;
        navigation.navigate("chat", {
          receiverId: user?.id,
          receiverName: 'USER',
        });
      } else {
        const {fleet} = bookingDetail;
        navigation.navigate("chat", {
          receiverId: fleet?.id,
          receiverName: 'FLEET',
        });
      };
      refRBSheet.current.close();
    };
  };


  return (
    <View style={styles.container}>
      {loading?<Loader />:null}
      <CustomStatusBar
        backgroundColor={"#FFF"}
        barStyle={"dark-content"}
      />
      <ScrollView>
        <View style={styles.timeCounter}>
          <View style={{borderRadius:6,marginHorizontal:16,marginBottom:16,padding:20,borderWidth:1,
          borderColor:bookingDetail?.status==="RESUME"||bookingDetail?.status==="IN_PROGRESS"?"#c3e6cb":"#f5c6cb",
          backgroundColor:bookingDetail?.status==="RESUME"||bookingDetail?.status==="IN_PROGRESS"?"#d4edda":"#f8d7da"}}>
            <Text style={[styles.bookingStartText,
            {color:bookingDetail?.status==="RESUME"||bookingDetail?.status==="IN_PROGRESS"?"#155724":"#721c24"}]}>
              Work in Progress...
            </Text>
            <Text style={[styles.dateText,
            {color:bookingDetail?.status==="RESUME"||bookingDetail?.status==="IN_PROGRESS"?"#155724":"#721c24"}]}>
              {moment().format('h:mm a')} <Text style={styles.dateSubText}>{moment().format('D-MM-YYYY')}</Text>
            </Text>
            <View style={styles.timerContainer}>
              <View style={styles.timeBlock}>
                <Text style={[styles.timeText,
                {color:bookingDetail?.status==="RESUME"||bookingDetail?.status==="IN_PROGRESS"?"#155724":"#721c24"}]}>
                  {timer}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <View style={{flexDirection:"row"}}>
              <TouchableOpacity
                activeOpacity={.7}
                onPress={() => setActiveTab(1)}
                style={{flex:1,justifyContent:"center",borderBottomColor:Colors.Primary,paddingTop:12,borderRadius:6,
                backgroundColor:activeTab===1?"#FFF":theme.color.secondaryColor,borderBottomWidth:activeTab===1?2:0}}>
                <Text style={{fontSize:16,fontWeight:"bold",color:activeTab===1?Colors.Primary:"gray",textAlign:"center",paddingBottom:8}}>
                  Job Checklist
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={.7}
                onPress={() => setActiveTab(2)}
                style={{flex:1,justifyContent:"center",borderBottomColor:Colors.Primary,paddingTop:12,borderRadius:6,
                backgroundColor:activeTab===2?"#FFF":theme.color.secondaryColor,borderBottomWidth:activeTab===2?2:0}}>
                <Text style={{fontSize:16,fontWeight:"bold",color:activeTab===2?Colors.Primary:"gray",textAlign:"center",paddingBottom:8}}>
                  Time Logs
                </Text>
              </TouchableOpacity>
            </View>
            {activeTab===1?
              checkListItems?.length===0?
                <View style={{height:Dimensions.get("window").height/2,alignItems:"center",justifyContent:"center"}}>
                  <Text style={{fontSize:14,fontWeight:"bold",color:"#000",textAlign:"center"}}>
                    No Check List Found
                  </Text>
                </View>
              :
              checkListItems?.map((val, key) => (
                <View key={key} style={styles.checklistItemStyle}>
                  <Image
                    style={styles.checkIcon}
                    source={require("../../assets/images/checkIcon01.png")}
                  />
                  <Text style={styles.checklistText}>
                    {val?.checklist_name}
                  </Text>
                </View>
              ))
            :activeTab===2?
              <View style={{marginTop:12}}>
                <View style={styles.checklistItemStyle}>
                  <View style={{flex:1,justifyContent:"flex-start",marginRight:8}}>
                    <Text style={[styles.checklistText,{marginLeft:0}]}>
                      Costco Q4 Project
                    </Text>
                    <Text style={{fontSize:12,color:"gray"}}>
                      Source concepts and create storyboards
                    </Text>
                  </View>
                  <View style={{flex:1,justifyContent:"flex-start",marginLeft:8}}>
                    <Text style={[styles.checklistText,{marginLeft:0}]}>
                      Ongoing
                    </Text>
                    <Text style={{fontSize:12,color:"gray"}}>
                      1:30pm - Now
                    </Text>
                  </View>
                </View>
                <View style={styles.checklistItemStyle}>
                  <View style={{flex:1,justifyContent:"flex-start",marginRight:8}}>
                    <Text style={[styles.checklistText,{marginLeft:0}]}>
                      Lunch Break - Unpaid
                    </Text>
                  </View>
                  <View style={{flex:1,justifyContent:"flex-start",marginLeft:8}}>
                    <Text style={[styles.checklistText,{marginLeft:0}]}>
                      0h 30m
                    </Text>
                    <Text style={{fontSize:12,color:"gray"}}>
                      12:30pm - 1:00pm
                    </Text>
                  </View>
                </View>
                <View style={styles.checklistItemStyle}>
                  <View style={{flex:1,justifyContent:"flex-start",marginRight:8}}>
                    <Text style={[styles.checklistText,{marginLeft:0}]}>
                      Brent River Packaging
                    </Text>
                    <Text style={{fontSize:12,color:"gray"}}>
                      Consulting
                    </Text>
                  </View>
                  <View style={{flex:1,justifyContent:"flex-start",marginLeft:8}}>
                    <Text style={[styles.checklistText,{marginLeft:0}]}>
                      3h 30m
                    </Text>
                    <Text style={{fontSize:12,color:"gray"}}>
                      09:08am - 12:30pm
                    </Text>
                  </View>
                </View>
              </View>
            :null}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity 
        activeOpacity={.7}
        style={{position:"absolute",bottom:140,right:20}}
        onPress={() => {
          setContactType("call");
          refRBSheet.current.open();
        }}>
        <Image
          style={{height:50,width:50,resizeMode:"cover"}}
          source={require('../../assets/images/call.png')}
        />
      </TouchableOpacity>
      <TouchableOpacity 
        activeOpacity={.7}
        style={{position:"absolute",bottom:80,right:20}}
        onPress={() => {
          setContactType("email");
          refRBSheet.current.open();
        }}>
        <Image
          style={{height:50,width:50,resizeMode:"cover"}}
          source={require('../../assets/images/chat.png')}
        />
      </TouchableOpacity>
      <View style={{flexDirection:"row",marginHorizontal:12,marginBottom:14}}>
        <TouchableOpacity
          activeOpacity={.7}
          style={{flex:1,justifyContent:"center",borderRadius:6,
          backgroundColor:"#cce5ff",paddingVertical:18,marginRight:8}}
          onPress={() => navigation.navigate("Pending Details",{detail:booking_detail})}>
          <Text style={{fontSize:14,fontWeight:"bold",color:"#004085",textAlign:"center"}}>
            View Details
          </Text>
        </TouchableOpacity>
      </View>
      {/* contact bottom sheet */}
      <RBSheet
        height={180}
        ref={refRBSheet}
        closeOnDragDown={true}
        customStyles={{
          wrapper:{backgroundColor:"#2632384f"},
          draggableIcon:{backgroundColor:"#000"},
          container:{backgroundColor:"#FFF",paddingVertical:20,
          paddingHorizontal:16,borderTopLeftRadius:20,borderTopRightRadius:20},
        }}>
        <View style={{flexDirection:"row"}}>
          <View style={{flex:1,justifyContent:"center"}}>
            <Text style={{color:"#000",fontWeight:"bold",fontSize:18}}>
              Make a conversation with the customer or the fleet?
            </Text>
          </View>
          <TouchableOpacity 
            activeOpacity={.7}
            onPress={() => refRBSheet.current.close()}
            style={{justifyContent:"center",paddingLeft:20}}>
            <Image
              style={{height:20,width:20,resizeMode:"cover"}}
              source={require('../../assets/images/close.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={{flexDirection:"row",marginTop:34}}>
          <TouchableOpacity
            activeOpacity={.7}
            onPress={() => contactHandle("serviceman")}
            style={{flex:1,justifyContent:"center",marginRight:8,
            backgroundColor:Colors.Primary,padding:12,borderRadius:6}}>
            <Text style={{fontSize:16,color:"#FFF",fontWeight:"bold",textAlign:"center"}}>
              Serviceman
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={.7}
            onPress={() => contactHandle("fleet")}
            style={{flex:1,justifyContent:"center",marginLeft:8,
            backgroundColor:Colors.Primary,padding:12,borderRadius:6}}>
            <Text style={{fontSize:16,color:"#FFF",fontWeight:"bold",textAlign:"center"}}>
              Fleet
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
      {/* add check list modal */}
      <Modal
        transparent={true}
        visible={showModal}
        statusBarTranslucent
        animationType={"fade"}
        onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>
              Add Checklist Item
            </Text>
            <TextInput
              value={newItem}
              style={styles.modalInput}
              onChangeText={setNewItem}
              placeholder={"Enter checklist item"}
            />
            <View style={{flexDirection:"row",marginTop:6}}>
              <TouchableOpacity
                activeOpacity={.7}
                style={[styles.modalButton,{marginRight:6}]}
                onPress={() => navigation.navigate("CheckListScreen",{
                  booking_detail: booking_detail,
                })}>
                {buttonLoader?
                  <ActivityIndicator color={"#FFF"} size={"small"} />
                :
                  <Text style={styles.modalButtonText}>
                    Submit
                  </Text>
                }
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={.7}
                onPress={() => setShowModal(false)}
                style={[styles.modalButton,{backgroundColor:"#FFF",marginLeft:6}]}>
                <Text style={[styles.modalButtonText,{color:Colors.Primary}]}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.secondaryColor,
  },
  loader: {
    width: 100,
    height: 100,
  },
  loadingText: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: "bold",
    color: Colors.Primary,
  },
  timeCounter: {
    width: "100%",
    height: "100%",
    paddingTop: 20,
  },
  bookingStartText: {
    fontSize: 20,
    color: "#155724",
    textAlign: "center",
    fontFamily: Fonts.Bold,
  },
  dateText: {
    fontSize: 16,
    color: "#155724",
    textAlign: "center",
    paddingVertical: 12,
    fontFamily: Fonts.Bold,
  },
  dateSubText: {
    fontSize: 16,
    fontFamily: Fonts.Bold,
  },
  timerContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  timeBlock: {
    borderRadius: 5,
    shadowRadius: 3.84,
    shadowOpacity: 0.25,
    shadowColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: {width:0,height:2},
  },
  timeText: {
    fontSize: 52,
    color: "#155724",
    fontFamily: Fonts.Bold
  },
  timeColon: {
    fontSize: 30,
    color: "#155724",
    fontFamily: Fonts.Bold
  },
  serviceTimeContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  serviceTimeText: {
    fontSize: 42,
    color: "#ffff",
    paddingBottom: 20,
    fontWeight: "bold",
  },
  serviceTime: {
    color: "red",
    fontSize: 28,
    fontFamily: Fonts.Bold,
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
  button: {
    width: "100%",
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "center",
    backgroundColor: "#4cb050",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.White,
  },
  WorkCompleted: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  breakReasonText: {
    fontSize: 16,
    color: "#000",
    fontFamily: Fonts.Bold,
  },
  activeTab: {
    color: "#000",
    textAlign: "center",
    borderBottomWidth: 2,
    fontFamily: Fonts.Bold,
    borderBottomColor: "#000",
  },
  TabButton: {
    color: "#000",
    textAlign: "center",
    fontFamily: Fonts.Bold,
  },
  addChecklistButton: {
    top: 30,
    right: 0,
    width: 120,
    height: 40,
    zIndex: 999,
    borderRadius: 6,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.Primary,
  },
  checklistItem: {
    marginBottom: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  checkIcon: {
    width: 30,
    height: 30,
    resizeMode: "cover",
  },
  checklistText: {
    color: "#000",
    marginLeft: 10,
    fontFamily: Fonts.Bold,
    textTransform: "capitalize",
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    padding: 20,
    width: "80%",
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  modalHeading: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.Primary,
  },
  modalInput: {
    width: "100%",
    color: "#000",
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 10,
    paddingVertical: 8,
    borderColor: "#CCC",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    borderColor: Colors.Primary,
    backgroundColor: Colors.Primary,
  },
  modalButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  ModalHead: {
    fontSize: 20,
    paddingBottom: 12,
    fontWeight: "bold",
    color: Colors.Primary,
  },
  submitButton: {
    width: 100,
    height: 40,
    marginLeft: 10,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.Primary,
  },
  submitButtonText: {
    color: "#fff",
  },
  completedWorkContainer: {
    flex: 1,
    margin: 20,
    padding: 20,
    elevation: 5,
    marginTop: 0,
    borderRadius: 10,
    shadowRadius: 3.84,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    backgroundColor: "#fff",
    shadowOffset: {width:0,height:2},
  },
  completedWorkHeading: {
    fontSize: 24,
    color: "#000",
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  completedWorkText: {
    fontSize: 18,
    color: "black",
    marginBottom: 10,
  },
  completedWorkItem: {
    fontSize: 16,
    color: "#000",
    marginLeft: 20,
    marginBottom: 5,
    textTransform: "capitalize",
  },
  imageContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 40,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  image: {
    width: 150,
    height: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#000",
    marginVertical: 10,
    fontFamily: Fonts.Bold,
  },
  input: {
    height: 45,
    color: '#000',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    textAlign: 'left',
    fontWeight: '600',
    paddingHorizontal: 10,
    borderColor: Colors.Gray,
  },
  textArea: {
    marginTop: 6,
    borderWidth: 1,
    borderRadius: 6,
    paddingBottom: 80,
    borderColor: '#CCC',
    paddingHorizontal: 10,
  },
  checklistItemStyle: {
    elevation: 11,
    borderRadius: 6,
    marginBottom: 12,
    shadowRadius: 6.68,
    shadowOpacity: 0.36,
    paddingVertical: 14,
    shadowColor: "#CCCC",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 12,
    shadowOffset: {width:0,height:5},
    backgroundColor: theme.color.white,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    borderWidth: 1,
    borderRadius: 6,
    paddingRight: 30,
    borderColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  inputAndroid: {
    width: "100%",
    fontSize: 16,
    color: "#000",
    borderWidth: 1,
    borderRadius: 6,
    paddingRight: 30,
    marginVertical: 10,
    borderColor: "#ccc",
    backgroundColor: "#EEE",
  },
});
