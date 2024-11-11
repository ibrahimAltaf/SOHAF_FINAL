import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { theme } from '../constants/styles';
import Header from '../component/Header/header';
import AdminBottom from './AdminBottom';

const AuthorsScreen = ({ navigation }) => {
    const [pendingAuthors, setPendingAuthors] = useState([]);
    const [approvedAuthors, setApprovedAuthors] = useState([]);
    const [loadingPending, setLoadingPending] = useState(true);
    const [loadingApproved, setLoadingApproved] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');

    const fetchPendingAuthors = async () => {
        try {
            const response = await axios.get('https://dodgerblue-chinchilla-339711.hostingersite.com/api/admin/authors/pending');
            setPendingAuthors(response.data);
        } catch (error) {
            console.error("Error fetching pending authors", error);
        } finally {
            setLoadingPending(false);
        }
    };

    const fetchApprovedAuthors = async () => {
        try {
            const response = await axios.get('https://dodgerblue-chinchilla-339711.hostingersite.com/api/admin/authors/approved');
            setApprovedAuthors(response.data);
        } catch (error) {
            console.error("Error fetching approved authors", error);
        } finally {
            setLoadingApproved(false);
        }
    };

    useEffect(() => {
        fetchPendingAuthors();
        fetchApprovedAuthors();
    }, []);

    const handleApprovalPress = (user) => {
        navigation.navigate("ApprovelView", {
            userId: user.id,
        });
    };

    const renderAuthorItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleApprovalPress(item)}>
            <View style={styles.authorCard}>
                <View style={styles.authorInfoContainer}>
                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                    <Text style={styles.authorName}>{item.name}</Text>
                </View>
                <TouchableOpacity style={styles.approveButton} onPress={() => handleApprovalPress(item)}>
                    <Image style={styles.approveIcon} source={require("../assets/images/rigthhh.png")} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const renderLoadingScreen = () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.color.black} />
            <Text style={styles.loadingText}>Loading authors...</Text>
        </View>
    );

    const renderNoAuthorsFound = () => (
        <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>No authors found</Text>
        </View>
    );

    return (
        <>
            <Header title="Approvals" backArrow backPage={() => navigation.goBack()} />
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
                    onPress={() => setActiveTab('pending')}
                >
                    <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>Pending</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'approved' && styles.activeTab]}
                    onPress={() => setActiveTab('approved')}
                >
                    <Text style={[styles.tabText, activeTab === 'approved' && styles.activeTabText]}>Approved</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
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
        borderBottomWidth: 2,
        borderBottomColor: theme.color.black,
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
        backgroundColor: '#fff',
        elevation: 3,
        alignItems: "center",
        justifyContent: "space-between",
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    authorInfoContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    authorName: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.color.textColor,
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
        color: theme.color.black,
    },
});

export default AuthorsScreen;
