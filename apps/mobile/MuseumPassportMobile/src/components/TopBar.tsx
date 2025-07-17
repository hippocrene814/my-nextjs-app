import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { COLORS, DIMENSIONS, TYPOGRAPHY, STRINGS } from '../constants/theme';
import { Avatar } from './Avatar';
import { useAuth } from '../AuthContext';
import { useState } from 'react';
import { Modal, TouchableOpacity, Image } from 'react-native';

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
  // Deprecated props, now handled by AuthContext
}) => {
  const { user, signInWithGoogle, signOut } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

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
          user ? (
            <>
              <TouchableOpacity onPress={() => setMenuVisible(true)}>
                {user.photoURL ? (
                  <Image
                    source={{ uri: user.photoURL }}
                    style={{ width: DIMENSIONS.avatarSize.md, height: DIMENSIONS.avatarSize.md, borderRadius: DIMENSIONS.avatarSize.md / 2 }}
                  />
                ) : (
                  <Avatar size="md" isLoggedIn={true} />
                )}
              </TouchableOpacity>
              <Modal
                visible={menuVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
              >
                <TouchableOpacity style={{ flex: 1 }} onPress={() => setMenuVisible(false)}>
                  <View style={{ position: 'absolute', top: 50, right: 16, backgroundColor: COLORS.surface, borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}>
                    <TouchableOpacity onPress={() => { setMenuVisible(false); signOut(); }} style={{ padding: 16 }}>
                      <Text style={{ color: COLORS.error, fontWeight: 'bold' }}>Sign out</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Modal>
            </>
          ) : (
            <Avatar size="md" isLoggedIn={false} onPress={signInWithGoogle} />
          )
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
