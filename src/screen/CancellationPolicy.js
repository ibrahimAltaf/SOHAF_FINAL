import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { theme } from "../constants/styles";
import { useNavigation } from "@react-navigation/native";
import Header from "../component/Header/header";
import CustomButton from "../component/Buttons/customButton";
import CustomStatusBar from "../component/StatusBar/customStatusBar";

const CancellationPolicy = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <CustomStatusBar barStyle={"light-content"} backgroundColor={"#044F86"} />
      <Header
        backArrow={true}
        title={"Cancellation Policy"}
        backPage={() => navigation.goBack()}
      />
      <ScrollView>
        <View style={styles.innerContainer}>
          <View style={{ paddingBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#000000" }}>
              Arbeittech Cancellation Policy
            </Text>
            <Text style={styles.termText}>
              At Arbeittech, we are committed to providing exceptional services.
              However, we understand that there may be instances where a refund
              is necessary. This policy outlines the guidelines for refund
              requests.
            </Text>
          </View>
          <View style={{ paddingBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#000000" }}>
              Eligibility for Refunds
            </Text>
            <Text style={styles.termText}>
              Non-Delivery: If a booked service is not delivered as agreed, you
              are entitled to a full refund.
              {`\n\n`}
              Cancellation: Cancellations made at least 24 hours before the
              scheduled appointment will result in a full refund. Late
              cancellations may incur a fee.
              {`\n\n`}
              Unsatisfactory Service: If the service fails to meet the agreed
              standards, you may request a partial or full refund within 7 days
              of service.
            </Text>
          </View>
          <View style={{ paddingBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#000000" }}>
              Non-Refundable Situations
            </Text>
            <Text style={styles.termText}>
              Change of Mind: Refunds are not issued for services delivered due
              to a change of mind.
              {`\n\n`}
              Special Offers: Services purchased at a discount or as part of a
              promotion are non-refundable.
              {`\n\n`}
              Additional Costs: Costs for materials, parts, or third-party
              services are non-refundable once incurred.
            </Text>
          </View>
          <View style={{ paddingBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#000000" }}>
              Refund Process
            </Text>
            <Text style={styles.termText}>
              Contact Us: To request a refund, contact our customer service at
              Contact@Arbeittech.com within 7 days of the service.
              {`\n\n`}
              Provide Details: Include your name, contact information, service
              details, and reason for the refund.
              {`\n\n`}
              Review and Response: Our team will review your request and respond
              within 5 business days.
              {`\n\n`}
              Refund Processing: Approved refunds will be processed to your
              original payment method within 10 business days.
            </Text>
          </View>
          <View style={{ paddingBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#000000" }}>
              Disputes
            </Text>
            <Text style={styles.termText}>
              We encourage open communication to resolve any disputes. If an
              amicable solution cannot be reached, the matter may be escalated
              to a senior representative.
            </Text>
          </View>
          <View style={{ paddingBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#000000" }}>
              Amendments
            </Text>
            <Text style={styles.termText}>
              Arbeittech reserves the right to update this policy. Any changes
              will be posted on our website.
            </Text>
          </View>
          <View style={{ paddingBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#000000" }}>
              Contact Information
            </Text>
            <Text style={styles.termText}>
              For inquiries, please contact us at Contact@Arbeittech.com
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
  termText: {
    fontSize: 14,
    lineHeight: 21,
    color: theme.color.textColor,
  },
});

export default CancellationPolicy;
