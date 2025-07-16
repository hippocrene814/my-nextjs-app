import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { TopBar } from '../components/TopBar';
import { COLORS, DIMENSIONS, TYPOGRAPHY, STRINGS } from '../constants/theme';

export const VisitedScreen: React.FC = () => {
  const handleLoginPress = () => {
    console.log('Login pressed');
  };

  const handleAvatarPress = () => {
    console.log('Avatar pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar
        onLoginPress={handleLoginPress}
        onAvatarPress={handleAvatarPress}
        isLoggedIn={false}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{STRINGS.visited}</Text>
        <Text style={styles.subtitle}>Visited museums will go here</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: DIMENSIONS.spacing.md,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.onSurface,
    marginBottom: DIMENSIONS.spacing.md,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
  },
}); 