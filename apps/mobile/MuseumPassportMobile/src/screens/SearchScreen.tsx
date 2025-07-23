import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, FlatList, Keyboard, Platform, StatusBar, Image } from 'react-native';
import { TopBar } from '../components/TopBar';
import { COLORS } from '@museum-app/shared/theme/colors';
import { DIMENSIONS, TYPOGRAPHY, STRINGS } from '../constants/theme';
import { fetchMuseumsTypeahead, fetchMuseumsSearch } from '@museum-app/shared/api/museums';
import { Museum } from '@museum-app/shared/models/Museum';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HouseIcon from '../assets/icons/house.png';
import LeftArrowIcon from '../assets/icons/left-arrow.png';
import CrossIcon from '../assets/icons/cross.png';

type RootStackParamList = {
  Main: undefined;
  MuseumDetail: { museum: Museum };
};

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Main'>>();
  const [query, setQuery] = useState('');
  const [typeahead, setTypeahead] = useState<Museum[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Museum[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchOffset, setSearchOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleClear = () => {
    setQuery('');
    setTypeahead([]);
    setSearchResults([]);
    setSearchError(null);
    setSearchOffset(0);
    setHasMore(false);
    inputRef.current?.focus();
  };

  const handleInputChange = (text: string) => {
    setQuery(text);
    setSearchResults([]);
    setSearchError(null);
    setSearchOffset(0);
    setHasMore(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!text.trim()) {
      setTypeahead([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await fetchMuseumsTypeahead(text);
        setTypeahead(results);
      } catch {
        setTypeahead([]);
      } finally {
        setLoading(false);
      }
    }, 250);
  };

  const handleTypeaheadSelect = async (item: Museum) => {
    setQuery(item.name);
    setTypeahead([]);
    inputRef.current?.blur();
    navigation.navigate('MuseumDetail', { museum: item });
    // Optionally, also perform a search: await performSearch(item.name, 0, true);
  };

  const handleSearchResultPress = (museum: Museum) => {
    navigation.navigate('MuseumDetail', { museum });
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setTypeahead([]);
    inputRef.current?.blur();
    await performSearch(query, 0, true);
  };

  const performSearch = async (q: string, offset = 0, reset = false) => {
    setSearching(true);
    setSearchError(null);
    if (reset) setSearchResults([]);
    try {
      const { museums, hasMore } = await fetchMuseumsSearch(q, offset);
      setSearchResults(prev => (offset === 0 ? museums : [...prev, ...museums]));
      setHasMore(hasMore);
      setSearchOffset(offset + museums.length);
    } catch (err: any) {
      setSearchError(err.message || 'Failed to fetch search results');
      setHasMore(false);
    } finally {
      setSearching(false);
    }
  };

  const handleLoadMore = async () => {
    if (!hasMore || searching) return;
    await performSearch(query, searchOffset, false);
  };

  const renderTypeaheadItem = ({ item }: { item: Museum }) => (
    <TouchableOpacity style={styles.typeaheadItem} onPress={() => handleTypeaheadSelect(item)}>
      <Text style={styles.typeaheadName}>{item.name}</Text>
      <Text style={styles.typeaheadCity}>{item.city || ''}</Text>
    </TouchableOpacity>
  );

  const renderSearchResultItem = ({ item }: { item: Museum }) => (
    <TouchableOpacity style={styles.resultItem} onPress={() => handleSearchResultPress(item)}>
      <View style={styles.resultImageWrapper}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.resultImage} />
        ) : (
          <Image source={HouseIcon} style={styles.resultIconPlaceholder} resizeMode="contain" />
        )}
      </View>
      <View style={styles.resultTextContainer}>
        <Text style={styles.resultName}>{item.name}</Text>
        <Text style={styles.resultCity}>{item.city || ''}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.searchBarContainer, { paddingTop: Platform.select({ android: StatusBar.currentHeight, ios: 0, default: 0 }) }]}>
        <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
          <Image source={LeftArrowIcon} style={styles.iconImage} resizeMode="contain" />
        </TouchableOpacity>
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder="What are you looking for?"
          value={query}
          onChangeText={handleInputChange}
          autoFocus
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.iconButton}>
            <Image source={CrossIcon} style={styles.iconImage} resizeMode="contain" />
          </TouchableOpacity>
        )}
      </View>
      {typeahead.length > 0 && !searching && !searchResults.length ? (
        <FlatList
          data={typeahead}
          keyExtractor={item => item.id}
          renderItem={renderTypeaheadItem}
          keyboardShouldPersistTaps="handled"
          style={styles.typeaheadList}
          ListEmptyComponent={query && !loading ? <Text style={styles.emptyText}>No results</Text> : null}
        />
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={item => item.id}
          renderItem={renderSearchResultItem}
          keyboardShouldPersistTaps="handled"
          style={styles.resultsList}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          ListEmptyComponent={searching ? <Text style={styles.emptyText}>Searching...</Text> : searchError ? <Text style={styles.emptyText}>{searchError}</Text> : query && !searching ? <Text style={styles.emptyText}>No results</Text> : null}
          ListFooterComponent={hasMore && !searching ? <Text style={styles.loadingMoreText}>Loading more...</Text> : null}
        />
      )}
    </SafeAreaView>
  );
};

const IMAGE_SIZE = 56;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DIMENSIONS.spacing.md,
    paddingVertical: DIMENSIONS.spacing.sm,
    backgroundColor: COLORS.background,
  },
  iconButton: {
    padding: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.onSurface,
    backgroundColor: 'transparent',
    paddingHorizontal: DIMENSIONS.spacing.sm,
    paddingVertical: DIMENSIONS.spacing.sm,
  },
  typeaheadList: {
    flex: 1,
    paddingHorizontal: DIMENSIONS.spacing.md,
  },
  typeaheadItem: {
    paddingVertical: DIMENSIONS.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  typeaheadName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.onSurface,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  typeaheadCity: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.onSurfaceVariant,
    marginTop: 32,
    fontSize: TYPOGRAPHY.fontSize.md,
  },
  iconText: {
    fontSize: 24,
    color: COLORS.onSurface,
    paddingHorizontal: 2,
  },
  resultsList: {
    flex: 1,
    paddingHorizontal: DIMENSIONS.spacing.md,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: DIMENSIONS.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  resultImageWrapper: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    overflow: 'hidden',
    marginRight: DIMENSIONS.spacing.md,
    backgroundColor: COLORS.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    resizeMode: 'cover',
  },
  resultIconPlaceholder: {
    width: IMAGE_SIZE * 0.6,
    height: IMAGE_SIZE * 0.6,
    tintColor: COLORS.onSurfaceVariant,
  },
  resultTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  resultName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.onSurface,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  resultCity: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  loadingMoreText: {
    textAlign: 'center',
    color: COLORS.onSurfaceVariant,
    marginVertical: 16,
    fontSize: TYPOGRAPHY.fontSize.md,
  },
  iconImage: {
    width: 24,
    height: 24,
    tintColor: COLORS.onSurface,
  },
}); 