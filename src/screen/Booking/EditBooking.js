import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  TouchableOpacity,
  FlatList
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

import {Colors, Fonts} from '../../utils/IMAGES';
import {useNavigation} from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';

import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
export default function EditBooking() {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const refRBSheet = useRef();
  const [selectedOption, setSelectedOption] = useState(null);
  const [selecteServiceman, setSelectStatus] = useState(null);
  const [SelectStatus, setselecteServiceman] = useState('Booking');
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const handleCategorySelection = categoryName => {
    setSelectedCategory(categoryName);
  };

  const ServicemanName = [
    {label: 'Ibrahim', value: 'Ibrahim'},
    {label: 'Haris', value: 'Haris'},
    {label: 'Bilal', value: 'Bilal'},
    {label: 'Abbas', value: 'Abbas'},
  ];
  const ServiceStatus = [
    {label: 'Booking', value: 'Ongoing'},
    {label: 'Booking', value: 'Ongoing'},
    {label: 'Booking', value: 'Ongoing'},
    {label: 'Booking', value: 'Ongoing'},
  ];

  const openOptions = () => {
    setOptionsModalVisible(true);
  };

  const closeOptions = () => {
    setOptionsModalVisible(false);
  };

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const data = [
    { id: '1', serviceName: 'Cleaning', subServiceName: 'Roof Cleaning', price: '$20.00/Fixed', image: require('../../assets/images/serviceman.webp') },
    { id: '2', serviceName: 'Cleaning', subServiceName: 'Roof Cleaning', price: '$20.00/Fixed', image: require('../../assets/images/serviceman.webp') },
    { id: '3', serviceName: 'Cleaning', subServiceName: 'Roof Cleaning', price: '$20.00/Fixed', image: require('../../assets/images/serviceman.webp') },
    { id: '4', serviceName: 'Cleaning', subServiceName: 'Roof Cleaning', price: '$20.00/Fixed', image: require('../../assets/images/serviceman.webp') },
    { id: '5', serviceName: 'Cleaning', subServiceName: 'Roof Cleaning', price: '$20.00/Fixed', image: require('../../assets/images/serviceman.webp') },
    { id: '6', serviceName: 'Cleaning', subServiceName: 'Roof Cleaning', price: '$20.00/Fixed', image: require('../../assets/images/serviceman.webp') },
  
  ];

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <Image style={styles.itemImage} source={item.image} />
        <View>
          <Text style={styles.serviceName}>{item.serviceName}</Text>
          <Text style={styles.subServiceName}>{item.subServiceName}</Text>
          <Text style={styles.price}>{item.price}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  const CategoryButton = ({ selected, onPress, imageSource, categoryName, price }) => (
    <TouchableOpacity
      style={{
        width: 100,
        height: 100,
        backgroundColor: selected ? Colors.Primary : '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      }}
      onPress={onPress}>
      <Image
        style={{
          width: 30,
          height: 30,
        }}
        source={imageSource}
      />
      <Text
        style={{
          fontFamily: Fonts.Bold,
          color: selected ? Colors.White : 'gray',
        }}>
        {categoryName}
      </Text>
      <Text
        style={{
          fontFamily: Fonts.Bold,
          color: Colors.Primary,
          fontSize: 11,
        }}>
        {price}
      </Text>
      <TouchableOpacity
        style={{
          width: '50%',
          height: 20,
          alignSelf: 'center',
          backgroundColor: Colors.Primary,
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 9,
          paddingHorizontal: 10,
          borderRadius: 20,
        }}>
        <Text
          style={{
            color: '#fff',
            fontFamily: Fonts.Bold,
          }}>
          Add
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
  




  return (
    <>

      <ScrollView>
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Category</Text>
          <RNPickerSelect
            onValueChange={value => setSelectedOption(value)}
            items={ServicemanName}
            style={pickerSelectStyles}
            value={selecteServiceman}
            placeholder={{label: 'Select ', value: null}}
          />
          <RNPickerSelect
            onValueChange={value => setSelectedOption(value)}
            items={SelectStatus}
            style={pickerSelectStyles}
            value={ServiceStatus}
            placeholder={{label: 'Booking Status', value: null}}
          />
        </View>
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Service Schedule</Text>

          <View
            style={{
              flexDirection: 'row',
            }}>
            <TextInput
              style={{
                width: '90%',
                backgroundColor: '#fff',
                paddingHorizontal: 10,
                color: 'gray',
                fontFamily: Fonts.Bold,
              }}
              value={date.toDateString()}
              placeholder="Select Date"
              editable={false}
              onTouchStart={() => setShowPicker(true)} // Open picker when TextInput is touched
            />
            <TouchableOpacity onPress={() => setShowPicker(true)}>
              <View style={styles.iconContainer}>
                <Text>📅</Text>
              </View>
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}>
          <View>
            <Text
              style={{
                color: '#000',
                fontFamily: Fonts.Bold,
              }}>
              Service List{' '}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              style={{
                width: 100,
                height: 35,
                backgroundColor: Colors.Primary,
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 5,
                borderRadius: 12,
              }}
              onPress={openOptions}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 12,
                }}>
                + Add Service
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal
      animationType="slide"
      transparent={true}
      visible={optionsModalVisible}
      onRequestClose={closeOptions}>
      <View style={styles.modalContainer}>
        <View style={styles.optionsContainer}>
          <View
            style={{
              width: '100%',
              height: '100%',
              padding: 10,
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 10,
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CategoryButton
              selected={selectedCategory === 'Emergency'}
              onPress={() => handleCategorySelection('Emergency')}
              imageSource={require('../../assets/images/emergency.png')}
              categoryName="Emergency"
              price="$10.00/HR"
            />
            <CategoryButton
              selected={selectedCategory === 'Car Services'}
              onPress={() => handleCategorySelection('Car Services')}
              imageSource={require('../../assets/images/car-service.png')}
              categoryName="Car Services"
              price="$10.00/Fixed"
            />
            <CategoryButton
              selected={selectedCategory === 'Beauty Salon'}
              onPress={() => handleCategorySelection('Beauty Salon')}
              imageSource={require('../../assets/images/beauty-saloon.png')}
              categoryName="Beauty Salon"
              price="$10.00/HR"
            />
            <CategoryButton
              selected={selectedCategory === 'Appliance Repair'}
              onPress={() => handleCategorySelection('Appliance Repair')}
              imageSource={require('../../assets/images/applianceRepair.png')}
              categoryName="Appliance Repair"
              price="$10.00/Fixed"
            />
            <CategoryButton
              selected={selectedCategory === 'Ac Repair'}
              onPress={() => handleCategorySelection('Ac Repair')}
              imageSource={require('../../assets/images/acRepair.png')}
              categoryName="Ac Repair"
              price="$10.00/HR"
            />
            <CategoryButton
              selected={selectedCategory === 'Plumbing'}
              onPress={() => handleCategorySelection('Plumbing')}
              imageSource={require('../../assets/images/plumbing_4310769.png')}
              categoryName="Plumbing"
              price="$10.00/Fixed"
            />
            <CategoryButton
              selected={selectedCategory === 'Shifting'}
              onPress={() => handleCategorySelection('Shifting')}
              imageSource={require('../../assets/images/real-estate_1290701.png')}
              categoryName="Shifting"
              price="$10.00/HR"
            />
            {/* Add other categories in a similar way */}
          </View>
        </View>
      </View>
    </Modal>
       
        <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    width: '95%',
    height: 'auto',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 10,
    paddingHorizontal: 15,
    color: 'gray',
    fontFamily: Fonts.Bold,
  },
  pickerContainer: {
    marginBottom: 20,
    marginTop: 15,
    marginHorizontal: 20,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Fonts.Bold,
    color: '#000',
    paddingHorizontal: 8,
    paddingBottom: 10,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  optionsContainer: {
    alignSelf: 'center',
    width: '100%', // Adjust width according to your preference
    maxHeight: '50%', // Adjust max height according to your preference
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    overflow: 'hidden', // Add overflow to prevent content overflow
  },
  optionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  optionButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  iconContainer: {
    backgroundColor: Colors.Primary,
    borderRadius: 5,
    padding: 10,
    height: 47,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginVertical: 10,
    elevation: 10,
    borderRadius: 10,
    marginHorizontal:20
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  itemImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    marginRight: 10,
  },
  serviceName: {
    color: '#000',
    fontFamily: Fonts.Bold,
    fontSize: 16,
  },
  subServiceName: {
    color: 'gray',
    fontFamily: Fonts.Bold,
  },
  price: {
    color: 'gray',
    fontFamily: Fonts.Bold,
  },
  removeButton: {
    width: 70,
    height: 25,
    backgroundColor: Colors.Primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginRight: 10,
    borderRadius: 15,
    elevation: 10,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 11,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    borderStyle: 'solid',
    color: '#000',
    paddingRight: 30,
    backgroundColor: '#fff',
    marginVertical: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  flatListContainer: {
    paddingVertical: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginVertical: 10,
    elevation: 10,
    borderRadius: 10,
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  itemImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    marginRight: 10,
  },
  serviceName: {
    color: '#000',
    fontFamily: Fonts.Bold,
    fontSize: 16,
  },
  subServiceName: {
    color: 'gray',
    fontFamily: Fonts.Bold,
  },
  price: {
    color: 'gray',
    fontFamily: Fonts.Bold,
  },
  removeButton: {
    width: 70,
    height: 25,
    backgroundColor: Colors.Primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginRight: 10,
    borderRadius: 15,
    elevation: 10,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 11,
  },
});
