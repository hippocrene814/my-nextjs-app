import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { TopBar } from '../components/TopBar';
import { COLORS, DIMENSIONS, TYPOGRAPHY, STRINGS } from '../constants/theme';
import { useAuth } from '../AuthContext';
import { getAllUserMuseums } from '../lib/userMuseums';
import { fetchMuseumsByIds } from '@museum-app/shared/api/museums';
import { Museum } from '@museum-app/shared/models/Museum';
import { MuseumCard } from '../components/MuseumCard';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Main: undefined;
  MuseumDetail: { museum: Museum };
};

const PAGE_SIZE = 10;

export const VisitedScreen: React.FC = () => {
  const { user } = useAuth();
  const [visitedIds, setVisitedIds] = useState<string[]>([]);
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Main'>>();

  const pagedMuseums = museums.slice(0, page * PAGE_SIZE);
  const canLoadMore = pagedMuseums.length < museums.length;

  const loadVisitedMuseums = useCallback(async (isRefresh = false) => {
    if (!user?.email) return;
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError(null);
    try {
      const userMuseums = await getAllUserMuseums(user.email);
      const ids = userMuseums.filter(um => um.visited).map(um => um.museum_id);
      const uniqueIds = Array.from(new Set(ids));
      setVisitedIds(uniqueIds);
      if (uniqueIds.length > 0) {
        const museumsData = await fetchMuseumsByIds(uniqueIds);
        setMuseums(museumsData);
      } else {
        setMuseums([]);
      }
      setPage(1);
    } catch (err) {
      setError('Failed to load visited museums.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, museums.length, page]);

  useEffect(() => {
    loadVisitedMuseums();
  }, [loadVisitedMuseums]);

  const handleRefresh = useCallback(() => {
    loadVisitedMuseums(true);
  }, [loadVisitedMuseums]);

  const handleLoadMore = useCallback(() => {
    if (pagedMuseums.length < museums.length) {
      setPage(prev => prev + 1);
    }
  }, [museums.length, pagedMuseums.length]);

  const handleLoginPress = () => {
    console.log('Login pressed');
  };

  const handleAvatarPress = () => {
    console.log('Avatar pressed');
  };

  const handleMuseumPress = (museum: Museum) => {
    navigation.navigate('MuseumDetail', { museum });
  };

  const renderMuseumCard = ({ item }: { item: Museum }) => (
    <MuseumCard museum={item} onPress={handleMuseumPress} />
  );

  const renderFooter = () => {
    if (!canLoadMore) return null;
    return (
      <View style={styles.loadingMoreContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.loadingMoreText}>{STRINGS.loadMore || 'Load More'}</Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>{STRINGS.noResults || 'No museums found'}</Text>
        <Text style={styles.emptySubtitle}>
          {error ? STRINGS.error : "You haven't marked any museums as visited yet."}
        </Text>
        {error && (
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderHeader = () => (
    <Text style={styles.title}>{STRINGS.visited}</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TopBar
        onLoginPress={handleLoginPress}
        onAvatarPress={handleAvatarPress}
        isLoggedIn={!!user}
      />
      {loading && museums.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>{STRINGS.loading || 'Loading museums...'}</Text>
        </View>
      ) : (
        <FlatList
          data={pagedMuseums}
          renderItem={renderMuseumCard}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingTop: DIMENSIONS.spacing.md,
    paddingBottom: DIMENSIONS.spacing.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.onSurface,
    marginBottom: DIMENSIONS.spacing.md,
    paddingHorizontal: DIMENSIONS.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.onSurfaceVariant,
    marginTop: DIMENSIONS.spacing.md,
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: DIMENSIONS.spacing.md,
  },
  loadingMoreText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.onSurfaceVariant,
    marginLeft: DIMENSIONS.spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: DIMENSIONS.spacing.md,
    paddingTop: 64,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.onSurface,
    marginBottom: DIMENSIONS.spacing.sm,
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: DIMENSIONS.spacing.md,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: DIMENSIONS.borderRadius.md,
    paddingHorizontal: DIMENSIONS.spacing.lg,
    paddingVertical: DIMENSIONS.spacing.sm,
    marginTop: DIMENSIONS.spacing.md,
  },
  retryButtonText: {
    color: COLORS.onPrimary,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    fontSize: TYPOGRAPHY.fontSize.md,
  },
}); 