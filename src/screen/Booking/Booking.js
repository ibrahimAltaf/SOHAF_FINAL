
import React, {useState, useEffect, useCallback} from "react";
import {StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Modal, Alert, Dimensions, RefreshControl, Linking} from "react-native";
import {useSelector} from "react-redux";
import {theme} from "../../utils/styles";
import {Colors, Fonts} from "../../utils/IMAGES";
import {Picker} from '@react-native-picker/picker';
import {useNavigation} from "@react-navigation/native";
import {ToastMessage, helpers} from "../../utils/helpers";
import moment from "moment";
import Header from "../../component/Header/header";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomStatusBar from "../../component/StatusBar/customStatusBar";

const statusArray = [
  {id: 1, status: "All"},
  {id: 2, status: "New Job"},
  {id: 3, status: "Upcoming"},
  {id: 4, status: "On The Way"},
  {id: 5, status: "Ongoing"},
  {id: 6, status: "Completed"},
];

const Booking = (props) => {
  const navigation = useNavigation();
  const {access_token} = useSelector(state => state.userReducer);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [requestDetail, setRequestDetail] = useState(null);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [ongoingBookings, setOngoingBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [onTheWayBookings, setOnTheWayBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [activeTab, setActiveTab] = useState(statusArray[0]?.status);
  const [categoryNames, setCategoryNames] = useState([]);
  const [isJobCancelModalVisible, setJobCancelModalVisible] = useState(false);
  const [cancellationReasons, setCancellationReasons] = useState([]);
  const [selectedReason, setSelectedReason] = useState("");
  const [selectedJobId, setSelectedJobId] = useState(null);

  console.log("access_token ====> ", access_token)

  useEffect(() => {
    checkLoginStatus();
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkLoginStatus();
    });

    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    if (isJobCancelModalVisible) {
      fetchCancellationReasons();
    }
  }, [isJobCancelModalVisible]);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setActiveTab(statusArray[0]?.status);
    getAllBookingsHandle("all");
  }, []);
  const checkLoginStatus = () => {
    if (access_token===null) {
      navigation.navigate("Login", {
        routeName: "booking"
      });
    } else {
      setTabData();
    };
  };
  const fetchCancellationReasons = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("X-Requested-With", "XMLHttpRequest");
      myHeaders.append("Authorization", `Bearer ${access_token}`);
  
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
  
      const response = await fetch("https://arbeittech.com/api/user/reasons", requestOptions);
      const data = await response.json();
      
      // Directly set the fetched data if it's an array
      if (Array.isArray(data)) {
        setCancellationReasons(data);
      } else {
        setCancellationReasons([]);
        console.error("Unexpected response structure:", data);
      }
    } catch (error) {
      console.error("Error fetching cancellation reasons:", error);
    }
  };
  const setTabData = () => {
    setLoading(true);
    if (props.route.params?.tabData) {
      const {tabData} = props.route.params;
      console.log("tabData =====> ", tabData);
      getAllBookingsHandle(tabData?.toLowerCase());
      setActiveTab(tabData);
    } else {
      getAllBookingsHandle("all"); 
    };
  };
  const getAllBookingsHandle = async (checkStatus) => {
    try {
      // Start loading indicator
      setLoading(true);
      setRefreshing(true);
  
      // Prepare headers
      const myHeaders = new Headers();
      myHeaders.append("X-Requested-With", "XMLHttpRequest");
      myHeaders.append("Authorization", `Bearer ${access_token}`);
  
      // Prepare request options
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
  
      // Fetch data from the API
      const response = await fetch(`${helpers.api.baseUrl}requests/all_request`, requestOptions);
      const result = await response.json();
  
      // Stop loading indicator
      setLoading(false);
      setRefreshing(false);
  
      if (result?.error===undefined) {
        const categories = result?.map((val) => val?.category[0]?.name);
          setCategoryNames(categories);
        if (checkStatus?.toLowerCase() === "all") {
          setBookings(result);
        }
        setAllBookings(result);
  
        // Filter and set bookings by their status
        const pendingArray = result?.filter(val => val?.status?.toLowerCase() === "pending");
        if (checkStatus?.toLowerCase() === "pending") {
          setBookings(pendingArray);
        }
        setPendingBookings(pendingArray);
  
        const upcomingArray = result?.filter(val => val?.status?.toLowerCase() === "scheduled");
        if (checkStatus?.toLowerCase() === "upcoming") {
          setBookings(upcomingArray);
        }
        setUpcomingBookings(upcomingArray);
  
        const onTheWayArray = result?.filter(val => val?.status?.toLowerCase() === "ontheway");
        if (checkStatus?.toLowerCase() === "on the way") {
          setBookings(onTheWayArray);
        }
        setOnTheWayBookings(onTheWayArray);
  
        const ongoingArray = result?.filter(val => ["arrived", "in_progress", "resume", "pause", "paused"].includes(val?.status?.toLowerCase()));
        if (checkStatus?.toLowerCase() === "ongoing") {
          setBookings(ongoingArray);
        }
        setOngoingBookings(ongoingArray);
  
        const completedArray = result?.filter(val => val?.status?.toLowerCase() === "completed");
        if (checkStatus?.toLowerCase() === "completed") {
          setBookings(completedArray);
        }
        setCompletedBookings(completedArray);
      } else if (result?.error === "token_invalid" || result?.error === "token_expired") {
        // Handle token expiration
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('user_detail');
        await AsyncStorage.removeItem('user_location');
        navigation.replace('Login');
        alert("Session Expired!");
      } else {
        // Reset bookings states if error occurs
        setBookings([]);
        setAllBookings([]);
        setPendingBookings([]);
        setUpcomingBookings([]);
        setOnTheWayBookings([]);
        setOngoingBookings([]);
        setCompletedBookings([]);
      }
    } catch (error) {
      // Handle errors
      setLoading(false);
      setRefreshing(false);
      console.error(error?.message);
    }
  };
  const statusHandle = (value) => {
    try {
      // navigation.navigate("Booking Period", {
      //   booking_detail: value,
      // });
      // return
      console.log(value?.status);
      navigation.navigate("Pending Details",{detail:value});
      return;
      switch (value?.status?.toLowerCase()) {
        case "pending":
          navigation.navigate("Pending Details",{detail:value});
          break;
        case "scheduled":
          // navigation.navigate("Pending Details",{detail:value});
          navigation.navigate("Pending Details",{detail:value});
          break;
        case "upcoming":
          // navigation.navigate("Pending Details",{detail:value});
          navigation.navigate("Pending Details",{detail:value});
          break;
        case "ontheway":
          navigation.navigate("Pending Details",{detail:value});
          break;
        case "arrived":
          navigation.navigate("Pending Details",{detail:value});
          break;
        case "completed":
          navigation.navigate("Pending Details",{detail:value});
          break;
        default:
          break;
      };
    } catch (error) {
      console.log(error?.message);
    };
  };
  const tabsHandle = (status) => {
    try {
      setActiveTab(status);
      switch (status?.toLowerCase()) {
        case "all":
          setBookings(allBookings);
          break;
        case "pending":
          setBookings(pendingBookings);
          break;
        case "upcoming":
          setBookings(upcomingBookings);
          break;
        case "on the way":
          setBookings(onTheWayBookings);
          break;
        case "ongoing":
          setBookings(ongoingBookings);
          break;
        case "completed":
          setBookings(completedBookings);
          break;
        default:
          break;
      };
    } catch (error) {
      console.log(error?.message);
    };
  };
  const jobAcceptHandle = (job_id) => {
    setJobCancelModalVisible(true);
    setSelectedJobId(job_id);
  };
  const handleCancelJob = async () => {
    if (!selectedReason) {
      alert("Please select a reason for cancellation.");
      return;
    }
  
    try {
      setLoading(true);
      const myHeaders = new Headers();
      myHeaders.append("X-Requested-With", "XMLHttpRequest");
      myHeaders.append("Authorization", `Bearer ${access_token}`);
      myHeaders.append("Content-Type", "application/json");
  
      // Find the selected reason object by its ID
      const selectedReasonObject = cancellationReasons.find(reason => reason.id === selectedReason);
      const cancelReason = selectedReasonObject ? selectedReasonObject.reason : '';
  
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({ cancel_reason: cancelReason }),
        redirect: "follow",
      };
  
      const response = await fetch(
        `https://arbeittech.com/api/user/cancel/request?request_id=${selectedJobId}`,
        requestOptions
      );
      const result = await response.json();
      console.log("JOB CANCEL RESPONSE =====> ", result);
  
      // Close the modal after successful cancellation
      setJobCancelModalVisible(false);
      Alert.alert("Job Cancelled");
      setLoading(false);
    } catch (error) {
      console.error("Error cancelling job:", error);
      setLoading(false);
    }
  };
  const statusUpdatedHandle = (status, job_id) => {
    try {
      setLoading(true);
      const myHeaders = new Headers();
      myHeaders.append("X-Requested-With", "XMLHttpRequest");
      myHeaders.append("Authorization", `Bearer ${access_token}`);

      const formdata = new FormData();
      formdata.append("status", status);
      formdata.append("_method", "PATCH");

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };

      fetch(`${helpers.api.baseUrl}trip/${job_id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setTabsStatusHandle(status);
        console.log("UPDATE STATUS RESPONSE =====> ", result);
      }).catch((error) => {
        setLoading(false);
        console.log(error?.message);
      });
    } catch (error) {
      setLoading(false);
      console.log(error?.message);
    };
  };
  const setTabsStatusHandle = (status) => {
    try {
      switch (status?.toLowerCase()) {
        case "cancelled":
          setActiveTab("All");
          getAllBookingsHandle("all");
          break;
        case "ontheway":
          setActiveTab("On The Way");
          getAllBookingsHandle("on the way");
          break;
        case "arrived":
          setActiveTab("Ongoing");
          getAllBookingsHandle("ongoing");
          break;
        case "completed":
          setActiveTab("Completed");
          getAllBookingsHandle("completed");
          break;
        default:
          break;
      };
    } catch (error) {
      console.log(error?.message);
    };
  };
  const viewOnMapHandle = (value) => {
    var coordinates;
    if (value?.d_latitude[0]===null||value?.d_longitude[0]===null) {
      coordinates = `${value?.s_latitude},${value?.s_longitude}`;
    } else {
      coordinates = `${value?.d_latitude[0]},${value?.d_longitude[0]}`;
    };
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates}&travelmode=driving`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <CustomStatusBar
        barStyle={"light-content"}
        backgroundColor={"#044F86"}
      />
      <Header
        title={"Bookings"}
        backArrow
        backPage={() => navigation.goBack()}  
      />
      <ScrollView
        style={{paddingTop:12,marginBottom:80}}
        refreshControl={
          <RefreshControl
            onRefresh={onRefresh}
            refreshing={refreshing}
          />
        }>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}>
          {statusArray.map((val, key) => (
            <TouchableOpacity
              key={key}
              activeOpacity={0.7}
              onPress={() => tabsHandle(val.status)}
              style={[
                styles.tabStyle,
                { backgroundColor: activeTab === val.status ? Colors.Primary : '#EEE' }
              ]}>
              <Text style={[
                styles.tabTextStyle,
                { color: activeTab === val.status ? '#FFF' : '#000' }
              ]}>
                {val.status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {bookings?.length>0?
        bookings.map((val, key) => (
          <TouchableOpacity
            key={key}
            activeOpacity={0.7}
            style={styles.boxStyle}
            onPress={() => statusHandle(val)}>
            <View style={{flexDirection:'row'}}>
              <View style={{flex:1}}>
                <Text style={styles.headingStyle}>
                  {val?.booking_id}
                </Text>
                <Text style={{fontSize:11,color:"#000",fontWeight:"bold",fontWeight:"700",marginTop:6}}>
                  {val?.category[0]?.name}
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => statusHandle(val)}
                  style={{flex:0.5,justifyContent:'flex-end',alignItems:'flex-end',marginBottom:6}}>
                  <Text style={{fontSize:11,color:"#000",fontWeight:"bold",fontWeight:"900"}}>
                    View Details
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => statusHandle(val)}
                  style={{flex:0.5,alignItems:'center',backgroundColor:Colors.Primary,borderRadius:6,paddingHorizontal:18,paddingVertical:6}}>
                  <Text style={{fontSize:9,color:Colors.White,fontWeight:"bold",fontWeight:"500"}}>
                    {val?.status}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{flexDirection:'row',alignItems:"flex-start"}}>
              <View style={{flex:1}}>
                <View style={{flex:1,height:1,backgroundColor:Colors.Gray,marginVertical:5}}></View>
                <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                  <View>
                    <Text style={styles.dateStyle}>
                      Booking Date: {moment(val.assigned_at).format('D MMMM, YYYY h:mm')}
                    </Text>
                    <Text style={styles.dateStyle}>
                      Service Date: {moment(val.schedule_at).format('D MMMM, YYYY h:mm')}
                    </Text>
                  </View>
                  <View>
                    <Text style={{fontSize:11,fontWeight:"700"}}>
                      Total Amount
                    </Text>
                    <View>
                      <Text style={{fontSize:15,fontWeight:"900",textAlign:"center",color:Colors.Primary}}>
                        {helpers.constant.currencyName} {val?.payment?.total || 'N/A'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            {val?.status.toLowerCase()==='pending'&&
              <View style={{flexDirection:'row',marginTop:12,gap:10,justifyContent:"center"}}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.AssignedStyle}>
                  <Text style={styles.assignedTextStyle}>
                    Waiting for Accept
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => jobAcceptHandle(val.id)}
                  style={{borderRadius:6,paddingVertical:8,paddingHorizontal:24,
                  alignSelf:"flex-start",backgroundColor:Colors.White,height:40,borderWidth:1,
                  alignItems:"center",justifyContent:"center",elevation:5,width:"47%",borderColor:Colors.Primary}}>
                  <Text style={{fontSize:14,color:Colors.Primary,fontWeight:"bold",textAlign:"center"}}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            }
            {val?.status.toLowerCase()==='scheduled'&& 
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:15}}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{borderRadius:6,paddingVertical:8,paddingHorizontal:24,alignSelf:"flex-start",width:"100%",
                  backgroundColor:Colors.Primary,height:40,alignItems:"center",justifyContent:"center",elevation:5}}
                  onPress={() => statusUpdatedHandle('ONTHEWAY', val.id)}>
                  <Text style={styles.assignedTextStyle}>
                    Accepted
                  </Text>
                </TouchableOpacity>
              </View>
            }
            {val.status.toLowerCase()==='ontheway'&&
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:12}}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => viewOnMapHandle(val)}
                  style={[styles.viewDetailsStyle,{flexDirection:'row',gap:5}]}>
                  <Image
                    style={{width:20,height:25}}
                    source={require('../../assets/images/security-pin_6125244.png')}
                  />
                  <Text style={{fontWeight:"bold",color:'#000'}}>
                    Location
                  </Text>
                </TouchableOpacity>
              </View>
            }
            {['arrived', 'in_progress', 'resume', 'pause', 'paused'].includes(val.status.toLowerCase())?
              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    if (['IN_PROGRESS', 'RESUME', 'PAUSE', 'PAUSED'].includes(val.status)) {
                      navigation.navigate("Booking Period",{
                        booking_detail: val,
                      });
                    } else {
                      setRequestDetail(val);
                    };
                  }}
                  style={{backgroundColor:Colors.Primary,justifyContent:'center',alignSelf:'center',
                  alignItems:'center',height:40,width:'100%',borderRadius:6,elevation:5,marginTop:15}}>
                  <Text style={{color:'#fff',fontWeight:"bold"}}>
                    {['IN_PROGRESS', 'RESUME', 'PAUSE', 'PAUSED'].includes(val.status)?'View Job Timer':'Service Arrived at Your location'}
                  </Text>
                </TouchableOpacity>
              </View>
            :null}
            {val?.status?.toLowerCase()==='completed'&&
              <View style={{flexDirection:'row',marginTop:12}}>
                <View style={{flex:1,justifyContent:'center'}}>
                  <View style={styles.CompltedStyle}>
                    <Text style={styles.assignedTextStyle}>
                      Completed
                    </Text>
                  </View>
                </View>
              </View>
            }
          </TouchableOpacity>
        ))
        :
          <View style={{height:Dimensions.get('window').height/1.2,alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontSize:14,fontWeight:'bold',textAlign:'center'}}>
              No Bookings Found!
            </Text>
          </View>
        }
        <View style={{height:20}}></View>
        <Modal
          transparent={true}
          animationType={"slide"}
          visible={isJobCancelModalVisible}
          onRequestClose={() => setJobCancelModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Select Cancellation Reason
              </Text>
              <Picker
                style={styles.picker}
                selectedValue={selectedReason}
                onValueChange={(itemValue) => setSelectedReason(itemValue)}>
                <Picker.Item label="Select a reason..." value="" />
                {cancellationReasons?.length>0?
                  cancellationReasons?.map((reason, index) => (
                    <Picker.Item
                      key={index}
                      value={reason?.id}
                      label={reason?.reason}
                    />
                  ))
                :
                  <Picker.Item
                    value=""
                    label="No reasons available"
                  />
                }
              </Picker>
              <TouchableOpacity
                onPress={handleCancelJob}
                style={styles.submitButton}
                disabled={loading || !selectedReason}>
                <Text style={styles.submitButtonText}>
                  Submit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={.7}
                style={styles.closeButton}
                onPress={() => setJobCancelModalVisible(false)}>
                <Text style={styles.closeButtonText}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.secondaryColor,
  },
  tabStyle: {
    marginTop: 6,
    elevation: 5,
    marginLeft: 12,
    marginBottom: 12,
    borderRadius: 50,
    shadowRadius: 3.84,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    alignItems: "center",
    paddingHorizontal: 36,
    backgroundColor: "#EEE",
    justifyContent: "center",
    shadowOffset: {width:0,height:2},
  },
  tabTextStyle: {
    fontSize: 12,
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
  },
  boxStyle: {
    flex: 1,
    padding: 12,
    elevation: 5,
    borderRadius: 6,
    marginVertical: 6,
    shadowColor: "gray",
    shadowOpacity: 0.25,
    marginHorizontal: 12,
    backgroundColor: "#FFF",
    justifyContent: "center",
    shadowOffset: {width:0,height:2},
  },
  headingStyle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  priceStyle: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.color.primaryColor,
  },
  dateStyle: {
   
    fontSize: 12,
    color: "gray",
  },
  AssignedStyle: {
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
    backgroundColor: Colors.Primary,
    height:40,
    alignItems:"center",
    justifyContent:"center",

    elevation: 5,
    width:"47%",
  },
  CompltedStyle: {
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignSelf: "flex-start",
    backgroundColor: Colors.Primary,
    height:40,
    alignItems:"center",
    justifyContent:"center",

    elevation: 5,
    width:"100%",
  },
  assignedTextStyle: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  viewDetailsStyle: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 24,
  
    borderColor: theme.color.primaryColor,
    marginLeft: 12,
    width:"95%",
    justifyContent:"center",
    alignItems:"center",
    height:40,

  },
  viewDetailsTextStyle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: theme.color.primaryColor,

  },
  loader: {
    width: 100,
    height: 100,
  },
  loadingText: {
    color: Colors.Primary, // Set text color to Primary color
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold", // Adjust margin as needed
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  optionsContainer: {
    width: "100%",
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textArea: {
    marginTop: 6,
    borderWidth: 1,
    borderRadius: 6,
    paddingBottom: 80,
    borderColor: '#CCC',
    paddingHorizontal: 10,
  },
  imageContainer: {
    flexDirection: 'row',
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 5,
  },
  sectionTitle:{
    fontSize: 16,
    color: "#000",
    fontFamily: Fonts.Bold,
  }, modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  picker: {
    width: '100%',
    height: 50,
    marginBottom: 20,
  },
  submitButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FF6347',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#888',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Booking;
