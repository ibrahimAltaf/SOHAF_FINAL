import React, { useState } from 'react';
import {StyleSheet, View, ScrollView, TextInput, Image, TouchableOpacity, Text} from 'react-native';
import {Avatar} from 'react-native-paper';

import {useNavigation} from '@react-navigation/native';
import { Fonts,Colors } from '../utils/IMAGES';
import Header from '../component/Header/header';

const inboxData = {
  
  adminList: [
    {id: 1, sender: 'John Doe', subject: 'Meeting Reminder', message: "Don't forget about the meeting tomorrow!"}
  ],
  customerList: [
    {id: 1, sender: 'Jane Smith', subject: 'Vacation Request', message: 'Can I take next Monday off for vacation?'},
    {id: 2, sender: 'Alice Johnson', subject: 'Project Update', message: 'Here is the latest update on our project progress.'},
  ],
  serviceManList: [
    {id: 1, sender: 'John Doe', subject: 'Meeting Reminder', message: "Don't forget about the meeting tomorrow!"},
    {id: 2, sender: 'Jane Smith', subject: 'Vacation Request', message: 'Can I take next Monday off for vacation?'},
    {id: 3, sender: 'Alice Johnson', subject: 'Project Update', message: 'Here is the latest update on our project progress.'},
  ],
};

const Inbox = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(1);
  const [searchValue, setSearchValue] = useState("");

  return (
 <>
    <View style={{
      marginTop:28
     }}></View>
      <Header
      title={"Inox"}
      backArrow
      backPage={() => navigation.goBack()}  
  />
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.searchBoxStyle}>
          <View style={{flex:1,justifyContent:"center"}}>
            <TextInput
              value={searchValue}
              style={{padding:0}}
              placeholder={'Search...'}
              onChangeText={setSearchValue}
            />
          </View>
          <View style={{justifyContent:"center"}}>
            <Image
              style={{height:20,width:20,resizeMode:"cover"}}
              source={require('../assets/images/search.png')}
            />
          </View>
        </View>
        {inboxData?.adminList?.map((val, key) => {
          return (
            <TouchableOpacity
              key={key}
              activeOpacity={.7}
              style={styles.listStyle}
              onPress={() => navigation.navigate('chat',{
                message: val?.message
              })}>
              <View style={{justifyContent:"center"}}>
                <Avatar.Image 
                  size={48} 
                  source={{uri:'https://media.istockphoto.com/id/1476170969/photo/portrait-of-young-man-ready-for-job-business-concept.webp?b=1&s=170667a&w=0&k=20&c=FycdXoKn5StpYCKJ7PdkyJo9G5wfNgmSLBWk3dI35Zw='}}
                />
              </View>
              <View style={{flex:1,justifyContent:"center",paddingLeft:12}}>
                <Text style={styles.titleStyle}>
                  {val?.sender}
                </Text>
                <Text style={styles.descStyle}>
                  {val?.subject}
                </Text>
              </View>
            </TouchableOpacity>
          )
        })}
        <View style={{flexDirection:"row",margin:12}}>
          <TouchableOpacity
            activeOpacity={.7}
            onPress={() => setActiveTab(1)}
            style={{justifyContent:"center",paddingBottom:12,marginRight:12}}>
            <Text style={{color:activeTab===1?Colors.Primary:"#CCC",fontFamily:Fonts.Bold,fontSize:16}}>
              Customer
            </Text>
            <View style={{height:4,width:40,backgroundColor:activeTab===1?Colors.Primary:"#FFF",borderTopLeftRadius:8,borderTopRightRadius:8,marginTop:6}}></View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={.7}
            onPress={() => setActiveTab(2)}
            style={{justifyContent:"center",paddingBottom:12,marginLeft:12}}>
            <Text style={{color:activeTab===2?Colors.Primary:"#CCC",fontFamily:Fonts.Bold,fontSize:16}}>
              Serviceman
            </Text>
            <View style={{height:4,width:40,backgroundColor:activeTab===2?Colors.Primary:"#FFF",borderTopLeftRadius:8,borderTopRightRadius:8,marginTop:6}}></View>
          </TouchableOpacity>
        </View>
        {activeTab===1?
          inboxData?.customerList?.map((val, key) => {
            return (
              <TouchableOpacity
                key={key}
                activeOpacity={.7}
                style={styles.listStyle}
                onPress={() => navigation.navigate('chat',{
                  message: val?.message
                })}>
                <View style={{justifyContent:"center"}}>
                  <Avatar.Image 
                    size={48} 
                    source={{uri:'https://media.istockphoto.com/id/1476170969/photo/portrait-of-young-man-ready-for-job-business-concept.webp?b=1&s=170667a&w=0&k=20&c=FycdXoKn5StpYCKJ7PdkyJo9G5wfNgmSLBWk3dI35Zw='}}
                  />
                </View>
                <View style={{flex:1,justifyContent:"center",paddingLeft:12}}>
                  <Text style={styles.titleStyle}>
                    {val?.sender}
                  </Text>
                  <Text style={styles.descStyle}>
                    {val?.subject}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          })
        :
          inboxData?.serviceManList?.map((val, key) => {
            return (
              <TouchableOpacity
                key={key}
                activeOpacity={.7}
                style={styles.listStyle}
                onPress={() => navigation.navigate('chat',{
                  message: val?.message
                })}>
                <View style={{justifyContent:"center"}}>
                  <Avatar.Image 
                    size={48} 
                    source={{uri:'https://media.istockphoto.com/id/1476170969/photo/portrait-of-young-man-ready-for-job-business-concept.webp?b=1&s=170667a&w=0&k=20&c=FycdXoKn5StpYCKJ7PdkyJo9G5wfNgmSLBWk3dI35Zw='}}
                  />
                </View>
                <View style={{flex:1,justifyContent:"center",paddingLeft:12}}>
                  <Text style={styles.titleStyle}>
                    {val?.sender}
                  </Text>
                  <Text style={styles.descStyle}>
                    {val?.subject}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          })
        }
      </ScrollView>
    </View>
 </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  searchBoxStyle: {
    elevation: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 12,
    paddingVertical: 8,
    shadowRadius: 7.49,
    shadowColor: "#CCC",
    shadowOpacity: 0.37,
    borderColor: "#EEE",
    flexDirection: "row",
    marginHorizontal: 12,
    paddingHorizontal: 12,
    backgroundColor: "#FFF",
    shadowOffset: {width:0,height:6},
  },
  list: {
    paddingVertical: 8,
  },
  inboxItem: {
    elevation: 2,
    marginBottom: 8,
    backgroundColor: '#FFF',
  },
  listStyle: {
    elevation: 12,
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 12,
    shadowRadius: 7.49,
    borderColor: "#EEE",
    shadowColor: "#CCC",
    shadowOpacity: 0.37,
    paddingVertical: 14,
    flexDirection: "row",
    marginHorizontal: 12,
    paddingHorizontal: 12,
    backgroundColor: "#FFF",
    shadowOffset: {width:0,height:6},
  },
  titleStyle: {
    fontSize: 16,
    color: "#000",
    paddingBottom: 6,
    fontFamily: Fonts.Bold,
    textTransform: "capitalize",
  },
  descStyle: {
    fontSize: 12,
    color: "gray",
    fontFamily: Fonts.Regular,
  }
});

export default Inbox;
