import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, Image } from 'react-native';
import Header from '../component/Header/header';
import CustomStatusBar from '../component/StatusBar/customStatusBar';
import { useNavigation } from '@react-navigation/native';

export default function Languages() {
  const [isEnglish, setIsEnglish] = useState(true);
    const navigation = useNavigation()
  const toggleLanguage = () => {
    setIsEnglish(previousState => !previousState);
  };

  return (
    <>
      <CustomStatusBar
                barStyle={"light-content"}
                backgroundColor={"#044F86"}
            />
            <Header
  backArrow
  backPage={() => navigation.goBack()}  
  title="Languages"
/>
      <View style={styles.container}>
        <Image
          source={require("../assets/images/foreign-language_8495095.png")} // Replace with a relevant image URL
          style={styles.languageIcon}
        />
        <Text style={styles.title}>Now We Have only 1 Langauges</Text>
        <View style={styles.languageContainer}>
          <Text style={styles.languageText}>{isEnglish ? 'English' : 'Other Language'}</Text>
          <Switch
            trackColor={{ false: "#d3d3d3", true: "#4caf50" }}
            thumbColor={isEnglish ? "#fff" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleLanguage}
            value={isEnglish}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  languageIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4a4a4a',
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  languageText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#4a4a4a',
  },
});
