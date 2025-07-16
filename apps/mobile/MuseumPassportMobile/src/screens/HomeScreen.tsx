import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { TopBar } from '../components/TopBar';
import { COLORS, DIMENSIONS, TYPOGRAPHY, STRINGS } from '../constants/theme';
import { fetchMuseums } from '@museum-app/shared';

export const HomeScreen: React.FC = () => {
  const [fetchStatus, setFetchStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLoginPress = () => {
    console.log('Login pressed');
  };

  const handleAvatarPress = () => {
    console.log('Avatar pressed');
  };

  // Test shared package integration
  useEffect(() => {
    console.log('🔗 Testing shared package integration...');
    setFetchStatus('loading');
    fetchMuseums(0)
      .then((result) => {
        console.log('✅ fetchMuseums result:', result);
        setFetchStatus('success');
      })
      .catch((err) => {
        console.error('❌ fetchMuseums error:', err);
        setErrorMsg(err.message || 'Unknown error');
        setFetchStatus('error');
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TopBar
        onLoginPress={handleLoginPress}
        onAvatarPress={handleAvatarPress}
        isLoggedIn={false}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{STRINGS.home}</Text>
        <Text style={styles.subtitle}>Museum list will go here</Text>
        
        {/* Shared package test status */}
        <View style={styles.testContainer}>
          <Text style={styles.testTitle}>Shared Package Test:</Text>
          <Text style={styles.testStatus}>Status: {fetchStatus}</Text>
          {fetchStatus === 'error' && (
            <Text style={styles.testError}>Error: {errorMsg}</Text>
          )}
          <Text style={styles.testNote}>Check console for detailed logs</Text>
        </View>
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
    marginBottom: DIMENSIONS.spacing.xl,
  },
  testContainer: {
    backgroundColor: COLORS.surface,
    padding: DIMENSIONS.spacing.md,
    borderRadius: DIMENSIONS.borderRadius.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    alignItems: 'center',
  },
  testTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.onSurface,
    marginBottom: DIMENSIONS.spacing.sm,
  },
  testStatus: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.onSurfaceVariant,
    marginBottom: DIMENSIONS.spacing.xs,
  },
  testError: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.error,
    marginBottom: DIMENSIONS.spacing.xs,
    textAlign: 'center',
  },
  testNote: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.onSurfaceVariant,
    fontStyle: 'italic',
  },
}); 