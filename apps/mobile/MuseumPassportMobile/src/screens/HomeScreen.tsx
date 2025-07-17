import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  FlatList, 
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TopBar } from '../components/TopBar';
import { MuseumCard } from '../components/MuseumCard';
import { COLORS, DIMENSIONS, TYPOGRAPHY, STRINGS } from '../constants/theme';
import { fetchMuseums, Museum } from '@museum-app/shared';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const handleLoginPress = () => {
    console.log('Login pressed');
  };

  const handleAvatarPress = () => {
    console.log('Avatar pressed');
  };

  const loadMuseums = useCallback(async (offset = 0, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
        setError(null);
      } else if (offset === 0) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const result = await fetchMuseums(offset);
      
      if (isRefresh || offset === 0) {
        setMuseums(result.museums);
      } else {
        setMuseums(prev => [...prev, ...result.museums]);
      }
      
      setHasMore(result.hasMore);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('❌ fetchMuseums error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadMuseums(0);
  }, [loadMuseums]);

  const handleRefresh = useCallback(() => {
    loadMuseums(0, true);
  }, [loadMuseums]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      loadMuseums(museums.length);
    }
  }, [loadingMore, hasMore, loading, museums.length, loadMuseums]);

  const handleMuseumPress = (museum: Museum) => {
    console.log('Museum pressed:', museum.name);
    navigation.navigate('MuseumDetail', { museum });
  };

  const renderMuseumCard = ({ item }: { item: Museum }) => (
    <MuseumCard
      museum={item}
      onPress={handleMuseumPress}
    />
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.loadingMoreContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.loadingMoreText}>Loading more museums...</Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No museums found</Text>
        <Text style={styles.emptySubtitle}>
          {error ? 'Try refreshing to load museums' : 'Check back later for new museums'}
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
    <Text style={styles.title}>{STRINGS.home}</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TopBar
        onLoginPress={handleLoginPress}
        onAvatarPress={handleAvatarPress}
        isLoggedIn={false}
      />
      
      {loading && museums.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading museums...</Text>
        </View>
      ) : (
        <FlatList
          data={museums}
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: DIMENSIONS.spacing.lg,
  },
  loadingMoreText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.onSurfaceVariant,
    marginLeft: DIMENSIONS.spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: DIMENSIONS.spacing.lg,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.onSurface,
    marginBottom: DIMENSIONS.spacing.sm,
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: DIMENSIONS.spacing.lg,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: DIMENSIONS.spacing.lg,
    paddingVertical: DIMENSIONS.spacing.md,
    borderRadius: DIMENSIONS.borderRadius.md,
  },
  retryButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.onPrimary,
  },
});
