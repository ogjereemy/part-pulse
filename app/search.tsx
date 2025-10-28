
import { ThemedText } from '@/components/themed-text';
import { useDebounce } from '@/hooks/useDebounce';
import { getSuggestions, search } from '@/services/searchService';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();

  const { data: suggestions, isLoading: isLoadingSuggestions } = useQuery({
    queryKey: ['searchSuggestions', debouncedQuery],
    queryFn: () => getSuggestions(debouncedQuery),
    enabled: debouncedQuery.length > 1,
  });

  const { data: results, isLoading: isLoadingResults, refetch } = useQuery({
    queryKey: ['searchResults', query],
    queryFn: () => search(query),
    enabled: false, // Only run when refetch is called
  });

  const handleSearchSubmit = () => {
    refetch();
  };

  const renderSuggestionItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.suggestionItem}
      onPress={() => {
        if (item.type === 'user') {
          router.push({ pathname: '/(tabs)/profile/[id]' as any, params: { id: item.id } });
        } else if (item.type === 'event') {
          router.push({ pathname: '/event/[id]', params: { id: item.id } });
        }
      }}
    >
        <LinearGradient colors={['#FF3CA6', '#8A2BE2']} style={styles.suggestionBorder} />
        <ThemedText>{item.name}</ThemedText>
    </TouchableOpacity>
  );

  const renderResultItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
        style={styles.resultItem}
        onPress={() => {
            if (item.type === 'user') {
            router.push({ pathname: '/(tabs)/profile/[id]' as any, params: { id: item.id } });
            } else if (item.type === 'event') {
            router.push({ pathname: '/event/[id]', params: { id: item.id } });
            }
        }}
    >
        <ThemedText style={styles.resultTitle}>{item.name}</ThemedText>
        <ThemedText style={styles.resultType}>{item.type}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
        <View style={styles.searchInputContainer}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search for users, events..."
                placeholderTextColor="#A0A0A0"
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSearchSubmit}
                selectionColor={'#FF3CA6'}
            />
        </View>
      {isLoadingSuggestions && <ActivityIndicator />}
      {suggestions && suggestions.length > 0 && (
        <FlatList
            data={suggestions}
            renderItem={renderSuggestionItem}
            keyExtractor={(item) => item.id}
            style={styles.suggestionList}
        />
      )}
      {isLoadingResults && <ActivityIndicator />}
      {results && results.length > 0 && (
        <ScrollView style={styles.resultList}>
            {results.map((item: any) => renderResultItem({ item }))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E0E',
    padding: 20,
  },
  searchInputContainer: {
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: '#1A1A1A',
    color: 'white',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  suggestionList: {
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  suggestionBorder: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 12,
  },
  resultList: {
      marginTop: 20,
  },
  resultItem: {
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#FF3CA6',
  },
  resultTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
  },
  resultType: {
      fontSize: 14,
      color: '#A0A0A0',
      marginTop: 5,
  }
});
