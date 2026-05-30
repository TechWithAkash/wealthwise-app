import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/theme';
import { Text } from '../ui/Text';
import { useAppState } from '../../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Transaction } from '../../types';

export const RecentTransactions: React.FC = () => {
  const { transactions, categories } = useAppState();
  const router = useRouter();

  // Take the 3 most recent transactions
  const recentList = transactions.slice(0, 3);

  // Helper to map category names to colors and icons
  const getCategoryStyles = (catName: string) => {
    const category = categories.find(c => c.name.toLowerCase() === catName.toLowerCase());
    const baseColor = category ? category.color : '#10B981';
    
    // Generate pastel background based on category
    let bg = '#E6FDF5';
    let icon: any = 'cash-outline';

    switch (catName.toLowerCase()) {
      case 'food':
        bg = '#FFFBEB'; // Gold/yellow
        icon = 'restaurant-outline';
        break;
      case 'transport':
        bg = '#EFF6FF'; // Blue
        icon = 'car-outline';
        break;
      case 'shopping':
        bg = '#FDF2F8'; // Pink
        icon = 'bag-handle-outline';
        break;
      case 'health':
        bg = '#FEF2F2'; // Red
        icon = 'heart-outline';
        break;
      case 'fun':
        bg = '#F5F3FF'; // Purple
        icon = 'happy-outline';
        break;
      case 'income':
        bg = '#E6FDF5'; // Green
        icon = 'wallet-outline';
        break;
      default:
        bg = '#F3F4F6';
        icon = 'receipt-outline';
    }

    return { bg, color: baseColor, icon };
  };

  const formatCurrency = (amount: number, type: 'expense' | 'income') => {
    const sign = type === 'expense' ? '-' : '+';
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
    
    return `${sign}${formatted}`;
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Transactions</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')} activeOpacity={0.7}>
          <Text style={styles.linkText}>See all</Text>
        </TouchableOpacity>
      </View>

      {recentList.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={32} color={Colors.light.textMuted} />
          <Text style={styles.emptyStateText}>No recent transactions yet.</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {recentList.map((tx: Transaction) => {
            const stylesObj = getCategoryStyles(tx.category);
            const isExpense = tx.type === 'expense';
            
            return (
              <View key={tx.id} style={styles.itemRow}>
                {/* Left Category Avatar Badge */}
                <View style={[styles.avatarBadge, { backgroundColor: stylesObj.bg }]}>
                  <Ionicons name={stylesObj.icon} size={20} color={stylesObj.color} />
                </View>

                {/* Middle Info Block */}
                <View style={styles.infoContainer}>
                  <Text style={styles.itemTitle} numberOfLines={1}>
                    {tx.title}
                  </Text>
                  <Text style={styles.itemSubtitle}>
                    {tx.category} • {formatTime(tx.date)}
                  </Text>
                </View>

                {/* Right Amount block */}
                <Text
                  style={[
                    styles.amountText,
                    isExpense ? styles.amountExpense : styles.amountIncome,
                  ]}
                >
                  {formatCurrency(tx.amount, tx.type)}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.huge,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
  },
  linkText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  list: {
    gap: Spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
  },
  avatarBadge: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  itemSubtitle: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  amountText: {
    fontSize: 14,
    fontWeight: '700',
  },
  amountExpense: {
    color: Colors.light.expense,
  },
  amountIncome: {
    color: Colors.light.income,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    gap: Spacing.xs,
  },
  emptyStateText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
});
export default RecentTransactions;
