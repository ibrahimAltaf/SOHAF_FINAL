import React from 'react';
import {Colors, Fonts} from '../utils/IMAGES';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from '../screen/splash';
import Login from '../screen/Auth/login';
import SignUp from '../screen/Auth/signUp';





import BottomTabNavigator from './RootNavigation';





import Profile from '../screen/profile';







import Forgettpassword from '../screen/Auth/Forgettpassword';
import Notifiction from '../screen/Notifiction';
;

import Admin from '../screen/Admin';
import AuthorScreen from '../screen/AuthorScreen';
import Visitor from '../screen/Visitor';
import Live from '../screen/Live';
import Post from '../screen/Post';
import ShowPost from '../screen/ShowPost';
import Approvels from '../screen/Approvels';
import ApprovelView from '../screen/ApprovelView';
import ApprovelConfirm from '../screen/ApprovelConfirm';
import BlogList from '../screen/BlogList';
import BlogDetail from '../screen/BlogDetail';
import ChannelVideoScreen from '../screen/ChannelVideoScreen';
import Allnews from '../screen/Allnews';
import VisitorBlogs from '../screen/VisitorBlogs';
import Subscribes from '../screen/Subscribes';
import VisitorProfile from '../screen/VisitorProfile';
import AuthorBlogView from '../screen/AuthorBlogView';
import AddBlog from '../screen/AddBlog';
import AllBlog from '../screen/AllBlog';
import AuthorProfile from '../screen/AuthorProfile';
import AuthorPending from '../screen/AuthorPending';
import NewsBlogPage from '../screen/NewsBlogPage';
import VisitorHomeScreen from '../screen/Auth/VisitorHomeScreen';
import Setting from '../screen/Setting';

const Stack = createNativeStackNavigator();

const MainNavigation = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator
            initialRouteName="Splash">
            <Stack.Screen
                name="Splash"
                component={Splash}
                options={{headerShown:false}}
            />
            <Stack.Screen
                name="Login"
                component={Login}
                options={{headerShown:false}}
            />
            <Stack.Screen
                name="SignUp"
                component={SignUp}
                options={{headerShown:false}}
            />
         
            <Stack.Screen
                name="BottomTabNavigator"
                component={BottomTabNavigator}
                options={{headerShown:false}}
            />
         
       
       
       
      
        

   
     
            <Stack.Screen
        name="ForgetPassword"
        component={Forgettpassword}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
                <Stack.Screen
        name="Notification"
        component={Notifiction}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
          <Stack.Screen
        name="AllNews"
        component={Allnews}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
      
  
        
   
      <Stack.Screen
        name="AdminScreen"
        component={Admin}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
      
      <Stack.Screen
        name="VisitorScreen"
        component={Visitor}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
          <Stack.Screen
        name="AuthorScreen"
        component={AuthorScreen}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
       <Stack.Screen
        name="Visitor"
        component={Visitor}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
       <Stack.Screen
        name="Live"
        component={Live}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
       <Stack.Screen
        name="Post"
        component={Post}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
      <Stack.Screen
        name="ShowPost"
        component={ShowPost}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
           <Stack.Screen
        name="Aprrvoles"
        component={Approvels}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
        <Stack.Screen
        name="ApprovelView"
        component={ApprovelView}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
       <Stack.Screen
        name="ApprovelConfirm"
        component={ApprovelConfirm}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
         <Stack.Screen
        name="BlogList"
        component={BlogList}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
      <Stack.Screen
        name="BlogDetails"
        component={BlogDetail}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
          <Stack.Screen
        name="ChannelVideoScreen"
        component={ChannelVideoScreen}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
         <Stack.Screen
        name="VisitorBlog"
        component={VisitorBlogs}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
      <Stack.Screen
        name="Subscribe"
        component={Subscribes}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
      
        <Stack.Screen
        name="VisitorProfile"
        component={VisitorProfile}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
              <Stack.Screen
        name="AuthorBlogView"
        component={AuthorBlogView}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
  <Stack.Screen
        name="AddBlog"
        component={AddBlog}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
        <Stack.Screen
        name="AllBlogs"
        component={AllBlog}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
         <Stack.Screen
        name="AuthoProfile"
        component={AuthorProfile}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
          <Stack.Screen
        name="AuthorPending"
        component={AuthorPending}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
      <Stack.Screen
        name="NewsBlogPage"
        component={NewsBlogPage}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
       <Stack.Screen
        name="VisitorHomeScreen"
        component={VisitorHomeScreen}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
       <Stack.Screen
        name="Setting"
        component={Setting}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.Primary,
          },
          headerTintColor: Colors.White,
          headerTitleStyle: {
            fontFamily: Fonts.Bold,
          },
        }}
      />
        </Stack.Navigator>
      </NavigationContainer>
    );
};

export default MainNavigation;
