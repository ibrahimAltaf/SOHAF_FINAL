import React, {useEffect, useState} from "react";
import {StyleSheet, View, Image, Text, ScrollView, TouchableOpacity, Dimensions} from "react-native";
import {useSelector} from "react-redux";
import {helpers} from "../utils/helpers";
import {theme} from "../constants/styles";
import {FontFamily} from "../constants/fonts";
import {useNavigation} from "@react-navigation/native";
import Header from "../component/Header/header";
import Loader from "../component/Loader/loader";
import CustomStatusBar from "../component/StatusBar/customStatusBar";

const AllCategories = (props) => {
  const navigation = useNavigation();
  const {category_id, route_name} = props.route.params;
  const {user_location} = useSelector((state) => state.userReducer);
  const [loader, setLoader] = useState(true);
  const [categoriesList, setCategoriesList] = useState([]);
  const [categoryId, setCategoryId] = useState(category_id);
  const [subCategoriesList, setSubCategoriesList] = useState([]);

  useEffect(() => {
    if (route_name==="see all") {
      getCategoriesHandle();
    } else {
      getSubCategoriesHandle(category_id);
    };
  }, [category_id]);
  const getCategoriesHandle = () => {
    try {
      setLoader(true);
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch(`${helpers.api.baseUrl}categories`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setCategoriesList(result);
        console.log("result =====> ", result);
        if (!categoryId) {
          setCategoryId(result[0]?.id);
          getSubCategoriesHandle(result[0]?.id);
        } else {
          getSubCategoriesHandle(categoryId);
        };
      }).catch((error) => {
        setLoader(false);
        console.log(error?.message);
      });
    } catch (error) {
      setLoader(false);
      console.log(error?.message);
    };
  };
  const getSubCategoriesHandle = (category_id) => {
    try {
      setLoader(true);
      const formdata = new FormData();
      formdata.append("category_id", category_id);
      formdata.append("current_latitude", user_location?.latitude);
      formdata.append("current_longitude", user_location?.longitude);
      formdata.append("location_lat", user_location?.latitude);
      formdata.append("location_long", user_location?.longitude);
      formdata.append("location", user_location?.address);

      const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      };

      fetch(`${helpers.api.baseUrl}Filter_services`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setLoader(false);
        if (result?.status) {
          setSubCategoriesList(result?.services);
        };
      }).catch((error) => {
        setLoader(false);
        console.log(error?.message);
      });
    } catch (error) {
      setLoader(false);
      console.log(error?.message);
    };
  };

  return (
    <View style={styles.container}>
      <CustomStatusBar
        barStyle={"light-content"}
        backgroundColor={"#044F86"}
      />
      {loader?<Loader />:null}
      <Header
        backArrow={true}
        title={"Available Service"}
        backPage={() => navigation.goBack()}
      />
      <ScrollView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categoriesList?.map((val, key) => (
              <View key={key} style={{flex:1,marginTop:12}}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[styles.columnStyle,{marginLeft:key===0?12:0,
                  backgroundColor:categoryId===val?.id?theme.color.primaryColor:"#EEE"}]}
                  onPress={() => {
                    setCategoryId(val?.id);
                    getSubCategoriesHandle(val?.id);
                  }}>
                  <Image
                    source={{uri:val?.image}}
                    style={{height:"80%",width:"100%",objectFit:"cover"}}
                  />
                  <Text style={[styles.categoryStyle,{color:categoryId===val?.id?"#FFF":"#000"}]}>
                    {val?.name}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <View style={{paddingVertical:26}}>
            <Text style={styles.subCategoryStyle}>
              Sub Categories
            </Text>
          </View>
        {subCategoriesList?.length===0?
          <View style={{height:Dimensions.get("window").height/2,justifyContent:"center"}}>
            <Text style={{fontSize:16,color:"#000",textAlign:"center",fontWeight:"bold"}}>
              No Sub Categories Found
            </Text>
          </View>
        :
        <View style={styles.tilesContainer}>
        {subCategoriesList?.map((val, key) => {
          return (
            <TouchableOpacity
              key={key}
              activeOpacity={0.7}
              style={styles.tileStyle}
              onPress={() => {
                navigation.navigate("ServiceDetail", {
                  serviceId: val?.id,
                  categoryId: categoryId,
                  subCategoryDetail: val,
                });
              }}
            >
              <View style={{ flex: 1, justifyContent: "center", marginLeft: 12 }}>
                <Text style={styles.titleStyle}>
                  {val?.name}
                </Text>
                <Text numberOfLines={2} style={styles.descStyle}>
                  {val?.description === null ? "No Description Found!" : val?.description}
                </Text>
              </View>
           <View style={{
            alignItems:"flex-end",
            justifyContent:"flex-end",
            alignSelf:"flex-end"
           }}>
           <Text style={{  fontSize: 14, fontWeight: "900", color: theme.color.primaryColor }}>
                {`${helpers.constant.currencyName} ${val?.price} ${val?.calculator}`}
              </Text>
      

           </View>
          
           <View style={{
        flex:1,
           }}>
              <TouchableOpacity
  style={{
    width: "100%",
    height: 35,
    backgroundColor: theme.color.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginTop:5,
  }}
  onPress={() => {
    navigation.navigate("ServiceDetail", {
      serviceId: val?.id,
      categoryId: categoryId,
      subCategoryDetail: val,
    });
  }}
>
  <Text
    style={{
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
      fontSize: 12, // Text size
    }}
  >
    Select
  </Text>
</TouchableOpacity>

      

           </View>
      
           
        
            </TouchableOpacity>
          );
        })}
      </View>
        }
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.secondaryColor,
  },
  columnStyle: {
    width: 120,
    height: 90,
    elevation: 9,
    marginRight: 12,
    borderRadius: 12,
    shadowRadius: 5.46,
    shadowColor: "#CCC",
    shadowOpacity: 0.32,
    paddingVertical: 20,
    alignItems: "center",
    backgroundColor: "#EEE",
    justifyContent: "center",
    shadowOffset: {width:0,height:3},
  },
  categoryStyle: {
    marginTop: 8,
    fontSize: 12,
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "capitalize",
  },
  subCategoryStyle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: theme.color.primaryColor,
  },
  tilesContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "space-between",
  },
  tileStyle: {
    elevation: 9,
    width: "100%",
    height: "auto",
    borderRadius: 8,
    marginBottom: 12,
    shadowRadius: 5.46,
    shadowColor: "#CCC",
    shadowOpacity: 0.32,
    paddingVertical: 12,

    paddingHorizontal: 12,
    backgroundColor: "#FFF",
    shadowOffset: {width:0,height:3},
  },
  titleStyle: {
    fontSize: 14,
    textAlign: "left",
    fontWeight: "bold",
    textTransform: "capitalize",
    color: theme.color.primaryColor,
  },
  descStyle: {
    fontSize: 14,
    color: "gray",
    marginBottom: 6,
    textAlign: "left",
    fontWeight: "900",
    fontFamily: FontFamily.blackFont,
  },
  linkStyle: {
    fontSize: 14,
    marginTop: 12,
    textAlign: "center",
    color: theme.color.primaryColor,
    textDecorationLine: "underline",
  },
});

export default AllCategories;
  