import React from "react";
import {View, Text, Dimensions} from "react-native";

const NoDataFound = (props) => {
    const {title} = props;
    return (
        <View style={{height:Dimensions.get("window").height/1.2,justifyContent:"center"}}>
            <Text style={{fontSize:16,color:"#000",textAlign:"center",fontWeight:"bold"}}>
                {title}
            </Text>
        </View>
    )
}

export default NoDataFound;
