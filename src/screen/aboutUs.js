import React from "react";
import { StyleSheet, View, Text, ScrollView, Animated } from "react-native";
import { theme } from "../constants/styles";
import { useNavigation } from '@react-navigation/native';
import Header from "../component/Header/header";
import CustomStatusBar from "../component/StatusBar/customStatusBar";

const AboutUs = () => {
    const navigation = useNavigation();
    const fadeAnim = new Animated.Value(0); // Initial opacity value

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000, // Duration for the fade-in animation
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    return (
        <View style={styles.container}>
            <CustomStatusBar barStyle={"light-content"} backgroundColor={"#044F86"} />
            <Header backArrow={true} title={"About Us"} backPage={() => navigation.goBack()} />
            <ScrollView>
                <Animated.View style={[styles.innerContainer, { opacity: fadeAnim }]}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Arbeittech: Your Trusted Service Partner</Text>
                        <Text style={styles.sectionText}>
                            At Arbeittech, we're dedicated to simplifying your life by providing reliable, efficient, 
                            and professional services tailored to your needs. From handyman tasks to specialized maintenance, 
                            our team of skilled experts is here to help.
                        </Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Our Story</Text>
                        <Text style={styles.sectionText}>
                            Founded with a passion for quality and customer satisfaction, Arbeittech has become a leading 
                            provider of home and business services. We understand the challenges of finding reliable service 
                            providers and strive to offer a seamless experience.
                        </Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>What We Do</Text>
                        <Text style={styles.sectionText}>
                            Our comprehensive range of services includes:
                            {`\n\n`}
                            Handyman Services: Minor repairs, installations, and more.{`\n`}
                            Home and Office Renovations: Custom projects to transform your space.{`\n`}
                            Electrical and Plumbing: Expert solutions for your electrical and plumbing needs.{`\n`}
                            Cleaning and Maintenance: Regular and one-time cleaning services.{`\n`}
                            Specialized Services: Tailored solutions for your unique requirements.
                        </Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Why Choose Arbeittech?</Text>
                        <Text style={styles.sectionText}>
                            Quality: We deliver exceptional results, every time.{`\n`}
                            Reliability: Count on us for timely, dependable service.{`\n`}
                            Expertise: Our team is skilled and knowledgeable.{`\n`}
                            Convenience: Easy booking and flexible scheduling.{`\n`}
                            Customer Satisfaction: Your happiness is our priority.
                        </Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Our Values</Text>
                        <Text style={styles.sectionText}>
                            Integrity: We operate with honesty and transparency.{`\n`}
                            Excellence: We strive for the highest standards of service.{`\n`}
                            Customer Focus: Your needs come first.
                        </Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Join the Arbeittech Family</Text>
                        <Text style={styles.sectionText}>
                            Experience the difference. Contact us today to schedule a service or learn more about how we can help.
                        </Text>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    innerContainer: {
        padding: 20,
    },
    section: {
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#044F86",
        paddingBottom: 8,
    },
    sectionText: {
        fontSize: 15,
        lineHeight: 22,
        color: "#333",
    },
});

export default AboutUs;
