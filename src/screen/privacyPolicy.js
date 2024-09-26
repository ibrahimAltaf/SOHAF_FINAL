import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { theme } from "../constants/styles";
import { useNavigation } from "@react-navigation/native";
import Header from "../component/Header/header";
import CustomButton from "../component/Buttons/customButton";
import CustomStatusBar from "../component/StatusBar/customStatusBar";

const PrivacyPolicy = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <CustomStatusBar barStyle={"light-content"} backgroundColor={"#044F86"} />
      <Header
        backArrow={true}
        title={"Privacy Policy"}
        backPage={() => navigation.goBack()}
      />
      <ScrollView>
        <View style={styles.innerContainer}>
          <View style={{ paddingBottom: 12 }}>
            <Text style={styles.headerText}>
              Welcome to Arbeittech Privacy Policy
            </Text>
            <Text style={styles.termText}>
              At Arbeittech, we are committed to safeguarding the privacy and
              security of our customers' personal information. This Privacy
              Policy outlines how we collect, use, disclose, and protect the
              data we gather through our website, mobile applications, and other
              services.
            </Text>
          </View>
          <View style={{ paddingBottom: 12 }}>
            <Text style={styles.headerText}>Information We Collect:</Text>
            <Text style={styles.termText}>
              <Text style={styles.subHeaderText}>Personal Information:</Text>
              {"\n"}
              When you use our services, we may collect personal information
              such as your name, address, email address, phone number, and
              payment details.
            </Text>
            <Text style={styles.termText}>
              <Text style={styles.subHeaderText}>Usage Data:</Text>
              {"\n"}
              We may gather information about how you interact with our website
              and services, including IP addresses, browser type, device
              identifiers, and pages visited.
            </Text>
            <Text style={styles.termText}>
              <Text style={styles.subHeaderText}>Cookies:</Text>
              {"\n"}
              We use cookies and similar tracking technologies to enhance your
              browsing experience and gather information about your preferences
              and activities on our platform.
            </Text>
          </View>
          <View style={{ paddingBottom: 12 }}>
            <Text style={styles.headerText}>Improving Our Services:</Text>
            <Text style={styles.termText}>
              We analyze user data to enhance the functionality, usability, and
              performance of our website and services, and to develop new
              features and offerings.
            </Text>
          </View>

          <CustomButton
            title={"Accept"}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            customButtonStyle={{ marginTop: 20, marginHorizontal: 0 }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  innerContainer: {
    padding: 20,
    paddingBottom: 0,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  subHeaderText: {
    fontWeight: "700",
    color: "#000000",
  },
  termText: {
    fontSize: 14,
    lineHeight: 21,
    color: theme.color.textColor,
    marginTop: 8,
  },
});

export default PrivacyPolicy;
