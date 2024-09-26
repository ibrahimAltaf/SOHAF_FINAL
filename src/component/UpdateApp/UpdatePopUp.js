import React from 'react';
import {StyleSheet, View, Image, TouchableOpacity, Modal, Text} from 'react-native';
import {Colors} from '../../utils/IMAGES';

const  UpdatePopUp = (props) => {
  const {modalVisible, currentVersion, toggleModal, redirectToStore} = props;
  return (
    <Modal
      transparent={true}
      statusBarTranslucent
      animationType={"fade"}
      visible={modalVisible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Image
            style={styles.modalImageStyle}
            source={require("../../assets/images/update.png")}
          />
          <Text style={{color:Colors.Primary,fontSize:20,fontWeight:"bold",textAlign:"center"}}>
            Update Available
          </Text>
          <Text style={styles.modalDetailText}>
            {`There is a new version of the app available. Do you want to update to version ${currentVersion}?`}
          </Text>
          <View style={{flexDirection:'row',marginTop:20}}>
            <TouchableOpacity
              activeOpacity={.7}
              onPress={toggleModal}
              style={styles.notNowButtonStyle}>
              <Text style={styles.notNowButtonText}>
                Not Now
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={.7}
              onPress={redirectToStore}
              style={[styles.buttonMainStyle,{marginLeft:6}]}>
              <Text style={[styles.notNowButtonText,{color:"#FFF"}]}>
                Update Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 40,
    justifyContent: 'center',
    backgroundColor: "#282c349e",
  },
  modalView: {
    elevation: 5,
    width: "100%",
    borderRadius: 8,
    shadowRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    paddingVertical: 40,
    alignItems: 'center',
    paddingHorizontal: 26,
    backgroundColor: "#FFF",
    shadowOffset: {width:0,height:2},
  },
  modalImageStyle: {
    width: 60,
    height: 60,
    marginBottom: 18,
    resizeMode: 'cover',
  },
  modalDetailText: {
    color: "gray",
    marginTop: 10,
    lineHeight: 22,
    textAlign: 'center',
  },
  buttonMainStyle: {
    marginLeft: 6,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: Colors.Primary,
  },
  buttonText: {
    fontSize: 14,
    color: "#FFF",
    fontWeight: "600",
  },
  notNowButtonStyle: {
    borderWidth: 1,
    marginRight: 6,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderColor: Colors.Primary,
  },
  notNowButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.Primary,
  },
});

export default UpdatePopUp;