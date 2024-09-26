import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {useSelector} from 'react-redux';
import {Drawer} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {DrawerContentScrollView, DrawerItem} from "@react-navigation/drawer";

export function SideBar() {
    const navigation = useNavigation();
    const {lang} = useSelector(state => state.userReducer);
    return (
        <DrawerContentScrollView showsVerticalScrollIndicator={false}>
            <View style={{alignItems:"center"}}>
                {lang==="eng"?
                    <Image
                        style={styles.logoStyle}
                        source={theme.images.mainLogo}
                    />
                :
                    <Image
                        style={styles.logoStyle}
                        source={theme.images.urduLogo}
                    />
                }
            </View>
            <Drawer.Section style={styles.drawerMainStyle}>
                <DrawerItem
                    style={styles.drawerItem}
                    labelStyle={styles.labelStyle}
                    label={lang==="eng"?'Home':"صفحہ اول"}
                    onPress={() => navigation.navigate('Home')}
                    icon={() => (<Image source={theme.images.homeIcon} 
                    style={{height:20,width:20,resizeMode:"cover",tintColor:"#000"}} />)}
                />
                <DrawerItem
                    onPress={() => {
                        navigation.navigate('Category', {
                            category_id: 0,
                            route_name: "latest",
                            title: lang==="eng"?'Latest News':"تازہ ترین",
                        });
                    }}
                    style={styles.drawerItem}
                    labelStyle={styles.labelStyle}
                    label={lang==="eng"?'Latest News':"تازہ ترین"}
                    icon={() => (<Image source={theme.images.latestNewsIcon} 
                    style={{height:20,width:20,resizeMode:"cover",tintColor:"#000"}} />)}
                />
                <DrawerItem
                    style={styles.drawerItem}
                    labelStyle={styles.labelStyle}
                    onPress={() => navigation.navigate('Shows')}
                    label={lang==="eng"?'TV Shows':'شوز'}
                    icon={() => (<Image source={theme.images.tvShowsIcon} 
                    style={{height:20,width:20,resizeMode:"cover",tintColor:"#000"}} />)}
                />
                <DrawerItem
                    onPress={() => {
                        navigation.navigate('Category', {
                            category_id: 1,
                            route_name: "category",
                            title: lang==="eng"?'Pakistan':'پاکستان',
                        });
                    }}
                    style={styles.drawerItem}
                    labelStyle={styles.labelStyle}
                    label={lang==="eng"?'Pakistan':'پاکستان'}
                    icon={() => (<Image source={theme.images.pakMapIcon} 
                    style={{height:20,width:20,resizeMode:"cover",tintColor:"#000"}} />)}
                />
                <DrawerItem
                    onPress={() => {
                        navigation.navigate('Category', {
                            category_id: 2,
                            route_name: "category",
                            title: lang==="eng"?'World':'دنیا',
                        });
                    }}
                    style={styles.drawerItem}
                    labelStyle={styles.labelStyle}
                    label={lang==="eng"?'World':'دنیا'}
                    icon={() => (<Image source={theme.images.worldIcon} 
                    style={{height:20,width:20,resizeMode:"cover",tintColor:"#000"}} />)}
                />
                <DrawerItem
                    onPress={() => {
                        navigation.navigate('Category', {
                            category_id: 4,
                            route_name: "category",
                            title: lang==="eng"?'Sports':'کھیل',
                        });
                    }}
                    style={styles.drawerItem}
                    labelStyle={styles.labelStyle}
                    label={lang==="eng"?'Sports':'کھیل'}
                    icon={() => (<Image source={theme.images.sportsIcon} 
                    style={{height:20,width:20,resizeMode:"cover",tintColor:"#000"}} />)}
                />
                <DrawerItem
                    onPress={() => {
                        navigation.navigate('Category', {
                            category_id: 5,
                            route_name: "category",
                            title: lang==="eng"?'Entertainment':'انٹرٹینمنٹ',
                        });
                    }}
                    style={styles.drawerItem}
                    labelStyle={styles.labelStyle}
                    label={lang==="eng"?'Entertainment':'انٹرٹینمنٹ'}
                    icon={() => (<Image source={theme.images.entertainmentIcon} 
                    style={{height:20,width:20,resizeMode:"cover",tintColor:"#000"}} />)}
                />
                <DrawerItem
                    onPress={() => {
                        navigation.navigate('Category', {
                            category_id: 3,
                            route_name: "category",
                            title: lang==="eng"?'Business':'کاروبار',
                        });
                    }}
                    style={styles.drawerItem}
                    labelStyle={styles.labelStyle}
                    label={lang==="eng"?'Business':'کاروبار'}
                    icon={() => (<Image source={theme.images.businessIcon} 
                    style={{height:20,width:20,resizeMode:"cover",tintColor:"#000"}} />)}
                />
                <DrawerItem
                    onPress={() => {
                        navigation.navigate('Category', {
                            category_id: 6,
                            route_name: "category",
                            title: lang==="eng"?'Health':'صحت',
                        });
                    }}
                    style={styles.drawerItem}
                    labelStyle={styles.labelStyle}
                    label={lang==="eng"?'Health':'صحت'}
                    icon={() => (<Image source={theme.images.healthIcon} 
                    style={{height:20,width:20,resizeMode:"cover",tintColor:"#000"}} />)}
                />
                <DrawerItem
                    onPress={() => {
                        navigation.navigate('Category', {
                            category_id: 7,
                            route_name: "category",
                            title: lang==="eng"?'Amazing':'دلچسپ و عجیب',
                        });
                    }}
                    style={styles.drawerItem}
                    labelStyle={styles.labelStyle}
                    label={lang==="eng"?'Amazing':'دلچسپ و عجیب'}
                    icon={() => (<Image source={theme.images.amazingIcon} 
                    style={{height:20,width:20,resizeMode:"cover",tintColor:"#000"}} />)}
                />
                <DrawerItem
                    style={styles.drawerItem}
                    label={lang==="eng"?'Saved Articles':'محفوظ شدہ'}
                    onPress={() => navigation.navigate('SavedStories')}
                    labelStyle={[styles.labelStyle,{color:theme.color.primaryColor}]}
                    icon={() => (<Image source={theme.images.bookmarkIcon} 
                    style={{height:20,width:20,resizeMode:"cover",tintColor:theme.color.primaryColor}} />)}
                />
            </Drawer.Section>
        </DrawerContentScrollView>
    )
}

const styles = StyleSheet.create({
    drawerMainStyle: {
        marginTop: "10%",
    },
    drawerItem: {
        marginVertical: 4,
        marginHorizontal: 12,
    },
    labelStyle: {
        fontSize: 14,
        color: "#4D4D4D",
        fontWeight: 'bold',
        textAlign: "left",
    },
    logoStyle: {
        width: 180,
        height: 30,
        resizeMode: "contain",
    },
})
