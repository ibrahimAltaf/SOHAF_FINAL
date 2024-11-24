import React, { createContext, useState, useEffect, useContext } from "react";
import { DefaultTheme, DarkTheme } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create Context
export const ThemeContext = createContext();

// Theme Provider
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme from AsyncStorage when the app starts
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("themeMode");
        if (savedTheme !== null) {
          setIsDarkMode(savedTheme === "dark");
        }
      } catch (error) {
        console.error("Error loading theme from AsyncStorage:", error);
      }
    };

    loadTheme();
  }, []);

  // Toggle theme and save to AsyncStorage
  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode ? "dark" : "light";
      setIsDarkMode(!isDarkMode);
      await AsyncStorage.setItem("themeMode", newTheme); // Save the new theme mode
    } catch (error) {
      console.error("Error saving theme to AsyncStorage:", error);
    }
  };

  const theme = isDarkMode ? DarkTheme : DefaultTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useThemeContext = () => useContext(ThemeContext);
