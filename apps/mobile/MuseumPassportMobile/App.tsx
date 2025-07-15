/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, View, Text, StyleSheet, Button, ScrollView } from 'react-native';

// Placeholder screens with navigation buttons
function HomeScreen({ navigation }: any) {
  return (
    <PlaceholderScreen title="Home / Explore">
      <NavButtons navigation={navigation} exclude="Home" />
    </PlaceholderScreen>
  );
}
function SearchScreen({ navigation }: any) {
  return (
    <PlaceholderScreen title="Search">
      <NavButtons navigation={navigation} exclude="Search" />
    </PlaceholderScreen>
  );
}
function DetailsScreen({ navigation }: any) {
  return (
    <PlaceholderScreen title="Museum Details">
      <NavButtons navigation={navigation} exclude="Details" />
    </PlaceholderScreen>
  );
}
function VisitedScreen({ navigation }: any) {
  return (
    <PlaceholderScreen title="Visited">
      <NavButtons navigation={navigation} exclude="Visited" />
    </PlaceholderScreen>
  );
}
function WishListScreen({ navigation }: any) {
  return (
    <PlaceholderScreen title="Wish List">
      <NavButtons navigation={navigation} exclude="WishList" />
    </PlaceholderScreen>
  );
}

function PlaceholderScreen({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <ScreenContainer>
        <ScreenTitle>{title}</ScreenTitle>
        {children}
      </ScreenContainer>
    </>
  );
}

function NavButtons({ navigation, exclude }: { navigation: any; exclude: string }) {
  // List of all screens
  const screens = [
    { name: 'Home', label: 'Go to Home' },
    { name: 'Search', label: 'Go to Search' },
    { name: 'Details', label: 'Go to Museum Details' },
    { name: 'Visited', label: 'Go to Visited' },
    { name: 'WishList', label: 'Go to Wish List' },
  ];
  return (
    <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center' }}>
      {screens.filter(s => s.name !== exclude).map(s => (
        <View key={s.name} style={{ marginVertical: 6, width: '80%' }}>
          <Button title={s.label} onPress={() => navigation.navigate(s.name)} />
        </View>
      ))}
    </ScrollView>
  );
}

function ScreenContainer({ children }: { children: React.ReactNode }) {
  return <View style={styles.container}>{children}</View>;
}
function ScreenTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Visited" component={VisitedScreen} />
        <Stack.Screen name="WishList" component={WishListScreen} options={{ title: 'Wish List' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
});
