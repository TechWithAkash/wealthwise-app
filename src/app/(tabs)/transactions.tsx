import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/theme';
import { Text } from '../../components/ui/Text';
import { useAppState } from '../../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from '../../components/Transactions/SearchBar';
import { FilterTabs } from '../../components/Transactions/FilterTabs';
import { StatsSummary } from '../../components/Transactions/StatsSummary';
import { TransactionList } from '../../components/Transactions/TransactionList';
import { Alert } from '../../utils/alert';

export default function TransactionsScreen() {
  const { transactions } = useAppState();
  
  // State elements
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc'); // Top-right icon controls this

  // Filter transactions dynamically
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Compose Category/Type Filter
        const filterVal = selectedFilter.toLowerCase();
        let matchesFilter = true;

        if (filterVal === 'all') {
          matchesFilter = true;
        } else if (filterVal === 'expenses') {
          matchesFilter = tx.type === 'expense';
        } else if (filterVal === 'income') {
          matchesFilter = tx.type === 'income';
        } else {
          // Match standard category name
          matchesFilter = tx.category.toLowerCase() === filterVal;
        }

        // Compose Search Query Filter
        let matchesSearch = true;
        if (searchQuery.trim().length > 0) {
          const query = searchQuery.toLowerCase().trim();
          const matchesTitle = tx.title.toLowerCase().includes(query);
          const matchesCat = tx.category.toLowerCase().includes(query);
          const matchesNotes = tx.notes ? tx.notes.toLowerCase().includes(query) : false;
          matchesSearch = matchesTitle || matchesCat || matchesNotes;
        }

        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => {
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [transactions, selectedFilter, searchQuery, sortOrder]);

  // Calculate dynamic stats from filtered transactions
  const { filteredIncome, filteredExpense } = useMemo(() => {
    let income = 0;
    let expense = 0;

    filteredTransactions.forEach((tx) => {
      if (tx.type === 'income') {
        income += tx.amount;
      } else {
        expense += tx.amount;
      }
    });

    return { filteredIncome: income, filteredExpense: expense };
  }, [filteredTransactions]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    Alert.alert(
      'Transactions Sorted',
      `List is now sorted in ${sortOrder === 'desc' ? 'ascending' : 'descending'} order of date.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {/* Header Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transactions</Text>
        <TouchableOpacity
          style={styles.filterIconButton}
          onPress={toggleSortOrder}
          activeOpacity={0.7}
        >
          <Ionicons
            name={sortOrder === 'desc' ? 'funnel-outline' : 'swap-vertical-outline'}
            size={20}
            color={Colors.light.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Main content wrapped in scrollview */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        
        {/* Horizontal Category Filters list */}
        <FilterTabs
          selectedFilter={selectedFilter}
          onSelectFilter={setSelectedFilter}
        />
        
        {/* Dynamic column Stats summary */}
        <StatsSummary income={filteredIncome} expense={filteredExpense} />
        
        {/* Grouped Day list */}
        <TransactionList list={filteredTransactions} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.light.background,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.text,
  },
  filterIconButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 110, // padding to clear bottom floating tab bar
  },
});
