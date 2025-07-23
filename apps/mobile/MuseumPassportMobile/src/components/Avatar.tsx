import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { COLORS } from '@museum-app/shared/theme/colors';
import { DIMENSIONS, TYPOGRAPHY } from '../constants/theme';

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg';
  isLoggedIn?: boolean;
  onPress?: () => void;
  style?: any;
}

export const Avatar: React.FC<AvatarProps> = ({
  size = 'md',
  isLoggedIn = false,
  onPress,
  style,
}) => {
  const avatarSize = DIMENSIONS.avatarSize[size];
  
  if (isLoggedIn) {
    return (
      <TouchableOpacity
        style={[
          styles.container,
          { width: avatarSize, height: avatarSize },
          style,
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={[styles.avatar, { width: avatarSize, height: avatarSize }]}>
          <Text style={[styles.avatarText, { fontSize: avatarSize * 0.4 }]}>
            ��
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { width: avatarSize, height: avatarSize },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.placeholder, { width: avatarSize, height: avatarSize }]}>
        <Text style={[styles.placeholderText, { fontSize: avatarSize * 0.4 }]}>
          👤
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  avatarText: {
    color: COLORS.onPrimary,
  },
  placeholder: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  placeholderText: {
    color: COLORS.onSurfaceVariant,
  },
});
