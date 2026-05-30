import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search transactions...',
}) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={20} color={Colors.light.textSecondary} style={styles.searchIcon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.light.textMuted}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} activeOpacity={0.7}>
          <Ionicons name="close-circle" size={18} color={Colors.light.textMuted} style={styles.clearIcon} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: Spacing.lg,
    paddingHorizontal: Spacing.md,
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
    height: '100%',
    padding: 0, // Reset default padding
  },
  clearIcon: {
    marginLeft: Spacing.xs,
  },
});
export default SearchBar;
