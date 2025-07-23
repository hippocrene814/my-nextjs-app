import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Avatar } from '../components/Avatar';
import { COLORS } from '@museum-app/shared/theme/colors';
import { DIMENSIONS, TYPOGRAPHY, SHADOWS } from '../constants/theme';
import { Museum } from '@museum-app/shared';
import { TopBar } from '../components/TopBar';
import { saveUserMuseum, getUserMuseum } from '../lib/userMuseums';
import { useAuth } from '../AuthContext';
import { Snackbar } from 'react-native-paper';
import LeftArrowIcon from '../assets/icons/left-arrow.png';
import StarOutlinedIcon from '../assets/icons/star-outlined.png';
import StarFilledIcon from '../assets/icons/star-filled.png';

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
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [initial, setInitial] = useState({ wish: false, visited: false, notes: '' });

  useEffect(() => {
    let isMounted = true;
    const fetchUserMuseum = async () => {
      if (!user || !museum?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const doc = await getUserMuseum(user.email!, museum.id);
      if (isMounted && doc) {
        setWishToVisit(!!doc.wish);
        setVisited(!!doc.visited);
        setNotes(doc.notes || '');
        setInitial({ wish: !!doc.wish, visited: !!doc.visited, notes: doc.notes || '' });
      } else if (isMounted) {
        setInitial({ wish: false, visited: false, notes: '' });
      }
      setLoading(false);
    };
    fetchUserMuseum();
    return () => { isMounted = false; };
  }, [user, museum?.id]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Define the back button once for reuse
  const backButton = (
    <TouchableOpacity style={[styles.backButton, { backgroundColor: 'transparent' }]} onPress={handleBackPress}>
      <Image source={LeftArrowIcon} style={{ width: 28, height: 28, tintColor: COLORS.onSurface }} resizeMode="contain" />
    </TouchableOpacity>
  );

  const handleAvatarPress = () => {
    console.log('Avatar pressed');
  };

  const handleWebsitePress = () => {
    if (museum.website) {
      Linking.openURL(museum.website);
    }
  };

  const hasUnsavedChanges =
    wishToVisit !== initial.wish ||
    visited !== initial.visited ||
    notes !== initial.notes;

  const handleSave = async () => {
    if (!user || !museum?.id) return;
    setSaving(true);
    setSaved(false);
    await saveUserMuseum({
      userId: user.email!,
      museumId: museum.id,
      visited,
      wish: wishToVisit,
      notes,
    });
    setInitial({ wish: wishToVisit, visited, notes });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
        <TopBar left={backButton} showLogo={false} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: COLORS.onSurfaceVariant }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <TopBar
        left={backButton}
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
              <TouchableOpacity onPress={() => setWishToVisit(!wishToVisit)}>
                <Image
                  source={wishToVisit ? StarFilledIcon : StarOutlinedIcon}
                  style={{ width: 32, height: 32, tintColor: COLORS.yellow }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
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
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add your thoughts about this museum..."
              placeholderTextColor={COLORS.onSurfaceVariant}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              editable={!saving && !loading}
            />
          </View>

          {/* Save Button */}
          <View style={{ marginTop: 32, alignItems: 'center' }}>
            <TouchableOpacity
              style={{
                backgroundColor: hasUnsavedChanges ? COLORS.primary : COLORS.divider,
                paddingHorizontal: 32,
                paddingVertical: 14,
                borderRadius: 8,
                opacity: saving ? 0.7 : 1,
                minWidth: 120,
                alignItems: 'center',
              }}
              onPress={handleSave}
              disabled={!hasUnsavedChanges || saving}
            >
              {saving ? (
                <ActivityIndicator color={COLORS.onPrimary} />
              ) : (
                <Text style={{ color: hasUnsavedChanges ? COLORS.onPrimary : COLORS.onSurfaceVariant, fontWeight: 'bold' }}>
                  Save
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      {/* Snackbar moved outside ScrollView */}
      <Snackbar
        visible={saved}
        onDismiss={() => setSaved(false)}
        duration={2000}
        style={{ backgroundColor: COLORS.success }}
      >
        Saved!
      </Snackbar>
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
