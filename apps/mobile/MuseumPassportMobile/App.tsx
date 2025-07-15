/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View, Text } from 'react-native';
// import { API_CONSTANTS, MUSEUM_STATUS, ERROR_MESSAGES } from '@museum-app/shared';
import { API_CONSTANTS, MUSEUM_STATUS, ERROR_MESSAGES } from '../../../packages/shared/dist';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  // Test shared package integration with console logs
  console.log('🔗 Testing shared package integration...');
  console.log('📊 API Constants:', API_CONSTANTS);
  console.log('🏛️ Museum Status:', MUSEUM_STATUS);
  console.log('❌ Error Messages:', ERROR_MESSAGES);
  console.log('✅ Shared package imported successfully!');

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NewAppScreen templateFileName="App.tsx" />
      
      {/* Simple test display */}
      <View style={styles.testContainer}>
        <Text style={styles.testText}>
          🎯 Shared Package Test
        </Text>
        <Text style={styles.testText}>
          Page Size: {API_CONSTANTS.PAGE_SIZE}
        </Text>
        <Text style={styles.testText}>
          Status: {MUSEUM_STATUS.VISITED}
        </Text>
        <Text style={styles.testText}>
          Check console for logs!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  testContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
    borderRadius: 10,
  },
  testText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 5,
  },
});

export default App;
