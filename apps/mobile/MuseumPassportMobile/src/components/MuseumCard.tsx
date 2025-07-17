import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Museum } from '@museum-app/shared';
import { COLORS, DIMENSIONS, TYPOGRAPHY, SHADOWS } from '../constants/theme';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = screenWidth - (DIMENSIONS.spacing.lg * 2); // More spacing on sides

interface MuseumCardProps {
  museum: Museum;
  onPress?: (museum: Museum) => void;
  style?: any;
}

export const MuseumCard: React.FC<MuseumCardProps> = ({
  museum,
  onPress,
  style,
}) => {
  const handlePress = () => {
    onPress?.(museum);
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {museum.image ? (
          <Image
            source={{ uri: museum.image }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>Museum</Text>
          </View>
        )}
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.7)']}
          style={styles.gradient}
        />
        <View style={styles.textContainer}>
          <Text style={styles.museumName} numberOfLines={2}>
            {museum.name}
          </Text>
          {museum.city && (
            <Text style={styles.cityName} numberOfLines={1}>
              {museum.city}
              {museum.country && `, ${museum.country}`}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    height: DIMENSIONS.cardHeight,
    marginHorizontal: DIMENSIONS.spacing.lg,
    marginVertical: DIMENSIONS.spacing.sm,
    ...SHADOWS.elevation[2],
  },
  imageContainer: {
    flex: 1,
    borderRadius: DIMENSIONS.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceVariant,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  textContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: DIMENSIONS.spacing.md,
  },
  museumName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.onPrimary,
    lineHeight: TYPOGRAPHY.fontSize.lg * TYPOGRAPHY.lineHeight.tight,
    marginBottom: DIMENSIONS.spacing.xs,
  },
  cityName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    color: COLORS.onPrimary,
    opacity: 0.9,
    lineHeight: TYPOGRAPHY.fontSize.md * TYPOGRAPHY.lineHeight.normal,
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
}); 