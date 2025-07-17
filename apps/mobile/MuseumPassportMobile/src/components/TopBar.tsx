import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { COLORS, DIMENSIONS, TYPOGRAPHY, STRINGS } from '../constants/theme';
import { Avatar } from './Avatar';

interface TopBarProps {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  showLogo?: boolean;
  showAvatar?: boolean;
  onLoginPress?: () => void;
  onAvatarPress?: () => void;
  userAvatar?: string;
  isLoggedIn?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  left,
  center,
  right,
  showLogo = true,
  showAvatar = true,
  onLoginPress,
  onAvatarPress,
  userAvatar,
  isLoggedIn = false,
}) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      {/* Left section */}
      <View style={styles.leftSection}>
        {left}
      </View>
      {/* Center section */}
      <View style={styles.centerSection}>
        {center ? center : showLogo && <Text style={styles.logoText}>🏛️</Text>}
      </View>
      {/* Right section */}
      <View style={styles.rightSection}>
        {right ? right : showAvatar && (
          <Avatar
            size="md"
            isLoggedIn={isLoggedIn}
            onPress={isLoggedIn ? onAvatarPress : onLoginPress}
          />
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
  leftSection: {
    width: DIMENSIONS.avatarSize.md + 24, // enough for back button or empty
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  logoText: {
    fontSize: DIMENSIONS.iconSize.lg,
    marginRight: DIMENSIONS.spacing.xs,
  },
  rightSection: {
    width: DIMENSIONS.avatarSize.md,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
