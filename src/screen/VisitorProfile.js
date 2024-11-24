import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { theme } from "../constants/styles";
import Header from "../component/Header/header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SetUserDetail, SetUserToken } from "../Redux/actions/actions";
import CustomButton from "../component/Buttons/customButton";
import RBSheet from "react-native-raw-bottom-sheet";
import axios from "axios";

export default function VisitorProfile({ navigation }) {
  const dispatch = useDispatch();
  const { user_detail, access_token } = useSelector((state) => state.userReducer);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const bottomSheetRef = useRef(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);

  const backgroundColor = isDarkMode ? "#000" : theme.color.lightBackground;
  const textColor = isDarkMode ? "#fff" : theme.color.black;
  const lineColor = isDarkMode ? "#444" : "#ddd";

  useEffect(() => {
    if (access_token) {
      fetchProfileData();
    } else {
      bottomSheetRef.current?.open();
    }
  }, [access_token]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://dodgerblue-chinchilla-339711.hostingersite.com/api/profile/${user_detail.id}/user`
      );
      setProfileData(response.data.profile);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      ToastAndroid.show("فشل في تحميل الملف الشخصي. حاول مرة أخرى.", ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const logoutHandle = async () => {
    try {
      await AsyncStorage.removeItem("access_token");
      await AsyncStorage.removeItem("user_detail");
      dispatch(SetUserDetail({}));
      dispatch(SetUserToken(null));
      ToastAndroid.show("تم تسجيل الخروج بنجاح!", ToastAndroid.SHORT);
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Error during logout:", error);
      ToastAndroid.show("فشل تسجيل الخروج. حاول مرة أخرى.", ToastAndroid.SHORT);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor }]}>
        <ActivityIndicator size="large" color={theme.color.primaryColor} />
      </View>
    );
  }

  return (
    <>
      <Header title="الملف الشخصي" backArrow backPage={() => navigation.goBack()} />
      <View style={[styles.container, { backgroundColor }]}>
        {access_token ? (
          <>
            <View style={styles.profileHeader}>
              <Image
                source={
                  profileData?.avatar
                    ? { uri: profileData.avatar }
                    : {
                        uri: "https://pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png",
                      }
                }
                style={styles.profileImage}
              />
              <Text style={[styles.name, { color: textColor }]}>
                {profileData?.name || "غير متوفر"}
              </Text>
              <Text style={[styles.role, { color: textColor }]}>
                {profileData?.type === "admin" ? "مسؤول" : "زائر"}
              </Text>
            </View>

            <View style={[styles.infoContainer, { backgroundColor: isDarkMode ? "#111" : "#f5f5f5" }]}>
              {[
                { label: "البريد الإلكتروني", value: profileData?.email || "غير متوفر" },
                { label: "رقم الهاتف", value: profileData?.phone || "غير متوفر" },
                { label: "الدور", value: profileData?.type === "user" ? "زائر" : profileData?.type || "غير متوفر" },
                { label: "تاريخ الإنشاء", value: new Date(profileData?.created_at).toLocaleDateString() || "غير متوفر" },
              ].map((item, index) => (
                <View key={index} style={[styles.infoRow, { borderBottomColor: lineColor }]}>
                  <Text style={[styles.label, { color: textColor }]}>{item.label}</Text>
                  <Text style={[styles.value, { color: textColor }]}>{item.value}</Text>
                </View>
              ))}
            </View>

            <CustomButton
              title="تسجيل الخروج"
              onPress={logoutHandle}
              customButtonStyle={[styles.logoutButton, { backgroundColor: isDarkMode ? "#FFD700" : theme.color.primaryColor }]}
              customTextStyle={{ color: isDarkMode ? "#000" : "#fff" }}
            />
          </>
        ) : null}

        <RBSheet
          ref={bottomSheetRef}
          height={250}
          closeOnDragDown={true}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingHorizontal: 20,
              backgroundColor: isDarkMode ? "#333" : "#fff",
            },
          }}
        >
          <View style={styles.modalContent}>
            <Text style={[styles.modalText, { color: isDarkMode ? "#fff" : "#333" }]}>
              يرجى تسجيل الدخول لرؤية الملف الشخصي الخاص بك.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                style={[styles.modalButton, styles.loginButton]}
              >
                <Text style={styles.modalButtonText}>تسجيل الدخول</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => bottomSheetRef.current?.close()}
                style={[styles.modalButton, styles.skipButton]}
              >
                <Text style={[styles.modalButtonText, { color: isDarkMode ? "#fff" : "#333" }]}>تخطي</Text>
              </TouchableOpacity>
            </View>
          </View>
        </RBSheet>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
  },
  role: {
    fontSize: 16,
    marginTop: 5,
  },
  infoContainer: {
    borderRadius: 10,
    padding: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
  },
  value: {
    fontSize: 14,
  },
  logoutButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: theme.color.primaryColor,
  },
  skipButton: {
    backgroundColor: "#e0e0e0",
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
