import React, {useState, useEffect} from "react";
import {StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, Image, ActivityIndicator, ScrollView, Alert} from "react-native";
import {useSelector} from "react-redux";
import {theme} from "../../utils/styles";
import {helpers} from "../../utils/helpers";
import {Colors, Fonts} from "../../utils/IMAGES";
import {useNavigation} from "@react-navigation/native";
import Header from "../../component/Header/header";

import CustomStatusBar from "../../component/StatusBar/customStatusBar";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function CheckListScreen(props) {
  const navigation = useNavigation();
  const {booking_detail} = props.route.params;
  const {access_token} = useSelector(state => state.userReducer);
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [checkListItems, setCheckListItems] = useState([]);

  useEffect(() => {
    getCheckListHandle();
  }, []);
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
  const addCheckListHandle = () => {
    try {
      if (newItem==="") {
        alert("Enter CheckList Item");
      } else {
        setButtonLoader(true);
        const myHeaders = new Headers();
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        myHeaders.append("Authorization", `Bearer ${access_token}`);

        const formdata = new FormData();
        formdata.append("request_id", booking_detail?.id);
        formdata.append("checklist_name", newItem);

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: formdata,
          redirect: "follow",
        };

        fetch(`${helpers.api.baseUrl}requests/add_checklist`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setButtonLoader(false);
          console.log("UPDATE STATUS RESPONSE =====> ", result);
          if (result?.success) {
            setNewItem("");
            setShowModal(false);
            getCheckListHandle();
            Alert.alert(
              result?.message,
              '',
              [
                {
                  text: 'Go Back',
                  onPress: () => navigation.goBack(),
                },
                {
                  text: 'Close',
                  style: 'cancel',
                },
              ],
              {cancelable: true}
            );
            if (newItem.trim()) setCheckListItems([...checkListItems, newItem]);
          } else {
            alert(result?.message);
          };
        }).catch((error) => {
          setButtonLoader(false);
          alert(error?.message);
        });
      };
    } catch (error) {
      setButtonLoader(false);
      alert(error?.message);
    };
  };

  return (
    <View style={styles.container}>
      <CustomStatusBar
        barStyle={"light-content"}
        backgroundColor={Colors.Primary}
      />
      <Header
        HeaderTittle={'Add Check List'}
      />
  
      <ScrollView>
        {checkListItems?.map((val, key) => (
          <View key={key} style={styles.checklistItemStyle}>
            <Image
              style={styles.checkIcon}
              source={require("../../assets/images/checkIcon01.png")}
            />
            <Text style={styles.checklistText}>
              {val?.checklist_name}
            </Text>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        activeOpacity={.7}
        style={styles.addChecklistButton}
        onPress={() => setShowModal(true)}>
        <Text style={{color:"#fff"}}>
          Add Checklist
        </Text>
      </TouchableOpacity>
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
                onPress={addCheckListHandle}
                style={[styles.modalButton,{marginRight:6}]}>
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
  addChecklistButton: {
    margin: 20,
    height: 40,
    borderRadius: 6,
    alignItems: "center",
    fontFamily: Fonts.Bold,
    justifyContent: "center",
    backgroundColor: Colors.Primary,
  },
  checklistItemStyle: {
    elevation: 11,
    marginTop: 12,
    marginBottom: 6,
    borderRadius: 6,
    shadowRadius: 6.68,
    shadowOpacity: 0.36,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#CCCC",
    flexDirection: "row",
    marginHorizontal: 20,
    paddingHorizontal: 12,
    shadowOffset: {width:0,height:5},
    backgroundColor: theme.color.white,
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
});
