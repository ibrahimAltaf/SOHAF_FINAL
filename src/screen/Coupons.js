import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Header from '../component/Header/header';
import { useNavigation } from '@react-navigation/native';

export default function Coupons() {
    const navigation = useNavigation()
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get('https://arbeittech.com/api/user/get_coupon');
        setCoupons(response.data.coupons);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      } finally {
        setLoading(false); // Set loading to false when data is fetched
      }
    };

    fetchCoupons();
  }, []);

  const renderCoupon = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.promoCode}>{item.promo_code}</Text>
        <Text style={styles.percentage}>{item.percentage}% OFF</Text>
      </View>
      <Text style={styles.description}>{item.promo_description}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.expiration}>Expires: {new Date(item.expiration).toDateString()}</Text>
        <Text style={styles.maxDiscount}>Max Discount: ${item.max_discount_value || 'N/A'}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ff6347" />
      </View>
    );
  }

  return (
 <>
 <View style={{
    marginTop:34,
 }}></View>
      <Header

      
  backArrow
  backPage={() => navigation.goBack()}  
  title="Coupons"
/>
    <View style={styles.container}>
     
     <FlatList
       data={coupons}
       renderItem={renderCoupon}
       keyExtractor={item => item.id.toString()}
       contentContainerStyle={styles.list}
     />
   </View>
 </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  promoCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6347',
  },
  percentage: {
    fontSize: 16,
    color: '#4caf50',
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expiration: {
    fontSize: 14,
    color: '#888',
  },
  maxDiscount: {
    fontSize: 14,
    color: '#888',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
});
