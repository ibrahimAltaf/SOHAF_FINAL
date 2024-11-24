import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { theme } from '../constants/styles';
import Header from '../component/Header/header';
import AdminBottom from './AdminBottom';
import { useThemeContext } from '../../ThemeContext';

const AuthorsScreen = ({ navigation }) => {
    const [pendingAuthors, setPendingAuthors] = useState([]);
    const [approvedAuthors, setApprovedAuthors] = useState([]);
    const [loadingPending, setLoadingPending] = useState(true);
    const [loadingApproved, setLoadingApproved] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');
    const { isDarkMode, toggleTheme } = useThemeContext(); // Dark mode from context

    const backgroundColor = isDarkMode ? '#1E1E1E' : '#FFFFFF';
    const textColor = isDarkMode ? '#FFFFFF' : theme.color.black;

    const fetchPendingAuthors = async () => {
        try {
            const response = await axios.get('https://dodgerblue-chinchilla-339711.hostingersite.com/api/admin/authors/pending');
            setPendingAuthors(response.data);
        } catch (error) {
            console.error("خطأ في جلب المؤلفين المعلقين", error);
        } finally {
            setLoadingPending(false);
        }
    };

    const fetchApprovedAuthors = async () => {
        try {
            const response = await axios.get('https://dodgerblue-chinchilla-339711.hostingersite.com/api/admin/authors/approved');
            setApprovedAuthors(response.data);
        } catch (error) {
            console.error("خطأ في جلب المؤلفين المعتمدين", error);
        } finally {
            setLoadingApproved(false);
        }
    };

    // Fetch data after a 2-second delay
    useEffect(() => {
        const delayFetch = async () => {
            setTimeout(() => {
                fetchPendingAuthors();
                fetchApprovedAuthors();
            }, 2000);
        };

        delayFetch();
    }, []);

    const handleApprovalPress = (user) => {
        navigation.navigate("ApprovelView", {
            userId: user.id,
        });
    };

    const renderAuthorItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleApprovalPress(item)}>
            <View style={[styles.authorCard, { backgroundColor }]}>
                <View style={styles.authorInfoContainer}>
                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                    <Text style={[styles.authorName, { color: textColor }]}>{item.name}</Text>
                </View>
                <TouchableOpacity style={styles.approveButton} onPress={() => handleApprovalPress(item)}>
                    <Image style={styles.approveIcon} source={require("../assets/images/rigthhh.png")} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const renderLoadingScreen = () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.color.primaryColor} />
            <Text style={[styles.loadingText, { color: textColor }]}>جارٍ تحميل المؤلفين...</Text>
        </View>
    );

    const renderNoAuthorsFound = () => (
        <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: textColor }]}>لم يتم العثور على مؤلفين</Text>
        </View>
    );

    return (
        <>
            <Header title="الموافقات" backArrow backPage={() => navigation.goBack()} />
<View style={[styles.tabContainer, {}]}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
                    onPress={() => setActiveTab('pending')}
                >
                    <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>معلق</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'approved' && styles.activeTab]}
                    onPress={() => setActiveTab('approved')}
                >
                    <Text style={[styles.tabText, activeTab === 'approved' && styles.activeTabText]}>معتمد</Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.container, { backgroundColor }]}>
                <View style={styles.contentContainer}>
                    {activeTab === 'pending' ? (
                        loadingPending ? renderLoadingScreen() : (
                            pendingAuthors.length > 0 ? (
                                <FlatList
                                    data={pendingAuthors}
                                    renderItem={renderAuthorItem}
                                    keyExtractor={item => item.id.toString()}
                                />
                            ) : renderNoAuthorsFound()
                        )
                    ) : (
                        loadingApproved ? renderLoadingScreen() : (
                            approvedAuthors.length > 0 ? (
                                <FlatList
                                    data={approvedAuthors}
                                    renderItem={renderAuthorItem}
                                    keyExtractor={item => item.id.toString()}
                                    showsVerticalScrollIndicator={false}
                                />
                            ) : renderNoAuthorsFound()
                        )
                    )}
                </View>
            </View>
            <AdminBottom />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: theme.color.white,
    },
    tabContainer: {
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: theme.color.white,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        
    },
    activeTab: {
        borderBottomWidth: 5,
        borderBottomColor: theme.color.primaryColor,
    },
    tabText: {
        fontSize: 15,
        color: theme.color.black,
        fontWeight: '400',
    },
    activeTabText: {
        fontWeight: '600',
    },
    contentContainer: {
        flex: 1,
    },
    authorCard: {
        flexDirection: 'row',
        padding: 12,
        marginBottom: 10,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "space-between",
        height: 80,
        backgroundColor: '#fff', // Make sure there is a solid background
        shadowColor: 'rgba(0, 0, 0, 0.3)', // Darker and more prominent shadow
        shadowOffset: { width: 0, height: 6 }, // Increase height of the shadow for more depth
        shadowOpacity: 0.8, // Stronger shadow opacity
        shadowRadius: 12, // Larger blur radius for a more diffused shadow
        elevation: 10, // Higher elevation for Android, stronger shadow
    },
    
    
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 30,
        marginRight: 15,
    },
    authorInfoContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    authorName: {
        fontSize: 12,
        fontWeight: '500',
    },
    approveButton: {
        padding: 8,
        borderRadius: 100,
        backgroundColor: theme.color.primaryColor,
        justifyContent: "center",
        alignItems: 'center',
    },
    approveIcon: {
        width: 20,
        height: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
});

export default AuthorsScreen;
