

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Image } from 'react-native';
import Header from '../component/Header/header';
import { useNavigation } from '@react-navigation/native';

export default function HelpSupport() {
    const navigation = useNavigation()
  // Function to handle call
  const handleCallPress = () => {
   
    Linking.openURL('tel:+1 (832) 494-6925');
  };

  // Function to handle email
  const handleEmailPress = () => {
    // Replace 'support@example.com' with the email address you want to send to
    Linking.openURL('mailto:support@arbeittech.com');
  };

  // Function to handle website
  const handleWebsitePress = () => {
    // Replace 'https://example.com' with the website URL you want to open
    Linking.openURL('https://arbeittech.com/');
  };

  return (
  <>
  <View style={{
    marginTop:28,
  }}>

  </View>
           <Header
  backArrow
  backPage={() => navigation.goBack()}  
  title="Help & Support"
/>
    <View style={styles.container}>
      <View style={styles.option}>
        <TouchableOpacity style={styles.ButtonCall} onPress={handleCallPress}>
      <View>
      <Image source={require('../assets/images/call.png')} style={styles.optionImage} />
      </View>
        <View>
        <Text style={styles.optionText}>Call</Text>
        </View>
        </TouchableOpacity>
      </View>
      <View style={styles.option}>
        <TouchableOpacity style={styles.ButtonCall} onPress={handleEmailPress}>
   <View>
   <Image source={require('../assets/images/email.png')} style={styles.optionImage} />
   </View>
       <View>
       <Text style={styles.optionText}>Email</Text>
       </View>
        </TouchableOpacity>
      </View>
      <View style={styles.option}>
        <TouchableOpacity style={styles.ButtonCall} onPress={handleWebsitePress}>
       <View>
       <Image source={require('../assets/images/web.png')} style={styles.optionImage} />
       </View>
       <View>
       <Text style={styles.optionText}>Website</Text>
       </View>
        </TouchableOpacity>
      </View>
      <Text style={{
        textAlign:"center",
        color:"#000",
        fontWeight:"500",
        position:"absolute",
        bottom:50,  
        fontSize:16,  
        alignSelf:"center"
      }}>
        Support Team will contact you soon
      </Text>
    </View>
  </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical:20
  },
  option: {
    flexDirection: 'row',
  
  
    alignSelf:"center"
    
  },
  optionImage: {
    width: 24,
    height: 24,

  },
  optionText: {
    color:"gray",
    fontSize:18,
    fontWeight:"500"

  },
  ButtonCall:{
    flexDirection: 'row',
    height: 75,
  width:"95%",
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
          alignItems:"center",
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
    alignSelf:"center",
   
    gap:20
  }
});