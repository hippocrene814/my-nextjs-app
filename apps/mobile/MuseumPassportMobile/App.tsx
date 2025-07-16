/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, Text } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { VisitedScreen } from './src/screens/VisitedScreen';
import { SearchScreen } from './src/screens/SearchScreen';
import { COLORS, STRINGS } from './src/constants/theme';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
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
            tabBarIcon: ({ color, size }) => (
              <Text style={{ color, fontSize: size }}>🏠</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Visited"
          component={VisitedScreen}
          options={{
            tabBarLabel: STRINGS.visited,
            tabBarIcon: ({ color, size }) => (
              <Text style={{ color, fontSize: size }}>✅</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarLabel: STRINGS.search,
            tabBarIcon: ({ color, size }) => (
              <Text style={{ color, fontSize: size }}>🔍</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
