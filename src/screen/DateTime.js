import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ImageBackground, SafeAreaView, Animated, Modal, Dimensions} from 'react-native';
import {theme} from '../constants/styles';
import {ToastMessage} from '../utils/helpers';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {SetOrderDetail} from '../Redux/actions/actions';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import LinearGradient from 'react-native-linear-gradient';

export default function DateTime() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const {order_detail} = useSelector(state => state.userReducer);
  const [isPickerVisible, setPickerVisibility] = useState(true);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1.1,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    });
  }, []);
  const confirmDateHandle = () => {
    const now = new Date();
    const updatedDateTime = new Date(selectedDateTime);
    if (updatedDateTime<now.setHours(now.getHours()+3)) {
      alert("Please select service time at least 3 hours in advance.");
      return;
    };
    setPickerVisibility(false);
    const updatedOrderDetail = {...order_detail, selectedDateTime: selectedDateTime.toString()};
    dispatch(SetOrderDetail(updatedOrderDetail));
    navigation.navigate('CheckOut');
  };
  const handleNext = () => {
    if (isDateValidForNext(selectedDateTime)) {
      navigation.navigate('CheckOut', {
        formData,
        serviceId,
        categoryId,
        selectedDateTime
      });
    } else {
      ToastMessage("Please select a valid date and time.");
    };
  };
  const isDateValidForNext = (date) => {
    const now = new Date();
    const selectedDate = new Date(date);
    return selectedDate >= now.setHours(now.getHours() + 3);
  };

  return (
    <ImageBackground
      resizeMode={"cover"}
      style={styles.container}
      source={{uri:'https://img.freepik.com/free-photo/top-view-international-worker-s-day-with-engineer-tools_23-2150269664.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1721520000&semt=ais_user'}}>
      <LinearGradient
        style={styles.gradient}
        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0)']}>
        <SafeAreaView style={styles.safeArea}>
          <TouchableOpacity
            activeOpacity={.7}
            style={styles.button}
            onPress={() => setPickerVisibility(true)}>
            <Text style={styles.buttonText}>
              {selectedDateTime?moment(selectedDateTime).format('MMMM Do YYYY h:mm A'):'Select Date and Time'}
            </Text>
          </TouchableOpacity>
          <Modal
            transparent={true}
            statusBarTranslucent
            animationType={"fade"}
            visible={isPickerVisible}
            onRequestClose={() => setPickerVisibility(false)}>
            <View style={styles.modalOverlay}>
              <View style={{alignItems:"center",paddingHorizontal:12,marginBottom:12}}> 
                <Text style={{color:theme.color.white,fontSize:24,textAlign:"center",fontWeight:"700",marginBottom:6}}>
                  Select Service Date & Time
                </Text>
                <Text style={{color:theme.color.white,fontSize:16,textAlign:"center",fontWeight:"500",}}>
                  You can book services starting{`\n`}3 hours from now.
                </Text>
              </View>
              <View style={styles.datePickerContainer}>
                <DatePicker
                  mode={"datetime"}
                  textColor={"#000"}
                  date={selectedDateTime}
                  onDateChange={(date) => setSelectedDateTime(date)}
                />
              </View>
              <TouchableOpacity
                activeOpacity={.7}
                onPress={confirmDateHandle}
                style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
          {/* <Animated.View style={[styles.nextButtonContainer,{transform:[{scale:scaleAnim}]}]}>
            <TouchableOpacity
              activeOpacity={.7}
              // onPress={handleNext}
              style={[styles.nextButton,{opacity:
              isDateValidForNext(selectedDateTime)?1:0.5}]} 
              disabled={!isDateValidForNext(selectedDateTime)}>
              <Text style={styles.nextButtonText}>
                Next
              </Text>
            </TouchableOpacity>
          </Animated.View> */}
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    flex: 1,
    width: '100%',
  },
  safeArea: {
    flex: 1,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    width: '80%',
    elevation: 5,
    marginTop: 20,
    shadowRadius: 5,
    borderRadius: 10,
    shadowOpacity: 0.3,
    shadowColor: '#000',
    paddingVertical: 20,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'center',
    shadowOffset: {width:0,height:2},
  },
  buttonText: {
    fontSize: 18,
    color: '#4A90E2',
  },
  modalOverlay: {
    flex: 1,
    opacity: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007BFF',
  },
  datePickerContainer: {
    padding: 20,
    elevation: 10,
    borderRadius: 15,
    shadowRadius: 10,
    shadowOpacity: 0.3,
    shadowColor: '#000',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowOffset: {width:0,height:4},
    width: Dimensions.get('window').width-40,
  },
  confirmButton: {
    width: "90%",
    marginTop: 20,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: '#28a745',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  nextButtonContainer: {
    width: '80%',
    marginTop: 30,
  },
  nextButton: {
    height: 45,
    elevation: 5,
    width: '100%',
    shadowRadius: 5,
    borderRadius: 10,
    shadowOpacity: 0.3,
    shadowColor: '#000',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
    shadowOffset: {width:0,height:2},
  },
  nextButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
