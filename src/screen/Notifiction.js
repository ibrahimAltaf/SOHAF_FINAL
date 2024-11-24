import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, Image, Pressable } from 'react-native';
import Header from '../component/Header/header';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { theme } from '../constants/styles';
import CustomButton from '../component/Buttons/customButton';

const Notification = () => {
    const navigation = useNavigation();
    const { access_token } = useSelector(state => state.userReducer); // Get the access_token from Redux

    const [notifications, setNotifications] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [loader, setLoader] = useState(false); // For loader state

    // Function to fetch notifications from API
    const fetchNotifications = async () => {
        if (!access_token) return; // If not logged in, skip fetching
        try {
            const response = await fetch('https://My Denzen.com/api/user/notifications/user', {
                method: 'GET',
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "Authorization": `Bearer ${access_token}`
                }
            });
            const data = await response.json();
            setNotifications(data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [access_token]);

    const renderNotification = ({ item }) => (
        <TouchableOpacity
            style={styles.notificationItem}
            onPress={() => {
                setSelectedNotification(item);
                setModalVisible(true);
            }}
        >
            {item.image ? (
                <Image style={styles.thumbnailImage} source={{ uri: item.image }} />
            ) : (
                <View style={styles.noImagePlaceholder}>
                    <Text style={styles.noImageText}>لا توجد صورة</Text>
                </View>
            )}
            <View style={styles.textContainer}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationDescription}>{item.description}</Text>
                <Text style={styles.expiryText}>تاريخ الانتهاء: {item.expiry_date}</Text>
            </View>
        </TouchableOpacity>
    );

    const loginHandle = () => {
        setLoader(true);
        // Implement your login logic here
        setTimeout(() => {
            setLoader(false);
            navigation.navigate('Login');
        }, 1500); // Simulating a delay
    };

    return (
        <>
            <View>
                <Header
                    title={"الإشعارات"}
                    backArrow
                    backPage={() => navigation.goBack()}
                />
            </View>
            <View style={styles.container}>
                {!access_token ? (
                    <View style={styles.messageContainer}>
                        <Text style={styles.loginMessage}>يرجى تسجيل الدخول لعرض الإشعارات</Text>
                        <CustomButton
                            loading={loader}
                            title={"تسجيل الدخول"}
                            activeOpacity={0.7}
                            onPress={loginHandle}
                            customButtonStyle={styles.customButton}
                        />
                    </View>
                ) : (
                    notifications.length > 0 ? (
                        <FlatList
                            data={notifications}
                            renderItem={renderNotification}
                            keyExtractor={(item) => item.id.toString()}
                            contentContainerStyle={styles.listContainer}
                        />
                    ) : (
                        <View style={styles.messageContainer}>
                            <Text style={styles.noNotificationsMessage}>لا توجد إشعارات حالياً</Text>
                        </View>
                    )
                )}
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {selectedNotification && (
                            <>
                                <Text style={styles.modalTitle}>{selectedNotification.title}</Text>
                                {selectedNotification.image ? (
                                    <Image
                                        style={styles.notificationImage}
                                        source={{ uri: selectedNotification.image }}
                                    />
                                ) : (
                                    <Text style={styles.modalDescription}>{selectedNotification.description}</Text>
                                )}
                                <Text style={styles.modalDescription}>{selectedNotification.description}</Text>
                                <Text style={styles.expiryText}>تاريخ الانتهاء: {selectedNotification.expiry_date}</Text>
                                <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.closeButtonText}>إغلاق</Text>
                                </Pressable>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.color.white,
    },
    listContainer: {
        padding: 20,
    },
    notificationItem: {
        backgroundColor: '#FFF',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center',
    },
    notificationTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    notificationDescription: {
        fontSize: 14,
        color: '#666',
        marginVertical: 5,
    },
    expiryText: {
        color: '#FF0000',
        fontSize: 12,
        alignSelf: 'flex-end',
        marginTop: 10,
    },
    messageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginMessage: {
        fontSize: 18,
        color: '#333',
        marginBottom: 20,
    },
    noNotificationsMessage: {
        fontSize: 18,
        color: '#333',
    },
    customButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
        width:"90%"
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        textAlign: 'center',
    },
    modalDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    notificationImage: {
        width: '100%',
        height: 200,
        marginBottom: 20,
        borderRadius: 10,
    },
    closeButton: {
        width: '100%',
        padding: 10,
        backgroundColor: '#FF6B6B',
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    closeButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    thumbnailImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    noImagePlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noImageText: {
        color: '#888',
        fontSize: 10,
    },
});

export default Notification;
