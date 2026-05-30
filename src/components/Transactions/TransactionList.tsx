import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/theme';
import { Text } from '../ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '../../types';
import { useAppState } from '../../context/AppContext';
import { Alert } from '../../utils/alert';

export interface TransactionListProps {
  list: Transaction[];
}

export const TransactionList: React.FC<TransactionListProps> = ({ list }) => {
  const { categories, deleteTransaction } = useAppState();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Group transactions by date
  const groupTransactionsByDate = (txs: Transaction[]) => {
    const groups: { [key: string]: Transaction[] } = {};

    txs.forEach((tx) => {
      const date = new Date(tx.date);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      let groupKey = '';

      if (date.toDateString() === today.toDateString()) {
        groupKey = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = 'Yesterday';
      } else {
        // Format as "Dec 12"
        groupKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(tx);
    });

    return groups;
  };

  const grouped = groupTransactionsByDate(list);

  // Helper to map category names to colors and icons
  const getCategoryStyles = (catName: string) => {
    const category = categories.find((c) => c.name.toLowerCase() === catName.toLowerCase());
    const baseColor = category ? category.color : '#10B981';

    let bg = '#E6FDF5';
    let icon: any = 'cash-outline';

    switch (catName.toLowerCase()) {
      case 'food':
        bg = '#FFFBEB';
        icon = 'restaurant-outline';
        break;
      case 'transport':
        bg = '#EFF6FF';
        icon = 'car-outline';
        break;
      case 'shopping':
        bg = '#FDF2F8';
        icon = 'bag-handle-outline';
        break;
      case 'health':
        bg = '#FEF2F2';
        icon = 'heart-outline';
        break;
      case 'fun':
        bg = '#F5F3FF';
        icon = 'happy-outline';
        break;
      case 'income':
        bg = '#E6FDF5';
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

  const handleDelete = (tx: Transaction) => {
    Alert.alert(
      'Delete Transaction',
      `Are you sure you want to delete "${tx.title}" of amount ${formatCurrency(tx.amount, tx.type)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTransaction(tx.id),
        },
      ]
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (list.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="search-outline" size={48} color={Colors.light.textMuted} />
        <Text style={styles.emptyTitle}>No Transactions Found</Text>
        <Text style={styles.emptySubtitle}>Try searching for a different keyword or category.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Object.keys(grouped).map((groupKey) => (
        <View key={groupKey} style={styles.groupContainer}>
          {/* Day Group Header */}
          <View style={styles.groupHeaderRow}>
            <Text style={styles.groupHeaderText}>{groupKey}</Text>
            {groupKey === 'Today' && <Text style={styles.groupHeaderDate}>Dec 14</Text>}
            {groupKey === 'Yesterday' && <Text style={styles.groupHeaderDate}>Dec 13</Text>}
          </View>

          {/* List of items in Day Group */}
          <View style={styles.itemList}>
            {grouped[groupKey].map((tx: Transaction) => {
              const stylesObj = getCategoryStyles(tx.category);
              const isExpense = tx.type === 'expense';
              const isExpanded = expandedId === tx.id;

              return (
                <View key={tx.id} style={styles.itemWrapper}>
                  <TouchableOpacity
                    onPress={() => toggleExpand(tx.id)}
                    onLongPress={() => handleDelete(tx)}
                    activeOpacity={0.7}
                    style={styles.itemRow}
                  >
                    {/* Category Icon Badge */}
                    <View style={[styles.avatarBadge, { backgroundColor: stylesObj.bg }]}>
                      <Ionicons name={stylesObj.icon} size={20} color={stylesObj.color} />
                    </View>

                    {/* Middle Block */}
                    <View style={styles.infoContainer}>
                      <Text style={styles.itemTitle}>{tx.title}</Text>
                      <Text style={styles.itemSubtitle}>
                        {tx.category} • {formatTime(tx.date)}
                      </Text>
                    </View>

                    {/* Right Block (Amount & Delete button) */}
                    <View style={styles.rightContainer}>
                      <Text
                        style={[
                          styles.amountText,
                          isExpense ? styles.amountExpense : styles.amountIncome,
                        ]}
                      >
                        {formatCurrency(tx.amount, tx.type)}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleDelete(tx)}
                        style={styles.deleteButton}
                        activeOpacity={0.6}
                      >
                        <Ionicons name="trash-outline" size={16} color={Colors.light.expense} />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>

                  {/* Expanded detail box (notes & accounts info) */}
                  {isExpanded && (
                    <View style={styles.expandedDetails}>
                      <Text style={styles.detailsLabel}>
                        Account: <Text style={styles.detailsValue}>{tx.account}</Text>
                      </Text>
                      {tx.notes ? (
                        <Text style={styles.detailsLabel}>
                          Note: <Text style={styles.detailsValue}>{tx.notes}</Text>
                        </Text>
                      ) : null}
                      <Text style={styles.tipsText}>* Long press this item to delete directly</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xl,
  },
  groupContainer: {
    gap: Spacing.sm,
  },
  groupHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  groupHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  groupHeaderDate: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  itemList: {
    gap: Spacing.sm,
  },
  itemWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
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
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
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
  deleteButton: {
    padding: Spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedDetails: {
    backgroundColor: Colors.light.background,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.light.cardBorder,
    gap: 4,
  },
  detailsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  detailsValue: {
    fontWeight: '400',
    color: Colors.light.text,
  },
  tipsText: {
    fontSize: 10,
    color: Colors.light.textMuted,
    marginTop: Spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.huge,
    gap: Spacing.sm,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  emptySubtitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
});
export default TransactionList;
