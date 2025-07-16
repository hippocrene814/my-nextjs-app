import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { COLORS, DIMENSIONS, TYPOGRAPHY, STRINGS, SHADOWS } from '../constants/theme';

interface TopBarProps {
  onLoginPress?: () => void;
  onAvatarPress?: () => void;
  userAvatar?: string;
  isLoggedIn?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  onLoginPress,
  onAvatarPress,
  userAvatar,
  isLoggedIn = false,
}) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      {/* Left spacer for centering */}
      <View style={styles.spacer} />
      
      {/* Center logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>🏛️</Text>
        {/* <Text style={styles.appName}>{STRINGS.appName}</Text> */}
      </View>
      
      {/* Right user section */}
      <View style={styles.userSection}>
        {isLoggedIn ? (
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={onAvatarPress}
            activeOpacity={0.7}
          >
            {userAvatar ? (
              <Text style={styles.avatarText}>👤</Text>
            ) : (
              <Text style={styles.avatarText}>👤</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.avatarPlaceholder}
            onPress={onLoginPress}
            activeOpacity={0.7}
          >
            {/* TODO: Replace with actual placeholder image */}
            {/* Upload placeholder image to: apps/mobile/MuseumPassportMobile/src/assets/images/avatar-placeholder.png */}
            <Text style={styles.avatarPlaceholderText}>👤</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: DIMENSIONS.topBarHeight + (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    paddingHorizontal: DIMENSIONS.spacing.md,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  spacer: {
    width: DIMENSIONS.avatarSize.md,
  },
  logoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: DIMENSIONS.iconSize.lg,
    marginRight: DIMENSIONS.spacing.xs,
  },
  appName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.onSurface,
  },
  userSection: {
    width: DIMENSIONS.avatarSize.md,
    alignItems: 'flex-end',
  },
  avatarContainer: {
    width: DIMENSIONS.avatarSize.md,
    height: DIMENSIONS.avatarSize.md,
    borderRadius: DIMENSIONS.avatarSize.md / 2,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.elevation[1],
  },
  avatarText: {
    fontSize: DIMENSIONS.iconSize.md,
  },
  avatarPlaceholder: {
    width: DIMENSIONS.avatarSize.md,
    height: DIMENSIONS.avatarSize.md,
    borderRadius: DIMENSIONS.avatarSize.md / 2,
    backgroundColor: COLORS.surfaceVariant,
    borderWidth: 1,
    borderColor: COLORS.divider,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.elevation[1],
  },
  avatarPlaceholderText: {
    fontSize: DIMENSIONS.iconSize.md,
    color: COLORS.onSurfaceVariant,
  },
  loginButton: {
    paddingHorizontal: DIMENSIONS.spacing.md,
    paddingVertical: DIMENSIONS.spacing.xs,
    borderRadius: DIMENSIONS.borderRadius.md,
    backgroundColor: COLORS.primary,
  },
  loginText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.onPrimary,
  },
}); 