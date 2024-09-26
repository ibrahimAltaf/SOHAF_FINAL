import React from "react";
import {View, SafeAreaView, StatusBar, StyleSheet} from "react-native";

const STATUSBAR_HEIGHT = StatusBar.currentHeight*1;

const CustomStatusBar = (props) => {
    const {backgroundColor, barStyle} = props;
    return (
        <View style={[styles.statusBar,
        {backgroundColor:backgroundColor}]}>
            <SafeAreaView>
                <StatusBar
                    translucent
                    barStyle={barStyle}
                    backgroundColor={backgroundColor}
                />
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    statusBar: {
        height: STATUSBAR_HEIGHT,
    },
})

export default CustomStatusBar;
