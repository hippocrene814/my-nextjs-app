/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, Text, Image, View } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { VisitedScreen } from './src/screens/VisitedScreen';
import { SearchScreen } from './src/screens/SearchScreen';
import { MuseumDetailScreen } from './src/screens/MuseumDetailScreen';
import { COLORS, STRINGS } from './src/constants/theme';
import { AuthProvider } from './src/AuthContext';
import { Provider as PaperProvider } from 'react-native-paper';
import HomeIcon from './src/assets/icons/home.png';
import VisitedIcon from './src/assets/icons/museum-visited.png';
import SearchIcon from './src/assets/icons/search.png';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.divider,
          height: 80,
          paddingBottom: 16,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: STRINGS.home,
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={HomeIcon} style={{ width: size, height: size, tintColor: color, marginBottom: 8 }} resizeMode="contain" />
              {/* Optionally, you can show the label here if you want icon+label always visible */}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Visited"
        component={VisitedScreen}
        options={{
          tabBarLabel: STRINGS.visited,
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={VisitedIcon} style={{ width: size, height: size, tintColor: color, marginBottom: 8 }} resizeMode="contain" />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: STRINGS.search,
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={SearchIcon} style={{ width: size, height: size, tintColor: color, marginBottom: 8 }} resizeMode="contain" />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="MuseumDetail" component={MuseumDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
}
