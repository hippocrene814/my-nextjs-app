import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { COLORS, DIMENSIONS, TYPOGRAPHY, STRINGS } from '../constants/theme';
import { Avatar } from './Avatar';

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
        <Avatar
          size="md"
          isLoggedIn={isLoggedIn}
          onPress={isLoggedIn ? onAvatarPress : onLoginPress}
        />
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
});
