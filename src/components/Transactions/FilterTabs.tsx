import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/theme';
import { Text } from '../ui/Text';

export interface FilterTabsProps {
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({
  selectedFilter,
  onSelectFilter,
}) => {
  // Tabs to display based on categories and transactional types
  const tabs = [
    'All',
    'Expenses',
    'Income',
    'Food',
    'Transport',
    'Shopping',
    'Health',
    'Fun',
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {tabs.map((tab) => {
        const isActive = selectedFilter.toLowerCase() === tab.toLowerCase();
        
        return (
          <TouchableOpacity
            key={tab}
            onPress={() => onSelectFilter(tab)}
            style={[
              styles.tabPill,
              isActive ? styles.tabActive : styles.tabInactive,
            ]}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabLabel,
                isActive ? styles.labelActive : styles.labelInactive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  tabPill: {
    paddingHorizontal: Spacing.lg,
    height: 36,
    borderRadius: BorderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  tabActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  tabInactive: {
    backgroundColor: Colors.light.accentLight,
    borderColor: Colors.light.cardBorder,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  labelActive: {
    color: '#FFFFFF',
  },
  labelInactive: {
    color: Colors.light.textSecondary,
  },
});
export default FilterTabs;
