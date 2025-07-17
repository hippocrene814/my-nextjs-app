import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Switch,
  StatusBar,
} from 'react-native';
import { Avatar } from '../components/Avatar';
import { COLORS, DIMENSIONS, TYPOGRAPHY, SHADOWS } from '../constants/theme';
import { Museum } from '@museum-app/shared';
import { TopBar } from '../components/TopBar';
import { saveUserMuseum } from '../lib/userMuseums';

interface MuseumDetailScreenProps {
  route: { params: { museum: Museum } };
  navigation: any;
}

export const MuseumDetailScreen: React.FC<MuseumDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { museum } = route.params;
  const [wishToVisit, setWishToVisit] = useState(false);
  const [visited, setVisited] = useState(false);
  const [notes, setNotes] = useState('');

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleAvatarPress = () => {
    console.log('Avatar pressed');
  };

  const handleWebsitePress = () => {
    if (museum.website) {
      Linking.openURL(museum.website);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <TopBar
        left={
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        }
        showLogo={false}
        isLoggedIn={false}
        onAvatarPress={handleAvatarPress}
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          {museum.image ? (
            <Image source={{ uri: museum.image }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.placeholderImage]}>
              <Text style={styles.placeholderText}>Museum</Text>
            </View>
          )}
        </View>

        {/* Museum Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.museumName}>{museum.name}</Text>
          
          {museum.city && (
            <Text style={styles.location}>
              {museum.city}
              {museum.country && `, ${museum.country}`}
            </Text>
          )}

          {museum.description && (
            <Text style={styles.description} numberOfLines={3}>
              {museum.description}
            </Text>
          )}

          {museum.website && (
            <TouchableOpacity style={styles.websiteButton} onPress={handleWebsitePress}>
              <Text style={styles.websiteText}>{museum.website}</Text>
            </TouchableOpacity>
          )}

          {/* Status Toggles */}
          <View style={styles.statusContainer}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Wish to Visit:</Text>
              <Switch
                value={wishToVisit}
                onValueChange={setWishToVisit}
                trackColor={{ false: COLORS.divider, true: COLORS.secondary }}
                thumbColor={wishToVisit ? COLORS.secondaryDark : COLORS.onSurfaceVariant}
              />
            </View>

            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Visited:</Text>
              <Switch
                value={visited}
                onValueChange={setVisited}
                trackColor={{ false: COLORS.divider, true: COLORS.success }}
                thumbColor={visited ? COLORS.success : COLORS.onSurfaceVariant}
              />
            </View>
          </View>

          {/* Notes Section */}
          <View style={styles.notesContainer}>
            <Text style={styles.notesTitle}>Your Notes / Reflections:</Text>
            <TouchableOpacity style={styles.notesInput}>
              <Text style={styles.notesPlaceholder}>
                {notes || 'Add your thoughts about this museum...'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backButton: {
    paddingHorizontal: DIMENSIONS.spacing.sm,
    paddingVertical: DIMENSIONS.spacing.xs,
    borderRadius: DIMENSIONS.borderRadius.sm,
    backgroundColor: COLORS.surfaceVariant,
  },
  backButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.onSurface,
  },
  backIcon: {
    fontSize: DIMENSIONS.avatarSize.md * 0.6, // visually similar to avatar icon
    color: COLORS.onSurface,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    marginHorizontal: DIMENSIONS.spacing.lg,
    marginVertical: DIMENSIONS.spacing.md,
    borderRadius: DIMENSIONS.borderRadius.lg,
    overflow: 'hidden',
    ...SHADOWS.elevation[2],
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  placeholderImage: {
    backgroundColor: COLORS.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.onSurfaceVariant,
  },
  infoContainer: {
    paddingHorizontal: DIMENSIONS.spacing.lg,
    paddingBottom: DIMENSIONS.spacing.xl,
  },
  museumName: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.onSurface,
    marginBottom: DIMENSIONS.spacing.sm,
  },
  location: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.onSurfaceVariant,
    marginBottom: DIMENSIONS.spacing.md,
  },
  description: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.onSurface,
    lineHeight: TYPOGRAPHY.fontSize.md * TYPOGRAPHY.lineHeight.normal,
    marginBottom: DIMENSIONS.spacing.lg,
  },
  websiteButton: {
    marginBottom: DIMENSIONS.spacing.lg,
  },
  websiteText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  statusContainer: {
    marginBottom: DIMENSIONS.spacing.lg,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: DIMENSIONS.spacing.sm,
  },
  statusLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.onSurface,
  },
  notesContainer: {
    marginTop: DIMENSIONS.spacing.md,
  },
  notesTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.onSurface,
    marginBottom: DIMENSIONS.spacing.sm,
  },
  notesInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: DIMENSIONS.borderRadius.md,
    padding: DIMENSIONS.spacing.md,
    minHeight: 80,
  },
  notesPlaceholder: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.onSurfaceVariant,
    lineHeight: TYPOGRAPHY.fontSize.md * TYPOGRAPHY.lineHeight.normal,
  },
});
